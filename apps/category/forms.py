from django import forms
from django.contrib.auth.models import User

from .models import code, codePost, codeComment

# class codeForm(forms.ModelForm):
#     class Meta:
#         model = codePost
#         fields = ('title')
