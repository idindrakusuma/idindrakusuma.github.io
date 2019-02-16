---
title: Tutorial Membuat Dokumentasi RESTful API dengan APIdocJS
date: 2017-11-09 18:37:15
tags:
- programmer
- apidocjs
- API
- javascript
categories: tutorial
thumbnail: https://user-images.githubusercontent.com/10141928/32606224-1689a854-c587-11e7-9c53-fb432a3be6c8.png
---
Seperti janji saya pada artikel [Cara Cepat Membuat Dokumentasi API dengan APIDOCjs](https://indrakusuma.web.id/2017/11/07/Cara-Mudah-Membuat-Dokumentasi-API-dengan-apidocjs/), bahwa saya akan membagikan tutorial mengenai bagaimana cara membuat **Dokumentasi RESTful API dengan APIdocJS**. Bagaimana ? kamu tertarik untuk mencobanya ? mari kita simak tutorial berikut ini.
<!-- more -->

## Persiapan
Untuk bisa menggunakan APIDOCjs, kamu membutuhkan `NodeJS` termasuk `npm`, silahkan kamu download dan install di dekstop kamu melalui link berikut https://nodejs.org/en/

Pastikan menggunakan versi terbaru ya! (saat tulisan ini dibuat, versi yang direkomendasikan adalah versi 9.1.0).

Jika sudah di install, coba cek di terminal/cmd kamu dengan perintah `node -v`dan `npm -v`kemudian pastikan hasilnya muncul nomor tertentu seperti gambar dibawah ini.
![Versi Node JS 7.10](https://user-images.githubusercontent.com/10141928/32606226-1706a5de-c587-11e7-96a1-920c12e67880.png)

## Instalasi
Setelah NodeJS dan NPM terpasang dengan baik didekstop kamu, sekarang install `apidocjs` di dekstop kamu dengan cara :
```
npm install -g apidoc
```
Tunggu sampai proses Instalasi selesai.

## Konfigurasi
Setelah proses instalasi `apidoc` selesai, hanya 2 langkah lagi yang perlu kamu siapkan, yaitu :
1. Silahkan buka direktori kamu, dan bikin file `apidoc.json` dan silahkan masukan code berikut dan isi sesuai dengan kebutuhan kamu.
```json
{
  "name": "Judul Dokumentasi API",
  "version": "0.1.0",
  "description": "isi deskripsi disni",
  "apidoc": {
    "title": "isi sesuai kebutuhan",
    "url" : "http://linkapikamu.com"
  }
}
```
2. Sekarang simpan file tersebut dan silahkan buat file baru dengan ekstensi `.js` boleh kamu namai sesukamu. misal saya kasih nama `example.js` dan setelah itu baru kamu isi sesuai dengan `APIdoc-Parameter` sehingga dalam contoh sederhana saya seperti ini.
<script src="https://gist.github.com/idindrakusuma/1f778dd0e4ad79d3bb49b9961a76f375.js"></script>
dan sekarang kita punya dua file seperti berikut ini.
![File Apidoc.json dan Example.js](https://user-images.githubusercontent.com/10141928/32606223-1646f022-c587-11e7-92e9-99515a8eab35.png)

## Finalisasi
Setelah tahap Konfigurasi selesai, sekarang buka terminal kamu pada folder tersebut dan esekusi perintah berikut
```
apidoc
```
![apidoc](https://user-images.githubusercontent.com/10141928/32606224-1689a854-c587-11e7-9c53-fb432a3be6c8.png)
Dan tadaa.. muncul satu folder doc hasil generate dari apidoc dan silahkan buka folder `/doc`dan jalankan file `index.html` melalui browser kamu.
![Hasilnya](https://user-images.githubusercontent.com/10141928/32606225-16c7e15a-c587-11e7-9e1f-171bcd322644.png)

Bagaimana ? sangat mudah dan cepat bukan ? :D semoga bermanfaat ya :) barakallah :)
