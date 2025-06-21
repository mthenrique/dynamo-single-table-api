# Otimizando Custos com DynamoDB usando a abordagem Single Table Design

## Introdução

Neste artigo, apresento uma implementação prática de uma API REST utilizando Node.js e TypeScript, que demonstra como o padrão Single Table Design do DynamoDB pode reduzir significativamente os custos operacionais. Esta implementação foi inspirada em uma experiência real onde consegui reduzir em 70% os custos com o DynamoDB, eliminando consultas desnecessárias e otimizando o uso de chaves.

## O Desafio do DynamoDB

O DynamoDB é um serviço NoSQL gerenciado da AWS que oferece baixa latência e escalabilidade automática. No entanto, seu modelo de preços pode se tornar custoso se não for utilizado de forma otimizada. Os principais fatores que impactam o custo são:

**1. Operações de leitura/escrita**
O DynamoDB cobra por unidades de capacidade consumidas, não por quantidade de dados processados. Uma Unidade de Capacidade de Leitura (RCU) permite uma leitura consistente por segundo de até 4KB, enquanto uma Unidade de Capacidade de Escrita (WCU) permite uma escrita por segundo de até 1KB.

O problema surge quando aplicações fazem múltiplas consultas para recuperar dados relacionados. Por exemplo, buscar um usuário e depois fazer consultas separadas para seus pedidos, endereços e preferências pode consumir dezenas de RCUs, quando uma única consulta bem estruturada poderia resolver tudo.

**2. Armazenamento de dados**
O custo de armazenamento é cobrado por GB/mês. Embora pareça baixo inicialmente, a duplicação desnecessária de dados pode inflar significativamente os custos. Sem um design adequado, é comum ver:

- Dados repetidos em múltiplas tabelas
- Informações desnormalizadas em excesso
- Atributos grandes armazenados quando poderiam ser referenciados externamente

**3. Transferência de dados**
Refere-se ao tráfego de rede entre o DynamoDB e outros serviços AWS ou para fora da AWS. Os custos incluem:

- Transferência entre regiões AWS
- Tráfego de saída para a internet
- Replicação global (quando habilitada)

Consultas que retornam grandes volumes de dados desnecessários aumentam significativamente esses custos.

**4. Uso de índices secundários globais (GSIs)**
Cada GSI é essencialmente uma tabela separada que mantém uma cópia dos dados com uma chave de partição diferente. Os custos incluem:

- Capacidade de leitura/escrita dedicada para cada índice
- Armazenamento adicional para os dados duplicados
- Sincronização automática entre a tabela principal e os índices

Aplicações mal projetadas podem acabar criando múltiplos GSIs quando um design de tabela única poderia eliminar essa necessidade, resultando em custos operacionais muito mais altos.

## A Solução: Single Table Design

O Single Table Design é um padrão que consiste em armazenar diferentes tipos de entidades em uma única tabela do DynamoDB, utilizando uma estrutura de chaves bem definida. Esta abordagem traz diversos benefícios:

### 1. Estrutura de Chaves Otimizada

Em nossa implementação, utilizamos a seguinte estrutura:

```typescript
// Partition Key (PK)
USER#${userId}
// Sort Key (SK)
PROFILE#${userId}

// GSI1 (para busca por email)
PK: EMAIL#${email}
SK: USER

// GSI2 (para busca por status)
PK: STATUS#${status}
SK: USER#${userId}
```

### 2. Benefícios da Arquitetura

- **Consultas Eficientes**: Todas as consultas são feitas diretamente na chave primária ou em índices secundários
- **Menos GSIs**: Redução no número de índices secundários necessários
- **Menos Tabelas**: Simplificação da infraestrutura
- **Custos Reduzidos**: Menos operações de leitura/escrita

## Implementação Técnica

### Arquitetura Limpa

O projeto segue os princípios SOLID e Clean Architecture, dividido em camadas:

```
src/
├── domain/ # Entidades, interfaces e regras de negócio
│ ├── entities/ # Entidades de domínio (User, BaseEntity)
│ ├── repositories/ # Interfaces dos repositórios
│ ├── errors/ # Classes de erro customizadas
│ └── validators/ # Interfaces de validação
│ └── schemas/ # Schemas de validação (Zod)
├── application/ # Lógica de negócio e casos de uso
│ └── use-cases/ # Casos de uso específicos
├── infrastructure/ # Implementações concretas
│ ├── repositories/ # Implementações dos repositórios
│ ├── validators/ # Implementações de validação (Zod)
│ ├── config/ # Configurações (env, etc.)
│ └── factories/ # Factories para injeção de dependência
├── presentation/ # Controllers, rotas e middlewares
│ ├── controllers/ # Controllers da aplicação
│ ├── routes/ # Definição de rotas
│ └── middlewares/ # Middlewares (error handling, logging)
```

### Exemplo de Entidade

```typescript
interface User extends BaseEntity {
  email: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  preferences?: {
    theme: 'LIGHT' | 'DARK';
    notifications: boolean;
  };
}
```

