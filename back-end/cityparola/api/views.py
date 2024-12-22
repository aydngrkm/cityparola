import random
from .models import (
    User,
    Country, City,
    Question, Hint,
    Feedback
)
from .serializers import (
    UserSerializer,
    CountrySerializer, CitySerializer,
    QuestionSerializer, TestQuestionSerializer, HintSerializer,
    FeedbackSerializer,
    DefaultTestSerializer
)
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

##### User views
class UserList(APIView):
    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetail(APIView):
    def get(self, request, pk, format=None):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        user = get_object_or_404(User, pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

##### Country views
# admin only yapılmalı?
class CountryList(APIView):
    def get(self, request, format=None):
        countries = Country.objects.all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CountrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CountryDetail(APIView):
    def get(self, request, pk, format=None):
        country = get_object_or_404(Country, pk=pk)
        serializer = CountrySerializer(country)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        country = get_object_or_404(Country, pk=pk)
        serializer = CountrySerializer(country, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        country = get_object_or_404(Country, pk=pk)
        country.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

##### City views
# admin only yapılmalı?
class CityList(APIView):
    def get(self, request, format=None):
        cities = City.objects.all()
        serializer = CitySerializer(cities, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CityDetail(APIView):
    def get(self, request, pk, format=None):
        city = get_object_or_404(City, pk=pk)
        serializer = CitySerializer(city)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        city = get_object_or_404(City, pk=pk)
        serializer = CitySerializer(city, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        city = get_object_or_404(City, pk=pk)
        city.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

##### Question views
class QuestionList(APIView):
    def get(self, request, format=None):
        questions = Question.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QuestionDetail(APIView):
    def get(self, request, pk, format=None):
        question = get_object_or_404(Question, pk=pk)
        serializer = QuestionSerializer(question)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        question = get_object_or_404(Question, pk=pk)
        serializer = QuestionSerializer(question, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        question = get_object_or_404(Question, pk=pk)
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


##### Default test view
class DefaultTestView(APIView):
    def get(self, request, format=None):
        letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        errors, test_data = [], []

        for letter in letters:
            cities = City.objects.filter(name__startswith=letter)

            if cities.exists():
                city = random.choice(cities)
                questions = Question.objects.filter(city=city)
                if questions.exists():
                    question = random.choice(questions)
                    test_data.append({
                        'letter': letter,
                        'question': question
                    })
                else:
                    errors.append(f"No questions found for city '{city.name}' starting with '{letter}'.")
            else:
                errors.append(f"No cities found starting with the letter '{letter}'.")

        if errors:
            return Response({"errors": errors}, status=status.HTTP_404_NOT_FOUND)

        serializer = DefaultTestSerializer(test_data, many=True)
        return Response(serializer.data)

class SurvivalTestView(APIView):
    def post(self, request, format=None):
        token = request.headers.get('Authorization')
        if token:
            print("Received token:", token)
        else:
            print("No token provided")
        sent_questions_ids = list(map(int, request.data.get('question_ids', [])))

        questions = list(Question.objects.exclude(id__in=sent_questions_ids))
        if len(questions) == 0:
            return Response({"error": "No more questions left"}, status=400)
        
        new_questions = []
        for i in range(min(len(questions), 10)):
            question = random.choice(questions)
            new_questions.append(question)
            questions.remove(question)
        
        serializer = TestQuestionSerializer(new_questions, many=True)
        return Response(serializer.data)

class CheckAnswerView(APIView):
    def post(self, request, format=None):
        question_id = request.data.get('question_id')
        answer = request.data.get('answer')

        if not question_id or not answer:
            return Response(
                {"detail": "Both 'question_id' and 'answer' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        question = get_object_or_404(Question, pk=question_id)
        return Response({'is_correct': question.city.name == answer.title()})
