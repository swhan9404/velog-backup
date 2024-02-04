---
title: "django rest api 게시글, 댓글 실습"
description: "django seed 설치https&#x3A;//github.com/Brobin/django-seed더미데이터를 한번에 넣어주는 역할pip install django-seedsettings.py > INSTALLED_APPS 에 'django_seed' 추가DRF 설치"
date: 2021-04-27T16:53:37.213Z
tags: ["django"]
---
# 세팅

- django seed 설치

  - https://github.com/Brobin/django-seed
  - 더미데이터를 한번에 넣어주는 역할
  - pip install django-seed
  - settings.py > INSTALLED_APPS 에 `'django_seed' `추가

- DRF 설치

  - https://www.django-rest-framework.org/#installation

  - pip install djangorestframework
  - settings.py > INSTALLED_APPS 에  `'rest_framework',` 추가

- python manage.py makemigrations 

  python manage.py migrate

- 더미 데이터 넣기

  - python manage.py seed 앱이름 --number=갯수



# 게시글관련(댓글없는)

## Serializer 만들기 및 게시글목록 가져오기

- `articles > models.py` 게시글 모델 만들기

  ```python
  class Article(models.Model):
      title = models.CharField(max_length=100)
      content = models.TextField()
      created_at = models.DateTimeField(auto_now_add=True)
      updated_at = models.DateTimeField(auto_now=True)
  ```

  

1. `articles > url.py`  추가
   - `path('articles/', views.article_list),`



2. `articles > serializers.py` 만들기

```python
from rest_framework import serializers
from .models import Article

class ArticleListSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Article
        fields = ('id', 'title', )
        
class ArticleSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Article
        fields = '__all__'
```



- serializer 활용하기 - 연습

```python
serializer = ArticleListSerializer()

article = Article.objects.get(pk=1)
serializer = ArticleListSerializer(article)
serializer.data # 직렬화된 json 데이터

articles = Article.objects.all()
serializer = ArticleListSerializer(articles, many=True) # 직렬화는 기본값이 하나만 하게 되어있기 때문에 iterable 객체를 넣을 때는 many를 True로 바꿔줘야함. 
```



3. `articels > views.py ` 

```python
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.shortcuts import render, get_list_or_404
from .models import Article
from . serializers import ArticleListSerializer

@api_view(['GET'])
def article_list(request) : 
    articles = get_list_or_404(Article)
    serializer = ArticleListSerializer(articles, many=True)
    return Response(serializer.data)
```



## 게시글 상세 내용 가져오기

1. `articles > url.py`  추가

   - `path('articles/<int:article_pk>/', views.article_detail),`

2. `articels > views.py ` 

   ```python
   @api_view(['GET'])
   def article_detail(request, article_pk) :
       article = get_object_or_404(Article, pk=article_pk)
       serializer = ArticleSerializer(article)
       return Response(serializer.data)
   ```

   



## 글 생성하기

1. `articles > urls.py` 에서 

   - `path('articles/create', views.article_create)` 추가하지 않음
   - 이렇게 해도 되긴하지만 restful하지 못함
   - url을 최대한 적게 만들어야함

2. `articels > views.py > article_list` 함수 변경

   ```python
   @api_view(['GET', 'POST'])
   def article_list(request) : 
       if request.method=="GET" : 
           articles = get_list_or_404(Article)
           serializer = ArticleListSerializer(articles, many=True)
           return Response(serializer.data)
       elif request.method=="POST" :
           # 생성 - modelForm 으로 하는 것과 매우 유사 
           serializer = ArticleSerializer(data=request.data)
           if serializer.is_valid(raise_exception=True) : # raise_exception=True를 통해 밑에 저장 실패 부분을 대신할 수 있음
               serializer.save() # 데이터베이스에 저장
               return Response(serializer.data, status=status.HTTP_201_CREATED) # 저장성공을 알림
           # return Response(serializer.error, status = status.HTTP_400_BAD_REQUEST) # 저장 실패를 알림
   ```

    

## 글 삭제하기

1. `articles > urls.py` 에서 

   - `path('articles/<int:article_pk>/delete/', views.article_delete)` 추가하지 않음
   - 이렇게 해도 되긴하지만 restful하지 못함

2. `articels > views.py  > article_detail` 에 내용 추가

   ```python
   @api_view(['GET', 'DELETE'])
   def article_detail(request, article_pk) :
       article = get_object_or_404(Article, pk=article_pk)
       if request.method == "GET" :
           serializer = ArticleSerializer(article)
           return Response(serializer.data)
       elif request.method == "DELETE" :
           article.delete() 
           data = {
               'delete' : f'데이터 {article_pk}번이 삭제되었습니다.'
           }
           return Response(data, status=status.HTTP_204_NO_CONTENT)
   ```

     

## 글 수정하기

1. `articels > views.py  > article_detail` 에 내용 추가

   ```python
   @api_view(['GET', 'DELETE', 'PUT'])
   def article_detail(request, article_pk) :
       article = get_object_or_404(Article, pk=article_pk)
       if request.method == "GET" : # 글상세보기
           serializer = ArticleSerializer(article)
           return Response(serializer.data)
       elif request.method == "DELETE" : # 글삭제
           article.delete() 
           data = {
               'delete' : f'데이터 {article_pk}번이 삭제되었습니다.'
           }
           return Response(data, stutus=status.HTTP_204_NO_CONTENT)
       elif request.method == "PUT" : # 글 수정하기
           serializer = ArticleSerializer(article, data=request.data)
           if serializer.is_valid(raise_exception=True) : # 실패시 에러발생시키기
               serializer.save()
               return Response(serializer.data)
   ```

   

