---
title: "github personal access token 사용하기"
description: "token의 유통기한과 권한 설정은 알아서만들어진 토큰의 값은 만들어질 때 밖에  보지 못하기 때문에 저장을 어딘가 해두어야함.이렇게 만들어진 토큰으로 Git 작업을 위해 계정 아이디/비밀번호를 입력하여 연결할 때 비밀번호 대신 Personal access token "
date: 2021-08-14T22:51:07.933Z
tags: ["git"]
---
## 1. profile의 setting 들어가기


![](../images/62bb9c77-6230-4061-9e74-15d0877ad4a3-image-20210815073605138.png)


## 2. Developer settings > personal access token

![](../images/35ae6e19-7209-4186-899a-6697cf47f2ba-image-20210815073700810.png)

## 3. token 만들기

- token의 유통기한과 권한 설정은 알아서

![](../images/df68ea64-dc23-43ad-895e-c93c66fe2e2f-image-20210815074505721.png)





## 4. token 값 저장하기

- 만들어진 토큰의 값은 만들어질 때 밖에  보지 못하기 때문에 저장을 어딘가 해두어야함.
- 이렇게 만들어진 토큰으로 Git 작업을 위해 계정 아이디/비밀번호를 입력하여 연결할 때 비밀번호 대신 Personal access token 값을 입력하면 연결이 가능함.



## 5. 자격 증명 관리자

- window의 자격 증명 관리자 > Windows 자격증명 > `https://api.github.com/아이디` 로 되어있는 것을 삭제
- 그럼 cmd에서 github를 다시 다룰 때 다시 로그인 창이 뜰땐데 그걸로 계정값을 다시 등록하면됨



- 주의할 점
  - personal access Token 은 http가 아닌 https 로만 접근이 가능함