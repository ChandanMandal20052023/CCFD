import React, { useRef, useState, useEffect } from "react";
// --- PATH FIX ---
import userProfile from "../../User/profile.png";
import communityUser01 from "../../assets/community_user01.jpg";
import communityUser03 from "../../assets/community_user03.jpg";
import friend01 from "../../assets/friend01.webp";
import friend02 from "../../assets/friend02.jpg";
// --- END PATH FIX ---

import {
  EllipsisVertical,
  Star,
  Image,
  MessageCircle,
  X,
  Plus,
  Check,
} from "lucide-react";

// (Firebase imports ki ab zaroorat nahi hai)

const suggestedFriends = [
  { id: 1, name: "Raj Sharma", roll: "1CSE4", image: friend01 },
  { id: 2, name: "Nikhil Gupta", roll: "2CSE13", image: friend02 },
  { id: 3, name: "Faisal Khan", roll: "2CSE15", image: communityUser03 },
  { id: 4, name: "Farhan Akhtar", roll: "3CSE7", image: communityUser01 },
];

// ---------- Post Component (Updated for Local Storage) ----------
const Post = ({ post, currentUser, onToggleLike }) => {
  // --- ID LOGIC UPDATED ---
  // Hum check karte hain ki currentUser valid hai ya nahi
  const uniqueUserId = currentUser
    ? currentUser.id || currentUser.id_no || currentUser.roll_number
    : null;
  const isLiked = uniqueUserId ? post.likes?.includes(uniqueUserId) : false;
  // --- END ID LOGIC ---

  const toggleLike = () => {
    if (!uniqueUserId) {
      console.log("Like karne ke liye user data ka load hona zaroori hai");
      return;
    }
    onToggleLike(post.id);
  };

  return (
    <div className="border border-gray-300 flex flex-col w-full rounded-[10px] p-4 bg-white">
      {/* Post Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={post.user?.image || userProfile}
            alt={post.user?.name}
            className="w-[3rem] h-[3rem] rounded-full"
          />
          <div>
            <h2 className="font-manrope font-semibold text-[18px]">
              {post.user?.name || "Anonymous User"}
            </h2>
            <p className="text-gray-87 font-montserrat font-medium text-[15px]">
              {post.user?.roll || ""}
            </p>
          </div>
        </div>
        <EllipsisVertical className="text-gray-87 cursor-pointer" />
      </div>

      {/* Post Content */}
      <p className="font-montserrat text-gray-87 py-2">{post.text}</p>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="rounded-[5px] object-cover max-h-[400px] w-full"
        />
      )}

      {/* Actions */}
      <div className="py-2 flex items-center gap-3 text-gray-87 font-montserrat font-medium">
        <Star
          size={28}
          strokeWidth={1.5}
          fill={isLiked ? "#ffbf00" : "none"}
          onClick={toggleLike}
          className={`cursor-pointer transition-all duration-150 ${
            isLiked ? "text-[#ffbf00]" : "text-gray-600"
          }`}
        />
        <p>{post.likes?.length || 0}</p>
        <MessageCircle size={24} strokeWidth={1.5} className="ml-4" />
        <p>{post.comments || 0}</p>
      </div>
    </div>
  );
};

