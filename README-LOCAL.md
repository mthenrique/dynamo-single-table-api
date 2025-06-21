# 🔧 Configuração Local Manual

Este guia explica como configurar e rodar o projeto **sem Docker**, instalando todas as dependências localmente.

## 📋 Pré-requisitos

- Node.js 18+
- AWS CLI instalado
- Docker (apenas para LocalStack)

## 🚀 Configuração Manual

### 1. Instalar Dependências

```bash
# Instalar dependências do projeto
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Server Configuration
NODE_ENV=local
PORT=3000
LOG_LEVEL=info

# AWS Configuration (LocalStack)
AWS_ENDPOINT=http://localstack:4566
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=SingleTableDesign

# AWS Credentials (LocalStack - valores de teste)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

### 3. Iniciar LocalStack

```bash
# Iniciar apenas o LocalStack
docker-compose up localstack -d

# Aguardar o LocalStack estar pronto
sleep 10
```

### 4. Criar Tabela DynamoDB

```bash
# Criar a tabela no DynamoDB local
aws dynamodb create-table \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  --table-name SingleTableDesign \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S \
    AttributeName=GSI1SK,AttributeType=S \
    AttributeName=GSI2PK,AttributeType=S \
    AttributeName=GSI2SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes \
    "[
      {
        \"IndexName\": \"GSI1\",
        \"KeySchema\": [
          {\"AttributeName\": \"GSI1PK\", \"KeyType\": \"HASH\"},
          {\"AttributeName\": \"GSI1SK\", \"KeyType\": \"RANGE\"}
        ],
        \"Projection\": {
          \"ProjectionType\": \"ALL\"
        },
        \"ProvisionedThroughput\": {
          \"ReadCapacityUnits\": 5,
          \"WriteCapacityUnits\": 5
        }
      },
      {
        \"IndexName\": \"GSI2\",
        \"KeySchema\": [
          {\"AttributeName\": \"GSI2PK\", \"KeyType\": \"HASH\"},
          {\"AttributeName\": \"GSI2SK\", \"KeyType\": \"RANGE\"}
        ],
        \"Projection\": {
          \"ProjectionType\": \"ALL\"
        },
        \"ProvisionedThroughput\": {
          \"ReadCapacityUnits\": 5,
          \"WriteCapacityUnits\": 5
        }
      }
    ]" \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### 5. Executar a Aplicação

```bash
# Modo desenvolvimento com hot reload
npm run dev

# Ou build e executar
npm run build
npm start
```

## 📊 Serviços Disponíveis

| Serviço        | URL                   | Descrição          |
| -------------- | --------------------- | ------------------ |
| **API**        | http://localhost:3000 | API REST principal |
| **LocalStack** | http://localhost:4566 | Emulador AWS local |

## 🏗️ Estrutura da Tabela

A tabela `SingleTableDesign` é criada com:

- **Partition Key (PK)**: String
- **Sort Key (SK)**: String
- **GSI1**: Para consultas por email
  - PK: GSI1PK (String)
  - SK: GSI1SK (String)
- **GSI2**: Para consultas por status
  - PK: GSI2PK (String)
  - SK: GSI2SK (String)

## 🧪 Testando a API

### Criar usuário

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "status": "ACTIVE",
    "preferences": {
      "theme": "LIGHT",
      "notifications": true
    }
  }'
```

### Buscar usuário por ID

```bash
curl http://localhost:3000/users/{USER_ID}
```

### Buscar usuário por email

```bash
curl http://localhost:3000/users/email/test@example.com
```

### Buscar usuários por status

```bash
curl http://localhost:3000/users/status/ACTIVE
```

### Atualizar usuário

```bash
curl -X PUT http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "uuid-do-usuario",
    "name": "Nome Atualizado",
    "preferences": {
      "theme": "DARK",
      "notifications": false
    }
  }'
```

### Deletar usuário

```bash
curl -X DELETE http://localhost:3000/users/{USER_ID}
```

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Hot reload
npm run build        # Build TypeScript
npm start           # Executar build

# Docker (apenas LocalStack)
docker-compose up localstack -d    # Iniciar LocalStack
docker-compose down               # Parar LocalStack
docker-compose logs localstack    # Ver logs LocalStack
```

## ⚠️ Tratamento de Erros

A API retorna erros formatados consistentemente:

### Erro de Validação (400)

```json
{
  "statusCode": 400,
  "isOperational": true,
  "name": "ParametersError",
  "parameters": {
    "email": ["Required"],
    "name": ["Required"]
  },
  "status": "error",
  "message": "Create user parameters validation failed"
}
```

### Usuário não encontrado (404)

```json
{
  "statusCode": 404,
  "isOperational": true,
  "name": "NotFoundError",
  "status": "error",
  "message": "User not found"
}
```

### Erro interno (500)

```json
{
  "statusCode": 500,
  "isOperational": false,
  "name": "ExceptionError",
  "status": "error",
  "message": "Failed to get user by id"
}
```
