// src/app/api/log-lead/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("RECEIVED LEAD DATA:", body);

    const {
      email,
      name,
      utm_source,
      utm_medium,
      utm_campaign,
      gclid,
      gbraid,
      wbraid,
    } = body;

    // Validate required field
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          email,
          name,
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
          gclid: gclid || null,
          gbraid: gbraid || null,
          wbraid: wbraid || null,
          ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
          user_agent: request.headers.get("user-agent") || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("SUPABASE INSERT FAILED:", error);
      return NextResponse.json(
        { success: false, error: "Database error" },
        { status: 500 }
      );
    }

    console.log("LEAD SUCCESSFULLY LOGGED:", data);
    return NextResponse.json({ success: true, lead: data[0] });
  } catch (error) {
    console.error("LOG-LEAD API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}