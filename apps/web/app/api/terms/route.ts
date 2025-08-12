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

    const { name, start_date, end_date, active, schoolId } = await request.json()

    if (!name || !start_date || !end_date || !schoolId) {
      return NextResponse.json({ 
        error: 'Name, start date, end date, and school ID are required' 
      }, { status: 400 })
    }

    // Verify school ownership
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('id')
      .eq('id', schoolId)
      .eq('user_id', session.user.id)
      .single()

    if (schoolError || !school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 })
    }

    // If this term is being set as active, deactivate other terms
    if (active) {
      await supabase
        .from('terms')
        .update({ active: false })
        .eq('school_id', schoolId)
    }

    const { data: term, error } = await supabase
      .from('terms')
      .insert({
        school_id: schoolId,
        name: name.trim(),
        start_date,
        end_date,
        active: !!active
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create term' }, { status: 500 })
    }

    return NextResponse.json({ success: true, term })

  } catch (error) {
    console.error('Term creation error:', error)
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

    const { id, name, start_date, end_date, active } = await request.json()

    if (!id || !name || !start_date || !end_date) {
      return NextResponse.json({ 
        error: 'ID, name, start date, and end date are required' 
      }, { status: 400 })
    }

    // Verify ownership through school
    const { data: existingTerm, error: checkError } = await supabase
      .from('terms')
      .select(`
        id,
        school_id,
        schools!inner(user_id)
      `)
      .eq('id', id)
      .single()

    if (checkError || !existingTerm || (existingTerm.schools as any).user_id !== session.user.id) {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 })
    }

    // If this term is being set as active, deactivate other terms in the same school
    if (active) {
      await supabase
        .from('terms')
        .update({ active: false })
        .eq('school_id', existingTerm.school_id)
        .neq('id', id)
    }

    const { data: term, error } = await supabase
      .from('terms')
      .update({
        name: name.trim(),
        start_date,
        end_date,
        active: !!active
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update term' }, { status: 500 })
    }

    return NextResponse.json({ success: true, term })

  } catch (error) {
    console.error('Term update error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Terms API - POST to create, PUT to update',
    required: {
      POST: ['name', 'start_date', 'end_date', 'schoolId'],
      PUT: ['id', 'name', 'start_date', 'end_date']
    }
  })
}