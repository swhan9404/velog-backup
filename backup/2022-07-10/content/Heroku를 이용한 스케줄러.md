---
title: "Heroku를 이용한 스케줄러"
description: "heroku 와 AWS의 차이amazon AWS 와 Heroku는 소규모 취미 프로제트(시작부터)에 대해 무료이다.아키텍처를 많이 사용자 정의하지 않고 바로 앱을 시작하면 Heroku를 선택하고, 아키텍처에 집중하고 다른 웹 서버를 사용하려면 AWS를 사용하면된다. A"
date: 2021-02-25T06:16:49.012Z
tags: ["telegram_corona","개인프로젝트"]
---
# heroku란?
- heroku 와 AWS의 차이

  amazon AWS 와 Heroku는 소규모 취미 프로제트(시작부터)에 대해 무료이다.

  아키텍처를 많이 사용자 정의하지 않고 바로 앱을 시작하면 Heroku를 선택하고, 

  아키텍처에 집중하고 다른 웹 서버를 사용하려면 AWS를 사용하면된다. AWS는 선택한 서비스/ 제품에 따라 시간이 많이 걸리지만, 그만한 가치가 있고, AWS는 많은 플러그인 서비스 및 제품이 제공된다.

  - Heroku
    - PAAS(platform as a Service) : 코드 및 일부 기본 구성을 푸시하고 실행중인 애플리케이션을 얻는 환경을 제공
    - 좋은 문서
    - 내장 도구 및 아키텍처
    - 앱을 디자인하는 동안 아키텍처를 제한적으로 제어한다.
    - 배포가 처리됩니다.(GitHub를 통한 자동 또는 git 명령 또는 CLI를 통한 수동)
    - 시간이 걸리지 않음
  - AWS
    - IAAS(Infrastructure as Service ) :  그 위에 물건을 만드는데 필요한 구성요소를 제공- 더 많은 것을 구축해야하고, 유지하는 비용으로 더 많은 기능과 유연성을 제공할 수 있음
    - 다용도-EC2, LAMBDA, EMR 등과 같은 많은 제품이 존재
    - OS, 소프트웨어 버전 등을 선택하는 등 아키텍처를보다 강력하게 제어하기 위해 전용 인스턴스를 사용할 수 있습니다. 백엔드 레이어가 두 개 이상 있습니다
    - Elastic Beanstalk는 Heroku의 PAAS와 유사한 기능입니다.
    -  자동 배포를 사용하거나 직접 배포할 수 있습니다.
    
    
    
# heroku 이용방법
## 가입
https://id.heroku.com/

## heroku 다운로드

https://devcenter.heroku.com/articles/heroku-cli#download-and-install

## heroku 에 python code 올리기

- 먼저 git으로 관리되고 있는 프로젝트 폴더로 이동(배포에 git을 이용하기 떄문에 설치가 되어있어야함)
- CLI를 이용하여 login하고 heroku에 앱을 생성

  ```bash
  $ heroku login
  $ heroku create
  ```

  앱이 생성되었다는 메세지와 함께 생성된 앱의 이름(heroku_app_name)이 표시됨

  https://dashboard.heroku.com/apps 에 들어가면 동일한 이름의 앱이 생성되는 것을 확인할 수 있음.

  ```bash
  $ git init
  $ heroku git:remote -a blooming-everglades-60162
  $ git add .
  $ git commit -m "first"
  $ git push heroku master
  ```

- 필요한 파일 추가
  - requirements.txt

    > 명령으로 현재 프로젝트에 사용되고 있는 패키지들의 리스트를 저장해서 heroku에서 배포할 때도 설치할 수 있도록 해줘야한다.
    >
    > 밑에 코드를 하면 현재 python 환경의 모든 패키지들이 써짐으로, 내가 필요한 패키지인 것만 써주자(버전은 pip list로 확인해서 넣음된다)
    >
    > ```
    > APScheduler==3.6.3
    > beautifulsoup4==4.6.0
    > requests==2.18.4
    > firebase-admin==4.5.1
    > ```
    >
    > 밑의 freeze 로 할시에 heroku에 안올라가는 에러가 발생했으니 주의

    ```bash
    $ pip freeze > requirements.txt
    ```

  - runtime.txt

    > 사용하고 있는 python version을 명시해줘야한다.
    >
    > https://devcenter.heroku.com/articles/python-support#supported-runtimes

    ```bash
    $ echo 'python-3.6.5' > runtime.txt
    ```

  - Procfile

    > 서버에서 실행할 명령어를 넣어준다. 
    >
    > 명령어 앞에 process type을 지정하는데
    >
    > - web
    > - worker
    > - urgentworker
    > - clock
    >
    > 등을 사용할 수 있다. 
	> clock을 사용한 이유는 Scheduler를 이용하여 특정 시간에 주기적으로 process를 실행시키기 위함이다.

    ```bash
    $ echo 'clock: python 파일명.py' > Procfile
    ```
  - python build팩 설치

  https://devcenter.heroku.com/articles/buildpacks

  ```bash
  $ heroku buildpacks:set heroku/python
  $ heroku create --buildpack heroku/python
  ```
