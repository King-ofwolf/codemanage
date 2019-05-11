from django.conf.urls import url
from .views import *
from . import views
from django.urls import path, re_path


app_name = 'blog'

urlpatterns = [
    #path('', views.login, name='login'),
    # --------worker end-------------------------
    # 登出
    path('_logout/', views._logout, name='_logout'),
    path('', views.IndexView.as_view(),  name='worker_home_page'),
    #path('worker_task_info', worker_task_info, name='worker_task_info'),
    path('worker_user_center/', worker_user_center, name='worker_user_center'),
    url(r'^archives/(?P<year>[0-9]{4})/(?P<month>[0-9]{1,2})/$', views.archives, name='archives'),
    url(r'^post/(?P<pk>[0-9]+)/$', views.detail, name='detail'),
    url(r'^tag/(?P<pk>[0-9]+)/$', views.TagView.as_view(), name='tag'),
    url(r'^category/(?P<pk>[0-9]+)/$', views.CategoryView.as_view(), name='category'),
    url(r'^comment/post/(?P<post_pk>[0-9]+)/$', views.post_comment, name='post_comment'),
    url(r'^search/$', views.search, name='search'),
  #  re_path(r'^post/like/$', views.article_like, name='article_like'),
    path('post/like/', views.article_like, name='like'),
    path('comment/like/', views.comment_like, name='comment_like'),
    path('boards/', views.BoardListView.as_view(), name='home'),
    url(r'^boards/(?P<pk>\d+)/$', views.TopicListView.as_view(), name='board_topics'),
    url(r'^boards/(?P<pk>\d+)/new/$', views.new_topic, name='new_topic'),
    url(r'^boards/(?P<pk>\d+)/topics/(?P<topic_pk>\d+)/$', views.Com_topListView.as_view(), name='topic_posts'),
    url(r'^boards/(?P<pk>\d+)/topics/(?P<topic_pk>\d+)/reply/$', views.reply_topic, name='reply_topic'),
    url(r'^boards/(?P<pk>\d+)/topics/(?P<topic_pk>\d+)/posts/(?P<post_pk>\d+)/edit/$', views.PostUpdateView.as_view(), name='edit_post'),

]