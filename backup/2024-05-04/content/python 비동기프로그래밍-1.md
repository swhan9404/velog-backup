---
title: "python 비동기프로그래밍-1"
description: "python 비동기 프로그래밍에 대해 공부하다가 너무 좋은 자료를 찾았는데, 이걸 다시 정제하는 것보다 이것을 가지고 내가 이해한 바를 덧붙이는 정도로 하는 것이 더 좋을 것 같아 필기를 올린다.원본https&#x3A;//blog.humminglab.io/python-"
date: 2021-04-17T14:41:11.032Z
tags: ["python"]
---
- python 비동기 프로그래밍에 대해 공부하다가 너무 좋은 자료를 찾았는데, 이걸 다시 정제하는 것보다 이것을 가지고 내가 이해한 바를 덧붙이는 정도로 하는 것이 더 좋을 것 같아 필기를 올린다.
- 원본
  - https://blog.humminglab.io/python-coroutine-programming-1/

## 간단요약

- Iterator
  - `__iter__()` : iterator object 리턴
  - `__next__()` : 호출될 때 마다 다음 값을 리턴
- generator
  - `yield` : generator 함수를 멈추고, 값을 next(x)를 호출한 함수로 전달
  - `next()` : generator의 yield를 만날 떄까지 실행시키고 값을 반환받음
- yield 기반 coroutine ( 사실 generator와 동일 )
  - `yield` : coroutine 함수를 멈추고, 값을 next(x)를 호출한 함수로 전달
  - `next()` : coroutine 의 yield를 만날 떄까지 실행시키고 값을 반환받음
  - `send(y)` : caller가 coroutine 의 yield 부분에 y값을 전달할 수 있음 + next와 동일작동
  - `throw(type, value, traceback)` :  caller가 coroutine 의 yield 부분에 exception 전달
  - `close()` : thorw를 이용하여 GeneratorExit exception을 coroutine에게 전달
  - `yield from` : caller에 sub-coroutine 값을 주고 받게함
  - return : coroutine의 순환이 끝났어도 StopIteration exception을 내지 않고, 정해진 반환값을 전달해주는 역할을 해줌



# Iterator 책갈피

undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-01.jpg)
undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-02.jpg)
undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-03.jpg)

# Generator 책갈피

undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-04.jpg)
undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-05.jpg)
undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-06.jpg)
undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-07.jpg)

# yield 기반 coroutine 책갈피

undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-08.jpg)
undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-09.jpg)
undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-10.jpg)
undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-11.jpg)
undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-12.jpg)
undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-13.jpg)
undefined%20-%20Asyncio,%20Coroutine%20-%20HummingLab%20Blog-14.jpg)

