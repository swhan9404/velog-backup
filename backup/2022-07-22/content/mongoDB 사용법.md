---
title: "mongoDB 사용법"
description: "DB 계정생성해당 db에 들어가서 위와 같은 방식으로 user 생성해당 db 또는 admin으로 이동 후 아래의 명령어 이용하여 계정 삭제db.dropUser("계정이름")use 명령어를 이용하여 db 생성만약, 이미 존재하는 데이터베이스명일 경우, 그 데이터 베이스로"
date: 2021-08-25T04:22:09.154Z
tags: ["mongodb"]
---
# 계정 생성



## Admin 계정 생성

```shell
# 1. admin db로 접속 
> use admin
switched to db admin

# 2. 현재 db 확인
> db
admin

# 3. admin 계정 생성
> db.createUser({
	user: "jina",
	pwd: "0418",
	roles: ["readWrite", "dbAdmin"]
	});
Successfully added user: { "user" : "jina", "roles" : [ "readWrite", "dbAdmin" ] }
```

- DB 계정생성
  - 해당 db에 들어가서 위와 같은 방식으로 user 생성



## 계정 삭제

해당 db 또는 admin으로 이동 후 아래의 명령어 이용하여 계정 삭제

- `db.dropUser("계정이름")`



# DB 관련 조작



## DB 생성 및 이동

> use 명령어를 이용하여 db 생성
>
> 만약, 이미 존재하는 데이터베이스명일 경우, 그 데이터 베이스로 이동

- `use 데이터베이스명`



## DB 조회

- `db` : 현재 사용중인 데이터베이스 확인
- `show dbs` : 데이터베이스 리스트 확인
  - 1개 이상의 Collection이 있어야 데이터베이스 리스트에서 보임
- `db.stats()` : 데이터베이스 상태확인



## db 제거

- `db.dropDatabase()`
  - use 데이터베이스로 해당 데이터베이스에 스위치하고선 실행해야함



# Collection 관련 조작



## Collection 생성

