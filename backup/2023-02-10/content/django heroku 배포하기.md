---
title: "django heroku 배포하기"
description: "Heroku는 PaaS 개념의 서비스로 많은 웹 기반환경의 관리를 제공한다. 서버관리, 로드 밸런싱, 역방향 프록시등 여러가지 웹 기반환경들을 Heroku가 내부적으로 모두 제공하므로 이에 대한 걱정을 덜고 쉽게 개발을 시작할수 있다.Heroku는 Django 웹사이트"
date: 2021-06-06T17:29:07.066Z
tags: ["django"]
---
# Heroku

* Heroku는 PaaS 개념의 서비스로 많은 웹 기반환경의 관리를 제공한다. 

* 서버관리, 로드 밸런싱, 역방향 프록시등 여러가지 웹 기반환경들을 Heroku가 내부적으로 모두 제공하므로 이에 대한 걱정을 덜고 쉽게 개발을 시작할수 있다.

* Heroku는 Django 웹사이트를 한 개이상의 "[다이노(Dyno](https://devcenter.heroku.com/articles/dynos))"에서 실행한다. 

  * 다이노란 고립적이고, 가상화된 **Unix** 콘테이너이며 어플리케이션을 실행하는데 필요한 환경을 제공한다. 

  

* **제약점**

  * 무료 단계의 Heroku는 활성주기가 짧은 저장공간을 제공하므로 **유저가 업로드한 파일을 Heroku 자체에 안전하게 저장할 수는 없다.**
    * AWS S3 와 같은 서비스를 이용해야함.
    * DB 도 내부에 파일형식으로 저장하는 sqlite 가 아닌 postgresql 을 사용함. 
  * 무료 단계에서는 30분동안 아무런 요청도 없다면 웹 앱은 비활성화 될 것이다. 이 후에 요청이 오면 응답하는데 몇 초정도 약간의 시간이 더 필요하게 될것이다. 
  * 무료 단계에서는 웹 사이트의 동작 가능 시간이 매월 특정시간 만큼으로 제한된다 ( 사이트가 "비활성(asleep)"상태인 경우의 시간은 제외된다)
  * [다른 제약 링크](https://devcenter.heroku.com/articles/limits)

  

* Heroku 가입하기 (https://signup.heroku.com/)



## 배포준비하기

### 1. CORS 풀어두기

- `ALLOWED_HOSTS` 설정을 임시로 전부 허용해 준다.

```python
#settings.py

ALLOWED_HOSTS = ['*']  # 임시로 설정.
```

- 디버깅 모드에서 `ALLOWED_HOSTS` 변수가 빈 리스트일 경우 `['localhost', '127.0.0.1', '[::1]']` 의미가 된다. 즉, 로컬 호스트에서만 접속이 가능하다.

  디버깅 모드를 끄면 일체 접속이 허용되지 않고 아래와 같이 명시적으로 지정한 호스트에만 접속할 수 있다.

  ```python
  ALLOWED_HOSTS = ['example.com', 'www.example.com', 'localhost', ]
  ```



### 2.`중요한 값(API KEY)` 숨기기

- `SECRET_KEY, DEBUG` 값 등 `중요한 값(API KEY)` 숨기기
- python 의 `decouple` 사용. (https://pypi.org/project/python-decouple/)
  - `pip install python-decouple`
  - 원래 ` os.environ.get('DJANGO_SECRET_KEY')` 이런 식으로 하는게 정석이지만, 윈도우 환경변수에 등록하고 받기가 귀찮으므로 이걸로 대체해서 사용
    - https://developer.mozilla.org/ko/docs/Learn/Server-side/Django/Deployment
- `.env` 파일을 `manage.py` 와 같은 위치에 **생성**한다
  - `.gitignore` 에 `.env` 를 등록해서 git 에 올라가지 않게 한다.

```python
# .env
SECRET_KEY=dj9oh154y8eh320QZX3%0h2_23adg39asj293i
```

- settings.py 수정

```python
# settings.py

from decouple import config

SECRET_KEY = config('SECRET_KEY')
# cast=bool 이 없으면 False 를 문자열로 인식하게됨.
DEBUG = config('DEBUG', default=False, cast=bool)
```





### 3. gunicorn 설치

- `pip install gunicorn`
  - heroku는 gunicorn 웹서버를 추천한다.



#### gunicorn 이란?

- 보통 Django+uWSGI+nginx (+docker) 조합으로 배포를 많이 하게 된다.
  - uWSGI를 많이 사용하고 있어서 보통 성능에 대해 생각하지 않고 사용하는 경우가 많지만,
  - uWSGI가 다른 웹서버(gunicorn, cheerypi, Bjoern) 들에 비해 무겁다(자원 소모를 많이하고, ram, cpu 사용량이 많다)
  - gunicorn 은 빠르고 가볍고, 간단한 장점을 가지고 있다.
- 역할은 무엇인가?
  - 왜 필요한가?
    - Web Server 는 Client 의 정적인 리소스(File, Image, HTML page, ...) 요청을 처리하는 프로그램이며, 대표적으로 Apache HTTP Server 와 Nginx 가 있다.
    - 동적인 요청이 들어오면 비즈니스 로직을 수행하기 위해 Web Application(혹은, WAS, AS) 에게 요청을 위임하고, Web Application 은 Web Server 에게 로직을 수행한 결과를 다시 돌려준다.
    -  Web Server 가 Web Application 과 대화할 수 있는 인터페이스가 필요하다.
  - CGI
    -  Common Gateway Interface라고 하는데 한국말로 직역하자면 "공용 경로 인터페이스"
    - 개발자들은 각자 자신이 사용하던 언어를 사용하기 시작했는데 언어가 제각각이니 규격도 제각각 아니겠는가. 하지만 이를 "공통적인 형태"로 주고받기 위해 만든 것이 바로 CGI
    - 작동방식
      1. 먼저 Web Server 가 Client 로 부터 HTTP Request 를 받는다.
      2. CGI를 통해 일관된 형태로 해석되어 Web Application에 전달
      3. 사전 작성해놓은 로직에 따라 처리 후 정적인 페이지를 Web Server 에게 전달
      4. webserver의 http response를 통해 Client 에게 전달한다.
    - web server와 Web Application 차이
      - web server - 웹 서버는 **정적**인 컨텐츠( html, css, js )를 제공하는 서버
        - ex) Apache, Nginx 
      - WAS는 DB 조회나, 어떤 로직을 처리해야 하는 **동적**인 컨텐츠를 제공하는 서버
        - ex) Tomcat, Jeus, Django
    - 단점
      - 매번 스크립트를 실행하여 메모리에 적재하는 과정에서 발생하는 추가적인 시간 소요로 WSGI가 등장하게 됨
  - WSGI
    - **WSGI(Web Server Gateway Interface)**(위스키라고 읽는다) 
    - 파이썬 스크립트가 웹 서버와 통신하기 위해 만들어진 인터페이스
    -  웹서버에서의 요청을 해석하여 파이썬 응용프로그램에 던지는 역할
  - WSGI middleware
    - **WSGI module** +  **WSGI Process** = WSGI middleware
    - **Web** 서버와 **application**을 연결


![](../images/b2c02600-9176-4930-b4b7-1e3fcb54bb50-%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-08-26%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.40.59.png)



### 3. Procfile 작성

- **(중요) 파일 이름 대문자 확인 및 확장자를 적지 않는다.**
- `manage.py` 와 같은 위치에 생성한다.
  - 아래에 복사해서 사용 (마지막에 `-` 빠뜨리면 안된다.)

```
web: gunicorn {settings.py의 폴더명}.wsgi --log-file -
```



### 4. Database 설정

- Heroku는 postgreSQL을 기본으로 사용하기 떄문에 설정해주어야한다.
- 설치
  - `pip install dj-database-url`
    - 데이터베이스 관련 옵션을 변수로 쉽게 접근할 수 있게 해주는 유틸리티
  - `pip install psycopg2`
    - postgreSQL용 드라이버
- settings.py 맨 하단에 복사

```python
# Heroku: Update database configuration from $DATABASE_URL.
import dj_database_url
db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)
```



### 5. static 파일 설정

- heroku에선 static file인 CSS등을 인식하게 해주기 위해 추가로 설치할게 필요
- 설치
  - `pip install whitenoise`
    - static 파일 서빙용 미들웨어
- `settings.py > MIDDLEWARE` 의 `'django.middleware.security.SecurityMiddleware',` 아래에 추가
  - `'whitenoise.middleware.WhiteNoiseMiddleware',`
- settings.py 에 static 관련 경로 추가

```python
# settings.py

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

# The URL to use when referring to static files (where they will be served from)
STATIC_URL = '/static/'

STATIC_ROOT = BASE_DIR / 'staticfiles' 

# 아래와 같은 형태는 Django 2.x.x 에서 쓰이던 문법.
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') 
```

- collectstatic 하기
  - `python manage.py collectstatic`
  - 배포를 위해 모든 정적파일을 모아둠



### 6. runtime.txt 파일 작성

* `manage.py` 와 같은 위치에 파일 생성
* 아래와 같이 배포하려는 파이썬 버전을 적어준다.

```python
python-3.8.7
```



### 7. pip freeze

- `pip freeze > requirements.txt`



## 배포하기

* 헤로쿠 CLI 설치
  * https://devcenter.heroku.com/articles/getting-started-with-python#set-up
* vscode 를 종료후 다시 실행
  * `heroku help` 를 터미널에 입력했을 때 실행이 안되면 vscode 를 종료 후 다시 실행해야 합니다.
* `heroku login` 헤로쿠 로그인 진행.
* [T] : vscode 터미널에서 작업해야 합니다.
* [B] : browser 에서 작업해야 합니다.



1. **[T]** `heroku create [프로젝트명]` 를 vscode 터미널에서 입력한다.
   
   * create 뒤에 프로젝트명을 넣지않아도 동작함.
     * 아무것도 안붙이면 랜덤으로 이름이 정해짐. (차후 수정 가능함)
   
   
   
2. **[T]** `git push heroku main`

   - 구버전은 main이 아니라 master

   * git 에 최종 commit 된 버전을 그대로 heroku 로 push 하면 heroku 에서 알아서 배포를 해줌.

   ```bash
    File "/tmp/build_8fe9a460/eds_music_travel_with_tony_back/settings.py", line 25, in <module>
   remote:            SECRET_KEY = config('SECRET_KEY')
   remote:          File "/app/.heroku/python/lib/python3.7/site-packages/decouple.py", line 199, in __call__
   remote:            return self.config(*args, **kwargs)
   remote:          File "/app/.heroku/python/lib/python3.7/site-packages/decouple.py", line 83, in __call__
   remote:            return self.get(*args, **kwargs)
   remote:          File "/app/.heroku/python/lib/python3.7/site-packages/decouple.py", line 68, in get
   remote:            raise UndefinedValueError('{} not found. Declare it as envvar or define a default value.'.format(option))
   remote:        decouple.UndefinedValueError: SECRET_KEY not found. Declare it as envvar or define a default value.
   ```

   * 에러가 뜨는데 우리가 숨겨둔`SECRET_KEY` 를 찾을 수 없어서 발생

     * `.env` 파일은 우리 pc 에서만 유효하다.

   * **[B]** 헤로쿠 홈 페이지에서 해결해야함

     * 헤로쿠 홈페이지 로그인 하면 방금 생성된 프로젝트가 프로젝트 리스트에 보일 것임.
     * 헤로쿠 프로젝트로 들어가서 settings 를 찾아서 클릭!
     * 찾아보면 `Config Vars` 를 찾을 수 있음. 
       * 여기에 우리가 `.env` 에서 등록한 내용을 입력한다.
       * KEY 와 VALUE 를 등록해주면 된다.
       * 만약 CORS 설정을 하는 팀이라면 CORS ALLOW HOST 도 decouple 사용해서 등록하는 것을 추천.
     * 그리고 다시 vscode 터미널에 돌아와서 `git push heroku main` 진행

     

   * **[T]** 설정이 완료 되었으면 다시 `git push heroku main` 을 해준다.

     * 설치된 package 에 따라서 에러가 발생할 수 있음.
     * 에러 로그를 꼼꼼히 확인해 봅시다.
     * Java 엔진이 필요한 몇몇 패키지들은 따로 설정변경이 필요함.
       * 관련 자료는 구글에 많이 있으므로 확인하면서 적용해 봅시다.



* **[B]**완료가 되면 DB 생성해야 한다.

  * 헤로쿠 프로젝트 페이지에 들어간다.

  * 우측 상단에 보면 `More` 가 있다.

  * `More > Run Console` 클릭

  * `bash` 를 입력하고 `Run` 을 클릭.

  * 하단에 터미널이 오픈됨.

    * ls 를 쳐서 manage.py 가 있는지 확인
    * migrate 를 진행한다.
    * 주의) Tab 자동완성하면 실제 탭 동작으로 focus 가 터미널에서 닫힘 버튼으로 이동하니 스페이스바 혹은 엔터 누르면 터미널 창이 닫힐 수 있음.

    

