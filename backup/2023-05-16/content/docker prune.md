---
title: "docker prune"
description: "사용 이유docker object 들이 오랜 사용으로 시스템에 사용되게 되면 컨테이너와 이미지가 수십 수백개가 되는데, Docker 컨테이너, 이미지, 볼륨은 사용중이 아니더라도 디스크를 많이 차지하고, 네트워크도 많이 만들어지면 관리가 어려워진다.기능 : 사용하지 않"
date: 2021-12-10T00:05:05.410Z
tags: ["docker"]
---
# prune 란?
- 사용 이유
  - docker object 들이 오랜 사용으로 시스템에 사용되게 되면 컨테이너와 이미지가 수십 수백개가 되는데, Docker 컨테이너, 이미지, 볼륨은 사용중이 아니더라도 디스크를 많이 차지하고, 네트워크도 많이 만들어지면 관리가 어려워진다.

## docker container prune
- 기능 : 사용하지 않는 컨테이너 일괄 삭제
- 목적 
  - docker는 컨테이너가 중지되더라도 이를 바로 삭제하지 않음.
  - 중지된 컨테이너는 cpu나 메모리 같은 자원을 사용하지는 않지만, 모든 docker 컨테이너는 고유한 디스크 영역 (레이어)을 가지고 있기 떄문에 컨테이너를 삭제하면 디스크 용량을 확보할 수 있음
- 주의해야할 점
  - 중지된 컨테이너에 기록된 내용도 모두 삭제되기 때문에 주의해야함


### 원래 역할 명령어 (docker container rm)
- 주의사항
  - 실행중인 컨테이너에 rm을 사용하게 되면, 에러가 뜨니 `docker stop 컨테이너이름` 을 하여서 컨테이너를 중지한 상태로 사용해야한다. 
```shell
# 컨테이너 ID 값으로 삭제
docker rm 컨테이너ID

# 컨테이너 이름으로 삭제
docker rm 컨테이너이름

# 만약 실행중인 컨테이너를 강제로 삭제하고 싶다면
docker rm -f 컨테이너이름

# 여러개 컨테이너를 한번에 지우기
docker rm -f 컨테이너이름1 컨테이너이름2 컨테이너이름3

# 모든 컨테이너를 다 삭제하고 싶을 경우
docker rm -f $(docker ps -aq)

# docker container rm 도 rm과 동일하게 작동함
docker conainer rm 컨테이너ID
```


### prune 필터링
- filter 옵션을 통해서 삭제되는 컨테이너를 필터링 가능하다.
- 지원되는 필터링 키
  - label
  - until

```shell
# 중지된 지 1시간 이상 지난 이미지만 삭제
$ docker container prune --filter until=1h

# env 키가 있는 이미지
$ docker container prune --filter label=env

# env 키가 없는 이미지
$ docker container prune --filter label!=env

# env 키의 값이 development인 이미지
$ docker container prune --filter label=env=development

# env 키의 값이 production이 아닌 이미지
$ docker container prune --filter label!=env=production
```

## docker image prune
- 기능
  - dangling 된 이미지들 삭제
  - 이미지는 원래 구분을 위한 이름을 가지고 있으나, 같은 이름으로 도커 이미지를 여러번 빌드하다보면 새로 마들어진 이미지가 기존 이미지의 이름을 뺏어버려 기존 이미지는 dangling 됨 ( 이를 방지하기 위해 빌드 때마다 고유한 태그를 붙여 이미지들을 구분하는 것이 필요함 )
- 목적
  - docker image 가 디스크를 사용하고 있을 떄 사용하면 한 번에 큰 용량을 확보하기 용이함 ( 이미지는 컨테이너와 달리 용량만 차지하고, CPU나 메모리를 차지하는 것은 아니다 )
- 주의할 점
  - 지운 이미지는 복구가 불가능함

```shell
# dangling 된 이미지들 삭제
docker image prune

# 현재 컨테이너에서 사용하고 있지 않은 이미지들 전부 삭제
docker image prune -a
```

### 원래 역할 명령어 ( docker rmi )

```shell
docker rmi 이미지이름:태그
# Untagged : 이미지이름:태그
# Untagged : 이미지이름:Digest태그
# 이미지를 구성하는 다층의 레이어 삭제 ...

# 더 명시적으로 image 삭제하기
docker image rm 이미지이름:태그

```

- 참고사항
  - 도커 이미지 리스트 확인
    - `docker images -a`
  - 특정 이미지를 사용하는 컨테이너 전부 확인하기
    - `docker ps -a --filter ancestor=이미지:태그`
  - 특정 이미지를 사용하는 컨테이너를 전부 삭제하고, 이미지 삭제하기
    - `docker rm -f $(docker ps -aq --filter ancestor=이미지:태그)`
  - 

## docker volume prune
- 기능
  - 컨테이너와 연결되어 있지 않은 모든 볼륨 오브젝트를 삭제해줌
- 목적
  - 볼륨은 일반적으로 데이터 저장을 위해서 사용하기 때문에 용량을 확보하는데 도움이 됨

## docker network prune
- 기능
  - 컨테이너와 연결되어 있지 않은 모든 네트워크 오브젝트를 삭제해줌
- 목적
  - 시스템 자원이나 디스크를 사용하는 것은 아니지만, 네트워크가 많아지면 관리가 힘들어짐

## docker system prune
- 기능
  - 위에 있는 모든 prune 를 한번에 실행함
    - container
    - network
    - volume
    - dangling image
    - build cache

```shell
# image purne 와 비슷하게 -a 옵션을 통해서 컨테이너에서 사용하지 않는 이미지를 삭제해줄 수 있음
docker system prune -a
```
