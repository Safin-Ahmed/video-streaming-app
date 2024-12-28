"use client";
import {
  handleConfirmSignUp,
  handleVerificationCode,
} from "@/lib/cognitoActions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, FC, useEffect } from "react";

const ConfirmAccount: FC = () => {
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const confirmEmail = params.get("email");
    if (confirmEmail) setEmail(confirmEmail);
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      email,
      code: confirmationCode,
    };
    const result = await handleConfirmSignUp(formData);

    if (result?.isSignUpComplete) {
      router.replace("/");
    }
  };

  const handleResendCode = async () => {
    await handleVerificationCode({ email });
  };

  return (
    <div className="max-w-md w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
        Confirm Your Account
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

          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmationCode"
          >
            Confirmation Code
          </label>
          <input
            type="text"
            id="confirmationCode"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your confirmation code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Confirm
          </button>
          <button
            onClick={handleResendCode}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Resend Code
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmAccount;
