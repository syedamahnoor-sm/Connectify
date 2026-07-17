import {
    MapPin,
    Globe,
    Briefcase,
    GraduationCap,
    CalendarDays,
    User
} from "lucide-react";

import { format } from "date-fns";

function AboutSection({ user }) {

    const interests = user.about?.interests || [];

    const hasContent =
        user.bio ||
        user.location ||
        user.website ||
        user.about?.work ||
        user.about?.education ||
        interests.length;

    return (
        <div className="space-y-8">

            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-5">
                    About
                </h2>

                {!hasContent ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <User
                            size={42}
                            className="mx-auto text-gray-400 mb-3"
                        />

                        <h3 className="font-semibold text-gray-700">
                            Nothing here yet
                        </h3>

                        <p className="text-gray-500 mt-2">
                            This user hasn't added any profile information.
                        </p>
                    </div>
                ) : (
                    <>

                        {/* Bio */}

                        {user.bio && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Bio
                                </h3>

                                <p className="text-gray-600 leading-7">
                                    {user.bio}
                                </p>
                            </div>
                        )}

                        {/* Info */}

                        <div className="grid md:grid-cols-2 gap-5">

                            {user.about?.work && (
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                                    <Briefcase className="text-purple-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Work
                                        </p>

                                        <p className="font-medium">
                                            {user.about.work}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {user.about?.education && (
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                                    <GraduationCap className="text-purple-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Education
                                        </p>

                                        <p className="font-medium">
                                            {user.about.education}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {user.location && (
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                                    <MapPin className="text-purple-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Location
                                        </p>

                                        <p className="font-medium">
                                            {user.location}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {user.website && (
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                                    <Globe className="text-purple-600" />

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Website
                                        </p>

                                        <a
                                            href={user.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-medium text-purple-600 hover:underline break-all"
                                        >
                                            {user.website.replace(/^https?:\/\//, "")}
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                                <CalendarDays className="text-purple-600" />

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Joined
                                    </p>

                                    <p className="font-medium">
                                        {format(
                                            new Date(user.joinedAt),
                                            "MMMM yyyy"
                                        )}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Interests */}

                        {interests.length > 0 && (
                            <div>

                                <h3 className="font-semibold text-gray-900 mb-3">
                                    Interests
                                </h3>

                                <div className="flex flex-wrap gap-3">

                                    {interests.map((interest) => (

                                        <span
                                            key={interest}
                                            className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium"
                                        >
                                            {interest}
                                        </span>

                                    ))}

                                </div>

                            </div>
                        )}

                    </>
                )}

            </div>

        </div>
    );
}

export default AboutSection;