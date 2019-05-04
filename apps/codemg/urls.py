from django.conf.urls import url
from django.conf import settings
from django.contrib.auth import views as auth_views
from django.urls import re_path, path
from . import views
app_name = 'codemg'
urlpatterns = [
    path('list/<categoryid>/', views.code_list, name='code_list'),
    path('update/<id>/', views.code_updatestar, name='code_updatestar'),
     path('delete/<id>/', views.code_delete, name='code_delete'),
    path('download/<id>/', views.code_download, name='code_download'),
    path('codeversion_single/<versionid>/<id>/', views.codeversion_single, name='codeversion_single'),
    url(r'^my/list$', views.my_code_list, name='my_code_list'),
    url(r'^post/list/', views.code_post_list, name='code_post_list'),
    path('create/', views.code_create, name='code_create'),
    url(r'^(?P<id>\d+)/comment$', views.code_comment, name='code_comment'),
    url(r'^(?P<id>\d+)/v/(?P<vid>\d+)/comment$', views.code_post_comment, name='code_post_comment'),
    url(r'^(?P<id>\d+)/v/(?P<vid>\d+)/edit$', views.code_edit, name='code_edit'),
    url(r'^(?P<id>\d+)/v/(?P<vid>\d+)/reedit$', views.code_reedit, name='code_reedit'),
    url(r'^(?P<id>\d+)/body$', views.code_post_body, name='code_post_body'),
    url(r'^(?P<id>\d+)/v/(?P<vid>\d+)/comment/list$', views.code_comment_list, name='code_comment_list'),
]
