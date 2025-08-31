import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authenticateUser } from "../lib/authService";

// Define our types
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  signout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  getRedirectPath: () => string;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Predefined static users with different roles
const PREDEFINED_USERS = [
  {
    id: 1,
    email: "test@admin.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin"
  },
  // {
  //   id: 2,
  //   email: "teacher@zaraschool.com",
  //   password: "teacher123",
  //   firstName: "Teacher",
  //   lastName: "Smith",
  //   role: "teacher"
  // },
  // {
  //   id: 3,
  //   email: "student@zaraschool.com",
  //   password: "student123",
  //   firstName: "Student",
  //   lastName: "Jones",
  //   role: "student"
  // }
];

// Define dashboard paths for each role
const ROLE_DASHBOARD_PATHS: Record<string, string> = {
  admin: "/dashboard/admin",
  // teacher: "/dashboard/teacher",
  // student: "/dashboard/student",
  default: "/dashboard" 
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
    
    // Initialize predefined users in localStorage if they don't exist
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      // Store predefined users without their passwords
      const usersForStorage = PREDEFINED_USERS.map(user => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      localStorage.setItem('users', JSON.stringify(usersForStorage));
    }
  }, []);

  // Return the appropriate redirect path based on user role
  const getRedirectPath = () => {
    if (!user) return '/signin';
    
    // Make role comparison case-insensitive
    const normalizedRole = user.role.toLowerCase();
    return ROLE_DASHBOARD_PATHS[normalizedRole] || ROLE_DASHBOARD_PATHS.default;
  };

  const signin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // First check against predefined users for development/testing
      const predefinedUser = PREDEFINED_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (predefinedUser) {
        // Destructure to exclude password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = predefinedUser;
        
        // Normalize the role to lowercase when storing the user
        const userWithNormalizedRole = {
          ...userWithoutPassword,
          name: `${userWithoutPassword.firstName} ${userWithoutPassword.lastName}`, // Add name property
          role: userWithoutPassword.role.toLowerCase()
        };
        
        // Set a mock token for development purposes
        localStorage.setItem('authToken', `mock-token-${Date.now()}`);
        
        setUser(userWithNormalizedRole);
        localStorage.setItem('user', JSON.stringify(userWithNormalizedRole));
        console.log("Signed in as predefined user:", userWithNormalizedRole);
        return;
      }
      
      try {
        // Use the API authentication service
        const authenticatedUser = await authenticateUser(email, password);
        
        if (authenticatedUser) {
          // Create a user object without the password
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = authenticatedUser;
          
          const userObj = {
            id: userWithoutPassword.id,
            email: userWithoutPassword.email,
            name: userWithoutPassword.name,
            role: userWithoutPassword.role.toLowerCase(), // Normalize the role to lowercase
            phone: userWithoutPassword.phone,
            address: userWithoutPassword.address
          };
          
          // The token should have been stored by the authenticateUser function
          
          setUser(userObj);
          localStorage.setItem('user', JSON.stringify(userObj));
          console.log("Signed in via API:", userObj);
        } else {
          // Instead of throwing an error, just set the error state
          setError('Invalid credentials. Please check your email and password.');
        }
      } catch (apiError) {
        console.error('API authentication error:', apiError);
        setError('Authentication service is unavailable. Please try again later or use a predefined account.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      console.error('Signin error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!userData.email || !userData.password || !userData.role) {
        throw new Error('Email, password, and role are required');
      }
      
      // Check if email already exists in predefined users
      const emailExists = PREDEFINED_USERS.some(user => user.email === userData.email);
      if (emailExists) {
        throw new Error('Email is already in use');
      }
      
      // Check if email exists in stored users
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const emailExistsInStored = storedUsers.some((user: User) => user.email === userData.email);
      if (emailExistsInStored) {
        throw new Error('Email is already in use');
      }
      
      const newUser = { 
        id: parseInt("user" + Date.now()), // Convert to number 
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName}`, // Add name property
        role: userData.role 
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log("Signed up as:", newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log("Signed out");
  };
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        signin,
        signup,
        signout,
        isAuthenticated,
        isLoading,
        error,
        getRedirectPath
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};