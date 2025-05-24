import django_filters
from .models import UserProfile

class UserProfileFilter(django_filters.FilterSet):
    user = django_filters.CharFilter(field_name='user__username', lookup_expr='icontains')
    location = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = UserProfile
        fields = ['user', 'location']