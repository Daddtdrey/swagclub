import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: Request) {
  try {
    // 1. Get the data sent from the frontend
    const { twitterUrl } = await request.json();

    // 2. Validate it
    if (!twitterUrl) {
      return NextResponse.json({ error: 'Twitter URL is required' }, { status: 400 });
    }

    // 3. Insert into Supabase table named 'applications'
    const { data, error } = await supabase
      .from('applications')
      .insert([
        { twitter_url: twitterUrl, status: 'pending' }
      ])
      .select();

    if (error) throw error;

    // 4. Return success
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}