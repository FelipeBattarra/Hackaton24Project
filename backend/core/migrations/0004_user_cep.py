# Generated by Django 5.1.2 on 2024-10-26 17:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_formsubmission_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='cep',
            field=models.CharField(max_length=8, null=True),
        ),
    ]
