---
title: "JSX 와 엘리먼트 랜더링"
description: "JSX 는 리액트에서 생김새를 정의할 때, 사용하는 문법입니다. 얼핏보면 HTML 같이 생겼지만 실제로는 JavaScript React는 별도의 파일에 마크업과 로직을 넣어 기술을 인위적으로 분리하는 대신, 둘 다 포함하는 “컴포넌트”라고 부르는 느슨하게 연결된 유닛으"
date: 2021-08-10T05:12:26.621Z
tags: ["React"]
---
# JSX

> JSX 는 리액트에서 생김새를 정의할 때, 사용하는 문법입니다. 얼핏보면 HTML 같이 생겼지만 실제로는 JavaScript 

- React는 별도의 파일에 마크업과 로직을 넣어 기술을 인위적으로 분리하는 대신, 둘 다 포함하는 “컴포넌트”라고 부르는 느슨하게 연결된 유닛으로 관심사를 분리

  - JSX라 하며 JavaScript를 확장한 문법
    - 템플릿언어+js의 모든기능

- 작동방식

  - 실제로는 JSX 은 Babel에 의해 `React.createElement(...)`로 변환

    그래서 브라우저에서 실행이 가능하게 됨

  - 그렇기 때문에 `import React from 'react'` 부분이 코드에서 react를 사용하는 부분이 없더라도 들어가 있어야 함

- 프로퍼티 명명 규칙

  - camelCase
  - JSX는 HTML 보다는 Javascript에 가깝기 때문에, React DOM은 HTML 어트리뷰트 이름 대신 JS의 camelCase의 프로퍼티 명명규칙을 따르게 됨

  
- 사용시 주의사항
  - JSX선언의 결과물이 React Element이기 때문에 JSX코드 스코프 안에 `import React from "react"`선언이 꼭 필요하다.
  - JSX를 통해 조작되는 건 실제 DOM이 아닌 React의 Virtual DOM이다.
  - 태그와 컴포넌트 사이의 white space는 자동으로 사라진다.
 


## 사용방법



### style과 ClassName

>  JSX 에서 태그에 `style` 과 CSS class 를 설정하는 방법은 HTML 에서 설정하는 방법과 다릅니다.

- 스타일
  - 객체 형태로 작성
  - `background-color` 처럼 `-` 로 구분되어 있는 이름들은 `backgroundColor` 처럼 camelCase 형태로 네이밍 

```js
  const style = {
    backgroundColor: 'black',
    color: 'aqua',
    fontSize: 24, // 기본 단위 px
    padding: '1rem' // 다른 단위 사용 시 문자열로 설정
  }
```



- class
  - `class=` 가 아닌 `className=` 으로 설정
  - class 예약어가 겹치기 때문에 className을 사용

```react
      <div className="gray-box"></div>
```



### JSX 안에 Javascript 표현식 사용

- JSX의 중괄호 안에는 유효한 모든 Javascript 표현식을 넣을 수있음
  - Ex) `2+2` , `user.firstName`, `format(user)`

```js
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```



### 주석

- JSX 내부의 주석은 `{/* 이런 형태로 */}` 작성
- 열리는 태그 내부에서는 `// 이런 형태로도` 주석 작성이 가능

```js
  return (
    <>
      {/* 주석은 화면에 보이지 않습니다 */}
      /* 중괄호로 감싸지 않으면 화면에 보입니다 */
      <Hello 
        // 열리는 태그 내부에서는 이렇게 주석을 작성 할 수 있습니다.
      />
    </>
  );
```







### 괄호 묶기

- 가독성을 좋게 하기 위해 JSX를 여러 줄로 나눌 경우, 필수는 아니지만, 자동 세미콜론 삽입을 피하기 위해 괄호로 묶는 것을 권장

```js
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

// 괄호로 묶은 부분
const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```



###  Javascript 객체처럼 사용

- 컴파일이 끝나면, JSX 표현식이 정규 Javascript 함수 호출이 되고, Javascript 객체로 인식됨
  - JSX를 `if` 구문 및 `for loop` 안에 사용하고, 
    변수에 할당하고,
    인자로서 받아들이고,
    함수로부터 반환하는 것이 가능

```js
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```



### XSS 공격방지

- JSX 에 사용자 입력을 상비하는 것은 안전

- 작동방식

  - React DOM은 JSX에 삽입된 모든 값을 랜더링하기 전에 이스케이프

    ```none
      & becomes &amp;
      < becomes &lt;
      > becomes &gt;
      " becomes &quot;
      ' becomes &#39;
    ```

```js
// 사용자 입력을 받아 출력하는 것도 안전합니다.
const title = response.potentiallyMaliciousInput;

const element = <h1>{title}</h1>;
```



## Fragment <> </>

- Fragment 가 나온 배경
  - 두개 이상의 태그가 존재한다면 꼭 하나의 태그로 감싸져야 한다.
  - 이 때문에 여러 요소를 div로 한번 더 묶어줘야해서 의미없는 DOM 노드가 생김
- 역할
  - Fragements 를 사용하면 DOM 노드에 추가하지 않고 하위의 목록을 그룹화 할 수 있습니다.

- 사용방법
  - `<React.Fragment> ...내용 </React.Fragment>`
  - `<> ...내용 </>`




<br>



# 엘리먼트 랜더링

- 엘리먼트 - React 앱의 가장 작은 단위

  - 엘리먼트는 화면에 표시할 내용을 기술
  - immutable 함 (const)
  - Element는 보통 바로 사용되지 않으며, Component에서 리턴받아 사용됨
    - React 엘리먼트를 루트 DOM 노드에 렌더링하려면 둘다 ReactDOM.render() 로 전달하면 됨

- `ReactDOM.render(element, container[, callback])`

  - 반환값 - 컴포넌트에 대한 참조(ref)

  - 하는일

    - React 엘리먼트가 이전에 `container` 내부에 렌더링 되었다면 해당 엘리먼트는 업데이트하고

      최신의 React 엘리먼트를 반영하는 데 필요한 DOM만 변경

      - 컨테이너 노드를 수정하지 않고 컨테이너의 하위 노드만 수정

  - 주의점

    - 반환값이 ref 값이기는 하나 이를 사용하는 것은 레거시이기 때문에, React 컴포넌트를 비동기로 랜더링 하는 경우 충돌이 날 수 있어, ReactComponent 인스턴스의 참조가 필요하다면 참조 엘리먼트에 콜백 ref를 붙이는 것이 더 좋음
    - SSR(Server Side Rendering)의 경우 render를 이용해서 서버에 랜더링한 컨테이너에 이벤트를 보충하는 것은 권장되지 않으며, `hydrate()`를 사용하는 것이 더 좋음

```js
// 엘리먼트를 ReactDOM.render로 화면에 표시하기
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
// reactDOM 의 가장 상위 노드를 root DOM 노드라고 부름
```



## 변경부분만 업데이트 하기

- React 엘리먼트는 불변객체(const) 이기 떄문에 엘리먼트를 생성한 이후에는 해당 엘리먼트의 자식이나 속성을 변경할 수 없음

- 하단 예시로 만들 내용)
  - 시간을 표시하는 시계



### setInterval을 이용한 업데이트 

- 계속 새로운 element를 만들어서 ReactDOM.render() 로 전달하는 방법
  - 하지만, ReactDOM 은 전체를 다시 그리는 것이 아닌, 내용이 변경된 텍스트 노드만 업데이트 하게 됨

```js
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
```