## APSchedular로 python코드를 주기적으로 실행되게 하기

> - Python code를 주기적으로 수행할 수 있게 도와주는 Python Library
  > - APSchedular는 자체적으로 Daemon 이나 Service 가 아님
  > - 이미 존재하는 Application 내에서 수행

  - 수행방식

    - `cron` : Cron 표현식으로 Python code를 수행
    - `interval` : 일정 주기로 Python code를 수행
    - ` date` : 특정 날짜에 Python code를 수행

  - Schedular 종류

    여러가지가 있지만 2개가 가장 많이 쓰임

    - `BlockingScheduler` : 단일 Job 수행시

    - `BackgroundSchedular` : 다수 Job 수행시

      (background 에서 Job들이 수행되며, 여러 Job들을 등록하여 동시에 수행할 수 있다)

  - 해야할일

    1. pip 설치
    
       ```bash
         $ pip install apscheduler
       ```
    
    2. `clock.py`를 생성
    
    3. `Profile` 파일 안에 `clock: python clock.py`를 추가(이떄 상대경로를 입력해줘야한다.)
    
    4. git add & commit 하고 `$ git push heroku master`를 터미널에 입력
    
    5. 터미널에 `$ heroku ps:scale clock=1`를 입력

  - `cron`에 대한 부가적인 설명

    > `cron` 이란 유닉스 계열 컴퓨터 운영 체제의 시간 기반 잡 스케줄러

    > [분] [시] [일] [월] [요일] [실행할 명령어] 로 구성
    >
    > ```bash
    > # 월 ~ 금요일 10시 30분에 test.py 실행
    > 30 10 * * 1-5 python /home/norr/test.py
    > # 매월 15일에 10분마다 scan.py 실행
    > */10 * 15 * * python /home/norr/scan.py
    > ```

    > APScheduler의 cron 사용 document
    >
    > https://apscheduler.readthedocs.io/en/stable/modules/triggers/cron.html?highlight=cron#apscheduler.triggers.cron.CronTrigger

  

  ```python
  from apscheduler.schedulers.blocking import BlockingScheduler
  
  sched = BlockingScheduler()
  
  @sched.scheduled_job('interval', minutes=3)
  def timed_job():
      print('This job is run every three minutes.')
  
  @sched.scheduled_job('cron', day_of_week='mon-fri', hour=17)
  def scheduled_job():
      print('This job is run every weekday at 5pm.')
  
  sched.start()
  ```

  > 첫 번째 지정한 데코레이터(`@sched.scheduled_job('interval', minutes=3)`)는 3분 간격으로 아래의 함수를 호출한다는 의미로 `This job is run every three minutes.` 이라는 메세지를 출력한다.
  >
  > 두 번째 지정한 데코레이터(`@sched.scheduled_job('cron', day_of_week='mon-fri', hour=17)`)는 평일 17시 마다 `scheduled_job()` 함수를 호출하여 `This job is run every weekday at 5pm.`이라는 메세지를 출력한다.
  >
  > `sched.start()`를 통해 scheduler가 동작을 시작한다.

## timezone 맞추기
> 원하는 시간에 프로그램이 실행되도록 하려면 timezone이 나의 시간과 일치해야한다
heroku 서버의 timezone도 맞춰서 설정해줘야 한다. CLI를 통해서 timezone을 지정하여 위의 명령을 실행하면 된다.

  ```bash
  $ heroku config:add TZ="Asia/Seoul"
  ```
  
# 여기까지 왔으면 나와야하는 결과
- 수동으로 세팅한 곳
  - firebase 데이터베이스 : 코로나 정보 받을 사람 목록
- scheduler에 명시한 특정 시간에 git push heroku master 한 나의 python 코드가 heroku에서 실행되어야함.
- 실행내용 : 코로나 정보가 새로운 정보이면 코로나 정보를 코로나 정보 받을사람에게 전달