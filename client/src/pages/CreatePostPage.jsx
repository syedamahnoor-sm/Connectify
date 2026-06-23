import CreatePost from "../components/CreatePost";

function CreatePostPage() {
    return (
        <div className="min-h-screen bg-gray-50 px-4 pt-20">
            <CreatePost onPostCreated={() => { }} />
        </div>
    );
}

export default CreatePostPage;