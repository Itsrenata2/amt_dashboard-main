# AMT Dashboard

O **AMT Dashboard** é um projeto desenvolvido para fornecer uma interface gráfica para visualização e gerenciamento de dados. A aplicação foi construída com React no frontend, utilizando o Tailwind CSS para estilização. O backend foi implementado com Flask, e o banco de dados utilizado para o processamento dos dados é o **MySQL**.

## Tecnologias Utilizadas

- **Frontend**: React, Tailwind CSS
- **Backend**: Python (Flask)
- **Banco de Dados**: MySQL
- **Estilização**: Tailwind CSS
- **Gerenciamento de dependências**: `requirements.txt` para o backend

## Funcionalidades

- Visualização de dados através de gráficos e tabelas.
- Interatividade com os dados em tempo real.
- Interface responsiva e moderna com o uso do Tailwind CSS.
- Conexão com banco de dados MySQL para o processamento e armazenamento dos dados.

## Como Rodar o Projeto

### 1. **Clone o Repositório**

Clone o repositório para sua máquina local:

```
git clone <[repositorio](https://github.com/Itsrenata2/amt_dashboard-main)>
cd amt-dashboard
```

### 2. **Instalar as bibliotecas necessárias (FrontEnd)**

Dentro pasta do projeto principal rode:

```
npm install tailwindcss
npm install react-scripts
```

### 3. **Instalar as bibliotecas necessárias (BackEnd)**

Agora dentro da pasta ./backend rode:

```
cd backend
python -m venv venv
use venv\Scripts\activate
pip install -r requirements.txt
```

### 4. **Configurações para o Banco de Dados**

Ao instalar o MySQL server é configurado uma senha, no arquivo config.py você deverá adicionar essa senha assim como outras configurações necessárias para o funcionamento.

```
import mysql.connector

db_connection = mysql.connector.connect(
    host="localhost",
    user="root",  # Seu usuário do MySQL
    password="senha",  # Sua senha do MySQL
    database="AMT"  # Nome do banco de dados
)
```

### 5. **Rodar o BackEnd e FrontEnd**

Para rodar o projeto e poder visualizá-lo no browser digite os seguintes comandos:

```
cd backend
python app.py

npm start
```
