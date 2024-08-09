import React from "react";
import { SafeAreaView } from "react-native";
import { AdvancedImage } from "cloudinary-react-native";
import { Cloudinary } from "@cloudinary/url-gen";
import { Color } from "../../GlobalStyles";
import { Image } from "expo-image";

const CloudinaryProfilePic = ({ publicId }) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: "sdchavan",
    },
  });

  // Use the image with the specified public ID.
  const myImage = cld.image(publicId);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AdvancedImage
        cldImg={myImage}
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          alignSelf: "center",
        }}
      />
    </SafeAreaView>
  );
};

export default CloudinaryProfilePic;
