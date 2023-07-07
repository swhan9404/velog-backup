---
title: "duck typing"
description: "동적 타이핑의 한 종류객체의 변수 및 메소드의 집합이 객체의 타입을 결정하는 것을 말함클래스 상속이나 인터페이스 구현으로 타입을 구분하는 대신, 객체가 어떤 타입에 걸맞는 변수와 메소드를 지니면 객체를 해당 타입에 속하는 것으로 간주함유래덕테스트만약 어떤 새가 오리처럼"
date: 2022-01-20T13:39:02.500Z
tags: ["기술 및 용어"]
---
# 덕 타이핑이란?

- 동적 타이핑의 한 종류
- 객체의 변수 및 메소드의 집합이 객체의 타입을 결정하는 것을 말함
  - 클래스 상속이나 인터페이스 구현으로 타입을 구분하는 대신, 
  - 객체가 어떤 타입에 걸맞는 변수와 메소드를 지니면 객체를 해당 타입에 속하는 것으로 간주함
- 유래
  - 덕테스트
    - `만약 어떤 새가 오리처럼 걷고, 헤엄치고, 꽥꽥거리는 소리를 낸다면 나는 그 새를 오리라고 부를 것이다.`
- 무엇에 중심을 두었는가?
  - 객체의 타입보다는 객체가 사용되는 양상이 더 중요


## 예시

> `whoAmI`와 `talk` 메소드를 가진 `People` 객체 만들기 

### 덕 타이핑이 없는 프로그래밍 언어

    1. 오리 타입의 객체를 인자로 받음
    2. 객체의 `걷기` 메소드와 `꽥꽥거리기` 메소드를 차례로 호출하는 함수를 만듬

```java
/* package whatever; // don't place package name! */

import java.util.*;
import java.lang.*;
import java.io.*;

/* Name of the class has to be "Main" only if the class is public. */
class Ideone
{
	public interface People {
	    String whoAmI = "People";
	    void talk();
	}
	
	public static class Human implements People {
		String whoAmI = "Human";
		public void talk() {
		    System.out.println(whoAmI);
		}
    }	
    
    public static class Robot {
    	String whoAmI = "robot";
    	public void talk() {
    		System.out.println(whoAmI);
    	}
    }
    
    public static void startTalk(Human human){
    	human.talk();
    }

	public static void main (String[] args) throws java.lang.Exception
	{
		Human human = new Human();
		Robot robot = new Robot();
		
		startTalk(human);
		startTalk(robot); // 에러 발생(error: incompatible types)
		
	}
}
```

