# 🚀 Supabase MCP 설치 가이드

AI가 직접 Supabase 데이터베이스를 조작할 수 있도록 MCP 서버를 설정합니다.

---

## 📋 설치 단계

### **Step 1: Supabase Access Token 생성**

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 로그인
   - 프로젝트 선택: `cnumxvxxyxexzzyeinjr`

2. **Access Token 생성**
   - 좌측 하단 **Settings** (⚙️) 클릭
   - **Access Tokens** 클릭
   - **Generate new token** 버튼 클릭
   - 토큰 이름: `MCP Server` (아무거나)
   - **Generate token** 클릭
   - ⚠️ **토큰을 복사하세요!** (다시 볼 수 없음)

3. **복사한 토큰 예시**
   ```
   sbp_1a2b3c4d5e6f7g8h9i0j...
   ```

---

### **Step 2: MCP 설정 파일 생성**

터미널에서 실행:

```bash
cd /Users/sunyounglee/Documents/Cursor/babyshop

# MCP 설정 파일 생성
cat > .cursor/mcp.json << 'EOF'
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "여기에_Step1에서_복사한_토큰_붙여넣기"
      ]
    }
  }
}
EOF
```

**또는** 직접 파일 생성:
1. `.cursor/mcp.json` 파일 생성
2. `mcp-config-template.json` 내용 복사
3. `YOUR_SUPABASE_ACCESS_TOKEN_HERE` 부분을 실제 토큰으로 변경

---

### **Step 3: Cursor 재시작**

1. **Cursor 완전히 종료** (`Cmd + Q`)
2. **다시 실행**
3. MCP 서버가 자동으로 시작됩니다

---

### **Step 4: 확인**

Cursor에서 AI에게 물어보기:

```
"Supabase MCP가 연결되었는지 확인해줘"
"products 테이블이 있는지 확인해줘"
```

---

## 🎯 사용 방법

MCP 설정 후 AI에게 다음과 같이 요청할 수 있습니다:

### **테이블 생성**
```
"products 테이블을 만들어줘"
"product_images 테이블 만들어줘"
```

### **데이터 조회**
```
"products 테이블의 모든 데이터를 보여줘"
"카테고리별 제품 수를 알려줘"
```

### **데이터 수정**
```
"제품 ID 1의 가격을 20.00으로 변경해줘"
"재고가 5개 이하인 제품을 보여줘"
```

---

## 🔧 문제 해결

### **에러: MCP server not found**

```bash
# Node.js 버전 확인
node -v

# 16.0.0 이상이어야 함
# 업데이트 필요시:
brew install node
```

### **에러: Access token invalid**

- Supabase Dashboard에서 토큰을 다시 생성
- `.cursor/mcp.json` 파일에서 토큰 업데이트
- Cursor 재시작

### **에러: Permission denied**

```bash
# .cursor 폴더 권한 확인
ls -la .cursor

# 권한 수정
chmod 755 .cursor
chmod 644 .cursor/mcp.json
```

---

## 📊 MCP vs Manual

| 방법 | 장점 | 단점 |
|------|------|------|
| **MCP 서버** | AI가 직접 DB 조작 가능<br>자동화 쉬움 | 초기 설정 필요<br>토큰 관리 |
| **수동 실행** | 설정 불필요<br>즉시 사용 가능 | Dashboard 수동 접속<br>반복 작업 번거로움 |

---

## 🎉 완료 후

설정이 완료되면 AI에게:

```
"supabase-products-schema.sql 파일을 실행해서 
 테이블을 생성해줘"
```

이제 AI가 직접 Supabase에 접속해서 테이블을 만들어줍니다! 🚀

---

## 💡 보안 주의사항

⚠️ **Access Token은 절대 Git에 커밋하지 마세요!**

`.gitignore`에 추가:
```
.cursor/
mcp-config-template.json
```

---

## 📞 도움이 필요하면

설정 중 문제가 생기면:
1. Cursor를 재시작
2. 터미널에서 `npx @supabase/mcp-server-supabase --version` 실행
3. 에러 메시지를 AI에게 알려주기
