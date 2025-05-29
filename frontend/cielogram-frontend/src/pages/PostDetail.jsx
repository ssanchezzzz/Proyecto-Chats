import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    const fetchPost = async () => {
        const res = await axios.get(`http://localhost:8000/posts/posts/${id}/`);
        setPost(res.data);
    };

    const fetchComments = async () => {
        const res = await axios.get(`http://localhost:8000/posts/comments/?post=${id}`);
        setComments(res.data);
    };

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [id]);

    const handleComment = async e => {
        e.preventDefault();
        setError("");
        const token = localStorage.getItem("access");
        if (!token) {
            setError("You must be logged in to comment.");
            return;
        }
        if (!comment.trim()) {
            setError("El comentario no puede estar vacío.");
            return;
        }
        try {
            await axios.post("http://localhost:8000/posts/comments/", {
                post: Number(id),
                content: comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComment("");
            fetchComments();
        } catch (err) {
            setError(
                JSON.stringify(err.response?.data) ||
                err.response?.data?.content?.[0] ||
                err.response?.data?.detail ||
                "Failed to comment."
            );
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("access");
                window.location.href = "/login";
            }
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-md">
                {post ? (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-1 px-3 rounded text-xs"
                                onClick={() => window.history.back()}
                            >
                                Regresar
                            </button>
                            <h1 className="text-xl font-bold text-gray-800">{post.author_username}</h1>
                        </div>
                        <p className="text-gray-700 mb-2">{post.content}</p>
                        {post.image && <img src={post.image} alt="Post" className="rounded-lg mb-3 max-h-56 object-cover w-full" />}
                        <div className="text-gray-400 text-xs mb-4">{new Date(post.created_at).toLocaleString()}</div>
                        <form className="flex flex-col gap-2 mb-4" onSubmit={handleComment}>
                            <textarea
                                className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-400 text-sm"
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                required
                                rows={2}
                            />
                            <button type="submit" className="bg-blue-600 text-white rounded py-1 font-semibold hover:bg-blue-700 transition text-sm">Comment</button>
                            {error && <div className="text-red-500 text-xs">{error}</div>}
                        </form>
                        <div className="overflow-y-auto max-h-40 pr-1">
                            <h2 className="font-semibold mb-2 text-sm">
                                Comentarios ({comments.length})
                            </h2>
                            {comments.length === 0 && <div className="text-gray-400 text-xs">No comments yet.</div>}
                            {comments.map(c => (
                                <div key={c.id} className="mb-2 border-b pb-2 text-xs break-words">
                                    <div className="font-semibold text-blue-700">{c.author_username}</div>
                                    <div className="text-gray-700 break-words">{c.content}</div>
                                    <div className="text-gray-400 text-[10px]">{new Date(c.created_at).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
}

export default PostDetail;