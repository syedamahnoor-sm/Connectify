import { ImageIcon } from "lucide-react";

function MediaSection({ posts, user, isOwn }) {

    const mediaPosts = posts.filter(post => post.media);

    if (mediaPosts.length === 0) {
        return (
            <div className="text-center py-16">

                <ImageIcon
                    size={52}
                    className="mx-auto text-gray-400 mb-4"
                />

                <h3 className="text-xl font-semibold text-gray-700">
                    No media yet
                </h3>

                <p className="text-gray-500 mt-2">
                    {isOwn
                        ? "Upload photos or videos in your posts to build your media gallery."
                        : `${user.name} hasn't shared any media yet.`}
                </p>

            </div>
        );
    }

    return (

        <div>

            <h2 className="text-2xl font-bold mb-6">
                Media
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

                {mediaPosts.map(post => (

                    <a
                        key={post._id}
                        href={post.media}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative overflow-hidden rounded-2xl shadow bg-gray-100 aspect-square"
                    >

                        <img
                            src={post.media}
                            alt="Post"
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

                    </a>

                ))}

            </div>

        </div>

    );
}

export default MediaSection;