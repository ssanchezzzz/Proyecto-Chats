import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PostCard({ post, children, onLike, onComment }) {
    const [comment, setComment] = useState("");
    const [likeLoading, setLikeLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const navigate = useNavigate();

    const handleLike = async () => {
        if (likeLoading) return;
        setLikeLoading(true);
        await onLike(post.id);
        setLikeLoading(false);
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (commentLoading || !comment.trim()) return;
        setCommentLoading(true);
        await onComment(post.id, comment);
        setComment("");
        setCommentLoading(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full border border-blue-100 hover:shadow-2xl transition">
            <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center mr-3">
                    <span className="text-lg font-bold text-blue-800">
                        {post.author_username?.[0]?.toUpperCase()}
                    </span>
                </div>
                <div>
                    <h2 className="font-semibold text-blue-900">
                        {post.author_username}
                    </h2>
                    <small className="text-gray-400">
                        {new Date(post.created_at).toLocaleString()}
                    </small>
                </div>
            </div>
            <p className="text-gray-700 mb-3">{post.content}</p>
            {post.image && (
                <img
                    src={post.image}
                    alt="Post"
                    className="rounded-lg mb-3 max-h-64 object-cover w-full border border-blue-100"
                />
            )}
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold transition ${
                        likeLoading ? "opacity-50" : ""
                    }`}
                    disabled={likeLoading}
                >
                    <span>👍</span>
                    <span>{post.likes_count || 0}</span>
                </button>
                <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold transition"
                    onClick={() => navigate(`/post/${post.id}`)}
                >
                    <span>💬</span>
                    <span>{post.comments_count || 0}</span>
                    <span className="ml-1">Comentarios</span>
                </button>
            </div>
            <form onSubmit={handleComment} className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border border-blue-200 rounded px-3 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Comenta algo..."
                    disabled={commentLoading}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-1 font-semibold hover:bg-blue-700 transition"
                    disabled={commentLoading}
                >
                    Comentar
                </button>
            </form>
            {children}
        </div>
    );
}

export default PostCard;