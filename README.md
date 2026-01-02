# Fullstack E-commerce – Loja (PT-BR)

Projeto baseado e adaptado a partir de um projeto **open-source**, com a adição de novas funcionalidades, melhorias de segurança e integrações modernas para um e-commerce completo.

---

## 🚀 Funcionalidades Adicionadas

* 🌍 Tradução para múltiplos idiomas utilizando **i18n**
* 🎨 Seleção de **temas diferentes** (UI customizável)
* 💳 Pagamentos integrados com **Stripe**
* 🚚 Cálculo de frete em tempo real via **API Melhor Envio**
* 📦 Novos campos na criação de produtos (origem, peso e dimensões para cálculo de frete)
* 🧮 Agrupamento inteligente de produtos em compras com grande volume
* ⭐ Sistema básico de **reviews por usuário**, com avaliação por estrelas
* 🏷️ Aviso de **frete grátis** exibido apenas para produtos com `freeShipping: true`
* 🧾 Checkout realizado em **uma única página**, melhorando a experiência do usuário

---

## 🔐 Melhorias de Segurança

* 🔒 Regras avançadas de segurança no **Firebase** para controle de login e permissões de administrador

  > O administrador deve gerar manualmente os arquivos `setAccountAdmin` e `setAdmin` dentro da pasta `admin-tools`.
  > ⚠️ **Nunca subir a pasta `admin-tools` ou seus arquivos no GitHub.**

* 🚫 Sistema de **blacklist** para remoção ou censura de reviews inadequados

* 🗂️ Separação de coleções no Firestore para proteger endereços de usuários via regras de segurança

* 🛒 Carrinho de compras **estático** após clicar em "comprar", evitando manipulação em múltiplas abas

* ✅ Double-check no fluxo de pagamento para prevenir alterações manuais nos valores

---

## 🧰 Tecnologias Utilizadas

### Linguagens

* **JavaScript** – linguagem principal do projeto
* **HTML5 / CSS3** – estrutura e estilização da interface

### Frontend

* **Vite** – build tool e bundler moderno para alta performance
* **Tailwind CSS** – framework utilitário para estilização responsiva

### Backend & Integrações

* **Netlify Functions** – backend serverless
* **Stripe API** – processamento de pagamentos
* **Melhor Envio API** – cálculo de frete
* **Cloudinary** – armazenamento e entrega de imagens

### Plataformas & Serviços

* **Firebase** – autenticação, banco de dados (Firestore) e regras de segurança
* **Netlify** – deploy contínuo e hospedagem da aplicação

---

## 🏗️ Arquitetura do Software (Visão Geral)

```
Frontend (Vite + JS + Tailwind)
        |
        v
Netlify (Hosting)
        |
        v
Netlify Functions (Serverless Backend)
        |
        +--> Stripe API (Pagamentos)
        +--> Melhor Envio API (Frete)
        |
        v
Firebase (Auth + Firestore + Rules)
        |
        v
Cloudinary (Imagens)
```

---

## 🌐 Loja em Funcionamento

🔗 **Demo:**
[https://minhalojatales.netlify.app/](https://minhalojatales.netlify.app/)

---

## 📫 Contato

* GitHub: [tales33484](https://github.com/tales33484)
* Email: [tales.57@proton.me](mailto:tales.57@proton.me)
* X (Twitter): **@talesfreeman**

---

## 📜 Projeto Original (Open Source)

### 💰 Eshop.com

eShop.com is an e-commerce website that allows users to browse products, add items to a cart, and complete purchases. Users can register with email/password, sign in with Google, or use guest login.

![preview](https://user-images.githubusercontent.com/81632171/199007839-77a2f0cd-9b25-4dec-a141-30155fbc4a20.png)

### Built With (Original Project)

* React.js
* Redux Toolkit
* Firebase
* Node.js
* Express.js
* Stripe
* Tailwind CSS

**Original Developer:** Kartik Pavan





## Read Me original






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



