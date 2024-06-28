---
title: "프로젝트 트러블슈팅 - vue_router문제"
description: "상황movie_detail에서 추천 영화 리스트의 영화의 정보를 다시 들어가면, 같은 name의 router 주소의 view를 가리키고 있어서 페이지 전환이 일어나지 않음동적 라우팅 매칭 문제라우트를 동일 컴포넌트에 매핑하기 때문에 발생파라미터 변경 사항에 반응하게 만"
date: 2021-06-22T01:06:33.753Z
tags: ["vue","프로젝트Moya"]
---
# 문제정의

- 상황
  - movie_detail에서 추천 영화 리스트의 영화의 정보를 다시 들어가면, 같은 name의 router 주소의 view를 가리키고 있어서 페이지 전환이 일어나지 않음



# 문제의 분석

- 동적 라우팅 매칭 문제
  - 라우트를 동일 컴포넌트에 매핑하기 때문에 발생
  - 파라미터 변경 사항에 반응하게 만들어야함



## router의 매칭패턴 바꾸기

- router의 변경감지는 `/user/foo`에서 `/user/bar`를 이동할 때 동일한 컴포넌트 인스턴스를 재사용하게 됨

- `App.vue` 에서 
  - `<router-view :key="$route.fullPath"/>`
  - 이거 넣어주면 주소값 전체를 전부보고, 변화가 있을 시 router가 작동하게 됨



### 스크롤 위치 변경

- 문제
  - 동일한 route name이어도 페이지가 바뀌도록 수정은 되었지만, 
  - 스크롤이 아래 내려간 상태로 페이지가 바뀌어서 사용성에 문제가 생김
- 해결방법
  - `router > index.js ` 에서 페이지 이동 시 항상 맨 위로 scroll을 이동하게 만듬
  - 밑에 네비게이션 가드로 더 상세 설명

```js
router.afterEach(() => {
  window.scrollTo(0,0);
})
```



## watch 이용 - 더 나음

- watch를 이용하면 동일한 컴포넌트를 랜더링하므로, 이전 인스턴스를 삭제한다음 새 인스턴스를 만드는 것 보다 효율적

- 그러나, 컴포넌트의 라이프 사이클 훅이 호출되지 않음을 의미

```javascript
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // 경로 변경에 반응하여...
    }
  }
}
```



### 혹은 beforeRouteUpdate 사용

- vue-router 2.2 버전부터 사용가능

```js
const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // route가 변경할 때 작동함
    // don't forget to call next()
  }
}
```



# 더 나아가기 - 네비게이션 가드

- https://router.vuejs.org/kr/guide/advanced/navigation-guards.html

- 전체 네비게이션 시나리오
  1. 네비게이션이 트리거됨.
  2. 비활성화될 컴포넌트에서 가드를 호출.
  3. 전역 `beforeEach` 가드 호출.
  4. 재사용되는 컴포넌트에서 `beforeRouteUpdate` 가드 호출. (2.2 이상)
  5. 라우트 설정에서 `beforeEnter` 호출.
  6. 비동기 라우트 컴포넌트 해결.
  7. 활성화된 컴포넌트에서 `beforeRouteEnter` 호출.
  8. 전역 `beforeResolve` 가드 호출. (2.5이상)
  9. 네비게이션 완료.
  10. 전역 `afterEach` 훅 호출.
  11. DOM 갱신 트리거 됨.
  12. 인스턴스화 된 인스턴스들의 `beforeRouteEnter`가드에서 `next`에 전달 된 콜백을 호출합니다.

undefined