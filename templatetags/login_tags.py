from django import template
from django.db.models.aggregates import Count
from django.contrib.auth.decorators import login_required
from ..models import Post, Category, Tag ,Comment

register = template.Library()


@register.simple_tag
def get_recent_posts(num=5):
    return Post.objects.order_by('-created_time')[:num]


@register.simple_tag
def archives():
    return Post.objects.dates('created_time', 'month', order='DESC')


@register.simple_tag
def get_categories():
    # 记得在顶部引入 count 函数
    return Category.objects.annotate(num_posts=Count('post')).filter(num_posts__gt=0)


@register.simple_tag
def get_tags():
    # 记得在顶部引入 Tag model
    return Tag.objects.annotate(num_posts=Count('post')).filter(num_posts__gt=0)


@register.simple_tag
def get_posts():
    return Post.objects.all()


@register.simple_tag
def get_comments(Post):
    return Post.comment_set.all().order_by('cloum')

