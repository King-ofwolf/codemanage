from django.contrib import admin
from .models import Article, ArticlePost, ArticleComment


# class ArticlePostInline(admin.TabularInline):
class ArticlePostInline(admin.StackedInline):
    model = ArticlePost
    extra = 0

class ArticleCommentInline(admin.StackedInline):
    model = ArticleComment
    extra = 0

class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "author", "created")
    search_fields = ['title']
    inlines = [ArticlePostInline, ArticleCommentInline]

admin.site.register(Article, ArticleAdmin)
