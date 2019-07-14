---
title: Meningkatkan Produktifitas Development dengan Husky dan lint-staged
date: 2019-07-14 17:02:38
categories: development
tags:
- programmers
- developer
- javascript
thumbnail: https://user-images.githubusercontent.com/10141928/61183983-61467200-a672-11e9-950f-52286c5fb3b6.jpg
---

Menjadi seorang developer di masa sekarang ini menuntut kita untuk melakukan segala sesuatu dengan cepat dan tepat. Oleh karena itu, banyak dari kita selalu mencari `tools` untuk mengindari sebuah proses yang _berulang_ agar demi meraih produktifitas yang maksimal. Contoh, ketika kita bekerja dalam sebuah tim, biasanya memiliki _standard_ tersediri dalam menulis kode. Standard disini banyak macamnya, seperti penulisan _variable_, _function_ dan _styling_ dari kode yang kita tulis. Sebagai seorang JavaScript Developer, maka `tools` seperti ESLint dan Prettier pun wajib kita gunakan. Cuma, walaupun penggunaan ESLint dan Prettier sudah terintegrasi dengan IDE yang kita gunakan, akan tetapi jika prosesnya tidak kita _paksa_ ketika developer melakukan `commit`, bisa jadi aturan ESLint dan Prettier tadi menjadi tidak berguna bukan?

<!-- more -->

Coba bayangkan, semisal ada developer di tim kamu, melakukan suatu _commit_ ulang karena pada proses _Continous Integration_ gagal **hanya untuk memberikan titik koma**.

![Commit what?! - https://medium.com/@okonetchnikov/make-linting-great-again-f3890e1ad6b8#.8qepn2b5l ](https://miro.medium.com/max/700/1*SONNGDgHWOOvANziZPX8Rw.png)

Kasihan bukan? :D Selain kasihan, ada hal yang harus dibayar dari kesalahan _remeh temeh_ itu!

## Pre-Commit Hook!

Secara default, Git memberikan sebuah fitur yang memperbolehkan kita melakukan sesuatu sebelum git melakukan `commit`. Misal kita set di pre-commit ini untuk melakukan _Linting_, maka ketika kita mengesekusi perintah `git commit -m 'fix: something to fix'` misalnya, maka si Git akan melakukan _Linting_ terlebih dulu dari sebelum git menyimpan hasil _commit_ dari yang kita lakukan.

Cuma, untuk bisa mengimplementasikan itu cukup _sulit_ menurut saya :D Oleh karena itu, butuh _tools_ tambahan untuk memudahkan kita dalam melakukan _setup_ git pre-commit ini. Belum lagi jika kamu mau tambahin perintah misalkan `post-commit` dan lain sebagainya. 

## Memperkenalkan, Husky dan Lint-staged!

Husky merupakan sebuah _tool_ javascript yang membuat Git Hooks menjadi sangat mudah! Ya beneran mudah, kamu cukup tambahkan `huksy` ke dependensi kamu dengan cara `npm install husky --save-dev`. Setelah itu bisa kamu atur git hooksnya di `package.json`, seperti ini misalkan:

```js
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm test",
      "...": "..."
    }
  }
}
```

Jadi, perintah itu memiliki arti:
- `pre-commit: npm test`, yaitu si Husky akan menjalankan pre-commit `npm test` ketika developer melakukan `commit`.
- `pre-push: npm test`, yaitu si Husky akan menjalankan pre-push `npm test` ketika developer melakukan push ke remote origin.

### Mudah bukan? Oke, sekarang apa itu **Lint-staged**?

Masih ingat dengan masalah _commit_ ulang karena kelupaan titik koma yang saya mention sebeleumnya kan? Nah, dengan menggunakan _tool_ lint-staged ini kita bisa menghindari masalah seperti itu. 

Caranya pun sangat mudah, kita tinggal tambahkan dependensi lint-staged `npm install lint-staged --save-dev`. Kemudian tambahkan di `package.json` seperti ini misalkan:

```js
"lint-staged": {
    "*.js": [
      "prettier --config .prettierrc --write",
      "eslint --fix",
      "git add"
    ]
  },
```

Jadi, perintah itu memiliki arti:
- `*js`, lint-staged akan aktif hanya di file yang berekstensi `.js` saja
- Jika filenya merupakan file `.js`, maka dia akan melakukan perintah 
  - `prettier --config .prettierrc --write`, yaitu untuk menyesuaikan style kode kita sesuai aturan yang kita tulis di `.prettierrc`
  - `eslint --fix`, yaitu untuk melakukan pemeriksaan kode sesuatu aturan ESlint yang kita tulis dan dia akan _auto-fix_ jika memang bisa.
  - `git add` jika dua proses diatas benar dan bisa jadi ada perubahan, maka perlu di `add` ulang di perintah Git-nya.

### Keren bukan? Sekarang bagaimana mengintegrasikan keduanya?

Pada dasarnya, dengan bantuan Husky, kita bisa mengesekusi perintah apa saja dengan aturan dari Git Hooks yaa, seperti `pre-commit` yang saya jelaskan diatas. Jadi agar ketika developer melaukan commit, si Husky bisa jalan, maka kita bisa taruh codenya di `pre-commit` dengan merubah `package.json` menjadi seperti dibawah ini:

```js
...
"husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": [
      "prettier --config .prettierrc --write",
      "eslint --fix",
      "git add"
    ]
  },
...
```

Dan ketika ada perubahan di file `.js`, maka akan seperti ini hasil dari Husky x Lint-staged.

Jika gagal dalam validasi data, maka hasilnya akan seperti ini dengan menampilkan errornya dimana.

![Yeyy! Gak bisa asal commit](https://user-images.githubusercontent.com/10141928/61183817-f85dfa80-a66f-11e9-826d-9365eb8f784d.png)

Dan jika berhasil, maka hasilnya akan seperti ini.

![Yeey! Berhasil commit sesuai perintahku](https://user-images.githubusercontent.com/10141928/61183826-1af01380-a670-11e9-85e7-c34a4ef61f0d.png)]

Bagaimana? keren bukan kedua `tools` ini? Segera terapkan di _workflow_ developmentmu dan tingkatkan produktifitasmu!