from django.contrib import admin
from .models import Code, CodePost, CodeComment

# class codePostInline(admin.TabularInline):
class CodePostInline(admin.StackedInline):
    model = CodePost
    extra = 0

class CodeCommentInline(admin.StackedInline):
    model = CodeComment
    extra = 0

class CodeAdmin(admin.ModelAdmin):
    list_display = ("author", "status", "title", "status","category")
    search_fields = ['title']
    inlines = [CodePostInline, CodeCommentInline]

admin.site.register(Code, CodeAdmin)



