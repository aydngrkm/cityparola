from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from api import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('countries/', views.CountryList.as_view()),
    path('countries/<int:pk>/', views.CountryDetail.as_view()),
    path('cities/', views.CityList.as_view()),
    path('cities/<int:pk>', views.CityDetail.as_view()),
    path('questions/', views.QuestionList.as_view()),
    path('questions/<int:pk>', views.QuestionDetail.as_view()),
    path('default-test/', views.DefaultTestView.as_view(), name='default-test'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns = format_suffix_patterns(urlpatterns)