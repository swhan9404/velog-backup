---
title: "javascript 실습 - 변수 선언, 할당, 동적형변환"
description: "하다보니 var가 얼마나 거지같은지 알 수 있었다. let과 const를 사랑하자..변수 호이스팅함수 안에 있는 선언들을 모두 끌어올려서 해당 함수 유효 범위의 최상단에 선언하는 것var 의 경우에는 선언문을 먼저 쭉 읽고, 메모리에 적재시킨다음 undefined로 값"
date: 2021-05-06T14:22:50.785Z
tags: ["JavaScript"]
---
> 하다보니 var가 얼마나 거지같은지 알 수 있었다. 
>
> let과 const를 사랑하자..



# var와 let과 const 비교

## 변수의 선언과 할당 (변수 호이스팅)

- 변수 호이스팅
  - 함수 안에 있는 선언들을 모두 끌어올려서 해당 함수 유효 범위의 최상단에 선언하는 것
  - var 의 경우에는 선언문을 먼저 쭉 읽고, 메모리에 적재시킨다음 undefined로 값을 초기화시켜줌
  - 그 이후 코드가 실행됨
  - var 변수/함수의 선언만 위로 끌어 올려지며, 할당은 끌어 올려지지 않는다.
    - var 키워드로 선언된 변수는 선언 단계와 초기화 단계가 한번에 이루어진다
  - let/const 변수 선언과 함수표현식에서는 호이스팅이 발생하지 않는다.
    - **let 키워드로 선언된 변수는 선언 단계와 초기화 단계가 분리되어 진행된다.** 즉, 스코프에 변수를 등록(선언단계)하지만 초기화 단계는 변수 선언문에 도달했을 때 이루어진다. 초기화 이전에 변수에 접근하려고 하면 참조 에러(ReferenceError)가 발생한다. 이는 변수가 아직 초기화되지 않았기 때문이다. 다시 말하면 변수를 위한 메모리 공간이 아직 확보되지 않았기 때문이다. 따라서 스코프의 시작 지점부터 초기화 시작 지점까지는 변수를 참조할 수 없다. 스코프의 시작 지점부터 초기화 시작 지점까지의 구간을 ‘일시적 사각지대(Temporal Dead Zone; TDZ)’라고 부른다.

```js
console.log(x) // undefined
var x = 1
// var x 선언문
// x =1  할당문

console.log(x) // 초기값에러 - Uncaught Reference Error
let y = 1
```



## let의 선언

- 중복선언불가

```js
let a = 10
console.log(a)
let a = 20 // Identifier 'a' has already been declared 에러 - 변수 선언이 script 맨 먼저 일어나서 아예 위에 console(a) 도 실행안됨.
console.log(a)
```



## const의 선언과 재할당

- 중복선언 불가
- 재할당 불가

```js
const a = 10
console.log(a) // 10
a = 20 // Assignment to constant variable 에러 
console.log(a)
```



## let 의 scope

- block level scope ( 함수,if문,for문,while문,try/catch문 등)

```js
let x = 0
{
    let x = 1
    console.log(x) //1
}
console.log(x) //0

```

## var의 scope

- function level scope(함수 내에서만 유효하며 함수 외부에서는 참조할 수 없다)
- 중복선언 가능

```js
var x = 0
{
    var x = 1
    console.log(x) //1
}
console.log(x) //1
```

```js
var a = 10 // 전역변수

(function () { // 즉시 실행함수 - 함수를 정의하면서 바로 실행함
    var b = 20 // 지역변수
})()

console.log(a) // 10
console.log(b) // 에러
```

```js
var x =1

function foo(){
    var x = 10
    bar()
}

function bar(){
    console.log(x)
}

foo() // 1 
// var x = 10 이 되나 foo 함수가 범위에서 벗어나서 종료됨
// bar 에서는 x 선언이 없기 때문에 전역변수 var x =1 을 찾아 console.log 출력

bar() // 1
// bar 에서는 x 선언이 없기 때문에 전역변수 var x =1 을 찾아 console.log 출력
```



## 클로저

-  **클로저는 반환된 내부함수가 자신이 선언됐을 때의 환경(Lexical environment)인 스코프를 기억하여 자신이 선언됐을 때의 환경(스코프) 밖에서 호출되어도 그 환경(스코프)에 접근할 수 있는 함수**를 말한다. 
  - 이를 조금 더 간단히 말하면 **클로저는 자신이 생성될 때의 환경(Lexical environment)을 기억하는 함수다**
- 클로저에 의해 참조되는 외부함수의 변수 즉 outerFunc 함수의 변수 x를 **자유변수(Free variable)**라고 부른다. 클로저라는 이름은 자유변수에 함수가 닫혀있다(closed)라는 의미로 의역하면 자유변수에 엮여있는 함수라는 뜻

```js
var funcs = [];

// 함수의 배열을 생성하는 for 루프의 i는 전역 변수다.
for (var i = 0; i < 3; i++) {
    funcs.push(function () { console.log(i); });
}

// 배열에서 함수를 꺼내어 호출한다.
for (var j = 0; j < 3; j++) {
    funcs[j](); // 3 - 3번 출력됨
}
```

```js
// 클로저 사용으로 해결
var funcs = [];

// 함수의 배열을 생성하는 for 루프의 i는 전역 변수다.
for (var i = 0; i < 3; i++) {
  (function (index) { // index는 자유변수다.
    funcs.push(function () { console.log(index); });
  }(i));
}

// 배열에서 함수를 꺼내어 호출한다
for (var j = 0; j < 3; j++) {
  funcs[j](); // 1,2,3
}
```

```js
// 위와 동일 코드를 let으로 바꿨을 때
var funcs = [];

// 함수의 배열을 생성하는 for 루프의 i는 for 루프의 코드 블록에서만 유효한 지역 변수이면서 자유 변수이다.
for (let i = 0; i < 3; i++) {
    funcs.push(function () { console.log(i); });
}

// 배열에서 함수를 꺼내어 호출한다.
for (var j = 0; j < 3; j++) {
    funcs[j](); // 1,2,3 
}
```





# 동적형변환

## 문자열앞에 +

```js
console.log(typeof +'10') // number (문자열 -> 숫자 : 암묵적 형변환)
console.log('10'+ 1) // 101
console.log(typeof 10 + '') // String (숫자 -> 문자 : 암묵적 형변환)

// +'문자열' 응용
console.log(+'10' + 1) // 11
```

