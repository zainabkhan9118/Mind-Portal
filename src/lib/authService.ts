import axiosInstance from "@/lib/axios";

// API service for user-related operations
export interface UserData {
  id: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  name: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

/**
 * Authenticate user by email and password
 * @param email User email
 * @param password User password
 * @returns Promise with user data if authentication is successful
 */
export const authenticateUser = async (email: string, password: string): Promise<UserData | null> => {
  try {
    console.log('Attempting to authenticate with API:', { email, password: '******' });

    // Format the request exactly as expected by the API
    const response = await axiosInstance.post('/auth/login', {
      email,
      password
    });

    // Handle the actual API response format
    if (response.data && response.data.access_token) {
      // Store the access token
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.data.access_token);
      }

      // Return a user object constructed from the response
      return {
        id: response.data.id,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: email.split('@')[0], // Use part of email as name if not provided
        password: '', // Don't include password
        email: email,
        phone: '',
        address: '',
        role: response.data.role
      };
    } else {
      console.log('Login response is missing access_token:', response.data);
      return null;
    }
  } catch (loginError) {
    console.log('Login API endpoint failed:', loginError instanceof Error ? loginError.message : loginError);

    // Since we can't authenticate via API, return null
    return null;
  }
};

/**
 * Fetches all users from the API (requires authentication)
 * @returns Promise with array of users
 */
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const response = await axiosInstance.get('/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

/**
 * Fetches a single user by ID (requires authentication)
 * @param id User ID to fetch
 * @returns Promise with user data
 */
export const getUserById = async (id: number): Promise<UserData | null> => {
  try {
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return null;
  }
};

/**
 * Test function to verify API connectivity
 */
export const testApiConnection = async (): Promise<boolean> => {
  try {
    // Test a public endpoint that doesn't require authentication
    await axiosInstance.get('/');
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};