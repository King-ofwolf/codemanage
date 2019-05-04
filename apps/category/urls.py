from django.conf.urls import url
from django.conf import settings
from django.contrib.auth import views as auth_views
from django.urls import re_path, path
from . import views
app_name = 'category'
urlpatterns = [
    path('categorylist/', views.category_list, name='category_list'),
]
