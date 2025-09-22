from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.request import Request
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.middleware.csrf import get_token
from .models import Task
from .serializers import TaskSerializer, UserLoginSerializer, UserSerializer


@api_view(["GET"])
def csrf_token_view(request):
    return JsonResponse({"csrfToken": get_token(request)})

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def check_auth_status(request):
    """
    Check if the user is authenticated.
    """
    return Response({"is_authenticated": True, "username": request.user.username})


@api_view(["POST"])
def register_user(request: Request):
    """
    Register a new user and return a token upon success.
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data["password"])
        user.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login_user(request: Request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        user = authenticate(request, username=user_obj.username, password=password)
        if user is not None:
            login(request, user)

            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def logout_user(request: Request):
    """
    Logout the authenticated user by deleting their token.
    """
    if request.user.is_authenticated:
        try:
            request.user.auth_token.delete()
            logout(request)
            return Response(
                {"success": "Successfully logged out."}, status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"error": "Token not found."}, status=status.HTTP_400_BAD_REQUEST
            )
    return Response(
        {"error": "User not authenticated."}, status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(["GET", "POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def task_list(request: Request):
    """
    List all tasks for the authenticated user, or create a new task.
    Requires authentication.
    """
    if request.method == "GET":
        tasks = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def task_detail(request: Request, pk: int):
    """
    Retrieve, update, or delete a task instance for the authenticated user.
    Requires authentication.
    """
    # fetches task and returns 404 if task does not exist
    task = get_object_or_404(Task, pk=pk, user=request.user)

    if request.method == "GET":
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
