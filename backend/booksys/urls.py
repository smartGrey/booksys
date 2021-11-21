from django.urls import path

from . import views

urlpatterns = [
    path('recommend_books', views.RecommendView.as_view()),
    path('read_history', views.ReadHistoryView.as_view()),
    path('favor_books', views.FavorBookView.as_view()),
    path('my_writings', views.MyWritingsView.as_view()),
    path('publish_book', views.PublishBookView.as_view()),
    path('book_page_data', views.BookPageView.as_view()),
    path('favor_a_book', views.FavorBookView.as_view()),
    path('like_a_book', views.LikeBookView.as_view()),
    path('follow_user', views.FollowUserView.as_view()),
    path('comment_book', views.CommentView.as_view()),
    path('user_info', views.UserInfoView.as_view()),
    path('user_messages', views.MessageView.as_view()),
    path('search', views.SearchView.as_view()),
    path('login', views.LoginView.as_view()),
    path('sign_in', views.SignInView.as_view()),
]
