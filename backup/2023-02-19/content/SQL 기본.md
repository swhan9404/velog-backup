---
title: "SQL 기본"
description: "특정 기업이나 조직 또는 개인이 필요에 의해 데이터를 일정한 형태로 저장해 놓은 것DBMS  = 데이터베이스 관리 소프트웨어종류계층형 DB :  트리 형태의 자료구조에 데이터 저장, 1:N 관계 표현XML, 파일시스템, 윈도우 레지스트리네트워크형 DB : 오너와 멤버 "
date: 2021-03-15T15:38:13.621Z
tags: ["sql"]
---
# 1. 관계형 DB란

## 1.1 DB 정의

- 특정 기업이나 조직 또는 개인이 필요에 의해 데이터를 일정한 형태로 저장해 놓은 것
- DBMS  = 데이터베이스 관리 소프트웨어

- 종류
  - 계층형 DB :  트리 형태의 자료구조에 데이터 저장, 1:N 관계 표현
    - XML, 파일시스템, 윈도우 레지스트리
  - 네트워크형 DB : 오너와 멤버 형태로 데이터 저장, M:N 관계 표현
  - 관계형 DB : 릴레이션 데이터 저장, 집합 연산과 관계 연산 가능



## 1.2 관계형 DB의 장점

- 정규화를 통해 이상 현상을 제거하고 데이터의 중복을 피함
  - 정규화 : 중복을 최소화하게 데이터를 구조화하는 프로세스
- 동시성, 병행 제어를 통해 데이터를 동시 조작 가능
  - 집합연산 - 합집합, 차집합, 교집합, 곱집합
  - 관계연산 - 선택연산(행조회), 투영연산(튜플조회), 결합연산(공통속성으로 새로운릴레이션), 나누기연산(공통요소 추출, 중복제거)
- 데이터의 표현 방법 등 체계화 할 수 있고, 데이터 표준화, 품질확보
- 보안기능, 데이터 무결성 보장, 데이터 회복/복구 기능



## 1.3 SQL 개요

- Structured Query Language
- 종류
  - DML (Data Manipulation Language, 데이터 조작어)
    - SELECT : 데이터 조회
    - INSERT : 데이터추가
    - UPDATE : 데이터 변경
    - DELETE : 데이터 삭제
  - DDL (Data Definition Language, 데이터 정의어)
    - CREATE : 테이블 생성
    - ALTER : 테이블 변경
    - DROP : 테이블 삭제
  - DCL (Data Control Language, 데이터 제어어)
    - GRANT : 권한주기
    - REVOKE : 권한삭제
  - TCL (Transaction Control Language, 트랜잭션 제어어) 
    - COMMIT
    - ROLLBACK



## 1.4 구성

- 구성요소 

  -  엔티티(Entity) : 테이블

    - <엔티티의 예시 >

      1. 고객, 사원정보, 부서, 제품

      2. 주문서, 성적표, 입고전표, 금전출납부 

      3. 생산계획, 공정

  - 관계(Relationship) : 테이블간의 관계

  - 속성(Attribute) : 테이블의 컬럼들

  

# 2. DDL

## 2.1 데이터 유형

- CHAR(L)  
  - 고정 길이 문자열 
  - 할당된 변수 값의 길이가 L 이하일 때 차이는 공백으로 채워짐
  - 최대 ORACLE 2000, SQL Server 8000 바이트
- VARCHAR2(L), VARCHAR(L) 
  - 가변 길이 문자열, 할당되는 변수 값의 길이의 최대값이 L임
  - 문자열은 가능한 최대 길이로 설정
  - 최대 ORACLE 4000, SQL Server 8000 바이트
- NUMBER(L,D)  
  
- 숫자형 (L은 전체 자리 수 D는 소수점 자리 수)
  
- DATE, DATETIME 

  - 날짜형, 데이터 크기 지정이 필요하지 않음
  - ORACLE은 1초 단위, SQL Server는 3.33ms 단위

  

## 2.2 테이블 생성

```SQL
CREATE TABLE 테이블명(
	칼럼명1 데이터타입 [Default형식],
    칼럼명2 데이터타입 [Default형식] CONSTRAINT 제약조건,
    ...
)
```