위의 코드는 [여기](https://ideone.com/3bmoWV) 에서 볼 수 있다.


### 덕 타이핑 언어(typescript)

    1. 객체에 `whoAmI`와 `talk` 메소드를 만듬
    2. 만약 `whoAmI`와 `talk` 메소드를 호출할 시점에 객체에 두 메소드가 없다면 런타임 에러가 발생

    - 즉, 객체가 `걷기` 메소드나 `꽥꽥거리기` 메소들르 가지고 있다면 `People` 객체로 간주하겠다는 암시가 깔려있음


```typescript
// typescript 로 만든 예시

interface People {
    talk(): void;
    whoAmI: string;
}

class Human implements People {
    whoAmI = "human"
    talk = () => {
        console.log(`say ${this.whoAmI} : 말할 수 있어요`);
    }
}

class Robot {
    whoAmI = "robot"
    talk  = () => {
        console.log(`say ${this.whoAmI} : 말할 수 있어요`);
    }
}

const humanInstance = new Human(); 
const robotInstance = new Robot();

function startTalk(people: People): void {
    people.talk();
}

startTalk(humanInstance); // --- 1) "say human : 말할 수 있어요"
startTalk(robotInstance); // --- 2) "say robot : 말할 수 있어요"
```

- `startTalk(robotInstance)` 에서 분명히 에러가 날 것 같지만 typescript의 duck typing으로 인해 에러가 나지 않는다.

(위의 코드는 [Typesrcipt playground](https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgAoQPYAcA2KDeAUMicmHDgNYAUAlAFzIBuGwAJgNzGkDuAFhgCCAWwCSjAM5gooAOZcAvoUIIccCROQAJAK7C4IZMGG4IwiOE3pseZEVLJ+QscgC8yAER89Bj9xLkVG7IdG4AfHb+DsgIGCASGHgAdDgYstQABhJwAJ7IACT4YHzAEklOIqIKyIyAC52ABqvIgBhDyIAR44Ato4ApYxm0XA5KSipqGsgAShgARhhgkQ4VLu4eUJPTfg6BlCTuoa4R9tEksfGJEClpmdl5hcWl5QKV1XWNLR3dvVEDykdSyN76IKJ4uQQEhgiAIDxtD4QHQOMgVHEfsspmBAVIDKD3ODIeMUbDlDAdCCwMA4sh0VAwAAVCg0LCYUyMaymBjMVhsWakek2U4bfGDCnU2nUP4GNHApDvQU0qjUZHTcUYiDvEhAA) 에서도 확인 가능하다!)



- 타입스크립트는 
  - 정적타이핑 : 컴파일 단계에서 타입검사
  - 동적타이핑 : 객체의 형태가 컴파일 단계에서 결정됨
  - 2가지 특성을 전부 가지고 있다.

- 다형성
  - 정적 다형성 : 어떤 객체의 형태가 컴파일 단계에서 결정
  - 동적 다형성 : 어떤 객체의 형태가 런타임 단계에서 결정
- 보통 객체 지향 언어에서 밑처럼 부른다.
  - 정적 다형성 : overloading
    - 동일한 함수이름을 가지더라도, 해당 함수가 가지는 파라미터들의 개수, 타입, 순서가 다를 경우 컴파일러가 다른 함수로써 인식하는 것을 의미
  - 동적 다형성 : overriding 
    - 동일한 함수와 파라미터 특성을 지닌, 상속 관계에 있는 클래스들의 맴버 함수에 대해서 외형적으로 호출되는 타입에 상관없이 생성된 객체의 함수가 호출되도록 처리 되는 특성



### 덕 타이핑 예시(python)

```python
class People:
    whoAmI = 'people'
    def talk(self):
        print(f'say {People.whoAmI} : 말할 수 있어요')

class Human:
    whoAmI = 'human'
    def talk(self):
        print(f'say {Human.whoAmI} : 말할 수 있어요')
        
class Robot:
    whoAmI = 'robot'
    def chat(self):
        print(f'say {Robot.whoAmI} : 채팅할 수 있어요')
        

def startTalk(entity):
    entity.talk()
        
people = People()
human = Human()
robot = Robot()


startTalk(people)
startTalk(human)
startTalk(robot) # Throws the error `'robot' object has no attribute 'talk'`
```

- Human 클래스와 People 클래스는 분명 서로 상속되거나 하는 그런 관계는 없다.
  - 하지만 내부의 동일한 메소드의 `talk()` 메소드가 있는 것만으로 호출하는 `startTalk(entity)` 함수에서 `talk()` 가 정상적으로 실행된다.
  - 마지막 Robot 클래스의 경우 해당 `talk()` 메소드가 없기 떄문에, `AttributeError`가 발생한다.
- 즉, 속성과 메소드의 존재에  의해 객체의 적합성이 결정되고 있다.





## 덕 타이핑의 장점

1. 더 적은 코드와 복잡한 상속 구조가 덜 필요하다. 
   - 따로 인터페이스를 지정할 필요 X
   - 사용할 메서드만 작성하면 됨 O
2. 더 복잡한 기능으로 여러 클래스를 만들 떄 이 기능이 빛을 발하는데, Java의 경우 기능이 복잡할 수록 genenric hell과 같은 현상이 일어나는 것과 비교해볼 수 있다.



## 덕 타이핑의 단점

1. 간결함이 의도치 않은 동작을 만들 떄가 있다
   - 즉, 런타임 자료형 오류에 취약하다. 런타임에서 값은 예상치 못한 유형이 있을 수 있고, 그 자료형에 대한 무의미한 작업이 수행될 수 있다.
     - 정적 타이핑 : 타입(data의 형태)을 컴파일 단계에서 결정 
     - 동적 타이핑 : 타입(data의 형태)을 런타임 단계에서 결정  -> 런타임 자료형
   - 어디서 버그가 발생했는지도 상당히 어렵다.
2. 협업에서 해당 메소드가 어디서 어떻게 쓰이는지 잘 알지 못하면 코드가 망가질 수 있다.
3. 컴파일 타임 드엥서 객체의 명세가 충족되었는지 알 수 없기 때문에 , 많은 유닛 테스트로 해당 객체가 정상적으로 작동할 수 있는지 계속 체크해야한다.
   - 이 이유 때문에, 동적으로 정형된 언어의 개발에서는 `단위 테스트`와 같은 테스트가 굉장히 중요하다.

