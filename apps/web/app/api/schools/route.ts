import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, type, userId } = await request.json()

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 })
    }

    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { data: school, error } = await supabase
      .from('schools')
      .insert({
        user_id: session.user.id,
        name: name.trim(),
        type
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create school' }, { status: 500 })
    }

    return NextResponse.json({ success: true, school })

  } catch (error) {
    console.error('School creation error:', error)
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

    const { id, name, type, userId } = await request.json()

    if (!id || !name || !type) {
      return NextResponse.json({ error: 'ID, name and type are required' }, { status: 400 })
    }

    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Verify ownership
    const { data: existingSchool, error: checkError } = await supabase
      .from('schools')
      .select('id')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (checkError || !existingSchool) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 })
    }

    const { data: school, error } = await supabase
      .from('schools')
      .update({
        name: name.trim(),
        type
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update school' }, { status: 500 })
    }

    return NextResponse.json({ success: true, school })

  } catch (error) {
    console.error('School update error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Schools API - POST to create, PUT to update',
    required: {
      POST: ['name', 'type', 'userId'],
      PUT: ['id', 'name', 'type', 'userId']
    }
  })
}