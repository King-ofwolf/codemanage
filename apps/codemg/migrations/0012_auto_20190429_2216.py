# Generated by Django 2.1.7 on 2019-04-29 22:16

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('codemg', '0011_auto_20190429_2215'),
    ]

    operations = [
        migrations.AlterField(
            model_name='code',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2019, 4, 29, 22, 16, 57, 42136)),
        ),
        migrations.AlterField(
            model_name='codepost',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2019, 4, 29, 22, 16, 57, 42136)),
        ),
    ]