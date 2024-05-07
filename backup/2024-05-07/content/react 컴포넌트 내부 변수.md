---
title: "react 컴포넌트 내부 변수"
description: "리액트 컴포넌트에서 다루는 데이터는 props와 state가 있다. (class용 설명)props부모 컴포넌트가 자식컴포넌트에게 주는 값자식 컴포넌트는 props 에서 받아오기만 하고, props를 직접 수정할 수는 없음state 컴포넌트 내부에서 선언한 값내부에서 값"
date: 2021-08-11T05:38:10.109Z
tags: ["React"]
---
# 컴포넌트 내부 변수

- 리액트 컴포넌트에서 다루는 데이터는 props와 state가 있다. (class용 설명)

  - props
    - 부모 컴포넌트가 자식컴포넌트에게 주는 값
    - 자식 컴포넌트는 props 에서 받아오기만 하고, props를 직접 수정할 수는 없음
  - state 
    - 컴포넌트 내부에서 선언한 값
    - 내부에서 값을 변경할 수 있음

  

- 함수형 컴포넌트는 클래스형 컴포넌트와 달리 state, 라이프 사이클을 원래 사용하지 못했다.

  - 하지만, hook을 통하여 이제 함수형 컴포넌트에서도 클래스형 컴포넌트의 행위를 구현할 수 있게 되었다.
  - 이번에는 클래스형 컴포넌트의 state에 해당하는 부분을 hook을 통해 어떻게 구현했는지를 탐구할 것이다.



- 클래스형 컴포넌트의 state를 함수형에서 구현하는 방법들
  1.  `const [ 변수, 변수설정함수] = useState(초기값)` 을 통한 state 구현
      - 화면과 관련된 데이터(변경되는)를 다룰 때 사용 - 바뀔 때마다 리랜더링된다
  2.  `const 변수 = useRef(초기값)` 을 통한 구현
      - 컴포넌트 안에서 조회 및 수정할 수 있는 변수를 관리하는 용도로 사용이 되며, 변수의 값이 바뀐다고 해서 컴포넌트가 리랜더링되지 않는다.
      - 사실, useRef 자체가 단순히 "값"을 저장하는 용도로 만들어진 것이 아니기 때문에, 변수 저장용으로 사용할 수 있는 방식으로써도 사용이 가능하다 정도로 알면된다.
  3.  useReducer 를 통한 구현
      - 컴포넌트의 상태 업데이트 로직을 컴포넌트에서 분리할 수 있음



## useState

>  함수형 컴포넌트에서도 가변적인 상태를 지닐 수 있게해준다.

- 함수형 컴포넌트에 **상태를 부여**하는 함수
- 상태 유지값 state와,state를 갱신해주는 Dispatcher로 구성
  - state에 직접 값을 할당하지 않고, Dispatcher `setState함수`가 state를 변경함
  - state가 변경될시 해당 컴포넌트가 재렌더링됨
- 함수 컴포넌트의 state는 클래스와 달리 객체일 필요는 없고, 모든 타입이 될 수 있다.





- 사용방법
  - `+` 버튼을 누르면 숫자가 올라가고, `-` 버튼을 누르면 숫자가 하락하는 카운터 만들기
  - 핵심요약
    - `const [number, setNumber] = useState(0); `
    - `setNumber(prevNumber => prevNumber + 1);`

```js
import React, { useState } from 'react';

function Counter() {
  // useState 사용으로 변수 선언 및 초기화
  const [number, setNumber] = useState(0); 

  const onIncrease = () => {
    // setNumber 함수를 통한 state 값 변경
    setNumber(prevNumber => prevNumber + 1);
  }

  const onDecrease = () => {
    // setNumber 함수를 통한 state 값 변경
    setNumber(prevNumber => prevNumber - 1);
  }

  // onClick 이벤트에 state 변경 이벤트 바인딩
  return (
    <div>
      <h1>{number}</h1>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </div>
  );
}

export default Counter;
```



- 미세 설명 추가
  - `const [number, setNumber] = useState(0); ` 에서 number가 변하는 값인데 const로 선언할 수 있는 이유는 
    - 구성 요소가 다시 렌더링되면 함수가 다시 실행되어, 새 범위를 만들고 `number` 이전 변수와 아무 관련없는 새 변수를 만들기 때문이다.
    - 즉, `setNumber` 함수는 이전 값을 가지고, 전해받은 callback 함수로 통해 연산을 하여 새롭게 number를 만든다.



### 객체 병합처리

> React는 성능을 위해 `setState()` 호출을 단일 업데이트로 한꺼번에 처리

- setState에 state객체를 전달하여 호출하는 경우, 한번에 여러개의 `setState` 를 호출하면 React는 이것을 하나로 합쳐서 처리한다.

- 이는 JavaScript에서 객체를 "병합"하거나 구성하는 방식과 관련있다. 다음 예시`Object.assign`의 작동처럼 전달 된 객체 중 동일한 키의 객체에 대해선 마지막 객체의 값이 우선된다.

