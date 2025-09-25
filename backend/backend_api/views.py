from django.http import JsonResponse
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from django.shortcuts import get_object_or_404
from .serializers import (
    TaskFilterSerializer,
    UserLoginSerializer,
    TaskSerializer,
    UserSerializer,
    UserTaskListSerializer,
)
from .models import Task
from django.db.models import Q
from django.contrib.auth.models import User


@api_view(["GET"])
def check_auth_status(request: Request):
    return Response({"authenticated": request.user.is_authenticated})


@api_view(["GET"])
def csrf_token_view(request):
    return JsonResponse({"csrfToken": get_token(request)})


@api_view(["POST"])
def register_user(request):
    """
    Register a new user and log them in with session authentication.
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

        return Response(
            {"message": "Registration successful"}, status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        # Find user by email first
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None

        if user:
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)

        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def logout_user(request):
    logout(request)  # clears session cookie
    return Response({"message": "Logged out"}, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def task_list(request):
    """
    List all tasks for the authenticated user, or create a new task.
    Requires authentication.
    """
    if request.method == "GET":
        tasks = Task.objects.filter(user=request.user).order_by("-updated_at")
        payload = {
            "username": request.user.username,
            "tasks": tasks,
        }
        serializer = UserTaskListSerializer(payload)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        serializer = TaskSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):
    """
    Retrieve, update, or delete a task instance for the authenticated user.
    Requires authentication.
    """
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


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def search_task(request: Request):
    # Pull all user's tasks
    queryset = Task.objects.filter(user=request.user)

    # Validate query parameters
    filters = TaskFilterSerializer(data=request.query_params)
    filters.is_valid(raise_exception=True)

    search = filters.validated_data.get("search")
    state = filters.validated_data.get("state")
    priority = filters.validated_data.get("priority")

    if search:
        # Look for task where the title or description matches the search query
        queryset = queryset.filter(
            Q(title__icontains=search) | Q(description__icontains=search)
        )
    # Map state to boolean
    if state:
        if state == "done":
            queryset = queryset.filter(is_completed=True)
        elif state == "active":
            queryset = queryset.filter(is_completed=False)

    # Map priority to number
    if priority:
        mapping = {"low": 0, "medium": 1, "high": 2}
        priority_number = mapping[priority]
        queryset = queryset.filter(priority=priority_number)
    serializer = TaskSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
