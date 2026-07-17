import { useNavigate } from "react-router-dom";
import FeedCard from "../FeedCard";

function PostsSection({
    posts,
    user,
    isOwn,
    handleLike,
}) {

    const navigate = useNavigate();

    const sortedPosts = [...posts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    if (sortedPosts.length === 0) {
        return (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl py-20 px-8 text-center">

                <div className="text-6xl mb-5">
                    📝
                </div>

                <h2 className="text-2xl font-bold text-gray-800">
                    No posts yet
                </h2>

                <p className="text-gray-500 mt-3 max-w-md mx-auto">
                    {isOwn
                        ? "Start sharing your ideas, projects, or experiences with the community."
                        : `${user.name} hasn't posted anything yet.`}
                </p>

                {isOwn && (
                    <button
                        onClick={() => navigate("/create-post")}
                        className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition"
                    >
                        Create Your First Post
                    </button>
                )}

            </div>
        );
    }

    return (
        <div>

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h2 className="text-2xl font-bold text-gray-900">
                        Posts
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {sortedPosts.length} {sortedPosts.length === 1 ? "Post" : "Posts"}
                    </p>

                </div>

            </div>

            <div className="space-y-6">

                {sortedPosts.map((post) => (

                    <FeedCard
                        key={post._id}
                        post={post}
                        handleLike={handleLike}
                    />

                ))}

            </div>

        </div>
    );
}

export default PostsSection;