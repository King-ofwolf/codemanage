from django.conf.urls import url
from django.urls import re_path, path
from . import views

app_name = 'users'
urlpatterns = [
    #url(r'^register/', views.register, name='register'),
    re_path(r'^register/', views.register, name='register'),
    path('',views.LoginView.as_view(),name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('main/', views.IndexView.as_view(), name='index'),
    path('usersmain/', views.UserIndex, name='usersindex'),
    path('usersedit/',views.UserEdit,name='edit'),
]