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
                setProfile(res.data[0]);
                setBio(res.data[0]?.bio || "");
                setLocation(res.data[0]?.location || "");
            } catch (err) {
                setProfile(null);
            }
        };
        fetchProfile();
    }, []);

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
            setSuccess("Profile updated!");
        } catch (err) {
            setError("Failed to update profile.");
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                    {profile?.avatar ? (
                        <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-3xl font-bold text-gray-700">{user?.username?.[0]?.toUpperCase() || "U"}</span>
                    )}
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{user?.username || "Profile Page"}</h1>
                <p className="text-gray-500 mb-4">Manage your profile details.</p>
                {profile && (
                    <form className="w-full max-w-md flex flex-col gap-4" onSubmit={handleProfileUpdate}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Bio</label>
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
                                rows={2}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Avatar</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setAvatar(e.target.files[0])}
                                className="block border border-gray-400 rounded px-3 py-2 bg-white text-gray-900"
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition">Save</button>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        {success && <div className="text-green-600 text-sm">{success}</div>}
                    </form>
                )}
                {profile && (
                    <div className="w-full text-left mt-6">
                        <div className="mb-2"><span className="font-semibold">Bio:</span> {profile.bio || "No bio"}</div>
                        <div className="mb-2"><span className="font-semibold">Location:</span> {profile.location || "No location"}</div>
                        <div className="mb-2"><span className="font-semibold">Birth date:</span> {profile.birth_date || "No birth date"}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;