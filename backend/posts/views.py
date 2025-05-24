from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post, Comment, Follow
from .serializers import PostSerializer, CommentSerializer, FollowSerializer
from .filters import PostFilter, CommentFilter, FollowFilter

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    filterset_class = PostFilter
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['author', 'created_at']
    ordering = ['created_at']

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    filterset_class = CommentFilter
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['author', 'created_at']
    ordering = ['created_at']

class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    filterset_class = FollowFilter
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['follower', 'following', 'created_at']
    ordering = ['created_at']