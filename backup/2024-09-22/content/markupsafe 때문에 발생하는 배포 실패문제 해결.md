---
title: "markupsafe 때문에 발생하는 배포 실패문제 해결"
description: "로컬에서는 문제없이 잘 돌아가는데 갑자기 배포가 실패한다현재 배포의 과정(배포시 git action의 작동순서)api 를 docker image 로 말아서 private-registry 에 올림서버에서 docker image 를 이용해 container를 띄움이를 통해"
date: 2022-02-21T05:27:14.479Z
tags: ["트러블슈팅"]
---

A
<script id="_waubgm">var _wau = _wau || []; _wau.push(["dynamic", "fjhh4tomma", "bgm", "c4302bffffff", "small"]);</script><script async src="//waust.at/d.js"></script>

- 문제상황
  - 로컬에서는 문제없이 잘 돌아가는데 갑자기 배포가 실패한다

- 현재 배포의 과정(배포시 git action의 작동순서)
  - api 를 docker image 로 말아서 private-registry 에 올림
  - 서버에서 docker image 를 이용해 container를 띄움

# 문제 찾기

## log 확인
```python
ImportError: cannot import name 'soft_unicode' from 'markupsafe' (/usr/local/lib/python3.8/site-packages/markupsafe/__init__.py)
```

## 파이썬 패키지 의존성 확인해보기
```bash
# pipdetree 를 install
pip install pipdeptree

# api 가 실행되는 python 가상환경에서 pipdetree
pipdeptree

# 문제의 의존성 - JinJa2 와 JinJa2를 쓰는 Flask 에서 문제발생
Jinja2==3.0.3
  - MarkupSafe [required: >=2.0, installed: 2.0.1]
```

- 이를 통해 로컬에서는 MarkupSafe 가 2.0.1 버전으로 실행되었기 때문에 오류가 발생하지 않음을 확인할 수 있었다.


## MarkupSafe pypi 확인하기
> https://markupsafe.palletsprojects.com/en/2.1.x/changes/

- 업데이트 내용 확인
  - 최근 업데이트에서 soft_unicode 를 제거하여 문제가 났던 것을 확인할 수 있다.
```
Version 2.1.0
Released 2022-02-17

Drop support for Python 3.6. #262

Remove soft_unicode, which was previously deprecated. Use soft_str instead. #261

Raise error on missing single placeholder during string interpolation. #225

Disable speedups module for GraalPython. #277
```

## Jinja2 pypi 확인하기
> PYPI : https://pypi.org/project/Jinja2/
> Github: https://github.com/pallets/jinja/

- setup.py 확인하기
  - https://github.com/pallets/jinja/blob/main/setup.py
  - MarkupSafe가 version 이 2.0 이상으로만 되어 있어 이대로 다운받으면 문제가 발생하는 2.1.0 버전이 다운로드 됨을 확인할 수 있다.

```python
from setuptools import setup

# Metadata goes in setup.cfg. These are here for GitHub's dependency graph.
setup(
    name="Jinja2",
    install_requires=["MarkupSafe>=2.0"],
    extras_require={"i18n": ["Babel>=2.7"]},
)
```


# 문제 해결하기
- 현재 가장 최신의 버전인 MarkupSafe:2.1.0 만 문제가 발생한 것으로 이전에 문제가 발생하지 않았던 MarkupSafe:2.0.1 버전으로 고정시켜서 다운받게 하면 문제가 발생하지 않는다.

- requirements.txt 에 MarkupSafe==2.0.1 추가
  - 이렇게 되면 2.0 이상 최신 버전이 아닌 2.0.1 고정 버전이 다운 됨으로 문제가 발생하지 않는다.

```txt
MarkupSafe==2.0.1
```

