import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import I1 from "../assets/loginn.jpeg";
import { GoogleLoginPayload, LoginByEmailForm } from "../types/types";
import { loginByEmail } from "../services/authService";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { signInWithGoogle } from "../services/authService";
import { GoogleLogin } from "@react-oauth/google";

function LoginByEmail() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginByEmailForm>({
    email: "",
    password: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginByEmail(form);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", response.data.user?._id);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success(response.data.message || "Login successful!");
        navigate("/");
      }
    } catch (error: any) {
      console.error(
        "Login failed:",
        error.response?.data?.message || "An error occurred"
      ); // Handle error
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  // const handleGoogleSignIn = () => {
  //   console.log("Google Sign In clicked");
  // };
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential found");
      }

      const decoded = jwtDecode<GoogleLoginPayload>(credentialResponse.credential);
      const { email, name } = decoded;

      const response = await signInWithGoogle({ email, name });

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || "Login successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", response.data.user?._id);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Google login failed.");
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl flex max-w-4xl w-full mx-4">
        <div className="hidden md:block w-1/2 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-l-xl">
          <div className="h-full relative">
            <div className="absolute inset-0 bg-blue-500/10 rounded-lg transform -rotate-6"></div>
            <div className="absolute inset-0 bg-blue-500/5 rounded-lg transform rotate-3"></div>
            <img
              src={I1}
              alt="Authentication"
              className="rounded-lg shadow-lg relative z-10 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleFormChange}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-900 transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-4 w-full flex items-center justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => toast.error("Google Sign-in Failed")}
                size="large"
                width="100%"
              />
            </div>
          </div>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:text-blue-600">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginByEmail;
