# Fullstack-Ecommerce Loja PT-BR

# Fullstack E-commerce Loja PT-BR

Projeto alterado de um projeto open-source, adicionando novas funções:

## Funcionalidades adicionadas

- Tradução para diferentes línguas usando **i18n**  
- Seleção de **temas diferentes**  
- Pagamento via **Stripe**  
- Cálculo de frete usando a **API Melhor Envio**  
- Novos campos na criação de produtos (permitindo cálculo de frete diferente por origem, tamanho e peso)  
- Agrupamento por grupos caso o usuário esteja comprando muitos produtos  
- Sistema básico de reviews de produtos por usuário com nota de estrelas  
- **Aviso frete-grátis** no canto do produto aparece apenas nos produtos `freeShipping: true`  
- Pagamento ocorre todo na mesma página, deixando a interface mais amigável

## Melhorias na segurança

- Segurança do Firebase na escolha do admin e login do admin  
  > O usuário deve ir no Firebase, baixar `setAccountAdmin` e criar um `setAdmin` na pasta `admin-tools`. **Nunca subir esses arquivos ou a pasta `admin-tools` no GitHub!**  
- Blacklist com delete ou censor de reviews  
- Separação de coleções para esconder endereços de usuários no database via regras do Firebase  
- Carrinho estático ao clicar em "comprar", impedindo que o usuário compre produtos em outra aba sem pagar frete  
- Double-check no código de compra para evitar manipulação manual

## Serviços recomendados

- Firebase  
- Netlify  
- Cloudinary  
- Stripe  
- Melhor Envio

## Loja em funcionamento

[https://minhalojatales.netlify.app/](https://minhalojatales.netlify.app/)

## Contato

- GitHub: [tales33484](https://github.com/tales33484)  
- Email: tales.57@proton.me  
- X.com: @talesfreeman

## Read Me original
> (coloque aqui se quiser manter referência ao README original)





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



