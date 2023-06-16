---
title: "Django Class Based View"
description: "Class Based ViewFunction Based View와는 다른 방법https&#x3A;//docs.djangoproject.com/en/3.2/topics/class-based-views/만들어진 이유뷰 개발에서 발견되는 일반적인 관용구와 패턴이 있다는 것을"
date: 2021-05-01T07:35:44.018Z
tags: ["django"]
---
# CBV

- Class Based View
  - Function Based View와는 다른 방법
- https://docs.djangoproject.com/en/3.2/topics/class-based-views/
- 만들어진 이유
  - 뷰 개발에서 발견되는 일반적인 관용구와 패턴이 있다는 것을 인식했습니다. 이러한 패턴을 추상화하고 일반적인 경우에 대한보기 개발을 쉽게하기 위해 함수 기반 일반보기가 도입
    - 함수 기반 일반보기의 문제점은 단순한 사례를 잘 다루었지만 일부 구성 옵션 이상으로 확장하거나 사용자 정의 할 방법이 없어 많은 실제 응용 프로그램에서 유용성을 제한한다는 것
  - 클래스 기반 일반보기는보기 개발을 더 쉽게하기 위해 함수 기반 일반보기와 동일한 목적으로 작성되었습니다. 그러나 믹스 인을 사용하여 솔루션이 구현되는 방식은 클래스 기반 일반 뷰가 기능 기반의 뷰보다 더 확장 가능하고 유연 해지는 툴킷을 제공
- 어떨 때 사용해야하는가?

  - Function Based View

    - 세부적인 작동사항을 일일히 다 컨트롤 할 때

  - Class Based View

    - 만들어진 구조를 가지고 빠르게 동작시킬 때
- REST API 만들 때 유용
- CBV의 장점
  - GET, POST 등 HTTP 메소드에 따른 처리 코드를 작성할 때 if 함수 대신에 메소드 명으로 코드의 구조가 깔끔하다.
  - 다중상속 같은 객체지향 기법을 활용해 제너릭 뷰, 믹스인 클래스 등을 사용해 코드의 재사용과 개발 생산성을 높여준다.
- CBV 사용 가이드라인
  - 뷰는 간단 명료해야 한다.
  - 뷰 코드의 양은 적으면 적을수록 좋다.
  - 뷰 안에서 같은 코드를 반복적으로 사용하지 않는다.
  - 뷰는 프레젠테이션 로직에서 관리하고 비즈니스 로직은 모델에서 처리한다. 매우 특별한 경우에만 폼에서 처리한다.
  - 403, 404, 500 에러 핸들링에는 CBV를 이용하지 않고 FBV를 이용한다.
  - 믹스인은 간단명료해야 한다.

## 제너릭 뷰 (generic view)

제너릭 뷰의 4가지 분류

- 기반 뷰(Base View): 뷰 클래스를 생성하고 다른, 제너릭 뷰의 부모 클래스가 되는 기본 제너릭 뷰
- 제너릭 보기 뷰(Generic Display View): 객체의 목록 또는 하나의 객체 상세 정보를 보여주는 뷰
- 제너릭 수정 뷰(Generic Edit View): 폼을 통해 객체를 생성, 수정, 삭제하는 기능을 제공하는 뷰
- 제너릭 날짜 뷰(Generic Date View): 날짜 기반 객체의 연/월/일 페이지로 구분해 보여주는 뷰



### 기반 뷰(Base View)

- View: 최상위 부모 제너릭 뷰 클래스
- TemplateView: 주어진 템플릿으로 렌더링
- RedirectView: 주어진 URL로 리다이렉트



### 제너릭 보기 뷰(Generic Display View)

- DetailView: 조건에 맞는 하나의 객체 출력
- ListView: 조건에 맞는 객체 목록 출력



### 제너릭 수정 뷰(Generic Edit View)

- FormView: 폼이 주어지면 해당 폼을 출력
- CreateView: 객체를 생성하는 폼 출력
- UpdateView: 기존 객체를 수정하는 폼을 출력
- DeleteView: 기존 객체를 삭제하는 폼을 출력



### 제너릭 날짜 뷰(Generic Date View)

