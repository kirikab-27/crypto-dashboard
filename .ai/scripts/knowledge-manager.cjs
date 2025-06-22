#!/usr/bin/env node

/**
 * Knowledge Management Utility
 * 
 * This script provides utilities for managing the AI knowledge base:
 * - Search knowledge entries by keywords, tags, or context
 * - Add new knowledge entries with proper formatting
 * - Update knowledge graph relationships
 * - Validate knowledge base consistency
 * - Archive old knowledge by date
 * 
 * Usage:
 *   node knowledge-manager.js search "vite build error"
 *   node knowledge-manager.js add-entry
 *   node knowledge-manager.js validate
 *   node knowledge-manager.js archive --month 2025-06
 */

const fs = require('fs');
const path = require('path');

class KnowledgeManager {
  constructor() {
    this.knowledgePath = path.join(__dirname, '../knowledge');
    this.indexPath = path.join(this.knowledgePath, 'index.json');
    this.graphPath = path.join(this.knowledgePath, 'knowledge-graph.json');
    
    this.loadKnowledgeBase();
  }

  loadKnowledgeBase() {
    try {
      this.index = JSON.parse(fs.readFileSync(this.indexPath, 'utf8'));
      this.graph = JSON.parse(fs.readFileSync(this.graphPath, 'utf8'));
    } catch (error) {
      console.error('Error loading knowledge base:', error.message);
      process.exit(1);
    }
  }

  saveKnowledgeBase() {
    try {
      fs.writeFileSync(this.indexPath, JSON.stringify(this.index, null, 2));
      fs.writeFileSync(this.graphPath, JSON.stringify(this.graph, null, 2));
      console.log('✅ Knowledge base saved successfully');
    } catch (error) {
      console.error('❌ Error saving knowledge base:', error.message);
    }
  }

  /**
   * Search knowledge entries by various criteria
   */
  search(query, options = {}) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    for (const entry of this.index.entries) {
      let score = 0;
      
      // Title match (highest weight)
      if (entry.title.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      
      // Keywords match
      for (const keyword of entry.keywords || []) {
        if (keyword.toLowerCase().includes(queryLower)) {
          score += 5;
        }
      }
      
      // Tags match
      for (const tag of entry.tags || []) {
        if (tag.toLowerCase().includes(queryLower)) {
          score += 3;
        }
      }
      
      // Context match
      if (entry.context) {
        const contextStr = JSON.stringify(entry.context).toLowerCase();
        if (contextStr.includes(queryLower)) {
          score += 2;
        }
      }
      
      if (score > 0) {
        results.push({ ...entry, score });
      }
    }
    
    // Sort by relevance score
    results.sort((a, b) => b.score - a.score);
    
    // Apply filters
    let filteredResults = results;
    
    if (options.type) {
      filteredResults = filteredResults.filter(r => r.type === options.type);
    }
    
    if (options.severity) {
      filteredResults = filteredResults.filter(r => r.severity === options.severity);
    }
    
    if (options.tags) {
      const searchTags = Array.isArray(options.tags) ? options.tags : [options.tags];
      filteredResults = filteredResults.filter(r => 
        searchTags.some(tag => r.tags.includes(tag))
      );
    }
    
    return filteredResults.slice(0, options.limit || 10);
  }

  /**
   * Find contextually relevant knowledge based on indicators
   */
  findContextualKnowledge(indicators) {
    const relevantKnowledge = new Set();
    
    for (const [patternName, pattern] of Object.entries(this.graph.context_patterns)) {
      const matchCount = indicators.filter(indicator => 
        pattern.indicators.some(patternIndicator => 
          indicator.toLowerCase().includes(patternIndicator.toLowerCase())
        )
      ).length;
      
      if (matchCount > 0) {
        pattern.relevant_knowledge.forEach(id => relevantKnowledge.add(id));
      }
    }
    
    return Array.from(relevantKnowledge).map(id => 
      this.index.entries.find(entry => entry.id === id)
    ).filter(Boolean);
  }

