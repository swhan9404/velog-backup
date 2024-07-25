---
title: "python 의 시간 다루기"
description: "개인프로젝트만 하고 살았을 때는 몰랐지만, 실제 업무환경에서는 시간을 다룰 일이 많다. 나중에도 햇갈릴 때 보려고 이 글을 작성한다.그리고, 업무환경에서는 로컬 시간이 아닌 UTC 시간을 표준으로 하여 모든 데이터를 저장한다. - 다른 언어와 호환성을 위해서timest"
date: 2021-11-10T13:29:39.637Z
tags: ["python"]
---
개인프로젝트만 하고 살았을 때는 몰랐지만, 실제 업무환경에서는 **시간**을 다룰 일이 많다. 

나중에도 햇갈릴 때 보려고 이 글을 작성한다.

그리고, 업무환경에서는 로컬 시간이 아닌 UTC 시간을 표준으로 하여 모든 데이터를 저장한다. - 다른 언어와 호환성을 위해서



# 시간 표기의 형태

- timestamp 
  - epoch 시간(1970년 1월 1일 자정) 이후로 즉 Unix 가 탄생한 사건을 기준으로 초 단위로 측정한 절대 시간
- UTC (Univeral Time Coordinated)
  - 1972년 시행된 국제 표준시(협정 세계시)이면 세슘 원자의 진동수에 의거한 초의 길이가 기준
- GMT (Greenwich Mean Time)
  - 영구의 런던의 그리니치 천문대의 지오선상을 기준으로 하는 평균 태양시
- LST (Local Standard Time)
  - UTC 기준으로 경도 15도마다 1시간 차이가 발생하는 시간이며, 지방 표준시라 부른다.
  - 한국은 동경 135도를 기준으로 UTC 보다 9 시간 빠르다.
- DST ( Daylight Saving TIme)
  - 일광절약시간으로 서머타임이라고 불리며 , 에너지 절약을 목적으로 시간을 앞당기거나 뒤로 미루는 제도



# 관련 클래스



## date

> `datetime` 내장 모듈의 `date` 클래스는 날짜를 표현하는데 사용됨

- 클래스 생성자의 인자 - 연, 월, 일

```python
import datetime import date
date(2019, 12, 25) # datetime.date(2021, 12, 25)
```



- year, month, day 속성에 접근하여 데이터를 볼 수 있음

```python
today = date.today()
today.year # 2021
today.month # 11
today.day # 10
```



- 요일 파악하기
  - `weekday()` : 월요일이 0 으로 시작
  - `isoweekday()`  : 월요일이 1 으로 시작

```python
today = date.today()
today.weekday() # 2 - 수요일
today.isoweekday() # 3 - 수요일
```



- 데이터 변경하기 - replace

```python
today = date.today()
new_date = today.replace(year=2020) # datetime.date(2020, 11, 10)

```



## time

>  `time` 클래스는 시간을 표현하기 위해서 사용됨

- 클래스 생성자의 인자 - 시, 분, 초 , 마이크로초, 시간대(tzinfo)
  - 모든 인자가 필수인자가 아니며, 없을 경우 0이 기본값이 됨

```python
from datetime import time
time(13, 14, 15) # datetime.time(13, 14, 15) - 13시 14분 15초 0 마이크로초
time(13, 42, 35, 458000, tzinfo=timezone(timedelta(hours=9))) 
```



- 속성 데이터 접근

```python
t = time(13, 42, 35, 458000, tzinfo=timezone(timedelta(hours=9)))
t.hour # 13
t.minute # 42
t.second # 35
t.microsecond # 458000
t.tzinfo # datetime.timezone(datetime.timedelta(seconds=32400))
```



- timestamp 만들기

```python
from time import time

now_timestamp = time.time()
print(now_timestamp) # 1596094416.9727871
```





## datetime

> `datetime` 클래스는 날짜와 시간을 동시에 표현하기 위해서 사용되며, 
> 위에서 다룬 `date`와 `time` 클래스에서 지원하는 대부분의 기능을 지원

- 생성자의 인자
  - 연, 월, 일
  - 시, 분, 초, 마이크로 초, 시간대

```python
from datetime import datetime
datetime(2020, 7, 18, 13, 26, 23) # datetime.datetime(2020, 7, 18, 13, 26, 23)
```



