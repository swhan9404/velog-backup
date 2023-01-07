---
title: "BeautifulSoup를 이용한 코로나 정보 가져오기"
description: "이용 모듈  질병관리 본부에서 누적 코로나확진자 정보 가져오기  에러 처리 NotImplementedError: Only the following pseudo-classes are implemented: nth-of-type.  해결 방법    selenium을 기반으로한 BequtifulSoap에서는 nth-child 선택자를 지원하지 않습니다. nth-..."
date: 2021-02-25T05:59:32.366Z
tags: ["telegram_corona","개인프로젝트"]
---
# 이용 모듈
```python
import requests
from bs4 import BeautifulSoup
```

# 질병관리 본부에서 누적 코로나확진자 정보 가져오기
```python
url = 'http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=11&ncvContSeq=&contSeq=&board_id=&gubun='
res = requests.get(url).text
bs = BeautifulSoup(res, 'html.parser')
# 현재 환자수
now_patient = int((bs.select_one('#content > div > div.caseTable > div:nth-of-type(1) > ul > li:nth-of-type(1) > dl > dd').text).replace(',',''))
```

# 에러 처리
**NotImplementedError**: Only the following pseudo-classes are implemented: nth-of-type.

- 해결 방법

  selenium을 기반으로한 BequtifulSoap에서는 nth-child 선택자를 지원하지 않습니다. nth-child 선택자 대신 nth-of-type 를 사용하면 됩니다.

  | 변경전 | bs.select('#content > div.article > div.section > div.news_area > div > ul > li:**nth-child(1)** > span > a') |
  | ------ | ------------------------------------------------------------ |
  | 변경후 | bs.select('#content > div.article > div.section > div.news_area > div > ul > li:nth-of-type(1) > span > a') |

  

