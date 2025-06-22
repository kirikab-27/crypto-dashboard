#!/bin/bash

# 知識分析スクリプト
# vibe-coding-template v2.2の知識ファイルを分析し、統計情報を生成

set -e

# カラー定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 変数定義
KNOWLEDGE_DIR="$HOME/vibe-shared-knowledge"
TEMPLATE_DIR="$HOME/vibe-coding-template"
EXPERIMENTS_DIR="$HOME/vibe-experiments"
OUTPUT_FILE="$KNOWLEDGE_DIR/analysis-$(date +%Y%m%d-%H%M%S).txt"

echo -e "${BLUE}=== VIBE Knowledge Analysis v2.2 ===${NC}"
echo -e "${BLUE}分析開始: $(date)${NC}\n"

# 知識ディレクトリの存在確認
if [ ! -d "$KNOWLEDGE_DIR" ]; then
    echo -e "${YELLOW}警告: 知識ディレクトリが見つかりません: $KNOWLEDGE_DIR${NC}"
    exit 1
fi

# 出力ファイルの準備
mkdir -p "$(dirname "$OUTPUT_FILE")"
exec > >(tee "$OUTPUT_FILE")

# 1. 知識ファイルの統計
echo -e "${GREEN}1. 知識ファイル統計${NC}"
echo "================================"

# 総ファイル数
total_files=$(find "$KNOWLEDGE_DIR" -name "k*.md" -type f | wc -l)
echo "総知識ファイル数: $total_files"

# ディレクトリ別のファイル数
echo -e "\nディレクトリ別統計:"
find "$KNOWLEDGE_DIR" -name "k*.md" -type f | sed 's|.*/\(.*\)/k[0-9]*.md|\1|' | sort | uniq -c | sort -rn

# ファイルサイズ統計
total_size=$(find "$KNOWLEDGE_DIR" -name "k*.md" -type f -exec du -ch {} + | grep total$ | awk '{print $1}')
echo -e "\n総ファイルサイズ: $total_size"

# 2. 最も参照されている知識IDのランキング
echo -e "\n${GREEN}2. 知識ID参照ランキング${NC}"
echo "================================"

# プロジェクトディレクトリから知識IDの参照を検索
if [ -d "$EXPERIMENTS_DIR" ]; then
    echo "プロジェクト内での知識ID参照頻度:"
    grep -r "k[0-9]\{3\}" "$EXPERIMENTS_DIR" 2>/dev/null | \
        grep -o "k[0-9]\{3\}" | \
        sort | uniq -c | sort -rn | head -20
fi

# 3. カテゴリ別分析
echo -e "\n${GREEN}3. カテゴリ別知識分析${NC}"
echo "================================"

# カテゴリ抽出（ファイル内容から）
echo "知識カテゴリ分布:"
for file in $(find "$KNOWLEDGE_DIR" -name "k*.md" -type f); do
    category=$(grep -m1 "^カテゴリ:" "$file" 2>/dev/null | sed 's/カテゴリ: *//' || echo "未分類")
    echo "$category"
done | sort | uniq -c | sort -rn

# 4. 時系列分析
echo -e "\n${GREEN}4. 時系列分析${NC}"
echo "================================"

# 日付別の知識追加数
echo "日付別知識追加数（最新20日）:"
find "$KNOWLEDGE_DIR" -name "k*.md" -type f -printf "%TY-%Tm-%Td\n" | \
    sort | uniq -c | tail -20

# 5. プロジェクト間知識共有状況
echo -e "\n${GREEN}5. プロジェクト間知識共有${NC}"
echo "================================"

# 各プロジェクトで使用されている知識ID
for project in task-management-saas image-sharing-sns markdown-memo-app; do
    if [ -d "$EXPERIMENTS_DIR/$project" ]; then
        echo -e "\n$project で使用されている知識ID:"
        grep -r "k[0-9]\{3\}" "$EXPERIMENTS_DIR/$project" 2>/dev/null | \
            grep -o "k[0-9]\{3\}" | sort | uniq | tr '\n' ' '
        echo
    fi
done

# 6. エラーパターン分析
echo -e "\n${GREEN}6. エラーパターン分析${NC}"
echo "================================"

# エラー関連の知識を抽出
echo "エラー解決に関する知識:"
grep -l "エラー\|error\|Error" "$KNOWLEDGE_DIR"/*.md 2>/dev/null | \
    xargs -I {} basename {} | sort

# 7. 技術スタック分析
echo -e "\n${GREEN}7. 技術スタック分析${NC}"
echo "================================"

# 主要な技術キーワードの出現頻度
echo "技術キーワード出現頻度:"
technologies=("React" "Next.js" "TypeScript" "Tailwind" "Prisma" "Supabase" "Docker" "Git" "npm" "Node.js")
for tech in "${technologies[@]}"; do
    count=$(grep -i "$tech" "$KNOWLEDGE_DIR"/*.md 2>/dev/null | wc -l)
    if [ $count -gt 0 ]; then
        printf "%-15s: %3d回\n" "$tech" "$count"
    fi
done

# 8. サマリー生成
echo -e "\n${GREEN}8. 分析サマリー${NC}"
echo "================================"
echo "分析完了: $(date)"
echo "結果ファイル: $OUTPUT_FILE"
echo -e "\n主要な発見:"
echo "- 総知識数: $total_files"
echo "- 総サイズ: $total_size"
echo "- 最も参照されている知識: $(grep -r "k[0-9]\{3\}" "$EXPERIMENTS_DIR" 2>/dev/null | grep -o "k[0-9]\{3\}" | sort | uniq -c | sort -rn | head -1 | awk '{print $2 " (" $1 "回)"}')"

echo -e "\n${BLUE}分析完了！${NC}"
echo "詳細な結果は $OUTPUT_FILE を参照してください。"

# INSIGHTSファイルの生成準備
INSIGHTS_FILE="$KNOWLEDGE_DIR/INSIGHTS.md"
echo -e "\n${YELLOW}次のステップ: $INSIGHTS_FILE の生成${NC}"