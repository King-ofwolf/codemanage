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
import os,sys,time
import json
from .models import Code, CodePost, CodeComment
from category.models import Category
from users.models import  User
from django import forms
from django.shortcuts import render_to_response
from django.http import FileResponse
from django.http import JsonResponse
from django.core import serializers
import datetime
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render
from blog.models import Post

def codeversion_single(request,versionid,id):
    code = Code.objects.filter(id=id)[0]
    code1 = Code.objects.filter(path=code.path).filter(version=versionid)[0]
    data = {}
    data['list'] = json.dumps({
           "title":code1.title,
           "size":code1.size,
           "type":code1.type,
           "created":code1.created.strftime('%Y{y}%m{m}%d{d} %H:%M').format(y='年',m='月',d='日'),
           "intro":code1.intro,
           "wenku":code1.wenku,
           "id":code1.id,
    })
    return JsonResponse(data)

def codeversions(id):
    try:
        code = Code.objects.filter(id=id)[0]
        code_list = Code.objects.filter(path=code.path)
        codeversions = list(range(1, len(code_list)+1))
        return codeversions
    except Exception as e:
        print(e)

def findchildrens(parent_category_id):
    category_list =[]
    category_list += Category.objects.filter(parent_category_id=parent_category_id)
    if len(category_list)>0:
        for i in range(len(category_list)):
            if category_list[i].id!=1:
                findchildrens(category_list[i].id)
        return category_list
    else:
        return category_list

def code_list(request,categoryid):
    if(categoryid=='0'):
        #codes_list = User.objects.all().filter(status="审核")
        if request.session['username']=='admin':
            codes_list = Code.objects.filter(version="1")
        else:
            codes_list = Code.objects.filter(status="1").filter(version="1")
        codeversion_list =[]
        for i in range(len(codes_list)):
            codeversion_list.append(codeversions(codes_list[i].id))
        codes_list_new = []
        for i in range(len(codes_list)):
            stars = 0
            if codes_list[i].star ==None:
                stars = 0
            else:
                stars = len(codes_list[i].star.split(","))-1
            codes_list_new.append({"title":codes_list[i].title,
                                   "category":codes_list[i].category,
                                   "size":codes_list[i].size,
                                   "type":codes_list[i].type,
                                   "created":codes_list[i].created,
                                   "author":codes_list[i].author,
                                   "intro":codes_list[i].intro,
                                   "wenku":codes_list[i].wenku,
                                   "id":codes_list[i].id,
                                   "versions":codeversion_list[i],
                                   "stars":stars})
        paginator = Paginator(codes_list_new, 10) # Show 25 contacts per page
        page = request.GET.get('page')
        try:
            contacts = paginator.page(page)
        except PageNotAnInteger:
            contacts = paginator.page(1)
        except EmptyPage:
            contacts = paginator.page(paginator.num_pages)
        context = {'codes':contacts,'username':request.session['username']}
        return render_to_response('codemg/list.html', context)
    else:
        if request.session['username']=='admin':
            codes_list = Code.objects.filter(version="1").filter(category_id_in=findchildrens(int(categoryid)))
        else:
            codes_list = Code.objects.filter(status="1").filter(version="1").filter(category_id__in=findchildrens(int(categoryid)))
        codeversion_list =[]
        for i in range(len(codes_list)):
            codeversion_list.append(codeversions(codes_list[i].id))
        codes_list_new = []
        for i in range(len(codes_list)):
            codes_list_new.append({"title":codes_list[i].title,
                                   "category":codes_list[i].category,
                                   "size":codes_list[i].size,
                                   "type":codes_list[i].type,
                                   "created":codes_list[i].created,
                                   "author":codes_list[i].author,
                                   "intro":codes_list[i].intro,
                                   "wenku":codes_list[i].wenku,
                                   "id":codes_list[i].id,
                                   "versions":codeversion_list[i]})
        paginator = Paginator(codes_list_new, 10)
        page = request.GET.get('page')
        try:
            contacts = paginator.page(page)
        except PageNotAnInteger:
            contacts = paginator.page(1)
        except EmptyPage:
            contacts = paginator.page(paginator.num_pages)
        context = {'codes':contacts,'username':request.session['username']}
        return render_to_response('codemg/list.html', context)

def code_updatestar(request,id):
    code = Code.objects.filter(id=id)[0]
    if code.star == None:
        code.star = request.session['username']+","
    else:
        if code.star.find(request.session['username'])>=0:
            pass
        else:
            code.star += request.session['username']+","
    code.save()

    stars = 0
    if code.star ==None:
        stars = 0
    else:
        stars = len(code.star.split(","))-1
    data = {'stars':stars}
    return JsonResponse(data)

def code_delete(request,id):
    code = Code.objects.filter(id=id).delete()
    return JsonResponse({'1':'1'})


