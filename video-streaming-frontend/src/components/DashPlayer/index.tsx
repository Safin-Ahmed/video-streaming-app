"use client";

import dashjs from "dashjs";
import { fetchAuthSession } from "aws-amplify/auth";
import React, { useEffect, useRef } from "react";
import { encrypt } from "@/utils/encryption";

interface IDashPlayer {
  url: string;
}

const DashPlayer: React.FC<IDashPlayer> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<dashjs.MediaPlayerClass | null>(null);

  useEffect(() => {
    const setupPlayer = async () => {
      const user = await fetchAuthSession();
      const token = user.tokens?.accessToken.toString();
      const encryptedToken = encrypt(String(token));

      const player = dashjs.MediaPlayer().create();

      playerRef.current = player;

      if (videoRef.current) {
        player.extend(
          "RequestModifier",
          () => {
            return {
              modifyRequestHeader: (xhr: XMLHttpRequest) => {
                xhr.setRequestHeader(
                  "Authorization",
                  `Bearer ${encryptedToken}`
                );
                return xhr;
              },
            };
          },
          true
        );

        player.initialize(videoRef.current, url, true);
      }
    };

    setupPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.reset();
      }
    };
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      style={{ width: "100%", height: "auto" }}
    ></video>
  );
};

export default DashPlayer;
