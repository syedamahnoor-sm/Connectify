import { useNavigate } from "react-router-dom";

function ProfileHeader({ user, postsCount, isOwn, isFollowing, onFollow, onEdit }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-6 rounded-xl shadow">

            <div className="flex gap-6 items-center">

                {/* AVATAR */}
                <img
                    src={user.profilePic || "/default_pfp.jpg"}
                    className="w-28 h-28 rounded-full object-cover border"
                />

                {/* INFO */}
                <div className="flex-1">

                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold">{user.name}</h2>

                        {isOwn ? (
                            <button
                                onClick={onEdit}
                                className="px-4 py-1 border rounded-lg hover:bg-gray-100"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={onFollow}
                                className={`px-4 py-1 rounded-lg ${isFollowing ? "bg-gray-300" : "bg-blue-500 text-white"
                                    }`}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>

                    <p className="text-gray-500">@{user.username}</p>

                    <div className="flex gap-6 mt-3 text-sm">
                        <span><b>{postsCount}</b> posts</span>
                        <span><b>{user.followers.length}</b> followers</span>
                        <span><b>{user.following.length}</b> following</span>
                    </div>

                    <p className="mt-3 text-gray-700">{user.bio}</p>

                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;