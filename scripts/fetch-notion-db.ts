import { Client } from '@notionhq/client';

// Notion 설정
const NOTION_API_KEY = process.env.VITE_NOTION_API_KEY || '';
const DATABASE_ID = '2ea9c966a36180c4a651e2e9519762da';

async function fetchNotionDatabase() {
  if (!NOTION_API_KEY) {
    console.error('❌ VITE_NOTION_API_KEY가 .env 파일에 설정되지 않았습니다.');
    console.log('\n📋 설정 방법:');
    console.log('1. https://www.notion.so/my-integrations 에서 Integration 생성');
    console.log('2. API 키 복사');
    console.log('3. .env 파일에 VITE_NOTION_API_KEY=your_api_key 추가');
    console.log('4. Notion 페이지에서 Integration 연결');
    return;
  }

  try {
    const notion = new Client({ auth: NOTION_API_KEY });

    console.log('🔍 Notion 데이터베이스 구조 확인 중...\n');

    // 데이터베이스 정보 가져오기
    const database = await notion.databases.retrieve({ database_id: DATABASE_ID });
    console.log('📊 데이터베이스 정보:');
    console.log('- 제목:', (database as any).title?.[0]?.plain_text || 'N/A');
    console.log('- ID:', database.id);
    console.log('\n📝 속성(Properties):');
    
    const properties = (database as any).properties;
    for (const [key, value] of Object.entries(properties)) {
      console.log(`  - ${key}: ${(value as any).type}`);
    }

    // 데이터베이스 항목 가져오기
    console.log('\n📄 데이터베이스 항목 조회 중...\n');
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: 'created_time',
          direction: 'descending',
        },
      ],
      page_size: 5,
    });

    console.log(`✅ 총 ${response.results.length}개 항목 조회됨\n`);

    // 각 항목의 구조 출력
    response.results.forEach((page: any, index: number) => {
      console.log(`--- 항목 ${index + 1} ---`);
      console.log('ID:', page.id);
      console.log('속성:');
      for (const [key, value] of Object.entries(page.properties)) {
        const prop = value as any;
        let displayValue = 'N/A';
        
        switch (prop.type) {
          case 'title':
            displayValue = prop.title?.[0]?.plain_text || '';
            break;
          case 'rich_text':
            displayValue = prop.rich_text?.[0]?.plain_text || '';
            break;
          case 'date':
            displayValue = prop.date?.start || '';
            break;
          case 'files':
            displayValue = prop.files?.[0]?.name || '';
            break;
          case 'url':
            displayValue = prop.url || '';
            break;
          case 'select':
            displayValue = prop.select?.name || '';
            break;
          case 'multi_select':
            displayValue = prop.multi_select?.map((s: any) => s.name).join(', ') || '';
            break;
        }
        
        console.log(`  ${key} (${prop.type}): ${displayValue}`);
      }
      console.log('');
    });

    console.log('\n✅ 구조 파악 완료!');
    console.log('\n📋 다음 단계: contentService.ts를 Notion API로 수정');

  } catch (error: any) {
    console.error('❌ 오류 발생:', error.message);
    if (error.code === 'object_not_found') {
      console.error('\n💡 해결 방법:');
      console.error('1. Notion 페이지에서 우측 상단 "..." 클릭');
      console.error('2. "Connections" 선택');
      console.error('3. 생성한 Integration 연결');
    }
  }
}

fetchNotionDatabase();
