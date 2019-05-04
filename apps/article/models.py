from django.db import models
from users.models import User
from django.utils import timezone
import datetime


class Article(models.Model):
    author    = models.ForeignKey(User, related_name='article',on_delete=models.CASCADE)
    reviewers = models.ManyToManyField(User, related_name='review_articles')
    title     = models.CharField(max_length=100)
    intro     = models.TextField(blank=True)
    status    = models.CharField(max_length=16)  # draft publisher
    created   = models.DateTimeField(default=datetime.datetime.now())
    updated   = models.DateTimeField(auto_now=True)
    # is_delete = models.IntegerField()

    class Meta:
        ordering = ("-created",)
        db_table = 'wr_article'

    def __str__(self):
        return self.title


class ArticlePost(models.Model):
    article   = models.ForeignKey(Article, related_name='posts',on_delete=models.CASCADE)
    version   = models.CharField(max_length=16)
    body      = models.TextField(blank=True)
    comments  = models.TextField(blank=True)
    status    = models.CharField(max_length=16)
    created   = models.DateTimeField(default=datetime.datetime.now())
    updated   = models.DateTimeField(auto_now=True)
    # is_delete = models.IntegerField()

    class Meta:
        ordering = ("-created",)
        db_table = 'wr_article_post'

    def __str__(self):
        return 'body of {0} [{1}]'.format(self.article, self.version)


class ArticleComment(models.Model):
    user         = models.ForeignKey(User, related_name='article_comments',on_delete=models.CASCADE)
    article      = models.ForeignKey(Article, related_name='comments',on_delete=models.CASCADE)
    article_post = models.ForeignKey(ArticlePost, related_name='article_post_comments',on_delete=models.CASCADE)
    line_number  = models.IntegerField()
    body         = models.TextField(blank=True)
    created      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created",)
        db_table = 'wr_article_comment'

    def __str__(self):
        return 'comment by {0} on {1}'.format(self.user, self.article)

