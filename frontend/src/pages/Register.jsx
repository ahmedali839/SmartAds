import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, sendOtp, verifyOtp } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1: send OTP, 2: verify OTP
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await sendOtp(email);
      setMessage(res.message || "OTP sent successfully!");
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await verifyOtp(userName, email, otp, password);
      setMessage(res.message || "OTP verified successfully!");
      alert("Registration complete! Redirecting to login...");
      navigate("/me");
      await loginUser(email, password);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}
        className="bg-white shadow-md rounded-lg p-6 w-96"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {step === 1 ? "Register — Send OTP" : "Verify OTP"}
        </h2>

        {message && (
          <p className="text-sm text-center mb-3 text-blue-600">{message}</p>
        )}
        {step === 2 && (
          <input
            type="text"
            name="username"
            placeholder="Name"
            // disabled={step === 2}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
            required
          />
        )

        }
        <input
          type="email"
          name="email"
          placeholder="Email"
          disabled={step === 2}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
          required
        />

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
              required
            />

            <input
              type="password"
              placeholder="Set Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
              required
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading
            ? "Processing..."
            : step === 1
              ? "Send OTP"
              : "Verify & Register"}
        </button>

        {step === 1 && (
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer"
            >
              Login
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
