---
title: "자바스크립트 ES6 모듈 내보내기/불러오기"
description: "https&#x3A;//www.daleseo.com/js-module-import/글을 읽고 정리한 내용입니다.이 두가지 방법은 moment라는 라이브러리를 불러오는 동일한 작업을 수행한다.Node.js에서 주로 사용하는 requirerequire은 NodeJS에서 사"
date: 2021-08-12T07:48:48.379Z
tags: ["JavaScript"]
---
- https://www.daleseo.com/js-module-import/
  - 글을 읽고 정리한 내용입니다.



# 자바스크립트 ES6 모듈 내보내기/불러오기



## 외부라이브러리를 불러오는 2가지 방법

> 이 두가지 방법은 moment라는 라이브러리를 불러오는 동일한 작업을 수행한다.

```js
// 1. require
const moment = require("moment");
// 2. import
import moment from "moment";
```

1. Node.js에서 주로 사용하는 require
   - `require`은 NodeJS에서 사용되고 있는 CommonJS 키워드
   - Ruby처럼 변수를 할당하듯이 모듈을 불러옴
2. react에서 주로 사용하는 import
   - `import`는 ES6(ES2015)에서 새롭게 도입된 키워드
   - Java나 Python처럼 명시적으로 모듈을 불러옴



## import 문법의 이점

> import는 ES6 모듈 시스템의 문법이다.

- `import`, `from`, `export`, `default`처럼 모듈 관리 전용 키워드를 사용하기 때문에 가독성이 좋습니다. 
- 비동기 방식으로 작동하고 모듈에서 실제로 쓰이는 부분만 불러오기 때문에 성능과 메모리 부분에서 유리



## export

- ES6에서는 `export` 키워드를 사용해서 명시적으로 내보낸다
  - 이 때 내보내는 변수나 함수의 이름이 그대로 불러낼 때 사용하게 되는 이름이 되기 때문에 이를 `Named Exports` 라고 부른다.
- 하나의 자바스크립트 모듈 파일에서 여러 개의 객체를 내보내고 불러올 수 있다.
- `export default` 키워드를 사용하면, 명시적으로 하나의 모듈에서 하나의 객체만 내보낼 수 있다.



- 여러가지 export 방법들
  1. 선언과 동시에 내보내기 
  2. 선언 후 별도로 내보내기
  3. default를 붙여서 단일 객체로 선언과 동시에 내보내기 
  4. default를 붙여서 단일 객체로 선언 후 별도로 내보내기
     - import 받는 쪽은 export한 변수명으로 사용하지 않아도 된다.

```js
const exchangeRate = 0.91;

// 안 내보냄
function roundTwoDecimals(amount) {
  return Math.round(amount * 100) / 100;
}

// 내보내기 1 - 선언과 동시에 내보내기 
export function canadianToUs(canadian) {
  return roundTwoDecimals(canadian * exchangeRate);
}

// 내보내기 2 - 선언 후 별도로 내보내기
const usToCanadian = function (us) {
  return roundTwoDecimals(us / exchangeRate);
};
export { usToCanadian };
```



```js
const exchangeRate = 0.91;

// 안 내보냄
function roundTwoDecimals(amount) {
  return Math.round(amount * 100) / 100;
}

// 내보내기 3 - default를 붙여 단일 객체로 내보내기
export default {
  canadianToUs(canadian) {
    return roundTwoDecimals(canadian * exchangeRate);
  },

  usToCanadian: function (us) {
    return roundTwoDecimals(us / exchangeRate);
  },
};
```
```js
// 내보내기 4 - default를 붙여서 내보내는데 선언 후 별도로 내보내기 : 
const exchangeRate = 0.91;

const obj = {
  canadianToUs(canadian) {
    return roundTwoDecimals(canadian * exchangeRate);
  },
};

obj.usToCanadian = function (us) {
  return roundTwoDecimals(us / exchangeRate);
};

export default obj;
```



## import

- 사용 방법

  - 여러 객체(Named Exports)를 불러올 떄

    1. ES6의 Destructuring 문법을 사용해서 필요한 객체만 선택적으로 전역에서 사용

    2. 모든 객체에 별명(alias)을 붙이고 그 별명을 통해서 접근

  - 단일 객체불러오기

    1. `import` 키워드를 사용해서 아무 이름이나 원하는 이름을 주고 해당 객체를 통해 속성에 접근



```js
// 1. Destructuring 문법 이용
import { canadianToUs } from "./currency-functions";
console.log(canadianToUs(50));

// 2. 별명 붙여서 접근
import * as currency from "./currency-functions";
console.log(currency.usToCanadian(30));

// 3. 단일객체 불러오기
import something from  "./currency-object";
console.log(something.canadianToUs(50));
console.log(something.usToCanadian(30));
```

