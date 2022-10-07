---
title: "colab 런타임 유지 javascript "
description: "f12 - console 에 넣어주면 됨"
date: 2021-08-06T14:40:20.795Z
tags: ["인공지능모듈"]
---
f12 - console 에 넣어주면 됨


```javascript
function ClickConnect(){
    console.log("1분마다 코랩 연결 끊김 방지"); 
    document.querySelector("#top-toolbar > colab-connect-button").shadowRoot.querySelector("#connect-icon").click();
    document.querySelector("#top-toolbar > colab-connect-button").shadowRoot.querySelector("#connect-icon").shadowRoot.querySelector("paper-button").click();
}
setInterval(ClickConnect, 1000 * 60);
```