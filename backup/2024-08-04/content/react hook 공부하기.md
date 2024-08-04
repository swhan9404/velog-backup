---
title: "react hook 공부하기"
description: "Hook 이 뭐야?함수 컴포넌트에서 React state와 생명주기 기능(lifecycle)을 연동(hook into)할 수 있게 해주는 함수입니다.Hook은 class안에서는 동작하지 않지만, class없이 react를 사용할 수 있도록 해준다.Hook이 지켜야할 규"
date: 2021-08-12T04:58:38.634Z
tags: ["React"]
---
- Hook 이 뭐야?
  - 함수 컴포넌트에서 React state와 생명주기 기능(lifecycle)을 연동(hook into)할 수 있게 해주는 함수입니다.
  - Hook은 class안에서는 동작하지 않지만, class없이 react를 사용할 수 있도록 해준다.

- Hook이 지켜야할 규칙
  - 최상위에서만 Hook을 호출해야한다
    - 즉, 반복문이나 조건문 혹은 중첩된 함수 내에서 Hook을 호출하면 안된다.
    - 이 규칙을 따라야만, 컴포넌트가 렌더링 될 떄 항상 동일한 순서로 Hook이 호출되는 것이 보장된다
  - 다음 2가지 경우에만 Hook을 호출해야한다.
    - React 함수 컴포넌트
    - Custom Hook



# useEffect

> 클래스컴포넌트의 라이프사이클은 컴포넌트 중심으로 맞춰져 있다면,  함수컴포넌트는 데이터의 변화에 중심적으로 훅이 작동한다.

- 구조
  - `useEffect(업데이트함수, 의존성배열)`
  - 업데이트 함수는 컴포넌트가 첫 렌더링 될 때 한 번 실행되고,
    그 다음부터는 의존성배열에 담긴 변수가 변할 때마다 실행된다.
  - 업데이트 함수의 return 은 컴포넌트가 언마운트될 때 작동한다.
- 의존성 배열
  1. 작성하지 않으면, **default로 컴포넌트가 re-render될때마다** effect를 수행한다.
  2. 변수가 담긴 배열을 작성하면, 해당 **배열의 값들이 변할 때만** effect가 수행된다.
  3. 빈 배열을 작성하면, **처음 렌더링 후에만** effect가 수행된다.
     - prop이나 state에 의존하지 않으므로 재실행되어야 할 필요가 없음을 명시하는 것
- 클래스 컴포넌트 라이프사이클과 비교
  - 업데이트함수  = componentDidMount와 componentDidUpdate
    - componentDidUpdate 만 수행하고 싶다면 useRef 훅이 필요하다.
  - 업데이트함수의 return = componentWillUnmount
  - componentWillMount와 componentWillUpdate 해당 없음
- 사용 예시
  - `console.log('hidden changed');` 
    - 컴포넌트가 첫 렌더링될 때 한 번 실행
    - 그 다음부터는 hidden이 바뀔 때마다 실행
  - `console.log('hidden이 바뀔 예정입니다.');`
    - 컴포넌트가 언마운트 될 때 실행

```js
useEffect(() => {
  console.log('hidden changed');
  return () => {
    console.log('hidden이 바뀔 예정입니다.');
  };
}, [hidden]); 
```



## UseRef를 통해 componentDidUpdate 처럼 쓰는 법

```js
import React, { useEffect, useRef } from 'react';

const Basic = () => {
  // 초기값을 false로 놓기
  const mountRef = useRef(false);
  
  // mounted 되면 mountRef가 True로 바뀌고, 재랜더링이 될 때는 mountRef가 True이기 때문에 작동시킬 로직을 작동시킬 수 있음
  useEffect(() => {
    if (mountRef.current) {
      // 작동할 로직
      console.log('updated!');
    } else {
      mountRef.current = true;
    }
  });
  return <div>Basic</div>;
};
export default Basic;  
```



## clean-up function

