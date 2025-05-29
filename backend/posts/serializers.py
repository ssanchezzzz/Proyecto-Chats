from rest_framework import serializers
from .models import Post, Comment, Follow

class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    author_username = serializers.CharField(source='author.username', read_only=True)
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['author']

    def get_likes_count(self, obj):
        return obj.liked_users.count()

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['author']

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = '__all__'
