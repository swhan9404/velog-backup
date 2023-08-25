---
title: "git switch, restore"
description: "언제 분리되었는가?2019년 8월 16일원래 checkout 의 기능의 분리switch : 브랜치 변경restore : 변경사항 복원사용해 본 내 소감checkout 을 사용하여 변경사항을 복원할 때 불명확한 것들이 있었는데 restore를 통해 분리됨에 따라 좀더 명"
date: 2021-12-11T01:06:42.451Z
tags: ["git"]
---
# Git switch 와 restore

- 언제 분리되었는가?
    - 2019년 8월 16일
- 원래 checkout 의 기능의 분리
  - switch : 브랜치 변경
  - restore : 변경사항 복원
- 사용해 본 내 소감
  - checkout 을 사용하여 변경사항을 복원할 때 불명확한 것들이 있었는데 restore를 통해 분리됨에 따라 좀더 명확해진 것 같다.


## git switch
> switch는 checkout를 변경하는 부분만 담당

```shell
# branch 변경
git switch develop

# 없는 branch 만들면서 변경
git switch -c test

# 특정 커밋으로 새로운 브랜치 만들기
git switch -c new-branch 515c64

```

## git restore
> 워킹 트리의 파일을 복원해주는 역할

```shell
# 작업중인 파일 중 기존 마지막 커밋의 상태로 되돌리고자 할 때
# 원래 
# git checkout -- README.md
git restore README.md


# git add 을 통해서 수정 내용을 이미 stage에 이미 넣었을 때 빼기
# 원래
# git reset HEAD README.md
git restore --staged README.md
```