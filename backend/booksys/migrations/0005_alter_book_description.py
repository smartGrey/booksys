# Generated by Django 3.2 on 2021-05-04 18:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booksys', '0004_alter_book_cover_pic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='description',
            field=models.TextField(),
        ),
    ]