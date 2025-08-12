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

    const { name, code, credits, color, termId } = await request.json()

    if (!name || !termId) {
      return NextResponse.json({ 
        error: 'Name and term ID are required' 
      }, { status: 400 })
    }

    // Verify term ownership through school
    const { data: term, error: termError } = await supabase
      .from('terms')
      .select(`
        id,
        schools!inner(user_id)
      `)
      .eq('id', termId)
      .single()

    if (termError || !term || (term.schools as any).user_id !== session.user.id) {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 })
    }

    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        term_id: termId,
        name: name.trim(),
        code: code?.trim() || null,
        credits: parseInt(credits) || 3,
        color: color || '#3B82F6'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
    }

    return NextResponse.json({ success: true, course })

  } catch (error) {
    console.error('Course creation error:', error)
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

    const { id, name, code, credits, color } = await request.json()

    if (!id || !name) {
      return NextResponse.json({ 
        error: 'ID and name are required' 
      }, { status: 400 })
    }

    // Verify ownership through term and school
    const { data: existingCourse, error: checkError } = await supabase
      .from('courses')
      .select(`
        id,
        terms!inner(
          schools!inner(user_id)
        )
      `)
      .eq('id', id)
      .single()

    if (checkError || !existingCourse || (existingCourse.terms as any).schools.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const { data: course, error } = await supabase
      .from('courses')
      .update({
        name: name.trim(),
        code: code?.trim() || null,
        credits: parseInt(credits) || 3,
        color: color || '#3B82F6'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
    }

    return NextResponse.json({ success: true, course })

  } catch (error) {
    console.error('Course update error:', error)
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
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Verify ownership
    const { data: existingCourse, error: checkError } = await supabase
      .from('courses')
      .select(`
        id,
        terms!inner(
          schools!inner(user_id)
        )
      `)
      .eq('id', id)
      .single()

    if (checkError || !existingCourse || (existingCourse.terms as any).schools.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Course deletion error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Courses API - POST to create, PUT to update, DELETE to remove',
    required: {
      POST: ['name', 'termId'],
      PUT: ['id', 'name'],
      DELETE: ['id (query param)']
    }
  })
}