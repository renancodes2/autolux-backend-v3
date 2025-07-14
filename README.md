# 🚗 AutoLux - Loja de Veículos

AutoLux é uma **API RESTful** desenvolvida com **NestJS**, voltada para a gestão completa de uma loja de veículos. Ela oferece funcionalidades como cadastro de usuários, gerenciamento de veículos, categorias, marcas, pedidos, avaliações, simulações de financiamento e sistema de favoritos.

## 🛠️ Tecnologias

- **NestJS** (Framework principal)
- **Prisma ORM**
- **PostgreSQL**
- **JWT** (Autenticação)
- **Multer + Cloudinary** (Upload de imagens)
- **Class-validator** (Validação dos dados)
- **Docker** (opcional)
- **Insomnia** (para testes)

## 📂 Funcionalidades

### 🔐 Autenticação
- Cadastro de usuários
- Login com e-mail e senha
- Proteção de rotas privadas com JWT

### 🚘 Veículos
- Criar veículo com até **5 imagens**
- Buscar todos os veículos ou por ID
- Atualizar ou deletar veículos (somente autorizado)
- Campos completos:
  - Nome, modelo, motor, cor, quilometragem
  - Localização (cidade, estado, país)
  - Ano, preço, tipo de transmissão

### 🏷️ Marcas e Categorias
- CRUD completo para gerenciar marcas e categorias

### ❤️ Favoritos
- Adicionar veículos aos favoritos
- Remover dos favoritos
- Listagem dos favoritos do usuário

### 📦 Pedidos
- Criar pedido de compra
- Histórico de pedidos por usuário
- Status dinâmico:
  - `PENDING`, `APPROVED`, `PREPARING`, `SENT`, `DELIVERED`, `CANCELLED`

### 💸 Simulação de Financiamento
- Simulação com entrada, parcelas e juros
- Cálculo automático do valor final

### ⭐ Avaliações
- Avaliar veículos com nota e comentário

## 📸 Upload de Imagens

- Upload via `multipart/form-data`
- Imagens armazenadas no **Cloudinary**
- Limite de até **5 imagens por veículo**

## 🔧 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/autolux-api.git
cd autolux-api

# 2. Instale as dependências
npm install

# 3. Configure o .env
cp .env.example .env
```

Edite o arquivo `.env` com suas variáveis de ambiente:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/autolux
JWT_SECRET=seu_jwt_secreto

CLOUDINARY_NAME=sua_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

```bash
# 4. Gere o Prisma Client e rode as migrações
npx prisma generate
npx prisma migrate dev --name init

# 5. Inicie o servidor em modo de desenvolvimento
npm run start:dev
```

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

Feito com 💛 por [@seu-usuario](https://github.com/renelps)
