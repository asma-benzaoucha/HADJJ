# Generated by Django 5.0.3 on 2024-04-24 22:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('personal_profile', '0004_remove_companion_birth_certificate_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='companion',
            name='address',
            field=models.CharField(default='cite emir aek', max_length=180),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='personalprofile',
            name='address',
            field=models.CharField(default='sd', max_length=180),
            preserve_default=False,
        ),
    ]
