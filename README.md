# Boardcamp

This is a back-end project that uses SQL database for manage a board game rental.

## Features

- List all games categories - **GET** `/categories`
- Insert a new game category - **POST** `/categories`
- List all games registred - **GET** `/games`
- Insert a new game - **POST** `/games`
- List all customers registred - **GET** `/customers`
- Insert a new customer - **POST** `/customers`
- Get a customer by Id - **GET** `/customers/:id`
- Update a customer data - **PUT** `/customers/:id`
- List all game rentals - **GET** `/rentals`
- Insert a new rental - **POST** `/rentals`
- Finish a rental - **POST** `/rentals/:id/return`
- Delete a concluded rental - **DELETE** `/rentals/:id`

## Technologies

<div align="center">
	<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" >
	<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" >
	<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" >
	<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" >
	<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" >
  <img src="https://img.shields.io/badge/github-%23000000.svg?style=for-the-badge&logo=github&logoColor=white" >
  <img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white" >
  <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" >
</div>

## How to run

1. Clone the front-end repository
```bash
git clone https://github.com/bootcamp-ra/boardcamp-front.git
```
2. Install dependencies in the front-end repository
```bash
npm i
```
3. Clone this repository
```bash
git clone https://github.com/dayanecol/Boardcamp.git
```
4. Install dependencies
```bash
npm i
```
5. Create an .env file based on .env_example
6. Run the front-end with 
```bash
npm start
```
7. Finally access http://localhost:3000 on your browser to start using the app

