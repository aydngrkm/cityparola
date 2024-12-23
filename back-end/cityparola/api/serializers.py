from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import (
    User,
    Country, City,
    Question, Hint,
    Feedback
)

class UserSerializer(serializers.ModelSerializer):
    score = serializers.IntegerField(min_value=0, default=0)

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
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all())

    class Meta:
        model = City
        fields = ['id', 'name', 'country']

class QuestionSerializer(serializers.ModelSerializer):
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'city']

class TestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text']

class HintSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())

    class Meta:
        model = Hint
        fields = ['id', 'hint_text', 'question']

class FeedbackSerializer(serializers.ModelSerializer):
    question = TestQuestionSerializer()

    class Meta:
        model = Feedback
        fields = ['id', 'body', 'created_at', 'question']


class DefaultTestSerializer(serializers.Serializer):
    letter = serializers.CharField(max_length=1)
    question = TestQuestionSerializer()
