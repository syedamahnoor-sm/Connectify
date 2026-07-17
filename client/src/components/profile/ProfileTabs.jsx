import {
    FileText,
    Image,
    User,
    Settings
} from "lucide-react";

const tabs = [
    {
        id: "posts",
        label: "Posts",
        icon: FileText,
    },
    {
        id: "media",
        label: "Media",
        icon: Image,
    },
    {
        id: "about",
        label: "About",
        icon: User,
    },
    {
        id: "settings",
        label: "Settings",
        icon: Settings,
    },
];

function ProfileTabs({ activeTab, setActiveTab }) {
    return (
        <div className="bg-white rounded-2xl shadow p-3 mt-6">

            <div className="grid grid-cols-4 gap-3">

                {tabs.map((tab) => {

                    const Icon = tab.icon;

                    return (

                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center justify-center gap-2
                                w-full py-3 rounded-xl
                                font-medium transition-all duration-200

                                 ${activeTab === tab.id
                                    ? "bg-purple-600 text-white shadow-lg"
                                    : "text-gray-600 hover:bg-gray-100"
                                }
                            `}
                        >

                            <Icon size={18} />

                            {tab.label}

                        </button>

                    );

                })}

            </div>

        </div>
    );
}

export default ProfileTabs;