---
title: "python Enum"
description: "Enum은 열거형(Enumerated Type)이라고 부릅니다. 서로 연관된 상수들의 집합을 의미해당 언어의 상수 역할을 하는 식별자로, 일부 열거자 자료형은 언어에 기본으로 포함되어 있습니다. 그 대표적인 예가 Boolean 자료형파이썬은 2.x대 버전에서는 Enum"
date: 2021-03-07T10:31:36.492Z
tags: ["python"]
---
# Enum이란?

- **Enum**은 **열거형(Enumerated Type)**이라고 부릅니다. 
- **서로 연관된 상수들의 집합을 의미**

- 해당 **언어의 상수 역할을 하는** **식별자**로, 일부 열거자 자료형은 언어에 기본으로 포함되어 있습니다. 
  - 그 **대표적인 예가 Boolean** **자료형**
- 파이썬은 2.x대 버전에서는 Enum이 없었습니다. **Python 3.4**에서 **추가**되었습니다. 해당 소스 코드는 **Lib/enum.py**에 정의되어 있습니다.



# Enum의 사용 방법

- enum 모듈 import

- enum을 상속받는 클래스를 만들기

  -  enum 타입의 상수 인스턴스는 기본적으로 이름(key) 와 값(value)을 속성으로 가짐

- enum 호출하여 사용

  - 얼핏 보면 Key : Value 형식으로 보이지만 딕셔너리가 작동하는 것과는 다릅니다.

    딕셔너리에서는 Key를 호출하면 Value가 나왔지만 **Enum은 HTML 태그의 작동 방식과 더 유사**합니다

  - name 과 value 2가지를 호출할 수 있음

  - 순회가 가능해서 for 문으로 모든 상수를 쉽게 확인할 수 있음

```python
from enum import Enum # Enum 모듈 import

class Rainbow(Enum): # Enum 상속 받는 클래스 만들기
    # enum 타입의 상수 인스턴스는 기본적으로 이름(key) 와 값(value)을 속성으로 가짐
    Red = 0 
    Orange = 1
    Yellow = 2
    Green = 3
    Blue = 4
    Navy = 5
    Purple = 6
    
# Enum 호출방법 2가지
Rainbow['blue']
Rainbow.Blue

# name, value
Rainbow.Blue.name # 'Blue'
Rainbow.Blue.value # 4

# 순회하면서 모든 상수 확인
for color in Rainbow :
    print(color)
"""
Rainbow.Red
...
Rainbow.Purple
"""
```



## 더 나아가기

### 함수형 타입 정의

자주 쓰이는 방법은 아니지만 `Enum` 클래스를 확장하는 대신에 일반 함수처럼 호출을 해서 enum 타입을 정의할 수도 있습니다.

```python
Skill = Enum("abc", "HTML CSS JS")
for skill in Skill :
    print(skill)
"""
abc.HTML
abc.CSS
abc.JS
"""
```



### 값 자동 할당

- enum을 사용할 때, 많은 경우 값(`value`)이 무언인지는 크게 중요하지 않습니다. 
- 이럴 때는 `enum` 모듈의 `auto()` helper 함수를 사용하면, 첫번째 상수에 1, 두번째 상수에 2, 이렇게 1씩 증가시키면서 모든 상수에 유일한 숫자를 값으로 할당해줍니다.
- `auto()` 함수를 사용하면 기존 상수에 어떤 숫자가 할당해놨었는지 구애 받지 않고 새로운 상수를 추가할 수 있는 장점도 있습니다.
- 뿐만 아니라, `Enum` 클래스의 `_generate_next_value_()` 메서드를 오버라이드(override)하면 숫자가 아닌 다른 값을 자동 할당할 수 있습니다. 예를 들어, 상수의 이름과 동일한 문자열을 상수의 값으로 자동 할당할 수 있습니다.

```python
from enum import Enum, auto

class Skill(Enum):
    HTML = auto()
    CSS = auto()
    JS = auto()
    
list(Skill)
# [<Skill.HTML: 1>, <Skill.CSS: 2>, <Skill.JS: 3>]

#### _generate_next_value_() 사용
from enum import Enum, auto

class Skill(Enum):
    def _generate_next_value_(name, start, count, last_values):
        return name

    HTML = auto()
    CSS = auto()
    JS = auto()
   
list(Skill)
# [<Skill.HTML: 'HTML'>, <Skill.CSS: 'CSS'>, <Skill.JS: 'JS'>]
```



### enum mixin

- enum 타입을 사용할 때 한 가지 불편할 수 있는 점은 상수의 이름이나 값에 접근할 때 `name`이나 `value` 속성을 사용해야 한다는 것입니다.

- 왜냐하면 모든 상수는 결국 해당 enum 타입의 인스턴스이기 때문입니다. 하지만 enum 타입을 사용해서 코딩을 하다보면, 매번 `name`이나 `value`를 사용하는 것이 귀찮고 까먹기도 싶습니다.

  이럴 때는 enum mixin(믹스인) 기법을 활용하여 `str`을 확장하는 enum 클래스를 작성합니다.

```python
#### 상수의 형태는 인스턴스다
Skill.HTML.name == 'HTML' # True
Skill.HTML.value == 1 # True
Skill.HTML == 'HTML' # False  - 불편
type(Skill.HTML) # <enum 'Skill'>

#### 믹스인 기법 활용
class StrEnum(str, Enum):
    def _generate_next_value_(name, start, count, last_values):
        return name

    def __repr__(self):
        return self.name

    def __str__(self):
        return self.name
    
class Skill(StrEnum):
    HTML = auto()
    CSS = auto()
    JS = auto()
    
Skill.HTML == 'HTML' # True # Skill.HTML.value로 접근안해도되게됨
isinstance(Skill.HTML, str) # True # 상수를 문자열로 취급하여 좀더 편해짐
```



### Enum 확장

- `Enum` 클래스는 다른 일반 클래스처럼 다양하게 확장해서 활용할 수 있습니다.

```python
from enum import Enum

class Skill(Enum):
    HTML = ("HTML", "Hypertext Markup Language")
    CSS = ("CSS", "Cascading Style Sheets")
    JS = ("JS", "JavaScript")

    def __init__(self, title, description):
        self.title = title
        self.description = description

    @classmethod
    def get_most_popular(cls):
        return cls.JS

    def lower_title(self):
        return self.title.lower()
    
    
Skill.HTML.value # ('HTML', 'Hypertext Markup Language')
Skill.HTML.title # 'HTML'
Skill.HTML.description # 'Hypertext Markup Language'
Skill.get_most_popular() # <Skill.JS: ('JS', 'JavaScript')>
Skill.CSS.lower_title() # 'css'

```



# Enum은 왜 쓸까?

- 특정 상태를 **하나의 집합으로 만들어** **관리**함으로써 코드를 정리하는데 수월합니다.
- 즉, **가독성**이 높아지고 **문서화**를 하는데 도움이 됩니다.



# 만약 python 3.4 이전 버전에서 쓰고 싶다면?

- Enum을 직접 함수로 만들어 사용하는 것입니다!

```python
def myEnum(*sequential, **named):
    enums = dict(zip(sequential, range(len(sequential))), **named)
    return type('Enum', (), enums)

Rainbow = myEnum('Red','Orange','Yellow','Green','Blue','Navy','Purple')
Rainbow.Red # 0

```



