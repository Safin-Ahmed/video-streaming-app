"use client";
import AuthForm from "@/components/AuthForm";
import { useState } from "react";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <AuthForm isLogin={isLogin} onToggle={toggleForm} />
    </div>
  );
};

export default AuthPage;
