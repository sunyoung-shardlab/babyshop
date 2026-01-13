#!/bin/bash

# Supabase MCP 설정 스크립트

echo ""
echo "🚀 Supabase MCP 서버 설정"
echo "================================"
echo ""

# Step 1: Access Token 요청
echo "📋 Step 1: Supabase Access Token 생성"
echo ""
echo "1. 브라우저에서 https://supabase.com/dashboard 열기"
echo "2. Settings > Access Tokens > Generate new token"
echo "3. 생성된 토큰 복사 (sbp_...)"
echo ""
read -p "👉 Access Token을 붙여넣으세요: " ACCESS_TOKEN

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Access Token이 입력되지 않았습니다."
  exit 1
fi

echo ""
echo "✅ Access Token 입력 완료"
echo ""

# Step 2: .cursor 폴더 생성
echo "📂 Step 2: .cursor 폴더 생성 중..."
mkdir -p .cursor

# Step 3: MCP 설정 파일 생성
echo "📝 Step 3: MCP 설정 파일 생성 중..."

cat > .cursor/mcp.json << EOF
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "$ACCESS_TOKEN"
      ]
    }
  }
}
EOF

echo "✅ MCP 설정 파일 생성 완료: .cursor/mcp.json"
echo ""

# Step 4: Node.js 확인
echo "🔍 Step 4: Node.js 확인 중..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo "✅ Node.js 설치됨: $NODE_VERSION"
else
  echo "⚠️  Node.js가 설치되지 않았습니다."
  echo "   설치 방법: brew install node"
fi

echo ""
echo "================================"
echo "🎉 설정 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. Cursor를 완전히 종료 (Cmd + Q)"
echo "2. Cursor 다시 실행"
echo "3. AI에게 물어보기: 'products 테이블 만들어줘'"
echo ""
echo "💡 테스트: npx @supabase/mcp-server-supabase --version"
echo ""
