# Generated by Django 2.0.3 on 2019-05-07 18:01

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_auto_20190507_1759'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='created_time',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 7, 18, 1, 19, 442860)),
        ),
    ]
