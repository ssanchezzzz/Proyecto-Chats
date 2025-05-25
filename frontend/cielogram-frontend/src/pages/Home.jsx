import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import './Home.css';

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/posts/posts/')
            .then(res => res.json())
            .then(data => setPosts(data));
    }, []);

    return (
        <div>
            <h1 className="home-page-title">Home Page</h1>
            <p className="home-page-description">Welcome to the Cielogram feed.</p>
            <div className="posts-column">
                {posts
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map(post => (
                        <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

export default Home;