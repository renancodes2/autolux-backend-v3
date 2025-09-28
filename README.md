# 🚗 AutoLux - API para Loja de Veículos

**AutoLux** é uma API RESTful robusta desenvolvida com **NestJS**, projetada para atender todas as necessidades de uma loja de veículos online. Ela oferece funcionalidades completas de autenticação, gerenciamento de veículos, pedidos, favoritos, simulações financeiras, avaliações e muito mais.

## ⚙️ Tecnologias Utilizadas

- **NestJS**
- **Prisma ORM**
- **PostgreSQL (via Neon)**
- **JWT**
- **Multer + Cloudinary**
- **Class-validator**
- **Docker (multi-stage)**
- **GitHub Actions**

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

  **Quando o usuário encontra um carro que deseja salvar para referência futura, ele pode marcá-lo como favorito. Isso pode ser feito, por exemplo, ao clicar em um ícone de coração (ou       similar) ao lado do carro na lista de veículos ou na página de detalhes do veículo.**

  **O carro é então adicionado à lista de favoritos do usuário. Isso permite que o usuário acesse facilmente esse carro em outro momento, sem precisar realizar uma nova busca**

### 📦 Pedidos

- Criar pedido de compra de veículo
- Histórico de pedidos por usuário
- Status dinâmico: `PENDING`, `APPROVED`, `PREPARING`, `SENT`, `DELIVERED`, `CANCELLED`

### 💸 Simulação de Financiamento

- Entrada, parcelas, juros
- Cálculo automático do valor final

### ⭐ Avaliações

- Nota (rating): Os usuários podem avaliar o modelo do carro com uma nota de 1 a 5 estrelas, onde 1 é a pior avaliação e 5 é a melhor.

- Comentário: Além da nota, o usuário pode deixar um comentário explicando a sua experiência com o veículo. Isso pode incluir aspectos como:

  **Desempenho do carro (conforto, consumo de combustível, dirigibilidade, etc.)** 
  **Qualidade de construção (acabamento, materiais usados, etc.)**
  **Experiência de compra (facilidade de compra, tempo de entrega, atendimento ao cliente, etc.)**
  **Satisfação geral com o veículo e com o processo de compra.**

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