- YearArchiveView: 주어진 연도에 해당하는 객체 출력
- MonthArchiveView: 주어진 월에 해당하는 객체 출력
- DayArchiveView: 주어진 날짜에 해당하는 객체 출력
- TodayArchiveView: 오늘 날짜에 해당하는 객체 출력
- DateDetailView: 주어진 연, 월, 일 PK(또는 슬러그)에 해당하는 객체 출력



### 오버라이딩

#### 속성 오버라이딩

- `model`
  - 기본 뷰(View, Template, RedirectView) 3개를 제외하고 모든 제너릭 뷰에서 사용한다.
- `queryset`
  - 기본 뷰(View, Template, RedirectView) 3개를 제외하고 모든 제너릭 뷰에서 사용한다. `queryset`을 사용하면 `model` 속성은 무시된다.
- `template_name`
  - TemplateView를 포함한 모든 제너릭 뷰에서 사용한다. 템플릿 파일명을 문자열로 지정한다.
- `context_object_name`
  - 뷰에서 템플릿 파일에 전달하는 컨텍스트 변수명을 지정한다
- `paginate_by`
  - ListView와 날짜 기반 뷰(예, YearArchiveView)에서 사용한다. 페이징 기능이 활성화 된 경우 페이지당 출력 항목 수를 정수로 지정한다.
- `date_field`
  - 날짜 기반 뷰(예, YearArchiveView)에서 사용한다. 이 필드의 타입은 DateField 또는 DateTimeField이다.
- `form_class`
  - FormView, CreateView, UpdateView에서 폼을 만드는데 사용할 클래스를 지정한다.
- `success_url`
  - FormView, CreateView, UpdateView, DeleteView에서 폼에 대한 처리가 성공한 후 리디이렉트할 URL 주소이다.



#### 메소드 오버라이딩

- `def get_qeuryset()` 
  - 기본 뷰(View, Template, RedirectView) 3개를 제외하고 모든 제너릭 뷰에서 사용한다. 디폴트는 `queryset` 속성을 반환한다. `queryset` 속성이 지정되지 않은 경우 모델 매니저 클래스의 all() 메소드를 호출해 QuerySet 객체를 생성해 반환한다.
- `def get_context_data(**kwargs)`
  - 뷰에서 템플릿 파일에 넘겨주는 컨텍스트 데이터를 추가하거나 변경하는 목적으로 오버라이딩한다.



#### 모델을 지정하는 방법 3가지

1. model 속성 변수 지정
2. queryset 속성 변수 지정
3. `def get_queryset()` 메소드 오버라이딩



## 클래시 기반 뷰 연결하기

### TemplateView.as_view()

1. `앱이름/templates/앱이름/about1.html` 만들기
2. `앱이름/urls.py`

```python
from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('about/', TemplateView.as_view(template_name="앱이름/about1.html")),
]
```

 

### TemplateView 로 만들고 연결하기

1. `앱이름/templates/앱이름/about2.html` 만들기

2. `앱이름/views.py`

   ```python
   from django.views.generic import TemplateView
   
   class AboutView(TemplateView):
       template_name = "앱이름/about2.html"
   ```

3. `앱이름/urls.py`

   ```python
   from django.urls import path
   from some_app.views import AboutView
   
   urlpatterns = [
       path('about2', AboutView.as_view()),
   ]
   ```

   

## 클래스 기반 뷰 사용해보기

### function based view로 만들어진 것 - 비교용

1. `앱이름/models.py`

   `python manage.py makemigrations`

   `python manage.py migrate`

   ```python
   from django.db import models
   
   class Article(models.Model) :
       title = models.CharField(max_length=50)
   ```

2. django seed를 통해 더미데이터 넣어주기

   `python manage.py seed articles --number=10`

3. `앱이름/urls.py`

   - `path('index/', views.index)`

4. `앱이름/views.py`

   ```python
   from .models import Article
   
   def index(request) :
       if request.method=="GET" : 
           articles = Articles.objects.all()
   
           context = {
               'articles' : articles
           }
           return render(request, 'articles/index.html', context)
   ```

5. `앱이름/templates/앱이름/index.html` 만들어주기



