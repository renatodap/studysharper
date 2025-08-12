import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, courseId } = await request.json()

    if (!name || !courseId) {
      return NextResponse.json({ 
        error: 'Name and course ID are required' 
      }, { status: 400 })
    }

    // Verify course ownership through term and school
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        id,
        terms!inner(
          schools!inner(user_id)
        )
      `)
      .eq('id', courseId)
      .single()

    if (courseError || !course || (course.terms as any).schools.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Get the next order index
    const { data: existingSubjects } = await supabase
      .from('subjects')
      .select('order_index')
      .eq('course_id', courseId)
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrderIndex = existingSubjects && existingSubjects.length > 0 
      ? existingSubjects[0].order_index + 1 
      : 0

    const { data: subject, error } = await supabase
      .from('subjects')
      .insert({
        course_id: courseId,
        name: name.trim(),
        description: description?.trim() || null,
        order_index: nextOrderIndex
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 })
    }

    return NextResponse.json({ success: true, subject })

  } catch (error) {
    console.error('Subject creation error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, name, description } = await request.json()

    if (!id || !name) {
      return NextResponse.json({ 
        error: 'ID and name are required' 
      }, { status: 400 })
    }

    // Verify ownership through course, term, and school
    const { data: existingSubject, error: checkError } = await supabase
      .from('subjects')
      .select(`
        id,
        courses!inner(
          terms!inner(
            schools!inner(user_id)
          )
        )
      `)
      .eq('id', id)
      .single()

    if (checkError || !existingSubject || (existingSubject.courses as any).terms.schools.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    const { data: subject, error } = await supabase
      .from('subjects')
      .update({
        name: name.trim(),
        description: description?.trim() || null
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 })
    }

    return NextResponse.json({ success: true, subject })

  } catch (error) {
    console.error('Subject update error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Subject ID is required' }, { status: 400 })
    }

    // Verify ownership
    const { data: existingSubject, error: checkError } = await supabase
      .from('subjects')
      .select(`
        id,
        courses!inner(
          terms!inner(
            schools!inner(user_id)
          )
        )
      `)
      .eq('id', id)
      .single()

    if (checkError || !existingSubject || (existingSubject.courses as any).terms.schools.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Subject deletion error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Subjects API - POST to create, PUT to update, DELETE to remove',
    required: {
      POST: ['name', 'courseId'],
      PUT: ['id', 'name'],
      DELETE: ['id (query param)']
    }
  })
}