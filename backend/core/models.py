from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    USER_TYPES = (
        ('individual', 'Individual'),
        ('company', 'Empresa'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='individual')
    cep = models.CharField(max_length=8, null=True)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)


class FormSubmission(models.Model):
    user = models.ForeignKey('core.User', on_delete=models.CASCADE)
    submission_date = models.DateTimeField(auto_now_add=True)
    score = models.FloatField(null=True)


class Question(models.Model):
    text = models.CharField(max_length=255)
    reverse_scoring = models.BooleanField(default=False)


class Answer(models.Model):
    form_submission = models.ForeignKey('core.FormSubmission', on_delete=models.CASCADE)
    question = models.ForeignKey('core.Question', on_delete=models.CASCADE)
    user = models.ForeignKey('core.User', on_delete=models.CASCADE)
    value = models.IntegerField()