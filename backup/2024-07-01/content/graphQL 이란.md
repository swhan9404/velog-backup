---
title: "graphQL 이란?"
description: "뷰노 S/W Engineer 요구 사항에서 보게됨https&#x3A;//vuno.recruiter.co.kr/app/jobnotice/view?systemKindCode=MRS2&jobnoticeSn=22288\*\*S/W Engineer 주요 업무\*\*Cloud 기"
date: 2021-03-04T14:12:57.118Z
tags: ["기술 및 용어"]
---
# 왜 궁금하게 되었는가?

- 뷰노 S/W Engineer 요구 사항에서 보게됨

  https://vuno.recruiter.co.kr/app/jobnotice/view?systemKindCode=MRS2&jobnoticeSn=22288

  ** [S/W Engineer 주요 업무]**

  - **Cloud 기반의 Data Collection/Annotation Platform을 개발합니다.**
  - **Deep Learning 모델을 기반으로 의료 SW (Frontend/Backend)를 개발합니다.**
  - 외부 시스템 연동을 위한 Gateway 프로그램을 개발합니다.

  [자격요건]

  - Data Structure, Algorithm, Database, Network, OS 등 Computer Science에 대한 기반 지식을 보유해야 합니다.
  - 최소한 한 가지 이상의 주요 언어에 능통해야 합니다.
  - 원리를 파악하고자 하고 깊이 고민하며 개발하는 분이어야 합니다.
  - 취미로도 개발을 할 정도로 개발을 사랑하는 분이면 너무나 좋습니다.

  [우대사항]

  - 초기 스타트업 재직 경험
  - Python과 Flask에 대한 이해
  - UI/UX 설계 프로세스 참여 경험
  - DICOM, HL7 등 의료관련 표준/가이드라인 이해 및 경험
  - AWS를 활용한 서비스를 개발하고 운영한 경험
  - Restful API 개발 경험
  - React, Angular.js, GraphQL 개발 경험
  - 전자상거래 시스템 구축 경험
  - 다중 플랫폼 개발 경험
  - 상세 기획안 없이도 개발할 수 있는 약간의 기획 감각

# GraphQL

- GraphQL은 페이스북에서 만든 쿼리 언어 

  - Structed Query Language(이하 sql) 와 언어적 구조차이가 큼

  - SQL - 데이터베이스 시스템에 저장된 데이터를 효율적으로 가져오는 것이 목적

    - 주로 백엔드 시스템에서 작성하고 호출

    ``` SQL
    SELECT plot_id, species_id, sex, weight, ROUND(weight / 1000.0, 2) FROM surveys;
    ```

    

  - GQL - 웹 클라이언트가 데이터를 서버로부터 효율적으로 가져오는 것이 목적

    - 주로 클라이언트 시스템에서 작성하고 호출

    ```gql
    {
      hero {
        name
        friends {
          name
        }
      }
    }
    ```

- 서버사이드 gql 어플리케이션은 gql로 작성된 쿼리를 입력으로 받아 쿼리를 처리한 결과를 다시 클라이언트로 돌려줌

  -  HTTP API 자체가 특정 데이터베이스나 플렛폼에 종속적이지 않은것 처럼 마찬가지로 gql 역시 어떠한 특정 데이터베이스나 플렛폼에 종속적이지 않습니다.
  - 일반적으로 gql의 인터페이스간 송수신은 네트워크 레이어 L7의 HTTP POST 메서드와 웹소켓 프로토콜을 활용
  - 필요에 따라서는 얼마든지 L4의 TCP/UDP를 활용하거나 심지어 L2 형식의 이더넷 프레임을 활용 할 수도 있습니다.
  - GraphQL 파이프라인

  ![](../images/files-graphql-pipeline.png)



## REST API와 비교

- REST API는 URL, METHOD등을 조합하기 때문에 다양한 Endpoint가 존재 합니다.
  -  반면, gql은 단 하나의 Endpoint가 존재
  - 따라서, gql API를 사용하면 여러번 네트워크 호출 필요 없이, 단 한번의 네트워크 호출로 처리가 가능함
  
- REST API에서는 각 Endpoint마다 데이터베이스 SQL 쿼리가 달라집니다.
  
  (API 를 작성할 때 이미 정해놓은 구조로만 응답이 오게 되는 것이다.)

  - 반면, gql API는 gql 스키마의 타입마다 데이터베이스 SQL 쿼리가 달라집니다.
  
    (반면, GraphQL 은 사용자가 응답의 구조를 자신이 원하는 방식으로 바꿀 수 있다.)
  
  - gql API에서는 불러오는 데이터의 종류를 쿼리 조합을 통해서 결정
  
- HTTP와 gql 기술스택 비교

  ![](../images/files-graphql-stack.png)

