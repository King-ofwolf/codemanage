# Generated by Django 2.1.7 on 2019-04-12 07:09

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('codemg', '0002_auto_20190412_1451'),
    ]

    operations = [
        migrations.AlterField(
            model_name='code',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2019, 4, 12, 15, 9, 20, 498780)),
        ),
        migrations.AlterField(
            model_name='codepost',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2019, 4, 12, 15, 9, 20, 498780)),
        ),
    ]