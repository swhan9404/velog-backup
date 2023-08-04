---
title: "(번외) react 함수형 컴포넌트 vs 함수형 컴포넌트"
description: "https&#x3A;//overreacted.io/ko/how-are-function-components-different-from-classes/글을 읽고 정리한 내용입니다.리액트에서 함수형 컴포넌트와 클래스의 차이 - 고전적인 답변클래스는 함수형 컴포넌트에 비해 더"
date: 2021-08-11T23:56:50.651Z
tags: ["React"]
---
- https://overreacted.io/ko/how-are-function-components-different-from-classes/
  - 글을 읽고 정리한 내용입니다.



- 리액트에서 함수형 컴포넌트와 클래스의 차이 - 고전적인 답변
  1. 클래스는 함수형 컴포넌트에 비해 더 많은 기능(state와 같은)을 제공한다
     - 리액트에서 Hook을 사용하게 된 이후 기능적차이가 유의미하게 있지는 않다
  2. 성능면에서 어떤 것이 유리하다
     - 성능은 함수냐 클래스냐 보다는 무슨 동작을 하는 코드냐에 따라 영향을 크게 받고, 성능차이가 나더라도 무시할 수 있을 정도로 작았다
- 이 글의 목적
  - 함수형과 클래스는 근본적으로 다르다. 그래서 최적화 전략에서 다른 면을 보인다.
  - 그렇기 때문에 함수형 컴포넌트와 클래스 컴포넌트의 차이를 이해하고 더 잘 사용하자



## 함수형 컴포넌트는 랜더링된 값을 고정시킨다.

- 비교할 예제
  - 버튼 클릭을 하면, 선택한 유저의 이름이 alert로 뜬다.

```js
// 함수기반
function ProfilePage(props) {
  const showMessage = () => {
    alert('Followed ' + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return (
    <button onClick={handleClick}>Follow</button>
  );
}
```



```js
// 클래스기반
class ProfilePage extends React.Component {
  showMessage = () => {
    alert('Followed ' + this.props.user);
  };

  handleClick = () => {
    setTimeout(this.showMessage, 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```



