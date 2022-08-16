---
title: "Django ORM 더 공부하기"
description: "OR 연산으로 여러 조건 중 하나라도 만족하는 행을 구해야 하는 경우가 많습니다. 이름이 ‘R’로 시작하거나 성이 ‘D’로 시작하는 모든 사용자를 구한다고 해 봅시다.본래의 SQL문밑에 제시되는 두 가지 문법은 생성되는 SQL 질의문이 완전히 동일하기 때문에 취향에 따"
date: 2021-06-22T00:45:11.614Z
tags: ["django"]
---
# Django ORM 에서 OR 연산

> `OR` 연산으로 여러 조건 중 하나라도 만족하는 행을 구해야 하는 경우가 많습니다. 
>
> 이름이 ‘R’로 시작하거나 성이 ‘D’로 시작하는 모든 사용자를 구한다고 해 봅시다.

- 본래의 SQL문

```sql
SELECT username, first_name, last_name, email 
FROM auth_user 
WHERE first_name LIKE 'R%' OR last_name LIKE 'D%';

```

- 밑에 제시되는 두 가지 문법은 생성되는 SQL 질의문이 완전히 동일하기 때문에 취향에 따라 쓰면 됨
  - SQL 질의문 확인법
    - `str(쿼리셋.query)`



## 쿼리셋1 | 쿼리셋2

- 두개의 filter로 나눠져 있는거 확인

```python
queryset = User.objects.filter(
        first_name__startswith='R'
    ) | User.objects.filter(
    last_name__startswith='D'
)
```



## Q 객체 이용

- 장고 ORM 으로 where 절에 or 문을 추가하고 싶을 떄 사용
  - Q는 복잡한 질의를 수행할 수 있도록 도와주는 역할

```python
from django.db.models import Q
qs = User.objects.filter(Q(first_name__startswith='R')|Q(last_name__startswith='D'))
```



# Django ORM 에서 AND 연산

> `AND` 연산으로 여러 조건을 모두 만족하는 행을 구해야 하는 경우가 많습니다. 
>
> 이름이 ‘R’로 시작하고 성이 ‘D’로 시작하는 모든 사용자를 구한다고 해 봅시다.

- 본래의 SQL문

```sql
SELECT username, first_name, last_name, email 
FROM auth_user 
WHERE first_name LIKE 'R%' AND last_name LIKE 'D%';
```



- 밑에 제시되는 두 가지 문법은 생성되는 SQL 질의문이 완전히 동일하기 때문에 취향에 따라 쓰면 됨
  - SQL 질의문 확인법
    - `str(쿼리셋.query)`



## filter(조건1, 조건2, ...)

- filter 메서드에서 여러 조건을 결합하는 방식 = 기본적으로 AND 방식

```sql
queryset_1 = User.objects.filter(
    first_name__startswith='R',
    last_name__startswith='D'
)
```



## 쿼리셋1 | 쿼리셋2

- & 연산자를 통한 쿼리셋 명시적 결합

```python
queryset_2 = User.objects.filter(
    first_name__startswith='R'
) & User.objects.filter(
    last_name__startswith='D'
)
```



## filter(Q(조건1) & Q(조건2) )

```python
queryset_3 = User.objects.filter(
    Q(first_name__startswith='R') &
    Q(last_name__startswith='D')
)
```

