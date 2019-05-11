from django import forms
from .models import Comment
from .models import com_top, Topic

#新主题表单
class NewTopicForm(forms.ModelForm):
    message = forms.CharField(
        widget=forms.Textarea(
            attrs={'rows': 5, 'placeholder': 'What is in your mind?'}
        ),
        max_length=4000,
        help_text='The max length of the text is 4000.'
    )

    class Meta:
        model = Topic
        fields = ['subject', 'message']


#回复表单
class PostForm(forms.ModelForm):
    class Meta:
        model = com_top
        fields = ['message', ]


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['cloum',  'text']
