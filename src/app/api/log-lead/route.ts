// src/app/api/log-lead/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("RECEIVED LEAD DATA:", body);

    const { email, name, utm_source, utm_medium, utm_campaign } = body;

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          email,
          name,
          utm_source,
          utm_medium,
          utm_campaign,
          ip_address: request.headers.get("x-forwarded-for") || null,
          user_agent: request.headers.get("user-agent") || null,
        },
      ])
      .select();

    if (error) {
      console.error("SUPABASE INSERT FAILED:", error);
      throw error;
    }

    console.log("LEAD SUCCESSFULLY LOGGED:", data);
    return NextResponse.json({ success: true, lead: data });
  } catch (error) {
    console.error("LOG-LEAD API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log lead" },
      { status: 500 }
    );
  }
}