- 테이블 및 칼럼 명명 규칙

  - 알파벳, 숫자, `_` , `$`, `#` 사용가능
  - 대소문자 구분하지 않음
  - 테이블 명은 단수형 권고

- 제약조건 - 복제 테이블에는 기존테이블 제약조건 중 NOT NULL만 적용

  - PRIMARY KEY : 기본키(UNIQUE + NOT NULL)

  - UNIQUE KEY : Null 가능, 행 고유 식별 가능

  - NOT NULL : Null 불가

    - NULL에 대한 수치연산은 NULL
    - NULL에 의한 비교연산은 FALSE 출력

  - CHECK : 입력할 수 있는 범위 등을 제한

  - FOREIGN KEY : 외래키, 참조 무결성 옵션 선택가능

    ```SQL
    ALTER TABLE 테이블명 ADD CONSTRAINT 제약조건명 FOREIGN KEY (컬럼명) REFERENCES 참조테이블명(참조컬럼명)
    ```

- 테이블 구조 확인

  ```SQL
  DESCRIBE 테이블명;
  ```


- CREATE 를 이용하여 테이블 만들기

  ```sql
  CREATE TABLE 테이블명_TEMP AS 
  	(SELECT * FROM 테이블명);
  ```



## 2.3 테이블변경

```sql
ALTER TABLE 테이블명 ADD 추가컬럼명 데이터유형;
ALTER TABLE 테이블명 DROP COLUMN 삭제할컬럼명;
ALTER TABLE 테이블명 MODIFY 컬럼명 데이터유형 DEFAULT NOT NULL;
ALTER TABLE 테이블명 RENAME COLUMN (구)컬럼명 TO (신)컬럼명;
ALTER TABLE (구)테이블명 RENAME TO (신)테이블명;
ALTER TABLE 테이블명 DROP CONSTRAINT 제약조건명;
```

- 테이블 컬럼 추가 : ADD

  -  테이블의 마지막 칼럼 위치에 컬럼 추가됨

- 테이블 컬럼 삭제 : DROP COLUMN

- 테이블 컬럼 형식 변경  : MODIFY

  - 컬럼의 데이터유형, 디폴트값, NOT NULL, 제약조건에 대한 변경을 포함

  - 고려 사항

    - 1) NULL만 있거나 2) 행이 없는 경우에만 칼럼의 크기 축소 가능

    - NULL만 있을 때는 데이터 유형도 변경 가능

    - NULL이 없으면 NOT NULL 제약조건 추가 가능

    - 기본값 변경 작업 이후 발생하는 데이터에 대해서만 기본값이 변경됨

- 테이블 컬럼 이름 변경 : RENAME COLUMN

- 테이블 이름 변경하기 : RENAME TO

- 제약사항 제거 : DROP CONSTRAINT

  

## 2.4 테이블 삭제

```sql
DROP TABLE 테이블명 CASCADE CONSTRAINT;
TRUNCATE TABLE 테이블명;
```

- 테이블의 데이터와 구조삭제 : DROP TABLE

  - CASCADE CONSTRAINT 옵션 
    - 해당 테이블과 관계가 있었던 참조되는 제약조건에 대해서도 함께 삭제한다(참조 무결성 준수)
    - CREATE TABLE 에서 ON DELETE CASCADE 옵션으로 동일 기능 실현 가능

- 테이블 데이터 삭제 : TRUNCATE TABLE

  - 로그를 기록하지 않기 떄문에 ROLLBACK 불가(Auto Commit)

  - DML 명령어의 DELETE 명령어와 기능상은 유사하나, 처리방식자체가 다름



# 3. DML

## 3.1 INSERT

```sql
INSERT INTO 테이블명 (컬럼명, ...) VALUES (필드값, ...);
```



## 3.2 UPDATE

```sql
UPDATE 테이블명 SET 컬럼명=필드값;
```



## 3.3 DELETE

```sql
DELETE FROM 테이블명 WHERE 조건절;
DELETE FROM 테이블명; 
```

- DELETE FROM 테이블명 으로 데이터를 삭제해도 테이블 용량은 초기화되지 않음
  - TRNCATE로 삭제하면 초기화됨



