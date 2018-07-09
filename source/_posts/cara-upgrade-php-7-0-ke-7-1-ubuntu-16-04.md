---
title: Cara Upgrade PHP 7.0 ke Versi 7.1 di Linux Ubuntu 16.04
date: 2018-04-06 21:05:16
categories: development
tags: 
- php 
- laravel
- ubuntu
thumbnail: https://user-images.githubusercontent.com/10141928/38428090-2609ea6e-39e5-11e8-9e9e-5b57c0a6d5e2.png
---
Assalamualaikum Sobat! kemaren lusa, saya mengalami _problem_ saat mau _install project_  dengan framework Laravel. Usut punya usut, _problem_ yang saya alami dikarenakan versi PHP yang terpasang pada Linux Ubuntu 16.04 saya adalah php versi 7.0.x dan itu tidak memenuhi versi minimum dari Laravel 5.6. Sudah saya coba dengan dengan perintah `sudo apt-get dist-upgrade` tetapi versinya tetap sama, terus bagaimana caranya?
<!-- more -->
![Cara Upgrade PHP 7.0 ke Versi 7.1 di Linux Ubuntu 16.04](https://user-images.githubusercontent.com/10141928/38428089-25cca406-39e5-11e8-90ae-e5ae1dbb347d.png)

Dari berbagai cara yang saya temukan setelah berselancar didunia maya, saya menemukan cara yang pas dan tepat untuk bisa upgrade ke versi PHP 7.1, berikut caranya.
## Menambahkan Repositori dari Ondrejs PPA
PPA's or _Personal Package Archive_ merupakan sebuah kumpulan paket _software_ yang tidak dimasukan kedalam sistem operasi Ubuntu secara _default_. Biasanya, satu repositori PPA fokus pada satu program aplikasi, tetapi tentu saja bisa lebih, tergantung dengan orang yang me-_maintaince_-nya. PPA dari **Ondrejs** atau Ondřej Surý menawrkan PHP versi 7.1, berikut cara menambahkannya.
- Buka **Terminal** atau tekan **CTRL+ALT+T** 
- kemudian jalankan dua perintah berikut ini.
```bash
$ sudo add-apt-repository ppa:ondrej/php
$ sudo apt-get update
```
## Install PHP 7.1
Langkah selanjutnya adalah dengan menginstall PHP 7.1, dengan cara menjalankan dua perintah berikut:
```bash
$ service apache2 stop
$ sudo apt-get install php7.1 php7.1-common
```
Nah, karena PHP 7.1 perlu berbagai extension, maka kamu harus pasang juga _extension_nya dengan cara menjalankan perintah berikut:
```bash
$ sudo apt-get install php7.1-curl php7.1-xml php7.1-zip php7.1-gd php7.1-mysql php7.1-mbstring
```
Oke, jika prosesnya sudah selesai, silahkan kamu cek versi PHP sekarang dengan cara:
```bash
$ php -v
```
Jika prosesnya berjalan dengan baik, maka akan muncul text berikut pada baris pertama.
```
PHP 7.1.16-1+ubuntu16.04.1+deb.sury.org+1 (cli) (built: Apr  5 2018 08:47:00) ( NTS )
```
## Sekarang, Hapus PHP 7.0
Karena kita telah berhasil memasang PHP 7.1 pada Linux Ubuntu 16.04 kita, sekarang kita hapus versi PHP 7.0, dengan cara:
```bash
$ sudo apt-get purge php7.0 php7.0-common
```
Biar hasilnya sempurnya, silahkan restart pc kamu, dengan cara:
```bash
$ sudo shutdown -r now
```
## Terakhir, Jadikan PHP 7.1 agar Digunakan Apaache
Kita harus memberitahu Apache untuk menggunakan PHP 7.1 secara _default_ dengan cara:
```bash
$ a2enmod php7.1
$ service apache2 restart
```
Begitulah _Cara Upgrade PHP 7.0 ke Versi 7.1 di Linux Ubuntu 16.04_, Jika kamu mengalami masalah, silahkan tanyakan via kolom komentar atau kamu kontak di email id.indrakusuma@gmail.com

---
Artikel ini sebelumnya pernah ditulis dalam bahasa inggris oleh:
- Jakel Price, https://jakelprice.com/article/how-to-upgrade-from-php-70-to-php-71

