---
title: "Nginx로 같은 도메인에 prometheus, alertmanager, grafana 띄우기"
description: "이전 글을 참조하여 prometheus를 설치하게 되면, 로컬호스트로 접근을 할 수는 있으나, 클라우드나 외부 컴퓨터에 켜놓고 접근하는 것은 해당 포트들을 전부 열어 놓는 설정부터 다 해야하기 떄문에 불편하다.(https는 또 복잡한 내용이 추가되니 http로만 먼저 "
date: 2022-02-20T23:38:35.326Z
tags: ["프로메테우스"]
---
이전 글을 참조하여 prometheus를 설치하게 되면, 로컬호스트로 접근을 할 수는 있으나, 

클라우드나 외부 컴퓨터에 켜놓고 접근하는 것은 해당 포트들을 전부 열어 놓는 설정부터 다 해야하기 떄문에 불편하다.
(https는 또 복잡한 내용이 추가되니 http로만 먼저 연결)

그래서 nginx 를 추가하여 http 요청이 들어오면 URL 에 따라서 요청을 나눠주는역할을 하게 할 것이다. (reverse proxy)

- 목표
  - http://주소/ : prometheus 로 연결
  - http://주소/alertmanager : alertmanager 로 연결
  - http://주소/grafana : grafana로 연결

# docker-compose.yml
- 이전 글과의 차이점
  - nginx 추가
  - grafana
    - grafana-init.ini 파일 추가
  - alertmanager 
    - command 에 listen-address, external-url, route-prefix 설정 추가


```yml
version: '3'
services:
  proxy:
    container_name: proxy
    image: nginx:latest
    ports:
      - '80:80' # common web
      # - '443:443' # https
    networks:
      - promnet
    volumes:
      - ./proxy/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./proxy/web.conf:/etc/nginx/web.conf:ro
      # - ./proxy/server-https-common.conf:/etc/nginx/server-https-common.conf:ro
      # - /etc/letsencrypt/live/사이트이름:/etc/ssl:ro
    depends_on:
      - prometheus
      - grafana
      - alertmanager
  
  prometheus:
    image: prom/prometheus
    container_name: prometheus
    hostname: prometheus
    volumes:
      - ./prometheus/config/:/etc/prometheus/
      - ./prometheus/prometheus-volume:/prometheus
    ports:
      - 9090:9090
    command: 
      - '--web.enable-lifecycle'
      - '--config.file=/etc/prometheus/prometheus.yml'
    restart: always

  grafana:
    image: grafana/grafana
    container_name: grafana
    hostname: grafana
    depends_on:
      - prometheus
    ports:
      - 3000:3000
    networks:
      - promnet
    volumes:
      - ./grafana/grafana-volume:/var/lib/grafana
      - ./grafana/grafana-init.ini:/etc/grafana/grafana.ini
    restart: always

  alertmanager:
    image: prom/alertmanager
    container_name: alertmanager
    hostname: alertmanager
    user: root
    ports: 
      - 9093:9093
    volumes:
      - ./alertmanager/config/:/etc/alertmanager/
    restart: always
    networks:
      - promnet
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--web.listen-address=0.0.0.0:9093'
      - '--web.external-url=http://외부에서들어올주소/alertmanager/'
      - '--web.route-prefix=/alertmanager/'

networks:
  promnet:
    driver: bridge

```

## nginx 관련 설정
- 파일 설정 (docker-compose.yml 파일의 위치를 '/' 로 기준잡음)
  1. /proxy/ 폴더 안에 밑에 파일을 만듬
     - nginx.conf
     - web.conf

### nginx.conf

- nginx 의 기본 설정 부분
  - logging과 work process 그리고 http압축을 설정

```conf
user nginx;
worker_processes 1;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;
events {
    worker_connections 1024;
}
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 웹 설정하는 부분
    include /etc/nginx/web.conf;

    # 로그 파일에 대한 포맷을 설정해주는 부분
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
    '$status $body_bytes_sent "$http_referer" '
    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;
    
    # https://www.lesstif.com/system-admin/nginx-http-413-client-intended-to-send-too-large-body-86311189.html
    client_max_body_size 8M; 

    # gzip configuration
    gzip on;
    gzip_disable "msie6";
    gzip_min_length 10240;
    gzip_buffers 32 32k;
    gzip_comp_level 9;
    gzip_proxied any;
    gzip_types text/plain application/javascript application/x-javascript text/javascript text/xml text/css;
    gzip_vary on;

    sendfile on;
    keepalive_timeout 65;
}
```

### web.conf

- reverse proxy 설정 부분
  - upstream으로 동작중인 서버 목록을 넣어줌
  - grafana가 websocket 방식으로 계속 정보를 수신하기 떄문에 http upgrade를 해줌

```conf
upstream @prometheus {
    server prometheus:9090;
}

upstream @alertmanager {
    server alertmanager:9093;
}

upstream @grafana {
    server grafana:3000;
}

map $http_upgrade $connection_upgrade {
  default upgrade;
  '' close;
}

server {
    listen 80;
    # listen [::]:80;

    server_name 외부접근주소;

    # include /etc/nginx/server-https-common.conf;
    
    location /alertmanager/ {
        gzip_types *;
        proxy_pass http://@alertmanager/alertmanager;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Host $server_name;
        proxy_set_header   X-Forwarded-Server $host;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_redirect     off;
    }

    location /grafana {
        proxy_pass http://@grafana/;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Host $server_name;
        proxy_redirect     off;
    }

    location /grafana/api/live {
        proxy_pass http://@grafana/;
        rewrite  ^/grafana/(.*)  /$1 break;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $http_host;
    }

    location / {
        proxy_pass http://@prometheus/;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Host $server_name;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Forwarded-Server $host;
        proxy_redirect     off;
    }

}

```

## grafana-init.ini
- default 파일
  - https://github.com/grafana/grafana/blob/main/conf/defaults.ini
- 밑에 부분만 바꿔서
  - ./grafana/ 위치에 grafana-init.ini 으로 만들어줌

```yml
domain = 외부접근주소
root_url = %(protocol)s://%(domain)s:%(http_port)s/grafana/
serve_from_sub_path = true
```


# 확인 방법
1. `docker exec -it proxy bash` 를 통해서 proxy container 로 들어가기
2. `curl prometheus:9090/metrics` 로 prometheus 로 http 통신이 되는지 확인하기
    - `cat /etc/hosts` 에서는 prometheus가 안나오지만, 
    - 설정을 하지 않으면 docker-compose 안에 있는 service는 하나의 네트워크(bridge모드)로 엮이게 되는데 이 네트워크에 있으면 docker container name을 통해서 서로의 container에 접속 가능하다.
3. 밖으로 나와서 자신의 크롬을 켜서 밑의 주소들이 잘 접속되는지 확인
    - `http://localhost/` : 프로메테우스
    - `http://localhost/alertmanager/` : alertmanager
    - `http://localhost/grafana` : grafana