- date 객체 + time 객체 => datetime 객체

```python
from datetime import date, datetime, time
d = date(2020, 7, 18)
t = time(13, 26, 23)
datetime.combine(d, t) # datetime.datetime(2020, 7, 18, 13, 26, 23)
```



- timestamp => datetime 객체
  - datetime모듈의 datetime객체의 **fromtimestamp()함수**에 인자로 time.time()을 넘겨주면 현재 시간을 datetime객체로 변환해준다.
  - **utcfromtimestamp()함수**에 time.time()을 넘겨주면 utc시간 객체로 반환해준다.

```python
from datetime import datetime

now_timestamp = time.time()
datetime.fromtimestamp(now_timestamp) # 2020-07-30 16:33:36.972787
datetime.utcfromtimestamp(now_timestamp) # 2020-07-30 07:33:36.972787
```





## timedelta

> `datetime` 내장 모듈의 `timedelta` 클래스는 기간을 표현하기 위해서 사용

- 클래스 생성자 인자 -  주, 일, 시, 분, 초, 마이크로 초, 밀리 초

```python
from datetime import timedelta
timedelta(days=5, hours=17, minutes=30) # datetime.timedelta(days=5, seconds=63000)
```

| 단위        | Method                             |
| :---------- | :--------------------------------- |
| 1주         | datetime.timedelta(weeks=1)        |
| 1일         | datetime.timedelta(days=1)         |
| 1시간       | datetime.timedelta(hours=1)        |
| 1분         | datetime.timedelta(minutes=1)      |
| 1초         | datetime.timedelta(seconds=1)      |
| 1밀리초     | datetime.timedelta(milliseconds=1) |
| 1마이크로초 | datetime.timedelta(microseconds=1) |





- timedelta를 이용한 시간/ 날짜 계산

```python
from datetime import date, timedelta

# 일주일 후 날짜를 구하기
week = timedelta(weeks=1) 
next_week = date.today() + weeek # datetime.date(2021, 7, 25)

# 3일전을 구하기
three_day = timedelta(days=3)
before_day = date.today() - three_day # datetime.date(2021, 7, 15)
```



## timezone

> `datetime` 내장 모듈의 `timezone` 클래스는 시간대를 표현하기 위해서 사용

- 클래스 생성자 인자 - UTC 기준으로 시차를 표현하는 `timedelta` 객체를 인자로 받아 `timezone` 객체를 생성

```python
# 한국 시간 = UTC + 9 시간  표현하기
from datetime import timedelta, timezone
kr_time_zone = timezone(timedelta(hours=9)) # datetime.timezone(datetime.timedelta(seconds=32400))

```



# 라이브러리



## pytz

> 세계 시간대 정의를 위한 python 라이브러리

- 짤막 상식
  - pytz는 Olson tz databse를 Python으로 옮겨온 라이브러리이다/



- pytz에 사용하는 timezone 에 들어갈 값을 알고 싶다면 아래 링크에서 TZ database name 을 보면 된다.
  - https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

```python
import pytz
# 국가코드로 타임존 검색
print(pytz.country_timezones('KR'))  # ['Asia/Seoul']
```



- timezone 을 이용하여 datetime 의 tzinfo 값을 넣어주면, 시간을 다른 지역시간으로 변경할 수 있다.

```python
import pytz

KST = pytz.timezone('Asia/Seoul')
utc_now = datetime.utcnow(timezone.utc) 
kr_now = utc_now.astimezone(KST) # UTC 시간을 KR 시간으로 변경
```





# 실전 예제



## 현재시간

```python
# date를 이용한 날짜 구하기
date.today() # datetime.date(2021, 11, 10)

# datetime 자기 시간(지역시간)
datetime.now() # datetime.datetime(2020, 7, 18, 13, 40, 30, 20143) 

# datetime UTC 시간 - utcnow() 해도 tzinfo는 비어있어서 넣어줘야함
datetime.utcnow(timezone.utc) # datetime.datetime(2020, 7, 18, 17, 41, 26, 814580, tzinfo=datetime.timezone.utc)
```





## 출력

