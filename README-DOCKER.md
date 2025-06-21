# 🐳 Docker Setup - DynamoDB Single Table API

Setup completo via Docker com LocalStack, DynamoDB Admin e API.

## 🚀 Início Rápido

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## 📊 Serviços

| Serviço            | URL                   | Descrição     |
| ------------------ | --------------------- | ------------- |
| **API**            | http://localhost:3000 | API REST      |
| **DynamoDB Admin** | http://localhost:8001 | Interface web |
| **LocalStack**     | http://localhost:4566 | Emulador AWS  |

## 🛠️ Comandos Úteis

```bash
# Rebuild após mudanças
docker-compose up --build -d

# Logs específicos
docker-compose logs -f api

# Executar comandos no container
docker-compose exec api sh
```

## 🧪 Teste Rápido

```bash
# Criar usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","status":"ACTIVE"}'
```

> 💡 **Dica**: A tabela é criada automaticamente. Use `--build` apenas na primeira vez ou após mudanças no código.
