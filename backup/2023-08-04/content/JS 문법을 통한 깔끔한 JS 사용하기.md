---
title: "JS 문법을 통한 깔끔한 JS 사용하기"
description: "다음 내용들은 영상에서 나온 내용을 정리한 내용입니다.https&#x3A;//youtu.be/BUAhpB3FmS4안좋은 코드조건이 두가지인 경우 elif 를 작성할 필요 없음좋은 코드삼항 연산자 이용condition ? exprIfTrue : exprIfFalse 안좋"
date: 2021-08-03T15:02:34.448Z
tags: ["JavaScript"]
---
- 다음 내용들은 영상에서 나온 내용을 정리한 내용입니다.
  - https://youtu.be/BUAhpB3FmS4



# Ternary Operator(삼항연산자) (? : )

- 안좋은 코드
  - 조건이 두가지인 경우 elif 를 작성할 필요 없음

```javascript
function getResult(score) {
  let result;
  if (score > 5) {
    result = '👍';
  } else if (score <= 5) {
    result = '👎';
  }
  return result;
}
```

- 좋은 코드
  - 삼항 연산자 이용
    - `condition ? exprIfTrue : exprIfFalse `

```js
// ✅ Good Code ✨
function getResult(score) {
  return score > 5 ? '👍' : '👎';
}
```



# Nullish Coalescing Operator ( ?? )

- 안좋은 코드 - Nullish Coalescing Operator를 쓰면 더 간단하게 표현할 수 있음

```js
function printMessage(text) {
  let message = text;
  if (text == null || text == undefined) {
    message = 'Nothing to display 😜';
  }
  console.log(message);
}
```



- 좋은 코드 

  - Nullish Coalescing Operator(널 병합 연산자) 를 이용하여 왼쪽연산자가 null 또는 undefined일 떄 오른쪽 피연산자를 반환

    그렇지 않으면 왼쪽 피연산자를 반환하는 논리 연산자
    - 왼쪽 피연산자가 null 또는 undefined 뿐만 아니라 falsy 값에 해당할 경우 오른쪽 피연산자를 반환하는 논리 연산자 OR (||)와는 대조
    - 하지만, 이 경우는 ''(공백문자열). 0 같은 경우도 포함되기 떄문에 다음 상황에서는 `??` 를 사용하는 것이 좋음

```js
function printMessage(text) {
  const message = text ?? 'Nothing to display 😜';
  console.log(message);
}
```



- 새로운 도전 - default 파라미터를 이용하면 안되나?
  - undefined 같은 경우 우리가 원하는 방향으로 로직이 흘러가지만,
    null 일 경우  console log에 null이 찍히게 됨

```js
function printMessage(text = 'Nothing to display 😜') {
  console.log(text);
}
```



- 잠깐 팁 - falsy 해당 값
  - false
  - 0
  - -0
  - NaN
  - null
  - undefined
  - ''



# Object Destructuring( { } ) 

- 하고 싶은 것
  - 매개변수를 받아서, 매개변수의 property들을 각가 다른 함수의 매개변수로 보내주기

- 안좋은 코드
  - person이 반복적으로 사용되고 있고,
  - 지역변수를 사용하여 코드의 길이가 늘어남

```js
const person = {
  name: 'Julia',
  age: 20,
  phone: '0107777777',
};

// ❌ Bad Code 💩
function displayPerson(person) {
  displayAvatar(person.name);
  displayName(person.name);
  displayProfile(person.name, person.age);
}

// ❌ Bad Code 💩
function displayPerson(person) {
  const name = person.name;
  const age = person.age;
  displayAvatar(name);
  displayName(name);
  displayProfile(name, age);
}
```



- 좋은 코드
  - person 반복 없이 깔끔하게 코드를 작성할 수 있음

```js
function displayPerson(person) {
  const { name, age } = person;
  displayAvatar(name);
  displayName(name);
  displayProfile(name, age);
}
```



# Spread Syntax ( ... )

- 하고싶은 것
  - 두개의 변수가 가지고 있는 property를 합쳐 새로운 변수를 만들기
- 안좋은 코드
  - 수동으로 property 를 쓰기

