from rest_framework import serializers
from .models import Conversation, Message
from django.contrib.auth.models import User

class UserMiniSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar']

    def get_avatar(self, obj):
        try:
            return obj.profile.avatar.url if obj.profile.avatar else None
        except:
            return None

class ConversationSerializer(serializers.ModelSerializer):
    participants = UserMiniSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'created_at', 'participants']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserMiniSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'content', 'timestamp', 'is_read']
