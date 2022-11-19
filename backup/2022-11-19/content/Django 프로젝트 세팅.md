---
title: "Django 프로젝트 세팅"
description: "pair programmingVirtual Environmnet파이썬 인터프리터, 라이브러리 및 스크립트가 "시스템 파이썬"(즉, 운영 체제 일부로 설치되어있는 것)에 설치된 모든 라이브러리와 격리 되어있는 파이썬 환경각 가상 환경은 고유한 파이썬 환경을 가지며 독립적"
date: 2021-03-12T16:18:49.458Z
tags: ["django"]
---
pair programming



# 가상환경

- Virtual Environmnet
- 파이썬 인터프리터, 라이브러리 및 스크립트가 "시스템 파이썬"(즉, 운영 체제 일부로 설치되어있는 것)에 설치된 모든 라이브러리와 격리 되어있는 파이썬 환경
- 각 가상 환경은 고유한 파이썬 환경을 가지며 독립적으로 설치된 패키지 집합을 가짐

- 대표적인 가상 환경 지원 시스템
  - venv, virtualenv, conda, pyenv
  - 파이썬 3.3 부터 venv가 기본 모듈로 내장
- 왜 사용할까?
  - pip로 설치한 패키지들은 Lib/site-packages 안에 저장되는데 이는 모든 파이썬 스크립트에서 사용할 수 있다.
  - 그런데 여러 프로젝트를 진행하게 되면 프로젝트 마다 다른 버전의 라이브러리가 필요할 수도 있는데 파이썬에서는 한 라이브러리에 대해 하나의 버전만 설치가 가능하다.
  - 더불어 각 라이브러리나 모듈은 서로에 대한 의존성(dependency)가 다르기 때문에 알수 없는 충돌이 발생하거나 다른 여러 문제를 일으킬 수 있게 된다.



## 프로젝트 가상환경 만들기

1. 프로젝트 폴더생성

2. 프로젝트 폴더 안에 들어간 뒤 cmd

   - `python -m venv venv`
     - 파이썬을 실행하는데 / 오른쪽에 모듈을 실행시켜줘 / venv 모듈을 / 가상화이름
     - venv 폴더가 생김
       - python이 설치된 곳에서의 `include`, `Lib`, `Script` 가 유사하게 안에 들어가 잇음을 볼 수 있음
       - 마치 python 설치가 전역변수라면, venv 폴더는 로컬변수 개념
         - 내부에서만 실행하게

3. 가상화 실행 > cmd

   - `source venv/Scripts/activate`
     - source : 스크립트 파일을 실행시켜주세요
   - 하고나면 `(venv)` 라고 나타나는 것을 볼 수 있음
   - `pip list`를 치는 순간, 로컬의 설치 리스트만 보이는 것을 볼 수 잇음
     - 가상화 실행 전에 `pip list`를 치면 global 설치를 다 보여줬음
   - 가상화 끄는 방법
     - `deactivate`

4. 이제 필요한 패키지들을 가상화를 킨 상태로 다운

   - `pip install 패키지명` 

5. `.gitignore` 만들기

   - https://www.toptal.com/developers/gitignore
     - python, django, visualStudioCode, Window, mac
     - 살펴보면 `venv` 관련 폴더가 포함되어있음을 확인할 수 있음
     - `db.sqlite3` 도 gitignore에 포함되어있음

6. 환경상태 출력 및 보관

   - `pip freeze` : 현재 깔려있는 모든 모듈을 전부 출력해줌
   - `pip freeze > requirements.txt`
     - `>` : 왼쪽의 결과를 오른쪽에 저장시켜주세요.
     - 그럼 환경상태가 `requirements.txt`에 전부 설치됨

7. requirements 를 참조해서 환경을 다시 세팅하기

   - `pip install -r requirements.txt`
     - `requirements.txt` 파일을 읽어서 pip install을 실행함

8. README에는 어떤 것을 써주나??

   - python 버전

9. 데이터 베이스를 넘기지 않고 더미데이터 형식으로 넘겨줄 것임

   - 데이터베이스를 공유하지 않는 이유

     - 동시에 데이터베이스를 수정하고 공유할 경우 충돌이 발생할 가능성이 높음
     - 또한, 시간에 따라 환경에 따라 같은 자료도 다르게 저장될 수 있는 부분들이 있기 때문에 db를 공유하는 것은 좋지 않음

   - 해결 방안

     - 더미데이터형식을 사용

       데이터베이스의 구조를 그대로 가져와서 하나의 json 파일로 저장

       - dumpData fixtures를 사용한다고 함

         - fixtures : 초기데이터
         - dump : 현재의 상태를 기억

       - dumpData 툴을 사용 

         - https://docs.djangoproject.com/en/3.1/ref/django-admin/#dumpdata

         - `django-admin dumpdata 앱이름/모델이름`

           `python manage.py dumpdata 앱이름/모델이름` : 우리는 manage.py 로 사용할것

           만약 `앱이름.모델이름` 지정안하고 `앱이름` 하면 해당 앱에 대한 모든 model,

           만약 아예 지정이 없으면 모든 앱에대한 모든 model 출력됨

         - `python manage.py dumpdata --indent 4 앱이름.모델이름 > 앱이름.json` 

           -  `--indent 4` : 들여쓰기 4칸씩 주기, 이렇게 하면으로 주어서 보기 더 깔끔해짐
           -  `> 앱이름.json` : 출력결과를 앱이름.json 파일에 저장
              - 근데 이렇게하면 한글의 경우 인코딩때문에 깨질수가 있음
              - 해결방법???

         - 만들어진 json파일을 `앱폴더 > fixtures> 앱이름`에 저장

         - 더미데이터를 데이터 베이스에 넣는 법 

           - `python manage.py loaddata 앱이름/모델이름.json`

       - 이 방식을 통해서 데이터베이스는 공유를 하지 않지만, 데이터 자체는 공유할 수 있게됨

     

     

     