# 댓글 관련

1. 댓글 모델 만들기 `articles > models.py`

   ```python
   class Comment(models.Model) :
       article = models.ForeignKey(Article, on_delete=models.CASCADE) #comment_set 으로 만들어짐
       # article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
       content = models.TextField()
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)
   ```

2. python manage.py makemigrations

   python manage.py migrate

3. python manage.py seed articles --number=20

4. `articles > serializers.py` 에 comment serializer 만들기

   ```python
   from .models import Article, Comment
   
   class CommentSerializer(serializers.ModelSerializer) :
       class Meta :
           model = Comment
           fields ='__all__'
   ```

   

## 모든 댓글 리스트 가져오기

1. `articles > urls.py`

   - `path('comment/', views.comment_list), ` 추가

2. `articles > views.py`

   ```python
   from .models import Comment
   from .serializers import CommentSerializer
   
   @api_view(['GET'])
   def comment_list(request) :
       comments = get_list_or_404(Comment)
       serializer = CommentSerializer(comments, many=True)
       return Response(serializer.data)
   ```

   

## 특정 댓글 가져오기

1. `articles > urls.py`

   - `path('comment/<int:comment_pk>', views.comment_detail), ` 추가

2. `articles > views.py`

   ```python
   @api_view(['GET'])
   def comment_detail(request, comment_pk) :
       comments = get_list_or_404(Comment, pk = comment_pk)
       serializer = CommentSerializer(comments)
       return Response(serializer.data)
   ```

   

## 해당 글에 댓글 작성

1. `articles > urls.py`

   - `path('<int:comment_pk>/comments/', views.comment_create), ` 추가

2. `articles > serializers.py > commentSerializer` 수정

   ```python
   class CommentSerializer(serializers.ModelSerializer) :
       class Meta :
           model = Comment
           fields ='__all__'
           read_only_fields= ('article', ) # article 필드는 읽기전용으로 명시
   ```

   

3. `articles > views.py`

   ```python
   @api_view(['POST'])
   def comment_create(request, article_pk) :
       article = get_list_or_404(Article, pk = article_pk)
       serializer = CommentSerializer(data=request.data)
       if serializer.is_valid(raise_exception=True) :
           serializer.save(article=article) # 해당 글에 댓글쓰기
           return Response(serializer.data, status=status.HTTP_201_CREATED)
   ```

   

## 댓글 삭제

1. `articles > views.py > comment_detail` 에 내용 추가

   ```python
   @api_view(['GET', 'DELETE'])
   def comment_detail(request, comment_pk) :
       comment = get_list_or_404(Comment, pk = comment_pk)
       if request.method == 'GET' :
           serializer = CommentSerializer(comment)
           return Response(serializer.data)
       elif request.method == "DELETE" :
           comment.delete()
           data= {
               'delete' :f'댓글 {comment_pk}번이 삭제 되었습니다.'
           }
           return Response(data, status=status.HTTP_204_NO_CONTENT)
   
   ```



## 댓글 수정하기

1. `articles > views.py > comment_detail` 에 내용 추가

```python
@api_view(['GET', 'DELETE', 'PUT'])
def comment_detail(request, comment_pk) :
    comment = get_list_or_404(Comment, pk = comment_pk)
    if request.method == 'GET' :
        serializer = CommentSerializer(comment)
        return Response(serializer.data)
    elif request.method == "DELETE" :
        comment.delete()
        data= {
            'delete' :f'댓글 {comment_pk}번이 삭제 되었습니다.'
        }
        return Response(data, status=status.HTTP_204_NO_CONTENT)
    elif request.method == "PUT" :
        serializer = CommentSerializer(instance=comment, data=request.data)
        if serializer.is_valid(raise_exception=True) :
            serializer.save()
            return Response(serializer.data)
```



# 게시글 관련(댓글 있는)

1. `articles > serializers > ArticleSerializer` 수정

   ```python
   class ArticleSerializer(serializers.ModelSerializer) :
       # comment_set = serializers.PrimaryKeyRelatedField(many=True, read_only=True) # 이러면 게시글 당 댓글키만 나오게됨
       comment_set = CommentSerializer(many=True, read_only=True) # CommentSerializer정의가 이 코드보다 밑에 있다면 에러가 발생할 수 있음. json 안에 json 이 있는 형태가 됨
       comment_count = serializers.IntegerField(source='comment_set.count', read_only=True) # 댓글 갯수
       # comment_first = serializers.CharField(source='comment_set.first', read_only=True) # 첫번째 댓글 Comment Object로 출력됨
       comment_first = CommentSerializer(source='comment_set.first', read_only=True) # 첫번째 댓글에 해당하는 직렬화되어 들어가게 됨
       comment_filter = serializer.SerializerMethodField('less_7') # 쿼리셋을 직렬화한 것을 반환하는 함수를 가지고 데이터 넣어주기
       
       def less_7(self, article) :
           qs = Comment.objects.filter(pk__lte=7, article=article)
           serializer= CommentSerializer(instance=qs, many=True)
           return serializer.data
       
       class Meta :
           model = Article
           fields = '__all__'
   ```

   

