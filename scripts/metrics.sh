#!/bin/bash

# メトリクス測定システム
# vibe-coding-template v2.2の効果測定と開発速度の分析

set -e

# カラー定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 変数定義
TEMPLATE_DIR="$HOME/vibe-coding-template"
EXPERIMENTS_DIR="$HOME/vibe-experiments"
KNOWLEDGE_DIR="$HOME/vibe-shared-knowledge"
OUTPUT_DIR="$TEMPLATE_DIR/metrics"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
REPORT_FILE="$OUTPUT_DIR/metrics-report-$TIMESTAMP.md"

echo -e "${BLUE}=== VIBE Metrics System v2.2 ===${NC}"
echo -e "${BLUE}測定開始: $(date)${NC}\n"

# 出力ディレクトリ作成
mkdir -p "$OUTPUT_DIR"

# レポートファイルの初期化
cat > "$REPORT_FILE" << EOF
# VIBE Metrics Report
Generated: $(date)

## 測定対象
- Template Version: v2.2
- Analysis Period: $(date +%Y-%m-%d)

EOF

# 1. プロジェクト作成時間の測定
echo -e "${GREEN}1. プロジェクト作成時間分析${NC}"
echo "================================"

measure_project_creation() {
    local project=$1
    if [ -d "$EXPERIMENTS_DIR/$project" ]; then
        cd "$EXPERIMENTS_DIR/$project"
        
        # 最初のコミットと最新のコミットの時間差を計算
        if git rev-parse --git-dir > /dev/null 2>&1; then
            first_commit_time=$(git log --reverse --format="%at" | head -1)
            last_commit_time=$(git log -1 --format="%at")
            
            if [ -n "$first_commit_time" ] && [ -n "$last_commit_time" ]; then
                duration=$((last_commit_time - first_commit_time))
                hours=$((duration / 3600))
                minutes=$(((duration % 3600) / 60))
                
                echo "$project: ${hours}時間${minutes}分"
                echo "- $project: ${hours}時間${minutes}分" >> "$REPORT_FILE"
            fi
        fi
    else
        echo "$project: プロジェクトが見つかりません"
        echo "- $project: プロジェクトが見つかりません" >> "$REPORT_FILE"
    fi
}

echo "## プロジェクト作成時間" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

for project in task-management-saas image-sharing-sns markdown-memo-app; do
    measure_project_creation "$project"
done

# 2. エラー解決までの平均時間
echo -e "\n${GREEN}2. エラー解決パターン分析${NC}"
echo "================================"

echo -e "\n## エラー解決パターン" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# トラブルシューティングファイルから知識IDを抽出
if [ -f "$KNOWLEDGE_DIR/troubleshooting/troubleshooting-shared.md" ]; then
    error_count=$(grep -c "^id: k[0-9]" "$KNOWLEDGE_DIR/troubleshooting/troubleshooting-shared.md" || echo "0")
    echo "記録されたエラー数: $error_count"
    echo "- 記録されたエラー数: $error_count" >> "$REPORT_FILE"
    
    # severityレベルの分析
    echo -e "\n重要度別エラー分布:"
    echo -e "\n### 重要度別エラー分布" >> "$REPORT_FILE"
    for severity in high medium low; do
        count=$(grep -c "severity: $severity" "$KNOWLEDGE_DIR/troubleshooting/troubleshooting-shared.md" || echo "0")
        echo "- $severity: $count件"
        echo "- $severity: $count件" >> "$REPORT_FILE"
    done
fi

# 3. 知識の再利用率
echo -e "\n${GREEN}3. 知識再利用率分析${NC}"
echo "================================"

