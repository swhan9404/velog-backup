---
title: "Java 애플리케이션의 트러블 슈팅 사례"
description: "원 내용 : https&#x3A;//www.slideshare.net/deview/d2-java-pinpoint지금 Python 개발을 하고 있지만, 트러블을 어떻게 추적하고 고치는 지에 대해 인사이트를 얻어 읽고 정리하게 되었다.확인해야하는 사항현상의 일관성재현 조건"
date: 2022-03-15T12:46:46.981Z
tags: ["좋은글읽기"]
---
원 내용 : https://www.slideshare.net/deview/d2-java-pinpoint

지금 Python 개발을 하고 있지만, 트러블을 어떻게 추적하고 고치는 지에 대해 인사이트를 얻어 읽고 정리하게 되었다.

# 트러블 슈팅의 단계
- 확인해야하는 사항
1. 현상의 일관성
   - 재현 조건
   - 사용자에게 항상/간헐적으로 나는지
   - 일부/전체 서버에서 발생하는지?
     - 전체 서버일 경우 : 공통 자원과 설정 부분을
     - 일부 서버일 경우 : Thread의 안정성 문제를 의심


## A. 사용자 현상 파악
- 503/ 500 에러
- 무응답, 느린 응답
- 예상과는 다른 어플동작(간헐적 인증 실패)

## B. 서버 상태 파악
- 어플리케이션 서버
  - 메모리 사용률(swap 사용여부)
  - CPU 사용률
  - Disk 용량, I/O
- 연계 서버 상태(DB 등)

## C. 어플리케이션 정보 파악
- 어플리케이션 로그
  - OOM(메모리 부족)등 전형적인 Fatal여러 발생 여부
- WAS의 주요설정
- 소스
- 스택 덤프
- GC 로그
- 힙 덤프
- 실행 경로 프로파일링


# 어려운 트러운 슈팅의 공통점
- 개발 환경에서는 괜찮았어요
- 운영 환경에 평소에는 괜찮았어요
  - 불규칙적으로 발생해요
  - 부하가 몰리면 이상해져요

# 문제 상황 해결을 도와주는 옵션들

## GC Log
- Java6 Update 24, Java7 Update 2 부터 gc log rotate 지원

```text
- verbose:gc
- XX:+PrintGCDetails -XX:+PrintGCTimeStamps
- Xloggc:../logs/gc-was1.log
- XX:+UseGCLogFileRotation
- XX:NumberOfGClogFiles=5
- XX:GCLogFileSize=256M
```


## 덤프
- OOM 시 힙덤프의 옵션의 예
```text
- XX:+HeapDumpOnOutOfMemoryError
- XX:HeapDumpPath=../logs/heap-was1.log
```

- gcore 덤프
```text
- XX: OnError="gcore%p"
```

- sar로 시스템 상황 남기기
```text
- XX:OnOutOfMemoryError="/usr/bin/sar -A > ../logs/sar.log"
- XX:OnError="/usr/bin/sar -A > ../logs/sar.log"
```

# 자주 만나는 해결방식

## 해결방법1) 인프라요소 변경
- 어플리케이션의 로직과는 상관없이 공통적인 설정을 변경해서 해결하는 경우
- 현상의 사례
  - A. 사용자가 몰릴 시 간헐적 느린응답, 500, 503 에러
  - B. Swapping 영역 사용
  - C. 잦은 GC, OOM, Connection pool의 getConnection()에서 대기


- 주로 건드리는 핵심 설정
  - Connection Pool
    - DBCP : maxActive(maxTotal), maxWait(maxWaitMills), validation query
  - JDBC : Socket timeout 등
  - Web Server 
    - Apache Httpd : maxClients
  - Web Application Server
    - Tomcat : maxThreads, AJP connector의 backlog 값
  - JVM : GC option

- 적절한 값을 설정하는데 도움이 되는 자료
  - Apache MaxClient와 Tomcat의 Full GC: https://d2.naver.com/helloworld/132178
  - JDBC 타임아웃 이해 : https://d2.naver.com/helloworld/1321
  - Garbage Collection 튜닝 : https://d2.naver.com/helloworld/37111


## 해결방법2) 메모리릭 경로 제거
- 현상의 사례
  - C. 서버에 올린지 오래되면 잦은 GC, OOM

- 주로 Cache 로직에서 발생됨
  - 해당서비스팀에서 직접 만든 캐쉬 로직이 있는가?
  - 캐쉬 용량의 한도값이 적절한가?
  - 모든 서버에 같은 현상이 궁극적으로 생김
- Thread 불안정성에서 생긴 메모리Leak
  - 일부 서버에서만 OOM 발생

## 해결방법3) 무한루프 제거
- 현상의 사례
  - B. 100% 가까운 CPU 사용. 특정 서버에서만 발생하는 경우가 많음.
  - C. 스택 덤프를 뒤져보면 계속 실행중인 스레드가 있음. 모든 CPU가 100% 가 걸리면 덤프조차 못 뜰수 있음
- 특정 조건이 들어왔을 떄 혹은 Thread 불안정성 떄문에 생기는 무한루프가 많음.
  - 무조건 무한루프였으면 개발할 때 모를리가 없음
- 잘못된 정규식에서 발생한 사례도 있었음