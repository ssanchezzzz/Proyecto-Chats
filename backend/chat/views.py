from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from .filters import ConversationFilter, MessageFilter

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    filterset_class = ConversationFilter
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['created_at']
    ordering = ['created_at']

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    filterset_class = MessageFilter
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['timestamp', 'is_read']
    ordering = ['timestamp']
