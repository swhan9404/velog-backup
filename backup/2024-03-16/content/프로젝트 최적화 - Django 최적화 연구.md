---
title: "프로젝트 최적화 - Django 최적화 연구"
description: "디버그 끄기- 완료!비싼 인스턴스 쓰기 - 무료밖에 못씀.. 쿼리 최적화(ORM) - 이번에 할 것캐싱serialization - 이번에 할 것2django-debug-toolbar 설치pip install django-debug-toolbarsettings.pyurl"
date: 2021-06-22T06:44:19.062Z
tags: ["django","프로젝트Moya"]
---
# Django 배포 후 속도 느릴 때 무엇을 생각해야되나?
1. 디버그 끄기- 완료!
2. 비싼 인스턴스 쓰기 - 무료밖에 못씀.. 
3. 쿼리 최적화(ORM) - 이번에 할 것
4. 캐싱
5. serialization - 이번에 할 것2





# Django ORM 속도 평가하기

- `django-debug-toolbar` 설치
  - `pip install django-debug-toolbar`
- settings.py

```python
INSTALLED_APPS = [
    # ...
    'django.contrib.staticfiles',
    # ...
    'debug_toolbar',
]

MIDDLEWARE = [
    # ...
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    # ...
]

# 이거 안하면 Django rest Framework의 Response 로 return 하는 구조에서  툴바가 뜨지 않음
DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": lambda request: True,
}


STATIC_URL = '/static/'
```

- urls.py

```python
import debug_toolbar
from django.conf import settings
from django.urls import include, path

urlpatterns = [
    ...
    path('__debug__/', include(debug_toolbar.urls)),
]
```




# Django ORM 사용시 고려사항

1. race condition(경쟁 상태) 피하기
   - 경합 상황이란?
     - 다중 프로그래밍 시스템이나 다중 처리기 시스템에서 두 명령어가 동시에 같은 기억 장소를 액세스 할 때 경쟁에 의해 수행 결과를 예측할 수 없게 되는 경우
   - 해결 방법 - F() 표현법
     - 파이썬으로 메모리를 가져오지 않고, 데이터베이스 내에서 작업을 처리할 때 사용
     - 데이터베이스 수정이 일어나는 부분에는 F를 사용하면 레이스 컨디션 문제를 해결하고, 퍼포먼스 면에서도 이득이 된다.

```python
selected_choice.votes += 1 
#실행시 데이터베이스의 값을 참조 -> 메모리에 로딩 -> 연산 -> 결과값 데이터베이스에 저장

#single instance
select_choice.votes = F("votes") + 1 
#데이터베이스 자체에서 연산 -> 결과값 저장

#querysets of object instances
reporter = Reporters.objects.filter(name='Tintin')  
reporter.update(stories_filed=F('stories_filed') + 1)
```



2. 인덱스 사용

   - 모델의 필드 옵션으로 db_index를 추가하면 해당 필드에 대해서 database index가 생성된다.

     - where 절에 사용할 컬럼에 대한 효율성 상승 기대
       - 단순 컬럼 조회 성능에는 영향이 없음

   - 인덱스의 여러개 사용

     - 인덱스를 많이 사용한다고 검색 속도 향상을 높여준다는 보장은 없음
     - 인덱스는 데이터 베이스 메모리를 사용하여 테이블 형태로 저장되므로 개수와 저장공간은 비례함. 따라서 데이터베이스 용량을 더 방대하게 만들수도 있음

   - 어떤 곳에 사용해야하는가?

     - 카디널리티가 높은 컬럼(중복되는게 있어야 한번에 걸러지기 떄문)
       - 카디널리티 - 특정 컬럼의 유니크한 값의 갯수
       - 유일값의 경우 (레코드의 갯수 = 카디널리티)
       - 예) 성별 - 카디널리티 2 = 남, 녀
     - 선택도가 낮은 컬럼(5~10% 가 적당하다고 함)
       - 선택도 - 특정 필드값을 지정했을 때 선택되는 레코드 수를 테이블 전체 레코드 수로 나눈 것
       - 두 개의 칼럼을 조합해서 인덱스를 걸어주면, 조합된 인덱스키의 카디널리티가 증가하고, 결국 선택도도 증가하여 효율 좋은 인덱스가 될 수 있음(하지만, 인덱스 키를 많이 사용하여 공간 효율은 낮아질 수 있음)
       - 예시 
         - 선택도 1 = unique한 값
     - 활용도가 높은 컬럼
       - 활용도 - 실 작업에서 얼마나 활용되는지에 대한 값(로직과 서비스에서 쿼리를 날리 때 where절에 자주 활용되는지를 판단)

   - 데이터 수정시 성능

     - UPDATE, DELETE  는 WHERE 절에 잘 설정된 인덱스로 조건을 붙여주면 조회할 떄 성능은 크게 저하되지 않음

       (업데이트 할 데이터를 찾을 떄의 속도가 빨라지는 것이지, 업데이트 자체가 빨라지는 것은 아님)

     - INSERT의 경우, 새로운 데이터 추가 > 기존에 인덱스 페이지에 저장되어 있던 탐색 위치가 수정되어야 하므로 효율이 좋지 않음

   

3. Lazy Evaluation(지연 연산)

   - 데이터가 정말로 필요하기 전까지는 장고가 SQL을 호출하지 않기 때문에 ORM 메소드와 함수를 얼마든지 연결해서 코드를 쓸 수 있다.
   - 한줄에 길게 쓰는 대신에 여러줄에 나눠 쓰면 가독성을 향상시키며, 유지 보수를 쉽게 해준다.
   - `list()`을 사용해서 강제로 평가시킬 수도 있다.
     - `bool()`을 쓴다면 결과가 존재하는지 여부를 판단할 수 있다.
   - 하지만, foreign key에 대해서 더 상세한 정보가 필요한 경우, N+1 문제를 일으킬 수 있기 때문에, 이 경우는 eager evaluation 문법을 써야 효율성을 증진시킬 수 있다.



4. 주의해야할 문법

   - QuerySet.count() 사용하기
     - 개수만 원하는 경우에 `len(queryset)` 쓰지말것
     - count()는 DB에서 값을 계산해서 반환하는데, len의 경우 lazy하게 데이터를 받아와서 데이터베이스의 값을 참조 -> 메모리에 로딩 -> 연산 -> 결과값 데이터베이스에 저장을 하느라 느려짐
   - QuerySet.exists() 사용하기
     - 적어도 하나의 결과가 존재하는지 알아내고 싶은 경우에 `if queryset`보다 나음
     - count()와 동일한 이유
   - 외래키 값 직접 사용하기
     - 외래 키 값만 필요하면 관련 객체 전체를 가져오는 대신 이미 가지고있는 객체에 있는 외래 키 값을 사용하기
     - `entry.blod.id` 말고 (foreign key를 참조한 테이블에서 object가져옴)
     - `entry.blod_id` 이렇게 사용(foreign key만 가져옴)