- 언뜻보기에는 완전히 동일한 동작을 할 것 처럼 보여진다
  -  **[live demo](https://codesandbox.io/s/pjqnl16lm7)**

- 테스트 방식
  1. Follow버튼을 **누르고,**
  2. 3초가 지나기 전에 선택된 프로필을 **바꿔라.**
  3. 알림창의 글을 **읽어보자.**
- 차이
  - 함수형 컴포넌트
    - Follow 버튼을 누른 후 Sophie의 프로필로 이동하면 알림창에는 `'Followed Dan'`
  - 클래스형 컴포넌트
    - Follow 버튼을 눌러 똑같이 이동했을 경우엔 알림창에 `'Followed Sophie'`라고 쓰여진걸 볼 수 있다.



### 왜 이런 일이?

- 먼저 알아야할 것 - 클래스 컴포넌트의 작동방식

  - `showMessage`는 `this.props.user`로 부터 값을 불러오는데, Props는 불변의 값(immutable)이다

  - 하지만 `this`는 변경가능하며(mutable), 이를 조작할 수 있다.
    - this의 이런 특성 때문에 리액트가 시간이 지남에 따라 이를 변경할 수 있고, render나 라이프사이클 메서드를 호출할 떄 업데이트 된 값을 읽어올 수 있다.

- 왜 클래스형 컴포넌트에서는 Sophie 로 나오는가?

  - 요청이 진행되고 있는 사황에서 크래스 컴포넌트가 다시 랜더링 된다면 this.props 또한 바뀌는데, showMessage 메서드가 새로운 props의 user를 읽는 것

- 여기서 생각해볼만한 관측요소 - UI 성질

  - UI가 현재 애플리케이션 상태를 보여주는 함수라한다면,
    이벤트 핸들로 또한 시각적 컴포넌트와 같이 랜더링 결과의 한 부분이라는 것
  - 즉, 이벤트 핸들러가 어떤 props와 state를 가진 render에 종속된다는 것이다.

- 하지만, 결과는 종속적이지 않다

  - this.props를 읽는 콜백을 가진 timeout이 사용되면서 그 종속관계가 깨져버림
  - showMessage 콜백은 더이상 어떤 render에도 종속되지 않게 되고, 올바른 props  또한 잃게 되었다.
  - 이것은 모두 this 로 부터 값을 읽어오는 동작이 만들어낸 결과이다.



### 만약 클래스에서 이 문제를 해결하려면?

- 해결책의 개념
  - render와 올바른 props, 그리고 showMessage 사이의 관계를 다시 바로잡아줘야 한다.
  - 코드를 쉽게 쪼갤 수 있으면서, 호출했을 떄의 props와 state를 유지할 수 있는 구조를 찾아야한다.
- 해결책 
  1. this.props를 조금 더 일찍 부르고, timeout 함수에게 미리 저장해놓은 값을 전달하는 방법
     - 잘 동작은 하지만, 이러한 방법은 코드를 복잡하게 만들며 시간이 지날수록 에러에 노출될 가능성이 높아진다.
     - 여러개의 prop에 접근해야하거나 state까지 접근해야하면 코드의 복잡도가 이에 따라 비례해서 증가할 것이다.
     - 무엇보다도, showMessage가 다른 메서드를 부르고 그 메서드가 `this.props.something`이나 `this.state.something`과 같은 코드를 포함해야한다면 또 다시 문제에 부딪히게 될 것이다.
     - 이러한 작성방법은 클래스의 장점을 무새학게 만들고 ,이러한 방법을 기억하거나 컨벤션을 만들어 유지하기 어렵기 때문에 버그가 쉬운 구조가 되는 것이다.



```js
class ProfilePage extends React.Component {
  showMessage = (user) => {
    alert('Followed ' + user);
  };

  handleClick = () => {
    // 여기서 props 에서 값을 미리 가져오고, showMessage에서 매개변수로 저장된 값을 넘겨주는 형태로 바꾸어주었다.
    const {user} = this.props;
    setTimeout(() => this.showMessage(user), 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

2.  alert 코드를 handleClick 안에 넣기
    - 1번과 유사한 이유로 좋은 해결책이 아니다.
3. 자바스크립트의 클로저를 이용한 해결방법
   - 클로저란?
     - 자신을 포함하고 잇는 외부함수보다 내부함수가 오래 유지되는 경우, 외부 함수 밖에서 내부함수가 호출되더라도 외부함수의 지역 변수에 접근할 수 있는 것
     - 클로저는 변환된 내부함수가 자신이 선언되었을 때의 환경(Lexical enviroment)인 스코프를 기억하여, 자신이 선언되었을 때의 환경(스코프) 밖에서 호출되어도 그 환경(스코프)에 접근할 수 있는 함수




```js
// render에서 props 와 state를 클로저로 감싸주는 방법
// 이렇게 하면 클로저 안에 잇는 코드들(showMessage를 포함한)들은 render 당시의 props를 그대로 사용할 수 있다.
class ProfilePage extends React.Component {
  render() {
    // props의 값을 고정!
    const props = this.props;

    // Note: 여긴 *render 안에* 존재하는 곳이다!
    // 클래스의 메서드가 아닌 render의 메서드
    // this.props.user가 아닌 props.user 임을 확인하자
    const showMessage = () => {
      alert('Followed ' + props.user);
    };

    const handleClick = () => {
      setTimeout(showMessage, 3000);
    };

    return <button onClick={handleClick}>Follow</button>;
  }
}
```



- 3번 해결방법은 함수형 컴포넌트와 방식이 유사하다

```react
// class 로 만들었던 것을 function 방식으로 바꿔보자
function ProfilePage({ user }) { // props를 분해한 더 명확한 표현 { user }
  const showMessage = () => {
    alert('Followed ' + user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return (
    <button onClick={handleClick}>Follow</button>
  );
}
```





### 만약 함수형에서 클래스와 같은 동작을 하고싶다면?

- 만약 함수형에서  특정 render에 종속된 것 말고 가장 최근의 state나 props를 읽고 싶다면 어떻게 해야할까?
  - 즉,  render 될 값을 미리 가져와서 쓴다는 개념이다

- 클래스형일 경우

  - this가 변할수 있는 (mutable 한 값) 이기 때문에 `this.props`, `this.state`를 읽어오면 되었다.

- 함수형일 경우

  - `ref`를 사용한다
  - ref는 this처럼 변할 수 있고. 서로 다른 render 끼리 공유할 수 있는 녀석이다.
    - `current`속성이 변경가능하고 클래스의 인스턴스 속성과 유사하게 모든 값을 보유할 수 잇는 일반 컨테이너
  - 하지만, ref는 this와 다르게 직접 관리를 해줘야한다.
    - ref는 클래스의 인스턴스 영역과 [같은 역할](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)을 수행하는데,  함수가 가변적인 성질이 필요할 경우 비상구 역할을 해준다.

- ref를 이용해서 최신값을 유지하는 예시 - handleMessageChange로 ref를 수동변경

  - ref 사용 데모
    - https://codesandbox.io/s/ox200vw8k9

  - ref 사용안한 것 데모
    - https://codesandbox.io/s/93m5mz9w24

```react
// ref 를 사용하면 class처럼 동작하게 할 수 있다.
function MessageThread() {
  const [message, setMessage] = useState(''); // 여기서 message는 input value와 연동되어서 값을 저장하는데 사용한다.
  const latestMessage = useRef(''); // ref 사용

  // 최신값을 쫓아간다
  const showMessage = () => {
    alert('You said: ' + latestMessage.current);
  };

  const handleSendClick = () => { // button onClick에 붙여줄것
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => { // input에 onChange에 붙여줄 것
    setMessage(e.target.value);
    latestMessage.current = e.target.value;
  };

```



```react
// 만약 ref를 안쓰고 했다면 버튼을 누르고 input값을 alert가 뜨기전에 변경한다면 변경된 값으로 alert가 뜨지 않는다.
function MessageThread() {
  const [message, setMessage] = useState('');

  const showMessage = () => {
    alert('You said: ' + message);
  };

  const handleSendClick = () => {
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      <input value={message} onChange={handleMessageChange} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<MessageThread />, rootElement);

```



- ref 사용시 주의할 점

  - ref는 고정된 값이 아니기 때문에 랜더링 도중에 읽거나 쓰는 것을 피하는 것이 좋다.

    (랜더링 내에서는 예측 가능한 일들만 일어나는 것이 권장되기 때문)

  - 하지만, 특정 prop 과 state의 최신 값을 불러오고 싶을 때마다 ref를 수동으로 처리하는 것은 불편하니 Hook의 effect를 이용해 자동화할 수 있다.

- Hook effect를 이용하여 ref 업데이트를 자동화 한 예시

  - [데모](https://codesandbox.io/s/yqmnz7xy8x)
  - 작동방식
    - effect 함수 내부에 DOM이 업데이트 될 때마다 ref 값이 변하도록 설정



