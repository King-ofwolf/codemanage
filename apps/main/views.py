from django.shortcuts import render

from django.http import HttpResponse
from django.template import loader,RequestContext,Context
from django.shortcuts import render_to_response
from datetime import  *
from article.models import Article


def index(request):
    now = datetime.now()
    #print(request.session['user'])
    if request.session['username'] == None:
        context = {'now':now}
        return render_to_response('user/login.html', context)
    else:
        articles=Article.objects.all()[0:9]
        context = {'now':now,'articles':articles,'username':request.session['username']}
        return render_to_response('base.html', context)
