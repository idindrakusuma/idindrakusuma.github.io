---
title: Mengenal 3 Jenis Component pada ReactJS
date: 2019-02-16 20:25:14
categories: development
tags:
- belajar-reactjs
- programmer
thumbnail: https://user-images.githubusercontent.com/10141928/52900539-a08aa700-3229-11e9-8990-7164cc88e606.png
---

Dalam artikel ini, kita akan belajar memahami 3 jenis component pada framework ReactJS. Selain membuat code kita lebih rapi, penggunaan jenis component yang tepat akan memberikan pengalaman user yang baik dan cepat. Mari kita mulai..

<!-- more -->

![White Notebook - Unsplash](https://images.unsplash.com/photo-1543013309-0d1f4edeb868?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=723&q=80)

## Component atau Statefull Component

Jenis pertama adalah jenis Statefull Component. Component ini membawa semua fitur dan lifecycle dari ReactJs. Di Component ini, kamu bisa melakukan operasi logic, perubahan state, maupun fetch data dari server. berbagai lifecycle seperti `componentDidMount()`, `componentDidUpdate()`, `static getDerivedStateFromProps()`, `shouldComponentUpdate()` bisa kamu gunakan disini. 

```jsx
import React, { Component } from 'react';

class ArticleContainer extends Component {
  state = {
    isLoading: false,
  }

  componentDidUpdate() {
    /* do cool stuff here */
  }

  render() {
    return (
      <div>
        {/* Do Cool stuff here */}
      </div>
    );
  }
}

export default ArticleContainer;
```

Jadi jika component kamu memungkinkan untuk melakukan komputasi yang complex secara local (state), maka perlu menggunakan component ini. Component ini juga akan selalu melakukan render ulang (lifecycle) ketika terdapat perubahan pada state ataupun props.


## Pure Component

```jsx
import React, { PureComponent } from 'react';

class ProductQuantity extends PureComponent {
  state = {
    isLoading: false,
  }

  componentDidUpdate() {
    /* do cool stuff here */
  }

  render() {
    return (
      <div>
        {/* Do Cool stuff here */}
      </div>
    );
  }
}

export default ProductQuantity;
```

Jenis yang kedua adalah Pure Component. Pure Component ini hampir sama dengan component jenis pertama tadi, bedanya adalah kalau Pure Component akan selalu melakukan pengecekan `shouldComponentUpdate` ketika si pure component menerima props / state baru. Jadi jika kamu ingin memastikan bahwa component tidak perlu render ulang ketika menerima props yang sama, maka cocok untuk menggunakan component jenis ini.

## Stateless Component

```jsx
import React from 'react';

const BadgePreOrder = (props) => {
  return (
    <div>Pre Order {props.num} hari</div>
  );
}

export default BadgePreOrder;
```


Jenis component terakhir adalah Stateless Component atau Component tanpa state. Component ini hanya menerima `props` dan `context` pada react. Component ini juga tidak membawa `lifecycle` react di dalamanya. Jadi model component seperti sangat cocok untuk menyelesaikan permasalah seperti pembuatan Badge, Ticker, Label dsb.

Dengan mengetahui 3 jenis component tersebut, sudah seharusnya kita mengimplementasikan jenis component tersebut sesuai dengan fungsinya. Intinya, Kalau memang tidak perlu melakukan render ulang, kenapa mesti render ulang? 😄 

Semoga bermanfaat!