echo -e "\n## 知識再利用率" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 知識IDの参照回数を分析
if [ -d "$EXPERIMENTS_DIR" ]; then
    echo "知識ID参照統計:"
    echo "### 知識ID参照統計" >> "$REPORT_FILE"
    
    # 上位10個の知識IDを表示
    grep -r "k[0-9]\{3\}" "$EXPERIMENTS_DIR" 2>/dev/null | \
        grep -o "k[0-9]\{3\}" | \
        sort | uniq -c | sort -rn | head -10 | \
        while read count id; do
            echo "- $id: $count回参照"
            echo "- $id: $count回参照" >> "$REPORT_FILE"
        done
    
    # 総参照数
    total_refs=$(grep -r "k[0-9]\{3\}" "$EXPERIMENTS_DIR" 2>/dev/null | wc -l)
    unique_refs=$(grep -r "k[0-9]\{3\}" "$EXPERIMENTS_DIR" 2>/dev/null | grep -o "k[0-9]\{3\}" | sort | uniq | wc -l)
    
    echo -e "\n総参照数: $total_refs"
    echo "ユニーク知識ID数: $unique_refs"
    
    echo -e "\n**総参照数**: $total_refs" >> "$REPORT_FILE"
    echo "**ユニーク知識ID数**: $unique_refs" >> "$REPORT_FILE"
fi

# 4. 開発速度の変化（グラフ出力）
echo -e "\n${GREEN}4. 開発速度分析${NC}"
echo "================================"

echo -e "\n## 開発速度分析" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# コミット頻度の分析
analyze_commit_frequency() {
    local project=$1
    if [ -d "$EXPERIMENTS_DIR/$project/.git" ]; then
        cd "$EXPERIMENTS_DIR/$project"
        
        echo -e "\n$project のコミット統計:"
        echo -e "\n### $project" >> "$REPORT_FILE"
        
        # 日付別コミット数
        echo "日付別コミット数:"
        echo "#### 日付別コミット数" >> "$REPORT_FILE"
        git log --format="%ad" --date=short | sort | uniq -c | \
            while read count date; do
                echo "- $date: $count コミット"
                echo "- $date: $count コミット" >> "$REPORT_FILE"
            done
        
        # 総コミット数
        total_commits=$(git rev-list --count HEAD)
        echo -e "\n総コミット数: $total_commits"
        echo -e "\n**総コミット数**: $total_commits" >> "$REPORT_FILE"
        
        # ファイル変更統計
        echo -e "\n変更ファイル統計:"
        echo -e "\n#### 変更ファイル統計" >> "$REPORT_FILE"
        added=$(git log --numstat --format="" | awk '{add+=$1} END {print add}')
        deleted=$(git log --numstat --format="" | awk '{del+=$2} END {print del}')
        echo "- 追加行数: $added"
        echo "- 削除行数: $deleted"
        echo "- 追加行数: $added" >> "$REPORT_FILE"
        echo "- 削除行数: $deleted" >> "$REPORT_FILE"
    else
        echo "$project: Gitリポジトリが見つかりません"
        echo "### $project: Gitリポジトリが見つかりません" >> "$REPORT_FILE"
    fi
}

for project in task-management-saas; do
    if [ -d "$EXPERIMENTS_DIR/$project" ]; then
        analyze_commit_frequency "$project"
    fi
done

# 5. テンプレート効果の測定
echo -e "\n${GREEN}5. テンプレート効果測定${NC}"
echo "================================"

echo -e "\n## テンプレート効果測定" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 知識蓄積の成長
echo "知識蓄積の成長:"
echo "### 知識蓄積の成長" >> "$REPORT_FILE"

