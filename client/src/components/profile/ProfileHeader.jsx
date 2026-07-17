import {
    MapPin,
    Globe,
    CalendarDays,
    MessageCircle,
    Share2,
    Camera,
    Briefcase,
    GraduationCap
} from "lucide-react";

import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function ProfileHeader({
    user,
    postsCount,
    isOwn,
    isFollowing,
    onFollow,
    onEdit,
}) {

    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow overflow-hidden">

            {/* ================= COVER ================= */}

            <div
                className="relative h-40 md:h-44 bg-linear-to-r from-purple-700 via-fuchsia-600 to-indigo-700"
                style={
                    user.coverPic
                        ? {
                            backgroundImage: `url(${user.coverPic})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }
                        : {}
                }
            >

                {/* Dark overlay */}

                <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent"></div>

                {/* Edit Cover */}

                {isOwn && (
                    <button
                        onClick={onEdit}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white transition px-4 py-2 rounded-xl flex items-center gap-2 shadow-md"
                    >
                        <Camera size={18} />
                        Edit Cover
                    </button>
                )}
            </div>

            {/* ================= PROFILE ================= */}

            <div className="px-8 pb-8">

                {/* Avatar */}

                <div className="relative z-20 -mt-16 flex justify-between items-end">

                    <img
                        src={user.profilePic || "/default_pfp.jpg"}
                        alt={user.name}
                        className="w-32 h-32 rounded-full border-[6px] border-white object-cover shadow-xl bg-white"
                    />

                    <div className="flex gap-3 mt-8">

                        {isOwn ? (

                            <button
                                onClick={onEdit}
                                className="px-5 py-2.5 rounded-xl border font-medium hover:bg-gray-100 transition"
                            >
                                Edit Profile
                            </button>

                        ) : (

                            <>
                                <button
                                    onClick={onFollow}
                                    className={`px-6 py-2.5 rounded-xl font-medium transition ${isFollowing
                                        ? "bg-gray-200 hover:bg-gray-300"
                                        : "bg-purple-600 text-white hover:bg-purple-700"
                                        }`}
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </button>

                                <button
                                    onClick={() => navigate(`/chat/${user._id}`)}
                                    className="px-5 py-2.5 rounded-xl border hover:bg-gray-100 transition"
                                >
                                    <MessageCircle size={18} />
                                </button>
                            </>

                        )}

                        <button
                            className="px-5 py-2.5 rounded-xl border hover:bg-gray-100 transition"
                        >
                            <Share2 size={18} />

                        </button>

                    </div>

                </div>

                {/* Name */}

                <div className="mt-4">

                    <h1 className="text-3xl font-bold text-gray-900">
                        {user.name}
                    </h1>

                    <p className="text-gray-500 text-lg">
                        @{user.username}
                    </p>

                    <p className="mt-4 max-w-xl leading-relaxed text-gray-700">
                        {user.bio ? (
                            user.bio
                        ) : (
                            <span className="italic text-gray-400">
                                Tell people a little about yourself.
                            </span>
                        )}
                    </p>

                </div>

                {/* Information */}

                <div className="flex flex-wrap gap-6 mt-5 text-sm text-gray-600">

                    {user.location && (
                        <div className="flex items-center gap-2">
                            <MapPin size={17} />
                            {user.location}
                        </div>
                    )}

                    {user.website && (
                        <a
                            href={user.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 hover:text-purple-600"
                        >
                            <Globe size={17} />
                            {user.website.replace(/^https?:\/\//, "")}
                        </a>
                    )}

                    {user.about?.work && (
                        <div className="flex items-center gap-2">
                            <Briefcase size={17} />
                            {user.about.work}
                        </div>
                    )}

                    {user.about?.education && (
                        <div className="flex items-center gap-2">
                            <GraduationCap size={17} />
                            {user.about.education}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <CalendarDays size={17} />
                        Joined {format(new Date(user.joinedAt), "MMMM yyyy")}
                    </div>

                </div>

                {/* Stats */}

                <div className="flex gap-10 mt-8">

                    <div className="bg-gray-50 rounded-xl px-4 py-2 text-center">
                        <h3 className="text-xl font-bold">
                            {postsCount}
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Posts
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl px-6 py-4 text-center">
                        <h3 className="text-xl font-bold">
                            {user.followers.length}
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Followers
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl px-6 py-4 text-center">
                        <h3 className="text-xl font-bold">
                            {user.following.length}
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Following
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProfileHeader;