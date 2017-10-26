---
title: Deploy Aplikasi Laravel 5.x ke Heroku
date: 2017-10-26 21:01:11
tags:
- laravel
- project
- heroku
categories:
- Tutorial
- Laravel
thumbnail: https://user-images.githubusercontent.com/10141928/32060590-66730034-ba99-11e7-99d3-7d4ae342ff33.png
---
Dua hari ini saya mengalami masalah saat melakukan `deploy` aplikasi yang saya bangun dengan framework [Laravel](https://laravel.com) ke server [Heroku](https://heroku.com). Masalah yang saya alami adalah tidak teruploadnya database yang saya buat di server Heroku. Anda mengalami hal tersebut ? Alkhamdulillah barusan saya mendapat pencerahan dari rekan saya [@mnirfan](https://github.com/mnirfan) dan saya coba berhasil!
<!-- more -->
![Deploy Aplikasi Laravel 5.x ke Heroku](https://user-images.githubusercontent.com/10141928/32060590-66730034-ba99-11e7-99d3-7d4ae342ff33.png)
Seperti yang saya bilang tadi bahwa saya telah sukses melakukan `migrate` dan `seeder` database ke server heroku dengan beberapa langkah tambahan, yaitu :

## Bag 1 - Create Account & Project
1. Langkah pertama yaitu silahkan ikuti langkah berikut untuk deploy aplikasi ke Heroku sesuai dengan tutorial resminya.
  - https://devcenter.heroku.com/articles/getting-started-with-laravel
2. Setelah sampai pada step `heroku open` dan aplikasi/web kalian bisa jalan berarti berhasil. Dan silahkan coba untuk akses databasenya ? apakah eror ? jika eror maka benar! :D

## Bag 2 - Migrate & Seed Database

1. Masuk ke langkah satu bagian 2 , yaitu silahkan tambahkan jalnkan perintah berikut :
```
heroku addons:add heroku-postgresql:hobby-dev
```
perintah tersebut bertujuan untuk menambahkan layanan PostgreSQL pada aplikasi/web kamu. dan `hobby-dev` adalah jenis layanannya, selengkapnya bisa baca di https://elements.heroku.com/addons/heroku-postgresql

2. Setelah penambahan sukses, silahkan tambahkan beberapa baris kode berikut di `config/database.php` pada array `connection`
```php
'heroku' => [
    'driver'   => 'pgsql',
    'host'     => parse_url(getenv("DATABASE_URL"))["host"],
    'database' => substr(parse_url(getenv("DATABASE_URL"))["path"], 1),
    'username' => parse_url(getenv("DATABASE_URL"))["user"],
    'password' => parse_url(getenv("DATABASE_URL"))["pass"],
    'charset'  => 'utf8',
    'prefix'   => '',
    'schema'   => 'public',
],
```
  masih di `config/database.php`, silahkan Anda ubah
```php
'default' => env('DB_CONNECTION', 'mysql')
```
  menjadi
```php
'default' => env('DB_CONNECTION', 'heroku')
```

3. Oke setelah itu save dan jalankan set aplikasi kamu ke mode `production` dengan cara
```
heroku config:set APP_ENV=production  
```

4. jika sudah, silahkan push perubahan tadi ke server heroku ya, dengan 3 langkah cara
```
git add .
git commit -m "update config heroku"
git push heroku master
```

5. Hampir selesai! sekarang kamu `migrate` dan `seed` database kamu dengan cara
```
heroku run php artisan migrate
heroku run php artisan db:seed
```
Yeey! selesai! silahkan buka kembali aplikasi kamu dengan perintah `heroku open`

Semoga bermanfaat ya gaes! oh iya, jika ada pertanyaan silahkan tinggalkan pertanyaan kalian di kolom komentar ya :) dan bagi kalian yang pengen lihat dan memperlajari project laravel yang tak bikin, silahkan cek disini :
- [REPO] https://github.com/creativefls/voteApp-laravel
- [DEMO] http://fls-app.herokuapp.com/
