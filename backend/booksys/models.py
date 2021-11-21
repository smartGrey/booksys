from django.db import models

class User(models.Model):
  name=models.CharField(max_length=32,unique=True)
  password=models.CharField(max_length=32)
  create_time=models.DateTimeField(auto_now_add=True)
  gender=models.CharField(max_length=4,default='男')
  profile_photo=models.CharField(max_length=128,default='/static/default_profile_photo.png')
  description=models.TextField(blank=True)

  def __str__(self):
    return str(self.id)+' -- '+self.name



class Book(models.Model):
  name=models.CharField(max_length=64,unique=True)
  author=models.ForeignKey(User, on_delete=models.PROTECT)
  body=models.TextField()
  write_time=models.DateTimeField(auto_now_add=True)
  words_number=models.IntegerField(default=0)
  cover_pic=models.CharField(max_length=128,default='/static/default_book_cover.jpg')
  description=models.TextField()

  def __str__(self):
    return str(self.id)+' -- book_name:'+self.name+' -- author:'+str(self.author)



class FavorBook(models.Model):
  user=models.ForeignKey(User, on_delete=models.CASCADE)
  book=models.ForeignKey(Book, on_delete=models.CASCADE)

  def __str__(self):
    return str(self.id)+' -- user:'+str(self.user)+' -- book:'+str(self.book)

class LikeBook(models.Model):
  user=models.ForeignKey(User, on_delete=models.CASCADE)
  book=models.ForeignKey(Book, on_delete=models.CASCADE)

  def __str__(self):
    return str(self.id)+' -- user:'+str(self.user)+' -- book:'+str(self.book)



class ReadHistory(models.Model):
  user=models.ForeignKey(User, on_delete=models.CASCADE)
  book=models.ForeignKey(Book, on_delete=models.CASCADE)
  read_time=models.DateTimeField(auto_now=True)

  def __str__(self):
    return str(self.id)+' -- user:'+str(self.user)+' -- book:'+str(self.book)+' -- read_time:'+str(self.read_time)



class FollowUser(models.Model):
  user=models.ForeignKey(User, on_delete=models.CASCADE,related_name='user')
  followed_user=models.ForeignKey(User, on_delete=models.CASCADE,related_name='followed_user')

  def __str__(self):
    return str(self.id)+' -- user:'+str(self.user)+' -- followed_user:'+str(self.followed_user)



class RecommendBook(models.Model):
  book=models.ForeignKey(Book, on_delete=models.CASCADE,unique=True)

  def __str__(self):
    return str(self.id)+' -- book:'+str(self.book)



class Message(models.Model):
  user=models.ForeignKey(User, on_delete=models.CASCADE)
  send_time=models.DateTimeField(auto_now_add=True)
  title=models.CharField(max_length=256)
  content=models.CharField(max_length=256,blank=True)
  has_read=models.BooleanField(default=False)

  def __str__(self):
    return str(self.id)+' -- user:'+str(self.user)+' -- title:'+str(self.title)+' -- content:'+str(self.content)+' -- has_read:'+str(self.has_read)+' -- send_time:'+str(self.send_time)



class Comment(models.Model):
  user=models.ForeignKey(User, on_delete=models.CASCADE)
  book=models.ForeignKey(Book, on_delete=models.CASCADE)
  create_time=models.DateTimeField(auto_now_add=True)
  content=models.CharField(max_length=128)

  def __str__(self):
    return str(self.id)+' -- user:'+str(self.user)+' -- book:'+str(self.book)+' -- content:'+str(self.content)+' -- create_time:'+str(self.create_time)