```python
# date.isoformat()를 이용한 문자열 변환 (YYYY-MM-DD) 형태로 변환
date.today().isoformat() # '2020-07-18'

# time => [+HH:MM[:SS[.ffffff]]] 형태로 변환
t = time(13, 42, 35, 458000, tzinfo=timezone(timedelta(hours=9)))
t.isoformat() # '13:42:35.458000+09:00'

# datetime 출력
datetime.now().strftime('%Y/%m/%d') # '2020/07/18'
datetime.now().strftime("%Y-%m-%d %H:%M:%S") # '2021-04-10 22:48:54'
```



## 문자열 시간을 변환

```python
# (YYYY-MM-DD) 형태의 문자열 => date 객체
date.fromisoformat('2020-07-18') # datetime.date(2020, 7, 18)

# HH[:MM[:SS[.fff[fff]]]] 형태의 문자열 => time 객체
time.fromisoformat('13:42:35.458+09:00') # datetime.time(13, 42, 35, 458000, tzinfo=datetime.timezone(datetime.timedelta(seconds=32400)))

# '%Y/%m/%d' 형태 => datetime
datetime.strptime('2020/07/18', '%Y/%m/%d') # datetime.datetime(2020, 7, 18, 0, 0)
```





## 타지역으로 시간변환

```python
import pytz

KST = pytz.timezone('Asia/Seoul')
utc_now = datetime.utcnow(timezone.utc) # utcnow 로 datetime 객체 만들면서, timezone에 utc임을 명시 - 안해주면 제대로 변환 안됨.
kr_now = utc_now.astimezone(KST) # UTC 시간을 KR 시간으로 변경
```



## 기간별 몇 초인지 구하기

```python
from datetime import timedelta

# 시간
hour_delta = timedelta(hours=1)
hour_delta.total_seconds() # 3600.0

# 일
day_delta = timedelta(days=1)
day_delta.total_seconds() # 86400.0

# 일주일
month_delta = timedelta(weeks=1)
month_delta.total_seconds() # 604800.0
```





# 참고 자료

## **Format Code**

| **포맷 코드** | 설명                                                         | 예                       |
| ------------- | ------------------------------------------------------------ | ------------------------ |
| **%a**        | 요일을 짧게 표시합니다.                                      | Sun                      |
| **%A**        | 요일을 길게 표시합니다.                                      | Sunday                   |
| **%w**        | 요일을 숫자로 표시합니다. 일요일을 0부터 시작하여 토요일은 6입니다. | 0                        |
| **%d**        | 날(day)을 출력합니다. 1부터 31까지가 있겠죠                  | 18                       |
| **%b**        | 월을 영어로 짧게 출력해줍니다.                               | Apr                      |
| **%B**        | 월을 영어로 길게 출력해줍니다.                               | April                    |
| **%m**        | 월을 숫자로 표현합니다.                                      | 04                       |
| **%y**        | 년을 짧게 숫자로 표시합니다                                  | 21                       |
| **%Y**        | 년을 길게 숫자로 표시합니다.                                 | 2021                     |
| **%H**        | 시간을 24시간의 표현 방식(00-23)으로 숫자로 표시합니다.      | 18                       |
| **%I**        | 시간을 0-12시 표시 방법으로 표시합니다                       | 6                        |
| **%p**        | 오전(AM), 오후(PM)을 표시합니다.                             | PM                       |
| **%M**        | 분(0 - 59)을 표시합니다.                                     | 38                       |
| **%S**        | 초(0 - 59)를 표시합니다.                                     | 55                       |
| **%f**        | microsecond단위를 표시합니다.                                | 545433                   |
| **%j**        | 일년중 몇번째일인지 나타냅니다.                              | 108                      |
| **%U**        | 일년 중 몇번째 주 인지 나타내니다. 이 포맷에서 일요일은 일주일의 시작입니다. 일년은 52주, 53주입니다. | 108                      |
| **%W**        | 일년 중 몇번째 주 인지 나타내는 것은 %U와 같지만 일주일의 시작을 월요일로 정합니다. | 108                      |
| **%c**        | Local version의 날짜와 시간을 나타냅니다.                    | Sun Apr 18 17:26:26 2021 |
| **%x**        | Local version의 날짜만 나타냅니다.                           | 04/18/21                 |
| **%X**        | Local version의 시간만 나타냅니다.                           | 17:26:26                 |