### 클래스기반 뷰 사용

3. `앱이름/urls.py`

   ```python
   from views import IndexView
   
   urlpatterns = [
       ...
       path('index2/', IndexView.as_view())
   ]
   ```

   

4. `앱이름/views.py` 

   ```python
   from djagno.views import View
   
   class IndexView(View) :
       def get(self, request) : # request.method GET 방식일 때 작동할 내용
           articles = Articles.objects.all()
   
           context = {
               'articles' : articles
           }
           return render(request, 'articles/index2.html', context)      
   ```

   

### generic view 사용하기(ListView)

- https://docs.djangoproject.com/en/3.2/topics/class-based-views/generic-display/

- https://docs.djangoproject.com/en/3.2/ref/class-based-views/generic-display/#listview

- django 코드로 보기

  - class ListView(MultipleObjectTemplateResponseMixin, BaseListView)

    - https://github.com/django/django/blob/ca34db46504fca1221e27f6ab13734dfdfde6e1c/django/views/generic/list.py#L194

    - class BaseListView(MultipleObjectMixin, View):

      https://github.com/django/django/blob/ca34db46504fca1221e27f6ab13734dfdfde6e1c/django/views/generic/list.py#L139

    - class MultipleObjectMixin(ContextMixin)

      https://github.com/django/django/blob/ca34db46504fca1221e27f6ab13734dfdfde6e1c/django/views/generic/list.py#L9

3. `앱이름/urls.py`
   - `path('', ArticleListView.as_view(), name='index')`

4. `앱이름/views.py` 

   - 이렇게 하면 에러
     - `앱이름/article_list.html`을 찾을 수 없다는 에러가 뜨게 됨
     - ListView를 상속받게 되면 자동으로 `앱이름/클래스이름_list.html` 으로 연결되게 함 - 클래스이름 맨앞은 소문자로 변경됨

   ```python
   from django.views.generic import ListView
   
   class ArticleListView(ListView) :
       model = Article
   ```

5. `앱이름/templates/앱이름/article_list.html` 만들기

   - 우리는 model에 담았을 뿐이지만 `object_list`로 가져올 수 있음

   ```django
   <h1>
      article index
   </h1>
   
   {{ object_list }}
   
   {% for object in object_list %}
   	{% object.title %}
   {% endfor %}
   ```

6. object라고 쓰는게 불편하니 바꿔보자

   - `앱이름/views.py > ArticleListView`  

     ```python
     from django.views.generic import ListView
     
     class ArticleListView(ListView) :
         model = Article
         context_object_name = 'articles' # object가 articles가 됨
         queryset = Article.objects.order_by('-id') # 이걸로 순서도 정해줄 수 있음
     ```

   - `앱이름/templates/앱이름/article_list.html`

     ```django
     <h1>
        article index
     </h1>
     
     {{ articles }}
     
     {% for article in articles %}
     	{% article.title %}
     {% endfor %}
     ```

7. 추가 컨텍스트 넣기

   - `앱이름/views.py > ArticleListView`  

     ```python
     from django.views.generic import ListView
     
     class ArticleListView(ListView) :
         model = Article
         context_object_name = 'articles' # object가 articles가 됨
         def get_context_data(self, **kwargs) :
             context = super().get_context_data(self, **kwargs)
             # class MultipleObjectMixin(ContextMixin) 내용 확인
             context['name'] = 'change'
             return context
     ```

     

### 개체의 하위 집합보기(DetailView)

3. `앱이름/urls.py`
   - `path('<int:pk>/', ArticleDetailVeiw.as_view(), name='detail')`

4. `앱이름/views.py`  

   - 에러 나옴
     - `앱이름/article_detail.html` 을 찾을 수 없다는 에러

   ```python
   from django.views.generic import DetailView
   
   class ArticleDetailVeiw(DetailVeiw) :
       model= Article
   ```


5. `앱이름/templates/앱이름/article_detail.html` 만들기

   ```django
   <h1>
      article index
   </h1>
   
   {{ articles }}
   
   {% for article in articles %}
   	{% article.title %}
   {% endfor %}
   ```

   



