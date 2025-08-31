import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH /api/courses/[id]/status - Toggle course active status
export async function PATCH(request: NextRequest) {
  try {
    // Extract the ID from the URL path instead of using params
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const idParam = pathParts[pathParts.length - 2]; // ID is second-to-last part in /courses/[id]/status
    const id = Number(idParam);
    
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    
    // Get request body
    const body = await request.json();
    
    if (body.isActive === undefined) {
      return NextResponse.json(
        { error: "isActive property is required" },
        { status: 400 }
      );
    }
    
    // Check if course exists
    const courseExists = await prisma.course.findUnique({
      where: { id }
    });
    
    if (!courseExists) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    // Update the course status
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        isActive: body.isActive
      }
    });
    
    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Error updating course status:", error);
    return NextResponse.json({ error: "Failed to update course status" }, { status: 500 });
  }
}