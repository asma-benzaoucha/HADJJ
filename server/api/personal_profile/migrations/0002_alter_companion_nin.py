# Generated by Django 5.0.3 on 2024-03-12 22:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('personal_profile', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='companion',
            name='nin',
            field=models.CharField(max_length=18),
        ),
    ]
