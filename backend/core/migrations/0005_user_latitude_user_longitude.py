# Generated by Django 5.1.2 on 2024-10-26 18:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_user_cep'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='latitude',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='longitude',
            field=models.FloatField(null=True),
        ),
    ]