- REST API와 GraphAPI 사용

  ![](../images/files-graphql-mobile-api.png)



### 이러한 차이로 생기는 장단점

GraphQL 은 다음과 같은 장점을 가진다.

1. HTTP 요청의 횟수를 줄일 수 있다.
   - RESTful 은 각 Resource 종류 별로 요청을 해야하고, 따라서 요청 횟수가 필요한 Resource 의 종류에 비례한다.
     반면 GraphQL 은 원하는 정보를 하나의 Query 에 모두 담아 요청하는 것이 가능하다.
2. HTTP 응답의 Size 를 줄일 수 있다.
   - RESTful 은 응답의 형태가 정해져있고, 따라서 필요한 정보만 부분적으로 요청하는 것이 힘들다.
     반면 GraphQL 은 원하는 대로 정보를 요청하는 것이 가능하다.



GraphQL 은 다음과 같은 단점을 가진다.

1. File 전송 등 Text 만으로 하기 힘든 내용들을 처리하기 복잡하다.
2. 고정된 요청과 응답만 필요할 경우에는 Query 로 인해 요청의 크기가 RESTful API 의 경우보다 더 커진다.
3. 재귀적인 Query 가 불가능하다. (결과에 따라 응답의 깊이가 얼마든지 깊어질 수 있는 API 를 만들 수 없다.)



### 그럼 어떨 때 사용하는것이 좋은가?

그렇다면 GraphQL 과 RESTful 중 어떤 것을 선택해서 사용해야하는가?
다음과 같은 기준으로 선택하면 될 것이다.

1. GraphQL
   - 서로 다른 모양의 다양한 요청들에 대해 응답할 수 있어야 할 때
   - 대부분의 요청이 CRUD(Create-Read-Update-Delete) 에 해당할 때
2. RESTful
   - HTTP 와 HTTPs 에 의한 Caching 을 잘 사용하고 싶을 때
   - File 전송 등 단순한 Text 로 처리되지 않는 요청들이 있을 때
   - 요청의 구조가 정해져 있을 때

그러나 더 중요한 것은, **둘 중 하나를 선택할 필요는 없다**는 것이다.

#### GraphQL and RESTful!

File 전송과 같이 RESTful 이 더 유리한 API 가 있을 수 있고,
다양한 정보를 주고받는 것 같이 GraphQL 이 더 유리한 API 가 있을 수 있다.

이럴 때 둘 중 하나만 선택해야할 필요는 없다.
하나의 Endpoint 를 GraphQL 용으로 만들고,
다른 RESTful endpoint 들을 만들어 놓는 것은 API 개발자의 자유다.
주의해야할 것은 하나의 목표를 위해 두 API structure 를 섞어놓는 것은 API 의 품질을 떨어트릴 수 있다는 점이다.
(예: 사용자 정보를 등록하는 것은 RESTful API 로, 사용자 정보를 수정하는 것은 GraphQL API 로 한다면 끔찍할 것이다.)



## graphQL를 써봅시다!

### 핵심 기능- Query / Mutation

- Query와 Mutation이라는 기능이 있다.  내부적으로 들어가면 사실상 별반 차이가 없다.
- GraphQL 쿼리문(좌측)과 응답 데이터 형식(우측) - 요청하는 쿼리문 구조와 응답 내용의 구조가 거의 일치하여 직관적

![](../images/files-graphql-example.png)

#### Query

- Query는 Database로부터 데이터를 단순히 받는 것을 의미

즉, CRUD 에서 Read기능의 느낌이다!



#### Mutation

- Mutation은 Database의 데이터들을 변경(수정/삭제) 하는 기능이다

CUD에 해당한다고 생각하면 될 것 같다!



### 일반 쿼리와 오퍼레이션 네임 쿼리

#### 일반쿼리

```gQuery
{
  human(id: "1000") {
    name
    height
  }
}
```

#### 오퍼레이션 네임 쿼리

- 쿼리용 함수 라고 생각하면 됨
- 변수 -  gql을 구현한 클라이언트에서는 이 변수에 프로그래밍으로 값을 할당 할 수 있는 함수 인터페이스가 존재
-  이 개념 덕분에 여러분은 REST API를 호출할때와 다르게, 한번의 인터넷 네트워크 왕복으로 여러분이 원하는 모든 데이터를 가져 올 수 있습니다.
- 다. 데이터베이스의 프로시져는 DBA 혹은 백앤드프로그래머가 작성하고 관리 하였지만, gql 오퍼레이션 네임 쿼리는 클라이언트 프로그래머가 작성하고 관리 
- 이전 협업 방식(REST API)에서는 프론트앤드 프로그래머는 백앤드 프로그래머가 작성하여 전달하는 API의 request / response의 형식에 의존하게 됩니다. 그러나, gql을 사용한 방식에 서는 이러한 의존도가 많이 사라집니다. 다만 여전히 데이터 schema에 대한 협업 의존성은 존재

