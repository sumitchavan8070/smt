// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { Image } from "expo-image";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { Color } from "../../GlobalStyles";
// import axios from "axios";

// const PostCard = ({ post }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     if (post.postedBy && !user) {
//       fetchUserById(post.postedBy);
//     }
//   }, [post]);

//   const fetchUserById = async (userId) => {
//     try {
//       const response = await axios.get(`/${userId}`);
//       setUser(response.data.user);
//     } catch (error) {
//       console.error("Error fetching user by ID:", error);
//     }
//   };

//   return (
//     <View style={styles.cardContainer}>
//       {/* User profile and name */}
//       <View style={styles.userInfo}>
//         <Image
//           style={styles.userProfileImage}
//           source={{ uri: user?.profilePic }}
//         />
//         <View>
//           <Text style={styles.userName}>{user?.name}</Text>
//           <Text style={styles.spon}>Sponsored</Text>
//         </View>
//       </View>

//       <Image
//         style={[styles.img]}
//         contentFit="cover"
//         source={{ uri: post?.imageUrl }}
//       />

//       {/* Bottom icons */}
//       <View style={styles.iconContainer}>
//         <View style={styles.rightIcons}>
//           <TouchableOpacity style={styles.iconButton}>
//             <FontAwesome name="heart-o" size={24} color={Color.primaryColor} />
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity style={styles.bookmarkButton}>
//           <FontAwesome name="bookmark-o" size={24} color={Color.primaryColor} />
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.desUsername}>
//         {user?.name}
//         <Text style={styles.desTxt}> {post.description}</Text>
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   desUsername: {
//     fontWeight: "600",
//     marginTop: 10,
//   },
//   desTxt: { fontWeight: "100" },
//   img: {
//     width: "100%",
//     aspectRatio: 1,
//     resizeMode: "cover",
//   },
//   cardContainer: {
//     width: "90%",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     marginBottom: 10,
//     backgroundColor: "#fff",
//     alignSelf: "center",
//   },
//   userInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     gap: 10,
//   },
//   userName: {
//     marginRight: 10,
//     fontSize: 14,
//   },
//   spon: { fontSize: 12 },
//   userProfileImage: {
//     width: 30,
//     height: 30,
//     borderRadius: 20,
//   },
//   iconContainer: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   rightIcons: {
//     flexDirection: "row",
//   },
//   iconButton: {
//     marginHorizontal: 10,
//   },
//   bookmarkButton: {
//     padding: 5,
//   },
// });

// export default PostCard;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Image } from "expo-image";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Color } from "../../GlobalStyles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CloudinaryImage from "./CloudinaryImage";

const PostCard = ({ post }) => {
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [lastPress, setLastPress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (post.postedBy && !user) {
      fetchCurrentUser();
      fetchUserById(post.postedBy);
    }
  }, [post]);

  const fetchCurrentUser = async () => {
    try {
      const data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);
      let userId = loginData.user._id;
      if (userId) {
        setUser(userId);
        setIsLiked(post.likes.some((like) => like.userId === userId)); // Check if the user has liked the post
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(`/${userId}`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
    }
  };

  const handleIconLike = async () => {
    // Send request to update likes in the backend
    const data = await AsyncStorage.getItem("@auth");
    let loginData = JSON.parse(data);
    let userId = loginData.user._id;
    const response = await axios.put(`/posts/${post._id}/like`, {
      userId: userId, // Use the current user ID for like/unlike action
    });

    if (response.data.success && response.data.post) {
      const updatedPost = response.data.post;
      setLikeCount(updatedPost.likes.length);
      setIsLiked(!isLiked); // Toggle the like state
    }
  };

  const handleLike = async () => {
    try {
      const currentTime = new Date().getTime();
      const delta = currentTime - lastPress;

      if (delta < 300) {
        setLoading(true); // Set loading state during like operation

        // Send request to update likes in the backend
        const data = await AsyncStorage.getItem("@auth");
        let loginData = JSON.parse(data);
        let userId = loginData.user._id;
        const response = await axios.put(`/posts/${post._id}/like`, {
          userId: userId, // Use the current user ID for like/unlike action
        });

        if (response.data.success && response.data.post) {
          const updatedPost = response.data.post;
          setLikeCount(updatedPost.likes.length);
          setIsLiked(!isLiked); // Toggle the like state
        }
      }

      setLastPress(currentTime);
    } catch (error) {
      console.error("Error updating likes:", error);
    } finally {
      setLoading(false); // Reset loading state after like operation
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleLike}>
      <View style={styles.cardContainer}>
        {/* User profile and name */}
        <View style={styles.userInfo}>
          <Image
            style={styles.userProfileImage}
            source={{ uri: user?.profilePic }}
          />
          <View>
            <Text style={styles.userName}>{user?.name}</Text>
            {post.isSponsored && (
              <Text style={styles.sponsoredText}>Sponsored</Text>
            )}
          </View>
        </View>

        {/* <Image
          style={[styles.img]}
          contentFit="cover"
          source={{ uri: post.imageUrl }}
        /> */}
        <CloudinaryImage publicId={post?.imageUrl} />

        {/* Bottom icons */}
        <View style={styles.iconContainer}>
          <View style={styles.rightIcons}>
            <TouchableOpacity onPress={handleIconLike}>
              <FontAwesome
                name={isLiked ? "heart" : "heart-o"}
                size={24}
                color={isLiked ? Color.red : Color.primaryColor} // Customize liked/unliked color
              />
            </TouchableOpacity>

            <Text style={styles.likeCount}>{likeCount} likes</Text>
            {/* Display like count */}
          </View>
          <TouchableOpacity style={styles.bookmarkButton}>
            <FontAwesome
              name="bookmark-o"
              size={24}
              color={Color.primaryColor}
            />
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.desUsername}>
          {user?.name}
          <Text style={styles.desTxt}> {post.description}</Text>
        </Text> */}
        <Text style={styles.desUsername}>
          {user?.name}{" "}
          {showFullDescription ? (
            <Text style={styles.desTxt}> {post.description}</Text>
          ) : (
            <Text style={styles.desTxt}>
              {post.description.length > 200
                ? post.description.slice(0, 200) + "..."
                : post.description}
            </Text>
          )}
          {post.description.length > 200 && !showFullDescription && (
            <Text
              style={styles.showMoreLink}
              onPress={() => setShowFullDescription(true)}
            >
              Show more
            </Text>
          )}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  showMoreLink: { color: Color.primaryColor },
  desUsername: {
    fontWeight: "600",
    marginTop: 10,
  },
  desTxt: {
    fontWeight: "100",
    // gap: 5,
  },
  img: {
    width: "100%",
    // aspectRatio: 1,
    height: 300,
    resizeMode: "cover",
  },
  cardContainer: {
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  userName: {
    marginRight: 10,
    fontSize: 14,
  },
  sponsoredText: {
    fontSize: 12,
    color: "#888", // Custom color for sponsored text
  },
  userProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    marginLeft: 5,
    fontSize: 14,
  },
  iconButton: {
    marginHorizontal: 10,
  },
  bookmarkButton: {
    padding: 5,
  },
});

export default PostCard;
