from django.shortcuts import render, redirect,HttpResponseRedirect
from .forms import RegisterForm
from django.views import View
from django.contrib.auth import login, logout, authenticate
from django.urls import reverse
from django import forms
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import HttpResponse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.backends import ModelBackend
from datetime import  *
from django.views.generic import FormView, RedirectView
from .models import  User
from codemg.models import Code
from django.contrib.auth.hashers import make_password, check_password
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render

def register(request):
    # 只有当请求为 POST 时，才表示用户提交了注册信息
    if request.method == 'POST':
        # request.POST 是一个类字典数据结构，记录了用户提交的注册信息
        # 这里提交的就是用户名（username）、密码（password）、邮箱（email）
        # 用这些数据实例化一个用户注册表单
        form = RegisterForm(request.POST)

        # 验证数据的合法性
        if form.is_valid():
            # 如果提交数据合法，调用表单的 save 方法将用户数据保存到数据库
            form.save()

            # 注册成功，跳转回首页
            return redirect('/')
    else:
        # 请求不是 POST，表明用户正在访问注册页面，展示一个空的注册表单给用户
        form = RegisterForm()

    # 渲染模板
    # 如果用户正在访问注册页面，则渲染的是一个空的注册表单
    # 如果用户通过表单提交注册信息，但是数据验证不合法，则渲染的是一个带有错误信息的表单
    return render(request, 'users/register.html', context={'form': form})

## 用户首页
########################################################################################################################
def UserIndex(request):
    username = request.session['username']
    user = User.objects.filter(username=username)[0]
    mycodeslist = Code.objects.filter(author=user)
    now = datetime.now()
    paginator = Paginator(mycodeslist, 10)
    page = request.GET.get('page')
    try:
        contacts = paginator.page(page)
    except PageNotAnInteger:
        contacts = paginator.page(1)
    except EmptyPage:
        contacts = paginator.page(paginator.num_pages)
    context = {'now':now,'mycodeslist':contacts,'userinfo':user,'username':request.session['username']}
    return render(request, 'users/index.html', context=context)

## 用户修改
########################################################################################################################
def UserEdit(request):
    username = request.session['username']
    user = User.objects.filter(username=username)[0]
    now = datetime.now()

    if request.method == 'POST':

        email = request.POST.get("email")
        password1 = request.POST.get("password1")
        user.password = make_password(password1)
        user.email = email
        user.save()

        return redirect('/usersmain/')
    else:
        pass
    context = {'now':now,'userinfo':user,'username':request.session['username']}
    return render(request, 'users/index.html', context=context)


########################################################################################################################
## 登陆表单
########################################################################################################################
class LoginForm(forms.Form):
    username = forms.CharField(max_length=20, min_length=4, required=True)
    password = forms.CharField(max_length=20, min_length=6, required=True)


########################################################################################################################
## 用户登录类视图
########################################################################################################################
class LoginView(View):
    def get(self, request):
        login_form = LoginForm()
        context = {
            'login_form': login_form,
        }
        return render(request, 'users/login.html', context=context)

    def post(self, request):

        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            user_name = request.POST.get('username')
            pass_word = request.POST.get('password')
            # 系统模块认认证用户
            user = authenticate(username=user_name, password=pass_word)
            # 判断用户认证结果
            if user is not None:
                if user.is_active :
                    request.session['username'] = user_name
                    #print(request.session['username'])
                    return HttpResponseRedirect(reverse('users:index'))
                else:
                    msg = '用户未激活！'
                    context = {
                        'msg': msg,
                        'login_form': login_form,
                    }
                    return render(request, 'users/login.html', context=context)
            else:
                msg = '用户名或密码错误！'
                context = {
                    'msg': msg,
                    'login_form': login_form,
                }
                return render(request, 'users/login.html', context=context)
        else:
            context = {
                'login_form': login_form,
            }
            return render(request, 'users/login.html', context=context)

########################################################################################################################
## 验证是否登录
########################################################################################################################
class LoginRequiredMixin(object):
    @method_decorator(login_required(login_url='/'))
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredMixin, self).dispatch(request, *args, **kwargs)


########################################################################################################################
## 用户注销登录视图
########################################################################################################################
class LogoutView(RedirectView):
    url = '/'
    def dispatch(self, request, *args, **kwargs):
        return super(LogoutView, self).dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        logout(request)
        return super(LogoutView, self).get(request, *args, **kwargs)

########################################################################################################################
## 首页类视图
########################################################################################################################
class IndexView(LoginRequiredMixin, View):
    def get(self, request):
        now = datetime.now()
        context = {'now':now,'username':request.session['username']}
        return render(request, 'base.html', context=context)

