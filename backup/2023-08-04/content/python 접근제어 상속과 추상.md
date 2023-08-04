---
title: "python 접근제어/ 상속과 추상"
description: "정보 은닉(Information Hiding)의 방식class의 attribute, method에 대한 접근을 제어할 수 있다.private -> protected -> publicprivate: private로 선언된 attribute, method는 해당 클래스에서"
date: 2021-04-08T16:04:34.934Z
tags: ["python"]
---
# 접근제어

## private, protected, public

- 정보 은닉(Information Hiding)의 방식
  - class의 attribute, method에 대한 접근을 제어할 수 있다.
- private -> protected -> public
  - private: private로 선언된 attribute, method는 해당 클래스에서만 접근 가능
  - protected: protected로 선언된 attribute, method는 해당 클래스 또는 해당 클래스를 **상속**받은 클래스에서만 접근 가능
  - public: public으로 선언된 attribute, method는 어떤 클래스라도 접근 가능
- 파이썬에서는 ??
  - java, C++언어 등의 객체지향 언어와 달리, 파이썬에서의 모든 attribute, method는 기본적으로 **public**
  - 즉, 클래스 외부에서 attribute, method 접근 가능 (사용 가능)



## python의 protected

- 파이썬에서는 해당 속성의 앞에 _(single underscore) 를 붙여서 **표시만** 함
- 실제 **제약되지는 않고 일종의 경고 표시로 사용됨**

```python
class Box:
    def __init__(self, width, height, color):
        self._width = width
        self._height = height
        self._color = color

    def get_area(self):
        return self._width * self._height
    
    def _set_area(self, width, height):
        self._width = width 
        self._height = height
        
######## 출력해보기
box = Box(5, 5, "black")
print(box.get_area()) # 25
print(box._width) # 5
box._width = 10
print(box.get_area()) # 50
box._set_area(3, 3) 
print(box.get_area()) # 9 
```



## python 에서의 private

- 파이썬에서는 attribute, method 앞에 __(double underscore)를 붙이면 실제로 해당 이름으로 접근이 허용되지 않음
- 실은 __(double underscore)를 붙이면, 해당 이름이 _classname__해당 속성 또는 메소드 이름 으로 변경되기 때문임

```python
class Box:
    def __init__(self, width, height, color):
        self.__width = width
        self.__height = height
        self.__color = color

    def get_area(self):
        return self.__width * self.__height
    
    def __set_area(self, width, height):
        self.__width = width 
        self.__height = height
        
####### 출력해보기
box = Box(5,5,'black')
square.__set_area(10, 10) # 에러 발생 - no attribute '__set_area'
print(square.__width) # 에러발생 - no attribute '__width'


###### dir로 살펴보기 - 앞에 4줄에 __color -> _Box__color 이런식으로 바뀌어서 저장된 것을 볼 수 있음
dir(box)
"""
['_Box__color',
 '_Box__height',
 '_Box__set_area',
 '_Box__width',
 '__class__',
 '__delattr__',
 '__dict__',
 '__dir__',
 '__doc__',
 '__eq__',
 '__format__',
 '__ge__',
 '__getattribute__',
 '__gt__',
 '__hash__',
 '__init__',
 '__init_subclass__',
 '__le__',
 '__lt__',
 '__module__',
 '__ne__',
 '__new__',
 '__reduce__',
 '__reduce_ex__',
 '__repr__',
 '__setattr__',
 '__sizeof__',
 '__str__',
 '__subclasshook__',
 '__weakref__',
 'get_area']
"""

```



# 상속과 추상

- **추상화(abstraction)**: 여러 클래스에 중복되는 속성, 메서드를 하나의 기본 클래스로 작성하는 작업
- **상속(inheritance)**: 기본 클래스의 공통 기능을 물려받고, 다른 부분만 추가 또는 변경하는 것
  - 이 때 기본 클래스는 부모 클래스(또는 상위 클래스), Parent, Super, Base class 라고 부름
  - 기본 클래스 기능을 물려받는 클래스는 자식 클래스(또는 하위 클래스), Child, Sub, Derived class 라고 부름
- 사용시 이점
  - 코드 재사용이 가능, 공통 기능의 경우 기본 클래스 코드만 수정하면 된다는 장점
  - 부모 클래스가 둘 이상인 경우는 다중 상속 이라고 부름

## 상속



### 관계확인 메서드

#### 상속관계확인 issubclass

```python
# A 클래스가 B 클래스의 자식 클래스인지 확인
issubclass(A, B) # True, False 반환
```

#### 클래스와 객체 관계 isinstance

```python
# a 인스턴스가 A 클래스로 만들어졌는지 확인
isinstance(a, A) # True, False 반환
```



### 메서드 재정의 Override

- 부모 클래스의 method를 자식 클래스에서 재정의(override)
- 자식 클래스에서 **부모 클래스 method를 재정의**함
- 자식 클래스 객체에서는 재정의된 메소드가 호출됨
- 자식 클래스에서 부모 클래스의 메서드와 이름만 동일하면 메서드 재정의가 가능함
  - C++/Java언어 등에서는 메서드와 인자도 동일해야 함

```python
# 클래스 선언
class Person:
    def __init__(self, name):
        self.name = name

    def work(self):
        print (self.name + " works hard")        

class Student(Person):
    def work(self):
        print (self.name + " studies hard")
        
##### 출력
# 객체 생성
student1 = Student("Dave")
# 자식 클래스(Student)의 재정의된 work(self) 호출
student1.work() # Dave studies hard
```



### self 와 super

- super
  - 자식 클래스에서 부모 클래스의 method를 호출할 때 사용
  - super().부모 클래스의 method명
- self
  - self는 현재의 객체를 나타냄
    - self.method명 또는 attribute명 으로 호출함
  - C++/C#, Java언어에서는 this 라는 키워드를 사용함



#### super를 이용한 부모 클래스 매서드 확장

```python
# 클래스 선언
class Person:
    def work(self):
        print('work hard')

class Student(Person):
    def work(self):
        Person.work(self) # 부모 클래스 메서드 호출
        print('Study hard') # 확장된 기능
        
###### 출력
student = Student()
student.work() 
"""
work hard
Study hard
"""
```



## 추상

### 추상클래스 사용하기

- 메서드 목록만 가진 클래스, 상속받는 클래스에서 해당 메서드 구현해야 함
- 예: 게임에서 모든 캐릭터는 공격하기, 이동하기의 공통 기능을 가지고 있음
  - 공통 기능을 추상 클래스로 만들고, 각 세부 기능은 해당 메서드에서 구현하는 것
- 사용법
  - abc 라이브러리를 가져옴 (from abc import * )
    - abs : Abstract Base Classes
  - 클래스 선언시 ( ) 괄호 안에 metaclass=ABCMeta 를 지정
  - 해당 클래스에서 메서드 선언시 상단에 `@abstractmethod` 를 붙여줘야 함

```python
# 추상 클래스 선언하기
from abc import *

class Character(metaclass=ABCMeta):
    @abstractmethod
    def attack(self):
        pass
    
    @abstractmethod
    def move(self):
        pass
    
# 추상 클래스 상속하기
class Elf(Character):
    def attack(self):
        print ("practice the black art")
    
    def move(self):
        print ("fly")
        
class Human(Character):
    def attack(self):
        print ("plunge a knife")
    
    def move(self):
        print ("run")
        
        
###### 실행시키기
character = Character() # 에러 - 추상클래스는 객체로 만들 수 없음
elf1 = Elf()
human1 = Human()

elf1.attack() # practice the black art
elf1.move() # fly
human1.attack() # plunge a knife
human1.move() # run
```



