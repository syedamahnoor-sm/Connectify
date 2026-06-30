import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Components
import FeedCard from "../components/FeedCard";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import PhotoGrid from "../components/profile/PhotoGrid";
import EditProfileModal from "../components/profile/EditProfileModal";

function Profile() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    const [activeTab, setActiveTab] = useState("posts");
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        name: "",
        bio: "",
    });

    const [file, setFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    // =============================
    //    FETCH PROFILE + POSTS
    // =============================
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get(`/profile/${id}`);
                setUser(res.data);

                setForm({
                    name: res.data.name,
                    bio: res.data.bio || "",
                });

                const postRes = await API.get("/posts");

                const userPosts = postRes.data.filter(
                    (p) => p.user._id === id
                );

                setPosts(userPosts);

            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile");
            }
        };

        fetchProfile();
    }, [id]);

    // =============================
    //      FOLLOW / UNFOLLOW
    // =============================
    const handleFollow = async () => {
        try {
            const res = await API.put(`/profile/${id}/follow`);

            setUser((prev) => ({
                ...prev,
                followers: res.data.following
                    ? [...prev.followers, currentUser._id]
                    : prev.followers.filter(
                        (f) => f !== currentUser._id
                    ),
            }));

        } catch {
            toast.error("Failed to follow user");
        }
    };

    // =============================
    //       UPDATE PROFILE
    // =============================
    const handleUpdate = async () => {
        try {
            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("bio", form.bio);
            formData.append("location", form.location);
            formData.append("website", form.website);

            // PROFILE IMAGE
            if (file) {
                formData.append("profilePic", file);
            }

            // COVER IMAGE 
            if (coverFile) {
                formData.append("coverPic", coverFile);
            }

            // SETTINGS
            formData.append("settings", JSON.stringify(user.settings));

            const res = await API.put("/profile", formData);

            setUser(res.data);

        } catch (err) {
            toast.error("Update failed");
        }
    };

    // =============================
    //        LIKE HANDLER 
    // =============================
    const handleLike = async (postId) => {
        try {
            const userId = localStorage.getItem("userId");

            // optimistic UI
            setPosts((prev) =>
                prev.map((post) => {
                    if (post._id === postId) {
                        const alreadyLiked = post.likes
                            .map((id) => id.toString())
                            .includes(userId);

                        return {
                            ...post,
                            likes: alreadyLiked
                                ? post.likes.filter(
                                    (id) => id.toString() !== userId
                                )
                                : [...post.likes, userId],
                        };
                    }
                    return post;
                })
            );

            // backend sync
            const res = await API.put(`/posts/${postId}/like`);

            setPosts((prev) =>
                prev.map((post) =>
                    post._id === postId ? res.data : post
                )
            );

        } catch {
            toast.error("Like failed");
        }
    };

    const handleSettingChange = async (key, value) => {
        try {
            const updatedSettings = {
                ...user.settings,
                [key]: value,
            };

            await API.put("/profile/settings", updatedSettings);

            setUser(prev => ({
                ...prev,
                settings: updatedSettings,
            }));

        } catch {
            toast.error("Failed to update settings");
        }
    };
    // =============================
    //          CONDITIONS
    // =============================
    if (!user) return <p className="text-center mt-10">Loading...</p>;

    const isOwn = currentUser._id === user._id;

    const isFollowing = user.followers
        .map((id) => id.toString())
        .includes(currentUser._id);

    // =============================
    //             UI
    // =============================
    return (
        <div className="max-w-5xl mx-auto mt-25 mb-25">

            {/* ================= HEADER ================= */}
            <div className="bg-white rounded-xl shadow overflow-hidden">

                {/* COVER */}
                <div
                    className="h-48 bg-cover bg-center relative"
                    style={{
                        backgroundImage: `url(${user.coverPic || ""})`,
                    }}
                >

                    {/* EDIT COVER BUTTON */}
                    {isOwn && (
                        <>
                            <label className="absolute right-4 bottom-4 bg-white px-3 py-1 rounded-lg shadow text-sm cursor-pointer">
                                📷 Edit Cover
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setCoverFile(e.target.files[0])}
                                />
                            </label>
                        </>
                    )}

                </div>

                {/* PROFILE SECTION */}
                <div className="p-6 relative">

                    {/* AVATAR */}
                    <div className="absolute -top-12 left-6">
                        <img
                            src={user.profilePic || "/default_pfp.jpg"}
                            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
                        />
                    </div>

                    {/* EDIT PROFILE BUTTON */}
                    <div className="flex justify-end">
                        {isOwn ? (
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            >
                                ✏️ Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleFollow}
                                    className={`px-4 py-2 rounded-lg ${isFollowing
                                        ? "bg-gray-300"
                                        : "bg-blue-500 text-white"
                                        }`}
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>

                                <button
                                    onClick={() => navigate(`/chat/${user._id}`)}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                                >
                                    Message
                                </button>
                            </div>
                        )}
                    </div>

                    {/* NAME */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-gray-500">@{user.username}</p>

                        <p className="mt-2 text-gray-700">{user.bio}</p>

                        {/* DETAILS */}
                        <div className="flex gap-6 text-sm text-gray-600 mt-3">
                            <span>📍 {user.location || "No location"}</span>

                            <span>
                                🔗 {user.website ? (
                                    <a href={user.website} className="text-blue-500">
                                        {user.website}
                                    </a>
                                ) : "No website"}
                            </span>

                            <span>
                                📅 Joined {new Date(user.joinedAt).toLocaleDateString()}
                            </span>
                        </div>

                        {/* STATS */}
                        <div className="flex gap-6 mt-4">
                            <span><b>{posts.length}</b> Posts</span>
                            <span><b>{user.followers.length}</b> Followers</span>
                            <span><b>{user.following.length}</b> Following</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= TABS ================= */}
            <div className="bg-white mt-6 rounded-xl shadow">
                <div className="flex border-b">

                    {["posts", "media", "about", "settings"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 capitalize ${activeTab === tab
                                ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                                : "text-gray-500"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}

                </div>

                <div className="p-4">

                    {/* POSTS */}
                    {activeTab === "posts" && (
                        posts.length > 0 ? (
                            posts.map(post => (
                                <FeedCard
                                    key={post._id}
                                    post={post}
                                    handleLike={handleLike}
                                />
                            ))
                        ) : (
                            <div className="py-16 text-center">
                                <div className="text-5xl mb-4">📝</div>

                                <h3 className="text-xl font-semibold text-gray-700">
                                    No posts yet
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    {isOwn
                                        ? "Share your first post with the community."
                                        : `${user.name} hasn't posted anything yet.`}
                                </p>

                                {isOwn && (
                                    <button
                                        onClick={() => navigate("/create-post")}
                                        className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
                                    >
                                        Create First Post
                                    </button>
                                )}
                            </div>
                        )
                    )}

                    {/* MEDIA */}
                    {activeTab === "media" && (
                        <div className="grid grid-cols-2 gap-4">
                            {posts.filter(p => p.media).map(post => (
                                <img
                                    key={post._id}
                                    src={post.media}
                                    className="rounded-lg"
                                />
                            ))}
                        </div>
                    )}

                    {/* ABOUT */}
                    {activeTab === "about" && (
                        <div>
                            <h3 className="font-semibold mb-2">About</h3>
                            <p>{user.bio}</p>

                            <h3 className="mt-4 font-semibold">Interests</h3>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {["Design", "Tech", "Art"].map(tag => (
                                    <span key={tag} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SETTINGS */}
                    {activeTab === "settings" && (
                        <div className="space-y-4">

                            {/* NOTIFICATIONS */}
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold">Email Notifications</h4>
                                    <p className="text-sm text-gray-500">
                                        Receive updates via email
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={user.settings?.emailNotifications}
                                    onChange={(e) =>
                                        handleSettingChange("emailNotifications", e.target.checked)
                                    }
                                />
                            </div>

                            {/* PUSH */}
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold">Push Notifications</h4>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={user.settings?.pushNotifications}
                                    onChange={(e) =>
                                        handleSettingChange("pushNotifications", e.target.checked)
                                    }
                                />
                            </div>

                            {/* PROFILE VISIBILITY */}
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                                <h4 className="font-semibold">Profile Visibility</h4>

                                <select
                                    value={user.settings?.profileVisibility}
                                    onChange={(e) =>
                                        handleSettingChange("profileVisibility", e.target.value)
                                    }
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>

                            {/* ONLINE STATUS */}
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                                <h4 className="font-semibold">Show Online Status</h4>

                                <input
                                    type="checkbox"
                                    checked={user.settings?.showOnlineStatus}
                                    onChange={(e) =>
                                        handleSettingChange("showOnlineStatus", e.target.checked)
                                    }
                                />
                            </div>

                            {/* MESSAGES */}
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                                <h4 className="font-semibold">Allow Messages</h4>

                                <input
                                    type="checkbox"
                                    checked={user.settings?.allowMessages}
                                    onChange={(e) =>
                                        handleSettingChange("allowMessages", e.target.checked)
                                    }
                                />
                            </div>

                            {/* DANGER */}
                            <div className="bg-red-100 p-4 rounded-lg text-red-600 text-center">
                                Delete Account
                            </div>

                        </div>
                    )}

                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <EditProfileModal
                    form={form}
                    setForm={setForm}
                    setFile={setFile}
                    onSave={handleUpdate}
                    onClose={() => setShowModal(false)}
                />
            )}

        </div>
    );
}

export default Profile;