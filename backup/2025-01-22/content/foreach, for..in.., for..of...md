---
title: "foreach, for..in.., for..of.."
description: "3줄요약forEach는 Array를 순회하는 데 사용되는 Array의 메소드.for in은 Object의 key를 순회하기 위해 사용되는 반복문. 단, 확장 속성까지 함께 순회한다는 점 고려.for of는 이터러블한 객체를 모두 순회할 수 있는 강력한 반복문!특징오직 "
date: 2021-05-09T08:38:07.526Z
tags: ["JavaScript"]
---
> 3줄요약
>
> 1. forEach는 Array를 순회하는 데 사용되는 Array의 메소드.
>
> 2. for in은 Object의 key를 순회하기 위해 사용되는 반복문. 단, 확장 속성까지 함께 순회한다는 점 고려.
>
> 3. for of는 이터러블한 객체를 모두 순회할 수 있는 강력한 반복문!



# foreach 반복문

- 특징

  - 오직 Array 객체에서만 사용가능한 메서드(ES6부터는 Map, Set 등에서도 지원)
  - 중간에 멈추는게 불가능함

- 작동방식

  - foreach구문의 인자로 callback함수를 등록할수 있고, 배열의 각 요소들이 반복될 떄 이 callback 함수가 호출됩니다. 
  - callback 함수에서 배열요소의 인덱스와 값에 접근할수 있습니다.

- 문법

  - `arr.forEach(callback(currentvalue[, index[, array]])[, thisArg])`
  - callback : 각 요소에 대해 실행할 함수. 다음 세 가지 매개변수를 받음
    - currentValue : 처리할 현재 요소
    - index (Optional) : 처리할 현재 요소의 인덱스
    - array (Optional) : forEach()를 호출한 배열
  - thisArg (Optional) : callback을 실행할 때 this로 사용할 값

  



## 사용방법

```js
var items = ['item1', 'item2', 'item3'];

items.forEach(function(item) {
    console.log(item);
});
// 출력 결과: item, item2, item3
```



# for .. in .. 반복문 

- 특징
  - for...in은 특정 순서에 따라 인덱스를 반환하는 것을 보장할 수 없기 때문에 인덱스의 순서가 중요한 Array에서 반복을 위해 사용하지 않는 것이 좋다. (대신 for of문을 사용)
  - 쉽게 객체의 속성을 확인할 수 있기 때문에 디버깅을 위해 사용될 수 있다. (ex: 특정 값을 가진 키가 있는지 확인하는 경우, ...)
  - key를 이용해 value에 접근해야함. 직접 value에 접근 불가능.
  - `[[Enumerable]]`이며, `for in` 구문은 이 값이 `true`로 셋팅되어 속성들만 반복할 수 있습니다. 
    -  객체의 모든 내장 메서드를 비롯해 각종 내장 프로퍼티 같은 비열거형 속성은 반복되지 않습니다.
  - Object의 key를 순회하기 위해 사용되는 반복문. 단, 확장 속성까지 함께 순회한다는 점 고려.
- 직동방식
  - 상속된 열거 가능한 속성들을 포함하여 객체에서 문자열로 키가 지정된 모든 열거 가능한 속성에 대해 반복  (Symbol로 키가 지정된 속성은 무시)
- 문법
  - ` for (variable in object) { ... }`
  - variable : 각 반복에 서로 다른 속성값이 variable에 할당
  - iterable : 반복되는 열거가능(enumerable)한 속성이 있는 객체



## 사용방법

```js
const object = { a: 1, b: 2, c: 3 }
Object.prototype.foo = function() { 
    return 0; 
}

for (const key in object) { 
    console.log(key, object[key])
} 
// a 1 b 2 c 3 foo function()...
```





# for .. of ..

- 특징
  - for of 반복문은 ES6에 추가된 새로운 컬렉션 전용 반복 구문
  - for of 구문을 사용하기 위해선 컬렉션 객체가 [Symbol.iterator] 속성을 가지고 있어야만 합니다.
- 작동방식
  - [Symbol.iterator] 속성을 가진 객체에 대해 각 개별 속성값에 대해 루프를 반복적으로 수행
- 문법
  - `for (variable of iterable) {  ... }`
  - variable : 각 반복에 서로 다른 속성값이 variable에 할당
  - iterable : 반복되는 열거가능(enumerable)한 속성이 있는 객체



## 사용방법

```js
Object.prototype.objCustom = function () {};
Array.prototype.arrCustom = function () {};

let iterable = [3, 5, 7];
iterable.foo = "hello";

for (let i in iterable) {
  console.log(i); // logs 0, 1, 2, "foo", "arrCustom", "objCustom"
}

for (let i of iterable) {
  console.log(i); // logs 3, 5, 7
}
```

