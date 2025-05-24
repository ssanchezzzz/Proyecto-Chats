from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import UserProfile
from .serializers import UserProfileSerializer
from .filters import UserProfileFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    filterset_class = UserProfileFilter
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['user', 'location']
    ordering = ['user']

class RegisterUserView(APIView):
    permission_classes = []  # Permitir acceso sin autenticación

    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Usuario registrado correctamente.',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
