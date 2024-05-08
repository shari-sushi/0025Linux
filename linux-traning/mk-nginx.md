# サーバーを立てる

[GCP (Google Cloud Platform) の Compute Engine で爆速で Web アプリ環境を用意する全手順](https://qiita.com/tomy0610/items/728f8edb426c1ae39097)
> - GCP でユーザ登録
> ~略~
> - インスタンス作成
> ~略~
> - Web サーバ導入
> 次に、Nginx をインストールする。今回は ContOS7 に入れてるので「[こちら](https://qiita.com/tomy0610/items/0884c77f1ac52957fa96)」の記事を参考にインストールする。 
> これで、http://外部IPアドレス にアクセスして、Web サイトが公開できた。
以上で Web アプリの環境が完成した。あとは、各自のソースコードを適所にデプロイしてあげるだけ

LinuC用、v-kara用の両インスタンスにてOSの確認が取れなかった
(初見の何かを選んだ気がするんだけども→多分debianだ)<br/>
<image src="https://github.com/shari-sushi/0025Linux/assets/127638412/c2f3a434-8865-4c9c-8f9b-c0c66949118a" width="450px" /><br/>
あった？<br/>
<image src="https://github.com/shari-sushi/0025Linux/assets/127638412/d7f69c7e-3570-44d2-a8bb-97581b05e532" width="450px" /><br/>

[【第30回】DebianとUbuntu、CentOSとRHELから学ぶ、Upstreamとの関係](https://pc.watch.impress.co.jp/docs/column/ubuntu/1512815.html)
> Ubuntuに対してDebianは「選択の自由」も重要視している。たとえばDebianはインストール時にデスクトップ環境を選択できるし、Ubuntuに比べるとサポートしているCPUアーキテクチャも多い。使用するソフトウェアを決め打ちすることで、Live環境とインストーラーを同一化させ初心者が悩まないようにしているUbuntuとは対照的だろう。

とりあえず先に進んで、ダメそうならOSが無いor不適合かもという判断をする。

[CentOS7 に Nginx をインストールする](https://qiita.com/tomy0610/items/0884c77f1ac52957fa96)

```sh
$ sudo ls /etc/yum.repos.d/nginx.repo
ls: cannot access '/etc/yum.repos.d/nginx.repo': No such file or directory
sudo vi /etc/yum.repos.d/nginx.repo
```
で作成、書き込みを同時にしたのに権限エラーってまじか。てか空にしても同じエラー。
```sh
E212: Can't open file for writing
```

↓でできた
```
$ mkdir  ./etc/yum.repos.d/
$ touch  ./etc/yum.repos.d/nginx.repo
$ ls  ./etc/yum.repos.d/nginx.repo
$ ls -l ./etc/yum.repos.d/
total 0
-rw-r--r-- 1 [myname] [myname] 0 May  4 06:12 nginx.repo
$ sudo vi /etc/yum.repos.d/nginx.repo
```
書き込んだ内容
```sh
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/mainline/centos/7/$basearch/
gpgcheck=0
enabled=1
```

このあとの操作。
せっかくならシェルスクリプトやりたかったけど、出力を読みってwhileで回してinputを求めるor全てのinputを求めるのに自動でyesの解答するみたいなの書き方調べるのちょっと横道にそれすぎなのでやめた(言い訳)
```
# nginxをインストール (質問は全て「Y」で肯定)
sudo yum install nginx

# バージョンの確認
nginx -v

# 自動起動設定 (初回の場合はシンボリックリンクが作成される)
sudo systemctl enable nginx

# 起動
sudo systemctl start nginx
```
```sh
sudo yum install nginx
sudo: yum: command not found
```

https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q13207829133
> yumは、linuxの中でも、Fedora , RedHat , CentOSなどのディストリビューションで標準として使用されるパッケージ管理ソフトです。
> 
> ですが、あなたのlinuxは恐らくDebian , Ubuntuなどのディストリビューションです。これらのlinuxでのパッケージ管理ソフトではyumではなくaptと言うパッケージ管理ソフトを使用します

なるほど？
```sh
$ sudo apt install yum
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
Package yum is not available, but is referred to by another package.
This may mean that the package is missing, has been obsoleted, or
is only available from another source

E: Package 'yum' has no installation candidate
```
だめなんかい。
```sh
$ sudo apt install nginx
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following additional packages will be installed:
  nginx-common
Suggested packages:
  fcgiwrap nginx-doc ssl-cert
The following NEW packages will be installed:
  nginx nginx-common
0 upgraded, 2 newly installed, 0 to remove and 0 not upgraded.
Need to get 640 kB of archives.
After this operation, 1696 kB of additional disk space will be used.

Do you want to continue? [Y/n] Y
Get:1 file:/etc/apt/mirrors/debian.list Mirrorlist [30 B]
Get:2 https://deb.debian.org/debian bookworm/main amd64 nginx-common all 1.22.1-9 [112 kB]
Get:3 https://deb.debian.org/debian bookworm/main amd64 nginx amd64 1.22.1-9 [527 kB]
Fetched 640 kB in 0s (1438 kB/s)
Preconfiguring packages ...
Selecting previously unselected package nginx-common.
(Reading database ... 67169 files and directories currently installed.)
Preparing to unpack .../nginx-common_1.22.1-9_all.deb ...
Unpacking nginx-common (1.22.1-9) ...
Selecting previously unselected package nginx.
Preparing to unpack .../nginx_1.22.1-9_amd64.deb ...
Unpacking nginx (1.22.1-9) ...
Setting up nginx-common (1.22.1-9) ...
Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service → /lib/systemd/system/nginx.service.
Setting up nginx (1.22.1-9) ...
Upgrading binary: nginx.
Processing triggers for man-db (2.11.2-2) ...
```

lsで確認したところ、
`/lib`にインストールされた気がするけど大丈夫だろうか。

```sh
$ sudo apt install nginx
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
nginx is already the newest version (1.22.1-9).
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
$ nginx -v
-bash: nginx: command not found
```
どういうこっちゃ(↓２行目空 = nginxのコマンドのpathが通ってない)
```
$ echo $nginx

```
コマンドのpathが設定されてないのか？(うろ覚えだけどそんなことを前に教わったような)


debianにnginxをインストールする方法見つけた…

<details><summary>で、うまくいかなかった</summary>
<p>

Linux 公式？: https://nginx.org/en/linux_packages.html#Debian
```sh
$ cat /etc/yum.repos.d/nginx.repo
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/mainline/centos/7/$basearch/
gpgcheck=0
enabled=1

$ nginx -v
-bash: nginx: command not found
$ sudo apt install curl gnupg2 ca-certificates lsb-release debian-archive-keyring
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
curl is already the newest version (7.88.1-10+deb12u5).
ca-certificates is already the newest version (20230311).
lsb-release is already the newest version (12.0-1).
lsb-release set to manually installed.
debian-archive-keyring is already the newest version (2023.3+deb12u1).
The following NEW packages will be installed:
  gnupg2
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 445 kB of archives.
After this operation, 464 kB of additional disk space will be used.
Do you want to continue? [Y/n] Y
Get:1 file:/etc/apt/mirrors/debian.list Mirrorlist [30 B]
Get:2 https://deb.debian.org/debian bookworm/main amd64 gnupg2 all 2.2.40-1.1 [445 kB]
Fetched 445 kB in 0s (1382 kB/s)
Selecting previously unselected package gnupg2.
(Reading database ... 67221 files and directories currently installed.)
Preparing to unpack .../gnupg2_2.2.40-1.1_all.deb ...
Unpacking gnupg2 (2.2.40-1.1) ...
Setting up gnupg2 (2.2.40-1.1) ...
Processing triggers for man-db (2.11.2-2) ...
$ ls /usr/share/keyrings/nginx-archive-keyring.gpg
ls: cannot access '/usr/share/keyrings/nginx-archive-keyring.gpg': No such file or directory
$ curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1561  100  1561    0     0   2500      0 --:--:-- --:--:-- --:--:--  2501
$ gpg --dry-run --quiet --no-keyring --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg
pub   rsa2048 2011-08-19 [SC] [expires: 2024-06-14]
      573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
uid                      nginx signing key <signing-key@nginx.com>

$ echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/debian `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/debian bookworm nginx
$ ls /etc/apt/preferences.d/99nginx
ls: cannot access '/etc/apt/preferences.d/99nginx': No such file or directory
$ echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
    | sudo tee /etc/apt/preferences.d/99nginx
Package: *
Pin: origin nginx.org
Pin: release o=nginx
Pin-Priority: 900

$ ^C
$ sudo apt update
Get:1 file:/etc/apt/mirrors/debian.list Mirrorlist [30 B]
Get:5 file:/etc/apt/mirrors/debian-security.list Mirrorlist [39 B]                               
Get:7 https://packages.cloud.google.com/apt google-compute-engine-bookworm-stable InRelease [1321 B]
Get:8 https://packages.cloud.google.com/apt cloud-sdk-bookworm InRelease [6406 B]                
Get:2 https://deb.debian.org/debian bookworm InRelease [151 kB]                                  
Get:9 http://nginx.org/packages/debian bookworm InRelease [2860 B]                               
Get:10 https://packages.cloud.google.com/apt google-compute-engine-bookworm-stable/main all Packages [2830 B]
Get:11 https://packages.cloud.google.com/apt google-compute-engine-bookworm-stable/main amd64 Packages [3128 B]
Get:3 https://deb.debian.org/debian bookworm-updates InRelease [55.4 kB]
Get:4 https://deb.debian.org/debian bookworm-backports InRelease [56.5 kB]
Get:12 https://packages.cloud.google.com/apt cloud-sdk-bookworm/main amd64 Packages [482 kB]
Get:6 https://deb.debian.org/debian-security bookworm-security InRelease [48.0 kB]
Get:13 http://nginx.org/packages/debian bookworm/nginx amd64 Packages [7975 B]
Get:14 https://deb.debian.org/debian bookworm-updates/main Sources.diff/Index [10.6 kB]
Get:15 https://deb.debian.org/debian bookworm-updates/main amd64 Packages.diff/Index [10.6 kB]
Get:16 https://deb.debian.org/debian bookworm-updates/main Translation-en.diff/Index [10.6 kB]
Get:17 https://deb.debian.org/debian bookworm-updates/main Sources T-2024-04-23-2036.10-F-2024-04-23-2036.10.pdiff [831 B]
Get:18 https://deb.debian.org/debian bookworm-updates/main amd64 Packages T-2024-04-23-2036.10-F-2024-04-23-2036.10.pdiff [1595 B]
Get:17 https://deb.debian.org/debian bookworm-updates/main Sources T-2024-04-23-2036.10-F-2024-04-23-2036.10.pdiff [831 B]
Get:18 https://deb.debian.org/debian bookworm-updates/main amd64 Packages T-2024-04-23-2036.10-F-2024-04-23-2036.10.pdiff [1595 B]
Get:22 https://deb.debian.org/debian bookworm-updates/main Translation-en T-2024-04-23-2036.10-F-2024-04-23-2036.10.pdiff [2563 B]
Get:22 https://deb.debian.org/debian bookworm-updates/main Translation-en T-2024-04-23-2036.10-F-2024-04-23-2036.10.pdiff [2563 B]
Get:19 https://deb.debian.org/debian bookworm-backports/main Sources.diff/Index [63.3 kB]
Get:20 https://deb.debian.org/debian bookworm-backports/main amd64 Packages.diff/Index [63.3 kB]
Get:21 https://deb.debian.org/debian bookworm-backports/main Translation-en.diff/Index [63.3 kB]
Get:26 https://deb.debian.org/debian bookworm-backports/main Sources T-2024-05-04-2020.06-F-2024-04-15-2018.42.pdiff [19.4 kB]
Get:26 https://deb.debian.org/debian bookworm-backports/main Sources T-2024-05-04-2020.06-F-2024-04-15-2018.42.pdiff [19.4 kB]
Get:27 https://deb.debian.org/debian bookworm-backports/main amd64 Packages T-2024-05-04-0204.48-F-2024-04-15-2018.42.pdiff [17.5 kB]
Get:27 https://deb.debian.org/debian bookworm-backports/main amd64 Packages T-2024-05-04-0204.48-F-2024-04-15-2018.42.pdiff [17.5 kB]
Get:28 https://deb.debian.org/debian bookworm-backports/main Translation-en T-2024-05-01-1413.56-F-2024-04-19-2009.49.pdiff [7671 B]
Get:28 https://deb.debian.org/debian bookworm-backports/main Translation-en T-2024-05-01-1413.56-F-2024-04-19-2009.49.pdiff [7671 B]
Get:23 https://deb.debian.org/debian-security bookworm-security/main Sources [92.2 kB]
Get:24 https://deb.debian.org/debian-security bookworm-security/main amd64 Packages [156 kB]
Get:25 https://deb.debian.org/debian-security bookworm-security/main Translation-en [94.9 kB]
Fetched 1431 kB in 1s (986 kB/s)                                   
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
6 packages can be upgraded. Run 'apt list --upgradable' to see them.
$ sudo apt install nginx
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following packages will be REMOVED:
  nginx-common
The following packages will be upgraded:
  nginx
1 upgraded, 0 newly installed, 1 to remove and 5 not upgraded.
Need to get 1015 kB of archives.
After this operation, 1818 kB of additional disk space will be used.
Do you want to continue? [Y/n] Y
Get:1 http://nginx.org/packages/debian bookworm/nginx amd64 nginx amd64 1.26.0-1~bookworm [1015 kB]
Fetched 1015 kB in 1s (1124 kB/s)
Reading changelogs... Done
dpkg: nginx-common: dependency problems, but removing anyway as you requested:
 nginx depends on nginx-common (<< 1.22.1-9.1~).
 nginx depends on nginx-common (>= 1.22.1-9).
 nginx depends on nginx-common (<< 1.22.1-9.1~).
 nginx depends on nginx-common (>= 1.22.1-9).

(Reading database ... 67228 files and directories currently installed.)
Removing nginx-common (1.22.1-9) ...
(Reading database ... 67205 files and directories currently installed.)
Preparing to unpack .../nginx_1.26.0-1~bookworm_amd64.deb ...
Unpacking nginx (1.26.0-1~bookworm) over (1.22.1-9) ...
Setting up nginx (1.26.0-1~bookworm) ...
Installing new version of config file /etc/default/nginx ...
Installing new version of config file /etc/init.d/nginx ...
Installing new version of config file /etc/logrotate.d/nginx ...
Installing new version of config file /etc/nginx/fastcgi_params ...
Installing new version of config file /etc/nginx/mime.types ...
Installing new version of config file /etc/nginx/nginx.conf ...
Processing triggers for man-db (2.11.2-2) ...
$ nginx -v
-bash: nginx: command not found

---

</p>
</details> 

```


---

sentOSでインスタンス作ったらyumコマンドは使えた。


---
今回はGCEにデプロイすることが目的なのでサーバー比較してないけど、時間余れば比較したい
[NginxとApacheの違い─2つの定番ウェブサーバーを詳しく比較](https://kinsta.com/jp/blog/nginx-vs-apache/)
[ApacheとNginxについて比較](https://qiita.com/kamihork/items/49e2a363da7d840a4149)
[NginxとApacheを比較解説！メリット・デメリットも紹介](https://www.geekly.co.jp/column/cat-technology/1903_096/)