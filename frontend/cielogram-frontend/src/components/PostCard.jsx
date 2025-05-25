function PostCard({ post }) {
    return (
        <div className="post-card">
            <h2>{post.author_username}</h2>
            <p>{post.content}</p>
            {post.image && (
                <img src={post.image} alt="Post" style={{ maxWidth: '100%' }} />
            )}
            <small>{new Date(post.created_at).toLocaleString()}</small>
        </div>
    );
}

export default PostCard;