import { NextResponse } from "next/server";

const API_BASE_URL = "http://localhost:8000/api/auth";

export async function GET(req) {
    try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${API_BASE_URL}/api/gisRegistration/me`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Ensure cookies/session tokens are sent
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: "Server Error", error }, { status: 500 });
    }
}
