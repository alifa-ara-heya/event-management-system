import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { submitHostRequest } from "@/services/host/submitHostRequest";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const data = formData.get("data") as string;
        const file = formData.get("file") as File | null;

        const parsedData = JSON.parse(data);

        const uploadFormData = new FormData();
        uploadFormData.append("data", JSON.stringify(parsedData));
        if (file) {
            uploadFormData.append("file", file);
        }

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        const headers: HeadersInit = {};
        if (accessToken) {
            headers["Cookie"] = `accessToken=${accessToken}${refreshToken ? `; refreshToken=${refreshToken}` : ''}`;
        }

        const response = await fetch(`${BACKEND_API_URL}/host/request`, {
            method: "POST",
            headers,
            body: uploadFormData,
        });

        const result = await response.json();
        return NextResponse.json(result, { status: response.status });
    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

