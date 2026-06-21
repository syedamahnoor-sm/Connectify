import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Send, User } from "lucide-react";
import API from "../api/axiosInstance";
import socket from "../socket";

const Chat = () => {
    const { id: userId } = useParams();
    const currentUserId = localStorage.getItem("userId");
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const endRef = useRef();
    const [chatUser, setChatUser] = useState(null);

    //FETCH SINGLE USER
    useEffect(() => {
        const fetchChatUser = async () => {
            try {
                const res = await API.get(`/users/${userId}`);
                setChatUser(res.data);
            } catch (err) {
                console.error("Failed to fetch user");
            }
        };

        if (userId) {
            fetchChatUser();
        }
    }, [userId]);

    // FETCH MESSAGES
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await API.get(`/messages/${userId}`);
                setMessages(res.data);
            } catch (err) {
                console.error("Failed to fetch messages");
            }
        };
        if (userId) fetchMessages();
    }, [userId]);

    // AUTO SCROLL
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // SOCKET CONNECT
    useEffect(() => {
        socket.emit("addUser", currentUserId);
    }, [currentUserId]);

    // RECEIVE MESSAGE
    useEffect(() => {
        socket.on("receiveMessage", (data) => {
            setMessages(prev => [...prev, data]);
        });
        return () => socket.off("receiveMessage");
    }, []);

    const handleSend = async () => {
        if (!text.trim()) return;
        const newMsg = {
            sender: currentUserId,
            receiver: userId,
            text,
        };

        setMessages(prev => [...prev, newMsg]);

        try {
            await API.post("/messages", {
                receiverId: userId,
                text,
            });
            socket.emit("sendMessage", {
                senderId: currentUserId,
                receiverId: userId,
                text,
            });
            setText("");
        } catch {
            alert("Failed to send message");
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto bg-white shadow-lg mt-20 rounded-2xl overflow-hidden border border-gray-100">

            {/* CHAT HEADER */}
            <div className="p-4 border-b bg-white flex items-center gap-3">
                <img
                    src={chatUser?.profilePic || "/avatar.png"}
                    alt={chatUser?.username || chatUser?.name}
                    className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                    <h2 className="font-bold text-gray-800">
                        {chatUser?.username || chatUser?.name}
                    </h2>

                    <p className="text-xs text-gray-500">
                        Direct Message
                    </p>
                </div>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, i) => {
                    const isMe = msg.sender === currentUserId;
                    return (
                        <div
                            key={i}
                            className={`flex flex-col ${isMe ? "items-end" : "items-start"
                                }`}
                        >
                            <div
                                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe
                                    ? "bg-purple-600 text-white rounded-tr-none"
                                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                                    }`}
                            >
                                {msg.text}
                            </div>

                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    );
                })}
                <div ref={endRef}></div>
            </div>

            {/* INPUT AREA */}
            <div className="p-4 bg-white border-t">
                <div className="flex gap-2 bg-gray-100 p-2 rounded-xl border focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 bg-transparent px-2 py-1 outline-none text-sm"
                        placeholder="Write a message..."
                    />
                    <button
                        onClick={handleSend}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;