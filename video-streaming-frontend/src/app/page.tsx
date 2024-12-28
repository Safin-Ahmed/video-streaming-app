import Layout from "../components/Layout";
import Link from "next/link";

const videos = [
  {
    id: "1",
    name: "video-1",
    title: "Video 1",
    description: "Description for Video 1",
  },
  {
    id: "2",
    name: "batman2",
    title: "batman2",
    description: "Description for batman 2",
  },
  // Add more video data as needed
];

const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">Video Feed</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <Link key={video.id} href={`/video/${video.title}`}>
              <div className="block p-4 border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
                <p>{video.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
