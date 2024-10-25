---
title: "beautifulSoup와 Firebase를 이용한 telegram 알림 구현"
description: "앞에서 데이터 베이스를 Firebase로 구축하고, beautifulSoup를 이용하여 크롤링하는 것을 구현하였다.이제 이를 복합적으로 이용하여 beautifulSoup와 Firebase를 이용한 telegram 알림 구현할 것이다.질병관리본부를 크롤링해서 정보를 가져"
date: 2021-02-25T06:10:32.345Z
tags: ["telegram_corona","개인프로젝트"]
---
# 구현 개요
앞에서 데이터 베이스를 Firebase로 구축하고, 
beautifulSoup를 이용하여 크롤링하는 것을 구현하였다.
이제 이를 복합적으로 이용하여 beautifulSoup와 Firebase를 이용한 telegram 알림 구현할 것이다.

# 구현할 내용
  - 질병관리본부를 크롤링해서 정보를 가져온다.
  - Firebase 데이터베이스에 올려져있는 누적확진자 정보와 크롤링한 정보가 다른지 체크
    - 같다면 : 여기서 작업이 끝난다.
    - 다르다면 : Firebase에 크롤링한 누적확진자 정보를 업데이트하고 밑에 작업이 이어진다.
  - Firebase에서 코로나 정보를 보낼 유저들의 정보를 가져온다.
  - 해당 유저들에게 telegramBot으로 코로나 정보를 보낸다.
  
## 크롤링 관련 부분
```python
    
def getData() :
    # 2. 크롤링
    url = 'http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=11&ncvContSeq=&contSeq=&board_id=&gubun='
    res = requests.get(url).text
    bs = BeautifulSoup(res, 'html.parser')
    # 현재 환자수
    now_patient = int((bs.select_one('#content > div > div.caseTable > div:nth-of-type(1) > ul > li:nth-of-type(1) > dl > dd').text).replace(',',''))
    return now_patient
    
# 3. 텔레그램 연동
def telegram(before_patient, now_patient) : 
    token = '155텔레그램:AAH토큰'
    api_url =f'https://api.telegram.org/bot{token}'
    chat_id_url = f'{api_url}/getUpdates'
    #response = requests.get(chat_id_url).json()

    #chat_ids = set(map(lambda x: x['message']['chat']['id'], response['result'])) # 메세지 보낸 모든 사람들
    chat_ids =[1544010213]
    text= f'증가 확진자 수 :{now_patient-before_patient}\n현재 확진자 수 : {now_patient}'

    for chat_id in chat_ids : 
        message_url = f'{api_url}/sendMessage?chat_id={chat_id}&text={text}'
        response = requests.get(message_url).json()
    
    return

def sendMessageTest(text) :
    token = '155텔레그램:AAH토큰'
    api_url =f'https://api.telegram.org/bot{token}'
    chat_id = 1544010213

    message_url = f'{api_url}/sendMessage?chat_id={chat_id}&text={text}'
    response = requests.get(message_url).json()

    return
 ```
## Firebase 관련부분
```python
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate("./asset/키파일.json") # 키 파일
firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://파이어베이스주소/' #데이터베이스 주소 입력
})

def getData() :
    dir = db.reference('patient')
    # 데이터 베이스 참조 이전 환자수
    before_patient = dir.get() 
    return before_patient

# 1-1. 데이터베이스 접근 후 내용 변경
def updateDataBase(now_patient) :
    dir = db.reference()
    dir.update({
        "patient" : now_patient
    })
    return

def getChatIds() :
    dir=db.reference('chat_ids')
    return dir.get()

def updateChatIds(nowIds) :
    dir=db.reference('chat_ids')
    dir.update({
        'chat_ids' : nowIds
    })
```