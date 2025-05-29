import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Profile() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
        }
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("access");
                if (!token) return;
                const res = await axios.get("http://localhost:8000/users/profiles/", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Busca el perfil cuyo user sea igual al id del usuario autenticado
                const userId = user?.user_id; // O user?.id según tu JWT
                const myProfile = res.data.find(p => p.user === userId);
                setProfile(myProfile);
                setBio(myProfile?.bio || "");
                setLocation(myProfile?.location || "");
            } catch (err) {
                setProfile(null);
            }
        };
        if (user) fetchProfile();
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const token = localStorage.getItem("access");
        if (!token || !profile) return;
        const formData = new FormData();
        formData.append("bio", bio);
        formData.append("location", location);
        if (avatar) formData.append("avatar", avatar);
        try {
            await axios.patch(`http://localhost:8000/users/profiles/${profile.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setSuccess("¡Perfil actualizado!");
        } catch (err) {
            setError("No se pudo actualizar el perfil.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden shadow-lg border-4 border-blue-200">
                    {profile?.avatar ? (
                        <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-5xl font-bold text-blue-400">{user?.username?.[0]?.toUpperCase() || "U"}</span>
                    )}
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">{user?.username || "Perfil"}</h1>
                <p className="text-gray-500 mb-6">Gestiona tu información personal</p>
                {profile && (
                    <form className="w-full flex flex-col gap-4" onSubmit={handleProfileUpdate}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Biografía</label>
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
                                rows={2}
                                placeholder="Cuéntanos algo sobre ti..."
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Ubicación</label>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
                                placeholder="¿Dónde vives?"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Foto de perfil</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setAvatar(e.target.files[0])}
                                className="block border border-gray-300 rounded px-3 py-2 bg-white text-gray-900"
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition">Guardar cambios</button>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        {success && <div className="text-green-600 text-sm">{success}</div>}
                    </form>
                )}
                {profile && (
                    <div className="w-full text-left mt-8 bg-blue-50 rounded-lg p-4 shadow-inner">
                        <div className="mb-2"><span className="font-semibold">Biografía:</span> {profile.bio || <span className="text-gray-400">Sin biografía</span>}</div>
                        <div className="mb-2"><span className="font-semibold">Ubicación:</span> {profile.location || <span className="text-gray-400">Sin ubicación</span>}</div>
                        <div className="mb-2"><span className="font-semibold">Fecha de nacimiento:</span> {profile.birth_date || <span className="text-gray-400">No especificada</span>}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;