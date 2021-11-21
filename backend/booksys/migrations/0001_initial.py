# Generated by Django 3.2 on 2021-04-30 14:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('body', models.TextField()),
                ('write_time', models.DateTimeField(auto_now_add=True)),
                ('words_number', models.IntegerField(default=0)),
                ('cover_pic', models.CharField(blank=True, max_length=128)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32)),
                ('password', models.CharField(max_length=32)),
                ('create_time', models.DateTimeField(auto_now_add=True)),
                ('gender', models.CharField(default='男', max_length=4)),
                ('profile_photo', models.CharField(blank=True, max_length=128)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='RecommendBook',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='booksys.book')),
            ],
        ),
        migrations.CreateModel(
            name='ReadHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('read_time', models.DateTimeField(auto_now=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='booksys.book')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='booksys.user')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('send_time', models.DateTimeField(auto_now_add=True)),
                ('title', models.CharField(max_length=64)),
                ('content', models.CharField(blank=True, max_length=128)),
                ('has_read', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='booksys.user')),
            ],
        ),
        migrations.CreateModel(
            name='LikeBook',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='booksys.book')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='booksys.user')),
            ],
        ),
        migrations.CreateModel(
            name='FollowUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('followed_user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='followed_user', to='booksys.user')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='user', to='booksys.user')),
            ],
        ),
        migrations.CreateModel(
            name='FavorBook',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='booksys.book')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='booksys.user')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_time', models.DateTimeField(auto_now_add=True)),
                ('content', models.CharField(max_length=128)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='booksys.book')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='booksys.user')),
            ],
        ),
        migrations.AddField(
            model_name='book',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='booksys.user'),
        ),
    ]