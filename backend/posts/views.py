from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post, Comment, Follow
from .serializers import PostSerializer, CommentSerializer, FollowSerializer
from .filters import PostFilter, CommentFilter, FollowFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    filterset_class = PostFilter
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['author', 'created_at']
    ordering = ['created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'like']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)
        user = request.user
        if user in post.liked_users.all():
            return Response({'detail': 'Already liked.'}, status=status.HTTP_400_BAD_REQUEST)
        post.liked_users.add(user)
        return Response({'detail': 'Post liked.'}, status=status.HTTP_200_OK)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    filterset_class = CommentFilter
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['author', 'created_at']
    ordering = ['created_at']
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            serializer.save()

class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    filterset_class = FollowFilter
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['follower', 'following', 'created_at']
    ordering = ['created_at']