```js
    me = {name : "Justice"};    
    you = {name : "Your name"};    
    we  = Object.assign({}, me, you);
    
    // 마지막 으로 name을 정의한 you의 name이 우선시 된다.
    console.log(we); // {name : "Your name"}
```

- `state`에 대해서도 한번에 여러 번의 `setState`호출시 가장 마지막의 변경 내용을 적용한다. 아래 코드에서 count는 +1+2+3 해서 6이 증가하는 것이 아닌 마지막인 +3 만 증가한다.

```js
const onClick = () => {
    setCount(count + 1);
    setCount(count + 2);
    setCount(count + 3);
    // count = count+ 3 이 실행됨
}
```



### state의 Immutablility(불변성)

> React에서 state는 불변성을 유지해야 한다.

- state는 동적으로 변경되는 값이라면서 불변성을 유지해야 한다니, 의아할 수 있다.
  여기서 불변성은, 메모리 영역에서의 직접적인 변경이 불가능하다는 뜻이다. (재할당은 가능하다)
  - 즉, 새로운 객체를 만들어 재할당하는 것이 바람직하고,
    원래 객체의 값을 변화시키는 것은 좋지 않다.
  - js에서 기본적인 원시 타입은 모두 immutable type이지만, 객체나 배열은 [참조 타입(Reference type)](https://poiemaweb.com/js-immutability)이기 때문에 기본적으로 변경이 가능한 타입이다.
    - 객체에 변수를 저장하면, 실제 값을 저장하는 것이 아니라 개체를 메모리 어딘가에 만들고, 객체의 참조(위치 값)을 저장하게 된다.
    - 객체(배열포함)의 경우 = 를 이용하여 복사하면, 참조 복사(얕은 복사)만 가능하다.
  - 따라서 객체나 배열 타입의 state는 값이 업데이트 될 때 **기존 객체나 배열의 참조 주소가 변경되지 않도록** 주의가 필요하다.
- 이유 
  - 기존 state의 불변성을 지켜주어야만, 리액트 **컴포넌트에서 상태가 업데이트가 됐음을 감지** 할 수 있고 이에 따라 필요한 리렌더링이 진행되기 때문이다.
- immutable을 지키는 방법
  - es6부터는 배열 고차함수, spread operator, 또는 immutable.js 활용과 같은 **immutable data pattern**을 지원하기 시작했다.
  - 다음 예시는 고차함수 filter을 이용하여 기존 배열타입의 상태 불변성을 유지한 방법이다.

```tsx
    // 기존 people 배열엔 영향 없이 새로운 배열을 생성
    const newPeople = people.filter((person) => {
      return person.id !== id;
    });

    setPeople(newPeople);
```





## useRef

> 리랜더링이 필요없는 변수를 담는 방법

- useRef 란?
  - `useRef`는 `.current` 프로퍼티로 전달된 인자(initialValue)로 초기화된 변경 가능한 ref 객체를 반환
  - 본질적으로`useRef`는 `.current` 프로퍼티에 변경 가능한 값을 담고 있는 “상자”와 같습니다.

- 특징
  - useRef는 `.current` 프로퍼티를 통한 변수에 접근
  - 순수 자바스크립트 객체를 생성
  - 변수의 값이 바뀐다고 화면이 다시 랜더링되지 않음
  - useEffect(callback, [])의 callback의 함수는 DOM이 구성되어 있음을 보장하기 때문에액세스 inputRef.current하기에 적합한 위치이다.

- 사용 방법
  - 핵심요약
    - `const counter = useRef(0);`
    - `counter.current += 1;`

```js
function App() {
  const users = [
    {
      id: 1,
      username: 'subin',
      email: 'subin@example.com'
    },
    {
      id: 2,
      username: 'user1',
      email: 'user1@example.com'
    },
    {
      id: 3,
      username: 'user2',
      email: 'user2@example.com'
    }
  ];
    
  // useRef 를 활용하여 변수 생성 및 초기화
  const nextId = useRef(4);
  const onCreate = () => {
    // 배열에 새로운 항복 추가하는 로직 생략
    // 배열에 넣어줄 id 를 위하여 nextId 증가 > immutable 하게 다시 객체를 만드는 것이 아니라 mutable 하게 변화시켜줌 
    nextId.current += 1;
  };
  return <UserList users={users} />;
}
```



### useRef로 setInterval, setTimeout 함수 clear 하기

- setInterval 이나 setTimeout과 같은 함수는 clear 시켜주지 않으면 메모리를 많이 소모한다.

  따라서 함수를 구현하고 컴포넌트가 unmount 될 때나 특정 상황해서 clear 해줄 필요가 있다.

- 예시 작동 방식

  1. `const interval = useRef();`
     - ref 객체를 만들어준다.
  2. `interval.current = setInterval(changeHand, 100);`
     - ref 객체에 setInterval 함수를 넣어준다.
  3. `clearInterval(interval.current);`
     - 컴포넌트가 unmount 될 때 clearInterval을 활용해서 setInterval 함수가 들어있는 ref 객체를 초기화해준다.

```js
const component = () => {
  const interval = useRef();
  
  useEffect(() => { 
    interval.current = setInterval(실행함수, 1000);
    return () => {
      clearInterval(interval.current);
    }
  }, []); 


//  코드 생략
```



### 그거 지역변수로 선언하면 되는거아님?

생각을 해보자. 잘 생각해보면 현재 useRef 로 쓰고 있는 것은 지역변수로 사용하면 되는거 아닌가? 라는 의문이 떠오르게 될 것이다. useRef 가 했던 행동을 지역변수로 만들어보자.

```js
// nextId 를 지역변수로 선언
let nextId = 4;

function App() {
  const users = [
    {
      id: 1,
      username: 'subin',
      email: 'subin@example.com'
    },
    {
      id: 2,
      username: 'user1',
      email: 'user1@example.com'
    },
    {
      id: 3,
      username: 'user2',
      email: 'user2@example.com'
    }
  ];
    
  // 만약 여기다가 nextId를 선언하게 되면 function이 실행될 떄마다 4가 되기 때문에 function 밖에다가 선언한다
  // let nextId=4;
  
  const onCreate = () => {
    // nextId 증가
    nextId += 1;
  };
  return <UserList users={users} />;
}
```



- 의문점이 생긴대로 똑같이 동작한다. 하지만 문제가 있다.

  - 이렇게 선언한 변수는 전역변수 취급이 되기 때문에 함수의 언마운트가 일어나더라도 사라지지 않는다. 그렇기 때문에 다음과 같은 문제가 발생할 수 있다.

    - 메모리 문제
    - 의도치 않은 변수 재할당 문제

    



## useReducer

> useState와 같은 작동을 하는 훅이다. 이 훅을 사용하면, 컴포넌트에서 컴포넌트 상태 업데이트 로직을 분리할 수 있다.

- 컴포넌트 상태 업데이트 로직 분리시 얻을 수 있는 장점

  - 상태 업데이트 로직을 컴포넌트 바깥에서 작성할 수 있다.

    즉, 다른 파일에서 작성 후 불러와서 사용할 수도 있게 된다.

- useReducer의 필수 요소

  - **state**
    데이터, 초기값, 바뀌는 값
  - **이벤트**
    이벤트를 이용하여 state 변경
  - **action** 
    - 수정할 data이고 객체 형식입니다.
    - Type과 data로 구성되었고, action의 이름은 대문자로 표기합니다.
    - Action 하나하나가 redux에 기록이되어 나중에 버그 잡을때 편합니다.
  - **reducer 함수**
    - action을 어떻게 바꾸는지(처리하는지) 나타냅니다.
    - 주로 swtich 이용합니다.
    - 이전 state와 action을 받아서 다음 state를 돌려주는 함수입니다.

- useReducer 사용방법

  - state 값과 dispatch 함수를 받아오게 되는데, 여기서 state 는 현재 가르키고 있는 상태고, dispatch 는 액션을 발생시키는 함수입니다.
  - dispatch(action) 함수 안에 파라미터로 액션 값을 넣으면 리듀서 함수가 호출되는 구조입니다.
  - state를 바꾸기 위해 action을 만들고, 이벤트를 통해 action을 dispatch하여 reducer 함수의 action을 불러와 state 값을 변경합니다. 

```js
//state 초기값 세팅
const initialState = {
  winner: ' ',
}

//export로 모듈화, 변수로 지정, 다른 컴포넌트에서 재사용 가능
export const SET_WINNER = 'SET_WINNER';

//reduce 함수
const reducer = (state, action) => { //state를 어떻게 바뀌는지 코드
  switch (action.type) {
    case SET_WINNER: { //action 이름
      //state.winner = action.winner는 안됨, 새로운 action 객체를 만들어서 바뀐 값만 업데이트
      return {
        // 불변성을 지키면서 업데이트한 새로운 상태를 반환합니다
        ...state, //spread 문법 = 기존 state를 새롭게 얕은 복사(참조) 
        winner: action.winner, //바뀌는 부분
      }
    }
    default:
      return state;
  }
}

//action dispatch(reduce 함수의 해당 action을 실행)
const 컴포넌트 = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
   const onClick 함수 = useCallback(() => {
        dispatch({ type: 'SET_WINNER', winner: 'O'}) //dispatch({ action 객체 })
    //}, []); //하위 컴포넌트에 들어가는 함수는 useCallback() 적용

  return (
  	...
  );
}

export default 컴포넌트;
```

- 추가로 알면 좋은 사실
  - useReducer는 state가 비동기적으로 바뀐다.

