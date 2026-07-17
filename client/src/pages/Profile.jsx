import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Components
import FeedCard from "../components/FeedCard";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import EditProfileModal from "../components/profile/EditProfileModal";
import AboutSection from "../components/profile/AboutSection";

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
                    location: res.data.location || "",
                    website: res.data.website || "",
                    work: res.data.about?.work || "",
                    education: res.data.about?.education || "",
                    interests: res.data.about?.interests || [],
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
            formData.append("work", form.work);
            formData.append("education", form.education);
            formData.append(
                "interests",
                JSON.stringify(form.interests)
            );

            if (file) {
                formData.append("profilePic", file);
            }

            if (coverFile) {
                formData.append("coverPic", coverFile);
            }

            formData.append(
                "settings",
                JSON.stringify(user.settings)
            );

            const res = await API.put("/profile", formData);

            // Update UI
            setUser(res.data);

            // Success message
            toast.success("Profile updated successfully!");

            // Close modal
            setShowModal(false);

            // Reset selected files
            setFile(null);
            setCoverFile(null);

        } catch (err) {
            console.error(err);
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
            <ProfileHeader
                user={user}
                postsCount={posts.length}
                isOwn={isOwn}
                isFollowing={isFollowing}
                onFollow={handleFollow}
                onEdit={() => setShowModal(true)}
            />

            {/* ================= TABS ================= */}

            <ProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <div className="bg-white rounded-2xl shadow mt-6 p-6">
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
                    <AboutSection user={user} />
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


            {/* MODAL */}
            {showModal && (
                <EditProfileModal
                    form={form}
                    setForm={setForm}
                    setFile={setFile}
                    setCoverFile={setCoverFile}
                    onSave={handleUpdate}
                    onClose={() => setShowModal(false)}
                />
            )}

        </div>
    );
}

export default Profile;