```gql
query HeroNameAndFriends($episode: Episode) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```



### 스키마/타입(schema/type)

- 데이터베이스 스키마(schema)를 작성할 때의 경험을 SQL 쿼리 작성으로 비유한다면, gql 스키마를 작성할 때의 경험은 C, C++의 헤더파일 작성에 비유

```
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

- 오브젝트 타입 : Character
- 필드 : name, appearsIn
- 스칼라 타입 : String, ID, Int 등
- 느낌표(!) : 필수 값을 의미(non-nullable)
- 대괄호([, ]) : 배열을 의미(array)



### 리졸버 (resolver)

- 데이터베이스 사용시, 데이터를 가져오기 위해서 sql을 작성 했습니다. 또한, 데이터베이스에는 데이터베이스 어플리케이션을 사용하여 데이터를 가져오는 구체적인 과정이 구현
  - 그러나 gql 에서는 데이터를 가져오는 구체적인 과정을 직접 구현 해야 함
  - gql 쿼리문 파싱은 대부분의 gql 라이브러리에서 처리를 하지만, gql에서 데이터를 가져오는 구체적인 과정은 resolver(이하 리졸버)가 담당하고, 이를 직접 구현 해야 합니다.
  - 합니다. 프로그래머는 리졸버를 직접 구현해야하는 부담은 있지만, 이를 통해서 데이터 source의 종류에 상관 없이 구현이 가능 합니다.
    -  리졸버를 통해 데이터를 데이터베이스에서 가져 올 수 있고, 
    - 일반 파일에서 가져 올 수 있고,
    - 심지어 http, SOAP와 같은 네트워크 프로토콜을 활용해서 원격 데이터를 가져올 수 있 습니다. 
    - 덧붙이면, 이러한 특성을 이용하면 legacy 시스템을 gql 기반으로 바꾸는데 활용 할 수 있습니다.
- gql 쿼리에서는 각각의 필드마다 함수가 하나씩 존재 한다고 생각하면 됩니다. 이 함수는 다음 타입을 반환합니다. 이러한 각각의 함수를 리졸버(resolver)라고 합니다.
  - 만약 필드가 스칼라 값(문자열이나 숫자와 같은 primitive 타입)인 경우에는 실행이 종료됩니다. 즉 더 이상의 연쇄적인 리졸버 호출이 일어나지 않습니다. 
  - 하지만 필드의 타입이 스칼라 타입이 아닌 우리가 정의한 타입이라면 해당 타입의 리졸버를 호출되게 됩니다.
  - 이러한 연쇄적 리졸버 호출은 DFS(Depth First Search)로 구현 되어있을것으로 추측합니다. 이점이 바로 gql이 Graph라는 단어를 쓴 이유가 아닐까 생각합니다. 

### overfetching과 underfetching

- overFetching : 요청 후에 돌아오는 응답에, 필요 이상의 데이터들이 들어 있는 것을 의미한다

overFetching이 일어나면, 데이터를 찾아 사용하기 쉽지만, 필요없는 리소스를 불러오기 때문에 낭비가 발생

- undefetching : 요청과 매칭되는 정보가 너무 한정적이기 때문에 돌아오는 데이터가 별로 없다

underfetching이 일어나면, 요구하는 데이터가 많을수록 서버에 요청을 여러번 보내야 한다. 마찬가지로 낭비가 발생

> 이런 문제들이 graphQL 을 사용하면 쉽게 해결 할 수가 있고, 쿼리 때문에 고생하는 수고를 덜 수 있다고 한다!! 한번 사용 해 봅시다 😆





# GraphQL를 활용할 수 있게 도와주는 다양한 라이브러리

gql 자체는 쿼리 언어입니다. 이것 만으로는 할 수 있는 것이 없습니다. gql을 실제 구체적으로 활용 할 수 있도록 도와주는 라이브러리들이 몇가지 존재 합니다. gql 자체는 개발 언어와 사용 네트워크에 완전히 독립적입니다. 이를 어떻게 활용 할지는 여러분에게 달려 있습니다.

대표적인 gql 라이브러리 셋에 대한 링크는 2개를 소개합니다. 릴레이는 GraphQL의 어머니인 Facebook이 만들었습니다. 하지만 개인적인 의견으로는 현재(2019년 7월)버전의 릴레이는 사용하기 매우 번거롭게 디자인 되어 있다고 생각합니다. 개인적으로는 아폴로가 사용하기 편했습니다.

- [릴레이(Relay)](https://relay.dev/)
- [아폴로(Apollo GraphQL)](https://www.apollographql.com/)



# 더 공부하기

- 한번 GraphQL 맛보기를 해봅시다. https://graphql-tryout.herokuapp.com/graphql 