---
title: "javascript에서 두 변수를 swap하는 법"
description: "중간 저장 매체인 temp 변수를 만들어 사용XOR swap algorithm으로 불리는 방법이다. 하지만 Integer일 때만 사용할 수 있는 방법이다. 숫자로 된 문자열이나 실수는 정수로 변환된다.number 타입의 값을 바꿀 때 사용할 수 있는 방법이다. 문자열은"
date: 2021-05-13T00:20:34.134Z
tags: ["JavaScript"]
---
## temp 변수를 이용한 방법

- 중간 저장 매체인 temp 변수를 만들어 사용

```js
let
  a = 'a',
  b = 'b',
  temp;

temp = a;
a = b;
b = temp;
console.log('a: ' + a + ', b: ' + b); // 'a: "b", b: "a"'
```



## XOR 방법

- [XOR swap algorithm](https://en.wikipedia.org/wiki/XOR_swap_algorithm)으로 불리는 방법이다. 

- 하지만 `Integer`일 때만 사용할 수 있는 방법이다. 
  - 숫자로 된 문자열이나 실수는 정수로 변환된다.

```js
let
  a = 10, // or '10', 10.11
  b = 100; // or '10', 100.111

a = a ^ b;
b = a ^ b;
a = a ^ b;
console.log('a: ' + a + ', b: ' + b); // 'a: 100, b: 10'
```



## 덧셈/뺄셈 연산자를 이용한 방법

- `number` 타입의 값을 바꿀 때 사용할 수 있는 방법이다. 문
- 자열은 문자열의 `+` 동작으로 인해 swap되지 않는다. 
- 연산 과정에서 [JavaScript 내부동작의 영향으로 소수부에 변화가 발생할 가능성](https://stackoverflow.com/questions/588004/is-floating-point-math-broken)이 있다.

```js
let
  a = 10, // or 10.11
  b = 100; // or 100.111

a = a + b;
b = a - b;
a = a - b;
console.log('a: ' + a + ', b: ' + b); // 'a: 100, b: 10'
```



## 배열을 이용한 swap

- 한 줄로 작성 가능한 방법이다.
  - 하지만 읽기 어렵고 가독성이 떨어진다
- 원리는 배열을 생성할 때 `a`의 값이 복사가 되고 `a = b` 연산 실행 
  - 그리고 배열의 `0번째 값`인 `a`를 `b`에 할당한다. 재밌는 방법이다.

```js
let
  a = 5,
  b = 'abc';

b = [a, a = b][0];
console.log('a: ' + a + ', b: ' + b); // 'a: "abc", b: 5'
```



## 구조 분해 할당을 이용한 방법

- ES6에 추가된 [구조 분해 할당(Destructuring_assignment)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)을 이용해 swap하는 방법이다. 
  - 익스플로러에선 지원하지 않지만 많은 사람들이 추천하고 있다!
- 개인적으로 가장 깔끔하게 사용하고 가독성도 높다.

```js
let
  a = 5,
  b = 'abc';

[a, b] = [b, a]
console.log('a: ' + a + ', b: ' + b); // 'a: "abc", b: 5'
```