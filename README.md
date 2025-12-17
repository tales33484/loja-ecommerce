# Fullstack-Ecommerce Loja PT-BR

Projeto alterado do projeto open-source abaixo, adicionando novas funções:

+Tradução para diferentes línguas usando i18n.

+Seleção de temas diferentes.

+Pagamento stripe.

+Calculo de frete API Melhor Envio.

+Adicionado novos campos na criação de produtos, permitindo o calculo de frete ser diferente por origem, tamanho, peso.

+Agrupamento por grupos caso o usuário esteja comprando muitos produtos.

+Sistema básico de reviews de produtos por usuário com nota de estrelas.

[alteração]Aviso frete-grátis no canto do produto aparece apenas nos produtos freeShipping true.

[alteração]Pagamento ocorre todo na mesma página, deixando a interface mais humana.


Melhorias na segurança:

+Segurança do firebase na escolha do admin e login do admin.

O usuário deve ir no firebase, baixar setAccountAdmin e criar um setAdmin na pasta admin-tools.

Nunca upar esses dois arquivos dentro da pasta admin-tools ou o folder admin-tools em si pois isso significaria problemas de segurança.


+Blacklist com delete ou censor de reviews.

+Separação de coleções para deixar secreto a coleção que possui os endereços dos usuários no database por regra do firebase.

+Carrinho estático quando se clica em "comprar" nele, deixando impossível o usuário comprar produtos em outra aba e comprá-los sem pagar frete.

+Double-check no código de compra para o usuário não forçar manualmente compra sem preencher os campos de calculo de frete.


Serviços recomendados:
Firebase, Netlify, Cloudinary, Stripe, Melhor Envio.

Loja em funcionamento:
https://minhalojatales.netlify.app/


Contato:
https://github.com/tales33484
tales.57@proton.me
x.com@talesfreeman


Read Me original:




## :moneybag: Eshop.com  :moneybag:

eShop.com is an e-Commerce website that enables users to shop through variety of products(electronic / household / fashion) , add a product to their cart, and checkout. A user can either register their own username and password or Sign in With Google, or they can simply use the "Guest Login" button to navigate the website without registering.

![download](https://user-images.githubusercontent.com/81632171/199007839-77a2f0cd-9b25-4dec-a141-30155fbc4a20.png)

## Summary

- :star: [Website Link](#website-link)
- :star: [Getting Started](#getting-started)
- :star: [Prerequisites](#prerequisites)
- :star: [Installing](#installing)
- :star: [Built With](#built-with)
- :star: [Software Developer](#software-developer)

## LIVE-Website-Link

[EShop.com](https://eshop-firebase.vercel.app/)

## Getting-Started

Feel free to fork the project and change it to your likings. Try it out by cloning the repo to your local machine or download the zip

## Prerequisites

You need preferably the latest version of Chrome, and text editor.

#### Go here for Chrome: https://www.google.com/chrome/

#### VSCode is my go to: https://code.visualstudio.com/

## Installing

To get started follow this guide:

#### FOR DEVELOPMENT PURPOSES

In your terminal clone repo to your local machine using git clone:

```
git clone https://github.com/kartikpavan/Fullstack-Ecommerce.git
```

Move to your newly cloned repo by entering the following in your terminal:

```
$ cd Fullstack-Ecommerce && yarn or npm install
```

To Run Project:-

```
$ yarn dev or npm run dev 
```

To open all project files from terminal using VSCode just tpye and enter:

```
$ code .
```

## Built With

- React Js
- Redux Toolkit 
- Firebase 
- Node.js
- Express.js
- Stripe
- Chart Js
- Email Js
- Tailwind CSS
- Daisy UI

## Software Developer

- **Kartik Pavan**



