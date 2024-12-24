from django.contrib import admin
from .models import User, Country, City, Question, Hint, Feedback

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'score', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_active')
    ordering = ('-score',)

class CountryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country')
    search_fields = ('name', 'country__name')
    list_filter = ('country',)

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'city')
    search_fields = ('question_text', 'city__name')
    list_filter = ('city__country',)

class HintAdmin(admin.ModelAdmin):
    list_display = ('hint_text', 'question')
    search_fields = ('hint_text', 'question__question_text')

class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('body', 'created_at')
    search_fields = ('body',)
    ordering = ('-created_at',)

# Admin'e kayıt
admin.site.register(User, UserAdmin)
admin.site.register(Country, CountryAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Hint, HintAdmin)
admin.site.register(Feedback, FeedbackAdmin)
