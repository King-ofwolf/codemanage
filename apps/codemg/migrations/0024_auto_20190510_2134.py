# Generated by Django 2.1.4 on 2019-05-10 13:34

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('codemg', '0023_auto_20190507_2323'),
    ]

    operations = [
        migrations.AlterField(
            model_name='code',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 10, 21, 34, 25, 615465)),
        ),
        migrations.AlterField(
            model_name='codepost',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 10, 21, 34, 25, 616462)),
        ),
    ]
