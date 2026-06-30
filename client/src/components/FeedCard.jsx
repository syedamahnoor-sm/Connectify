import { Heart, MessageCircle, Share2, Bookmark, Play, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { timeAgo } from "../utils/timeAgo";
import { useState } from 'react';
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function FeedCard({ post, handleLike, setPosts }) {

    const navigate = useNavigate();

    const [commentText, setCommentText] = useState("");
    const [showHeart, setShowHeart] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [editingPost, setEditingPost] = useState(false);
    const [editPostText, setEditPostText] = useState(post.content);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id || localStorage.getItem("userId");


    const isLiked = post.likes
        ?.map(id => id.toString())
        .includes(userId);
    const type =
        post.mediaType === "image"
            ? "photo"
            : post.mediaType === "video"
                ? "video"
                : "text";

    const author = {
        name: post.user?.name || "Unknown",
        username: post.user?.username || "user",
        avatar: post.user?.profilePic || "/default_pfp.jpg"
    };

    // ADD COMMENT
    const handleComment = async () => {
        if (!commentText.trim()) return;

        const tempComment = {
            _id: Date.now(),
            user: {
                _id: userId,
                name: user?.name,
                username: user?.username,
                profilePic: user?.profilePic,
            },
            text: commentText,
            createdAt: new Date(),
        };
        setPosts(prev =>
            prev.map(p =>
                p._id === post._id
                    ? { ...p, comments: [...(p.comments || []), tempComment] }
                    : p
            )
        );

        setCommentText("");
        setShowComments(true);

        try {
            const res = await API.post(`/posts/${post._id}/comment`, {
                text: tempComment.text,
            });

            setPosts(prev =>
                prev.map(p =>
                    p._id === post._id
                        ? { ...p, comments: res.data }
                        : p
                )
            );

        } catch {
            toast.error("Failed to comment");
        }
    };

    // DELETE COMMENT
    const handleDelete = async (commentId) => {
        const oldComments = post.comments;

        // optimistic update
        setPosts(prev =>
            prev.map(p =>
                p._id === post._id
                    ? { ...p, comments: p.comments.filter(c => String(c._id) !== String(commentId)) }
                    : p
            )
        );

        try {
            await API.delete(`/posts/${post._id}/comment/${commentId}`);
        } catch {
            toast.error("Failed to delete comment");

            setPosts(prev =>
                prev.map(p =>
                    p._id === post._id
                        ? { ...p, comments: oldComments }
                        : p
                )
            );
        }
    };

    // EDIT COMMENT
    const handleEdit = async (commentId) => {

        if (!editText.trim()) return;
        const oldComments = post.comments;

        setPosts(prev =>
            prev.map(p =>
                p._id === post._id
                    ? {
                        ...p,
                        comments: p.comments.map(c =>
                            c._id.toString() === commentId.toString()
                                ? { ...c, text: editText }
                                : c
                        ),
                    }
                    : p
            )
        );

        setEditingId(null);

        try {
            await API.put(`/posts/${post._id}/comment/${commentId}`, {
                text: editText,
            });
        } catch {
            toast.error("Failed to edit comment");

            setPosts(prev =>
                prev.map(p =>
                    p._id === post._id
                        ? { ...p, comments: oldComments }
                        : p
                )
            );
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Post link copied!");
    };

    const handleBookmark = () => {
        let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

        if (bookmarks.includes(post._id)) {
            bookmarks = bookmarks.filter(id => id !== post._id);
        } else {
            bookmarks.push(post._id);
        }

        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        toast.success("Saved!");
    };

    const handleDeletePost = async () => {
        const oldPosts = post;

        setPosts(prev => prev.filter(p => p._id !== post._id));

        try {
            await API.delete(`/posts/${post._id}`);
            toast.success("Post deleted");
        } catch (err) {
            toast.error("Failed to delete post");

            setPosts(prev => [...prev, oldPosts]);
        }
    };

    const handleEditPost = async () => {
        if (!editPostText.trim()) return;

        const oldContent = post.content;   

        setPosts(prev =>
            prev.map(p =>
                p._id === post._id ? { ...p, content: editPostText } : p
            )
        );

        try {
            await API.put(`/posts/${post._id}`, {
                content: editPostText,
            });

            setEditingPost(false);
        } catch (err) {
            toast.error("Failed to edit post");

            setPosts(prev =>
                prev.map(p =>
                    p._id === post._id ? { ...p, content: oldContent } : p
                )
            );
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-300 overflow-hidden hover:shadow-lg transition-shadow mb-10">

            {/* HEADER */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
                <div
                    onClick={() => navigate(`/profile/${post.user._id}`)}
                    className="flex items-center gap-3 cursor-pointer">
                    <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-semibold text-sm">{author.name}</h3>
                        <p className="text-xs text-gray-500">
                            @{author.username} • {timeAgo(post.createdAt)}
                        </p>
                    </div>
                </div>

                <button className="text-gray-400 hover:text-gray-600">
                    <div className="flex gap-2">

                        {post.user?._id === userId && (
                            <>
                                <Edit2
                                    onClick={() => setEditingPost(true)}
                                    className="w-5 h-5 cursor-pointer text-gray-400 hover:text-blue-500"
                                />
                                <Trash2
                                    onClick={handleDeletePost}
                                    className="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-500"
                                />
                            </>
                        )}

                        <MoreHorizontal className="w-5 h-5" />

                    </div>
                </button>
            </div>

            {/* CONTENT */}
            {post.content && (
                <div
                    onDoubleClick={() => {
                        handleLike(post._id);
                        setShowHeart(true);
                        setTimeout(() => setShowHeart(false), 600);
                    }}
                    className="p-4 mt-2 mb-2">
                    {editingPost ? (
                        <div className="flex gap-2">
                            <input
                                value={editPostText}
                                onChange={(e) => setEditPostText(e.target.value)}
                                className="flex-1 border rounded px-2 py-1"
                            />

                            <button
                                onClick={handleEditPost}
                                className="text-blue-500 text-sm"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => setEditingPost(false)}
                                className="text-gray-500 text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-800">{post.content}</p>
                    )}
                </div>
            )}

            {/* IMAGE */}
            {type === "photo" && post.media && (
                <div
                    onDoubleClick={() => {
                        handleLike(post._id);
                        setShowHeart(true);
                        setTimeout(() => setShowHeart(false), 600);
                    }}
                    className="relative cursor-pointer group active:scale-[0.98] transition-transform"
                >
                    {showHeart && (
                        <Heart
                            className="absolute inset-0 m-auto w-20 h-20 text-white animate-ping"
                            fill="currentColor"
                        />
                    )}
                    <img
                        src={post.media}
                        className="w-full h-64 object-cover"
                        alt="post media"
                    />
                </div>
            )}

            {/* VIDEO */}
            {type === "video" && post.media && (
                <div
                    onDoubleClick={() => {
                        handleLike(post._id);
                        setShowHeart(true);
                        setTimeout(() => setShowHeart(false), 600);
                    }}
                    className="relative">
                    <video
                        src={post.media}
                        controls
                        className="w-full h-64 object-cover"
                    />
                </div>
            )}

            {/* ACTIONS */}
            <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-6">

                        <button
                            onClick={() => handleLike(post._id)}
                            className={`flex items-center gap-2 transition-all active:scale-75 ${isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
                                }`}
                        >
                            <Heart
                                className={`w-5 h-5 transition-all duration-300 ${isLiked
                                    ? "fill-red-500 text-red-500 scale-110"
                                    : "fill-none scale-100"
                                    }`}
                            />
                            <span className={`text-sm ${isLiked ? "font-bold" : "font-normal"}`}>
                                {post.likes?.length || 0}
                            </span>
                        </button>

                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm">{post.comments?.length || 0}</span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 text-gray-600 hover:text-green-500">
                            <Share2 className="w-5 h-5" />
                        </button>

                    </div>

                    <button
                        onClick={handleBookmark}
                        className="text-gray-600 hover:text-yellow-500">
                        <Bookmark className="w-5 h-5" />
                    </button>

                </div>
            </div>

            {/* TOGGLE */}
            {post.comments?.length > 0 && (
                <div className="px-4 text-sm text-gray-500 cursor-pointer hover:underline"
                    onClick={() => setShowComments(!showComments)}
                >
                    {showComments
                        ? "Hide comments"
                        : `View comments (${post.comments.length})`}
                </div>
            )}
            {/* COMMENT INPUT */}
            <div className="px-4 pb-3">
                <div className="flex gap-2 mt-2">

                    <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 border border-gray-400 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none"
                    />

                    <button
                        onClick={handleComment}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 active:scale-95 ${commentText.trim()
                            ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-100"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Post
                    </button>

                </div>
            </div>

            {/* COMMENTS LIST */}
            <div
                className={`px-4 pb-3 space-y-2 transition-all duration-300 overflow-hidden ${showComments
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                    }`}
            >
                {post.comments?.map((comment) => (
                    <div key={comment._id} className="flex gap-2 items-start group">

                        <img
                            src={comment.user?.profilePic || "/default_pfp.jpg" }
                            className="w-6 h-6 rounded-full"
                        />

                        <div className="flex-1">

                            {editingId === comment._id ? (
                                <div className="flex gap-2">
                                    <input
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="flex-1 border rounded px-2 py-1 text-sm"
                                    />
                                    <button
                                        onClick={() => handleEdit(comment._id)}
                                        className="text-blue-500 text-sm"
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-gray-100 px-3 py-1 rounded-lg">
                                    <p className="text-sm font-semibold">
                                        {comment.user?.name}
                                    </p>
                                    <p className="text-sm">{comment.text}</p>
                                    <p className="text-xs text-gray-400">
                                        {timeAgo(comment.createdAt)}
                                    </p>
                                </div>
                            )}

                        </div>

                        {/* ACTIONS */}
                        {comment.user?._id === userId && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">

                                <Edit2
                                    onClick={() => {
                                        setEditingId(comment._id);
                                        setEditText(comment.text);
                                    }}
                                    className="w-4 cursor-pointer text-gray-500 hover:text-blue-500"
                                />

                                <Trash2
                                    onClick={() => handleDelete(comment._id)}
                                    className="w-4 cursor-pointer text-gray-500 hover:text-red-500"
                                />

                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeedCard;