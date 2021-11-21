from rest_framework.response import Response
from rest_framework.views import APIView
from .models import RecommendBook,Book,User,ReadHistory,FavorBook,Book,LikeBook,FollowUser,Comment,Message
import time
from django.db.models import Q
import urllib.parse
from django.http import HttpResponseRedirect

# _send_message(
#     ['柳卓诚sssaffssaa','刘慈欣'],
#     '来自'+user_link('施耐庵')+'的消息',
#     '你的新书'+book_link(15,'dfglv')+'写的不错'
# )
def _send_message(users,title,content='',has_read=False):
    if isinstance(users,str) or isinstance(users,User):
        users = [users]
    users = map(
        lambda x:User.objects.get(name=x) if isinstance(users,str) else x,
        users
    )
    for u in users:
        message = Message(
            user=u,
            title=title,
            content=content,
            has_read=has_read
        )
        message.save()
    return True

def book_link(book):
    return '<a href="/book?book_id='+str(book.id)+'" style="color:#008dff;fontWeight:bold">《'+book.name+'》</a>'

def user_link(user):
    return '<a href="/user?username='+user.name+'" style="color:#008dff;fontWeight:bold">'+user.name+'</a>'

class RecommendView(APIView):
    def get(self,request):
        result = []
        for e in RecommendBook.objects.all():
            result.append({
                'id': e.book.id,
                'name': e.book.name,
                'author': e.book.author.name,
                'body': e.book.body,
                'write_time': e.book.write_time.isoformat(),
                'words_number': e.book.words_number,
                'cover_pic': e.book.cover_pic,
                'description': e.book.description,
            })
        return Response(data=result)

class SearchView(APIView):
    def get(self,request):
        keywords = request.GET.get('keywords')
        keywords = urllib.parse.unquote(keywords)
        result = {
            'books': list(map(
                lambda x:{
                    'id': x.id,
                    'name': x.name,
                    'author_name': x.author.name,
                    'write_time': x.write_time,
                    'body': ''.join([x for x in x.body if x not in '#-=*[]']),
                    'words_number': x.words_number,
                    'cover_pic': x.cover_pic,
                    'description': x.description,
                    'book_favor_num': FavorBook.objects.filter(book=x).count(),
                    'book_like_num': LikeBook.objects.filter(book=x).count(),
                    'comments_num': Comment.objects.filter(book=x).count(),
                },
                Book.objects.filter(
                    Q(name__icontains=keywords) |
                    Q(id=(keywords if keywords.isdigit() else 100000000000)) |
                    Q(author__name__icontains=keywords) |
                    Q(body__icontains=keywords) |
                    Q(description__icontains=keywords)
                ),
            )),
            'users': list(map(
                lambda x:{
                    'id': x.id,
                    'name': x.name,
                    'create_time': x.create_time,
                    'gender': x.gender,
                    'profile_photo': x.profile_photo,
                    'description': x.description,
                    'followers_num': FollowUser.objects.filter(followed_user=x).count(),
                },
                User.objects.filter(
                    Q(name__icontains=keywords) |
                    Q(id=(keywords if keywords.isdigit() else 100000000000)) |
                    Q(description__icontains=keywords)
                ),
            )),
        }
        return Response(data=result)

class MessageView(APIView):
    def get(self,request):
        user = User.objects.get(name=request.GET.get('user'))
        result = list(map(
            lambda x:{
                'id': x.id,
                'send_time': x.send_time,
                'title': x.title,
                'content': x.content,
                'has_read': x.has_read,
            },
            Message.objects.filter(user=user).order_by('-send_time')
        ))
        return Response(data=result)

class ReadHistoryView(APIView):
    def get(self,request):
        user = User.objects.filter(name=request.GET.get('user'))[0]
        result = []
        for e in ReadHistory.objects.filter(user=user).order_by('-read_time'):
            result.append({
                'id': e.book.id,
                'name': e.book.name,
                'author': e.book.author.name,
                'body': e.book.body,
                'write_time': e.book.write_time.isoformat(),
                'words_number': e.book.words_number,
                'cover_pic': e.book.cover_pic,
                'description': e.book.description,
            })
        return Response(data=result)

class FavorBookView(APIView):
    def get(self,request):
        user = User.objects.filter(name=request.GET.get('user'))[0]
        result = []
        for e in FavorBook.objects.filter(user=user):
            result.append({
                'id': e.book.id,
                'name': e.book.name,
                'author': e.book.author.name,
                'body': e.book.body,
                'write_time': e.book.write_time.isoformat(),
                'words_number': e.book.words_number,
                'cover_pic': e.book.cover_pic,
                'description': e.book.description,
            })
        return Response(data=result)

    def post(self,request):
        try:
            user = User.objects.filter(name=request.data['user'])[0]
            book = Book.objects.filter(id=request.data['book_id'])[0]
            result = FavorBook.objects.filter(user=user,book=book)
            if result:
                result[0].delete()
            else:
                record = FavorBook(user=user,book=book)
                record.save()
                _send_message(
                    book.author,
                    '来自'+user_link(user)+'的消息',
                    '我刚刚把你写的'+book_link(book)+'加入了我的看单！'
                )
                if (user!=book.author):
                    _send_message(
                        user,
                        '把'+user_link(book.author)+'写的'+book_link(book)+'加入了我的看单.',
                    )
            return Response('done')
        except:
            return Response('error')

class LikeBookView(APIView):
    def post(self,request):
        try:
            user = User.objects.filter(name=request.data['user'])[0]
            book = Book.objects.filter(id=request.data['book_id'])[0]
            result = LikeBook.objects.filter(user=user,book=book)
            if result:
                result[0].delete()
            else:
                record = LikeBook(user=user,book=book)
                record.save()
                _send_message(
                    book.author,
                    '来自'+user_link(user)+'的消息',
                    '你的新书'+book_link(book)+'写得不错，为你点赞！'
                )
                _send_message(
                    user,
                    '点赞了'+user_link(book.author)+'写的'+book_link(book)+'.',
                )
            return Response('done')
        except:
            return Response('error')

class FollowUserView(APIView):
    def post(self,request):
        try:
            user = User.objects.filter(name=request.data['user'])[0]
            followed_user = User.objects.filter(name=request.data['author'])[0]
            result = FollowUser.objects.filter(user=user,followed_user=followed_user)
            if result:
                result[0].delete()
            else:
                record = FollowUser(user=user,followed_user=followed_user)
                record.save()
                _send_message(
                    followed_user,
                    '来自'+user_link(user)+'的消息',
                    '我刚刚关注了你，继续加油哦！'
                )
                _send_message(
                    user,
                    '关注了作者'+user_link(followed_user)+'.',
                )
            return Response('done')
        except:
            return Response('error')

class CommentView(APIView):
    def post(self,request):
        try:
            user = User.objects.filter(name=request.data['user'])[0]
            book = Book.objects.filter(id=request.data['book_id'])[0]
            content = request.data['content']
            record = Comment(user=user,book=book,content=content)
            record.save()
            _send_message(
                book.author,
                user_link(user)+'评论了你的'+book_link(book)+'：',
                content
            )
            if user!=book.author:
                _send_message(
                    user,
                    '评论了'+user_link(book.author)+'写的'+book_link(book)+'：',
                    content
                )
            return Response('done')
        except:
            return Response('error')

    def delete(self,request):
        try:
            comment = Comment.objects.get(id=request.data['id'])
            _send_message(
                comment.user,
                '删除了在'+book_link(comment.book)+'书中的评论：',
                comment.content
            )
            comment.delete()
            return Response('done')
        except:
            return Response('error')

class MyWritingsView(APIView):
    def get(self,request):
        user = User.objects.filter(name=request.GET.get('user'))[0]
        result = []
        for e in Book.objects.filter(author=user):
            result.append({
                'id': e.id,
                'name': e.name,
                'author': e.author.name,
                'body': e.body,
                'write_time': e.write_time.isoformat(),
                'words_number': e.words_number,
                'cover_pic': e.cover_pic,
                'description': e.description,
            })
        return Response(data=result)

class PublishBookView(APIView):
    def post(self,request):
        if 'file' in request.FILES:
            img = request.FILES['file']
            imgname=str(time.time())+'.'+str(img).split('.')[-1]
            with open('./static/'+imgname,'wb') as f:
                for fimg in img.chunks():
                    f.write(fimg)
            return Response('/static/'+imgname)

        has_exist = bool(Book.objects.filter(name=request.data['book_name']))
        if not has_exist:
            book = Book(
                name=request.data['book_name'],
                author=User.objects.filter(name=request.data['user'])[0],
                body=request.data['book_body'],
                description=request.data['book_desc'],
                words_number=len(request.data['book_body']),
                cover_pic=request.data['book_cover'] or '/static/default_book_cover.jpg'
            )
            book.save()
            book_id = book.id
            _send_message(
                map(
                    lambda x:x.user,
                    FollowUser.objects.filter(followed_user=book.author)
                ),
                '你关注的作者'+user_link(book.author)+'刚刚发布了新书：',
                book_link(book)
            )
            _send_message(
                book.author,
                '发布了新书：'+book_link(book),
            )
        resp = {
            'book_id': '' if has_exist else book_id,
            'status': 'failed' if has_exist else 'success',
        }
        return Response(data=resp)

