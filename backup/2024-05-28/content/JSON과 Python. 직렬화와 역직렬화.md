---
title: "JSON과 Python. 직렬화와 역직렬화"
description: "Key-value를 양식을 가지는 텍스트 파일Web 서버와 client간의 통신 및 프로그램과 프로그램 사이의 데이터 표현 및 교환하는데 사용되는 사실 상의 표준JSON 파일은 의도적으로 comment를 지원하지 않음(VSCode와 같은 IDE에서 일부 지원하긴 하나,"
date: 2021-10-29T03:34:57.273Z
tags: ["python"]
---
## JSON 이란?

- Key-value를 양식을 가지는 텍스트 파일

- Web 서버와 client간의 통신 및 프로그램과 프로그램 사이의 데이터 표현 및 교환하는데 사용되는 사실 상의 표준

- JSON 파일은 의도적으로 comment를 지원하지 않음(VSCode와 같은 IDE에서 일부 지원하긴 하나, 호환성을 위해 안쓰는 것이 바람직함)

  

## python 과 json 모델 대응

> python 은 json 모듈을 이용하여 json을 직렬화, 역직렬화 하게 된다.

- 문서 [링크](https://docs.python.org/ko/3/library/json.html#:~:text=%EC%9D%B4-,%EB%B3%80%ED%99%98%ED%91%9C,-%EB%A5%BC%20%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC%20obj%EB%A5%BC%20JSON%20%ED%98%95%EC%8B%9D)

| 파이썬                                    | JSON             |
| :---------------------------------------- | :--------------- |
| dict                                      | 오브젝트(object) |
| list, tuple                               | 배열(array)      |
| str                                       | 문자열(string)   |
| int, float, int와 float에서 파생된 열거형 | 숫자(number)     |
| True                                      | true             |
| False                                     | false            |
| None                                      | null             |





## json ➡ dict

`json.loads(json내용)` 을 이용

- fp(JSON 를 포함하는 .read()) 를 지원한느 텍스트 파일이나 바이너리 파일을 파이썬 객체로 역직렬화하고 싶으면 
  `json.load(json파일)`

- parse_float가 지정되면, 디코딩될 모든 JSON float의 문자열로 호출됩니다. 이것은 float(num_str)와 동일합니다.

- parse_int가 지정되면, 디코딩될 모든 JSON int의 문자열로 호출됩니다. 기본적으로 이것은 int(num_str)와 동일합니다

  



## dict ➡ json( str )

json.dumps(dict객체) 을 이용

- 만약 JSON 형식 스트림으로 fp(.write() 를 지원하는 파일류 객체)로 직렬화하고 싶다면
  json.dump(obj) 사용



### 중요옵션

- `ensure_ascii=default(True)` : 출력에서 모든 ASCII가 아닌 문자가 이스케이프 되도록 보장됨. False로 하면 그 문자들이 그대로 출력됨. 이것 안하면 dump 시 한글이 모두 깨짐
- `indent=default(None)` : JSON 배열 요소와 오브젝트 맴버가 해당 들여쓰기 수준으로 이쁘게 인쇄됨 
- `strict=default(True)` : False 일 경우 문자열 안에 제어 문자가 허용됩니다. 이 문맥에서 제어 문자는 0–31 범위의 문자 코드를 가진 것들인데, `'\t'` (탭), `'\n'`, `'\r'` 및 `'\0'`을 포함합니다.



### 주의할점

- JSON의 키/값 쌍에 있는 키는 항상 str
  즉, 딕셔너리를 JSON으로 변환하면 딕셔너리의 모든 키가 문자열로 강제 변환 됨
  그 결과로, 딕셔너리를 JSON으로 변환한다음 다시 딕셔너리로 변환하면, 딕셔너리가 원래의 것과 같지 않을 수 있음. 
  즉, x에 비 문자열 키가 있으면 `loads(dumps(x)) != x`