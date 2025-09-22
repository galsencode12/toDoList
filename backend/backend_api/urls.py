from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register_user, name="login_user"),
    path("login/", views.login_user),
    path("logout/", views.logout_user, name="logout_user"),
    path("csrf/", views.csrf_token_view),
    # path("auth_status/", views.check_auth_status),
    path("tasks/", views.task_list, name="task_list"),
    path("tasks/<int:pk>", views.task_detail, name="task_detail"),
]
