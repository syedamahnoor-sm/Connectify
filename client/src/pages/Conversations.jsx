import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import socket from "../socket";

function Conversations() {
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();

    const fetchConversations = async () => {
        try {
            const res = await API.get("/messages/conversations");
            setConversations(res.data);
        } catch (err) {
            console.error("Failed to load conversations");
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);


    useEffect(() => {
        socket.on("conversationUpdated", () => {
            fetchConversations();
        });

        return () => {
            socket.off("conversationUpdated");
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto pt-35 px-4">
            <h1 className="text-2xl font-bold mb-4">
                Messages
            </h1>

            <div className="bg-white rounded-xl border">
                {conversations.map((user) => (
                    <button
                        key={user.userId}
                        onClick={() => navigate(`/chat/${user.userId}`)}
                        className="w-full flex items-center gap-3 p-4 border-b hover:bg-gray-50 text-left"
                    >
                        <img
                            src={user.profilePic || "/avatar.png"}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold">
                                {user.name}
                            </p>

                            <p className="text-sm text-gray-500 truncate">
                                {user.lastMessage}
                            </p>
                        </div>

                        {user.unreadCount > 0 && (
                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                                {user.unreadCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Conversations;