---
title: "python 타입힌트/어노테이션/typing모듈"
description: "파이썬 버전 3.5에 추가됨타입 어노테이션(type annotation) 타입 힌트(type hint)정적 언어에서 볼 수 있는 타입 체킹(type checking) 이 아닌 파이썬의 타입 힌팅(type hinting)동적(dynamic) 프로그래밍 언어인 파이썬에서는"
date: 2021-08-25T07:23:29.019Z
tags: ["python"]
---
# 타입 힌트/어노테이션

- 파이썬 버전 3.5에 추가됨
  - 타입 어노테이션(type annotation) 
  - 타입 힌트(type hint)
- 정적 언어에서 볼 수 있는 타입 체킹(type checking) 이 아닌 파이썬의 타입 힌팅(type hinting)
  - 동적(dynamic) 프로그래밍 언어인 파이썬에서는 인터프리터(interpreter)가 코드를 실행하면서 타입(type)을 추론하여 체크
  - 파이썬에서 변수의 타입(type)은 고정되어 있지 않기 때문에 개발자가 원하면 자유롭게 바꿀 수 있습니다.
- 타입 어노테이션(type annotation)
  - 파이썬 코드의 타입 표시를 표준화합니다. 따라서 코드 편집기(IDE)나 린터(linter)에서도 해석할 수 있도록 고안되었으며, 코드 자동 완성이나 정적 타입 체킹에도 활용



## 변수 타입 어노테이션

먼저 매우 간단한 변수에 타입 어노테이션을 추가하는 방법에 대해서 알아보겠습니다. 변수 이름 뒤에 콜론(`:`)을 붙이고 타입을 명시해주면 됩니다.

```python
name: str = "John Doe"

age: int = 25

emails: list: ["john1@doe.com", "john2@doe.com"]

address: dict = {
  "street": "54560 Daugherty Brooks Suite 581",
  "city": "Stokesmouth",
  "state": "NM",
  "zip": "80556"
}
```



## 함수 타입 어노테이션

함수에 타입 힌탕을 적용할 때는 인자 타입과 반환 타입, 이렇게 두 곳에 추가해줄 수 있습니다.

인자에 타입 어노테이션을 추가할 때는 변수와 동일한 문법을 사용하며, 반환값에 대한 타입을 추가할 때는 화살표(`->`)를 사용합니다.

```python
# 형태
def 함수명(<필수 인자>: <인자 타입>, <선택 인자>: <인자 타입> = <기본값>) -> <반환 타입>:
    ...
    
# 예시
def stringify(num: int) -> str:
    return str(num)

def plus(num1: int, num2: float = 3.5) -> float:
    return num1 + num2

def greet(name: str) -> None:
    return "Hi! " + str

def repeat(message: str, times: int = 2) -> list:
    return [message] * times
```



## 사용자 정의 타입 힌팅

>  내장 타입 뿐만 아니라 사용자 클래스에 대한 타입 어노테이션도 동일한 방법으로 추가할 수 있습니다.

```python
class User:
    타입지정

def find_user(id: str) -> User: # 사용자 정의 타입을 가지고 어노테이션
    내용

def create_user(user: User) -> User:
    내용
```



## 타입 어노테이션 검사

작성한 타입 어노테이션을 검사하고 싶을 때는 `__annotations__` 내장 사전 객체를 사용하면 됩니다.

```python
>>> __annotations__
{'no': <class 'int'>, 'name': <class 'str'>, 'age': <class 'int'>, 'address': <class 'dict'>}
```





# typing 모듈

내장 타입을 이용해서 좀 더 복잡한 타입 어노테이션을 추가할 때는 스탠다드 라이브러리의 typing 모듈을 사용할 수 있습니다.

```python
from typing import List, Set, Dict, Tuple

nums: List[int] = [1]
unique_nums: Set[int] = {6, 7}
vision: Dict[str, float] = {'left': 1.0, 'right': 0.9}
john: Tuple[int, str, List[float]] = (25, "John Doe", [1.0, 0.9])
```





## Final

재할당이 불가능한 변수, 즉 상수에 대한 타입 어노테이션을 추가할 때는 typing 모듈의 `Final`을 사용합니다.

