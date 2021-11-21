from django.contrib import admin
from .models import User,Book,FavorBook,LikeBook,ReadHistory,FollowUser,RecommendBook,Message,Comment

admin.AdminSite.site_header='电子书创作订阅系统 - 后台'

class UserAdmin(admin.ModelAdmin):
  list_display = [
    'id',
    'name',
    'password',
    'gender',
    'create_time',
    'profile_photo',
  ]
  list_editable = [
    'name',
    'password',
    'gender',
    'profile_photo',
  ]
  search_fields = ['id','name','description']
  actions = ['delete_selected']

class BookAdmin(admin.ModelAdmin):
  list_display = [
    'id',
    'name',
    'author',
    'write_time',
    'words_number',
    'cover_pic',
  ]
  list_editable = [
    'name',
    'author',
    'cover_pic',
  ]
  search_fields = ['id','name','body']
  actions = ['delete_selected']

class FavorBookAdmin(admin.ModelAdmin):
  list_display = [
    'id',
    'user',
    'book',
  ]
  list_editable = [
    'user',
    'book',
  ]
  search_fields = ['id']
  actions = ['delete_selected']

class LikeBookAdmin(admin.ModelAdmin):
  list_display = [
    'id',
    'user',
    'book',
  ]
  list_editable = [
    'user',
    'book',
  ]
  search_fields = ['id']
  actions = ['delete_selected']

class ReadHistoryAdmin(admin.ModelAdmin):
  list_display = [
    'id',
    'user',
    'book',
    'read_time',
  ]
  list_editable = [
    'user',
    'book',
  ]
  search_fields = ['id']
  actions = ['delete_selected']

class FollowUserAdmin(admin.ModelAdmin):
  list_display = [
    'id',
    'user',
    'followed_user',
  ]
  list_editable = [
    'user',
    'followed_user',
  ]
  search_fields = ['id']
  actions = ['delete_selected']

class RecommendBookAdmin(admin.ModelAdmin):
  list_display = [
    'id',
    'book',
  ]
  list_editable = [
    'book',
  ]
  search_fields = ['id']
  actions = ['delete_selected']

class MessageAdmin(admin.ModelAdmin):
  list_display = [
    'id',
    'user',
    'send_time',
    'title',
    'has_read',
    'content',
  ]
  list_editable = [
    'user',
    'has_read',
    'title',
    'content',
  ]
  search_fields = ['id','title','content']
  actions = ['delete_selected']

class CommentAdmin(admin.ModelAdmin):
  list_display = [
    'id',
    'user',
    'book',
    'create_time',
    'content',
  ]
  list_editable = [
    'user',
    'book',
    'content',
  ]
  search_fields = ['id','content']
  actions = ['delete_selected']

admin.site.register(User,UserAdmin)
admin.site.register(Book,BookAdmin)
admin.site.register(FavorBook,FavorBookAdmin)
admin.site.register(LikeBook,LikeBookAdmin)
admin.site.register(ReadHistory,ReadHistoryAdmin)
admin.site.register(FollowUser,FollowUserAdmin)
admin.site.register(RecommendBook,RecommendBookAdmin)
admin.site.register(Message,MessageAdmin)
admin.site.register(Comment,CommentAdmin)
