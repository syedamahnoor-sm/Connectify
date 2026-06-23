import {
    LayoutDashboard,
    MessageSquare,
    PlusSquare,
    Home,
    Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BottomNav() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    return (
        <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center px-2">

            <button
                onClick={() => navigate("/feed")}
                className="flex flex-col items-center text-gray-600"
            >
                <Home size={22} />
                <span className="text-[10px]">Feed</span>
            </button>

            <button
                onClick={() => navigate("/messages")}
                className="flex flex-col items-center text-gray-600"
            >
                <MessageSquare size={22} />
                <span className="text-[10px]">Messages</span>
            </button>

            <button
                onClick={() => navigate("/create-post")}
                className="flex flex-col items-center text-purple-600"
            >
                <PlusSquare size={28} />
                <span className="text-[10px]">Create</span>
            </button>

            <button
                onClick={() => navigate("/notifications")}
                className="flex flex-col items-center text-gray-600"
            >
                <Bell size={22} />
                <span className="text-[10px]">Alerts</span>
            </button>

            <button
                onClick={() => navigate(`/profile/${userId}`)}
                className="flex flex-col items-center text-gray-600"
            >
                <LayoutDashboard size={22} />
                <span className="text-[10px]">Profile</span>
            </button>

        </div>
    );
}