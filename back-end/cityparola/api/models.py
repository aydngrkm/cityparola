from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    score = models.IntegerField(default=0)

class Country(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    def save(self, *args, **kwargs):
        self.name = self.name.title()
        super().save(*args, **kwargs)

class City(models.Model):
    name = models.CharField(max_length=255, unique=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        super().save(*args, **kwargs)

class Question(models.Model):
    question_text = models.TextField()
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='questions')

class Hint(models.Model):
    hint_text = models.TextField()
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='hints')

class Feedback(models.Model):
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
