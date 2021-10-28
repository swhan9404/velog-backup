---
title: "django의 단위테스트(tests.py)"
description: "https&#x3A;//docs.djangoproject.com/en/3.2/topics/testing/overview/테스트 실행 방법python mange.py testdjango 각각의 앱들을 순회하면서 모든 test.py 를 가져와서 클래스들을 불러오게 됨cla"
date: 2021-05-02T09:26:42.353Z
tags: ["django"]
---
# 1. test

- https://docs.djangoproject.com/en/3.2/topics/testing/overview/

- 테스트 실행 방법

  - `python mange.py test`

    - django 각각의 앱들을 순회하면서 모든 test.py 를 가져와서 클래스들을 불러오게 됨

    - class 내부에 `test_` 로 시작하는 함수들을 실행하고 그 결과를 반환하게 됨

    - `setUp` 함수는 단위테스트를 실행하기 전에 공통적으로 수행할 어떤 작업의 내용을 넣어줌.

      여기에 쓴 코드는 `test_`가 붙은 함수들에 decorator처럼 붙어서 테스트 실행시 `setUp`먼저 실행되고 `test_` 함수가 실행된다고 보면 됨



- test.py

```python
from django.test import TestCase
from django.test import Client
from .models import Article
from django.contrib.auth import get_user_model

class ArticleTest(TestCase) :
    def setUp(self) :
        User = get_user_model()
        user = User.objects.create_user(username='test', password='123') # 새 계정만듬 - 회원가입
        Article.objects.create(title='hello', user=user) # 회원가입한 계정으로 게시글 생성
    
    def test_article_title(self) :
        article=Article.objects.get(pk=1)
        self.assertEqual(article.title, 'hello')
     
    def test_article_create(self) : # 게시물을 저장하기 위해 이 요청을 보냈을 때 재대로 저장이 되는지 평가
        c = Client() # 우리가 브라우저로 켜는 것 대신 얘가 요청을 보내고 처리를 대신 해줌
        # 0. 로그인 확인
        res = c.get('articles/create') # 'articles/create' 주소로 get 요청을 보내고, res에 그 응답내용을 저장
        self.assertEqual(res.status_code, 302) # res.status_code와 302가 같은지 비교, 같지 않다면 에러가 발생함.
        
        # 1. /articles/create/ 로 GET 요청
        c.login(username='test', passwrod='123') # 로그인
        res = c.get('articles/create/') # article/create 로 이동 후 res 저장
        self.assertEqual(res.status_code, 200)
        self.assertTemplateUsed(res, 'articles/article_form.html') # html 파일이 일치하는지 확인
        self.assertContains(res, '<h1>form</h1>') # html 문서 안에 원하는 데이터가 있는지
        
        # 2. /articles/create/ 로 POST 요청(invalid)
        res = c.post('articles/create/') # 게시글 내용없이 요청을 보내봄
        self.assertContains(res, 'This field is required') # 잘 튕겨져 나오는지 확인
        self.assertEqual(res.status_code, 200)
        
        # 3. /articles/create/ 로 POST 요청(valid)
        before = Article.objects.last() # 게시물 작성 전 맨 뒤에 게시글
        res = c.post('articles/create/', {'title':'hi'}) # 새 게시물 작성
        after = Article.objects.last() # 게시물 작성 후 맨 뒤에 게시글
        self.assertEqual(res.status_code, 302)
        self.assertEqual(res.url, 'articles/2/') # 페이지 잘 이동되었는지 확인
        self.asertNotEqual(before, after) # 새글이 잘 들어갔는지 확인/ before와 after는 서로 달라야함
        
    def test_article_list(self) :
    	c=Client()
        res = c.get('articles/')
        context_articles = res.context.get('articles')
        queryset_articles = Article.objects.all()
        
        self.assertEqual(list(context_articles), list(queryset_articles))
        self.assertTemplateUsed(res, 'articles/article_list.html')
        
```



## 1.1 Django 단위 테스트의 계층구조

- https://docs.djangoproject.com/en/3.2/topics/testing/tools/#provided-test-case-classes
- standard library unittest 의 TestCase
  - python 내에는 유닛테스트를 가능케 해주는 모듈이 이미 있다.
    - unittest - django에서는 이것을 활용하여 unitest를 구현했다.
    - pytest
- TestCase
  - 가장 일반적인 단위테스트 클래스

