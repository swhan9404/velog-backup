---
title: "Prometheus를 docker로 구성해보기"
description: "이번에는 일단 prometheus, alertmanager, grafana를 설치하고 작동을 확인하는 것을 할 것이다.디렉토리 설정하기docker-compose.yml 파일이 있는 곳을 (/)로 기준을 잡은 상태로 밑에 내용을 서술/prometheus 안에 /prome"
date: 2022-02-16T12:07:43.796Z
tags: ["프로메테우스"]
---
- 이번에는 일단 prometheus, alertmanager, grafana를 설치하고 작동을 확인하는 것을 할 것이다.

# prometheus

- 디렉토리 설정하기
  1. docker-compose.yml 파일이 있는 곳을 (/)로 기준을 잡은 상태로 밑에 내용을 서술
  2. /prometheus 안에 /prometheus/config, /prometheus/volume 디렉토리 만들기(mkdir)
  3. /prometheus/config 안에는 prometheus.yml 과 rule 들이 들어갈 것임
     - prometheus.yml : [작성법](#prometheusyml)
     - rule.yml: [작성법](#ruleyml)
  4. /prometheus 디렉토리의 권한을 docker에서 수정할 수 있도록 변경
     - `sudo chmod 777 -R  /prometheus`


## docker-compose.yml

```yml
version: '3.7'

services:
  prometheus:
    image: prom/prometheus
    container_name: prometheus
    volumes:
      - ~/prometheus/config/:/etc/prometheus/
      - ~/prometheus/prometheus-volume:/prometheus
    ports:
      - 9090:9090
    command: # web.enalbe-lifecycle은 api 재시작없이 설정파일들을 reload 할 수 있게 해줌
      - '--web.enable-lifecycle'
      - '--config.file=/etc/prometheus/prometheus.yml'
    restart: always
    networks:
      - promnet

networks:
  promnet:
    driver: bridge

```

## prometheus.yml

> https://prometheus.io/docs/prometheus/latest/configuration/configuration/

```yml
# default 값 설정하기 - 여기 부분은 전부 설정 안해줘도 상관없음
global:
  scrape_interval: 15s # scrap target의 기본 interval을 15초로 변경 / default = 1m
  scrape_timeout: 15s # scrap request 가 timeout 나는 길이 / default = 10s
  evaluation_interval: 2m # rule 을 얼마나 빈번하게 검증하는지 / default = 1m

  # Attach these labels to any time series or alerts when communicating with
  # external systems (federation, remote storage, Alertmanager).
  external_labels:
    monitor: 'codelab-monitor' # 기본적으로 붙여줄 라벨
  query_log_file: 로그가저장될파일주소.log # prometheus의 쿼리 로그들을 기록, 없으면 기록안함

# 규칙을 로딩하고 'evaluation_interval' 설정에 따라 정기적으로 평가한다.
rule_files:
  - "rule.yml" # 파일위치는 prometheus.yml 이 있는 곳과 동일 위치
  - "rule2.yml" # 여러개 가능

# 매트릭을 수집할 엔드포인드로 여기선 Prometheus 서버 자신을 가리킨다.
scrape_configs:
  # 이 설정에서 수집한 타임시리즈에 `job=<job_name>`으로 잡의 이름을 설정한다.
  # metrics_path의 기본 경로는 '/metrics'이고 scheme의 기본값은 `http`다
  - job_name: 'monitoring-item' # job_name 은 모든 scrap 내에서 고유해야함
    scrape_interval: 10s # global에서 default 값을 정의해주었기 떄문에 안써도됨
    scrape_timeout: 10s # global에서 default 값을 정의해주었기 떄문에 안써도됨
    metrics_path: '/asdf' # 옵션 - prometheus 가 metrics를 얻기위해 참조하는 uri 를 변경할 수 있음 | default = /metrics
    honor_labels: false # 옵션 - 라벨 충동이 있을경우 라벨을 변경할지설정(false일 경우 라벨 안바뀜) | default = false
    honor_timestamps: false # 옵션 - honor_labels 이 참일 경우, metrics timestamp가 노출됨(true 일경우) | default = false
    scheme: 'http' # 옵션 - request 를 보낼 scheme 설정 | default = http
    params: # 옵션 - request 요청 보낼 떄의 param
      user-id: ['myemail@email.com']

    # 그 외에도 authorization 설정 
    # service discovery 설정(sd)

    # 실제 scrap 하는 타겟에 관한 설정
    static_configs:
      - targets: ['localhost:9090', 'localhost:9100', 'localhost:80'] // prometheus, node-exporter, cadvisor  
        labels: # 옵션 - scrap 해서 가져올 metrics 들 전부에게 붙여줄 라벨
          service : 'monitor-1'
    
    # relabel_config - 스크랩되기 전의 label들을 수정
    # metric_relabel_configs - 가져오는 대상들의 레이블들을 동적으로 다시작성하는 설정(drop, replace, labeldrop)


# Alerting specifies settings related to the Alertmanager.
alerting:
  alert_relabel_configs:
    [ - <relabel_config> ... ]
  alertmanagers:
    [ - <alertmanager_config> ... ]

```

## rule.yml

```shell
groups:
- name: example # 파일 내에서 unique 해야함
  rules:

  # Alert for any instance that is unreachable for >5 minutes.
  - alert: InstanceDown
    expr: up == 0
    for: 5m
    labels:
      severity: page
    annotations:
      summary: "Instance {{ $labels.instance }} down"
      description: "{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 5 minutes."

  # Alert for any instance that has a median request latency >1s.
  - alert: APIHighRequestLatency
    expr: api_http_request_latencies_second{quantile="0.5"} > 1
    for: 10m
    annotations:
      summary: "High request latency on {{ $labels.instance }}"
      description: "{{ $labels.instance }} has a median request latency above 1s (current value: {{ $value }}s)"
```

## 추가로 알면 좋은 정보들

- Prometheus 관련 설정 파일들(prometheus.yml, rule.yml)을 수정 후 적용시키는 법
  - (방법1) docker restart로 껏다 키기
  - (방법2) `curl -X POST http://127.0.0.1:9090/-/reload` 를 통해서 service restart 없이 reload 할 수 있음
    - 다만, 이 방법을 쓰려면 docker-compose up 을 할 떄 `--web.enable-lifecycle` 설정이 들어가있어야함
    - 없을 시, Lifecycle API is not enabled. 에러가 뜨면서 안됨



# alertmanager

> 알람 보내주는 역할


## docker-compose.yml

- 디렉토리 설정하기
  1. docker-compose.yml 파일위치를 (/) 했을 떄 
  2. /alertmanager/config/ 디렉토리 안에
     - alertmanager.yml 작성하기 : [작성법](#alertamangeryml)

```yml
version: '3.7'

services:
  alertmanager:
    image: prom/alertmanager
    container_name: alertmanager
    user: root
    ports: 
      - 9093:9093
    volumes:
      - ./alertmanager/config/:/etc/alertmanager/
    networks:
      - promnet
    restart: always
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
```

## alertamanger.yml

```yml
global: ## default 값 지정해주기
  resolve_timeout: 1m # 이 시간이 지나도록 경고가 업데이트되지 않은 경우 해결되었다고 선언 | default : 5m
  # 옵션 - email 관련 기본값설정
  # 옵션 - slack 관련 기본값

# 템플릿이 있을 경우 템플릿 위치 = alertmanager.yml 위치에서 /templates 안에 만듬
templates:
- '/etc/alertmanager/templates/*.tmpl'

# route는 루우팅 트리와 그 하위 트리의 노드를 정의한다.
# 모든 alert는 최상위 경로에서 라우팅 트리를 들어가며, 하위 노드를 가로지르게 되고, conitnue 가 거짓일 경우 멈추고, 아닌 경우 계속 하위트리의 노드에 일치되는지 검색하게 된다.
route:
  group_by: ['emailAlert'] # prometheus.yml의 targets -labels의 label_name을 의미합니다.
  group_wait: 10s # # inhibit 조건 발생에 대한 중복을 방지하기 위한 알림 발생 전 대기시간 | default = 30s
  group_interval: 300s # 새 알림에 대한 통지를 보내기 전 대기할 시간 | default = 5m
  repeat_interval: 1h # 이미 있는 경우 알림을 다시 보내기전에 대기할 시간 | default = 4h
  receiver: 'email' # 알림 설정 대상

  # routes: # 라우트 대상 설정
  # - match:
  #     alertname: 'test-alram' # alertname이 일치하는 경우 알림 발송 
  #   receiver: 'slack-channel'

receivers:
- name: 'email'
  email_configs:
  - to: 'a@a.com, b@b.com'
    from: 'sender@c.com'
    smarthost: 'email host'
    auth_username: 'login username'
    auth_identity: 'auth idenetity'
    auth_password: 'password'
    send_resolved: true # alert 가 해결됬을 시 알림이 보내지는 설정 | default = false
    # headers:
    #   subject: "Custom Warning: {{ .CommonLabels.job }} container Down"
    # html: '{{ template "email_template.html" . }}'
inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:  # 음소거가 되어야 할 대상
      severity: 'warning'
    equal: ['alertname', 'name'] # value값과 동일한 값을 갖는 경우 inhibit rule 적용

- name: slack-channel
  slack_configs:
  - channel: #monitoring
    icon_url: https://avatars3.githubusercontent.com/u/3380462
    send_resolved: true
    title: '{{ template "custom_title" . }}'
    text: '{{ template "custom_slack_message" . }}'
```

### 템플릿 작성법

- 형식 : tmpl
- 작성법
  - template 안에 {{define "템플릿이름" }} 으로 호출할 이름을 지정해줌
  - {{ end }} 로 템플릿이 종료됨을 명시
- 쓸수있는 함수
  -  {{ range }} 내용 {{ end }}
  -  {{ if 조건문 }} 내용 {{ end }}
     -  eq : =  `{{ if eq .Status "firing" }}`
     -  gt : >  `{{ if gt (len .Alerts.Firing) 0 }}`
     -  lt : <  `{{ if lt (len .Alerts.Resolved) 1}}`
     -  or : `if or (eq (len .Alerts.Firing) 1) (eq (len .Alerts.Resolved) 0)`
     -  and
- 쓸수있는 변수
  -  어노테이션 : {{ .Annotaion.쓸어노테이션 }} 
  -  라벨 : {{ .Labels.쓸라벨 }}
  -  지금온알림상태(firing, resolved) : {{ .Status }}
  -  현재모든알림관련(Firing, Resolved) : {{ .Alerts.상태 }}
  -  다른 템플릿 : {{ template "템플릿명" . }}
- 기본 템플릿 살펴보기
  -  https://github.com/prometheus/alertmanager/blob/main/template/default.tmpl
- 주의사항
  -  email의 경우 네이버 메일, 마음 메일등 대다수의 한국 메일은 `<style>`태그가 먹지 않기 떄문에 다 inline 태그로 해야한다. 
     -  만약, <style> 태그로 작성을 했다면 https://templates.mailchimp.com/resources/inline-css/ 사이트를 이용해보는 것을 추천한다


```go
{{ define "__single_message_title" }}{{ range .Alerts.Firing }}{{ .Labels.alertname }} @ {{ .Annotations.identifier }}{{ end }}{{ range .Alerts.Resolved }}{{ .Labels.alertname }} @ {{ .Annotations.identifier }}{{ end }}{{ end }}


{{ define "custom_title" }}[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}] {{ if or (and (eq (len .Alerts.Firing) 1) (eq (len .Alerts.Resolved) 0)) (and (eq (len .Alerts.Firing) 0) (eq (len .Alerts.Resolved) 1)) }}{{ template "__single_message_title" . }}{{ end }}{{ end }}


{{ define "custom_slack_message" }}
{{ if or (and (eq (len .Alerts.Firing) 1) (eq (len .Alerts.Resolved) 0)) (and (eq (len .Alerts.Firing) 0) (eq (len .Alerts.Resolved) 1)) }}
{{ range .Alerts.Firing }}{{ .Annotations.description }}{{ end }}{{ range .Alerts.Resolved }}{{ .Annotations.description }}{{ end }}
{{ else }}
{{ if gt (len .Alerts.Firing) 0 }}
*Alerts Firing:*
{{ range .Alerts.Firing }}- {{ .Annotations.identifier }}: {{ .Annotations.description }}
{{ end }}{{ end }}
{{ if gt (len .Alerts.Resolved) 0 }}
*Alerts Resolved:*
{{ range .Alerts.Resolved }}- {{ .Annotations.identifier }}: {{ .Annotations.description }}
{{ end }}{{ end }}
{{ end }}
{{ end }}
```

# grafana

> 데이터 시각화 역할

## docker-compose.yml

- 디렉토리 설정하기
  1. docker-compose.yml 파일위치를 (/) 했을 떄 
  2. /grafana/ 디렉토리 안에
     - grafana-init.ini 작성하기 : [작성법](#alertamangeryml)
     - grafana-volume 폴더 만들기 : [작성법](#grafana-initini)


```yml
  grafana:
    image: grafana/grafana
    container_name: grafana
    # user: "$GRA_UID:$GRA_GID"
    ports:
      - 3000:3000
    volumes:
      - ./grafana/grafana-volume:/var/lib/grafana
    restart: always
    networks:
      - promnet
```


# 통합본

> docker-compose.yml

- 만약, prometheus 나 grafana의 volume 디렉토리를 따로 만들고 싶지 않다면
  - `docker volume create prometheus_data`
  - `docker volume create grafana_data`
  - 를 해준다음 밑에 주석 부분들을 활성화시켜주면됨
- 로그인 기본 설정은
  - 아이디 : admin
  - 비밀번호 : admin

```yml
version: '3.7'

# volumes:
#   prometheus_data:
#     external: true
#   grafana_data:
#     external: true

services:
  prometheus:
    image: prom/prometheus
    container_name: prometheus
    volumes:
      - ~/prometheus/config/:/etc/prometheus/
      - ~/prometheus/prometheus-volume:/prometheus # volumes 설정한다면 이부분 주석처리
      # - prometheus_data:/prometheus
    ports:
      - 9090:9090
    command: 
      - '--web.enable-lifecycle'
      - '--config.file=/etc/prometheus/prometheus.yml'
    restart: always
    networks:
      - promnet

  grafana:
    image: grafana/grafana
    container_name: grafana
    depends_on:
      - prometheus
    ports:
      - 3000:3000
    volumes:
      - ~/prometheus/grafana-volume:/var/lib/grafana # volumes 설정한다면 이부분 주석처리
      - ./config/grafana-init.ini:/etc/grafana/grafana.ini
      # - grafana_data:/var/lib/grafana
    restart: always
    networks:
      - promnet

  alertmanager:
    image: prom/alertmanager
    container_name: alertmanager
    user: root
    ports: 
      - 9093:9093
    volumes:
      - ~/prometheus/alertmanager/config/:/etc/alertmanager/
    networks:
      - promnet
    restart: always
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'

networks:
  promnet:
    driver: bridge

```

## 확인하기

- prometheus
  - http://localhost:9090 접속
- grafana
  - http://localhost:3000 접속
- alertmanager
  - http://localhost:9093 접속