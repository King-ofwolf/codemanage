from django.db import models
from users.models import User
import datetime
from django.urls import reverse
from category.models import Category
class Code(models.Model):
    author    = models.ForeignKey(User, related_name='code',on_delete=models.CASCADE)
    #reviewers = models.ManyToManyField(User, related_name='review_codes')
    title     = models.CharField(max_length=100)
    size = models.CharField(max_length=16)
    type = models.CharField(max_length=16)
    version = models.CharField(max_length=16)
    intro     = models.TextField(blank=True)
    status    = models.CharField(max_length=16)  # draft publisher
    created   = models.DateTimeField(default=datetime.datetime.now())
    updated   = models.DateTimeField(auto_now=True)
    category = models.ForeignKey(Category, related_name='categorycode', on_delete=models.CASCADE, blank=False, null=False)
    path     = models.CharField(max_length=100)
    wenku     = models.TextField(blank=True,null=True)
    star = models.CharField(max_length=16,blank=True,null=True)
    # is_delete = models.IntegerField()

    class Meta:
        ordering = ("-created",)
        db_table = 'wr_code'

    def __str__(self):
        return self.title


class CodePost(models.Model):
    code   = models.ForeignKey(Code, related_name='posts',on_delete=models.CASCADE)
    version   = models.CharField(max_length=16)
    body      = models.TextField(blank=True)
    comments  = models.TextField(blank=True)
    status    = models.CharField(max_length=16)
    created   = models.DateTimeField(default=datetime.datetime.now())
    updated   = models.DateTimeField(auto_now=True)
    # is_delete = models.IntegerField()

    class Meta:
        ordering = ("-created",)
        db_table = 'wr_code_post'

    def __str__(self):
        return 'body of {0} [{1}]'.format(self.code, self.version)


class CodeComment(models.Model):
    user         = models.ForeignKey(User, related_name='code_comments',on_delete=models.CASCADE)
    code      = models.ForeignKey(Code, related_name='comments',on_delete=models.CASCADE)
    code_post = models.ForeignKey(CodePost, related_name='code_post_comments',on_delete=models.CASCADE)
    line_number  = models.IntegerField()
    body         = models.TextField(blank=True)
    created      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created",)
        db_table = 'wr_code_comment'

    def __str__(self):
        return 'comment by {0} on {1}'.format(self.user, self.code)

