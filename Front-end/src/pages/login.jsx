import { useState } from "react";
import { useNavigate } from "react-router-dom";
import I1 from "../loginn.jpeg";
import { FaGoogle } from "react-icons/fa";
import { useTrade } from "../context/context";
function Auth() {
  const trade = useTrade();
  const isLogin = trade.isLogin;
  const setIsLogin = trade.setIsLogin;
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setShowOTP(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin && !showOTP) {
      setShowOTP(true);
    } else {
      navigate("/");
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In clicked");
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
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input
                type="email"
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
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {showOTP && (
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">
                    OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="button"
                  className="self-end px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Verify
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-900 transition-colors"
            >
              {isLogin ? (showOTP ? "Login" : "Send OTP") : "Sign Up"}
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

            <button
              onClick={handleGoogleSignIn}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaGoogle />
              Sign in with Google
            </button>
          </div>

          <p className="text-center mt-6 text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleAuthMode}
              className="text-blue-500 hover:text-blue-600"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
