"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define custom toast style type
interface CustomToastStyle extends Omit<ToastOptions, 'icon'> {
  style?: React.CSSProperties;
  progressStyle?: React.CSSProperties;
  icon?: string;
}

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRoleFromQuery = searchParams.get("role"); 
  const { error: authError, isLoading: authLoading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    role: "",
    terms: "",
  });


  // Custom toast styles
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



  useEffect(() => {
    if (selectedRoleFromQuery) {
      console.log(`Role selected: ${selectedRoleFromQuery}`); // Log selected role
    }
  }, [selectedRoleFromQuery]);

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

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "First name is required";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }
    
    if (!formData.address) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!selectedRoleFromQuery) {
      newErrors.role = "Role selection is required";
      isValid = false;
    }

    if (!isChecked) {
      newErrors.terms = "You must agree to the terms and conditions";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Form Data:", formData);
      console.log("Selected Role:", selectedRoleFromQuery);

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          role: selectedRoleFromQuery || "User",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup failed:", errorData);
        toast.error(errorData.message || "Signup failed", errorToastStyle as ToastOptions);
        return;
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      
      // Show success toast with custom styling
      toast.success(
        <div className="flex flex-col">
          <span className="text-lg font-medium mb-1">Account Created!</span>
          <span className="text-sm opacity-90">You&apos;ll be redirected to login in a moment.</span>
        </div>, 
        successToastStyle as ToastOptions
      );
      
      // Redirect after a short delay to allow the toast to be seen
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
      
    } catch (error: unknown) {
      console.error("Signup failed:", error);
      toast.error(
        <div className="flex flex-col">
          <span className="text-lg font-medium mb-1">Signup Failed</span>
          <span className="text-sm opacity-90">Please try again later.</span>
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
              Create Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Enter your details to create your account
            </p>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* First Name */}
                <div className="sm:col-span-1">
                  <Label htmlFor="name" className="mb-1.5">
                    Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    error={!!errors.name}
                    hint={errors.name}
                  />
                </div>
                {/* Phone */}
                <div className="sm:col-span-1">
                  <Label htmlFor="phone" className="mb-1.5">
                    Phone<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    error={!!errors.phone}
                    hint={errors.phone}
                  />
                </div>
              </div>
              
              {/* Email */}
              <div>
                <Label htmlFor="email" className="mb-1.5">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  error={!!errors.email}
                  hint={errors.email}
                />
              </div>
              {/* address*/}
              <div>
                <Label htmlFor="address" className="mb-1.5">
                  Address<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  error={!!errors.address}
                  hint={errors.address}
                />
              </div>
              
              {/* Password */}
              <div>
                <Label htmlFor="password" className="mb-1.5">
                  Password<span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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
              
              {/* Terms */}
              <div className="flex items-center">
                <Checkbox
                  id="terms"
                  label="I agree to the terms and conditions"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                />
              </div>
              {errors.terms && (
                <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
              )}
              
              {authError && (
                <div className="p-3 text-sm text-red-500 bg-red-100 rounded-lg dark:bg-red-900/30">
                  {authError}
                </div>
              )}
              
              {errors.role && !selectedRoleFromQuery && (
                <div className="p-3 text-sm text-red-500 bg-red-100 rounded-lg dark:bg-red-900/30">
                  {errors.role}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full py-3 font-medium text-gray-800 transition-all rounded-lg bg-[#DCD3F7] hover:bg-[#cfc2f0] focus:ring-2 focus:ring-[#DCD3F7] disabled:opacity-70 flex justify-center items-center"
                disabled={isSubmitting || authLoading}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : authLoading ? "Processing..." : "Sign Up"}
              </button>
              
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Sign in
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