  /**
   * Get related knowledge through graph relationships
   */
  getRelatedKnowledge(entryId, maxDepth = 2) {
    const visited = new Set();
    const related = [];
    
    const traverse = (currentId, depth) => {
      if (depth >= maxDepth || visited.has(currentId)) return;
      
      visited.add(currentId);
      
      // Find outgoing edges
      const outgoingEdges = this.graph.edges.filter(edge => edge.from === currentId);
      for (const edge of outgoingEdges) {
        const relatedEntry = this.index.entries.find(entry => entry.id === edge.to);
        if (relatedEntry) {
          related.push({
            entry: relatedEntry,
            relation: edge.relation,
            confidence: edge.confidence,
            depth: depth + 1
          });
          traverse(edge.to, depth + 1);
        }
      }
      
      // Find incoming edges
      const incomingEdges = this.graph.edges.filter(edge => edge.to === currentId);
      for (const edge of incomingEdges) {
        const relatedEntry = this.index.entries.find(entry => entry.id === edge.from);
        if (relatedEntry) {
          related.push({
            entry: relatedEntry,
            relation: `inverse_${edge.relation}`,
            confidence: edge.confidence,
            depth: depth + 1
          });
          traverse(edge.from, depth + 1);
        }
      }
    };
    
    traverse(entryId, 0);
    
    // Sort by confidence and depth
    return related.sort((a, b) => {
      if (a.depth !== b.depth) return a.depth - b.depth;
      return b.confidence - a.confidence;
    });
  }

  /**
   * Generate next available knowledge ID
   */
  generateNextId() {
    const ids = this.index.entries.map(entry => entry.id);
    const numbers = ids
      .filter(id => id.startsWith('k'))
      .map(id => parseInt(id.substring(1)))
      .filter(num => !isNaN(num));
    
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `k${String(maxNum + 1).padStart(3, '0')}`;
  }

  /**
   * Add new knowledge entry template
   */
  createEntryTemplate(type = 'problem') {
    const id = this.generateNextId();
    const date = new Date().toISOString().split('T')[0];
    
    const template = {
      id,
      title: "[Enter descriptive title]",
      type,
      tags: ["[tag1]", "[tag2]"],
      date,
      file: `current/${type === 'problem' ? 'troubleshooting' : 'tech-notes'}.md#${id}`,
      keywords: ["[keyword1]", "[keyword2]"],
      applicable_versions: {
        "[technology]": ">=x.x.x"
      },
      context: {
        project_type: "react-typescript"
      }
    };
    
    if (type === 'problem') {
      template.severity = "[high|medium|low]";
    }
    
    console.log('📝 New entry template:');
    console.log(JSON.stringify(template, null, 2));
    console.log('\n📋 Add this to index.json and create corresponding markdown entry');
    
    return template;
  }

