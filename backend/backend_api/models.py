from django.db import models
from django.contrib.auth.models import User

# User model already created by django in the User class
class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    due_date = models.DateField(blank=True, null=True)
    priority = models.IntegerField(default=0)
    # `auto_now_add` sets the creation time automatically on creation.
    created_at = models.DateTimeField(auto_now_add=True)
    # `auto_now` updates the timestamp every time the model is saved.
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    # Optional: order tasks by their due date or creation time.
    class Meta:
        ordering = ['due_date', '-created_at']