## 3.4 SELECT

```sql
SELECT 컬럼명 FROM 테이블명;
SELECT DISTINCT 컬렴명 FROM 테이블명;
SELECT * FROM 테이블명;

SELECT 컬럼명 AS '별명'
FROM 테이블명 별명
```

- 컬럼별 데이터선택
- 데이터 중복없이 선택 : DISTINCT
- 전체 컬럼의 데이터 선택 : * (Alias)
- 별명 붙이기
  - 출력되는 컬럼명 설정
  - 쿼리내에서 사용할 테이블명 설정



## 3.5 산술 연산자

- Number와 DATE 자료형에 적용(수학에서의 사칙연산과 동일)
- 우선순위
  - `()` > `*` > `/` > `+` > `-`



## 3.6 합성 연산자 (Concatenation)

``` sql
CONCAT ("문자", "연결하기")  /* 문자연결하기 */
"문자" || "연결하기" 
```

- ORACLE 의 경우
  - concat(string1, string2) - 공통
  - `||`
- SQL Server 의 경우
  - concat(string1, string2) - 공통
  - `+`



## 3.7 DUAL

```sql
SELECT SYSDATE FROM DUAL;
```

- Oracle의 기본 더미 테이블
- 연산 수행을 위해 사용됨
- 데이터 사전과 함께 Oracle에 의해 자동 생성되는 기본 테이블이다.
- SYS의 스키마에 있으며 모든 사용자가 액세스가능
- VARCHAR2(1) 정의의 DUMMY 열 1개로 구성되어있음



# 4 TCL(Transaction Control Language)

- 트랜잭션
  - 데이터베이스의 논리적 연산단위
  - 하나 이상의 SQL문을 포함함

- 트랜잭션의 특정

  - 원자성(Atomicity ) : 전부 실행되거나 전혀 실행되지 않음( All or Nothing)
  - 일관성(Consistency) : 트랜잭션으로 인한 DB 상태의 모순이 없음
  - 고립성(Isolation) : 부분적인 실행결과에 다른 트랜잭션이 접근할 수 없음, Locking으로 고립성 보장
  - 영속성(Duration) : 트랜잭션의 결과는 영구적으로 저장됨

- TCL의 역할

  - 데이터 무결성 보장을 모적으로 함

  - 영구 변경 전 확인 + 연관 작업 동시처리 가능

  - ORACLE에서

    1. SQL문을 실행하면 트랜잭션이 시작됨

    2. TCL을 실행하면 트랜잭션이 종료됨

  - DDL을 실행하면 자동 commit( DML 이후 커밋없이 DDL을 실행해도 자동 commit)

  - DB를 정상적으로 종료하면 자동 커밋, 애플리케이션 드으이 이상으로 DB 접속이 단절되면 자동 롤백

- 트랜잭션 대상이 되는 SQL

  - DML : UPDATE, INSERT, DELETE 등 데이터 수정
  - SELECT : SELECT FOR UPDATE 등 베타적 LOCK을 요구하는 것

- COMMIT 과 ROLLBACK을 사용함으로써 얻을 수 있는 효과

  - 데이터 무결성 보장
  - 영구적인 변경을 하기 전에 데이터의 변경 사항 확인 가능
  - 논리적으로 연관된 작업을 그룹핑하여 처리 가능



## 4.1 COMMIT

- 데이터를 DB에 영구적으로 반영하는 명령어, 커밋 시 트랜잭션이 완료되어 LOCKING이 해제됨
- SQL Server는 기본적으로 자동 커밋
- COMMIT 이전 상태
  - 단지 Memory Buffer에만 영향을 주고 이전 상태로 복구가 가능
  - 현재 사용자는 SELECT 문으로 변경 결과 확인 가능한 상태
  - 다른 사용자는 현재 사용자가 수행한 결과 확인 불가능
  - 변경된 행은 잠금(Locking)이 설정되어 다른 사용자가 변경 불가능
- COMMIT 이후 상태
  - 데이터에 대한 변경 사항이 데이터베이스에 영구적 반영
  - 이전 데이터는 영원히 잃어버린다
  - 모든 사용자가 결과를 조회할 수 있다
  - 관련 행에 잠금이 해제되고, 다른 사용자가 행을 조작할 수 있다.



