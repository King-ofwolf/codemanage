from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.db.models import Count
from django.utils import timezone
from django.http import HttpResponse, HttpResponseRedirect

import json
from .models import Article, ArticlePost, ArticleComment
import pdb


def article_list(request):
    articles_list = Article.objects.all()
    return render(request, "article/list.html", {
        "articles": articles_list,
    })

@login_required
def my_article_list(request):
    articles_list = request.user.article.all()

    return render(request, "article/my_list.html", {
        "articles": articles_list,
    })

@login_required
def article_post_list(request, id):
    article = get_object_or_404(Article, id=id)
    article_post_list = article.posts.all()

    return render(request, "article/post_list.html", {
        "article": article,
        "article_posts": article_post_list,
    })

@login_required
def article_create(request):
    if request.method == 'POST':
        try:
            article        = Article()
            article.author = request.user
            article.title  = request.POST['title']
            article.intro  = request.POST['intro']
            article.status = request.POST['status']
            article.save()

            article_post         = ArticlePost()
            article_post.article = article
            article_post.version = 'version-1'
            article_post.body    = request.POST['body']
            article_post.status  = request.POST['status']
            article_post.save()

            return HttpResponse(json.dumps({
                "status": "success",
                "url": reverse('article:article_post_list', kwargs={'id': article.id}),
            }), content_type="application/json")
        except:
            return HttpResponse(json.dumps({
                "status": "fail",
            }), content_type="application/json")

    return render(request, "article/create.html", {

    })


def article_comment(request, id):
    print(id)
    article = get_object_or_404(Article, id=id)
 #   if (request.user != article.author) and (not request.user in article.reviewers.all()):
  #      return HttpResponseRedirect(reverse('article:article_list'))


    return render(request, "article/show.html", {
        'article': article,

    })


@login_required
@csrf_exempt
def article_post_comment(request, id, vid):
    line = request.GET['line'];
    if not line:
        return HttpResponse()

    article = get_object_or_404(Article, id=id)
    article_post = get_object_or_404(ArticlePost, id=vid, article=article)
    article_comments = article_post.article_post_comments.filter(line_number=line)

    if request.method == 'POST':
        article_comment              = ArticleComment()
        article_comment.user         = request.user
        article_comment.article      = article
        article_comment.article_post = article_post
        article_comment.line_number = line
        article_comment.body = request.POST['body']
        article_comment.save()
        {"9": {"total": 3}, "11": {"total": 4}}

        comments = json.loads(article_post.comments) if article_post.comments else {}
        total = {'total': len(article_comments)}
        if line in comments:
            comments[line].update(total)
        else:
            comments[line] = total

        article_post.comments = json.dumps(comments)
        article_post.save()

        return HttpResponse(json.dumps({
            "status": "success",
        }), content_type="application/json")


    return render(request, "article/comment.html", {
        'line': line,
        'article': article,
        'article_post': article_post,
        'article_comments': article_comments,
    })

@login_required
def article_comment_list(request, id, vid):
    line = request.GET['line'];
    if not line:
        return HttpResponse()

    article = get_object_or_404(Article, id=id)
    article_post = get_object_or_404(ArticlePost, id=vid, article=article)
    article_comments = article_post.article_post_comments.filter(line_number=line)

    return render(request, "article/comment_show.html", {
        'line': line,
        'article': article,
        'article_post': article_post,
        'article_comments': article_comments,
    })


@login_required
@csrf_exempt
def article_edit(request, id, vid):
    if request.method == 'POST':
        try:
            article = request.user.article.get(id=id)
            article.title  = request.POST['title']
            article.intro  = request.POST['intro']
            if article.status == 'draft':
                article.status = request.POST['status']

            article.save()

            article_post = article.posts.get(id=vid)
            if article_post.status == 'publisher':
                raise ValueError

            article_post.body   = request.POST['body']
            article_post.status = request.POST['status']
            article_post.save()

            return HttpResponse(json.dumps({
                "status": "success",
                "url": reverse('article:article_post_list', kwargs={'id': article.id}),
            }), content_type="application/json")
        except:
            return HttpResponse(json.dumps({
                "status": "fail",
            }), content_type="application/json")

    article = get_object_or_404(Article, id=id)
    article_post = get_object_or_404(ArticlePost, id=vid, article=article)
    if article_post.status == 'publisher':
        return HttpResponseRedirect(reverse('article:article_post_list', kwargs={'id': article.id}))

    pub_article_posts = article.posts.filter(status="publisher")

    return render(request, "article/edit.html", {
        'article': article,
        'article_post': article_post,
        'pub_article_posts': pub_article_posts,
    })

@login_required
@csrf_exempt
def article_reedit(request, id, vid):
    if request.method == 'POST':
        try:
            article = request.user.article.get(id=id)
            article.title  = request.POST['title']
            article.intro  = request.POST['intro']
            if article.status == 'draft':
                article.status = request.POST['status']
            article.save()

            article_post         = ArticlePost()
            article_post.article = article

            post_count = article.posts.count() + 1
            article_post.version = 'version-' + str(post_count)

            article_post.body   = request.POST['body']
            article_post.status = request.POST['status']
            article_post.save()

            return HttpResponse(json.dumps({
                "status": "success",
                "url": reverse('article:article_post_list', kwargs={'id': article.id}),
            }), content_type="application/json")
        except:
            return HttpResponse(json.dumps({
                "status": "fail",
            }), content_type="application/json")
        
    article = get_object_or_404(Article, id=id)
    article_post = get_object_or_404(ArticlePost, id=vid, article=article)

    pub_article_posts = article.posts.filter(status="publisher")

    return render(request, "article/reedit.html", {
        'article': article,
        'article_post': article_post,
        'pub_article_posts': pub_article_posts,
    })

@login_required
def article_post_body(request, id):
    try:
        vid = request.GET['vid'];

        article      = Article.objects.get(id=id)
        article_post = article.posts.get(id=vid)

        return HttpResponse(json.dumps({
            "status": "success",
            "body": article_post.body,
            "comments": json.loads(article_post.comments) if article_post.comments else {},
            "post_comment_url": reverse('article:article_post_comment', kwargs={'id': article.id, 'vid': article_post.id})
        }), content_type="application/json")
    except:
        return HttpResponse(json.dumps({
            "status": "fail",
        }), content_type="application/json")

