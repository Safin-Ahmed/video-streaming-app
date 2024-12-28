"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const AuthComponent: React.FC<any> = (props) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/auth"); // Redirect to login if not authenticated
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return <p>Loading...</p>; // Show loading spinner or message while checking authentication status
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
};

export default withAuth;
