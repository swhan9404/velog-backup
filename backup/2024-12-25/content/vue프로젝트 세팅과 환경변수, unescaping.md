---
title: "vue프로젝트 세팅과 환경변수, unescaping"
description: "프로젝트 생성 $ vue create 프로젝트명cd 프로젝트명 으로 폴더 이동vue add router일단 초기화 시키기views > About, Home 삭제 및 나의 vue 만들기router > index.js 의 routes 안에 내용 지우고, 나의 vue 등록c"
date: 2021-05-11T16:36:36.546Z
tags: ["vue"]
---
# 프로젝트 세팅

1. 프로젝트 생성 
   - `$ vue create 프로젝트명`
     - `cd 프로젝트명` 으로 폴더 이동
   - `vue add router`
2. 일단 초기화 시키기
   -  `views > About, Home` 삭제 및 나의 vue 만들기
   -  `router > index.js` 의 routes 안에 내용 지우고, 나의 vue 등록
   -  `components > HelloWorld.vue` 삭제
   -  `App.vue` 에서 About, Home 관련 내용 지우기
      - router-link 부분
3. lodash 설치, axiom
   - `npm i --save lodash, axios`
   - lodash를 쓰고 싶은 곳에서 
     - `import _ from 'lodash'`
     - `import axios from 'axios'`
   - 혹시 다른 사람것을 받아서 사용해야할 경우, 사용했던 라이브러리 세팅할 때
     - `npm i `
4. 서버 키기
   - `npm run serve`




# 환경변수 쓰기

```js
const API_KEY = '키값'
```

- 이런식으로 key 같은 민감한 정보는 코드에 넣으면 안됨
- 그래서 환경변수를 설정해서 보통 사용(따로 파일에다가 분리)




## 사용방법

1. `.env.local` 만들기
   - https://cli.vuejs.org/guide/mode-and-env.html#modes
   - `.env.local` 파일은 gitignore에 자동으로 등록되어 있어서 git에 올라가지 않음
2. `VUE_APP_환경변수명 = 값` 형태로 저장
3. 환경변수 값 가져오기
   - `const API_KEY = process.env.VUE_APP_환경변수명`
4. 서버 껏다가 다시 켜야 적용됨 주의




# unescape

- 웹을 통해서 데이터를 전송할 때 특정 문자들은 특수한 기능으로 사용
  - `http://a.com?변수=변수값&job=programmer `
  - `&`는 하나의 파라미터가 끝나고 다음 파라미터가 온다는 의미
  - 만약 job=programmer&blogger 로 값을 전달하고 싶다면??
    - `&`를 그대로 넘길 경우 시스템은 job의 값을 제대로 인식할 수 없음
- 이런 문제를 회피하기 위해서 다음과 같이 치환
  - & == %26
  - `http://a.com?변수=변수값&job=programmer%26blogger  `
  - 이런 방식으로 시스템에서는 %26을 &로 해석하고 의도대로 해석할 수 있게 됨
  - 이러한 처리를 **이스케이핑(escaping)**이라고 함
- unescape란
  - escape로 이스케이핑 된 문자열을 정상적인 문자열로 되돌려주는 것
- 관련함수
  - escape(내용) : 내용을 escaping 시켜서 반환
  - unescape(내용) : 내용을 unescaping 시켜서 반환

```js
var original = 'http://opentutorials.org/javascript_reference/?id=155&name=안녕하세요'

// 이스케이핑
var before = escape(original);
alert(before); // string, http://opentutorials.org/javascript_reference/?id=155&name=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94

// 언이스케이핑
var after = unescape(before);
alert(after); // string, http://opentutorials.org/javascript_reference/?id=155&name=안녕하세요
```




## lodash 사용해서 해결해보기

1. lodash 사용

   - `import _ from 'lodash'`
   - `_.unescape()` 를 사용하여 unescape

2. filters에 함수 추가

   ```js
     filters : {
       stringUnescape (rawText){
         return _.unescape(rawText)
       }
     },
   ```

3. 적용하려는 것에 filter 적용

   - ``{{ 변수 | stringUnescape}}`

