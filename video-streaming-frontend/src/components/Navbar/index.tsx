"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
  };

  const handleLogin = () => {
    router.push("/auth");
  };
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">VideoStream</Link>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href={"/"}>Home</Link>
          <Link href={"/upload"}>Upload</Link>
        </div>
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
