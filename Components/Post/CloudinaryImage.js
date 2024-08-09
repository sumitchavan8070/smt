import React from "react";
import { SafeAreaView } from "react-native";
import { AdvancedImage } from "cloudinary-react-native";
import { Cloudinary } from "@cloudinary/url-gen";

const CloudinaryImage = ({ publicId }) => {
  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: "sdchavan",
    },
  });

  // Use the image with the specified public ID.
  const myImage = cld.image(publicId);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <AdvancedImage
        cldImg={myImage}
        style={{ aspectRatio: 1, width: "95%" }}
      />
    </SafeAreaView>
  );
};

export default CloudinaryImage;