- clean-up function 이란?
  - useEffect의 **return 값으로 clean up 함수** (기존의 effect를 해지) 작성
  - 보통, 메모리 누수가 발생하지 않도록 하기 위하여 사용됨
  - 일반적으로 clean up이 필요하지 않는 effect (네트워크 리퀘스트, DOM 수동 조작, 로깅 등)은 return 값을 명시하지 않음
- effect를 정리(clean-up)하는 시점
  - 리액트는 **컴포넌트가 마운트(실제 DOM삽입) 해제되는 때**에 정리 함수를 실행한다.
  - 즉, **다음 차례의 effect를 실행하기 전에** 이전의 렌더링에서 파생된 effect를 정리한다.

- 정리(clean-up)가 필요한 Effects
  - 이벤트 리스너가 계속 추가되는 경우
  - 외부 데이터를 fetch하는 경우
    의존성 배열에 빈 배열을 인자로 넣음으로써 처음 랜더링할때만 수행하도록 해결할 수도있지만, 의존성이 있는 경우 사용할 수 없음

- 빈 배열로도 메모리 누수가 해결되지 않는 경우
  - 예시) toggle 기능으로 컴포넌트가 계속 새로 렌더링 되는 경우, 불필요한 이벤트 리스너가 계속 생성될 수 있다. clean up 함수를 반환하여 이전 effect를 정리하도록 하게 해야 한다.

```js
    useEffect(() => {
      window.addEventListener("resize", checkSize);

      return () => {
        window.removeEventListener("resize", checkSize); //다음 useEffect 호출시 다음 useEffect 실행 직전에 실행됨
      };
    }, []);
```



# useRef

- 역할
  - DOM 을 직접 선택해야 하는 상황에 DOM 노드를 저장하는 데 사용
  - 화면 리랜더링과 관련없는 컴포넌트의 데이터를 저장할 때 사용
- 특징
  - useRef로 생성한 데이터는 리랜더링의 여부와 상관없이 같은 값이 유지
  - useRef로 만들어진 데이터는 선언한 변수로 접근하는 것이 아닌, `변수.current`로 접근해야함 
- 공식문서에서 권장하는 Ref의 바람직한 사용 사례
  - 포커스, 텍스트 선택영역, 혹은 미디어의 재생을 관리할 때
  - 애니메이션을 직접적으로 실행시킬 때
  - 서드 파티 DOM 라이브러리를 React와 같이 사용할 때.



## DOM 노드를 저장 예제

- 작성 방법
  1. 저장해야할 DOM 노드의 html 태그에 ref={ref명}을 달아줌
  2. 컴포넌트에서 `useRef`를 통해 ref 변수 선언
  3. `ref변수.current` 를 통하여 저장한 DOM노드를 사용하기

```js
import React, { useState, useRef } from 'react';

function InputSample() {
  const [inputs, setInputs] = useState({
    name: '',
    nickname: ''
  });
  // ref 선언
  const nameInput = useRef();

  const { name, nickname } = inputs; 

  const onChange = e => {
    const { value, name } = e.target; 
    setInputs({
      ...inputs, 
      [name]: value 
    });
  };

  const onReset = () => {
    setInputs({
      name: '',
      nickname: ''
    });
    // ref 를 통해서 focus 이동시키기
    nameInput.current.focus();
  };

  // html 태그에 ref={ref명}을 달아줌
  return (
    <div>
      <input
        name="name"
        placeholder="이름"
        onChange={onChange}
        value={name}
        ref={nameInput}
      />
      <input
        name="nickname"
        placeholder="닉네임"
        onChange={onChange}
        value={nickname}
      />
      <button onClick={onReset}>초기화</button>
      <div>
        <b>값: </b>
        {name} ({nickname})
      </div>
    </div>
  );
}

export default InputSample;
```



### form 컴포넌트에서의 사용

> 대부분 경우에 React에서 폼을 구현하는데 제어 컴포넌트를 사용하는 것이 좋습니다.