## 클래스 기반 뷰를 사용한 양식처리

- https://docs.djangoproject.com/en/3.2/topics/class-based-views/generic-editing/
  - 양식 처리에는 일반적으로 3 가지 경로가 있습니다.
    - 초기 GET (비어 있거나 미리 채워진 양식)
    - 유효하지 않은 데이터가있는 POST (일반적으로 오류가있는 양식 다시 표시)
    - 유효한 데이터가있는 POST (데이터를 처리하고 일반적으로 리디렉션)



###  CreateView

1. `앱이름/models.py`

   `python manage.py makemigrations`

   `python manage.py migrate`

   ```python
   from django.db import models
   from django.urls import reverse
   
   class Article(models.Model) :
       title = models.CharField(max_length=50)
       
       def get_absolute_url(self):
           return reverse('articles:detail', kwargs={'pk': self.pk})    
       # 글을 작성하고면 해당 글의 detail페이지로 이동
   ```

2. `앱이름/views.py`  

   - 역할
     - model form 만들어줌
     - context 만들어서 html로 넘겨줌
     - 작성 이후 게시물 detail페이지로 이동시킴

   ```python
   from django.views.generic import CreateView
   
   class ArticleCreateView(CreateView) :
       model = Article
       fields = '__all__'
       # 앱이름/article_form.html 으로 연결됨
   ```

3. `앱이름/urls.py`

   - `path('create/', ArticleCreateView.as_view(), name='create')`

4. `앱이름/templates/앱이름/article_form.html`

   ```django
   <h1>
       form
   </h1>
   
   <form action="" method="POST">
       {% csrf_token %}
       {{ form }}
       <input type="submit">
   </form>
   ```



### UpdateView

2. `앱이름/views.py`  

   ```python
   from django.views.generic import UpdateView
   
   class ArticleUpdateView(UpdateView) :
       model = Article
       fields = '__all__'
       # 앱이름/article_form.html 으로 연결됨
   ```

3. `앱이름/urls.py`

   - `path('<int:pk>/update/', ArticleUpdateView.as_view(), name='update')`



### DeleteView

2. `앱이름/views.py`  

   ```python
   from django.views.generic import DeleteView
   from django.urls import reverse_lazy
   
   class ArticleDeleteView(DeleteView) :
       model = Article
   	success_url = reverse_lazy('articles:index') 
       # delete에 성공하면 어디로 redirect 시킬지
       # reverse_lazy의 경우 urls.py 의 app_name과 url_name을 참조해서 url을 만드는 역할
   ```

3. `앱이름/urls.py`

   - `path('<int:pk>/delete/', ArticleDeleteView.as_view(), name='delete')`

4. `앱이름/templates/앱이름/article_confirm_delete.html`

   - 지우기 버튼을 누른 뒤 정말 지울꺼야? 라고 뜨는 확인페이지

   ```django
   <h1>
       delete
   </h1>
   
   <p>
       정말 삭제하시겠습니까?
   </p>
   <form action="" method="POST">
       {% csrf_token %}
       <input type="submit">
   </form>
   ```

   

   

## User를 다루는 클래스기반 뷰

### django auth view

- https://docs.djangoproject.com/en/3.2/topics/auth/default/#module-django.contrib.auth.views

0. accounts 앱 만들기
   - `python manage.py startapp accounts`
   - settings.py 에 INSTALLED_APPS 에
     - `'accounts',` 추가

1. `메인/urls.py`

   - `path('accounts/', include('django.contrib.auth.urls')),`

     - django 가 기본적으로 제공하는 로그인 관련 view를 사용할 수 있게 됨

     ![](../images/0430_프로젝트.assets-image-20210430162632414.png)

   - 127.0.0.1/accounts/login 으로 접속하게 되면 에러가 남

     - registration/login.html 을 찾는 에러를 만나게 됨

       ![](../images/0430_프로젝트.assets-image-20210430162816590.png)

2. `accounts/templates/registration/login.html` 
   ```django
   <form action="" method="POST">
       {% csrf_token %}
       {{ form }}
       <input type="submit">
   </form>
   ```

