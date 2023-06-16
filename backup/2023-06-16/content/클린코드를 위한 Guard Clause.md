---
title: "클린코드를 위한 Guard Clause"
description: "중첩 조건문을  Guard Clause 로 가독성을 높여보자if/else 문이 복잡하고 중첩될 수록 부담이 늘어 가독성을 해친다.즉, 현재 조건의 state 를 파악하기 위해 아래 위로 움직이면서 조건을 파악을 해야한다.code depth 가 깊어진다.Guard Cla"
date: 2022-03-03T23:47:09.941Z
tags: ["좋은 코드쓰기"]
---
중첩 조건문을  Guard Clause 로 가독성을 높여보자

# Guard Clause란 무엇인가?

## if/else 문의 단점
- if/else 문이 복잡하고 중첩될 수록 부담이 늘어 가독성을 해친다.
  - 즉, 현재 조건의 state 를 파악하기 위해 아래 위로 움직이면서 조건을 파악을 해야한다.
  - code depth 가 깊어진다.
Guard Clause 로 코드 평탄화 작업을 시켜 코드의 가독성을 향상시킬 수 있다.

## Guard 란?
> “In computer programming, a guard is a boolean expression that must evaluate to true if the program execution is to continue in the branch in question. Regardless of which programming language is used, guard code or a guard clause is a check of integrity preconditions used to avoid errors during execution.” — Wikipedia

- wiki 전문
  - 프로그래밍에서 실행이 분기에서 계속되어야하는 경우 True 로 평가되어야하는 부울의 표현식
  - 어떤 프로그래밍 언어를 사용하든 가드 코드 또는 가드 절은 실행 중 오류를 피라기 위해 사용되는 무결성 전제 조건을 확인하는 것

### Guard Concept 적용하기
- 기존코드
```python
if Guard {
    ...
}
```

- Guard Concept 적용
  - Guard 조건을 not으로 변경하고 조기에 return 시킴(return early)
  - 기존의 guard 조건을 가진 분기의 코드 블락을 아래와 같이 not guard 이후 작성 
```python
if not Guard {
    return ...
}

...
```


## 중첩 조건문에 적용해 보기
- token 을 인증하는 가상의 코드가 있다고 할 때,
  - user 가 존재하는 지 확인하고
    - 해당 token을 가져와 존재하는지 확인한 후 
      - token purpose가 reset 인지 확인해서 이 경우 True를 반환

### concept 적용전
```python
async def verify_token(email: str, token: str, purpose: str):
    user = await user_service.get_user_by_email(email)

    if user:
        token = await user_service.get_token(user)

        if token :
            if token.purpose == 'reset':
                return True
    return False

```


### concept 적용후
- 변화된 사항
  - 중첩조건문이 사라지고, depth가 얕아짐
  - 복잡한 조건문을 가독성 높은 코드로 풀어낼 수 있음
```python
async def verify_token(email: str, token: str, purpose: str):
    user = await user_service.get_user_by_email(email)

    if not user:
        return False
    
    token = await user_service.get_token(user)

    if not token or token.purpose != 'reset':
        return False
    
    return True
```
