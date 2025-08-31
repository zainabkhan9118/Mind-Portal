import axiosInstance from './axios';

// Course interface based on the API response
export interface Course {
  id?: number;
  name: string;
  description: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const coursesService = {
  // Get all courses
  getAllCourses: async (): Promise<Course[]> => {
    const response = await axiosInstance.get('/courses');
    return response.data;
  },
  
  // Get a course by ID
  getCourseById: async (id: number): Promise<Course> => {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data;
  },
  
  // Create a new course
  createCourse: async (courseData: Omit<Course, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
    const response = await axiosInstance.post('/courses', courseData);
    return response.data;
  },
  
  // Update an existing course
  updateCourse: async (id: number, courseData: Partial<Course>): Promise<Course> => {
    const response = await axiosInstance.put(`/courses/${id}`, courseData);
    return response.data;
  },
  
  // Delete a course
  deleteCourse: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/courses/${id}`);
  },
  
  // Toggle course active status
  toggleCourseStatus: async (id: number, isActive: boolean): Promise<Course> => {
    const response = await axiosInstance.patch(`/courses/${id}/status`, { isActive });
    return response.data;
  }
};

export default coursesService;