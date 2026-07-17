import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosInstance";
import FeedCard from "../components/FeedCard";

function SinglePost() {
    const { id } = useParams();

    const [post, setPost] = useState(null);

    const setPosts = (updateFn) => {
        setPost(prev => {
            const updated = updateFn([prev]);
            return updated[0];
        });
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await API.get(`/posts/${id}`);
                setPost(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchPost();
    }, [id]);

    if (!post) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto mt-8 pt-20">
            <FeedCard
                post={post}
                setPosts={() => { }}
                handleLike={() => { }}
            />
        </div>
    );
}

export default SinglePost;