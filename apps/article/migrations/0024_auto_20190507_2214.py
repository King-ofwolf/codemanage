# Generated by Django 2.0.3 on 2019-05-07 22:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('article', '0023_auto_20190507_2213'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 7, 22, 14, 41, 751727)),
        ),
        migrations.AlterField(
            model_name='articlepost',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 7, 22, 14, 41, 752727)),
        ),
    ]