```python
from typing import Final

TIME_OUT: Final[int] = 10
```



## Union

여러 개의 타입이 허용될 수 있는 상황에서는 typing 모듈의 `Union`을 사용할 수 있습니다.

```python
from typing import Union


def toString(num: Union[int, float]) -> str:
    return str(num)
```



## optional

typing 모듈의 `Optional`은 `None`이 허용되는 함수의 매개 변수에 대한 타입을 명시할 때 유용합니다.

```python
def repeat(message: str, times: Optional[int] = None) -> list:
    if times:
        return [message] * times
    else:
        return [message]
```



## callable

파이썬에서는 함수를 일반 값처럼 변수에 저장하거나 함수의 인자로 넘기거나 함수의 반환값으로 사용할 수 있습니다. 
typing 모듈의 `Callable`은 이러한 **함수에 대한 타입 어노테이션**을 추가할 때 사용합니다.

예를 들어, 아래 `repeat` 함수는 첫 번째 매개 변수 `greet`를 통해 함수를 인자로 받고 있는데요. 
매개 변수에 타입 어노테이션 `Callable[[str], str]`를 추가해줌으로써, `str` 타입의 인자를 하나 받고, 결과값을 `str`로 반환하는 함수를 나타내고 있습니다.

```python
from typing import Callable

def repeat(greet: Callable[[str], str], name: str, times: int = 2) -> None:
    for _ in range(times):
        print(greet(name))
        
greet: Callable[[str], str] = lambda name: f"Hi, {name}!"
repeat(greet, "Dale")
>>>Hi, Dale!
>>>Hi, Dale!
```



## Generics

 소위 Generics를 사용하는 것도 가능하다. Java등에서 쓰는 `List<T>`를 아래와 같이 쓸 수 있다. 

TypeVar를 이용하여 제네릭 타입을 선언한다. ( [링크](https://docs.python.org/ko/3/library/typing.html#typing.TypeVar) )

또한, TypeVar에서는 Generics로써 유효한 데이터 형을 한정하는 것도 가능하다.

```python
from typing import Sequence, TypeVar 

T = TypeVar('T') # Declare type variable 

def first(l: Sequence[T]) -> T: # Generic function 
    return l[0]

# Generics로써 유효한 데이터 형을 한정하기 -> str과 bytes 만 허용
from typing import TypeVar 

AnyStr = TypeVar('AnyStr', str, bytes) 

def concat(x: AnyStr, y: AnyStr) -> AnyStr: 
    return x + y

```



###  사용자 정의 Generic types

Generics class로 `MyClass<T>`와 같은 것을 만들고 싶은 경우, 아래와 같이 정의한다.

Generic 은 추상 베이스 클래스를 만들 때 사용됨( [링크](https://docs.python.org/ko/3/library/typing.html#typing.Generic) )

```python
from typing import TypeVar, Generic 

T = TypeVar('T') 

class LoggedVar(Generic[T]): 
    def __init__(self, value: T, name: str, logger: Logger) -> None: 
        self.name = name 
        self.logger = logger 
        self.value = value 
   
	def set(self, new: T) -> None: 
        self.log('Set ' + repr(self.value)) 
        self.value = new 
            
    def get(self) -> T: 
        self.log('Get ' + repr(self.value)) 
        return self.value 
    
    def log(self, message: str) -> None: 
        self.logger.info('{}: {}'.format(self.name message))

        
# 실제 사용예시
from typing import Iterable 

def zero_all_vars(vars: Iterable[LoggedVar[int]]) -> None: 
    for var in vars: 
        var.set(0)

```





# 타입 정적 검사기

> 파이썬 버전 3.5에 추가된 타입 어노테이션(type annotation) 덕분에 파이썬에서도 Mypy와 같은 도구를 통해서 타입 체크가 가능해졌습니다.

1. Mypy

   - 역할
     - type annotation으로 정의된 표준에 따라 변수나 함수에 타입이 명시된 파이썬 코드는 정적 타입 검사기(static type checker)를 통해 코드를 실행하지 않고도 타입 에러를 찾아낼 수 있습니다.

   - 설치
     - `pip install mypy`
   - 타입 검사 실행하기
     - `mypy 실행할파일 혹은 디렉토리명`

   