```js
// Spread Syntax - Object
const item = { type: '👔', size: 'M' };
const detail = { price: 20, made: 'Korea', gender: 'M' };


// ❌ Bad Code 💩 - 수동적으로 하나씩 property 추가
const newObject = new Object();
newObject['type'] = item.type;
newObject['size'] = item.size;
newObject['price'] = detail.price;
newObject['made'] = detail.made;
newObject['gender'] = detail.gender;
console.log(newObject);

// ❌ Bad Code 💩 - 수동적으로 하나씩 property 추가2
const newObject2 = {
  type: item.type,
  size: item.size,
  price: detail.price,
  made: detail.made,
  gender: detail.gender,
};
console.log(newObject);
```



- 좋은 코드
  1. object assign 이용
     - **`Object.assign()`** 메소드는 열거할 수 있는 하나 이상의 출처 객체로부터 대상 객체로 속성을 복사할 때 사용합니다. 대상 객체를 반환
  2. spread Syntax 이용
     - `...` (spread Syntax)를 이용하여 깔끔하게 해결
     - 만약 중복되는 property가 있다면 뒤에 있는 값의 property로 덮어씌워진다.

```js
 // ✅ Good Code ✨ - 방법1 object assign 이용
const shirt0 = Object.assign(item, detail);
console.log(shirt0);

// ✅ Better! Code ✨ - 방법2 spread Syntax 이용
const shirt = { ...item, ...detail};
console.log(shirt);
```



## Array Spread Syntax

- array 도 object와 동일하게 spread Syntax 를 사용할 수 있음

```js
// Spread Syntax - Array
let fruits = ['🍉', '🍊', '🍌'];

// fruits.push('🍓');
fruits = [...fruits, '🍓'];
console.log(fruits);

// fruits.unshift('🍇');
fruits = ['🍇', ...fruits];
console.log(fruits);

const fruits2 = ['🍈', '🍑', '🍍'];

let combined = fruits.concat(fruits2);
combined = [...fruits, '🍒', ...fruits2];
console.log(combined);
```



## 문제 - 배열 중복제거

- 배열에서 중복을 제거

```js
// Remove Duplicates!
const array = ['🐶', '🐱', '🐈', '🐶', '🦮', '🐱'];

// 새로운 set을 만든 후 Spread Syntax를 이용해서 새로운 배열에 풀어냄
console.log([...new Set(array)]);
```


# Optional Chaining ( ?. )

- optional chaing이란

  - 연산자 **`?.`** 는  프로퍼티가 없는 중첩 객체를 에러 없이 안전하게 접근할 수 있습니다.

  - `?.`은 `?.`'앞’의 평가 대상이 `undefined`나 `null`이면 평가를 멈추고 `undefined`를 반환

  - 단락평가

    - `?.`는 왼쪽 평가대상에 값이 없으면 즉시 평가를 멈춥니다. 참고로 이런 평가 방법을 단락 평가(short-circuit)라고 부릅니다.

      그렇기 때문에 함수 호출을 비롯한 `?.` 오른쪽에 있는 부가 동작은 `?.`의 평가가 멈췄을 때 더는 일어나지 않습니다.

  - ?.()와 ?.[]

    - `?.`은 연산자가 아닙니다. `?.`은 함수나 대괄호와 함께 동작하는 특별한 문법 구조체(syntax construct)

  - 즉, 3가지 형태로 사용됨

    - `obj?.prop` – `obj`가 존재하면 `obj.prop`을 반환하고, 그렇지 않으면 `undefined`를 반환함
    - `obj?.[prop]` – `obj`가 존재하면 `obj[prop]`을 반환하고, 그렇지 않으면 `undefined`를 반환함
    - `obj?.method()` – `obj`가 존재하면 `obj.method()`를 호출하고, 그렇지 않으면 `undefined`를 반환함

```js
let user1 = {
  admin() {
    alert("관리자 계정입니다.");
  }
}

let user2 = {};

user1.admin?.(); // 관리자 계정입니다. 출력
user2.admin?.();

//--------------------------------------------------

let user1 = {
  firstName: "Violet"
};

let user2 = null; // user2는 권한이 없는 사용자라고 가정해봅시다.

let key = "firstName";

alert( user1?.[key] ); // Violet
alert( user2?.[key] ); // undefined

alert( user1?.[key]?.something?.not?.existing); // undefined
```