3. settings.py

   - `LOING_REDIRECT_URL = 'articles:index'` 추가
     - 로그인에 next parameter가 없을 시, 로그인 성공하면 갈 주소의 기본값 설정



### 글쓰기와 User 연동

1. `앱이름/models.py`

   ```python
   from django.db import models
   from djagno.conf import settings
   
   class Article(models.Model) :
       title = models.CharField(max_length=50)
       user = models.Foreign(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
       
       def get_absolute_url(self):
           return reverse('articles:detail', kwargs={'pk': self.pk})    
   ```

   

2. `앱이름/views.py > ArticleCreateView`

   - 원래 대로 그냥 실행하게 되면, 누가 작성하는지 선택하는 selectbox가 나오게 됨으로 안나오게 고쳐주어야함

   ```python
   from django.contrib.auth.mixins import LoginRequiredMixin
   from django.views.generic import UpdateView
   
   class ArticleCreateView(LoginRequiredMixin, UpdateView) : # LoginRequiredMixin 을 추가하여 로그인이 된 상태에서만 접근할 수 있도록 -> 로그인 안한 상태면 로그인 페이지로 이동됨
       model = Article
       fields = ('title', )
       
       def form_valid(self, form) : # 글쓸 때 user 정보를 사용하기 위함
           form.instance.user = self.request.user # 로그인 한 사람
           return super().form_valid(form)
   ```

   

# Django rest api 에 CBV 활용하기

- https://www.django-rest-framework.org/tutorial/3-class-based-views/



## fuction based view 모양

1. `앱이름/urls.py`

   ```python
   from django.urls import path
   from . import views
   
   app_name = 'movies'
   urlpatterns = [
       path('review/<int:review_pk>/', views.review_detail),
   ]
   ```

2. `앱이름/views.py`

   ```python
   from rest_framework.response import Response
   from rest_framework.decorators import api_view
   from rest_framework import status
   
   from django.shortcuts import get_object_or_404
   from .models import Review
   from .serializers import ReviewSerializer
   
   @api_view(['GET', 'PUT', 'DELETE'])
   def review_detail(request, review_pk):
       review = get_object_or_404(Review, pk=review_pk)
   
       if request.method == 'GET': # 리뷰 자세히 보기
           serializer = ReviewSerializer(review)
           return Response(serializer.data)
       
       elif request.method == 'PUT': # 리뷰 수정
           serializer = ReviewSerializer(review, data=request.data)
           if serializer.is_valid(raise_exception=True):
               serializer.save()
               return Response(serializer.data)
       
       elif request.method == 'DELETE': # 리뷰 지우기
           review.delete()
           data={
               'delete' : f"reivew {review_pk}번 글이 삭제 되었습니다"
           }
           return Response(data, status.HTTP_204_NO_CONTENT)
   
   ```

   

## class based view 모양

1. `앱이름/urls.py`

   ```python
   from django.urls import path
   from . import views
   from .views import Review_detail
   
   app_name = 'movies'
   urlpatterns = [
       path('review/<int:review_pk>/', Review_detail.as_view()),
   ]
   ```

2. `앱이름/views.py`

   ```python
   from rest_framework.response import Response
   from rest_framework.views import APIView
   from rest_framework import status
   
   from django.shortcuts import get_object_or_404
   from .models import Review
   from .serializers import ReviewSerializer
   
   class Review_detail(APIView) :
       def get_reivew(self, review_pk) :
           review = get_object_or_404(Review, pk=review_pk)
           return review
       
       def get(self, request, review_pk) :
           review = self.get_reivew(review_pk)
           serializer = ReviewSerializer(review)
           return Response(serializer.data)
   
       def put(self, request, review_pk) :
           review = self.get_reivew(review_pk)
           serializer = ReviewSerializer(review, data=request.data)
           if serializer.is_valid(raise_exception=True):
               serializer.save()
               return Response(serializer.data)  
   
       def delete(self, request, review_pk) :
           review = self.get_reivew(review_pk)
           review.delete()
           data={
               'delete' : f"reivew {review_pk}번 글이 삭제 되었습니다"
           }
           return Response(data, status.HTTP_204_NO_CONTENT)
   ```

   

