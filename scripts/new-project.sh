#!/bin/bash

# VIBE Coding Template - New Project Creator
# 知識共有システム統合版プロジェクト作成スクリプト

set -e

# 色付きテキスト用の定数
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# 関数定義
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo -e "${CYAN}${BOLD}🚀 $1${NC}"
}

print_step() {
    echo -e "${BOLD}📋 $1${NC}"
}

# バナー表示
show_banner() {
    echo -e "${CYAN}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🚀 VIBE Coding Template                   ║"
    echo "║                  New Project Creator v2.0                   ║"
    echo "║                                                              ║"
    echo "║  🧠 AI Knowledge Sharing System Integration                  ║"
    echo "║  ⚡ Automated Setup & Configuration                         ║"
    echo "║  🔗 Shared Knowledge Base Connection                        ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# 使用方法を表示
show_usage() {
    echo -e "${BOLD}使用方法:${NC}"
    echo "  $0 <project-name> [target-directory]"
    echo
    echo -e "${BOLD}例:${NC}"
    echo "  $0 my-awesome-app                    # カレントディレクトリに作成"
    echo "  $0 my-app ~/projects/                # 指定ディレクトリに作成"
    echo "  $0 --help                           # このヘルプを表示"
    echo
    echo -e "${BOLD}機能:${NC}"
    echo "  ✨ VIBE Coding Templateからプロジェクトを作成"
    echo "  🧠 知識共有システムに自動接続"
    echo "  🔧 プロジェクト固有設定の自動調整"
    echo "  📚 Claude Code最適化された環境構築"
    echo
    echo -e "${BOLD}前提条件:${NC}"
    echo "  📁 vibe-coding-template が利用可能であること"
    echo "  🔗 ~/vibe-shared-knowledge/ が存在すること（オプション）"
}

# プロジェクト情報の更新
update_project_info() {
    local project_name="$1"
    local target_path="$2"
    
    print_step "Updating project configuration..."
    
    # package.json の更新
    if [ -f "$target_path/package.json" ]; then
        # プロジェクト名を更新
        sed -i "s/\"name\": \"vibe-coding-template\"/\"name\": \"$project_name\"/" "$target_path/package.json"
        
        # 説明を更新
        local description="AI-powered project created with VIBE Coding Template"
        if grep -q '"description"' "$target_path/package.json"; then
            sed -i "s/\"description\": \"[^\"]*\"/\"description\": \"$description\"/" "$target_path/package.json"
        else
            # description フィールドが存在しない場合は追加
            sed -i "/\"name\": \"$project_name\",/a\\  \"description\": \"$description\"," "$target_path/package.json"
        fi
        
        print_success "Updated package.json"
    fi
    
    # .ai/context.md の更新
    if [ -f "$target_path/.ai/context.md" ]; then
        cat > "$target_path/.ai/context.md" << EOF
# プロジェクトコンテキスト

## 基本情報
- **プロジェクト名**: $project_name
- **作成日**: $(date +%Y-%m-%d)
- **テンプレート**: VIBE Coding Template v2.0
- **知識管理**: 共有知識システム統合

## プロジェクト概要
<!-- プロジェクトの目的や概要を記載してください -->

## 技術スタック
- **フロントエンド**: React + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS（予定）
- **状態管理**: 未定
- **その他**: 未定

## 開発方針
<!-- 開発方針や技術的な決定事項を記載してください -->

---
最終更新: $(date +%Y-%m-%d)
EOF
        print_success "Updated .ai/context.md"
    fi
    
    # README.md のプロジェクト名更新
    if [ -f "$target_path/README.md" ]; then
        sed -i "s/# 🚀 VIBE Coding Template/# 🚀 $project_name/" "$target_path/README.md"
        print_success "Updated README.md"
    fi
}

# 知識共有システムへの接続
setup_knowledge_sharing() {
    local target_path="$1"
    
    print_step "Connecting to Shared Knowledge Base..."
    
    # 共有知識システムの存在確認
    if [ -f "$HOME/vibe-shared-knowledge/scripts/setup-shared-knowledge.sh" ]; then
        print_info "Shared knowledge system found"
        
        # 現在のディレクトリを保存
        local current_dir=$(pwd)
        
        # プロジェクトディレクトリに移動して setup スクリプトを実行
        cd "$target_path"
        
        if bash "$HOME/vibe-shared-knowledge/scripts/setup-shared-knowledge.sh"; then
            print_success "Connected to shared knowledge base"
            print_info "Shared knowledge available at: .ai/knowledge/shared/"
        else
            print_warning "Failed to connect to shared knowledge base (non-critical)"
            print_info "You can manually connect later using:"
            print_info "  ~/vibe-shared-knowledge/scripts/setup-shared-knowledge.sh"
        fi
        
        # 元のディレクトリに戻る
        cd "$current_dir"
    else
        print_warning "Shared knowledge base not found at ~/vibe-shared-knowledge/"
        print_info "プロジェクト固有の知識管理のみ利用可能です"
        print_info "共有知識システムをセットアップするには:"
        print_info "  1. ~/vibe-shared-knowledge/ ディレクトリを作成"
        print_info "  2. 共有知識システムを初期化"
        print_info "  3. このスクリプトを再実行するか手動で接続"
    fi
}

# Git初期化
setup_git() {
    local target_path="$1"
    local project_name="$2"
    
    print_step "Setting up Git repository..."
    
    cd "$target_path"
    
    # Git初期化
    if [ ! -d ".git" ]; then
        git init
        print_success "Initialized Git repository"
        
        # 初期コミット
        git add .
        git commit -m "feat: Initialize project from VIBE Coding Template

- Set up $project_name with VIBE Coding Template v2.0
- Integrated shared knowledge system
- Configured AI-optimized development environment

🤖 Generated with VIBE Coding Template"
        
        print_success "Created initial commit"
        
        # リモートリポジトリ設定のヒント
        print_info "リモートリポジトリを追加するには:"
        print_info "  git remote add origin <repository-url>"
        print_info "  git push -u origin main"
    else
        print_info "Git repository already exists"
    fi
}

# メイン処理
main() {
    local project_name="$1"
    local base_dir="${2:-$(pwd)}"
    local target_path="$base_dir/$project_name"
    
    show_banner
    
    print_header "Creating new project: $project_name"
    
    # テンプレートディレクトリの確認
    local template_dir
    local script_dir="$(cd "$(dirname "$0")" && pwd)"
    local potential_template_dir="$(dirname "$script_dir")"
    
    # スクリプトの親ディレクトリがテンプレートディレクトリかチェック
    if [ -f "$potential_template_dir/package.json" ] && \
       [ -d "$potential_template_dir/.ai" ] && \
       [ -f "$potential_template_dir/.ai/CLAUDE.md" ]; then
        template_dir="$potential_template_dir"
    elif [ -d "/home/kirikab/vibe-coding-template" ] && [ "$(realpath /home/kirikab/vibe-coding-template)" != "$(realpath "$potential_template_dir")" ]; then
        template_dir="/home/kirikab/vibe-coding-template"
    else
        print_error "VIBE Coding Template not found or trying to copy template into itself"
        print_info "以下のいずれかの方法でテンプレートを使用してください:"
        print_info "  1. テンプレート外のディレクトリからスクリプトを実行"
        print_info "  2. 別の場所にテンプレートをコピーしてから使用"
        exit 1
    fi
    
    # 自分自身へのコピーを防ぐ
    if [ "$(realpath "$template_dir")" = "$(realpath "$target_path")" ]; then
        print_error "Cannot copy template into itself"
        print_info "別のディレクトリ名を使用するか、テンプレート外から実行してください"
        exit 1
    fi
    
    # ターゲットディレクトリの確認
    if [ -d "$target_path" ]; then
        print_error "Directory $target_path already exists"
        print_info "別のプロジェクト名を選択するか、既存ディレクトリを削除してください"
        exit 1
    fi
    
    # ベースディレクトリの作成（必要な場合）
    if [ ! -d "$base_dir" ]; then
        print_info "Creating base directory: $base_dir"
        mkdir -p "$base_dir"
    fi
    
    print_step "Copying template files..."
    
    # テンプレートをコピー（.gitディレクトリは除外）
    cp -r "$template_dir" "$target_path"
    
    # テンプレートの .git ディレクトリがあれば削除
    if [ -d "$target_path/.git" ]; then
        rm -rf "$target_path/.git"
    fi
    
    print_success "Template files copied to $target_path"
    
    # プロジェクト情報の更新
    update_project_info "$project_name" "$target_path"
    
    # 知識共有システムへの接続
    setup_knowledge_sharing "$target_path"
    
    # Git初期化
    setup_git "$target_path" "$project_name"
    
    # 完了メッセージ
    print_header "Project Setup Complete! 🎉"
    echo
    print_success "Project '$project_name' has been created successfully!"
    print_info "Location: $target_path"
    echo
    print_step "Next steps:"
    echo "  1. cd $project_name"
    echo "  2. npm install"
    echo "  3. npm run dev"
    echo "  4. claude  # Start Claude Code session"
    echo
    print_step "Important files to review:"
    echo "  📄 .ai/context.md - Update project details"
    echo "  📄 .ai/CLAUDE.md - Review AI assistant instructions"
    echo "  🔗 .ai/knowledge/shared/ - Shared knowledge base"
    echo "  🔗 .ai/knowledge/current-local/ - Project-specific knowledge"
    echo
    print_info "Happy coding with AI! 🤖✨"
}

# 引数チェックと処理
case "${1:-}" in
    --help|-h)
        show_usage
        exit 0
        ;;
    "")
        print_error "Project name is required"
        echo
        show_usage
        exit 1
        ;;
    *)
        # プロジェクト名の検証
        if [[ ! "$1" =~ ^[a-zA-Z0-9_-]+$ ]]; then
            print_error "Invalid project name: $1"
            print_info "Project name should contain only letters, numbers, hyphens, and underscores"
            exit 1
        fi
        
        main "$1" "$2"
        ;;
esac