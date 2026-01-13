#!/usr/bin/env node

/**
 * Supabase SQL 직접 실행 스크립트
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 환경 변수
const SUPABASE_URL = 'https://cnumxvxxyxexzzyeinjr.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNudW14dnh4eXhleHp6eWVpbmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MzU0MzcsImV4cCI6MjA4MzQxMTQzN30.s5Rv_-7wERhH_r3_0AUiR2c3ZKDRfZF6HmyxovrmPnY';

console.log('\n🚀 Supabase 스키마 적용\n');
console.log('⚠️  안타깝게도 JavaScript 클라이언트로는 CREATE TABLE 같은');
console.log('   DDL 명령어를 직접 실행할 수 없습니다.\n');
console.log('📋 Supabase Dashboard에서 수동 실행이 필요합니다:\n');
console.log('   1. https://supabase.com/dashboard 접속');
console.log('   2. 프로젝트 선택: cnumxvxxyxexzzyeinjr');
console.log('   3. SQL Editor → New Query');
console.log('   4. 아래 파일 내용 복사/붙여넣기:');
console.log('      📁 supabase-products-schema.sql');
console.log('   5. RUN 버튼 클릭 ▶️\n');

const sqlFilePath = join(__dirname, '..', 'supabase-products-schema.sql');
const sqlContent = readFileSync(sqlFilePath, 'utf8');
const lines = sqlContent.split('\n').length;

console.log(`📊 파일 정보:`);
console.log(`   - 경로: ${sqlFilePath}`);
console.log(`   - 줄 수: ${lines} 줄`);
console.log(`   - 크기: ${(sqlContent.length / 1024).toFixed(1)} KB\n`);

// SQL 내용 미리보기
console.log('📝 SQL 미리보기 (처음 20줄):\n');
console.log('─'.repeat(60));
const preview = sqlContent.split('\n').slice(0, 20).join('\n');
console.log(preview);
console.log('─'.repeat(60));
console.log(`... (${lines - 20}줄 더)\n`);

console.log('💡 또는 터미널에서 파일 복사:');
console.log('   pbcopy < supabase-products-schema.sql\n');

process.exit(0);
