---
title: "javascript 함수와 호이스팅"
description: "함수는 여러 개의 인자를 받아서, 그 결과를 출력한다.파라미터의 개수와 인자의 개수가 일치하지 않아도 오류가 발생하지 않는다.만약, 파라미터 1개가 정의된 함수를 부를 때, 인자의 개수를 0개만 넣어 실행하면 이미 정의된 파라미터(매개변수)는 undefined이라는 값"
date: 2021-05-06T16:48:23.492Z
tags: ["JavaScript"]
---
# 함수

- 함수는 여러 개의 인자를 받아서, 그 결과를 출력한다.
- 파라미터의 개수와 인자의 개수가 일치하지 않아도 오류가 발생하지 않는다.
  - 만약, 파라미터 1개가 정의된 함수를 부를 때, 인자의 개수를 0개만 넣어 실행하면 이미 정의된 파라미터(매개변수)는 undefined이라는 값을 갖게 된다.
  - 이는 변수는 초기화됐지만, 값이 할당되지 않았기 때문이다.
- 자바스크립트에서는 함수도 객체이다.
  - 따라서 다른 객체와 마찬가지로 넘기거나 할당할 수 있다.
  - 함수를 객체 프로퍼티에 할당할 수도 있다.
- 자바스크립트 함수는 반드시 return값이 존재하며, 없을 때는 기본 반환값인 ‘undefined’가 반환된다.



## arguments 객체

- 함수 호출 시에 넘겨진 실제 인자값을 가지는 객체
- 함수가 실행되면 그 안에는 arguments라는 특별한 지역변수가 자동으로 생성된다.
  - arguments의 타입은 객체이다.
- 자바스크립트 함수는 선언한 파라미터보다 더 많은 인자를 보낼 수도 있다.
  - 이때 넘어온 인자를 arguments로 하나씩 접근할 수 있다.
  - arguments는 배열의 형태(array-like)를 가지고 있다.
- arguments는 배열 타입(array)은 아니다.
  - 따라서 배열의 메서드를 사용할 수 없다
- 자바스크립트의 가변인자를 받아서 처리하는 함수를 만드는 상황에서 arguments 속성을 유용하게 사용할 수 있다.(메서드에 넘겨 받을 인자의 개수를 모를 때)

```js
function a() {
    console.log(arguments);
}
a(1, 2, 3); // { '0':1, '1':2, '2':3 }
```



# 함수선언문과 함수표현식

## 함수선언문

```js
function printName(firstname) {
  var myname = "SW";
  return myname + " " +  firstname;
}
```



## 함수표현식

- 변수값에 함수 표현을 담아 놓은 형태
  - 유연한 자바스크립트 언어의 특징을 활용한 선언 방식
- 함수표현식은 익명 함수표현식과 기명 함수표현식으로 나눌 수 있다.
  - 일반적으로 함수표현식이라고 부르면 앞에 익명이 생략된 형태라고 볼 수 있다.
  - 익명 함수표현식: 함수에 식별자가 주어지지 않는다.
  - 기명 함수표현식: 함수의 식별자가 존재한다.
- 함수표현식의 장점
  - 클로져로 사용
  - 콜백으로 사용(다른 함수의 인자로 넘길 수 있음)

```js
var test1 = function() { // (익명) 함수표현식
  return '익명 함수표현식';
}

var test2 = function test2() { // 기명 함수표현식 
  return '기명 함수표현식';
}
```



## 함수선언문과 함수표현식의 차이

- 함수선언문은 호이스팅에 영향을 받지만, 함수표현식은 호이스팅에 영향을 받지 않는다.
  - 함수선언문은 코드를 구현한 위치와 관계없이 자바스크립트의 특징인 호이스팅에 따라 브라우저가 자바스크립트를 해석할 때 맨 위로 끌어 올려진다.
  - 함수표현식은 함수선언문과 달리 선언과 호출 순서에 따라서 정상적으로 함수가 실행되지 않을 수 있다.



# 호이스팅

## 함수선언문에서의 호이스팅

- 함수선언문은 코드를 구현한 위치와 관계없이 자바스크립트의 특징인 호이스팅에 따라 브라우저가 자바스크립트를 해석할 때 맨 위로 끌어 올려진다.


```js
function printName(firstname) { // 함수선언문 
    var result = inner(); // "선언 및 할당" - 함수선언문이 아래에 있어도 오류발생x
    console.log(typeof inner); // > "function"
    console.log("name is " + result); // > "name is inner value"

    function inner() { // 함수선언문 
        return "inner value";
    }
}

printName(); // 함수 호출 
```



## 함수표현식에서의 호이스팅

- 함수표현식은 함수선언문과 달리 선언과 호출 순서에 따라서 정상적으로 함수가 실행되지 않을 수 있다.
  - 함수표현식에서는 선언과 할당의 분리가 발생한다.

```js
/* 오류 var */
function printName(firstname) { // 함수선언문
    console.log(inner); // > "undefined": 선언은 되어 있지만 값이 할당되어있지 않은 경우
    var result = inner(); // ERROR!! - inner 가 undefined로 function으로 인식되지 않았음
    console.log("name is " + result);

    var inner = function() { // 함수표현식 
        return "inner value";
    }
}
printName(); // > TypeError: inner is not a function

```

```js
/* 오류 const/let */ 
function printName(firstname) { // 함수선언문
    console.log(inner); // ERROR!!
    let result = inner();  
    console.log("name is " + result);

    let inner = function() { // 함수표현식 
        return "inner value";
    }
}
printName(); // > ReferenceError: inner is not defined
// let/const의 경우, 호이스팅이 일어나지 않기 때문에 위의 예시 그대로 이해하면 된다.
```



## 호이스팅 우선순위 - 변수 > 함수

- 변수 선언이 함수 선언보다 위로 끌어올려 짐
- 만약 변수가 선언만 되고, 값할당이 일어나지 않은 경우, 함수선언문이 변수를 덮어쓴다.

```js
var myName = "Heee"; // 값 할당 
var yourName; // 값 할당 X

function myName() { // 같은 이름의 함수 선언
    console.log("myName Function");
}
function yourName() { // 같은 이름의 함수 선언
    console.log("yourName Function");
}

console.log(typeof myName); // > "string"
console.log(typeof yourName); // > "function"
```

## 호이스팅 측면에서 var와 let, const의 차이점
var, let, const 모두 호이스팅이 된다.
위의 3가지 모두 평가 시점에 LexicalEnvironment에 변수 정보를 수집한다(호이스팅 개념으로 알고있는 동작)

1. var
var는 선언 단계에서 선언된 변수에 접근이 가능하다

2. let, const
let, const는 선언 단계에서 변수 수집을 하지만 코드가 실행되기 전에는 접근이 불가능하다.
👉🏻 변수 수집이 끝나고 실행되기 전까지 접근이 불가능한 이 단계를 TDZ(Temporal Dead Zone)라고 한다

```js
function test() {
  debugger;
  
  console.log('before ? ', {a, b, c});
 
  const a = 1;
  const b = 2;
  const c = 3;

  console.log('after ? ', {a, b, c});
}

test();//호이스팅 되었지만, 접근은 불가능하다.
```