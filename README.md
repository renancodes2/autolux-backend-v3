# 🚗 AutoLux - API para Loja de Veículos

**AutoLux** é uma API RESTful robusta desenvolvida com **NestJS**, projetada para atender todas as necessidades de uma loja de veículos online. Ela oferece funcionalidades completas de autenticação, gerenciamento de veículos, pedidos, favoritos, simulações financeiras, avaliações e muito mais.

## ⚙️ Tecnologias Utilizadas

- **NestJS** – Framework principal
- **Prisma ORM** – Modelagem e acesso ao banco de dados
- **PostgreSQL (via Neon)** – Banco de dados relacional
- **JWT** – Autenticação e controle de acesso
- **Multer + Cloudinary** – Upload e armazenamento de imagens
- **Class-validator** – Validação dos dados
- **Docker (multi-stage)** – Ambientes isolados e prontos para produção
- **GitHub Actions** – Integração contínua (CI)
- **Insomnia / Thunder Client** – Testes de API

## 📦 Funcionalidades

### 🔐 Autenticação

- Cadastro de usuários
- Login com e-mail e senha
- Proteção de rotas privadas com JWT
- Controle de acesso por roles (ADMIN, USER)

### 🚘 Veículos

- Cadastro com até 5 imagens
- Edição e exclusão (com permissão)
- Busca geral ou individual
- Campos detalhados: nome, modelo, motor, cor, KM, preço, ano, transmissão, localização, placa, etc.

### 🏷️ Marcas e Categorias

- CRUD completo de marcas e categorias

### ❤️ Sistema de Favoritos

- Adicionar/remover veículos favoritos
- Listagem dos favoritos do usuário autenticado

### 📦 Pedidos

- Criar pedido de compra de veículo
- Histórico de pedidos por usuário
- Status dinâmico: `PENDING`, `APPROVED`, `PREPARING`, `SENT`, `DELIVERED`, `CANCELLED`

### 💸 Simulação de Financiamento

- Entrada, parcelas, juros
- Cálculo automático do valor final

### ⭐ Avaliações

- Avaliar veículos com nota (rating) e comentário

### 📸 Upload de Imagens

- Upload com `multipart/form-data`
- Armazenamento no **Cloudinary**
- Até 5 imagens por veículo

## 🐳 Suporte a Docker

O projeto utiliza Docker para garantir ambientes de desenvolvimento e produção consistentes.

- Dockerfile com multi-stage build para imagens de produção mais leves e seguras.
- Docker Compose para orquestração, incluindo o serviço da API, banco de dados e rede isolada.

```bash
# Subir com Docker
docker-compose up --build
```

## 🔁 Integração Contínua (CI)

Workflow com GitHub Actions:

- Build e testes automáticos a cada push/pull request  
- Banco de dados PostgreSQL configurado em ambiente de CI  
- Variáveis sensíveis protegidas com GitHub Secrets

## 🔧 Instalação Manual

```bash
# 1. Clone o repositório
git clone https://github.com/renelps/autolux-api.git
cd autolux-api

# 2. Instale as dependências
npm install

# 3. Configure o .env
cp .env.example .env
# Edite o arquivo .env com suas variáveis

# 4. Gere o Prisma Client e rode as migrações
npx prisma generate
npx prisma migrate dev --name init

# 5. Inicie o servidor
npm run start:dev
```

## 🧪 Testes com Insomnia

Um arquivo `.json` de requisições do Insomnia pode ser importado para testar todos os endpoints da API facilmente.

## 📁 Estrutura Base

```
src/
├── auth/
├── vehicles/
├── categories/
├── brands/
├── orders/
├── favorites/
├── simulations/
├── reviews/
├── prisma/
├── common/
└── main.ts
```

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Feito por [@renancodes2](https://github.com/renancodes2)  
Contribuições e feedbacks são bem-vindos!



