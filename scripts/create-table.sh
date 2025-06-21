#!/bin/bash

set -e

echo "🔍 Waiting for LocalStack to be ready..."

# Wait for LocalStack to be fully ready
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
  if curl -s http://localstack:4566/_localstack/health > /dev/null; then
    echo "✅ LocalStack is ready!"
    break
  fi
  
  echo "⏳ Attempt $attempt/$max_attempts - LocalStack not ready yet..."
  sleep 2
  attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
  echo "❌ LocalStack failed to start within expected time"
  exit 1
fi

echo "🔍 Checking if table already exists..."

# Check if table already exists
if aws --endpoint-url=http://localstack:4566 dynamodb describe-table --table-name SingleTableDesign > /dev/null 2>&1; then
  echo "✅ Table 'SingleTableDesign' already exists!"
  exit 0
fi

echo "🚀 Creating DynamoDB table 'SingleTableDesign'..."

aws --endpoint-url=http://localstack:4566 dynamodb create-table \
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
    '[
      {
        "IndexName": "GSI1",
        "KeySchema": [
          {"AttributeName": "GSI1PK", "KeyType": "HASH"},
          {"AttributeName": "GSI1SK", "KeyType": "RANGE"}
        ],
        "Projection": {"ProjectionType": "ALL"},
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
        "Projection": {"ProjectionType": "ALL"},
        "ProvisionedThroughput": {
          "ReadCapacityUnits": 5,
          "WriteCapacityUnits": 5
        }
      }
    ]' \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

if [ $? -eq 0 ]; then
  echo "✅ DynamoDB table 'SingleTableDesign' created successfully!"
  
  # Wait for table to be active
  echo "⏳ Waiting for table to be active..."
  aws --endpoint-url=http://localstack:4566 dynamodb wait table-exists --table-name SingleTableDesign
  echo "✅ Table is now active and ready to use!"
else
  echo "❌ Failed to create DynamoDB table"
  exit 1
fi 
