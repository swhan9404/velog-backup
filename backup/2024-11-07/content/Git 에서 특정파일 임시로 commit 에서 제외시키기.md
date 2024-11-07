---
title: "Git 에서 특정파일 임시로 commit 에서 제외시키기"
description: "commit 을 이쁘게 단위별로 구조화 하면서, 이 파일은 현재 commit 에서 임시로 제외시키고 싶다라는 생각이 들었다.영원히 파일의 추적을 안할 것이 아니기 때문에 gitignore 에 넣기도 뭐한 상황이다.이것을 해결하기 위한 여러 방법을 찾았다.git stat"
date: 2021-10-06T09:35:32.561Z
tags: ["git"]
---
commit 을 이쁘게 단위별로 구조화 하면서, 이 파일은 현재 commit 에서 임시로 제외시키고 싶다라는 생각이 들었다.


영원히 파일의 추적을 안할 것이 아니기 때문에 gitignore 에 넣기도 뭐한 상황이다.

이것을 해결하기 위한 여러 방법을 찾았다.

# 1. git add 지정파일
1. `git status` 로 변경사항이 있는 파일목록을 본다
2. `git add 파일이름1 파일이름2`으로 commit 에 적용할 파일만 지정해서 commit 한다

# 2. git add -p 사용하기
git add -p 를 하면 변경사항을 확인하면서 스테이징 작업을 할 수 있다.

`git add -p` 를 사용하면 modified 된 파일의 수정 부분을 단위별로 나누어서 추가할지 말지 물어본다. 여기서 보이는 변경사항의 하나의 단위를 hunk라고 부른다. 이 hunk 단위로 추가할지 말지를 정할 수 있다.


```shell
y - (중요)stage this hunk 
n - (중요)do not stage this hunk
q - (중요)quit; do not stage this hunk or any of the remaining ones
a - stage this hunk and all later hunks in the file
d - do not stage this hunk or any of the later hunks in the file
g - select a hunk to go to
/ - search for a hunk matching the given regex
j - leave this hunk undecided, see next undecided hunk
J - leave this hunk undecided, see next hunk
k - leave this hunk undecided, see previous undecided hunk
K - leave this hunk undecided, see previous hunk
s - split the current hunk into smaller hunks
e - (중요)manually edit the current hunk
? - (중요)print help
```


## git commit -v
`git commit -p` 와 마찬가지로 커밋하는 변경사항을 다시 한번 확인하고 commit을 할 수 있다.

`git commit -v` 를 하면 커밋메시지를 입력하는 화면 아래에 코드 diff 가 한 번 더 나오게 되고, 마치 `git diff --staged` 와 같은 효과를 얻을 수 있다.


# 3. 파일 안바뀐것으로 처리하기

1. git add 하기전에 update-index --assume-unchanged 하기
이 명령어를 실행하면 git이 해당파일을 변경하지 않은 것으로 인식하게 됨
`git update-index --assume-unchanged 파일이름`

2. git add, git commit 하기

3. 해제하기
`git update-index --no-assume-unchanged 파일명`
이렇게 해야 다시 git status 변경파일 목록에 해당 파일이 나오게 됨.

(추가사항)
임시로 사용할 떄는 좋지만 현재 unchanged로 지정된 파일의 목록을 잊을 수 있으므로 혼란을 초래할 수 있음.

- unchanged 로 지정된 파일 목록 확인하기
`git ls-files -v | grep ^h`

- unchanged 로 지정된 목록들무시하고 워킹트리에 대한 인덱스 새로 갱신시키기
`git update-index --really-refresh`
