import { IAppImage } from "@/http/models/AppImage.model";
import { AdvancedImage } from "@cloudinary/react";
import Image from "next/image";
import { blur } from "@cloudinary/url-gen/actions/effect";

import { Cloudinary } from "@cloudinary/url-gen";
import React from "react";

interface AppImageProps {
  alt?: string;
  sizes?: string;
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
  imageSource?: IAppImage;
}

const AppImage: React.FC<AppImageProps> = ({
  imageSource,
  alt,
  sizes,
  height,
  width,
}) => {
  switch (imageSource?.provider) {
    case "cloudinary":
      const cld = new Cloudinary({
        cloud: { cloudName: "techdiary-dev" },
      });
      const _image = cld.image(imageSource?.key).quality("auto").format("auto");

      return (
        <Image
          alt={alt || ""}
          src={_image.toURL()}
          sizes={sizes}
          height={height}
          width={width}
          placeholder="blur"
          blurDataURL="/thumbnail-placeholder.png"
        />
      );
    // return JSON.stringify(_image.toURL());
    case "direct":
      return (
        <Image
          src={imageSource?.key}
          alt={alt || ""}
          sizes={sizes}
          width={width}
          height={height}
        />
      );
    default:
      return (
        <Image
          src={imageSource?.key || ""}
          alt={alt || ""}
          sizes={sizes}
          width={width}
          height={height}
        />
      );
  }
};

export default AppImage;
