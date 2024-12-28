"use client";
import axiosPrivateInstance from "@/utils/axiosPrivateInstance";
import React, { useState } from "react";

const VideoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
    setMessage("");
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const response = await axiosPrivateInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setMessage("Video uploaded and processed successfully.");
      } else {
        setMessage(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.log("Error in catch block during uploading video: ", error);
      setMessage("Error uploading the video.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload and Process Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        {uploading ? (
          <div className="flex items-center justify-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10"></div>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Upload Video
          </button>
        )}
      </form>
      {message && (
        <div className="mt-4 text-center text-green-600 font-semibold">
          {message}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