## 4.2 ROLLBACK

- 트랜잭션 시작 이전의 상태로 되돌리는 명령어
- COMMIT 이전의 상태로 돌려줌
- ROLLBACK 시 LOCKING이 해제됨
- 롤백 후 데이터 상태
  - 데이터에 대한 변경사항은 취소됨
  - 이전 데이터가 다시 재저장됨
  - 관련 행에 대한 잠금이 풀리고 다른 사용자들이 행 조작 가능



## 4.2.1 SAVEPOINT(저장점)

```sql
SAVEPOINT 포인트이름;
ROLLBACK TO 포인트이름;
```

- 저장점을 정의하면 롤백을 할 경우 전체 롤백이 아닌 저장점까지만의 일부만 롤백할 수 있다.
  - 복수의 저장점을 정의할 수 있다.
  - 동일 이름으로 저장점을 저장시 나중에 정의한 저장점이 유효하다
  - 저장점을 정의하고 저장점으로 롤백한다.
- 한 저장점으로 되돌리고 나서 그 보다 더 미래로 다시 되돌릴 수 없다.
- 특정한 저장점까지 롤백하면 그 저장점 이후에 설정한 저장점은 모두 무효가 된다.
- 저장점 없이 롤백하면 모든 변경사항을 취소한다.



# 5. WHERE 절

```sql
SELECT 컬럼명 FROM 테이블명 WHERE 조건절;
```

- 연산자의 종류	
  - 비교 연산자 : `=`, `>`, `>=`, `<`, `<=`
  - SQL 연산자 
    - BETWEEN a AND b
    - IN (list)
    - LIKE '비교문자열'
    - IS NULL
  - 논리 연산자 : `AND`, `OR`, `NOT`
  - 부정 비교 연산자 : `!=`, `^=`, `<>` (전부 다 같지 않다는 의미)
- 문자 유형 간의 비교 방법
  - 비교 연산자의 양쪽이 모두 CHAR 타입인 경우
    - 길이가 서로 다른 CHAR인 경우 작은쪽 CHAR에 SPACE를 축가하여 길이 같게 한 후 비교
    - 서로 다른 문자가 나올 때 까지 비교
    - 달라진 첫 번째 문자의 값에 따라 크기를 결정
    - Blank의 수만 다르다면 서로 같은 값으로 결정
  - CHAR vs VARCHAR 
    - 길이가 다르다면 길이가 긴 값이 크다고 판단
  - CHAR vs 상수
    - 상수를 변수 타입으로 바꿔 비교

- 부분 범위 처리
  - SQL 처리 결과 집합의 각 행에 임시로 부여되는 번호, 조건절 내에서의 행의 개수를 제한하는 목적으로 사용

```sql
SELECT 칼럼명 FROM 테이블명 ROWNUM <= N;
SELECT TOP(N) 칼럼명 FROM 테이블명; ( SQL Server )
```



# 6. 함수

## 6.1 단일행함수

- 1) SELECT절 2) WHERE절 3) ORDER BY절에 사용 가능
- 각행에 개별적으로 작용
- 여러 인자를 입력해도 단 하나의 결과만을 출력

### 6.1.1 문자형 함수

- LOWER(문자열) / UPPER(문자열) 

  - 문자열의 알파벳 문자를 대소문자로 변경

- ASCII(문자)

  - 문자나 숫자를 ASCII 코드 번호로 출력

- CHR/CHAR(ASCII번호)

  - ASCII 코드 번호를 문자나 숫자로 출력

- CONCAT(문자열1, 문자열2) 

  - 문자열은 연결( `||` 혹은  `+` 와 동일 기능)

- SUBSTR(문자열, m[, n]) / SUBSTRING(문자열, m[, n])

  - 문자열 중 m위치부터 n개의 문자 반환(n 생략시 마지막 문자까지)

- LENGTH/LEN(문자열)

  - 문자열의 개수(길이)를 숫자값으로 반환

