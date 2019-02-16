---
title: Mengatasi Bug Poweline di Integrated Terminal VS Code
date: 2017-06-14 08:24:48
categories:
- tutorial
- linux
tags:
- zsh
- terminal
- vscode
thumbnail: https://user-images.githubusercontent.com/10141928/27112062-aa809f4a-50de-11e7-81d5-605fe57b7b4f.png
---
Pada artikel sebelumnya saya sudah mempublikasikan artikel bagaimana cara [Mempercantik Terminal dengan Powerline dan ZSH](https://idindrakusuma.github.io/2017/06/14/Mempercantik-Terminal-dengan-Powerline-dan-ZSH/). Tentu jika kalian pengguna **Microsoft Visual Studio Code**, kalian akan buka terminal melalui _integrated terminal_ dari vscode bukan ? alesanya karena lebih simple dan cepat. <!--more-->

Tetapi, ketika saya buka _integrated terminal_ vscode terdapat sebuah #bug kecil yang menggangu. Ya, **powerline** tidak berkerja seperti pada terminal biasanya. Bugnya seperti gambar dibawah ini :

![Powerline tidak bekerja dengan baik](https://user-images.githubusercontent.com/10141928/27112063-aa82d530-50de-11e7-9fb2-a89b9eabfb6c.png)

Mengganggu kan ? setelah saya cari kesana kemari, alhamdulillah dapat pencerahan juga. Berikut merupakan cara untuk _**Mengatasi Bug Poweline di Integrated Terminal VS Code**_.

## Mengatasi Bug Poweline di Integrated Terminal VS Code
1. Buka **Visual Studio Code** kamu.
2. Buka `settings.json` melalui `File > Preferences > Settings` atau bisa melalui kombinasi `CTRL + ALT + S`.
3. Tambahakan satu baris kode ini :
```
"terminal.integrated.fontFamily": "Meslo LG M DZ for Powerline"
```
4. Simpan dan lihat hasilnya :)

![Settings.json dan Powerline Work](https://user-images.githubusercontent.com/10141928/27112062-aa809f4a-50de-11e7-81d5-605fe57b7b4f.png)

Sekian dari saya, semoga bermanfaat. Have Nice Code!

Sumber :
- https://github.com/Microsoft/vscode-docs/issues/675
