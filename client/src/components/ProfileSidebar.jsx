import { useNavigate } from "react-router-dom";
import { UserCircle, Settings } from "lucide-react";

const ProfileSidebar = ({ user, postsCount }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Simple Cover Header */}
            <div className="h-16 bg-gradient-to-r from-purple-500 to-purple-700"></div>

            <div className="p-5 -mt-10">
                <div
                    className="cursor-pointer inline-block"
                    onClick={() => navigate(`/profile/${user?._id}`)}
                >
                    <img
                        src={user?.profilePic || "/default_pfp.jpg"}
                        className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-sm bg-white"
                        alt="Profile"
                    />
                </div>

                <div className="mt-3">
                    <h3 className="font-bold text-lg text-gray-800 leading-tight">{user?.name}</h3>
                    <p className="text-sm text-gray-500">@{user?.username}</p>
                </div>

                {/* Stats Bar */}
                <div className="flex justify-between mt-6 py-4 border-y border-gray-50 text-center">
                    <div className="flex-1">
                        <p className="font-bold text-gray-800">{postsCount || 0}</p>
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Posts</p>
                    </div>
                    <div className="flex-1 border-x border-gray-50">
                        <p className="font-bold text-gray-800">{user?.followers?.length || 0}</p>
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Followers</p>
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-gray-800">{user?.following?.length || 0}</p>
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Following</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/profile/${user?._id}`)}
                    className="w-full mt-5 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all active:scale-95"
                >
                    <Settings size={16} />
                    Manage Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileSidebar;