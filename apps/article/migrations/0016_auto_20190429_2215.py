# Generated by Django 2.1.7 on 2019-04-29 22:15

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('article', '0015_auto_20190429_2214'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2019, 4, 29, 22, 15, 29, 570949)),
        ),
        migrations.AlterField(
            model_name='articlepost',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2019, 4, 29, 22, 15, 29, 571947)),
        ),
    ]
