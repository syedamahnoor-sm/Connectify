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
import MediaSection from "../components/profile/MediaSection";
import PostsSection from "../components/profile/PostsSection";
import SettingsSection from "../components/profile/SettingsSection";

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
    const [isPrivateProfile, setIsPrivateProfile] = useState(false);

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

                if (error.response?.status === 403) {
                    setIsPrivateProfile(true);
                    return;
                }

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

    if (isPrivateProfile) {
        return (
            <div className="max-w-xl mx-auto mt-32 bg-white rounded-2xl shadow p-10 text-center">

                <div className="text-6xl mb-6">
                    🔒
                </div>

                <h2 className="text-2xl font-bold">
                    Private Profile
                </h2>

                <p className="text-gray-500 mt-3">
                    This user has chosen to keep their profile private.
                </p>

            </div>
        );
    }

    if (!user) return <p className="text-center mt-10">Loading profile...</p>;

    const isOwn = currentUser._id === user._id;

    const isFollowing = user.followers
        .map((id) => id.toString())
        .includes(currentUser._id);


    const handleDeleteAccount = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to permanently delete your account?"
        );

        if (!confirmed) return;

        try {

            await API.delete("/users/delete-account");

            toast.success("Account deleted.");
            localStorage.clear();
            navigate("/login");

        } catch (err) {

            toast.error(
                err.response?.data?.message || "Failed to delete account."
            );

        }

    };

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
                    <PostsSection
                        posts={posts}
                        user={user}
                        isOwn={isOwn}
                        handleLike={handleLike}
                    />
                )}

                {/* MEDIA */}
                {activeTab === "media" && (
                    <MediaSection
                        posts={posts}
                        user={user}
                        isOwn={isOwn}
                    />
                )}

                {/* ABOUT */}
                {activeTab === "about" && (
                    <AboutSection user={user} />
                )}

                {/* SETTINGS */}
                {activeTab === "settings" && (
                    <SettingsSection
                        user={user}
                        handleSettingChange={handleSettingChange}
                        handleDeleteAccount={handleDeleteAccount}
                    />
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