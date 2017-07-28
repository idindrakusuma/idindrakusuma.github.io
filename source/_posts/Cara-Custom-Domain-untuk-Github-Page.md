---
title: Cara Custom Domain untuk Github Pages
categories: Tutorial
tags:
- github
- website
thumbnail: https://user-images.githubusercontent.com/10141928/28688098-eb57e040-733a-11e7-9e42-449b2f18c075.png
---
![Cara Custom Domain untuk Github Pages](https://user-images.githubusercontent.com/10141928/28688098-eb57e040-733a-11e7-9e42-449b2f18c075.png)
Salah satu platform blog maupun web yang populer dikalangan programmer adalah [Github Pages](https://pages.github.com/). Github Pages merupakan salah satu layanan dari [Github](http://github.com/) yang memungkinkan programmer untuk memiliki _web page_ pribadi. Layanan ini dihost langsung dari github repositori langsung dengan aturan penamaan repositori _username.github.io_ maka secara otomatis kamu akan punya _github pages_ mu sendiri. Keren bukan ? <!-- more -->

Banyak proyek _opensource_ yang memanfaatkan github pages, salah satunya blog yang penulis gunakan ini. penulis menggunakan platform **HEXO** untuk membangun blog ini dengan template dari **PPOffice**.

Seperti yang penulis jelaskan sebelumnya, bahwa alamat _default_ dari Github Pages adalah _username.github.io_ (username = akun github kamu). Tapi tahukah kamu bahwa Github Pages bisa kamu Custom Domain loh? layaknya website atau blog pada umumnya.

Nah, berikut merupakan _Cara Custom Domain untuk Github Pages_.
## Setting Custom Domain
1. Buka `repository` Github Pages kamu.
2. Klik `Settings`
3. Nah, pada bagian **Github Pages**, masukan nama domain kamu pada `Custom Domain` kemudian klik save.
![Custom Domain for Github Pages](https://user-images.githubusercontent.com/10141928/27169756-665e5abc-51d5-11e7-986a-31ff193c70a2.jpg)

## Setting DNS Domain
Setelah custom domain berhasil disetting, sekarang masuk ke _control panel_ dari Domain kamu, disini saya tunjukan menggunakan clooudflare.
1. Masuk ke menu `DNS` atau `DNS Management` kemudian tambahkan beberapa Record dari IP github berikut,
```
192.30.252.153
192.30.252.154
```
2. Kemudian tambahkan CNAME dengan alias link github pages kamu. Sehingga hasilnya seperti gambar dibawah ini.
![Setting DNS for Github Pages](https://user-images.githubusercontent.com/10141928/27169810-b2fa6d5c-51d5-11e7-8f6c-049ab72a06d4.jpg)

3. Setelah itu, simpan. 

_*Proses perubahan DNS mungkin bisa memakan waktu 5 - 30 menit (terantung penyedia layanan)_

Gimana ? mudah kan ? semoga bermanfaat :)

Referensi : https://www.chenhuijing.com/blog/setting-up-custom-domain-github-pages/