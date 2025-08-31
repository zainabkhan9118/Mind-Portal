"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Import the auth context
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define custom toast style type
interface CustomToastStyle extends Omit<ToastOptions, 'icon'> {
  style?: React.CSSProperties;
  progressStyle?: React.CSSProperties;
  icon?: string;
}

export default function SignInForm() {
  const router = useRouter();
  const { signin, error: authError, isLoading, isAuthenticated, getRedirectPath } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [signInAttempted, setSignInAttempted] = useState(false);

  const errorToastStyle: CustomToastStyle = {
    style: {
      background: '#fff',
      color: '#cb2d3e',
      borderRadius: '8px',
      padding: '16px',
      fontWeight: '500',
      boxShadow: 'none',
    },
    progressStyle: {
      background: '#ffcc80'
    },
    icon: '⚠️'
  };
  
  // Implement the typing effect


  // Effect to handle redirection after successful authentication
  useEffect(() => {
    // Create toast styles inside the useEffect to prevent dependency array issues
    const successToastStyle: CustomToastStyle = {
      style: {
        background: '#fff',
        color: '#4b6cb7',
        borderRadius: '8px',
        padding: '16px',
        fontWeight: '500',
        boxShadow: 'none',
      },
      progressStyle: {
        background: '#8be9fd'
      },
      icon: '🎉'
    };
    
    if (signInAttempted && isAuthenticated && !isLoading && !isSubmitting) {
      // Show success toast with custom styling
      toast.success(
        <div className="flex flex-col">
          <span className="text-lg font-medium mb-1">Login Successful!</span>
          <span className="text-sm opacity-90">Redirecting you to dashboard...</span>
        </div>, 
        successToastStyle as ToastOptions
      );
      
      // Redirect after a short delay to allow the toast to be seen
      setTimeout(() => {
        const redirectPath = getRedirectPath();
        router.push(redirectPath);
      }, 2000);
    }
  }, [isAuthenticated, isLoading, signInAttempted, getRedirectPath, router, isSubmitting]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Set loading states
      setIsSubmitting(true);
      setSignInAttempted(true);
      
      // Authenticate the user - the useEffect will handle redirection
      await signin(formData.email, formData.password);
    } catch (error) {
      console.error("Signin failed:", error);
      // Reset the sign-in attempt flag if there was an error
      setSignInAttempted(false);
      
      // Show error toast
      toast.error(
        <div className="flex flex-col">
          <span className="text-lg font-medium mb-1">Login Failed</span>
          <span className="text-sm opacity-90">Please check your credentials and try again.</span>
        </div>,
        errorToastStyle as ToastOptions
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="toast-container-custom"
      />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto relative z-10">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Enter your credentials to continue your journey
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="mb-1.5">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  hint={errors.email}
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="mb-1.5">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password" 
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    hint={errors.password}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeCloseIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Checkbox
                  id="remember"
                  label="Remember me"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                />
                
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Forgot password?
                </Link>
              </div>
              
              {authError && (
                <div className="p-3 text-sm text-red-500 bg-red-100 rounded-lg dark:bg-red-900/30">
                  {authError}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full py-3 font-medium text-gray-800 transition-all rounded-lg bg-[#DCD3F7] hover:bg-[#cfc2f0] focus:ring-2 focus:ring-[#DCD3F7] disabled:opacity-70 flex justify-center items-center"
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : "Sign In"}
              </button>
              
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  prefetch={true}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/signup');
                  }}
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      
      {/* Add global styles for toast customization */}
      <style jsx global>{`
        .toast-container-custom .Toastify__toast {
          border-radius: 12px;
          box-shadow: none;
          padding: 16px;
          margin-bottom: 16px;
        }
        .Toastify__toast-body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .Toastify__progress-bar {
          height: 4px;
          border-radius: 0 0 4px 4px;
        }
        .Toastify__close-button {
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .Toastify__close-button:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}