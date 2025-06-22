#!/usr/bin/env node

/**
 * Post Development Check Script
 * 
 * This script runs after development sessions to ensure knowledge is properly captured.
 * It checks for:
 * - Knowledge base updates
 * - Journal entries
 * - README updates
 * - Unrecorded errors or lessons
 * 
 * Usage:
 *   node post-development-check.js
 *   node post-development-check.js --auto-commit
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { KnowledgeManager } = require('./knowledge-manager.cjs');

class PostDevelopmentCheck {
  constructor() {
    this.rootPath = path.join(__dirname, '../..');
    this.aiPath = path.join(__dirname, '..');
    this.knowledgePath = path.join(this.aiPath, 'knowledge');
    this.today = new Date().toISOString().split('T')[0];
    this.km = new KnowledgeManager();
    this.warnings = [];
    this.successes = [];
  }

  /**
   * Check git status for uncommitted knowledge changes
   */
  checkGitStatus() {
    try {
      const gitStatus = execSync('git status --porcelain .ai/', { 
        cwd: this.rootPath,
        encoding: 'utf8' 
      });
      
      if (gitStatus.trim()) {
        const modifiedFiles = gitStatus.split('\n').filter(line => line.trim());
        this.warnings.push({
          type: 'git',
          message: '未コミットの知識ベース変更があります',
          details: modifiedFiles
        });
      } else {
        this.successes.push('Git: 知識ベースの変更は全てコミット済み');
      }
    } catch (error) {
      console.error('Git status check failed:', error.message);
    }
  }

  /**
   * Check if journal entry exists for today
   */
  checkJournal() {
    const journalPath = path.join(this.knowledgePath, 'journal', `${this.today}.md`);
    
    if (!fs.existsSync(journalPath)) {
      this.warnings.push({
        type: 'journal',
        message: `本日（${this.today}）のjournal記録がありません`,
        action: 'journal/YYYY-MM-DD.md に開発記録を追加してください'
      });
    } else {
      const content = fs.readFileSync(journalPath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length < 5) {
        this.warnings.push({
          type: 'journal',
          message: 'Journal記録が不完全な可能性があります',
          action: '実装機能、開発時間、課題、使用知識IDを確認してください'
        });
      } else {
        this.successes.push('Journal: 本日の開発記録あり');
      }
    }
  }

  /**
   * Check for recent knowledge additions
   */
  checkKnowledgeAdditions() {
    const result = this.km.checkDevelopmentCompletion();
    
    if (result.todaysEntries === 0) {
      this.warnings.push({
        type: 'knowledge',
        message: '本日追加された知識エントリーがありません',
        action: '新しい学び、技術的決定、エラー解決策を記録してください'
      });
    } else {
      this.successes.push(`Knowledge: ${result.todaysEntries}件の新規エントリー追加`);
    }
  }

  /**
   * Check README.md for updates
   */
  checkReadmeUpdate() {
    const readmePath = path.join(this.rootPath, 'README.md');
    
    try {
      const gitLog = execSync(`git log -1 --format=%cd --date=short -- README.md`, {
        cwd: this.rootPath,
        encoding: 'utf8'
      }).trim();
      
      if (gitLog !== this.today) {
        // Check if README has uncommitted changes
        const gitStatus = execSync('git status --porcelain README.md', {
          cwd: this.rootPath,
          encoding: 'utf8'
        }).trim();
        
        if (!gitStatus) {
          this.warnings.push({
            type: 'readme',
            message: 'README.mdが本日更新されていません',
            action: 'プロジェクト情報、機能一覧、使用技術を更新してください'
          });
        } else {
          this.successes.push('README: 変更あり（未コミット）');
        }
      } else {
        this.successes.push('README: 本日更新済み');
      }
    } catch (error) {
      // File might be new or not in git yet
      if (fs.existsSync(readmePath)) {
        this.warnings.push({
          type: 'readme',
          message: 'README.mdの更新状態を確認できません',
          action: 'プロジェクト情報が最新か確認してください'
        });
      }
    }
  }

  /**
   * Check for common development artifacts that might indicate unrecorded issues
   */
  checkDevelopmentArtifacts() {
    // Check for error logs
    const errorLogPatterns = ['error.log', 'npm-debug.log', 'yarn-error.log'];
    const foundLogs = [];
    
    errorLogPatterns.forEach(pattern => {
      const logPath = path.join(this.rootPath, pattern);
      if (fs.existsSync(logPath)) {
        foundLogs.push(pattern);
      }
    });
    
    if (foundLogs.length > 0) {
      this.warnings.push({
        type: 'artifacts',
        message: 'エラーログファイルが見つかりました',
        details: foundLogs,
        action: 'エラー内容をtroubleshooting.mdに記録してください'
      });
    }
    
    // Check for TODO comments in recently modified files
    try {
      const recentFiles = execSync(
        `git diff --name-only HEAD~1..HEAD -- "*.ts" "*.tsx" "*.js" "*.jsx"`,
        { cwd: this.rootPath, encoding: 'utf8' }
      ).trim().split('\n').filter(f => f);
      
      const todosFound = [];
      recentFiles.forEach(file => {
        const filePath = path.join(this.rootPath, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const todoMatches = content.match(/TODO:|FIXME:|HACK:/gi);
          if (todoMatches) {
            todosFound.push({ file, count: todoMatches.length });
          }
        }
      });
      
      if (todosFound.length > 0) {
        this.warnings.push({
          type: 'todos',
          message: '新しいTODOコメントが追加されています',
          details: todosFound,
          action: '必要に応じてissueとして記録してください'
        });
      }
    } catch (error) {
      // No recent commits or git not available
    }
  }

  /**
   * Generate summary report
   */
  generateReport() {
    console.log('\n📋 開発完了チェックレポート');
    console.log('=====================================');
    console.log(`日付: ${this.today}`);
    console.log(`時刻: ${new Date().toLocaleTimeString()}`);
    
    if (this.successes.length > 0) {
      console.log('\n✅ 完了項目:');
      this.successes.forEach(success => {
        console.log(`   ✓ ${success}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  要確認項目:');
      this.warnings.forEach((warning, index) => {
        console.log(`\n   ${index + 1}. ${warning.message}`);
        if (warning.action) {
          console.log(`      → ${warning.action}`);
        }
        if (warning.details) {
          console.log(`      詳細: ${Array.isArray(warning.details) ? 
            warning.details.join(', ') : 
            JSON.stringify(warning.details)}`);
        }
      });
    } else {
      console.log('\n🎉 全ての項目が完了しています！');
    }
    
    // Show quick actions
    console.log('\n📌 クイックアクション:');
    console.log('   1. 知識を追加: node .ai/scripts/knowledge-manager.cjs add-entry');
    console.log('   2. Journal記録: echo "## 開発記録" > .ai/knowledge/journal/' + this.today + '.md');
    console.log('   3. 知識を検索: node .ai/scripts/knowledge-manager.cjs search "keyword"');
    console.log('   4. 統計確認: node .ai/scripts/knowledge-manager.cjs stats');
    
    return {
      date: this.today,
      successes: this.successes.length,
      warnings: this.warnings.length,
      isComplete: this.warnings.length === 0
    };
  }

  /**
   * Run all checks
   */
  async run(options = {}) {
    console.log('🔍 開発完了チェックを実行中...\n');
    
    this.checkGitStatus();
    this.checkJournal();
    this.checkKnowledgeAdditions();
    this.checkReadmeUpdate();
    this.checkDevelopmentArtifacts();
    
    const report = this.generateReport();
    
    // Optional: auto-commit knowledge changes
    if (options.autoCommit && this.warnings.some(w => w.type === 'git')) {
      console.log('\n📝 知識ベースの変更を自動コミット中...');
      try {
        execSync('git add .ai/', { cwd: this.rootPath });
        execSync(`git commit -m "docs: 開発知識の更新 (${this.today})"`, { cwd: this.rootPath });
        console.log('✅ コミット完了');
      } catch (error) {
        console.error('❌ 自動コミット失敗:', error.message);
      }
    }
    
    // Show a random reminder
    this.km.createDevelopmentReminder();
    
    return report;
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    autoCommit: args.includes('--auto-commit')
  };
  
  const checker = new PostDevelopmentCheck();
  checker.run(options);
}

module.exports = { PostDevelopmentCheck };