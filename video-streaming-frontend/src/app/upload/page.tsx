"use client";
import VideoUpload from "@/components/VideoUpload";
import withAuth from "@/components/withAuth";
import React from "react";

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <VideoUpload />
    </div>
  );
};

export default withAuth(UploadPage);
