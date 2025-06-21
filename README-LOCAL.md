# 🏠 Local Setup - DynamoDB Single Table API

Setup local com LocalStack e Node.js.

## 🚀 Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar LocalStack
docker-compose up localstack -d

# 3. Criar tabela
AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test aws dynamodb create-table \
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
  --global-secondary-indexes '[
    {
      "IndexName": "GSI1",
      "KeySchema": [
        {"AttributeName": "GSI1PK", "KeyType": "HASH"},
        {"AttributeName": "GSI1SK", "KeyType": "RANGE"}
      ],
      "Projection": {
        "ProjectionType": "ALL"
      },
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 5,
        "WriteCapacityUnits": 5
      }
    },
    {
      "IndexName": "GSI2",
      "KeySchema": [
        {"AttributeName": "GSI2PK", "KeyType": "HASH"},
        {"AttributeName": "GSI2SK", "KeyType": "RANGE"}
      ],
      "Projection": {
        "ProjectionType": "ALL"
      },
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 5,
        "WriteCapacityUnits": 5
      }
    }
  ]' \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# 4. Executar API
npm run dev
```

## 📊 Serviços

| Serviço        | URL                   | Descrição    |
| -------------- | --------------------- | ------------ |
| **API**        | http://localhost:3000 | API REST     |
| **LocalStack** | http://localhost:4566 | Emulador AWS |

## 🧪 Teste Rápido

```bash
# Criar usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","status":"ACTIVE"}'

# Buscar usuário
curl http://localhost:3000/users/{USER_ID}
```

## 🛠️ Comandos Úteis

```bash
npm run dev          # Hot reload
npm run build        # Build
npm start           # Executar build
docker-compose down # Parar LocalStack
```
