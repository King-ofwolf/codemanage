# Generated by Django 2.1.7 on 2019-04-12 05:55

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('article', '0005_auto_20190411_0925'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2019, 4, 12, 13, 55, 41, 928485)),
        ),
        migrations.AlterField(
            model_name='articlepost',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2019, 4, 12, 13, 55, 41, 929474)),
        ),
    ]
