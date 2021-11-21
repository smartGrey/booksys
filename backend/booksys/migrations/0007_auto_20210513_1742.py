# Generated by Django 3.2 on 2021-05-13 09:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('booksys', '0006_auto_20210507_1344'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='book',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booksys.book'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booksys.user'),
        ),
        migrations.AlterField(
            model_name='favorbook',
            name='book',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booksys.book'),
        ),
        migrations.AlterField(
            model_name='favorbook',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booksys.user'),
        ),
        migrations.AlterField(
            model_name='followuser',
            name='followed_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='followed_user', to='booksys.user'),
        ),
        migrations.AlterField(
            model_name='followuser',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user', to='booksys.user'),
        ),
        migrations.AlterField(
            model_name='likebook',
            name='book',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booksys.book'),
        ),
        migrations.AlterField(
            model_name='likebook',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booksys.user'),
        ),
        migrations.AlterField(
            model_name='message',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booksys.user'),
        ),
        migrations.AlterField(
            model_name='readhistory',
            name='book',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booksys.book'),
        ),
        migrations.AlterField(
            model_name='readhistory',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booksys.user'),
        ),
        migrations.AlterField(
            model_name='recommendbook',
            name='book',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booksys.book', unique=True),
        ),
    ]
