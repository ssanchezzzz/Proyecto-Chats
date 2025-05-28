import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from '../context/AuthContext';
import { getComments } from '../api/post'; // Asegúrate de tener esta función

function Home() {
    const [posts, setPosts] = useState([]);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [editingPost, setEditingPost] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editImage, setEditImage] = useState(null);
    const [showPostForm, setShowPostForm] = useState(false);
    const [commentsMap, setCommentsMap] = useState({});
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    // Si no hay usuario, no renderizar nada (evita parpadeo)
    if (!user) return null;

    const fetchPosts = (url = 'http://localhost:8000/posts/posts/') => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.results) {
                    setPosts(data.results);
                    setNext(data.next);
                    setPrevious(data.previous);
                } else {
                    setPosts(data);
                    setNext(null);
                    setPrevious(null);
                }
            });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Cargar comentarios para todos los posts
    useEffect(() => {
        const fetchAllComments = async () => {
            const map = {};
            for (const post of posts) {
                try {
                    const res = await getComments(post.id);
                    map[post.id] = res.data;
                } catch {
                    map[post.id] = [];
                }
            }
            setCommentsMap(map);
        };
        if (posts.length > 0) fetchAllComments();
    }, [posts]);

    const handlePost = async e => {
        e.preventDefault();
        setError("");
        const token = localStorage.getItem("access");
        if (!token) {
            setError("You must be logged in to post.");
            return;
        }
        const formData = new FormData();
        formData.append("content", content);
        if (image) formData.append("image", image);
        try {
            await axios.post("http://localhost:8000/posts/posts/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setContent("");
            setImage(null);
            setShowPostForm(false);
            fetchPosts();
        } catch (err) {
            setError("Failed to post.");
        }
    };

    const handleDelete = async (postId) => {
        const token = localStorage.getItem("access");
        if (!token) return;
        try {
            await axios.delete(`http://localhost:8000/posts/posts/${postId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPosts();
        } catch (err) {
            setError("Failed to delete post.");
        }
    };

    const startEdit = (post) => {
        setEditingPost(post.id);
        setEditContent(post.content);
        setEditImage(null);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access");
        if (!token) return;
        const formData = new FormData();
        formData.append("content", editContent);
        if (editImage) formData.append("image", editImage);
        try {
            await axios.patch(`http://localhost:8000/posts/posts/${editingPost}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setEditingPost(null);
            setEditContent("");
            setEditImage(null);
            fetchPosts();
        } catch (err) {
            setError("Failed to edit post.");
        }
    };

    // --- NUEVO: Like y comentar ---
    const handleLike = async (postId) => {
        const token = localStorage.getItem("access");
        if (!token) return;
        try {
            await axios.post(`http://localhost:8000/posts/posts/${postId}/like/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPosts();
        } catch (err) {
            // Manejo de error opcional
        }
    };

    const handleComment = async (postId, comment) => {
        const token = localStorage.getItem("access");
        if (!token) return;
        try {
            await axios.post(`http://localhost:8000/api/comments/`, {
                post: postId,
                content: comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPosts();
        } catch (err) {
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("access");
                navigate("/login");
            }
            // Manejo de error opcional
        }
    };
    // --- FIN NUEVO ---

    return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4 px-8">
                    <h1 className="text-3xl font-bold text-blue-800 mt-8 ml-8" style={{ marginLeft: "2rem" }}>Posts</h1>
                    <div className="flex items-center gap-4">
                        <span className="bg-blue-200 text-blue-900 font-semibold rounded px-4 py-2 text-lg shadow">
                            Hola, {user?.username || "usuario"} 👋
                        </span>
                        <button
                            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded py-2 px-6 font-semibold hover:from-blue-700 hover:to-blue-500 transition"
                            onClick={() => setShowPostForm(true)}
                        >
                            Crear publicación
                        </button>
                    </div>
                </div>
                <p className="text-lg text-blue-700 mb-2 text-center">Bienvenido al feed de Cielogram.</p>
                {showPostForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl flex flex-col gap-4 relative">
                            <button
                                className="absolute top-2 right-4 text-gray-500 text-2xl font-bold"
                                onClick={() => setShowPostForm(false)}
                                type="button"
                            >
                                ×
                            </button>
                            <form onSubmit={handlePost} className="flex flex-col gap-4">
                                <textarea
                                    className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-400"
                                    placeholder="¿Qué está pasando por tu mente?"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    required
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setImage(e.target.files[0])}
                                    className="block border border-blue-200 rounded px-3 py-2 bg-white text-gray-900"
                                />
                                <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded py-2 font-semibold hover:from-blue-700 hover:to-blue-500 transition">Publicar</button>
                                {error && <div className="text-red-500 text-sm">{error}</div>}
                            </form>
                        </div>
                    </div>
                )}
                <div
                    className="w-full flex flex-col gap-10 py-4 overflow-y-auto items-center"
                    style={{ maxHeight: "calc(100vh - 180px)" }}
                >
                    {posts
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .map(post => (
                            <div key={post.id} className="w-full flex justify-center">
                                {editingPost === post.id ? (
                                    <form className="bg-white rounded-lg shadow-md p-6 mb-4 w-full max-w-xl min-h-[320px]" onSubmit={handleEdit}>
                                        <textarea
                                            className="border border-blue-200 rounded px-3 py-2 w-full mb-2"
                                            value={editContent}
                                            onChange={e => setEditContent(e.target.value)}
                                            required
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setEditImage(e.target.files[0])}
                                            className="block border border-blue-200 rounded px-3 py-2 bg-white text-gray-900 mb-2"
                                        />
                                        <div className="flex gap-2">
                                            <button type="submit" className="bg-green-600 text-white rounded px-4 py-1 font-semibold hover:bg-green-700 transition">Guardar</button>
                                            <button type="button" className="bg-gray-400 text-white rounded px-4 py-1 font-semibold" onClick={() => setEditingPost(null)}>Cancelar</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="w-full max-w-xl min-h-[320px]">
                                        <PostCard
                                            post={post}
                                            onLike={handleLike}
                                            onComment={handleComment}
                                        >
                                            {user && user.user_id === post.author && (
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        className="bg-yellow-500 text-white rounded px-3 py-1 text-sm hover:bg-yellow-600"
                                                        onClick={() => startEdit(post)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="bg-red-600 text-white rounded px-3 py-1 text-sm hover:bg-red-700"
                                                        onClick={() => handleDelete(post.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                            {/* Quita los comentarios debajo del post */}
                                        </PostCard>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
                <div className="flex gap-4 mt-6">
                    {previous && (
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                            onClick={() => fetchPosts(previous)}
                        >
                            Anterior
                        </button>
                    )}
                    {next && (
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                            onClick={() => fetchPosts(next)}
                        >
                            Siguiente
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;