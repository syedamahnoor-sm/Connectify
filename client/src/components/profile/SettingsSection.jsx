import {
    Bell,
    Smartphone,
    Eye,
    Circle,
    MessageCircle,
    Trash2
} from "lucide-react";

function SettingsSection({ user, handleSettingChange,  handleDeleteAccount }) {

    const settings = [
        {
            icon: Circle,
            title: "Show Online Status",
            description: "Let others know when you're online",
            key: "showOnlineStatus",
        },
        {
            icon: MessageCircle,
            title: "Allow Messages",
            description: "Allow other users to message you",
            key: "allowMessages",
        },
    ];

    return (
        <div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    Settings
                </h2>

                <p className="text-gray-500 mt-1">
                    Manage your account preferences.
                </p>
            </div>

            <div className="space-y-5">

                {settings.map((setting) => {

                    const Icon = setting.icon;

                    return (

                        <div
                            key={setting.key}
                            className="flex justify-between items-center bg-gray-50 rounded-2xl p-5"
                        >

                            <div className="flex items-center gap-4">

                                <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">

                                    <Icon
                                        className="text-purple-600"
                                        size={20}
                                    />

                                </div>

                                <div>

                                    <h3 className="font-semibold">
                                        {setting.title}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {setting.description}
                                    </p>

                                </div>

                            </div>

                            <input
                                type="checkbox"
                                checked={user.settings?.[setting.key]}
                                onChange={(e) =>
                                    handleSettingChange(
                                        setting.key,
                                        e.target.checked
                                    )
                                }
                                className="w-5 h-5 accent-purple-600"
                            />

                        </div>

                    );

                })}

                {/* Profile Visibility */}

                <div className="flex justify-between items-center bg-gray-50 rounded-2xl p-5">

                    <div className="flex items-center gap-4">

                        <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">

                            <Eye
                                className="text-purple-600"
                                size={20}
                            />

                        </div>

                        <div>

                            <h3 className="font-semibold">
                                Profile Visibility
                            </h3>

                            <p className="text-sm text-gray-500">
                                Choose who can view your profile
                            </p>

                        </div>

                    </div>

                    <select
                        value={user.settings?.profileVisibility}
                        onChange={(e) =>
                            handleSettingChange(
                                "profileVisibility",
                                e.target.value
                            )
                        }
                        className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="public">
                            Public
                        </option>

                        <option value="private">
                            Private
                        </option>

                    </select>

                </div>

                {/* Danger Zone */}

                <div className="border border-red-200 rounded-2xl p-5 mt-10">

                    <div className="flex items-center gap-3 text-red-600">

                        <Trash2 size={20} />

                        <h3 className="font-semibold">
                            Danger Zone
                        </h3>

                    </div>

                    <button
                        onClick={handleDeleteAccount}
                        className="mt-5 bg-red-100 text-red-500 px-5 py-2 rounded-xl transition"
                    >
                        Delete Account
                    </button>

                </div>

            </div>

        </div>
    );
}

export default SettingsSection;