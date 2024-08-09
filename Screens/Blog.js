import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  RefreshControl,
} from "react-native";
import FooterMenu from "../Components/Menus/FooterMenu";
import { Color } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import HeaderMenu from "../Components/Menus/HeaderMenu";
import { FontAwesome5 } from 'react-native-vector-icons/FontAwesome'; // Assuming you're using Expo
import PollModal from "../Components/Poll/AddPollModal"; // Assuming the PollModal component is in the specified location
import axios from "axios";
import PollCard from "../Components/Poll/PollCard"; // Import the PollCard component
import AddPostModal from "../Components/Poll/AddPostModel";
import PostCard from "../Components/Post/PostCard";
import LoadingAnimation from "../Components/Loader/loader";

const Blog = () => {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showPostModal, setshowPostModal] = useState(false);

  const [approvedPolls, setApprovedPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetchApprovedPolls();
  }, []);

  const fetchApprovedPolls = async () => {
    try {
      const pollsResponse = await axios.get("/approved-polls");
      const postsResponse = await axios.get("/approved-posts"); // Assuming this endpoint fetches approved polls

      // console.log("pollsResponse :" + JSON.stringify(pollsResponse.data));
      // console.log("postsResponse :" + JSON.stringify(postsResponse.data));
      setApprovedPolls(pollsResponse.data);
      setPosts(postsResponse.data.posts);
      setPolls(pollsResponse.data.polls);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching approved polls:", error);
    }
  };

  const handleAddPost = () => {
    // Logic to navigate or perform actions when adding a new post
    console.log("Add post button clicked");
    setShowMenu(false);
    setshowPostModal(true);
  };

  const handleAddPoll = () => {
    // Logic to open the poll modal and close other options
    setShowMenu(false);
    setShowPollModal(true);
  };

  const handleOptionClick = (option) => {
    // Logic to handle option click
    console.log("Option clicked:", option);
  };

  const [refreshing, setRefreshing] = useState(false);
  // const [loading, setLoading] = useState(true); // Assuming you have a loading state

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchApprovedPolls(); // Call your fetchApprovedPolls function or any other relevant refresh logic here
    setRefreshing(false);
  };

  const renderCombinedCards = () => {
    const combinedData = [...posts, ...polls];
    combinedData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return combinedData.map((item) => {
      if (item.imageUrl) {
        // Assuming it's a post
        return (
          <PostCard
            key={item._id}
            post={item}
            onPress={() => handlePostPress(item._id)} // Handle post press action
          />
        );
      } else {
        // Assuming it's a poll
        return (
          <PollCard
            key={item._id}
            poll={item.poll}
            onSelectOption={handleOptionClick}
            postId={item._id}
            approvedPolls={approvedPolls}
          />
        );
      }
    });
  };

  return (
    <View style={styles.blogscreen}>
      {/* Header */}
      <HeaderMenu />

      {/* Blog content goes here */}
      {/* <ScrollView contentContainerStyle={styles.container}>
        {approvedPolls.map((poll) => (
          <PollCard
            key={poll._id}
            poll={poll.poll}
            onSelectOption={handleOptionClick}
            postId={poll._id}
          />
        ))}
      </ScrollView> */}

      {loading && <LoadingAnimation visible={loading} loop={true} />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            {/* <Text>Loading...</Text> */}
          </View>
        ) : (
          // renderPosts()
          renderCombinedCards()

          // renderPolls()
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Floating button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setShowMenu(!showMenu)}
      >
        <FontAwesome5 name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Menu options */}
      {showMenu && !showPollModal && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={handleAddPost}>
            <FontAwesome5 name="plus" size={20} color="black" />
            <Text style={styles.menuText}>Add Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleAddPoll}>
            <FontAwesome5 name="poll" size={20} color="black" />
            <Text style={styles.menuText}>Add Poll</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer */}
      <FooterMenu />

      {/* Poll Modal */}
      <Modal
        visible={showPollModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPollModal(false)}
      >
        <View style={styles.modalContainer}>
          <PollModal onClose={() => setShowPollModal(false)} />
        </View>
      </Modal>

      {/* Post Modal */}

      <Modal
        visible={showPostModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setshowPostModal(false)}
      >
        <View style={styles.modalContainer}>
          <AddPostModal onClose={() => setshowPostModal(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSpace: {
    paddingVertical: 60,
  },
  blogscreen: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  container: {
    flexGrow: 1,
    // top: "10%",
    // paddingBottom: "100%",
    // marginBottom: "50%",
    paddingTop: 5,
    // bottom: 100,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  floatingButton: {
    position: "absolute",
    bottom: "10%",
    right: 20,
    backgroundColor: "#6949ff",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    zIndex: 1,
  },
  menu: {
    position: "absolute",
    bottom: "20%",
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    zIndex: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  menuText: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  // post: { zIndex: 99999 },
});

export default Blog;
