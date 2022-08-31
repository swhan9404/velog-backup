---
title: "React 컴포넌트와 Props"
description: "type과 props를 가지는 React의 객체React.createElement(type, props, ...children) 를 이용하여 만들어진 객체type : HTML 태그 이름props : 이름 외의 property ( class 등)child : 태그 안에 "
date: 2021-08-11T01:34:57.665Z
tags: ["React"]
---
# React Element

> `type`과 `props`를 가지는 React의 객체

- `React.createElement(type, props, ...children)` 를 이용하여 만들어진 객체
  - type : HTML 태그 이름
  - props : 이름 외의 property ( class 등)
  - child : 태그 안에 포함된 내용

```js
// createElement를 이용해서 React Element 만들기
React.createElement(
    'div',
    { className: 'name' },
    'React'
)
```



```json
// createElement를 이용해서 만들어진 React Element 객체
{
    type: 'div',
    props: {
        className: 'name',
        children: 'React'
    }
}
```



# React Component

> 개념상으로는 자바스크립트 함수와 같으며, 매개변수(Props)를 받아들여, React Element 를 리턴한다.

- Component를 만드는 두 가지 방법

  1. Function Component(함수 컴포넌트)
  2. Class Component(클래스 컴포넌트)

  

```js
// 함수기반
function FCHello() {
  return (
    <div>
      <h1>Hello Functional Component!</h1>
    </div>
  );
}

// class 기반
class CCHello extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello Class Component!</h1>
      </div>
    );
  }
}
```



- 컴포넌트 만들 때의 규칙
  - Component 이름은 대문자로 시작해야 합니다.
    기존의 HTML 태그는 소문자로 시작하기 때문에, React의 Component는 대문자로 시작하여 차이를 둡니다.
  - Component의 return값은 가장 큰 하나의 Component로 감싸져 있어야 합니다.
    우리가 Fragment를 사용하는 가장 큰 이유입니다. 



## typeScript 함수형컴포넌트 선언

- typeScript에서 함수형 컴포넌트를 선언하는 방법은 2가지 스타일이 있다.
  1. `const App: React.FC = () => { }`로 컴포넌트를 선언(함수표현식)
  2. `function()` 키워드를 사용해서 선언(함수선언식)
- 두개를 생각할 떄 차이점을 기억해야한다 - 호이스팅
  - 함수 선언식은 호이스팅에 영향을 받지만, 
    함수 표현식은 호이스팅에 영향을 받지 않는다.
    - 호이스팅-  함수 안에 있는 선언들을 모두 끌어올려서 해당 함수 유효 범위의 최상단에 선언하는 것

```js
// 호이스팅 예시

foo() // 작동
foo2() // 에러

function foo(){
    console.log("foo")
}
var foo2 = function(){
    console.log("foo2")
}
```





### React.FC

> 화살표형 함수를 통해 컴포넌트 만드는 방법(함수표현식방식) 

- React.FC의 장점
  - props의 타입을 Generics로 넣어서 사용
    - props에 기본적으로 `children`이 들어가있다.
    - 컴포넌트의 defaultProps, propTypes, contextTypes를 설정할 때 자동완성이 될 수 있다.
- React.FC의 단점
  - `children`이 옵셔널 형태로 들어가있다보니 컴포넌트의 props 의 타입이 명백하지 않다.
    - `children`이 필요한 컴포넌트가 있고 있으면 안되는 컴포넌트들이 있을 것
    - 그에 대한 처리를 하고 싶다면 Props의 타입을 따로 지정해야함
  - `defaultProps`가 제대로 동작하지 않는다
     - 비구조화 할당을 하는 과정에서 기본값을 설정해주어야 제대로 작동한다.
       밑의 과정이 무의미해지는 것

```js
// Props 타입 지정
type GreetingProps = {
  name: string;
  children: React.ReactNode;
};

// defaultProps 동작하지 않음
Greetings.defaultProps = {
  mark: "!",
};

// 비구조할당 과정으로 defaultProps 를 해주어야함
const Greetings: React.FC<GreetingsProps> = ({ name='홍길동', mark }) => (
  <div>
    Hello, {name} {mark}
  </div>
);
```



