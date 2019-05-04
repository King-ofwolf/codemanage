from django import forms
from django.contrib.auth.models import User

from .models import Article, ArticlePost, ArticleComment

# class ArticleForm(forms.ModelForm):
#     class Meta:
#         model = ArticlePost
#         fields = ('title')
