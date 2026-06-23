import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import socket from "../socket";
import toast from "react-hot-toast";
import { Bell, Heart, MessageSquare, User, Trash2 } from "lucide-react";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await API.get("/notifications");
            setNotifications(res.data);
        } catch (err) {
            console.error("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        socket.on("newNotification", (data) => {
            // Update UI list in real-time
            setNotifications((prev) => [data, ...prev]);

            // Show toast
            if (data.type === "message") {
                toast.success("📩 New message received!");
            } else if (data.type === "like") {
                toast("❤️ Someone liked your post!", { icon: '🔥' });
            }
        });

        return () => socket.off("newNotification");
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-35 pb-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Bell size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                    </div>
                    {notifications.length > 0 && (
                        <button className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
                            <Trash2 size={14} /> Clear All
                        </button>
                    )}
                </div>

                {/* Notification List */}
                <div className="divide-y divide-gray-50">
                    {loading ? (
                        <div className="p-10 text-center text-gray-400">Loading your activity...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell size={32} className="text-gray-200" />
                            </div>
                            <p className="text-gray-500 font-medium">All caught up!</p>
                            <p className="text-sm text-gray-400">No new notifications yet.</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n._id}
                                className={`p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? "bg-purple-50/30" : ""}`}
                            >
                                {/* Icon/Avatar Section */}
                                <div className="relative">
                                    <img
                                        src={n.sender?.profilePic || "/avatar.png"}
                                        className="w-11 h-11 rounded-full object-cover border border-gray-100"
                                        alt="Sender"
                                    />
                                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white ${n.type === 'like' ? 'bg-pink-500' : 'bg-blue-500'
                                        }`}>
                                        {n.type === 'like' ? <Heart size={10} fill="currentColor" /> : <MessageSquare size={10} fill="currentColor" />}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800 leading-tight">
                                        <span className="font-bold hover:underline">
                                            {n.sender?.username || "Someone"}
                                        </span>{" "}
                                        {n.type === "like"
                                            ? "liked your recent post"
                                            : "sent you a direct message"}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-1 font-medium uppercase tracking-wider">
                                        Just now
                                    </p>
                                </div>

                                {/* Unread Dot */}
                                {!n.read && (
                                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                                )}
                            </div>
                        )
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;