- `db.createCollection(name, [options])`
  - name : collection 이름
  - options : document 타입으로 구성된 해당 컬렉션의 설정값([공식문서](https://docs.mongodb.com/manual/reference/method/db.createCollection/index.html) 참고)
    - capped 
      - Boolean타입. 이 값을 true로 설정하면 capped collection을 활성화 시킨다. Capped collection 이란 고정된 크기(fixed size)를 가진 컬렉션으로서, size가 초과되면 가장 오래된 데이터를 덮어쓴다. **이 값을 true로 설정하면 size 값을 꼭 설정해야 한다**.
    - size 
      - number타입. Capped collection을 위해 해당 컬렉션의 최대 사이즈를 ~bytes로 지정한다.
    - max 
      - number타입. 해당 컬렉션에 추가 할 수 있는 최대 document 갯수를 설정한다.



## Collection 조회

> 컬렉션 리스트를 조회한다

`show collections`



## Collection 제거

`db.컬렉션명.drop()`

- 지워질 경우 true,
  실패할 경우 false 반환



# Document CRUD

- 매개변수가 다 json 형태로 되어있음



## Create

> insert 와 save 가 있음

- insert
  - 만약 _id값을 부여하지 않는다면, _id가 자동으로 부여됨
  - 만약 _id값이 존재하고, 현재 컬렉션 내에 이미 존재하는 id일 경우, 에러발생 

```shell
# 단일 document 추가
db.컬렉션명.insert(
	{
		"name": "jina",
		"pwd": "1234"
	}
)

# 배열 형식으로 복수 document 추가
db.컬렉션명.insert({
	{
		"name":"2cong",
		"pwd":"5678"
    }, {
    	"name":"dana",
    	"pwd":"7890"
    }
})
```





- save
  - _id 값이 존재하지 않는다면 insert 기능을 수행하여 데이터를 저장
  - _id가 존재한다면, 기존의 데이터를 위에 덮어쓰는 방식이라 기존 데이터가 사라짐

```shell
db.컬렉션명.save({
	'키' : '값'
});
```







## Read

- find 함수의 반환값 : curosr
  - cursor란?
    - query 요청의 결과값을 가르키는 pointer
  - find는 실제적으로 criteria에 해당하는 Document들을 선택하여 cursor를 반환
  - cursor 객체를 통하여 보이는 데이터의 수를 제한 할 수 있고, 데이터를 sort 할 수 도 있습니다. 이는 10분동안 사용되지 않으면 만료됩니다.



- find
  - 매개변수 
  - operator 는 쿼리연산자를 의미
  - 
  - 다큐먼트들을 깔끔하게 보고싶다면? *find()* 메소드 뒤에 *.pretty()* 를 붙여주면됩니다.

```shell
db.컬렉션이름.find({ 
	<field1>: { <operator1>: <value1> }, 
	... 
}, projection)
```



- 중첩필드의 경우

  - javascript 체이닝처럼 중첩필드 사용

  - 배열에 관해서도 

    - `db.inventory.find( { 'instock.0.qty': { $lte: 20 } } )` 

      처럼 0같이 배열의 index로 접근하면됨

```shell
# 데이터
{ size: { h: 14, w: 21, uom: "cm" } } 

# 중첩쿼리에 대한 find
db.inventory.find( { "size.uom": "in" } )
db.inventory.find( { "size.h": { $lt: 15 } } )
```



- projection을 통한 반환할 필드 지정

  - 반환할 필드 : 1 을 지정하여, 쿼리와 일치하는 모두 문서를 반환

    _id 는 지정해주지 않으면 default 1 로 지정되어 있어서 항상 출력됨( `_id` : 0 으로 지정해서 지울수 있음)

  - 반대로 , 반환할 필드 나열 대신, 특정 필드 제외할 수 있음

    반환하지않을 필드 : 0 을 지정

```shell
# 데이터
{ item: "journal", status: "A", size: { h: 14, w: 21, uom: "cm" }, instock: [ { warehouse: "A", qty: 5 } ] },
{ item: "notebook", status: "A",  size: { h: 8.5, w: 11, uom: "in" }, instock: [ { warehouse: "C", qty: 5 } ] },
{ item: "paper", status: "D", size: { h: 8.5, w: 11, uom: "in" }, instock: [ { warehouse: "A", qty: 60 } ] },
{ item: "planner", status: "D", size: { h: 22.85, w: 30, uom: "cm" }, instock: [ { warehouse: "A", qty: 40 } ] },
{ item: "postcard", status: "A", size: { h: 10, w: 15.25, uom: "cm" }, instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] }
]);


# 반환할 필드 지정 쿼리
db.inventory.find( { status: "A" }, { item: 1, status: 1 } ) # _id, item, status 필드 출력
db.inventory.find( { status: "A" }, { item: 1, status: 1, _id: 0 } ) # item, status 필드 출력
db.inventory.find(
   { status: "A" },
   { item: 1, status: 1, "size.uom": 1 }
) # size.uom을 통해 size 내 중첩필드에 관한 필드 출력 지정
db.inventory.find( { status: "A" }, { item: 1, status: 1, instock: { $slice: -1 } } ) 
# instock: { $slice: -1 } 를 통해 instock의 마지막 요소 반환
# 배열에 관해서는 instock.0 : 1 을 사용할 수 없기 때문에, $slice 를 통해서 하여야한다.


# 특정 필드 제외 항목 반환
db.inventory.find( { status: "A" }, { status: 0, instock: 0 } ) # status 와 instock 필드 제외
```



### sort, limit, skip

- `sort()`  :  정렬
  - 1 : 오름차순
  - -1 : 내림차순

```shell
# sort 사용예시
> db.orders.find().sort( { "amount": 1, "_id": -1 } )
{ "_id" : 6, "item" : { "category" : "brownies", "type" : "blondie" }, "amount" : 10 }
{ "_id" : 1, "item" : { "category" : "cake", "type" : "chiffon" }, "amount" : 10 }
{ "_id" : 3, "item" : { "category" : "cookies", "type" : "chocolate chip" }, "amount" : 15 }
{ "_id" : 5, "item" : { "category" : "cake", "type" : "carrot" }, "amount" : 20 }
{ "_id" : 4, "item" : { "category" : "cake", "type" : "lemon" }, "amount" : 30 }
{ "_id" : 2, "item" : { "category" : "cookies", "type" : "chocolate chip" }, "amount" : 50 }
```



- `limit()` : 출력물 갯수 제한

```shell
# limit 사용예시
> db.orders.find().limit(3)
{ "_id" : 1, "item" : { "category" : "cake", "type" : "chiffon" }, "amount" : 10 }
{ "_id" : 2, "item" : { "category" : "cookies", "type" : "chocolate chip" }, "amount" : 50 }
{ "_id" : 3, "item" : { "category" : "cookies", "type" : "chocolate chip" }, "amount" : 15 }
```



- `skip()` : 출력할 데이터 시작부분 설정

```shell
# skip 사용예시
> db.orders.find().skip(2)
{ "_id" : 3, "item" : { "category" : "cookies", "type" : "chocolate chip" }, "amount" : 15 }
{ "_id" : 4, "item" : { "category" : "cake", "type" : "lemon" }, "amount" : 30 }
{ "_id" : 5, "item" : { "category" : "cake", "type" : "carrot" }, "amount" : 20 }
{ "_id" : 6, "item" : { "category" : "brownies", "type" : "blondie" }, "amount" : 10 }
```





## Update

> update 와 save가 있다.

- update
  - query : find  와 같이 수정할 쿼리 찾는 역할
  - update : document에 적용할 변동사항
    - 밑의 조건에 따라 특정 field를 수정할수도, 이미 존재하는 document를 대체(replace)할수도 있음

```shell
db.컬렉션명.update(
   <query>,
   <update>,
   {
     upsert: <boolean>,
     multi: <boolean>,
     writeConcern: <document>
   }
)
```

| Parameter    | Type     | 설명                                                         |
| :----------- | :------- | :----------------------------------------------------------- |
| *query       | document | 업데이트 할 document의 criteria 를 정합니다. [find() 메소드](https://velopert.com/479) 에서 사용하는 query 와 같습니다. |
| *update      | document | document에 적용할 변동사항입니다.                            |
| upsert       | boolean  | Optional. (기본값: false) 이 값이 true 로 설정되면 query한 document가 없을 경우, 새로운 document를 추가합니다. |
| multi        | boolean  | Optional. (기본값: false) 이 값이 true 로 설정되면, 여러개의 document 를 수정합니다. |
| writeConcern | document | Optional.  wtimeout 등 document 업데이트 할 때 필요한 설정값입니다. 기본 writeConcern을 사용하려면 이 파라미터를 생략하세요. 자세한 내용은 [매뉴얼](https://docs.mongodb.org/v3.2/reference/write-concern/)을 참조해주세요. |



- save
  - 필드 단위로 수정되지 않고 데이터를 덮어씀으로 이전 데이터는 사라짐

```shell
db.컬렉션명.save({
	'키' : '값'
});
```



### update 예시들

**1. 특정 field 업데이트**

특정 field의 값을 수정할 땐 `$set 연산자`를 사용합니다. 이 연산자를 사용해서 똑같은 방법을 새로운 field를 추가 할 수도 있습니다.

```shell
# Abet document 의 age를 20으로 변경한다
> db.people.update( { name: "Abet" }, { $set: { age: 20 } } )
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
```



**2. document를 replace 하기**

이렇게 새로운 document 로 replace 할 때, _id는 바뀌지 않습니다.

```shell
# Betty document를 새로운 document로 대체한다.
> db.people.update( { name: "Betty" }, { "name": "Betty 2nd", age: 1 })
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
```



**3. 특정 field를 제거하기**

여기서 score: 1 의 1 은 true 의 의미입니다.

```shell
# David document의 score field를 제거한다
> db.people.update( { name: "David" }, { $unset: { score: 1 } } )
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
```



**4. criteria에 해당되는 document가 존재하지 않는다면 새로 추가하기**

```shell
# upsert 옵션을 설정하여 Elly document가 존재하지 않으면 새로 추가
> db.people.update( { name: "Elly" }, { name: "Elly", age: 17 }, { upsert: true } )
WriteResult({
        "nMatched" : 0,
        "nUpserted" : 1,
        "nModified" : 0,
        "_id" : ObjectId("56c893ffc694e4e7c8594240")
})
```



**5. 여러 document의 특정 field를 수정하기**

```shell
# age가 20 보다 낮거나 같은 document의 score를 10으로 설정
> db.people.update(
	{ age: { $lte: 20 } },
	{ $set: { score: 10 } },
	{ multi: true }
)
WriteResult({ "nMatched" : 3, "nUpserted" : 0, "nModified" : 0 })
```



**6-1. 배열 에 값 추가하기**

push 명령어를 사용하여 배열 값에 추가

```shell
# Charlie document의 skills 배열에 "angularjs" 추가
> db.people.update(
	{ name: "Charlie" },
	{ $push: { skills: "angularjs" } }
)
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
```



**6-2. 배열 에 값에 여러개 추가하기 + 오름차순 정렬**

$sort 값을 내림차순으로 정렬하려면 -1 로 하면 됩니다.

배열이 document의 배열이고 그 embedded document의 특정 field에 따라서 정렬을 할 때는 이렇게 사용

- `$sort: { KEY: 1 }`

```shell
# Charlie document의 skills에 "c++" 와 "java" 를 추가하고 알파벳순으로 정렬
> db.people.update(
	{ name: "Charlie" },
	{ $push: {
	     skills: {
	         $each: [ "c++", "java" ],
	         $sort: 1
	     }
	   }
	 }
	 )
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
```



**7-1. 배열에 값 제거하기**

```shell
# Charlie document에서 skills 값의 mongodb 제거
> db.people.update(
	 { name: "Charlie" },
	 { $pull: { skills: "mongodb" } }
	 )
```



**7-2. 배열 에 값 추가하기**

```shell
# Charlie document에서 skills 배열 중 "angularjs" 와 "java" 제거
> db.people.update(
	 { name: "Charlie" },
	 { $pull: { skills: { $in: ["angularjs", "java" ] } } }
	 )
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
```





## Delete

- remove

```shell
db.컬렉션이름.remove({
	'키' : '값'
})
```



# 쿼리연산자



## 비교연산자

- $eq : (equals) 주어진 값과 일치하는 값

- $gt : (greater than) 주어진 값보다 큰 값

- $gte : (greather than or equals) 주어진 값보다 크거나 같은 값

- $lt : (less than) 주어진 값보다 작은 값

- $lte : (less than or equals) 주어진 값보다 작거나 같은 값

- $ne : (not equal) 주어진 값과 일치하지 않는 값

- $in : 주어진 배열 안에 속하는 값

- $nin : 주어빈 배열 안에 속하지 않는 값

  

```shell
# 비교 연산자 사용 예시
db.articles.find( { “likes”: { $gt: 10, $lt: 30 } } )
```



## 논리연산자

- $or
- $and
- $not
- $nor

```shell
# 논리 연산자 사용 예시
db.articles.find({ $or: [ { “title”: “article01” }, { “writer”: “Alpha” } ] })
```



## 정규표현식 사용

`{ <field>: /pattern/<options> }` 이런 형태로 정규표현식으로 쿼리를 날릴 수 있다.

options 에는 다음과 같은 것들을 쓸 수 있다.

- i : 대소문자 무시
- m : 정규식에서 anchor(^) 를 사용 할 때 값에 \n 이 있다면 무력화
- x : 정규식 안에있는 whitespace를 모두 무시
- s : dot (.) 사용 할 떄 \n 을 포함해서 매치

```shell
# regex 사용 예시
db.articles.find( { "title" : /article0[1-2]/ } )
```



## javascript 표현식 사용

$where 연산자를 통하여 javascript expression 을 사용 할 수 있다.

```shell
# $where
db.articles.find( { $where: “this.comments.length == 0” } )
```



## Embedded Document 배열 쿼리

> $elemMatch 와 $slice 가 있다

- $elemMatch 연산자는 Embedded Documents 배열을 쿼리할때 사용

``` shell
# 주어진 자료 형태
{ _id: 1, results: [ 82, 85, 88 ] }
{ _id: 2, results: [ 75, 88, 89 ] }

# $elemMatch 사용예시
db.scores.find(
   { results: { $elemMatch: { $gte: 80, $lt: 85 } } }
)
```



- $slice를 통해 배열의 요소 번호를 지정한 것에 대해 반환

```shell
# index 하나에 대해
db.collection.find(
   <query>,
   { <arrayField>: { $slice: <number> } }
);

# index 여러개에 대해
db.collection.find(
   <query>,
   { <arrayField>: { $slice: [ <number>, <number> ] } }
);
```



# 인덱스

- 인덱스의 역할
  - 인덱스는 MongoDB에서 데이터 쿼리를 효율적으로 할 수 있게 해준다.
    - 인덱스가 없다면 컬렉션의 데이터를 하나하나씩 조회해서 스캔하지만, 인덱스를 사용하면 더 적은 횟수의 조회로 원하는 데이터를 찾을 수 있다.
    - MongoDB가 인덱스에 대하여 B-Tree를 구성하기 때문
    - B-tree에서 이진탐색으로 데이터를 조회하면 O(logN)의 시간복잡도를 가지기 때문에 빠르다.



## 기본인덱스 _id

모든 MongoDB의 컬렉션은 기본적으로 _id 필드에 인덱스가 존재한다. 
만약에 컬렉션을 만들 때 _id 필드를 따로 지정하지 않으면 mongod 드라이버가 자동으로 _id 필드 값을 ObjectId로 설정해준다.



## 다양한 인덱스 지원

- Single Field Index : 기본적인 인덱스 타입, 설정안하면 default로 _id

- Compound Index : RDBMS의 복합인덱스 같은 거, 2개이상 필드를 인덱스로 사용

- Multikey Index : Array에 매칭되는 값이 하나라도 있으면 인덱스에 추가하는 멀티키 인덱스

- Geospatial Index : 위치기반 인덱스와 쿼리(지도의 좌표와 같은 데이터를 효율적으로 쿼리하기 위해서 
  (예: 특정 좌표 반경 x 에 해당되는 데이터를 찾을 때 사용)

- Text Index : String에도 인덱싱이 가능 
  (예: 텍스트 관련 데이터를 효율적으로 쿼리)

- Hashed Index : Btree 인덱스가 아닌 Hash 타입의 인덱스도 사용 가능. Hash는 검색 효율이 B Tree보다 좋지만, 정렬을 하지 않음

  

## 인덱스 생성

`db.컬렉션명.createIndex(document[, options])` 로 인덱스를 생성한다. 
document에는 `{ Key : Value }` 형식으로 넣어주면 되고, value가 1이면 오름차순, -1이면 내림차순이다.

options 객체에는 다음과 같은 속성들이 있다.

- unique : boolean타입이다. 컬렉션에 단 한개의 값만 존재할 수 있다. 
  (ex. `db.userinfo.createIndex( { email: 1 }, { unique: true } )`)
- partialFilterExpression : document타입이다. 조건을 정하여 일부 document에만 인덱스를 정할 때 사용된다. 
  (ex. `db.store.createIndex( { name: 1 }, { partialFilterExpression: { visitors: { $gt: 1000 } } })`)
- expireAfterSeconds : integer타입이다. Date타입에 적용하며 N초 후에 document를 제거시킬 수 있다. 
  (ex. `db.notifications.createIndex( { "notifiedDate": 1 }, { expireAfterSeconds: 3600 } )`) 
  이 경우 만료되는 document를 제거하는 쓰레드는 60초마다 실행되기 때문에 제거시간은 정확하지 않다.





## 인덱스 조회

`db.컬렉션명.getIndexes()` 로 생성된 인덱스를 확인할 수 있다.



## 인덱스 제거

`db.컬렉션명.dropIndex(document)` 로 제거한다

## 인덱스 성능 테스트

- explain() : 특정 쿼리 수행 통계([자세한 내용은 문서](https://docs.mongodb.com/manual/reference/method/db.collection.explain/#db.collection.explain))
  - queryPlanner: 가장 효율적인 쿼리를 찾기 위해 [쿼리 최적화](https://docs.mongodb.com/manual/core/query-plans/)를 제공합니다.
  - executionStats mode: 특정 질의에서 실제로 실행한 결과의 세부사항을 제공합니다.
  - allPlansExecution mode: queryPlanner + executionStats 내용 모두 포함
- hint() : 특정 인덱스 테스트([자세한 내용은 문서](https://docs.mongodb.com/manual/reference/method/cursor.hint/#cursor.hint))
  - 이는 테스트하고 싶은 특정 인덱스가 원하는 쿼리에 효과 있는지 알아보기 위해 사용합니다.



1. 인덱스 생성 전과 인덱스 생성 시 속도 비교해봅니다. 아래와 같은 [explain 명령어](https://docs.mongodb.com/manual/reference/method/cursor.explain/)를 사용해서 실행 속도를 파악해 봅니다. 저는 아래 명령어 입력 시 764밀리 초로 0.764초 정도 나왔습니다.

```shell
>db.user.find({score:"23"}).explain("executionStats").executionStats.executionTimeMillis

764
```

2. 그러면 이제 score에 대한 인덱스를 생성합니다.

```shell
> db.user.createIndex({score:1})
```

3. 인덱스 생성 후, 실행 속도를 확인해 봅니다. 저는 0이라는 값이 나왔습니다. 실습을 통해 인덱스로 매우 빠른 검색이 가능하다는 것을 알 수 있었습니다.

```shell
> db.user.find({score:"56"}).explain("executionStats").executionStats.executionTimeMillis

0
```

## 인덱스 사용시 주의점

1. 일반적으로 컬렉션에 2~3개 이상의 인덱스를 가지지 않는 것이 좋습니다.
   - 모든 쓰기(읽기, 갱신, 삭제) 작업은 인덱스 때문에 더 오래 걸립니다. 그 이유는 데이터 변경될 시 인덱스의 순서도 재구성하기 때문
2. 인덱스 구축이 완료될 때까지 데이터베이스의 모든 read/write 작업은 중단하면서 인덱스를 구축하게 됩니다. 따라서 [background 옵션](https://docs.mongodb.com/manual/reference/method/db.collection.createIndex/)을 이용하여 인덱스를 구축하면서 다른 작업들도 가능하게 합니다.
   - 하지만 포그라운드 인덱싱보다는 작업이 더 오래 걸립니다.
   - 4.2 버전에서 이 옵션은 Deprecated 상태이고, 지정되어도 해당 옵션을 무시한다고 하니, 4.2 이전 버전에서만 사용할 것을 권장합니다.

```shell
> db.[컬렉션 명].ensureindex({"필드":1},{background:true})
```

