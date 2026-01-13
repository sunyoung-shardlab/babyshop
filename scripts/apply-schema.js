#!/usr/bin/env node

/**
 * Supabase 스키마 적용 스크립트
 * 
 * 사용법:
 * node scripts/apply-schema.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 환경 변수 로드
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ VITE_SUPABASE_URL 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY 환경 변수가 필요합니다.');
  console.log('\n📝 Supabase Dashboard > Settings > API > service_role key를 복사하세요.');
  console.log('   그리고 .env.local에 추가: SUPABASE_SERVICE_ROLE_KEY=eyJhbG...');
  process.exit(1);
}

// Service role 키로 클라이언트 생성 (admin 권한)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// SQL 파일 읽기
const sqlFilePath = join(__dirname, '..', 'supabase-products-schema.sql');
let sqlContent;

try {
  sqlContent = readFileSync(sqlFilePath, 'utf8');
  console.log('✅ SQL 파일 로드 완료:', sqlFilePath);
} catch (error) {
  console.error('❌ SQL 파일을 읽을 수 없습니다:', error.message);
  process.exit(1);
}

// SQL을 개별 명령어로 분할
function splitSqlStatements(sql) {
  // 주석 제거
  sql = sql.replace(/--[^\n]*/g, '');
  
  // 여러 줄 주석 제거
  sql = sql.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 세미콜론으로 분할 (문자열 내부 제외)
  const statements = [];
  let current = '';
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const prevChar = i > 0 ? sql[i - 1] : '';
    
    if ((char === "'" || char === '"') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }
    
    if (char === ';' && !inString) {
      current += char;
      const trimmed = current.trim();
      if (trimmed && trimmed !== ';') {
        statements.push(trimmed);
      }
      current = '';
    } else {
      current += char;
    }
  }
  
  // 마지막 문장 추가
  const trimmed = current.trim();
  if (trimmed && trimmed !== ';') {
    statements.push(trimmed);
  }
  
  return statements;
}

// SQL 실행
async function executeSql(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // RPC 함수가 없으면 직접 실행 시도
      if (error.code === 'PGRST202' || error.message.includes('exec_sql')) {
        console.log('⚠️  RPC 함수가 없습니다. Supabase Dashboard에서 직접 실행이 필요합니다.');
        return { error: null, needsManual: true };
      }
      return { error };
    }
    
    return { data, error: null };
  } catch (err) {
    return { error: err };
  }
}

// 메인 실행
async function main() {
  console.log('\n🚀 Supabase 스키마 적용 시작...\n');
  console.log('📊 데이터베이스:', SUPABASE_URL);
  console.log('');
  
  const statements = splitSqlStatements(sqlContent);
  console.log(`📝 총 ${statements.length}개의 SQL 명령어를 실행합니다.\n`);
  
  let successCount = 0;
  let errorCount = 0;
  let needsManual = false;
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const preview = statement.substring(0, 60).replace(/\s+/g, ' ');
    
    process.stdout.write(`[${i + 1}/${statements.length}] ${preview}... `);
    
    const result = await executeSql(statement);
    
    if (result.needsManual) {
      needsManual = true;
      break;
    }
    
    if (result.error) {
      console.log('❌');
      console.error('   에러:', result.error.message || result.error);
      errorCount++;
      
      // 치명적 에러면 중단
      if (!result.error.message?.includes('already exists')) {
        console.log('\n⚠️  치명적 에러 발생. 중단합니다.');
        break;
      }
    } else {
      console.log('✅');
      successCount++;
    }
    
    // API 호출 제한 방지
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (needsManual) {
    console.log('\n⚠️  Supabase에서 직접 SQL 실행이 필요합니다.');
    console.log('\n📋 다음 단계:');
    console.log('1. https://supabase.com/dashboard 접속');
    console.log('2. SQL Editor → New Query');
    console.log('3. supabase-products-schema.sql 내용 복사/붙여넣기');
    console.log('4. RUN 버튼 클릭 ▶️');
    process.exit(1);
  }
  
  console.log(`\n✅ 성공: ${successCount}개`);
  if (errorCount > 0) {
    console.log(`⚠️  에러: ${errorCount}개 (이미 존재하는 객체 등)`);
  }
  
  console.log('\n🎉 스키마 적용 완료!\n');
  
  // 테이블 확인
  console.log('📊 생성된 테이블 확인 중...\n');
  
  const { data: products } = await supabase.from('products').select('id, name').limit(3);
  const { data: categories } = await supabase.from('product_categories').select('name, name_ko').limit(5);
  
  if (products && products.length > 0) {
    console.log('✅ products 테이블:', products.length, '개 제품');
    products.forEach(p => console.log(`   - ${p.name}`));
  }
  
  if (categories && categories.length > 0) {
    console.log('\n✅ product_categories 테이블:', categories.length, '개 카테고리');
    categories.forEach(c => console.log(`   - ${c.name_ko} (${c.name})`));
  }
  
  console.log('\n✨ 완료!\n');
}

main().catch(error => {
  console.error('\n❌ 실행 중 에러 발생:', error);
  process.exit(1);
});
