import { getUserInfo } from "@/services/auth/getUserInfo";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const userInfo = await getUserInfo();
        return NextResponse.json({
            success: true,
            data: userInfo,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to get user info",
            },
            { status: 401 }
        );
    }
}