### Padrão Repository

```typescript
interface IBaseRepository<T extends BaseEntity> {
  create(item: Omit<T, 'createdAt' | 'updatedAt'>): Promise<T>;
  get(PK: string, SK: string): Promise<T | null>;
  update(PK: string, SK: string, item: Partial<T>): Promise<T>;
  delete(PK: string, SK: string): Promise<void>;
  queryByPK(PK: string): Promise<T[]>;
  queryByGSI1(GSI1PK: string, GSI1SK: string): Promise<T[]>;
  queryByGSI2(GSI2PK: string, GSI2SK: string): Promise<T[]>;
}
```

## Otimizações de Custo

### 1. Eliminação de Scans

O Scan é uma das operações mais custosas no DynamoDB, pois examina todos os itens da tabela ou índice, consumindo RCUs mesmo para dados não utilizados.

**O Problema dos Scans:**

- **Consumo linear:** Um scan de uma tabela de 1GB consome ~256 RCUs, independentemente de quantos itens você realmente precisa
- **Custos imprevisíveis:** À medida que a tabela cresce, o custo do scan aumenta proporcionalmente
- **Performance degradada:** Scans são lentos e podem atingir limites de timeout em tabelas grandes
- **Desperdício de capacidade:** Você paga para ler dados que não vai usar

**A Solução:** Consultas Diretas
Com Single Table Design, todas as consultas são feitas via chaves primárias ou GSIs:

- Query por chave primária: Consome apenas 1 RCU para até 4KB de dados
- Query por GSI: Acesso direto aos dados necessários, sem varredura desnecessária
- Previsibilidade: Custos proporcionais aos dados realmente utilizados
- Performance: Latência consistente de single-digit milliseconds

Exemplo prático: Buscar todos os pedidos de um usuário específico:

- **Com múltiplas tabelas:** Scan na tabela de pedidos filtrando por user_id (custoso e lento)
- **Com Single Table:** Query direta usando PK=USER#123 e SK begins_with ORDER# (eficiente e barato)

**Resumo:**

- Todas as consultas são feitas via chaves primárias ou GSIs
- Nenhum scan de tabela é necessário
- Redução significativa no consumo de RCUs/WCUs

### 2. Uso Eficiente de GSIs

**Estratégia Minimalista**

- Apenas dois GSIs são utilizados em vez de múltiplos índices especializados
- GSI1: Para consultas por atributos alternativos (ex: email, documento)
- GSI2: Para consultas por status, categoria ou filtros temporais

### 3. Padrões de Acesso Otimizados

**Mapeamento Estratégico**
Cada tipo de consulta é direcionado para o método mais eficiente:

- Consultas por ID: Usa chave primária (mais barato e rápido)
- Consultas por email: Usa GSI1 (acesso direto sem filtros)
- Consultas por status: Usa GSI2 (agrupamento por estado)

## Resultados e Benefícios

1.  **Redução de Custos**: Grande economia em comparação com abordagem multi-tabela
2.  **Melhor Performance**: Latência consistente em todas as operações
3.  **Código Mais Limpo**: Arquitetura bem definida e fácil de manter
4.  **Escalabilidade**: Fácil adição de novos tipos de entidades

## Considerações para Implementação

1.  **Design de Chaves**: Crucial para o sucesso do Single Table Design
2.  **Padrões de Acesso**: Deve ser bem definido antes da implementação
3.  **Validação de Dados**: Importante para manter a integridade
4.  **Monitoramento**: Necessário para identificar gargalos

## Conclusão

O Single Table Design, quando implementado corretamente, pode trazer benefícios significativos em termos de custo e performance. Esta implementação serve como um exemplo prático de como aplicar este padrão em uma API Node.js moderna, seguindo boas práticas de desenvolvimento e princípios SOLID.

## Referências

- [AWS DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [Single Table Design](https://www.alexdebrie.com/posts/dynamodb-single-table/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Escolhendo a chave de partição do Dynamo DB](https://aws.amazon.com/pt/blogs/aws-brasil/choosing-the-right-dynamodb-partition-key/)
- [DynamoDB - Aula Completa (Explicação resumida)](https://www.youtube.com/watch?v=nSxQdZSvxU8)
- [Conceitos básicos sobre DynamoDB (Partes importantes)](https://www.youtube.com/watch?v=9AkzibsIZUk)
- [Como modelar com DynamoDB (Vídeo completo):](https://www.youtube.com/watch?v=kSnpuKr3Ajw)
- [DynamoDB Scan vs Query - The Things You Need To Know](https://www.youtube.com/watch?v=U-yApJ2_FCE)
- [DynamoDB Example Query](https://www.youtube.com/watch?v=GzyMqh3BBzk)
- [Amazon DynamoDB: O quê, por que e quando usar o design de tabela única com DynamoDB!](https://dev.to/oieduardorabelo/amazon-dynamodb-o-que-por-que-e-quando-usar-o-design-de-tabela-unica-com-dynamodb-ao9)
