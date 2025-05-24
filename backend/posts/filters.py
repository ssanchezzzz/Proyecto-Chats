import django_filters
from .models import Post, Comment, Follow

class PostFilter(django_filters.FilterSet):
    author = django_filters.CharFilter(field_name='author__username', lookup_expr='icontains')
    created_at = django_filters.DateFromToRangeFilter()

    class Meta:
        model = Post
        fields = ['author', 'created_at']

class CommentFilter(django_filters.FilterSet):
    author = django_filters.CharFilter(field_name='author__username', lookup_expr='icontains')
    post = django_filters.NumberFilter(field_name='post__id')

    class Meta:
        model = Comment
        fields = ['author', 'post']

class FollowFilter(django_filters.FilterSet):
    follower = django_filters.CharFilter(field_name='follower__username', lookup_expr='icontains')
    following = django_filters.CharFilter(field_name='following__username', lookup_expr='icontains')

    class Meta:
        model = Follow
        fields = ['follower', 'following']

