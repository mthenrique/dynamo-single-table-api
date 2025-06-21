# 🚀 API DynamoDB Single Table Design

Uma implementação completa de API REST usando **DynamoDB Single Table Design** com Node.js, TypeScript e arquitetura limpa. Este projeto demonstra práticas avançadas de desenvolvimento backend, otimização de custos em cloud e implementação de padrões arquiteturais sólidos.

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido para demonstrar:

- **Single Table Design** no DynamoDB para otimização de custos
- **Arquitetura Limpa** seguindo princípios SOLID
- **TypeScript** com tipagem forte e validação em runtime
- **Padrões de Design** como Factory e Repository
- **Tratamento robusto de erros** com tipos customizados
- **Desenvolvimento local** com LocalStack

## 🏗️ Arquitetura

### Single Table Design

```
┌─────────────────────────────────────────────────────────────┐
│                    SingleTableDesign                        │
├─────────────────────────────────────────────────────────────┤
│ PK: USER#123          │ SK: PROFILE#123                     │
│ GSI1PK: EMAIL#user@   │ GSI1SK: USER                        │
│ GSI2PK: STATUS#ACTIVE │ GSI2SK: USER#123                    │
│ type: USER            │ email, name, status, preferences... │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura de Camadas

```
📁 src/
├── 🏛️  domain/          # Entidades e regras de negócio
├── ⚙️  application/     # Casos de uso e lógica de aplicação
├── 🔧 infrastructure/   # Implementações externas
└── 🌐 presentation/     # Controllers e rotas
```

## ✨ Funcionalidades Principais

### 🔄 Operações CRUD Completas

- ✅ Criar usuário com validação robusta
- ✅ Buscar por ID, email ou status
- ✅ Atualizar dados com controle de versão
- ✅ Deletar com confirmação

### 🔍 Consultas Otimizadas

- **GSI1**: Busca por email (O(1))
- **GSI2**: Filtros por status (O(1))
- **Sem Table Scans**: Todas as consultas usam índices

### 🛡️ Validação e Segurança

- Validação com Zod e mensagens detalhadas
- Tratamento global de erros
- Tipos TypeScript em toda a aplicação
- Middleware de logging e monitoramento

## 🚀 Tecnologias Utilizadas

| Categoria          | Tecnologias                |
| ------------------ | -------------------------- |
| **Runtime**        | Node.js 18+                |
| **Linguagem**      | TypeScript                 |
| **Framework**      | Express.js                 |
| **Banco de Dados** | DynamoDB (AWS)             |
| **Validação**      | Zod                        |
| **Arquitetura**    | Clean Architecture         |
| **Padrões**        | SOLID, Factory, Repository |
| **DevOps**         | Docker, LocalStack         |

## 🔧 Configuração Local

O projeto oferece duas formas de configuração:

### 🐳 **Docker (Recomendado para Demonstração)**

Para setup rápido e ambiente isolado:

```bash
docker-compose up -d
```

> 📖 **Para instruções detalhadas de Docker**, consulte o [README-DOCKER.md](./README-DOCKER.md)

### 🔧 **Configuração Manual (Recomendado para Desenvolvimento)**

Para desenvolvimento com debugging nativo e melhor performance:

```bash
npm install
docker-compose up localstack -d  # Apenas LocalStack
npm run dev
```

> 📖 **Para instruções detalhadas de configuração manual**, consulte o [README-LOCAL.md](./README-LOCAL.md)

## 📊 Otimização de Custos

Esta implementação reduz significativamente os custos do DynamoDB através de:

1. **Single Table Design** - Elimina joins e consultas múltiplas
2. **Chaves Eficientes** - Partition keys otimizadas para distribuição
3. **GSI Estratégico** - Apenas quando necessário
4. **Sem Scans** - Todas as consultas usam índices
5. **Projeção Mínima** - Apenas dados necessários

## 📈 Métricas de Qualidade

- **Cobertura de Tipos**: 100% TypeScript
- **Validação**: Zod em todas as entradas
- **Tratamento de Erros**: 100% dos casos cobertos
- **Performance**: Consultas O(1) em todos os endpoints
- **Custos**: Otimizado para mínimo consumo de RCU/WCU

## 🎯 Aprendizados Demonstrados

### Arquitetura e Design

- Clean Architecture com separação clara de responsabilidades
- Princípios SOLID implementados
- Padrão Factory para injeção de dependência
- Repository pattern para abstração de dados

### Cloud e Performance

- Single Table Design no DynamoDB
- Otimização de custos em cloud
- Uso eficiente de índices globais
- Estratégias de particionamento

### Desenvolvimento

- TypeScript com tipagem forte
- Validação robusta com Zod
- Tratamento abrangente de erros
- Middleware customizado

## 🤝 Contribuindo

Este é um projeto de demonstração/portfólio. Se você quiser contribuir com melhorias ou tiver sugestões, sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido para demonstrar habilidades em desenvolvimento backend moderno e arquitetura de sistemas escaláveis.**