def my_code_list(request):
    codes_list = request.user.code.all()
    paginator = Paginator(codes_list, 10)
    page = request.GET.get('page')
    try:
        contacts = paginator.page(page)
    except PageNotAnInteger:
        contacts = paginator.page(1)
    except EmptyPage:
        contacts = paginator.page(paginator.num_pages)
    return render(request, "codemg/my_list.html", {
        "codes": contacts,
    })

def code_post_list(request):
    id = request.session['codeid']
    code = get_object_or_404(Code, id=id)

    return render(request, "codemg/post_list.html", {
        "code": code,'username':request.session['username']
    })


def IsSubString(SubStrList,Str):
    '''
    #判断字符串Str是否包含序列SubStrList中的每一个子字符串
    #>>>SubStrList=['F','EMS','txt']
    #>>>Str='F06925EMS91.txt'
    #>>>IsSubString(SubStrList,Str)#return True (or False)
    '''
    flag=True
    for substr in SubStrList:
        if not(substr in Str):
            flag=False

    return flag
#~ #----------------------------------------------------------------------
def GetFileList(FindPath,FlagStr=[]):
    #print(FlagStr)
    '''
    #获取目录中指定的文件名
    #>>>FlagStr=['F','EMS','txt'] #要求文件名称中包含这些字符
    #>>>FileList=GetFileList(FindPath,FlagStr) #
    '''
    FileList=[]
    FileNames=os.listdir(FindPath)
    #print(FileNames)
    if (len(FileNames)>0):
       for fn in FileNames:
           if (len(FlagStr)>0):
               #返回指定类型的文件名
               if (IsSubString(FlagStr,fn)):
                   fullfilename=os.path.join(FindPath,fn)
                   FileList.append(fullfilename)
           else:
               pass

    #对文件名排序
    if (len(FileList)>0):
        FileList.sort()

    return FileList

def code_create(request):
    if request.method == 'POST':
        code = Code()
        post = Post()
        try:
            path = "upload/"
            file = request.FILES['file']
            if not os.path.exists(path):
                os.makedirs(path)
            list = GetFileList(path,file.name)
            version ='1'
            if len(list)>0:
                version = str(len(list)+1)
                file_name = path +request.session['username']+'-'+request.POST['category']+'-'+version+'-'+file.name
            else:
                file_name = path +request.session['username']+'-'+request.POST['category']+'-1-'+file.name
            destination = open(file_name, 'wb+')
            for chunk in file.chunks():
                destination.write(chunk)
            destination.close()
            with open(file_name, 'r') as filer:
                code.wenku = filer.read()

            code.title  = request.POST['title']
            code.version = version
            code.intro  = request.POST['body']
            code.status = '0'
            code.path = path+file.name
            code.size = str(file.size/1000).split('.')[0]+'K'
            tlist = file.name.split('.')
            code.type = tlist[len(tlist)-1]
            code.author = User.objects.get_by_natural_key(request.session['username'])
            code.category_id = request.POST['category']
            code.save()

            with open(file_name, 'r') as filer:
                post.body = filer.read()
            post.title = request.POST['title']
            post.author = User.objects.get_by_natural_key(request.session['username'])
            post.category_id =  request.POST['category']
            post.excerpt = request.POST['body']
            post.save()
            request.session['codeid'] = code.id
            return HttpResponseRedirect(reverse('codemg:code_post_list'))
        except Exception as e:
            print(e)
            return HttpResponse(json.dumps({
                "status": "fail",
            }), content_type="application/json")

    return render(request, "codemg/create.html", {
        'username':request.session['username']
    })


def code_comment(request, id):
    code = get_object_or_404(Code, id=id)
    if (request.user != code.author) and (not request.user in code.reviewers.all()):
        return HttpResponseRedirect(reverse('code:code_list'))

    pub_code_posts = code.posts.filter(status="publisher")
    if not pub_code_posts:
        return HttpResponseRedirect(reverse('code:code_list'))

    return render(request, "codemg/show.html", {
        'code': code,
        'pub_code_posts': pub_code_posts,
    })


@login_required
@csrf_exempt
def code_post_comment(request, id, vid):
    line = request.GET['line'];
    if not line:
        return HttpResponse()

    code = get_object_or_404(Code, id=id)
    code_post = get_object_or_404(CodePost, id=vid, code=code)
    code_comments = code_post.code_post_comments.filter(line_number=line)

    if request.method == 'POST':
        code_comment           = CodeComment()
        code_comment.user      = request.user
        code_comment.code      = code
        code_comment.code_post = code_post
        code_comment.line_number = line
        code_comment.body = request.POST['body']
        code_comment.save()
        {"9": {"total": 3}, "11": {"total": 4}}

        comments = json.loads(code_post.comments) if code_post.comments else {}
        total = {'total': len(code_comments)}
        if line in comments:
            comments[line].update(total)
        else:
            comments[line] = total

        code_post.comments = json.dumps(comments)
        code_post.save()

        return HttpResponse(json.dumps({
            "status": "success",
        }), content_type="application/json")


    return render(request, "codemg/comment.html", {
        'line': line,
        'code': code,
        'code_post': code_post,
        'code_comments': code_comments,
    })

