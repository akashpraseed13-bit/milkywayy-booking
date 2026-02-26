import { getSessionUser } from "@/lib/helpers/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json({ 
      hasSession: !!user,
      user: user ? { id: user.id, fullName: user.fullName, phone: user.phone } : null
    });
  } catch (error) {
    return NextResponse.json({ 
      hasSession: false, 
      error: error.message 
    }, { status: 500 });
  }
}