- form 컴포넌트는 제어(state 사용) or 비제어(ref 사용) 방식으로 입력값을 얻을 수 있다.
  - **제어 컴포넌트** : React에 의해 값이 제어되는 입력 폼 엘리먼트
  - **비제어 컴포넌트** : DOM 자체에서 폼 데이터가 다뤄짐
    - target DOM에 접근하여 원하는 이벤트를 달 수 있음

```js
  // 제어 컴포넌트 - state
  const [state, setState] = useState("");
   
  // input 값 변경에 따른 state 값 변경
  const handleChange = (event) => {
      setState(event.target.value);
  }

  // submit 버튼 클릭을 통한 state 값 console 로 출력
  const handleSubmit = (event) => {
      event.preventDefault();
      console.log(state);
  }
  
  // 컴포넌트가 mounted가 되고 나면 target DOM에 focus 이벤트 넣기
  useEffect(() => {
      refContainer.current.focus();
  });

  return (
    <form className="form" onSubmit={handleSubmit}>
        <input type="text" ref={refContainer} value={state} onChange={handleChange}>
    </form>
  )
```







## 컴포넌트의 데이터를 저장

- [이전글 참조](https://velog.io/@swhan9404/%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EB%82%B4%EB%B6%80-%EB%B3%80%EC%88%98)



## 어떨 때 ref를 유용하게 사용할 수 있을까?

- ref를 꼭 사용해야하는 경우는 많지않다. 될 수 있으면 props나 state를 고정시키는 것이 좋다.

- 하지만,

  1. interval이나 subscription 같은 명령형 API를 다룰 때 ref는 유용하게 사용할 수 있다.

     - props. state, 함수까지 어떤 값이든 ref를 통해 고정시켜둘 수 있다.

  2. ref를 이용하여 패턴 최적화(userCallback이 자주 바뀔 때)

     - 하지만 이럴 때는 reducer를 쓰는 것이 더 나은 해결책이 될 수도 있다.

     





# useContext

- context 란?

  - context는 React 컴포넌트 트리 안에서 전역적(global)이라고 볼 수 있는 데이터를 공유할 수 있도록 고안된 방법

- 작동방식

  1. createContext 내부에 공유하길 원하는 데이터의 초깃값을 넣어두고 value 변수로 묶고, export const 로 외부에서 접근이 가능하도록 export 하기

     `export const 변수 = createContext({ ... })`

  2. value 객체는 객체이므로 리렌더링의 주범이 되므로 useMemo로 캐싱하기

     - 이거 안하면, 컴포넌트가 리랜더링될 때 데이터를 쓰는 모든 컴포넌트가 매번 리랜더링하게 됨

  3. context값을 사용할 자식컴포넌트들을 `<createContext로만든변수.Provider value={useMemo로저장한value값}>` 으로 감싸기

     - provider는 context를 구독하는 컴포넌트들에게 context의 변화를 알리는 역할을 수행한다.

  4. context값을 사용할 컴포넌트에서 `useContext(createContext로만든변수)`  로 값을 불러오고 사용하기

```js
// context를 만드는 GrandParent
import React, { createContext, useMemo, useState } from 'react';
import Parent from './Parent';

// createContext 로 context 생성
export const UserContext = createContext({
  setLoggedIn: () => {},
  setLoading: () => {},
});

const GrandParent = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  // context 를 사용하는 컴포넌트들이 GrandParent가 리랜더링 될때마다 랜더링되지 않도록 하기 위해 useMemo 사용
  const value = useMemo(() => ({ setLoggedIn, setLoading }), [setLoggedIn, setLoading]);
  
  // UserContext.Provider 로 감싸서 내부의 컴포넌트들이 context 사용할 수 있도록 하기
  return (
    <UserContext.Provider value={value}>
      <Parent />
    </UserContext.Provider>
  );
};
export default GrandParent;
```

```js
// 아무것도 안하고 children 을 불러오는 Parent 요소
import React from 'react';
import Children from './Children';

const Parent = () => {
  return <Children />;
};
export default Parent;
```


```js
// context 값을 가져와서 쓰는 Children

import React, { useContext } from 'react';
import { UserContext } from './GrandParent';

const Children = () => {
  // GrandParent의 Context 불러오기
  const { setLoading, setLoggedIn } = useContext(UserContext);
  
  // GrandParent의 Context 값 사용하기
  return (
    <>
      <button onClick={() => setLoading((prev) => !prev)}>로딩토글</button>
      <button onClick={() => setLoggedIn((prev) => !prev)}>로딩토글</button>
    </>
  );
};
export default Children; 
```



- 사용시 주의해야할 사항
  -  Provider에 제공한 value가 달라지면 useContext를 쓰고 있는 모든 컴포넌트가 리렌더링 된다는 것
     - value 내부의 값 하나라도 바뀌면 객체로 묶여있으므로 전체가 리랜더링 되는 것
     - 이로 인해서 잘못쓰면 엄청난 렉을 유발할 수 있음
     - 해결을 위해서는 자주 바뀌는 값을 별도의 컨텍스트로 묶거나(컨텍스트는 여러개 쓸 수 있고, Provider로만 잘 감싸주면됨) 
       자식 컴포넌트들을 적절히 분리해서 shouldComponentUpdate, PureComponent, React.memo 등으로 감싸주는 방법이 있다.



# 메모이제이션 hook

- function 컴포넌트는 랜더링이 일어날 떄마다 내부에 선언된 함수나 변수를 새로 생성한다.
- 이렇게 되면, 불필요한 메모리를 낭비하고, 최적화에도 좋지 않게되는데, useCallback이나 useMemo같은 캐싱을 해주는 hook을 통하여 성능 최적화를 하게된다.

- 주의점
  - 이를 사용하는 코드와 메모리제이션 용 메모리가 추가로 필요하게 되므로 적절하게 사용해야한다.



## useCallback

> 함수형 컴포넌트 내부에서 쓰이는 함수를 메모이제이션(memoization)하기 위해 사용되는 hook

- `const memoizedCallback = useCallback(함수, 의존성배열);`
  - 첫번째 인자 : 캐싱할 함수
  - 두번째 인자 : 의존성배열
    - 배열에 들어있는 값이 변하면 함수를 다시 선언한다.



```js
function Component() {
  const [count, setCount] = React.useState(0)
  // useCallback 사용
  const handleClick = React.useCallback(
    () => console.log('clicked!'),
  []) 

  return (
    <>
      <button onClick={() => setCount(count + 1)}>카운트 올리기</button>
      <button onClick={handleClick}>클릭해보세요!</button>
    </>
  )
}
```





### 왜쓰는거야?

- 성능상의 이슈?
  - 사실 컴포넌트가 랜더링될 때마다 함수를 새로 선언하는 것은 자바스크립트가 브라우저에서 얼마나 빨리 실행되는지를 생각해보면 성능 상 큰 문제가 되지 않습니다.
  -  단순히 컴포넌트 내에서 함수를 반복해서 생성하지 않기 위해서 `useCallback()`을 사용하는 것은 큰 의미가 없거나 오히려 손해인 경우도 있다.
- 자바스크립트에서 함수의 동등성
  - 자바스크립트에서는 함수 간의 동등성( `===` )을 취급할 때 하는 행위가 완전히 동일하더라도, 함수 자체가 객체로 취급되기 때문에 메모리 주소에 의한 참조비교가 일어난다.
  - 이 특성은, React 컴포넌트 함수 내에서 어떤 함수를 다른 함수의 인자로 넘기거나 자식 컴포넌트의 prop 으로 넘길 때 예상치 못한 성능 문제로 이어질 수 있다.



## useMemo

> 함수형 컴포넌트 내부에서 쓰는 연산이 필요한 변수를 메모이제이션(memoization)하여 연산을 최적화한다.



- `const memoized = useMemo(값을반환하는함수, 의존성배열);`

  - 값을 반환하는 함수

    - 원래 값을 계산하던 함수를 넣어준다

    - 하지만, 매개변수를 넣어줄 수 없기떄문에 `() =>  값을반환하는함수(매개변수)`

      꼴로 넣어준다.

  - 의존성 배열

    - 배열에 들어가 있는 값이 변하면 다시 계산된다.
    - 보통 값을반환하는함수의 매개변수들이 들어가게 된다.



### 사용예시

- 현재 예시에는 useMemo를 사용하는 방법에만 집중했기 때문에, 재랜더링이 일어나는 경우가 빠져 있는데, 
  재랜더링이 일어나는 경우를 추가해서 console.log를 확인하면, 
  useMemo를 사용하지 않을경우 재랜더링이 일어날 때마다  '80점 이상 점수 세기' 로그가 찍히지만,
  useMemo를 사용할 경우, 처음 랜더링 될때랑, scores가 변화할 때만 '80점 이상 점수 세기' 로그가 찍히는 것을 확인할 수 있다.

```js
// 계산된 값을 반환하는 함수 선언
function countHighScores(scores) {
  console.log('80점 이상 점수 세기');
  return users.filter(score => score>=80).length;
}

function App() {
  // 사용할 매개변수
  const [scores, setScores] = useState([60, 70, 90, 100, 50]);
    
  // useMemo를 통한 결과값 캐싱
  const count = useMemo(() => countHighScore(scores), [scores]);
  return (
    <>
      <div>80 점 이상 점수 : {count}</div>
    </>
  )
```



# Custom Hook

> 컴포넌트를 만들다보면, 반복되는 로직이 자주 발생되는데, 커스텀 Hook을 만들어서 반복되는 로직을 쉽게 재사용할 수 있다.

- Custom Hook이란?
  - 이름이 use로 시작하는 자바스크립트 함수
    - 이름이 반드시 use로 시작해야하는데 그래야만 Hook 규칙이 적용되는지 파악할 수 있기 때문( 안쓰면 Hook 규칙 위반 여부를 자동으로 체크할 수 없음 )
- 알아야할 사항
  1. 이름이 반드시 use로 시작
     - 안쓰면 Hook 규칙 위반 여부를 자동으로 체크할 수 없음
  2. 같은 Hook을 사용하는 두 개의 컴포넌트는  state를 공유하지 않음
     - custom hook 안에 들어 있는 state와 effect는 완전히 독립적
     - custom hook 을 직접적으로 호출하기 때문에 React 관점에서 custom hook을 사용하는 컴포넌트는 hook들을 직접호출한 것과 다름이 없다.

- 사용해보기

```js
// custom hook으로 만들기
import { useReducer } from 'react';

function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value
  };
}

// custom hook만들고 export default 해주기 - 매개변수는 props
export default function useInputs(initialForm) {
  const [state, dispatch] = useReducer(reducer, initialForm);
  const onChange = e => {
    dispatch(e.target);
  };
  return [state, onChange];
}
```



```js
// 기존에 hook을 쓰던 컴포넌트를 custom hook으로 대체
import React from 'react';
import useInputs from './useInputs';

/* useInputs 로 이동
function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value
  };
}
*/
const Info = () => {
  /*  useInputs로 대체됨에 따라 변경
  const [state, dispatch] = useReducer(reducer, {
    name: '',
    nickname: ''
  });
  */
  const [state, onChange] = useInputs({
    name: '',
    nickname: ''
  });
  const { name, nickname } = state;

  return (
    <div>
      <div>
        <input name="name" value={name} onChange={onChange} />
        <input name="nickname" value={nickname} onChange={onChange} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임: </b>
          {nickname}
        </div>
      </div>
    </div>
  );
};

export default Info;
```

