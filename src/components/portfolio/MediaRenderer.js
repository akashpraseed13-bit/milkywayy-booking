"use client";

import Image from "next/image";
import { InstagramEmbed, YouTubeEmbed } from "react-social-media-embed";
import { OUR_WORK_TYPES } from "@/lib/config/app.config";

export default function MediaRenderer({ type, url, title, className = "" }) {
  switch (type) {
    case OUR_WORK_TYPES.IMAGE:
      return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
          <Image
            src={url}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      );

    case OUR_WORK_TYPES.VIDEO:
      return (
        <div className={`relative w-full h-full bg-black ${className}`}>
          <YouTubeEmbed
            url={url}
            width="100%"
            height="100%"
            placeholder={
              <div className="w-full h-full bg-muted animate-pulse" />
            }
          />
        </div>
      );

    case OUR_WORK_TYPES.SHORT_VIDEO:
      return (
        <div
          className={`relative w-full h-full bg-black flex justify-center ${className}`}
        >
          <InstagramEmbed
            url={url}
            width={328}
            placeholder={
              <div className="w-[328px] h-full bg-muted animate-pulse" />
            }
          />
        </div>
      );

    case OUR_WORK_TYPES.THREE_SIXTY:
      return (
        <div className={`relative w-full h-full bg-black ${className}`}>
          <iframe
            src={url}
            title={title}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      );

    default:
      return (
        <div
          className={`flex items-center justify-center bg-secondary text-muted-foreground ${className}`}
        >
          Unsupported Media Type
        </div>
      );
  }
}
