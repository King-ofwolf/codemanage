from django.http import JsonResponse
from category.models import Category
import json
from django.core import serializers
def category_list(request):
    data = {}
    category_list = Category.objects.all()
    categorys = []
    for i in range(len(category_list)):
        category = {}
        if category_list[i].id==1:
            category['id'] = 1
            category['pid'] = 0
            category['name'] = category_list[i].name
            categorys.append(category)
        else:
            category['id'] = category_list[i].id
            category['pid'] = category_list[i].parent_category_id
            category['name'] = category_list[i].name
            categorys.append(category)

    #print(categorys)
    data['list'] = categorys
    return JsonResponse(data)

