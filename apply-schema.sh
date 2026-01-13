#!/bin/bash

# Supabase 데이터베이스 연결 정보
DB_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# 스키마 적용
psql "$DB_URL" -f supabase-products-schema.sql

echo "✅ 스키마 적용 완료!"