- LiveServerTestCase

  - 백그란운드에서 라이브 Django 서버를 시작하고 해체시 종료됨
  - Django 더미 클라이언트(Selenium 클라이언트 등) 이외에 자동화 된 테스트 클라이언트를 사용하여 브라우저 내에서 일련의 기능 테스트를 실행하고 실제 사용자의 작업을 시뮬레이션 할 수 있음

  - https://docs.djangoproject.com/en/3.2/topics/testing/tools/#liveservertestcase

- TransactionTestCase

  - 데이터베이스 테스트
  - ORM을 쉽게 테스트 할 수 있음

- SimpleTestCase

  - 데이터베이스를 활용하지 않는 테스트
  - https://docs.djangoproject.com/en/3.2/topics/testing/tools/#django.test.SimpleTestCase


undefined




## 1.2 Unit Test 개념 및 용어

- `TestCase` : unittest 프레임 워크의 테스트 조직의 기본 단위
- `Fixture` : 테스트를 진행할때 필요한 테스트용 데이터 혹은 설정 등을 이야기 한다. 주로 테스트 가 실행되기 전이나 후에 생긴다.
- `assertion` : unittest에서 테스트 하는 부분이 제대로 됬는지를 확인하는 부분. Assertion이 실패하면 테스트도 실패한다.



## 1.3 Test Fixture

- 테스트 시나리오에 따라 어떤 경우는 테스트 전에 테스트를 위한 사전 준비 작업을 할 필요가 있습니다.또한 테스트가 끝난 후 테스트를 하기 위해 만든 리소스들을 정리(clean up)를 해야하는 경우도 있을 수 있습니다.
  - `setUp()`  :이렇한 사전 준비 작업을 위해 이라는 메서드를, 
  - `tearDown()` : clean up 처리를 위해 이라는 메서드를 제공합니다. 
  - 이러한 기능들을 Test Fixture라 하며, Fixture는 각각의 테스트 메서드가 실행되기 전과 후에 매번 실행됩니다.



## 1.4 Unit Test의 일반적인 원칙

- 가장 단위에 집중

  - 테스트 유닛은 각 기능의 가장 작은 단위에 집중하여, 해당 기능이 정확히 동작하는지를 증명해야 합니다.

- 각 유닛 테스트는 독립적

  - 각 테스트 유닛은 반드시 독립적이어야 합니다. 각 테스트는 혼자서도 실행 가능해야하고, 테스트 슈트로도 실행 가능해야 합니다. 이 때, 호출되는 순서와 무관하게 잘 동작해야 합니다. 이 규칙이 뜻하는 바, 새로운 데이터셋으로 각각의 테스트를 로딩해야 하고, 그 실행 결과는 꼭 삭제해야합니다. 보통 setUp() 과 tearDown() 메소드로 이런 작업을 합니다.

- 테스트 시간을 최대한 단축해야한다.

  - 테스트 하나가 실행하는데 몇 밀리세컨드 이상의 시간이 걸린다면, 개발 속도가 느려지거나 테스트가 충분히 자주 수행되지 못할 것입니다.
  - 별도 테스트 슈트 분리
    - 테스트에 필요한 데이터 구조가 너무 복잡하고, 테스트를 하려면 매번 이 복잡한 데이터를 불러와야 해서 테스트를 빠르게 만들 수 없는 경우도 있습니다. 이럴 때는 무거운 테스트는 따로 분리하여 별도의 테스트 슈트를 만들어 두고 스케쥴 작업을 걸어두면 됩니다. 그리고 그 외의 다른 모든 테스트는 필요한 만큼 자주 수행하면 됩니다. 

- 그날 코딩을 시작할 때, 끝날 때 풀 테스트 슈트를 돌리는게 좋다. 

  - 문제 발생이나 원인 규명을 더 빠르게 할 수 있고, 자신의 코드가 다른 코들르 망가뜨리지 않았다는 자신감을 줄 것이다.

- 테스트 함수의 이름은 최대한 길고, 자세하고 서술적인 이름으로 작성할 것

  - 테스트 함수에는 길고 서술적인 이름을 사용하셔야 합니다. 테스트에서의 스타일 안내서는 짧은 이름을 보다 선호하는 다른 일반적인 코드와는 조금 다릅니다. 테스트 함수는 절대 직접 호출되지 않기 때문입니다. 실제로 돌아가는 코드에서는 square() 라든가 심지어 sqr() 조차도 괜찮습니다. 하지만 테스트 코드에서는 test_square_of_number_2(), test_square_negative_number() 같은 이름을 붙여야 합니다. 이런 함수명들은 테스트가 실패할 때나 보입니다. 그러니 반드시 가능한 한 서술적인 이름을 붙여야 합니다.

  

