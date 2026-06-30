import { useState } from "react";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { Image as ImageIcon, Video as VideoIcon, X } from 'lucide-react';

function CreatePost({ onPostCreated }) {
    const [content, setContent] = useState("");
    const [media, setMedia] = useState(null);
    const [preview, setPreview] = useState(null);

    // Handle file select
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Remove selected media
    const clearMedia = () => {
        setMedia(null);
        setPreview(null);
    };

    // Submit post
    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("content", content);

            if (media) {
                formData.append("media", media);
            }

            await API.post("/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Post created!");

            // Reset
            setContent("");
            clearMedia();
            onPostCreated(); 

        } catch (error) {
            toast.error("Failed to create post");
        }
    };

    // Auto-resize textarea
    const handleInput = (e) => {
    e.target.style.height = "auto"; 
    e.target.style.height = e.target.scrollHeight + "px";
};

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 mt-20 max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
                {/* USER AVATAR */}
                <img
                    src="/default_pfp.jpg"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                    alt="user"
                />

                <div className="flex-1">
                    {/* TEXT AREA CONTAINER */}
                    <div className="w-full">
                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onInput={handleInput}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full text-lg border-none outline-none focus:ring-0 resize-none p-0 min-h-10 max-h-30 placeholder-gray-400"
                        />
                    </div>

                    {/* PREVIEW CONTAINER - Added 'group' class here */}
                    {preview && (
                        <div className="mt-3 w-full relative rounded-xl overflow-hidden border border-gray-100 group">
                            <button
                                onClick={clearMedia}
                                className="absolute top-2 right-2 p-1.5 bg-gray-900/60 hover:bg-gray-900/80 rounded-full text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            
                            {media?.type.startsWith("image") ? (
                                <img 
                                    src={preview} 
                                    className="w-full object-cover max-h-87.5 transition-transform duration-500 hover:scale-105 rounded-xl" 
                                    alt="Post preview"
                                />
                            ) : (
                                <video 
                                    src={preview} 
                                    controls 
                                    className="w-full rounded-xl max-h-87.5 object-cover" 
                                />
                            )}
                        </div>
                    )}

                    {/* DIVIDER */}
                    <div className="h-px bg-gray-100 my-4" />

                    {/* ACTIONS */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-1 sm:gap-2">
                            <label className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-blue-50 text-blue-600 cursor-pointer transition-colors text-sm font-medium">
                                <ImageIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">Photo</span>
                                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                            </label>
                            
                            <label className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-purple-50 text-purple-600 cursor-pointer transition-colors text-sm font-medium">
                                <VideoIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">Video</span>
                                <input type="file" hidden onChange={handleFileChange} accept="video/*" />
                            </label>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() && !media}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 active:scale-95 ${
                                content.trim() || media
                                    ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-100"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;