- 하고싶은 것
  - job과 job.tilte이 있다면 job.title을 출력

- 나쁜 코드 예시
  - && 연산자로 복잡해짐

```js
// Optional Chaining
const bob = {
  name: 'Julia',
  age: 20,
};
const anna = {
  name: 'Julia',
  age: 20,
  job: {
    title: 'Software Engineer',
  },
};

// ❌ Bad Code 💩
function displayJobTitle(person) {
  if (person.job && person.job.title) {
    console.log(person.job.title);
  }
}
```



- 좋은 코드
  - Optional Chaining 활용
  - 부가적으로 앞에 사용한 Nullish Coalescing operator 사용

```js
// ✅ Good Code ✨ - Optional Chaining 활용
function displayJobTitle(person) {
  if (person.job?.title) {
    console.log(person.job.title);
  }
}

// ✅ Good Code ✨ - 추가적으로  Nullish Coalescing operator 사용하여 더 깔끔하게
function displayJobTitle(person) {
  const title = person.job?.title ?? 'No Job Yet 🔥';
  console.log(title);
}
```



# Template Literals ( `` {}` ` )

- 하고싶은 것
  - 변수가 가지고 있는 property 값들을 이용해서 합성 문자열 출력

- 안좋은 코드

```js
const person = {
  name: 'Julia',
  score: 4,
};

// ❌ Bad Code 💩
console.log(
  'Hello ' + person.name + ', Your current score is: ' + person.score
);

```



- 좋은 코드
  - Template Literals 적용
  - Object Destructuring 추가 적용
  - 함수화를 통한 확장성, 유지보수성 추가

```js
// ✅ Good Code ✨ - Template Literals 적용
console.log(`Hello ${person.name}, Your current score is: ${person.score}`);

// ✅ Good Code ✨ - Object Destructuring 추가 적용
const { name, score } = person;
console.log(`Hello ${name}, Your current score is: ${score}`);

// ✅ Good Code ✨ - 함수화를 통한 확장성, 유지보수성 추가
function greetings(person) {
  const { name, score } = person;
  console.log(`Hello ${name}, Your current score is: ${score}`);
}
```



# Looping 

- 하고싶은 것
  - 배열을 이용하여 
    - 짝수인 경우에 한해서
    - 4를 곱한다음
    - 총합을 출력
- 안좋은 코드
  - 길고, 가독성이 떨어짐

```js
// Looping
const items = [1, 2, 3, 4, 5, 6];

// ❌ Bad Code 💩 
function getAllEvens(items) {
  const result = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i] % 2 === 0) {
      result.push(items[i]);
    }
  }
  return result;
}

function multiplyByFour(items) {
  const result = [];
  for (let i = 0; i < items.length; i++) {
    result.push(items[i] * 4);
  }
  return result;
}

function sumArray(items) {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i];
  }
  return sum;
}

const evens = getAllEvens(items);
const multiple = multiplyByFour(evens);
const sum = sumArray(multiple);
console.log(sum); 
```



- 좋은 코드
  - filter
  - map
  - reduce 를 체이닝으로 사용

```js
const result = items
  .filter((num) => num % 2 === 0)
  .map((num) => num * 4)
  .reduce((a, b) => a + b, 0);
console.log(result);
```



# promise hell 피하기 - async await

- 안좋은 코드
  - depth가 깊어지기도 하고 뭘하는지 파악하기 힘듬

```js
// ❌ Bad Code 💩
function displayUser() {
  fetchUser() //
    .then((user) => {
      fetchProfile(user) //
        .then((profile) => {
          updateUI(user, profile);
        });
    });
}
```



- 좋은 코드
  - async와 await를 사용해서 가독성도 높이고 이해도도 높일 수 있음

```js
// ✅ Good Code ✨
async function displayUser() {
  const user = await fetchUser();
  const profile = await fetchProfile(user);
  updateUI(user, profile);
}
```

