# Generated by Django 2.0.3 on 2019-05-07 15:23

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0011_auto_20190507_2255'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='created_time',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 7, 23, 23, 7, 715575)),
        ),
    ]
