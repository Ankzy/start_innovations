# Generated by Django 3.2 on 2021-04-27 12:24

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=120)),
                ('author', models.CharField(max_length=120)),
                ('year', models.PositiveSmallIntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(2021)])),
                ('in_stock', models.BooleanField()),
                ('pages', models.PositiveSmallIntegerField(validators=[django.core.validators.MinValueValidator(1)])),
            ],
        ),
    ]