- LTRIM(문자열 [, 지정문자]) / RTRIM(문자열 [, 지정문자])  /TRIM([ leading, trailing, both] 지정문자 FROM 문자열) 

  - 문자열 앞쪽부터 확인해 지정문자가 처음 나타나는 동안 해당 문자를 제거(기본값 공백)
  - 문자열 뒤쪽부터 확인해 지정문자가 처음 나타나는 동안 해당 문자를 제거(기본값 공백)

  - 머리말, 꼬리말, 양쪽 지정 문자 제거 기본값 both



### 6.1.2 숫자형 함수

- `ABS(숫자)` : 절대값 반환

- `SIGN(숫자)` : 양수, 0 , 음수 판별 (1, 0, -1 중 출력)
- `MOD(숫자1, 숫자2)` : 숫자1을 숫자2로 나누어 나머지값을 반환( % )
- `CEIL/CEILING(숫자)` : 크거나 같은 최소 정수 반환( 정수 값으로 올림 )
- `FLOOR(숫자)` : 작거나 같은 최대 정수 반환(정수 값으로 버림)
- `ROUND(숫자[, m])` : 소수점 m자리에서 반올림(생략시 0)
- `TRUNC(숫자[, m])` : 소수점 m자리 뒤에서 잘라서 버림(생략시 0) - ORACLE ONLY
- `SIN, COS, TAN, ...` : 삼각함수 값 변환
- `EXP(), POWER(), SQRT(), LOG(), LN()` : 지수, 거듭제곱, 제곱근, 자연로그



### 6.1.3 날짜형 함수

- `SYSDATE`/`GETDATE()` : 현재 시각 출력(년,월,일,시,분,초)
- `EXTRACT("YEAR" | "MONTH" | "DAY" from d) ` : 년/월/일 데이터를 추출
  - SELECT EXTRACT("YEAR" | "MONTH" | "DAY" FROM SYSDATE) FROM DUAL
-  `DATEPART('YEAR'|'MONTH'|'DAY', d) ` : 년/월/일 데이터를 추출 동일
- `TO_NUMBER(TO_CHAR(d, 'YYYY'))` : 날짜에서 문자로 변환후 숫자로 변환
- `YEAR(d)` : 년 추출 

- `NEXT_DAY` : 지정된 요일 첫 날짜 출력
- 날짜 연산
  - 날짜 + 숫자 = 날짜
  - 날짜 - 숫자 = 날짜
  - 날짜 - 날짜 = 날짜 수
  - 날짜 + 숫자/24 = 날짜 + 시간



### 6.1.4 변환형 함수

- 명시적 형변환 : 변환형 함수를 이용하여 데이터 타입 변환
- 암시적 형변환 : DBMS가 자동으로 데이터 타입 변환

- [ Oracle ] 
  - TO_NUMBER(문자열) - alphanumeric 문자열을 숫자로 변환
  -  TO_CHAR(숫자|날짜[, FORMAT]) - 숫자/날짜를 주어진 FORMAT으로 문자열 타입 변환
  -  TO_DATE(문자열[,FORMAT]) - 문자열을 주어진 FORMAT으로 날짜 타입 변환
-  [ SQL Server ] 
  - CAST (expression AS data_type [(length)]) - expression을 목표 타입으로 변환

  - CONVERT (data_type [(length)] expression[, style]) - expression 목표 타입 변환



### 6.1.5 NULL 관련 함수

- `NVL(칼럼, 값)` : NULL 값 변환
- `NVL2(칼럼, 값, 값)` :  NULL값이면 앞의 값 / NULL이 아니면 뒤의 값 출력
- `NULLIF(값, 값)` : 같으면 NULL 다르면 첫 값 출력
- `COALESCE(값, 값, ...)` : NULL 이 아닌 첫 값 출력
- `ISNULL(칼럼, 값)` : NULL 이면 값으로 대치 아니면 컬럼 값 출력



### 6.1.6 조건문

```sql
/* CASE */
SELECT 칼럼명, 
    CASE 
        WHEN 조건절1 THEN 출력값1 
        ... 
        ELSE 기본값 
    END AS 칼럼명
FROM 테이블명;

/* DECODE */
DECODE(표현식, 기준값1, 값1, 기준값2, 값2, ... , DEFAULT 값)
```

- CASE
  - ELSE 생략시 NULL 출력
  - `WHEN NULL` 하면 조건이 없음으로 모든 행에 기본값 출력
