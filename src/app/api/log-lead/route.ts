// src/app/api/log-lead/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    // --- THE FIX IS HERE ---
    // We get the JSON body directly from the request object
    const { email, name, utm_source, utm_medium, utm_campaign, gclid, gbraid, wbraid } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

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

    // Make sure your table in Supabase is named 'leads'
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) {
      console.error('Supabase error:', error.message);
      throw error;
    }
    
    console.log('Lead successfully logged:', data);
    return NextResponse.json({ message: 'Lead logged successfully', data }, { status: 200 });

  } catch (err: any) {
    console.error('API Error:', err.message);
    return NextResponse.json({ error: 'Failed to log lead', details: err.message }, { status: 500 });
  }
}