// ---------- Suggested Friends Component (No Change) ----------
const SuggestedFriends = () => {
  const [addedFriends, setAddedFriends] = useState(() => {
    const saved = localStorage.getItem("addedFriends");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFriend = (id) => {
    setAddedFriends((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];
      localStorage.setItem("addedFriends", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="w-full md:w-[25vw] bg-white border border-gray-200 rounded-[12px] shadow-sm p-4 h-fit">
      <h3 className="font-manrope font-semibold text-[18px] mb-4">
        Suggested Friends
      </h3>
      <div className="flex flex-col gap-4">
        {suggestedFriends.map((friend) => {
          const isAdded = addedFriends.includes(friend.id);
          return (
            <div
              key={friend.id}
            	className="flex items-center justify-between flex-wrap sm:flex-nowrap"
            >
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div className="w-[3rem] h-[3rem] bg-gray-200 rounded-full overflow-hidden">
                  {friend.image && (
                    <img
                      src={friend.image}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-manrope font-medium text-[16px]">
                    {friend.name}
                  </p>
                  <p className="text-gray-87 text-[14px] font-montserrat">
                    {friend.roll}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleFriend(friend.id)}
              	className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-[8px] transition duration-100 flex items-center justify-center"
              >
                {isAdded ? (
                  <Check size={20} strokeWidth={2.5} className="text-accent" />
                ) : (
                  <Plus size={20} strokeWidth={2} className="text-gray-800" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- LOCAL STORAGE CHANGE ---
// Helper function: File ko Base64 string mein convert karne ke liye (Yeh zaroori hai)
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
// --- END LOCAL STORAGE CHANGE ---

// ---------- Community Component (Updated for DB Fetch + Local Storage) ----------
const Community = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- DATABASE FETCH ADDED ---
  // currentUser state ab 'null' se shuru hoga
  const [currentUser, setCurrentUser] = useState(null);

  // 1. Logged-in MySQL user ka data fetch karein (FAKE_USER ki jagah)
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // MySQL token
      if (token) {
        try {
          const res = await fetch("http://localhost:5000/api/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data.user); // MySQL user data save karein
            console.log("MySQL user data fetched:", data.user);
          } else {
            console.error("Failed to fetch user data:", res.status);
          }
        } catch (error) {
          console.error("User data fetch nahi kar paaye:", error);
        }
      } else {
        console.warn("No auth token found in local storage.");
      }
    };
    fetchUserData();
  }, []); // Yeh component mount hone par ek baar chalega

  // 2. Local Storage se saare posts fetch karein (Yeh same rahega)
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem("posts");
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      }
    } catch (error) {
      console.error("Local Storage se posts load nahi kar paaye:", error);
    }
  }, []);
  // --- END DATABASE FETCH ---

  const handleFileSelect = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- LOCAL STORAGE CHANGE (Share Button) ---
  const handleSharePost = async () => {
    if ((!postContent || postContent.trim() === "") && !imageFile) {
      alert("Post likhein ya image select karein.");
      return;
    }

    if (!currentUser) {
      alert("User data load ho raha hai, कृपया प्रतीक्षा करें...");
      return;
    }

    // --- ID LOGIC UPDATED ---
    // 'uid' ki jagah database se aane wala unique ID use karein
    // Hum assume kar rahe hain ki 'id' ya 'id_no' ya 'roll_number' unique hai
    const uniqueUserId = currentUser.id || currentUser.id_no || currentUser.roll_number;
    if (!uniqueUserId) {
      alert("Aapka unique user ID nahi mil raha. Post nahi kar sakte.");
      setLoading(false);
      return;
    }
    // --- END ID LOGIC ---

    setLoading(true);
    let imageUrl = null;

    try {
      if (imageFile) {
        imageUrl = await fileToBase64(imageFile);
      }

      const newPost = {
        id: Date.now().toString(),
        text: postContent,
        imageUrl: imageUrl,
      	createdAt: new Date().toISOString(),
        // --- ID LOGIC UPDATED ---
      	userId: uniqueUserId, // Yahaan ID save karein
      	// --- END ID LOGIC ---
      	user: {
        	name: currentUser.full_name,
        	roll: currentUser.roll_number || currentUser.id_no || "N/A",
        	image: currentUser.profile_photo_url || userProfile,
      	},
      	likes: [],
      	comments: 0,
      };

      const currentPosts = JSON.parse(localStorage.getItem("posts")) || [];
      const updatedPosts = [newPost, ...currentPosts];

      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      setPosts(updatedPosts);

      setPostContent("");
      removeImage();
      console.log("Post successfully local storage mein save ho gaya!");

    } catch (error) {
      console.error("Post create karne mein error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Like toggle handler (Local Storage version)
  const handleToggleLike = (postId) => {
    if (!currentUser) return;

    // --- ID LOGIC UPDATED ---
    const uniqueUserId = currentUser.id || currentUser.id_no || currentUser.roll_number;
    if (!uniqueUserId) {
      console.error("Like karne ke liye unique user ID nahi mila.");
      return;
    }
    // --- END ID LOGIC ---

    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
      	// --- ID LOGIC UPDATED ---
      	const isLiked = p.likes.includes(uniqueUserId); // .uid ki jagah uniqueUserId
      	let newLikes;
      	if (isLiked) {
        	// Unlike
        	newLikes = p.likes.filter(id => id !== uniqueUserId); // .uid ki jagah uniqueUserId
      	} else {
        	// Like
      	  newLikes = [...p.likes, uniqueUserId]; // .uid ki jagah uniqueUserId
      	}
      	// --- END ID LOGIC ---
      	return { ...p, likes: newLikes };
      }
      return p;
    });

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };
  // --- END LOCAL STORAGE CHANGE ---

  return (
    <div className="absolute left-0 md:left-[22%] top-[15%] flex flex-col lg:flex-row gap-10 m-4 md:m-0 z-10 text-font-color w-[90vw] md:w-auto">
      {/* Left/Main Section */}
      <div className="flex flex-col gap-6 w-full lg:w-[45vw]">
        {/* Write Post Section */}
      	<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
          {/* Profile Photo */}
          <img
            src={currentUser?.profile_photo_url || userProfile}
            alt="User"
            className="w-[3rem] h-[3rem] rounded-full hidden md:block"
          />

          {/* Textarea Box */}
          <div className="relative flex flex-col w-full border border-gray-300 bg-white rounded-[10px] px-3 py-2">
            <textarea
              placeholder={
            	  currentUser ? "Write a post..." : "Loading user data..."
            	}
              rows={selectedImage ? 2 : 1}
            	className="font-montserrat text-gray-87 outline-none resize-none w-full text-[16px] placeholder:text-gray-400 bg-transparent p-1"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              disabled={loading || !currentUser} // User load nahi hone par disable
            />

            {/* Image Preview */}
            {selectedImage && (
              <div className="relative mt-2 w-fit">
                <img
                  src={selectedImage}
                	alt="Preview"
                	className="w-[40%] sm:w-[25%] rounded-[10px] object-cover"
                />
                <button
                  onClick={removeImage}
                	className="absolute top-2 right-2 bg-white/90 rounded-full p-[3px] text-gray-700 hover:text-red-500"
                  title="Remove image"
                  disabled={loading}
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Upload Icon */}
            <div className="absolute right-4 bottom-3">
              <Image
              	className={`text-gray-87 ${
            	  loading || !currentUser
            		? "text-gray-400"
            		: "cursor-pointer hover:text-accent"
            	}`}
                size={22}
                onClick={!loading && currentUser ? handleFileSelect : undefined}
              />
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              disabled={loading || !currentUser}
            />
          </div>

          {/* Share Button */}
          <button
          	className="px-4 py-2 bg-secondary-accent text-accent text-[15px] font-bold font-manrope rounded-[10px] shadow-sm hover:opacity-90 transition w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
E         onClick={handleSharePost}
            disabled={loading || !currentUser}
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>

        {/* Post Feed */}
      	{posts.map((post) => (
        	<Post
          	key={post.id}
          	post={post}
          	currentUser={currentUser}
          	onToggleLike={handleToggleLike}
        	/>
      	))}
      </div>

      {/* Right Section: Suggested Friends */}
      <div className="w-full lg:w-auto">
        <SuggestedFriends />
      </div>
    </div>
  );
};

export default Community;