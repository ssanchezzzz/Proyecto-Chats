import django_filters
from .models import Message, Conversation

class ConversationFilter(django_filters.FilterSet):
    participants = django_filters.CharFilter(field_name='participants__username', lookup_expr='icontains')

    class Meta:
        model = Conversation
        fields = ['participants']

class MessageFilter(django_filters.FilterSet):
    sender = django_filters.CharFilter(field_name='sender__username', lookup_expr='icontains')
    conversation = django_filters.NumberFilter(field_name='conversation__id')
    is_read = django_filters.BooleanFilter()

    class Meta:
        model = Message
        fields = ['sender', 'conversation', 'is_read']
