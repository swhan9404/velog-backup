---
title: "telegram-bot 설정"
description: "telegram bot 모듈 설치  코드 설명  > msg의 실제 내용 > >  > telepot.glance(msg, long=true) 시 받는 내용 > >  여기까지 된다면 로컬 컴퓨터에서 telegrambot 코드를 실행시 컴퓨터의 cmd 가 켜져있을 경우에 텔레그램 봇이 작동하여 대답을 할 수 있게됨. 다음 AWS 이용으로 내 컴퓨터가 안켜져있어도..."
date: 2021-02-25T07:43:42.868Z
tags: ["telegram_corona","개인프로젝트"]
---
# telegram bot 모듈 설치

```bash
pip install telepot
```

# 코드 설명

```python
import telepot
from telepot.loop import MessageLoop

TOKEN_MAIN = '숫자:영문과숫자로된토큰값'
```

```python
# 봇 구동 알고리즘
def handler(msg) :
    # 메세지에 대한 "제목" 정보 추출, long으로 받으면 상세하게 데이터가 옴
    content_type, chat_type, chat_id, msg_date, msg_id = telepot.glance(msg, long=True)    
    if content_type == 'text' :
        _message = msg['text'] # ???
        if _message[0:1] == '/' : # 명령어
            execommand(_message, chat_id)
        else : # 그 이외 메세지
            echoserver(_message, chat_id, msg['from'])

bot = telepot.Bot(TOKEN_MAIN) # 봇 서비스 연동
bot.message_loop(handler, run_forever=True) # 메세지를 계속 기다리면서 오면 handler 작동
```

> msg의 실제 내용
>
> ```json
> {'message_id': 63, 
>  'from': {'id': 1544010213, 
>           'is_bot': False, 
>           'first_name': '한', 
>           'last_name': '승운', 
>           'language_code': 'ko'}, 
>  'chat': {'id': 1544010213, 
>           'first_name': '한', 
>           'last_name': '승운', 
>           'type': 'private'}, 
>  'date': 1610862128, 
>  'text': 'ㅁㅁ'}
> ```

> telepot.glance(msg, long=true) 시 받는 내용
>
> ```json
> {
>     content_type :text,
>     chat_type: private,
>     chat_id : 1544010213,
>     msg_date : 1610862128,
>     msg_id : 63
> }
> ```


# 여기까지 된다면
- 로컬 컴퓨터에서 telegrambot 코드를 실행시 컴퓨터의 cmd 가 켜져있을 경우에 텔레그램 봇이 작동하여 대답을 할 수 있게됨.
- 다음 AWS 이용으로 내 컴퓨터가 안켜져있어도 코드가 실행되어 봇이 응답할 수 있도록 할것