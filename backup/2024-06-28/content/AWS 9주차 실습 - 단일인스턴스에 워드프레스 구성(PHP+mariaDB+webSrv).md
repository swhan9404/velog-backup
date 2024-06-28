---
title: "AWS 9주차 실습 - 단일인스턴스에 워드프레스 구성(PHP+mariaDB+webSrv)"
description: "실습 목표단일 EC2에 wordpress, mariaDB 를 설치한 이후 워드프레스 구성(WordPress = PHP + mariaDB + Web)할 것웹서버 설치php 설치mariaDB 설치wordPress 설치http&#x3A;//EC2_PublicIP/블로그 첫 "
date: 2021-08-16T11:03:00.683Z
tags: ["aws"]
---
- 실습 목표

  - 단일 EC2에 wordpress, mariaDB 를 설치한 이후 워드프레스 구성

    (WordPress = PHP + mariaDB + Web)




#  EC2 

- 할 것
  - 웹서버 설치
  - php 설치
  - mariaDB 설치
  - wordPress 설치



## 웹서버 설치

```shell
# 관리자 전환
sudo su -

# 설치
yum install httpd -y

# 서비스 실행
systemctl start httpd && systemctl enable httpd

# 웹서버 버전 확인
httpd -v

# 웹 접속하여 확인
http://EC2_PublicIP/
```

![](../images/52622a5b-1b64-4821-917b-b689731e8b9d-image-20210816195009618.png)




## PHP 설치

```shell
# 설치
amazon-linux-extras install php7.4 -y

# PHP 버전 확인
php -v

# PHP Extensions 설치
yum install gcc php-xml php-mbstring php-sodium php-devel php-pear ImageMagick-devel ghostscript -y

# PHP Extensions 정보 확인
php --ini

# PHP Extensions - imagick 설치
## imagick 관련 ini 파일 생성
cat <<EOT> /etc/php.d/40-imagick.ini
; Enable imagick extension module
extension = imagick.so
EOT

# php.ini 파일 수정(아래 pecl 실행 시 필요한 메모리 확보 = 무제한 설정)
sed -i 's/^memory_limit = 128M/memory_limit = -1/g' /etc/php.ini
systemctl restart httpd

## pecl 로 imagick 설치
printf "\n" | pecl install imagick

# php-fpm 재시작으로 imagick 적용
systemctl restart php-fpm
systemctl restart httpd

# PHP Extensions 정보 확인
php --ini

# php info 페이지 생성
echo "<?php phpinfo(); ?>" > /var/www/html/info.php

# php.ini 파일 수정 - 업로드 파일 크기 관련 설정 및 메모리 상향 설정 
sed -i 's/^upload_max_filesize = 2M/upload_max_filesize = 64M/g' /etc/php.ini
sed -i 's/^post_max_size = 8M/post_max_size = 64M/g' /etc/php.ini
sed -i 's/^max_execution_time = 30/max_execution_time = 300/g' /etc/php.ini
sed -i 's/^memory_limit = 128M/memory_limit = 256/g' /etc/php.ini

# php-fpm 재시작으로 적용
systemctl restart php-fpm

# phpinfo.php 웹 접속하여 확인
http://EC2_PublicIP/info.php
```


![](../images/ec3f24d3-f2fc-4a4b-9778-3cc2f5589f28-image-20210816195026246.png)


## MariaDB

```shell
# 다운로드
wget https://ko.wordpress.org/wordpress-latest-ko_KR.zip
wget https://ko.wordpress.org/wordpress-5.8-ko_KR.zip


# 압축 풀기
unzip wordpress-latest-ko_KR.zip

# wp-config.php 파일 복사
cp wordpress/wp-config-sample.php wordpress/wp-config.php

# wp-config.php 파일에 db 접속을 위한 정보 입력
sed -i "s/database_name_here/wordpressdb/g" wordpress/wp-config.php
sed -i "s/username_here/root/g" wordpress/wp-config.php
sed -i "s/password_here/qwe123/g" wordpress/wp-config.php

# wp-config.php 파일에 메모리 상향 설정
cat <<EOT>> wordpress/wp-config.php
define('WP_MEMORY_LIMIT', '256M');
EOT

# 압축 푼 wordpress 파일을 웹 디렉터리에 복사
cp -r wordpress/* /var/www/html/

# 사용자와 권한 설정
chown -R apache /var/www
chgrp -R apache /var/www
chmod 2775 /var/www
find /var/www -type d -exec chmod 2775 {} \;
find /var/www -type f -exec chmod 0664 {} \;

# 서비스 재시작
systemctl restart httpd


```



## 워드프레스 관리자계정만들기

1. http://EC2_PublicIP/

![](../images/e40501f4-266a-47e7-acc4-1e1a03ce8a03-image-20210816195517795.png)

2. 블로그 첫 글 써보기

![](../images/0e3a2331-5b16-4fb1-875c-f6529e920b26-image-20210816195622735.png)