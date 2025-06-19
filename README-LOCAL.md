# Configuração Local e Exemplos de Uso

Este guia explica como configurar e rodar o projeto localmente usando LocalStack para simular o DynamoDB, incluindo exemplos práticos de uso da API.

## Pré-requisitos

- Docker e Docker Compose instalados
- AWS CLI instalado
- Node.js 18+

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Server Configuration
NODE_ENV=local
PORT=3000
LOG_LEVEL=info

# AWS Configuration (LocalStack)
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=SingleTableDesign

# AWS Credentials (LocalStack - valores de teste)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

### 2. Iniciar LocalStack

```bash
# Inicia os containers
docker-compose up -d

# Aguarda o LocalStack estar pronto
sleep 10

# Cria a tabela no DynamoDB local
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
        }
      }
    ]" \
  --billing-mode PAY_PER_REQUEST
```

## Acessos

- **LocalStack**: http://localhost:4566
- **DynamoDB Admin UI**: http://localhost:8001
- **API**: http://localhost:3333

## Comandos Úteis

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f localstack

# Reiniciar containers
docker-compose restart

# Remover containers e volumes
docker-compose down -v
```

## Estrutura da Tabela

A tabela `SingleTableDesign` é criada com:

- **Partition Key (PK)**: String
- **Sort Key (SK)**: String
- **GSI1**: Para consultas por email
  - PK: GSI1PK (String)
  - SK: GSI1SK (String)
- **GSI2**: Para consultas por status
  - PK: GSI2PK (String)
  - SK: GSI2SK (String)

## Testando a API

Após iniciar tudo, você pode testar a API:

### Criar usuário

```bash
curl -X POST http://localhost:3333/users \
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
curl http://localhost:3333/users/{USER_ID}
```

### Buscar usuário por email

```bash
curl http://localhost:3333/users/email/test@example.com
```

### Buscar usuários por status

```bash
curl http://localhost:3333/users/status/ACTIVE
```

### Atualizar usuário

```bash
curl -X PUT http://localhost:3333/users \
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
curl -X DELETE http://localhost:3333/users/{USER_ID}
```

## Tratamento de Erros

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
  "isOperational": true,
  "name": "ExceptionError",
  "status": "error",
  "message": "Failed to get user by id"
}
```