- 다만, 이 방식은 선호되는 방식이 아니다.
  - `children` 이 옵셔널 형태로 들어가있다보니까 어찌 보면 컴포넌트의 props 의 타입이 명백하지 않다.
  - 매개 변수에 직접 typing을 지정하여 사용하면 구성 요소를보다 정확하게 입력하고 오탐을 방지하는 동시에 유연성을 높일 수 있다는 것이 typescript의 타이핑 관례이다.



```typescript
import React from 'react';

type GreetingsProps = {
  name: string;
  mark: string;
};

const Greetings: React.FC<GreetingsProps> = ({ name, mark = '!' }) => (
  <div>
    Hello, {name} {mark}
  </div>
);

export default Greetings;
```

- 구조 해석

  - GreetingsProps 인터페이스를 정의

  - GreetingsProps인터페이스, 즉 `{name: string, mark: string}` 타입을 제네릭 인자로 전달

  - 클래스 구현부쪽의 매개변수로 받아 비구조할당하는 과정에서, 인자에 문자열 name과  mark 이 있다는 것을 보장할 수 있는데, 전달한 props가 모양을 알려 주었기 때문

    - 그렇지 않을 경우 에디터 문법 검사기가 체크할 것이고 타입스크립트 빌드 에러를 발생 시킬 것

    



### function() 키워드로 컴포넌트생성

> 함수선언식 방식으로 컴포넌트 만드는 방법

- 특징
  - props에 직접 type을 지정해주기 때문에 좀더 명확하다.



```js
import React from 'react';

type GreetingsProps = {
  name: string;
  mark: string;
};

function Greetings({ name, mark }: GreetingsProps) {
  return (
    <div>
      Hello, {name} {mark}
    </div>
  );
}

Greetings.defaultProps = {
  mark: '!'
};

export default Greetings;
```





# Props

> Props는 상위 컴포넌트가 하위 컴포넌트에게 넘겨주는 일종의 변수

- Props 는 property의 줄임말

- 사용시 주의할 특징
  - Props들은 오직 읽기만 가능



## 사용법

1. 부모 component에서 자식 component를 사용하면서, HTML의 attribute처럼 props를 넘겨줌

```js
class App extends React.Component {
  render() {
    return (
      <>
        <FCHello name="Function Component" />
        <CCHello name="Class Component" />
      </>
    );
  }
}
```

2. 자식 컴포넌트에서는 props를 받아서 사용

```js
// 함수기반 컴포넌트
function FCHello(props) {
  return (
    <>
      <h1>Hello {props.name}!</h1>
    </>
  );
}

// 클래스기반 컴포넌트
class CCHello extends React.Component {
  render() {
    return (
      <>
        <h1>Hello {this.props.name}!</h1>
      </>
    );
  }
}
```



## 함수형 컴포넌트에서의 비구조할당

- `<h1>Hello {props.name}!</h1>` 이렇게 접근하는게 길고 복잡하기 때문에 비구조할당 문법을 사용

```js
// 함수기반 컴포넌트
function FCHello({ name }) { // props > {name} 으로 변경
  return (
    <>
      <h1>Hello { name }!</h1> {/* props.name 이 아닌 name으로 접근 */}
    </>
  );
}
```



## defaultProps

- 컴포넌트에 props 를 지정하지 않았을 때 기본적으로 사용 할 값을 설정하고 싶다면 컴포넌트에 `defaultProps` 라는 값을 설정

```js
import React from 'react';

function Hello({ name }) { 
  return <div>안녕하세요 {name}</div>
}

// defaultProps
Hello.defaultProps = {
  name: '이름없음'
}

export default Hello;
```



## props.children

- 컴포넌트 태그 사이에 넣은 값을 조회하고 싶을 땐, `props.children` 을 조회



- 사용해보기

  - 기존 내용을 Wrapper로 감싸서 스타일 적용해보기

  

1. `App.js`

```javascript
import React from 'react';
import Hello from './Hello';
import Wrapper from './Wrapper';

function App() {
  return (
    <Wrapper>
      <Hello name="react" color="red"/>
      <Hello color="pink"/>
    </Wrapper>
  );
}

export default App;
```



2. `Wrapper.js`

```js
import React from 'react';

function Wrapper({ children }) {
  const style = {
    border: '2px solid black',
    padding: '16px',
  };
  return (
    <div style={style}>
      {children}
    </div>
  )
}

export default Wrapper;
```

