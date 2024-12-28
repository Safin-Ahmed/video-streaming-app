"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import DashPlayer from "../DashPlayer";

const VideoDetails = () => {
  const params = useParams();
  const { id } = params;

  // Replace with real data fetching logic
  const video = {
    id,
    title: `Video ${id}`,
    description: `Description for Video ${id}`,
    videoUrl: `http://localhost:4000/stream/${id}/${id}.mpd`,
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4">{video.title}</h1>
        <p className="mb-8">{video.description}</p>
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <DashPlayer manifestUrl={video.videoUrl} videoName={String(id)} />
        </div>
      </div>
    </Layout>
  );
};

export default VideoDetails;
