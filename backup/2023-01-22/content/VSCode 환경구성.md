---
title: "VSCode 환경구성"
description: "https&#x3A;//code.visualstudio.com/docs/?dv=win 로 이동 ⇒ 바로 다운로드 시작.설치동의 후 다음다음다음총 5개의 체크박스 중 2, 3, 5번 체크 이후 다음설치종료 및 실행기본 확장 프로그램 설치시작 후 나오는 경고 메시지와 환영"
date: 2021-03-22T18:52:51.645Z
tags: ["django"]
---
# 1. VS code 설치

1. [https://code.visualstudio.com/docs/?dv=win](https://code.visualstudio.com/docs/?dv=win) 로 이동 ⇒ 바로 다운로드 시작.
2. 설치
    1. 동의 후 다음

        ![](../images/e571feac-37b9-40e3-8503-79c4a3b8dae1-image.png)

    2. 다음

        ![](../images/ada09a70-c65b-4218-9805-1059062f2608-image.png)

    3. 다음

        ![](../images/d450209d-4cb4-4f59-8aa0-f81449394cae-image.png)

    4. 총 5개의 체크박스 중 2, 3, 5번 체크 이후 다음

        ![](../images/fb5d495b-fa84-421e-9a1a-ef1587c86f79-image.png)

    5. 설치

        ![](../images/d27200c2-e33e-40e1-b4df-df724bb6bb0a-image.png)

    6. 종료 및 실행

        ![](../images/f34109dc-c101-4180-83a3-c3f3cce20af5-image.png)

3. 기본 확장 프로그램 설치
    1. 시작 후 나오는 경고 메시지와 환영페이지는 종료

        ![](../images/15923705-c18f-4fda-971d-4d02dbc96a1f-image.png)

    2. 확장 프로그램 탭에서 **python** 검색 후 python 확장 프로그램 설치

        ![](../images/8bb606d5-f8e1-491c-a040-980918dd439e-image.png)

    3. 확장 프로그램 탭에서 **korean** 검색 후 한국어 언어 팩 설치

        ![](../images/adbafc8b-d69f-4d1f-887a-810f5c17c3b7-image.png)

    4. VS code 재시작 후, 한국어 확인

        ![](../images/e2f3a238-0124-474b-acfc-39787a130c5a-image.png)

        ![](../images/e9247d52-5afc-42cb-a930-ef43c1299be6-image.png)

4. 터미널 변경(이전 단계의 Git 설치 필수)
    1. `ctrl` + `'`(back quote => 키보드 `1` 왼쪽에 위치)를 눌러 터미널 팝업 실행

        ![](../images/b0732743-74a9-4ae0-90b4-c82177d6bea1-image.png)
    2. `1: powershell` 드롭다운 클릭 ⇒ `기본 셸 선택`

        ![](../images/ebd19a21-e49b-4176-9463-c3ae851b8f54-image.png)

    3. Git Bash 선택

        ![](../images/cfeb23cd-6e68-4ba3-89b3-bd8f0060dd22-image.png)

    4. 기존 터미널 종료(휴지통 아이콘 ⇒ 종료, `X` 아이콘 ⇒ 숨겨놓기)

        ![](../images/c217593a-325e-4722-a89d-06c4fc8c9714-image.png)

    5. 다시 `ctrl` + `'를` 눌러 터미널 팝업 실행 ⇒ 변경 확인 후 vscode 종료

        ![](../images/38bdcfe2-6e12-4ed3-9935-dd2b00f494f4-image.png)

5. Python Interpreter 설정(이전 단계의 Python 설치 필수)
    1. `ctrl` + `shift` + `p` 입력

        ![](../images/703ed96a-b09d-43d0-b51a-c8f007955cf4-image.png)

    2. `interpreter` 작성 후 `Python Select Interpreter` 선택

        ![](../images/ab2190de-47df-434c-80cd-ba4468008454-image.png)

    3. 설치 한 Python 선택

        ![](../images/65e0afa0-3978-42a2-bfc8-085536d1b1a7-image.png)

    4. vscode 좌측 하단 Python 확인

        ![](../images/b6b1b8f1-2ee7-458b-b6ec-b298a306c0b4-image.png)
        
        
# 2. web 용 VScode extension 설치
  ## vscode extension 설치

원할한 코드 작성을 위해 아래 3가지 확장 프로그램 설치를 권장합니다.

- 아래 3가지 확장프로그램 검색 후 설치

    ![](../images/85fbe4aa-0cca-4a26-ac70-d8bf9b2ee5e3-image.png)
    ![](../images/ee8fb98c-b0f4-4ff9-a207-91816fcc051c-image.png)

    ![](../images/ad26d32b-9635-45a8-a91e-aa03ba2ed925-image.png)
    ![](../images/2d92fcca-173e-4c64-9e93-5bace8f16b7c-image.png)

---

## vscode tabsize 설정

**[선택사항]**
HTML, CSS 등 WEB 관련 코드의 tabsize는 2paces로 진행 될 예정입니다.
Python 코드만 4spaces를 유지할 수 있도록 아래와 같이 설정합니다.

1. `ctrl + shift + p` → `json`검색 → `Preferences: Open Settings (JSON)` 선택

    ![](../images/e9ba0d1a-62b1-464b-bc0a-bff9ae056909-image.png)

2. 추가 코드 작성

    ![](../images/dbaaf74b-2b4f-4466-a394-d8d321177ea6-image.png)

    생략된 다른 설정 관련 코드는 개인별로 다를 수 있습니다.
  
  
# 3. Django용 extension 설치
## vscode django extension 설치

원할한 코드 작성을 위해 django 확장 프로그램 설치를 권장합니다.

![](../images/2aa41e19-b923-4c9c-9a8f-24a81b0f1c5c-image.png)

---

## django extension 설정


1. `ctrl + shift + p` → `json`검색 → `Preferences: Open Settings (JSON)` 선택

    ![](../images/64a402a0-1984-477d-9a2d-3c56161b890d-image.png)

2. 추가 코드 작성

    ```jsx
    // settings.json

    {
      ... 생략 ...,

      // Django
      **"files.associations": {
        "**/*.html": "html",
        "**/templates/**/*.html": "django-html",
        "**/templates/**/*": "django-txt",
        "**/requirements{/**,*}.{txt,in}": "pip-requirements"
      },
      "emmet.includeLanguages": {
        "django-html": "html"
      }**
    }
    ```
    
## Pylance 설치

 ![](../images/82d32d85-70a1-4439-a676-9e33c269fade-image.png)
 
