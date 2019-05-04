from django.conf.urls import url
from apps.main import views
app_name = 'main'
urlpatterns = [
    url(r'^$', views.index,name='index'),
]