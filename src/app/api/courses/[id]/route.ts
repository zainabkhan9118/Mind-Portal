import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/courses/[id] - Get a specific course by ID
export async function GET(request: NextRequest) {
  try {
    // Extract the ID from the URL path instead of using params
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const idParam = pathParts[pathParts.length - 1];
    const id = Number(idParam);
    
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    
    // Fetch the course
    const course = await prisma.course.findUnique({
      where: { id }
    });
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

// PUT /api/courses/[id] - Update a course
export async function PUT(request: NextRequest) {
  try {
    // Extract the ID from the URL path instead of using params
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const idParam = pathParts[pathParts.length - 1];
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
    
    // Check if course exists
    const courseExists = await prisma.course.findUnique({
      where: { id }
    });
    
    if (!courseExists) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    // Update the course
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        description: body.description !== undefined ? body.description : undefined,
        isActive: body.isActive !== undefined ? body.isActive : undefined
      }
    });
    
    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

// DELETE /api/courses/[id] - Delete a course
export async function DELETE(request: NextRequest) {
  try {
    // Extract the ID from the URL path instead of using params
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const idParam = pathParts[pathParts.length - 1];
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
    
    // Check if course exists
    const courseExists = await prisma.course.findUnique({
      where: { id }
    });
    
    if (!courseExists) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    // Delete the course
    await prisma.course.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}