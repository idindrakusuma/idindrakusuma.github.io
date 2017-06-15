---
title: Mempercantik Terminal dengan Powerline dan ZSH
date: 2017-06-14 03:41:09
tags:
- programmer
- zsh
- terminal
categories:
- Tutorial
- Linux
thumbnail: https://user-images.githubusercontent.com/10141928/27104334-0d197556-50b6-11e7-9b72-e83883f6ab77.png
---

Jika kamu merupakan pengguna sistem opeasi linux entah apapun distro yang kamu pakai, pasti kamu sudah tidak asing lagi dengan `terminal` atau `bash`. Bash di Linux menjadi kebutuhan primer (menurut saya) untuk melakukan berbagai operasi, sebut saja yang paling dasar seperti perintah `sudo apt-get update` untuk memperbaharui repositori dan `sudo apt-get purge` untuk menghapus aplikasi / program yang terinstal di sistem. <!-- more -->

Karena saya seorang programmer, penggunaan bash tidak cukup sampai disitu saja, banyak kegiatan lainya seperti pengoperasian **GIT** untuk _version control_ dari program yang saya kembangkan. 

Singkat cerita, waktu kumpul sama temen - temen **dinusopensourcecommunity (DOSCOM)** saya lihat tampilan bash mereka beda dari biasanya dan lebih keren tentunya. Ketika saya tanya, ternyata mereka menggunakan ZSH dengan font Powerline. Kurang lebih bentuknya seperti ini.

![ZSH + Powerline di Ubuntu 16.04](https://user-images.githubusercontent.com/10141928/27104334-0d197556-50b6-11e7-9b72-e83883f6ab77.png)

Bagaimana ? Lebih keren dari bash atau terminal versi standar kan ? dan satu lagi yang saya suka dari ZSH ada fitur `tab` sebagai _autocomplete_ perintah atau folder yang ada. Nah pengen coba ? mari ikuti langkah berikut ini untuk instalasinya.

## Install ZSH
1. Langkah pertama adalah Install ZSH melalui apt-get

```
sudo apt-get install zsh
```
2. Jadikan ZSH sebagai default shell

```
chsh -s $(which zsh)
```
3. Logout dan login kembali dari sistem operasi kamu.
4. Sekarang buka kembali terminal, dan ketika perintah
```
echo $SHELL
```
Jika keluar `/usr/bin/zsh` berarti sudah berhasil mengubah ZSH menjadi default. lanjut ke langkah selanjutnya.

## Install Oh-my-zsh

oh-my-zsh yang membuat tampilan terminal menjadi lebih keren. berikut langkah instalasinya.
1. Install oh-my-zsh melalui `curl`
```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```
_* Jika ada pesan eror, mungkin kamu belum install `curl`nya. Silahkan install dengan perintah `sudo apt-get install curl`_.

2. Atur _plugin_ dan _theme_
```
nano .zshrc
```
kalau saya pakai tema `agnoster`,  dan ubah temanya menjadi 
```
ZSH_THEME="agnoster"
```

3. Logout dan login kembali dari sistem dan buka kembali shellnya. Dan lihat hasilnya. Jika tampilannya masih kacau (tidak sesuai screenshot saya), berarti _font_ nya belum terinstal. Silahkan install Powerline dengan cara.

```
sudo apt-get install powerline
```

4. Selesai!

Referensi : 
- https://wkwk.web.id/memperindah-terminal-tealinuxos-dengan-oh-my-zsh-96599a4a66ec

Informasi lebih lanjut mengenai zsh dan powerline bisa dicek disni :
- https://github.com/robbyrussell/oh-my-zsh
- https://github.com/powerline/fonts