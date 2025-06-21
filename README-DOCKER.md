# 🐳 Docker Setup - DynamoDB Single Table API

Este documento contém instruções para executar o projeto **completamente via Docker**, incluindo LocalStack, DynamoDB Admin e a aplicação.

## 📋 Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose disponível
- Portas 3000, 4566 e 8001 disponíveis

## 🚀 Início Rápido

```bash
# Iniciar todos os serviços (mais rápido)
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Parar todos os serviços
docker-compose down
```

### 🔄 Quando usar `--build`:

```bash
# PRIMEIRA VEZ ou após mudanças no código
docker-compose up --build -d

# APÓS mudanças no Dockerfile ou package.json
docker-compose up --build -d
```

> 💡 **Dica**: Use `--build` apenas na primeira execução ou após mudanças no código. Para execuções normais, `docker-compose up -d` é mais rápido e o hot reload funciona perfeitamente.

## 🏗️ Serviços Incluídos

### 1. **API (Node.js/TypeScript)**

- **Porta**: 3000
- **URL**: http://localhost:3000
- **Descrição**: API REST principal
- **Modo**: Desenvolvimento com hot reload
- **Volumes**: Código fonte mapeado para hot reload

### 2. **LocalStack (DynamoDB Emulator)**

- **Porta**: 4566
- **URL**: http://localhost:4566
- **Descrição**: Emulador AWS local
- **Serviços**: DynamoDB

### 3. **DynamoDB Admin**

- **Porta**: 8001
- **URL**: http://localhost:8001
- **Descrição**: Interface web para gerenciar dados
- **Funcionalidades**: Visualizar, editar e gerenciar tabelas

### 4. **Setup (AWS CLI)**

- **Descrição**: Cria automaticamente a tabela DynamoDB
- **Execução**: Automática após LocalStack estar pronto

## 🔧 Configuração de Rede

Todos os serviços estão na rede `app-network`, permitindo:

```bash
# Ver redes Docker
docker network ls

# Inspecionar a rede
docker network inspect dynamo-single-table-api_app-network

# Conectar a um container
docker exec -it dynamo-api sh
```

## 📊 Monitoramento

### Verificar Status dos Serviços

```bash
# Listar containers rodando
docker ps

# Ver uso de recursos
docker stats

# Ver logs de todos os serviços
docker-compose logs
```

### Health Checks

```bash
# Verificar API
curl http://localhost:3000/health

# Verificar LocalStack
curl http://localhost:4566/_localstack/health

# Verificar DynamoDB Admin
curl http://localhost:8001
```

## 🛠️ Comandos Úteis

### Desenvolvimento

```bash
# Rebuild apenas a API
docker-compose build api

# Restart apenas a API
docker-compose restart api

# Executar comandos dentro do container
docker-compose exec api sh
docker-compose exec api npm run lint
docker-compose exec api npm test

# Ver variáveis de ambiente
docker-compose exec api env
```

### Debugging

```bash
# Ver logs detalhados
docker-compose logs --tail=100 api

# Seguir logs em tempo real
docker-compose logs -f --tail=50 api

# Ver logs de um período específico
docker-compose logs --since="2024-01-01T00:00:00" api
```

### Limpeza

```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Remover volumes não utilizados
docker volume prune

# Limpeza completa
docker system prune -a
```

## 🔍 Troubleshooting

### Porta já em uso

```bash
# Verificar o que está usando a porta
lsof -i :3000
netstat -tulpn | grep :3000

# Parar o processo
kill -9 <PID>
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs api

# Verificar configuração
docker-compose config

# Rebuild forçado
docker-compose build --no-cache api
```

### Problemas de rede

```bash
# Verificar conectividade entre containers
docker-compose exec api ping localstack

# Testar endpoint LocalStack
docker-compose exec api curl http://localstack:4566/_localstack/health
```

## 📝 Variáveis de Ambiente

```yaml
environment:
  - NODE_ENV=development
  - AWS_ENDPOINT=http://localstack:4566
  - AWS_REGION=us-east-1
  - AWS_ACCESS_KEY_ID=test
  - AWS_SECRET_ACCESS_KEY=test
  - DYNAMODB_TABLE_NAME=SingleTableDesign
```

## 🎯 Próximos Passos

Após iniciar os serviços:

1. **Acesse a API**: http://localhost:3000
2. **Teste os endpoints**: Use Postman ou curl
3. **Visualize dados**: http://localhost:8001
4. **Monitore logs**: `docker-compose logs -f`

## 🎯 Vantagens da Configuração Docker

- **Setup automático** - Tudo configurado com um comando
- **Ambiente isolado** - Não interfere com instalações locais
- **Reproduzível** - Mesmo ambiente em qualquer máquina
- **Demonstração fácil** - Ideal para portfólio e apresentações
- **Sem instalação local** - Não precisa instalar Node.js, AWS CLI, etc.

## 📚 Recursos Adicionais

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [DynamoDB Admin](https://github.com/aaronshaf/dynamodb-admin)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

> 💡 **Dica**: Para demonstração e portfólio, esta configuração Docker oferece setup rápido e ambiente consistente.