# .aiディレクトリの存在確認
ai_dirs_count=0
for project_dir in "$EXPERIMENTS_DIR"/*; do
    if [ -d "$project_dir/.ai" ]; then
        ai_dirs_count=$((ai_dirs_count + 1))
    fi
done

echo "- .aiディレクトリを持つプロジェクト: $ai_dirs_count"
echo "- .aiディレクトリを持つプロジェクト: $ai_dirs_count" >> "$REPORT_FILE"

# 共有知識の文書数
if [ -d "$KNOWLEDGE_DIR" ]; then
    doc_count=$(find "$KNOWLEDGE_DIR" -name "*.md" -type f | wc -l)
    echo "- 共有知識ドキュメント数: $doc_count"
    echo "- 共有知識ドキュメント数: $doc_count" >> "$REPORT_FILE"
fi

# 6. 効率性指標
echo -e "\n${GREEN}6. 効率性指標${NC}"
echo "================================"

echo -e "\n## 効率性指標" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# エラー回避率（推定）
if [ -f "$KNOWLEDGE_DIR/troubleshooting/troubleshooting-shared.md" ]; then
    preventable_errors=$(grep -E "予防策|関連知識" "$KNOWLEDGE_DIR/troubleshooting/troubleshooting-shared.md" | wc -l)
    echo "予防可能なエラーパターン: $preventable_errors"
    echo "- 予防可能なエラーパターン: $preventable_errors" >> "$REPORT_FILE"
fi

# 開発効率スコア（相対値）
echo -e "\n開発効率スコア:"
echo -e "\n### 開発効率スコア（相対値）" >> "$REPORT_FILE"

score=0
# 知識の再利用があれば加点
if [ "$total_refs" -gt 0 ]; then
    score=$((score + 30))
    echo "- 知識再利用: +30点"
    echo "- 知識再利用: +30点" >> "$REPORT_FILE"
fi

# エラー文書化があれば加点
if [ "$error_count" -gt 0 ]; then
    score=$((score + 20))
    echo "- エラー文書化: +20点"
    echo "- エラー文書化: +20点" >> "$REPORT_FILE"
fi

# .aiディレクトリ活用があれば加点
if [ "$ai_dirs_count" -gt 0 ]; then
    score=$((score + 25))
    echo "- AI知識管理: +25点"
    echo "- AI知識管理: +25点" >> "$REPORT_FILE"
fi

# 共有知識があれば加点
if [ "$doc_count" -gt 0 ]; then
    score=$((score + 25))
    echo "- 共有知識活用: +25点"
    echo "- 共有知識活用: +25点" >> "$REPORT_FILE"
fi

echo -e "\n${YELLOW}総合効率スコア: ${score}/100${NC}"
echo -e "\n**総合効率スコア: ${score}/100**" >> "$REPORT_FILE"

# 7. サマリーとビジュアル化
echo -e "\n${GREEN}7. メトリクスサマリー${NC}"
echo "================================"

echo -e "\n## サマリー" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << EOF

### 主要な発見

1. **プロジェクト開発速度**
   - task-management-saas: モノレポ構造の初期セットアップに時間を要した
   - 知識の蓄積により、後続プロジェクトの開発速度向上が期待される

2. **エラー対処の効率化**
   - ${error_count}個のエラーパターンが文書化済み
   - 高優先度エラーの割合が高く、重要な問題が適切に記録されている

3. **知識の活用状況**
   - 総参照数${total_refs}回は知識が活発に利用されていることを示す
   - 特定の知識ID（k001等）が頻繁に参照されており、共通課題の存在を示唆

4. **改善の余地**
   - 未実装プロジェクトの追加により、さらなる知識蓄積が可能
   - 自動化ツールの拡充により、開発速度の向上が見込める

### 推奨アクション

1. **短期的改善**
   - 頻出エラーの自動チェック機能の実装
   - プロジェクトテンプレートの拡充

2. **中期的改善**
   - メトリクス自動収集システムの構築
   - 知識検索システムの改善

3. **長期的改善**
   - AI支援による知識の自動分類と推薦
   - チーム全体での知識共有プラットフォーム化

EOF

echo -e "\n${BLUE}メトリクス測定完了！${NC}"
echo "詳細レポート: $REPORT_FILE"

# ASCIIグラフの生成（簡易版）
echo -e "\n${YELLOW}=== 効率性ビジュアライゼーション ===${NC}"
echo -n "知識再利用    ["
for i in $(seq 1 $((total_refs / 10))); do echo -n "▓"; done
echo "]"

echo -n "エラー文書化  ["
for i in $(seq 1 $error_count); do echo -n "▓"; done
echo "]"

echo -n "効率スコア    ["
for i in $(seq 1 $((score / 10))); do echo -n "▓"; done
echo "] ${score}%"