  /**
   * Validate knowledge base consistency
   */
  validate() {
    const errors = [];
    const warnings = [];
    
    // Check for duplicate IDs
    const ids = this.index.entries.map(entry => entry.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate IDs found: ${duplicates.join(', ')}`);
    }
    
    // Check graph references
    for (const edge of this.graph.edges) {
      const fromExists = this.index.entries.some(entry => entry.id === edge.from);
      const toExists = this.index.entries.some(entry => entry.id === edge.to);
      
      if (!fromExists) {
        errors.push(`Graph edge references non-existent ID: ${edge.from}`);
      }
      if (!toExists) {
        errors.push(`Graph edge references non-existent ID: ${edge.to}`);
      }
    }
    
    // Check for entries without relationships
    const connectedIds = new Set([
      ...this.graph.edges.map(edge => edge.from),
      ...this.graph.edges.map(edge => edge.to)
    ]);
    
    const isolatedEntries = this.index.entries.filter(entry => 
      !connectedIds.has(entry.id) && entry.type !== 'pattern'
    );
    
    if (isolatedEntries.length > 0) {
      warnings.push(`Isolated entries (consider adding relationships): ${isolatedEntries.map(e => e.id).join(', ')}`);
    }
    
    // Report results
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ Knowledge base validation passed');
    } else {
      if (errors.length > 0) {
        console.log('❌ Validation errors:');
        errors.forEach(error => console.log(`  - ${error}`));
      }
      if (warnings.length > 0) {
        console.log('⚠️  Validation warnings:');
        warnings.forEach(warning => console.log(`  - ${warning}`));
      }
    }
    
    return { errors, warnings };
  }

  /**
   * Archive knowledge entries by month
   */
  archive(month) {
    const archivePath = path.join(this.knowledgePath, 'archive', month);
    
    if (!fs.existsSync(archivePath)) {
      fs.mkdirSync(archivePath, { recursive: true });
    }
    
    const toArchive = this.index.entries.filter(entry => 
      entry.date.startsWith(month)
    );
    
    if (toArchive.length === 0) {
      console.log(`No entries found for ${month}`);
      return;
    }
    
    // Create archive index
    const archiveIndex = {
      version: this.index.version,
      archived_date: new Date().toISOString(),
      month,
      entries: toArchive
    };
    
    fs.writeFileSync(
      path.join(archivePath, 'index.json'),
      JSON.stringify(archiveIndex, null, 2)
    );
    
    console.log(`📦 Archived ${toArchive.length} entries to ${archivePath}`);
    
    // Note: In production, you might want to remove from current index
    // For template, we keep them for educational purposes
  }

  /**
   * Display statistics about the knowledge base
   */
  stats() {
    console.log('📊 Knowledge Base Statistics');
    console.log('================================');
    console.log(`Total entries: ${this.index.entries.length}`);
    console.log(`Graph relationships: ${this.graph.edges.length}`);
    console.log(`Context patterns: ${Object.keys(this.graph.context_patterns).length}`);
    console.log(`Knowledge domains: ${Object.keys(this.graph.domains).length}`);
    
    console.log('\nBy Type:');
    for (const [type, count] of Object.entries(this.index.statistics.by_type)) {
      console.log(`  ${type}: ${count}`);
    }
    
    if (this.index.statistics.by_severity) {
      console.log('\nBy Severity:');
      for (const [severity, count] of Object.entries(this.index.statistics.by_severity)) {
        console.log(`  ${severity}: ${count}`);
      }
    }
  }

  /**
   * Check if knowledge has been updated today
   */
  checkDevelopmentCompletion() {
    const today = new Date().toISOString().split('T')[0];
    const journalPath = path.join(this.knowledgePath, 'journal', `${today}.md`);
    
    console.log('\n🔍 開発完了チェック');
    console.log('================================');
    
    // Check if journal entry exists for today
    const journalExists = fs.existsSync(journalPath);
    if (!journalExists) {
      console.log('⚠️  本日のjournal記録がありません');
    } else {
      console.log('✅ journal記録済み');
    }
    
    // Check for recent knowledge additions
    const todaysEntries = this.index.entries.filter(entry => entry.date === today);
    console.log(`\n📝 本日追加された知識: ${todaysEntries.length}件`);
    
    if (todaysEntries.length === 0) {
      console.log('⚠️  新しい知識が記録されていません。以下を確認してください:');
      console.log('   - lessons-learned.md に新しいパターンを追加');
      console.log('   - tech-notes.md に技術的決定を記録');
      console.log('   - troubleshooting.md にエラーと解決策を記録');
    } else {
      todaysEntries.forEach(entry => {
        console.log(`   - [${entry.id}] ${entry.title}`);
      });
    }
    
    // Show reminder
    console.log('\n📌 開発完了時のチェックリスト:');
    console.log('   1. lessons-learned.md に今回の学びを記録');
    console.log('   2. tech-notes.md に技術的決定を記録');
    console.log('   3. journal/YYYY-MM-DD.md に開発記録を追加');
    console.log('   4. troubleshooting.md にエラー情報を記録（エラーがない場合も記録）');
    console.log('   5. README.md をプロジェクト情報で更新');
    
    return {
      journalExists,
      todaysEntries: todaysEntries.length,
      isComplete: journalExists && todaysEntries.length > 0
    };
  }

  /**
   * Create development reminder
   */
  createDevelopmentReminder() {
    const reminders = [
      '💡 開発で新しいパターンを発見しましたか？ lessons-learned.md に記録しましょう',
      '🔧 技術的な決定をしましたか？ tech-notes.md に理由と共に記録しましょう',
      '🐛 エラーに遭遇しましたか？ troubleshooting.md に解決策を記録しましょう',
      '📝 開発が完了したら journal にサマリーを記録しましょう',
      '📚 過去の知識を活用しましたか？ 使用した知識IDを記録しましょう'
    ];
    
    const randomReminder = reminders[Math.floor(Math.random() * reminders.length)];
    console.log(`\n${randomReminder}`);
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const km = new KnowledgeManager();
  
  switch (command) {
    case 'search':
      const query = args[1];
      if (!query) {
        console.log('Usage: node knowledge-manager.js search "query"');
        return;
      }
      
      const results = km.search(query);
      console.log(`🔍 Search results for "${query}":`)
      if (results.length === 0) {
        console.log('No results found');
      } else {
        results.forEach((result, index) => {
          console.log(`\n${index + 1}. [${result.id}] ${result.title}`);
          console.log(`   Type: ${result.type}, Score: ${result.score}`);
          console.log(`   Tags: ${result.tags.join(', ')}`);
          console.log(`   File: ${result.file}`);
        });
      }
      break;
      
    case 'context-search':
      const indicators = args.slice(1);
      if (indicators.length === 0) {
        console.log('Usage: node knowledge-manager.js context-search indicator1 indicator2...');
        return;
      }
      
      const contextResults = km.findContextualKnowledge(indicators);
      console.log(`🧠 Contextual knowledge for [${indicators.join(', ')}]:`);
      contextResults.forEach((result, index) => {
        console.log(`\n${index + 1}. [${result.id}] ${result.title}`);
        console.log(`   Type: ${result.type}`);
        console.log(`   File: ${result.file}`);
      });
      break;
      
    case 'related':
      const entryId = args[1];
      if (!entryId) {
        console.log('Usage: node knowledge-manager.js related k001');
        return;
      }
      
      const related = km.getRelatedKnowledge(entryId);
      console.log(`🔗 Related knowledge for ${entryId}:`);
      related.forEach((item, index) => {
        console.log(`\n${index + 1}. [${item.entry.id}] ${item.entry.title}`);
        console.log(`   Relation: ${item.relation} (confidence: ${item.confidence})`);
        console.log(`   Depth: ${item.depth}`);
      });
      break;
      
    case 'add-entry':
      const type = args[1] || 'problem';
      km.createEntryTemplate(type);
      break;
      
    case 'validate':
      km.validate();
      break;
      
    case 'archive':
      const month = args[1];
      if (!month) {
        console.log('Usage: node knowledge-manager.js archive 2025-06');
        return;
      }
      km.archive(month);
      break;
      
    case 'stats':
      km.stats();
      break;
      
    case 'check-completion':
      km.checkDevelopmentCompletion();
      break;
      
    case 'reminder':
      km.createDevelopmentReminder();
      break;
      
    default:
      console.log('🛠️  Knowledge Manager CLI');
      console.log('Usage:');
      console.log('  search "query"           - Search knowledge entries');
      console.log('  context-search ind1 ind2 - Find contextual knowledge');
      console.log('  related k001             - Find related entries');
      console.log('  add-entry [type]         - Generate entry template');
      console.log('  validate                 - Validate knowledge base');
      console.log('  archive YYYY-MM          - Archive entries by month');
      console.log('  stats                    - Show statistics');
      console.log('  check-completion         - Check development completion');
      console.log('  reminder                 - Show development reminder');
  }
}

// Run CLI if called directly
if (require.main === module) {
  main();
}

module.exports = { KnowledgeManager };