class BookPageView(APIView):
    def get(self,request):
        try:
            book = Book.objects.filter(id=request.GET.get('book_id'))[0]
            username = request.GET.get('user')
            has_login = username != 'guest'
            if has_login:
                user = User.objects.filter(name=username)[0]
                find_record = ReadHistory.objects.filter(user=user,book=book)
                if find_record:
                    find_record[0].save()
                else:
                    ReadHistory(user=user,book=book).save()
            resp = {
                'status': 'success',
                'data': {
                    'id': book.id,
                    'book_name': book.name,
                    'body': book.body,
                    'write_time': book.write_time,
                    'words_number': book.words_number,
                    'cover_pic': book.cover_pic,
                    'description': book.description,

                    'author_name': book.author.name,
                    'author_gender': book.author.gender,
                    'author_desc': book.author.description,
                    'author_profile_url': book.author.profile_photo,

                    'if_favor_book': bool(FavorBook.objects.filter(user=user,book=book)) if has_login else False,
                    'book_favor_num': FavorBook.objects.filter(book=book).count(),
                    'if_like_book': bool(LikeBook.objects.filter(user=user,book=book)) if has_login else False,
                    'book_like_num': LikeBook.objects.filter(book=book).count(),
                    'if_follow_author': bool(FollowUser.objects.filter(user=user,followed_user=book.author)) if has_login else False,

                    'comments': list(map(lambda x:{
                            'id': x.id,
                            'comment_time': x.create_time,
                            'user': x.user.name,
                            'content': x.content,
                        },Comment.objects.filter(book=book).order_by('-create_time'))),
                },
            }
        except:
            resp = {
                'status': 'failed',
                'data': {},
            }
        return Response(data=resp)

class UserInfoView(APIView):
    def get(self,request):
        user  = User.objects.get(name=request.GET.get('username'))
        resp = {
            'name': user.name,
            'create_time': user.create_time,
            'gender': user.gender,
            'profile_photo': user.profile_photo,
            'description': user.description,
            'password': user.password,
            'id': user.id,
        }
        if request.GET.get('visit_username') not in ['guest', None]:
            visit_user = User.objects.get(name=request.GET.get('visit_username'))
            resp['if_follow_author'] = bool(FollowUser.objects.filter(user=visit_user,followed_user=user))
        resp = Response(data=resp)
        return resp

    def post(self,request):
        if 'file' in request.FILES:
            img = request.FILES['file']
            imgname=str(time.time())+'.'+str(img).split('.')[-1]
            with open('./static/'+imgname,'wb') as f:
                for fimg in img.chunks():
                    f.write(fimg)
            return Response('/static/'+imgname)

        username = request.data['name']
        if not username:
            return Response(data={'status': 'failed', 'reason': '用户名不能为空'})
        elif User.objects.filter(name=username).exclude(id=request.data['id']).count():
            return Response(data={'status': 'failed', 'reason': '用户名已被使用'})

        user = User.objects.filter(id=request.data['id'])[0]
        if username:
            user.name = username
        if request.data['password']:
            user.password = request.data['password']
        if request.data['gender']:
            user.gender = request.data['gender']
        if request.data['profile_photo']:
            user.profile_photo = request.data['profile_photo']
        if request.data['description']:
            user.description = request.data['description']
        user.save()
        _send_message(user,'个人信息修改成功！')
        return Response(data={'status': 'success', 'new_name': username})

class LoginView(APIView):
    def post(self,request):
        username,password = request.data['username'],request.data['password']
        user_result = User.objects.filter(name=username,password=password)
        resp = {
            'username': user_result[0].name if user_result else 'guest',
            'status': 'right' if user_result else 'wrong',
        }
        resp = Response(data=resp)
        return resp

class SignInView(APIView):
    def post(self,request):
        if 'file' in request.FILES:
            img = request.FILES['file']
            imgname=str(time.time())+'.'+str(img).split('.')[-1]
            with open('./static/'+imgname,'wb') as f:
                for fimg in img.chunks():
                    f.write(fimg)
            return Response('/static/'+imgname)

        username,password = request.data['username'],request.data['password']
        if_exists = bool(User.objects.filter(name=username))
        if not if_exists:
            user = User(
                name=username,
                password=password,
                profile_photo=request.data['profile_photo'] or '/static/default_profile_photo.png'
            )
            user.save()
            print(user)
            _send_message(
                user,
                '我刚刚注册了账号！',
            )
        resp = {
            'username': 'guest' if if_exists else username,
            'status': 'failed' if if_exists else 'success',
        }
        return Response(data=resp)
