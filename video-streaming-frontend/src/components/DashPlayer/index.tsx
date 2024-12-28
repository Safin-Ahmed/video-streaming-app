"use client";

import dashjs from "dashjs";
import { fetchAuthSession } from "aws-amplify/auth";
import React, { useEffect, useRef } from "react";
import { encrypt } from "@/utils/encryption";

interface IDashPlayer {
  manifestUrl: string;
  videoName: string;
}

const DashPlayer: React.FC<IDashPlayer> = ({ manifestUrl, videoName }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<dashjs.MediaPlayerClass | null>(null);

  useEffect(() => {
    const setupPlayer = async () => {
      const user = await fetchAuthSession();
      const token = user.tokens?.accessToken.toString();
      const encryptedToken = encrypt(String(token));

      const player = dashjs.MediaPlayer().create();
      player.updateSettings({
        debug: {
          logLevel: 5, // Enable detailed logs
        },
      });

      playerRef.current = player;

      if (videoRef.current) {
        player.extend(
          "RequestModifier",
          () => {
            return {
              async modifyRequest(request: any) {
                const url = new URL(request.url);
                const segmentName = url.pathname.split("/").pop();
                const response = await fetch(
                  `http://localhost:4000/stream/${videoName}/${segmentName}`,
                  {
                    headers: {
                      Authorization: `Bearer ${encryptedToken}`,
                    },
                  }
                );
                const data = await response.json();

                request.url = data.signedUrl;

                return request;
              },
            };
          },
          true
        );

        player.initialize(videoRef.current, manifestUrl, true);
      }
    };

    setupPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.reset();
      }
    };
  }, [manifestUrl]);

  return (
    <video
      ref={videoRef}
      controls
      style={{ width: "100%", height: "auto" }}
    ></video>
  );
};

export default DashPlayer;
