# Generated by Django 5.1.2 on 2024-10-26 06:05

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=255)),
                ('reverse_scoring', models.BooleanField(default=False)),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='user_type',
            field=models.CharField(choices=[('individual', 'Individual'), ('company', 'Empresa')], default='individual', max_length=20),
        ),
        migrations.CreateModel(
            name='FormSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('submission_date', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.IntegerField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('form_submission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.formsubmission')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.question')),
            ],
        ),
    ]
