import axiosInstance from "@/lib/axios";
import { NextResponse } from "next/server";
import axios from "axios"; // Import the main axios library for isAxiosError

export async function POST(request: Request) {
  try {
    const { email, password, name, phone, address, role } = await request.json();
    const response = await axiosInstance.post("/user", {
      email,
      password,
      name,
      phone,
      address,
      role,
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Signup API Error:", error.response?.data || error.message);
      return NextResponse.json(
        { message: error.response?.data?.message || error.message || "Internal Server Error" },
        { status: error.response?.status || 500 }
      );
    }
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}