@login_required
def code_comment_list(request, id, vid):
    line = request.GET['line'];
    if not line:
        return HttpResponse()

    code = get_object_or_404(Code, id=id)
    code_post = get_object_or_404(CodePost, id=vid, code=code)
    code_comments = code_post.code_post_comments.filter(line_number=line)

    return render(request, "codemg/comment_show.html", {
        'line': line,
        'code': code,
        'code_post': code_post,
        'code_comments': code_comments,
    })


@login_required
@csrf_exempt
def code_edit(request, id, vid):
    if request.method == 'POST':
        try:
            code = request.user.code.get(id=id)
            code.title  = request.POST['title']
            code.intro  = request.POST['intro']
            if code.status == 'draft':
                code.status = request.POST['status']

            code.save()

            code_post = code.posts.get(id=vid)
            if code_post.status == 'publisher':
                raise ValueError

            code_post.body   = request.POST['body']
            code_post.status = request.POST['status']
            code_post.save()

            return HttpResponse(json.dumps({
                "status": "success",
                "url": reverse('code:code_post_list', kwargs={'id': code.id}),
            }), content_type="application/json")
        except:
            return HttpResponse(json.dumps({
                "status": "fail",
            }), content_type="application/json")

    code = get_object_or_404(Code, id=id)
    code_post = get_object_or_404(CodePost, id=vid, code=code)
    if code_post.status == 'publisher':
        return HttpResponseRedirect(reverse('code:code_post_list', kwargs={'id': code.id}))

    pub_code_posts = code.posts.filter(status="publisher")

    return render(request, "codemg/edit.html", {
        'code': code,
        'code_post': code_post,
        'pub_code_posts': pub_code_posts,
    })

@login_required
@csrf_exempt
def code_reedit(request, id, vid):
    if request.method == 'POST':
        try:
            code = request.user.code.get(id=id)
            code.title  = request.POST['title']
            code.intro  = request.POST['intro']
            if code.status == 'draft':
                code.status = request.POST['status']
            code.save()

            code_post  = CodePost()
            code_post.code = code

            post_count = code.posts.count() + 1
            code_post.version = 'version-' + str(post_count)

            code_post.body   = request.POST['body']
            code_post.status = request.POST['status']
            code_post.save()

            return HttpResponse(json.dumps({
                "status": "success",
                "url": reverse('code:code_post_list', kwargs={'id': code.id}),
            }), content_type="application/json")
        except:
            return HttpResponse(json.dumps({
                "status": "fail",
            }), content_type="application/json")
        
    code = get_object_or_404(Code, id=id)
    code_post = get_object_or_404(CodePost, id=vid, code=code)

    pub_code_posts = code.posts.filter(status="publisher")

    return render(request, "codemg/reedit.html", {
        'code': code,
        'code_post': code_post,
        'pub_code_posts': pub_code_posts,
    })

@login_required
def code_post_body(request, id):
    try:
        vid = request.GET['vid'];

        code      = Code.objects.get(id=id)
        code_post = code.posts.get(id=vid)

        return HttpResponse(json.dumps({
            "status": "success",
            "body": code_post.body,
            "comments": json.loads(code_post.comments) if code_post.comments else {},
            "post_comment_url": reverse('code:code_post_comment', kwargs={'id': code.id, 'vid': code_post.id})
        }), content_type="application/json")
    except:
        return HttpResponse(json.dumps({
            "status": "fail",
        }), content_type="application/json")

@login_required
def category_list(request):
    category_list = Category.objects.all()

    return render(request, "codemg/create.html", {
        "category": category_list,
    })

def file_iterator(file_name, chunk_size=512):
        with open(file_name) as f:
            while True:
                c = f.read(chunk_size)
                if c:
                    yield c
                else:
                    break

def code_download(request,id):
    try:
        code = Code.objects.filter(id=id)[0]
        #file=open('./'+code.path.split('/')[0]+'/'+request.session['username']+'-'+str(code.category_id)+'-'+str(code.version)+'-'+code.path.split('/')[1],'rb')
        #response =FileResponse(file)
        response = FileResponse(file_iterator('./'+code.path.split('/')[0]+'/'+str(code.author)+'-'+str(code.category_id)+'-'+str(code.version)+'-'+code.path.split('/')[1]))
        response['Content-Type']='application/octet-stream'
        response['Charset']='utf-8'
        response['Content-Disposition']='attachment;filename='+code.path.split('/')[1]
        return response
    except Exception as e:
        print(e)





