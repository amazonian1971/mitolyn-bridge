// src/app/api/log-lead/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
// Make sure these environment variables are set in Vercel!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, utm_source, utm_medium, utm_campaign, gclid, gbraid, wbraid } = body;

    // Validate that email is present
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Prepare the data for Supabase
    const leadData = {
      email,
      name: name || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      gclid: gclid || null,
      gbraid: gbraid || null,
      wbraid: wbraid || null,
    };

    // Insert data into your 'leads' table in Supabase
    // IMPORTANT: Make sure your table in Supabase is named 'leads'
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      // Throw the error to be caught by the outer try-catch block
      throw error;
    }
    
    // Log success for debugging on Vercel
    console.log('Lead successfully logged:', data);

    // Return a success response
    return NextResponse.json({ message: 'Lead logged successfully', data }, { status: 200 });

  } catch (err) {
    // Log the full error for debugging on Vercel
    console.error('API Error:', err);

    // Return a generic error response to the client
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to log lead', details: errorMessage }, { status: 500 });
  }
}