---
title: "프로젝트 더 공부하기 - ORM : order_by, 필요열조회"
description: "이름이 R로 시작하는 모든 사용자의 이름(first_name)과 성(last_name)을 구해보자필드가 전부 다 필요하지 않을 경우, 필요한 열만 데이터베이스에서 읽어오기데이터베이스의 부하를 어느정도 감소시켜줄 수 있다.이건 두가지 방법이 id필드를 가져오느냐 안가져오"
date: 2021-06-22T00:39:55.929Z
tags: ["django","프로젝트Moya"]
---
# 필요 열만 조회하기

> 이름이 R로 시작하는 모든 사용자의 이름(`first_name`)과 성(`last_name`)을 구해보자

- 필드가 전부 다 필요하지 않을 경우, 필요한 열만 데이터베이스에서 읽어오기
- 데이터베이스의 부하를 어느정도 감소시켜줄 수 있다.
- 이건 두가지 방법이 id필드를 가져오느냐 안가져오느냐가 다르다.



- 본래의 sql문

```sql
SELECT "auth_user"."first_name", "auth_user"."last_name"
FROM "auth_user" 
WHERE "auth_user"."first_name"::text LIKE R%
```



## 쿼리셋의 values와 value_list메서드

- values 는 key_value쌍(딕셔너리 형태)의 리스트를 얻을 수 있고
- values_list는 tuples 형의 리스트를 얻을 수 있다.

```python
queryset = User.objects.filter(
    first_name__startswith='R'
).values('first_name', 'last_name')

# <QuerySet [{'first_name': 'Ricky', 'last_name': 'Dayal'}, {'first_name': 'Ritesh', 'last_name': 'Deshmukh'}, {'first_name': 'Radha', 'last_name': 'George'}, {'first_name': 'Raghu', 'last_name': 'Khan'}, {'first_name': 'Rishabh', 'last_name': 'Deol'}]

queryset = User.objects.filter(
    first_name__startswith='R'
).values_list('first_name', 'last_name')

# <QuerySet [('Ricky', 'Dayal'), ('Ritesh', 'Deshmukh'), ('Radha', 'George'), ('Raghu', 'Khan'), ('Rishabh', 'Deol') 
```

- sql문 출력

```sql문
SELECT "auth_user"."first_name", "auth_user"."last_name"
FROM "auth_user" 
WHERE "auth_user"."first_name"::text LIKE R%
```



## only 메서드

```python
queryset = User.objects.filter(
    first_name__startswith='R'
).only("first_name", "last_name")
```



- sql문 출력

```sql
SELECT "auth_user"."id", "auth_user"."first_name", "auth_user"."last_name"
FROM "auth_user" WHERE "auth_user"."first_name"::text LIKE R%
```



### only 반대 - defer

- 특정 필드를 제외하고 결과를 반환받기 
  - only가 특정필드들만 가져온다면 이거는 반대로 특정필드만 제외하고 가져옴

```python
queryset = User.objects.filter(
    first_name__startswith='R'
).defer("first_name", "last_name")
```





# 정렬하기

- `order_by()`가 여러번 사용되었다면, 맨 마지막꺼만 유효함



## 무작위 정렬

- `?` 를 지정하면 됨
- 하지만, 굉장히 비싸고 느릴 수 있음

```python
Entry.objects.order_by('?')
```



## 다른 모델의 필드를 기준으로 정렬하기

- 다른 모델과의 관계인 필드를 기준으로 정렬할 때는
  - 이중 언더바(`__`)를 사용
- 지정해주지 않는다면 모델의 기본키를 기준으로 함

```python
# 순서가 지정되지 않은 경우
Entry.objects.order_by('blog')

# 위 코드는 아래와 같아
Entry.objects.order_by('blog__id')

# name 순으로 정렬할 경우
Entry.objects.order_by('blog__name')

# asc()나 desc()를 사용해 순서를 지정할 수 있다.
Entry.objects.order_by(Coalesce('summary', 'headline').desc())

# asc(), desc()는 null 값이 정렬되는 방법을 제어하는 인수(nulls_first, nulls_last)를 가지고 있다.
```



