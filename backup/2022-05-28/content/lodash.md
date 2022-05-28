---
title: "lodash"
description: "lodash 라이브러리는 자바스크립트로 개발시 가장 많이 사용되는 라이브러리 중에 하나역할 array 를 다룰때 번거로움을 없애고 쉽게 사용할 수 있도록 해줌object, string 등을 다룰때도 간편함을 제공'여러가지 많은 유틸리티 함수자주 사용되는 카테고리Arra"
date: 2021-05-10T16:52:27.150Z
tags: ["JavaScript"]
---
# lodash

- lodash 라이브러리는 자바스크립트로 개발시 가장 많이 사용되는 라이브러리 중에 하나
- 역할 
  - array 를 다룰때 번거로움을 없애고 쉽게 사용할 수 있도록 해줌
  - object, string 등을 다룰때도 간편함을 제공'
  - 여러가지 많은 유틸리티 함수
- 자주 사용되는 카테고리
  - Array: 배열에만 사용가능한 함수
  - Object: 객체에만 사용 가능한 함수
  - Collection: 배열과 객체 모두에 사용 가능한 함수
  - Util: 유틸리티 관련 함수
  - Seq: jquery의 메서드 체인처럼 여러개의 펑션들을 연달아서 사용 가능
- 장점
  - Lazy Evaluation
  - chaining
    -  functional programming이 가능
  - 코드를 좀더 직관적으로 쓸 수 있게 됨.



## 배열 관련

### find

- javascript의 find 함수와 같지만, 조금 더 편리하게 사용가능

- `_.find(배열,  찾는방법function)`
  - 찾으면 객체를 리턴
  - 못찾으면 undefined를 리턴

```js
let books = [
  {title: "Three Little Pigs", price: 20, author: "Jacobs", rank: 1},
  {title: "Alice in Wonderland", price: 25, author: "Carroll", rank: 2},
  {title: "Seven Dwarfs", price: 35, author: "Disney", rank: 3},
  {title: "Swallow's gift", price: 15, author: "Unknown", rank: 4},
];
 
let result;

// 기본
result = _.find(books, item => item.title === 'Alice in Wonderland')

// _.match 함수를 파라미터로 넣기
result = _.find(books, _.matches({ title : 'Alice in Wonderland' }))

// shorthand 표기법으로 더 줄이기
result = _.find(books, { title : 'Alice in Wonderland' })
```



### compact

- 배열에서 false, null, 0, “”(빈값), undefined, NaN의 값을 제외시킨 배열을 반환
- `_.compact( 배열 )`

```js
_.compact([0, 1, false, 2, '', 3]);
// [1, 2, 3]
```



### take

- 배열에서 앞에서부터 n개의 요소를 반환한다.
- `_.take( 배열, [가져올 요소 수=1])`

```js
_.take([3, 5, 4, 7, 9], 3);
// [3, 5, 4]
```



### uniq

- 배열의 중복 값을 제거
- `_.uniq( 배열 )`

```js
_.uniq([1, 1, 3]);
// [1, 3]
```



### flatten

-  flattern은 말그대로 평평하게 펴주는 역할을 한다. 
  - 2차원 배열을 1차원으로 만들려면 flattern을 사용하면되고 
  - 만일 다차원 배열일 경우 순환해서 모든 배열을 펼치기 위해서는 flatternDeep를 사용하면 된다.
- `_.flatten( 배열 )`

```js
const gridList2 = [
  [
    {x: 1, y: 1},
    {x: 1, y: 2},
  ],
    [
    {x: 2, y: 1},
    {x: 2, y: 2},
  ]
]

result = _.flatten(gridList2);
console.log(result) // [ {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 1}, {x: 2, y: 2} ]
```





## collection 관련

### sortBy

- Collection 값들을 **원하는 필드를 기준으로 정렬**
- `_.sortBy(컬렉션, 정렬기준필드);`
  - 복수개의 필드를 기준으로 정렬하려면 `_.sortBy(컬렉션, [정렬기준필드1, 정렬기준필드2]);`



### filter

- 콜렉션에서 해당 데이터 또는 콜백 조건에 맞는 데이터를 포함한 콜렉션을 반환
- `_.filter( 콜렉션, 검색할 데이터 또는 콜백함수 )`

```js
var users = [
  { user: 'barney', age: 36, active: true },
  { user: 'fred', age: 40, active: false },
];

_.filter(users, (o) => !o.active);
// [ { 'user': 'fred',   'age': 40, 'active': false } ]

// _.matches 메소드가 생략된 형태
_.filter(users, { age: 36, active: true });
// === _.filter(users, _.matches({ 'age': 36, 'active': true }))
// [ { 'user': 'barney', 'age': 36, 'active': true } ]

// _.matchesProperty 메소드가 생략된 형태
_.filter(users, ['active', false]);
// [ { 'user': 'fred',   'age': 40, 'active': false } ]

// _.property 메소드가 생략된 형태
_.filter(users, 'active');
// [ { 'user': 'barney', 'age': 36, 'active': true } ]
```



### size

- 콜렉션의 사이즈를 반환한다. length와 같다고 생각하면 된다.
- `_.size( 콜렉션 )`

```js
_.size([1, 2, 3])
// 3

_.size({ 'a': 1, 'b': 2 })
// 2

_.size('apple'
// 5
```



### sampleSize

- 콜렉션에서 추출 갯수만큼 랜덤 값을 배열로 반환한다.
- `_.sampleSize( 콜렉션, [추출 갯수=1])`

```js
.sampleSize(_.range(1, 45), 7);
// 로또 번호 추출
```



## Object 관련

### get

- 객체에서 해당 키 값만을 가져온다. 없을 시 기본값을 줄 수 있다.

- `_.get( 객체, 가져올 키[, 기본값 ])`

```js
var object = { a: 1, b: 2, c: 3, e: { f: 5 } };

_.get(object, 'a');
// => 1

_.get(object, 'd');
// undefined

_.get(object, 'd', 4);
// 4

_.get(object, 'e.f');
// 5
```



## util

### times

- 콜백함수 조건에 맞게 반복횟수만큼의 데이터를 배열로 반환한다.
  - 초기화를 시킬 때 유용하다.
- `_.times( 반복횟수, 콜백함수 )`

```js
.times(3, _.constant(0));
// [0, 0, 0]
```



### range

- 배열을 초기화 시킬 때 유용하다. 
- `_.range( [시작], 종료, [증가 폭=1])`

```js
_.range(0, 6, 0);
// [0, 0, 0, 0, 0, 0]

_.range(4);
// [0, 1, 2, 3]
```



### random

- 말 그대로 랜덤한 숫자를 반환합니다. 
  - 최소값과 최대값을 설정 가능
  - 실수 사용여부도 설정 가능
- `_.random(최소값, 최대값, 실수[boolean])`

```js
const randomNum1 = _.random(0,5)
const randomNum2 = _.random(5)
const randomNum3 = _.random(1.2, 5.8)
console.log(randomNum1) // 5
console.log(randomNum2) // 3
console.log(randomNum3) // 3.051234321
```

