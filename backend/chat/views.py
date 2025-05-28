from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from .filters import ConversationFilter, MessageFilter
from rest_framework.permissions import IsAuthenticated

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.none()
    serializer_class = ConversationSerializer
    filterset_class = ConversationFilter
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['created_at']
    ordering = ['created_at']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(participants=user)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.none()
    serializer_class = MessageSerializer
    filterset_class = MessageFilter
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['timestamp', 'is_read']
    ordering = ['timestamp']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(conversation__participants=user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
