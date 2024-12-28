"use client";
import { useAuth } from "@/context/AuthContext";
import { handleSignIn, handleSignUp } from "@/lib/cognitoActions";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useState } from "react";

interface AuthFormProps {
  isLogin: boolean;
  onToggle: MouseEventHandler<HTMLButtonElement>;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = { email, password };
    if (!isLogin) {
      if (password !== confirmPassword) return;
      try {
        const result = await handleSignUp(formData);

        console.log({ result });
        if (result?.nextStep.signUpStep === "CONFIRM_SIGN_UP") {
          router.replace(`/auth/confirm?email=${email}`);
        }
      } catch (err) {
        console.error("Error during sign up", err);
      }
    } else {
      try {
        await login(email, password);
      } catch (err) {}
    }
  };

  return (
    <div className="max-w-md w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
          <button
            type="button"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            onClick={onToggle}
          >
            {isLogin ? "Create an account" : "Have an account? Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