* 배포는 완료되었으며 테스트를 해 보자.
  * 일반 HTML 을 보여주는 welcome page 하나는 생성해 주는 것을 추천함.
    * DEBUG 를 False 로 줬기 때문에 이제는 404 에러가 발생한다.
    * 특정 주소를 입력하면 화면에 간단하게 `Hello` 라는 글자를 보여주는 페이지가 있으면 동작이 잘 된다는 것을 간편하게 알 수 있다.
  * DB에 데이터를 미리 넣어두고 싶다면 dumpdata 로 데이터를 미리 준비해 두는 것을 추천함.



* 테스트도 문제 없으면 `settings.py` 에서 `ALLOWED_HOSTS` 를 재설정한다.

  * `http://` 는 제외하고 기본 domain 주소만 등록한다.

  ```python
  # settings.py
  
  ALLOWED_HOSTS = [
      '[여긴 헤로쿠 보통 프로젝트 명].herokuapp.com',
      '127.0.0.1' # 로컬 테스트를 위해 등록
  ]
  ```

  * 수정했으면 git commit 후 `git push heroku main` 을 해주면 된다.



* 소스 코드의 수정이 있으면 git repo에 push 와 함께 heroku 에도 push 해주면 된다.
  * `git push origin main` 
  * `git push heroku main` 



**(추가) Heroku 로그 보는 방법**

* `Debug True` 로 변경해야 자세한 정보를 볼 수 있음.
* `heroku logs --source app --tail` 를 vscode 에서 치면 실시간 로그를 볼 수 있다.