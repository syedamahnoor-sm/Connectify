import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import API from "../api/axiosInstance";
import socket from "../socket";

const MessagesSidebar = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const currentUserId = localStorage.getItem("userId");

    const fetchUsers = async () => {
        try {
            const res = await API.get("/messages/conversations");
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users");
        }
    };


    useEffect(() => {
        fetchUsers();
    }, [currentUserId]);


    useEffect(() => {
        socket.on("conversationUpdated", () => {
            fetchUsers();
        });

        return () => {
            socket.off("conversationUpdated");
        };
    }, []);


    useEffect(() => {
        socket.emit("addUser", currentUserId);
        socket.on("getUsers", (users) => {
            setOnlineUsers(users);
        });
        return () => socket.off("getUsers");
    }, [currentUserId]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
                <MessageCircle size={20} className="text-purple-600" />
                <h3 className="font-bold text-gray-800">Messages</h3>
            </div>

            <div className="space-y-1 overflow-y-auto max-h-100 custom-scrollbar">
                {users.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No conversations yet
                        Start chatting with someone</p>
                ) : (
                    users.map((user) => (
                        <div
                            key={user.userId}
                            onClick={() => navigate(`/chat/${user.userId}`)}
                            className="flex items-center gap-3 cursor-pointer hover:bg-purple-50 transition-all p-2 rounded-xl group"
                        >
                            <div className="relative shrink-0">
                                <img
                                    src={user.profilePic || "/default_pfp.jpg"}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-purple-200"
                                />
                                {user.isOnline && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                )}
                            </div>

                            <div className="overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm text-gray-800 truncate mr-2">
                                        {user.name}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        {user.unreadCount > 0 && (
                                            <span className="bg-purple-600 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-medium">
                                                {user.unreadCount}
                                            </span>
                                        )}

                                        <span className="text-[10px] text-gray-400">
                                            {new Date(user.lastMessageTime).toLocaleDateString([], {
                                                month: "numeric",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <p
                                    className={`text-[11px] truncate group-hover:text-purple-600 ${user.unreadCount > 0
                                        ? "font-medium text-gray-800"
                                        : "text-gray-500"
                                        }`}
                                >
                                    {user.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MessagesSidebar;