- DECODE
  - ORACLE 함수로, 기준값에 해당하면 해당값을 반환하는 함수이다.
  - DEFAULT 생략시 NULL



# 7. GROUP BY 절, HAVING 절

- 집계함수(Aggregate Function)
  - 여러 행들의 그룹이 모여서 그룹당 단 하나의 결과를 돌려주는 함수
  - GROUP BY 절은 행들을 소그룹화
  - SELECT 절, HAVING 절, ORDER BY 절에 사용
  - WHERE 절에 사용 불가
  - 공집합에서도 연산 수행
- 집계함수의 종류  - `집계함수명( ALL | DISTINCT 칼럼/표현식 )` : default값은 all
  - `COUNT(*)` : NULL값을 포함한 모든 행의 수 출력
  - `COUNT(표현식)` :  NULL 값인 것을 제외한 행의 수 출력
  - `SUM([ALL | DISTINCT] 표현식)` : NULL 값을 제외한 합계 출력
  - `AVG([ALL | DISTINCT] 표현식)` : NULL 값을 제외한 평균 출력
  - `MAX([ALL | DISTINCT] 표현식)` : 최대값 출력( 문자, 날짜, 데이터 사용 가능)
  - `MIN([ALL | DISTINCT] 표현식)` : 최소값 출력( 문자, 날짜, 데이터 사용 가능)
  - `STDDEV([ALL | DISTINCT] 표현식)` : 표준 편차를 출력
  - `VARIAN([ALL | DISTINCT] 표현식)` : 분산을 출력
  - 특징
    - 기본적으로 NULL 값을 제외하고 연산
    - 숫자 연산은 NULL을 출력한다.



## 7.1 GROUP BY 절과 HAVING 절

- 역할
  - GROUP BY 
    - 그룹핑 기준 설정
    - 앨리어스(별칭) 사용 불가
  - HAVING
    - GROUP BY 절에 의한 집계 데이터에 출력조건을 걺
    - WHERE 절은 SELECT 절에 조건을 걸기 때문에 제외된 데이터가 GROUP BY 대상이 아님
    - 일반적으로 GROUP BY 뒤에 위치함

- 특징
  - GROUP BY 절을 통해 소그룹별 기준을 정한 뒤, SELECT 절에 집계함수 사용
  - GROUP BY 절보다 WHERE 절이 먼저 수행되기 때문에 집계함수는 WHERE 절에 올수가 없음
    - WHERE절은 전체 데이터를 GROUP하기 전에 미리 행들을 걸러주는 역할
  - HAVING 절은 GROUP BY 절의 기준 항목이나 소그룹의 집계함수를 이용한 조건을 표시할 수 있음



# 8. ORDER BY

```sql
SELECT 컬럼명 AS `ALIAS명`
FROM 테이블명
WHERE 조건식
GROUP BY 칼럼/표현식
HAVING 그룹조건식
ORDER BY 컬럼/표현식 [ASC/DESC];
```

- 기본적인 정렬 순서는 오름차순(ASC) 이다.

  - 숫자형 타입은 오름차순시 작은 값부터 출력
  - 날짜형 타입은 오름차순시 빠른 날부터 출력
  - ORACLE은 NULL 값을 가장 큰값, SQL Server는 NULL 값을 가장 작은 값으로 간주

- SELECT 문장의 실행순서

  - 옵티마이저가 SQL문장의 SYNTAX, SEMANTIC 에러를 점검하는 순서이기도 함

  ```
  5. SELECT 칼럼명 ALIAS명
  1. FROM 테이블명
  2. WHERE 조건식
  3. GROUP BY 칼럼/표현식
  4. HAVING 그룹조건식
  6. ORDER BY 칼럼/표현식;
  
  1. 발췌 대상 테이블 참조 (FROM)
  2. 발췌 대상 데이터가 아닌 것은 제거 (WHERE)
  3. 행들을 소그룹화 (GROUP BY)
  4. 그룹핑된 값의 조건에 맞는 것만을 출력 (HAVING)
  5. 데이터 값을 출력/계산 (SELECT)
  6. 데이터를 정렬 (ORDER BY)
  ```

  
