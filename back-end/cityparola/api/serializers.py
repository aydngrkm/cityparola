from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import (
    User,
    Country, City,
    Question, Hint,
    Feedback
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'score']

    def create(self, validated_data):
        user = User.objects.create(
            username = validated_data['username'],
            email = validated_data['email'],
            password = make_password(validated_data['password']),
            score = validated_data['score'],
        )
        user.save()
        return user

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name']

class CitySerializer(serializers.ModelSerializer):
    country = CountrySerializer()

    class Meta:
        model = City
        fields = ['id', 'name', 'country']

class QuestionSerializer(serializers.ModelSerializer):
    # city serializer ya kaldirilacak ya da write only olacak
    city = CitySerializer()

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'city']

class HintSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()

    class Meta:
        model = Hint
        fields = ['id', 'hint_text', 'question']

class FeedbackSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()

    class Meta:
        model = Feedback
        fields = ['id', 'body', 'created_at', 'question']
