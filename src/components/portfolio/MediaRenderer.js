"use client";

import Image from "next/image";
import { InstagramEmbed, YouTubeEmbed } from "react-social-media-embed";
import { OUR_WORK_TYPES } from "@/lib/config/app.config";
import ImageCarousel from "./ImageCarousel";

export default function MediaRenderer({ type, url, title, className = "" }) {
  switch (type) {
    case OUR_WORK_TYPES.IMAGE:
      if (Array.isArray(url)) {
        return <ImageCarousel images={url} title={title} className={className} />;
      }
      return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
          <Image
            src={url}
            alt={title}
            fill
            className="object-cover transition-transform"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      );

    case OUR_WORK_TYPES.VIDEO:
      return (
        <div className={`relative bg-black ${className} w-full aspect-[4/3]`}>
          <YouTubeEmbed
            url={url}
            height="100%"
            width="100%"
            placeholder={"Hey There"}
            youTubeProps={{className: "w-full aspect-4/3"}}
          />
        </div>
      );

    case OUR_WORK_TYPES.SHORT_VIDEO:
      return (
        <div className="-mb-3 w-fit mx-auto">
          <InstagramEmbed
            url={url}
            width={'fit-content'}
            height='fit-content'
            placeholder={
              <div className="bg-muted animate-pulse" />
            }
          />
        </div>
      );

    case OUR_WORK_TYPES.THREE_SIXTY:
      return (
        <div className={`relative w-full h-full my-auto bg-black ${className}`}>
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
