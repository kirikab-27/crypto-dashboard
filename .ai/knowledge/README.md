# AI Knowledge Management System

This directory contains an advanced knowledge management system designed for AI-assisted development with Claude Code.

## 🎯 System Overview

The knowledge management system provides:
- **Structured Knowledge Storage** with unique IDs and metadata
- **Relationship Mapping** through knowledge graphs
- **Contextual Search** based on development scenarios
- **Version-Aware Knowledge** tied to specific technology versions
- **Automated Tools** for knowledge discovery and management

## 📁 Directory Structure

```
knowledge/
├── current/              # Active knowledge base
│   ├── troubleshooting.md    # Problems and solutions (k001-k015)
│   ├── tech-notes.md         # Technical decisions (k016-k020)
│   └── lessons-learned.md    # Patterns and best practices (k021-k030)
├── index.json           # Searchable metadata for all entries
├── knowledge-graph.json # Relationship mapping between entries
├── archive/            # Historical knowledge by month
│   ├── 2025-06/
│   └── README.md
├── tags/              # Tag-based organization
│   ├── errors/
│   ├── libraries/
│   ├── patterns/
│   └── README.md
└── README.md          # This file
```

## 🔍 Knowledge Entry Format

Each knowledge entry follows a structured format:

```markdown
---
id: k001
title: Descriptive title
date: 2025-06-21
tags: [tag1, tag2, tag3]
versions:
  technology: ">=x.x.x"
severity: high|medium|low  # For problems
category: problem|solution|pattern|decision
---

### 問題/内容
Description of the issue or knowledge

### 解決策/詳細
Solution or detailed information

### 関連知識
- k002: Related entry title
- k003: Another related entry

### 予防策 (if applicable)
Prevention strategies
```

## 🛠️ Knowledge Management Tools

### Search Commands
```bash
# Text search across all knowledge
node scripts/knowledge-manager.js search "vite build error"

# Contextual search based on indicators
node scripts/knowledge-manager.js context-search vite import resolve

# Find related knowledge through graph relationships
node scripts/knowledge-manager.js related k001
```

### Management Commands
```bash
# Generate new entry template
node scripts/knowledge-manager.js add-entry problem

# Validate knowledge base consistency
node scripts/knowledge-manager.js validate

# View statistics
node scripts/knowledge-manager.js stats

# Archive old knowledge
node scripts/knowledge-manager.js archive 2025-06
```

## 🧠 Knowledge Graph System

The knowledge graph (`knowledge-graph.json`) maps relationships between entries:

### Relationship Types
- **solved_by**: Problem → Solution
- **based_on**: Solution → Pattern
- **prevented_by**: Problem → Prevention Pattern
- **related_to**: General relationships
- **influences**: Decision influences patterns

### Context Patterns
Predefined patterns help AI assistants find relevant knowledge:

```json
"vite_build_error": {
  "indicators": ["vite", "import", "resolve", "module", "build", "error"],
  "relevant_knowledge": ["k001", "k003", "k016"],
  "priority": "high"
}
```

## 📊 Current Knowledge Base

### Statistics
- **Total Entries**: 30+ structured knowledge entries
- **Categories**: Problems, Solutions, Patterns, Decisions
- **Coverage**: React, TypeScript, Vite, WSL, Git, Performance
- **Relationships**: 10+ mapped relationships in knowledge graph

### Key Knowledge Areas
1. **Build Tool Issues** (k001, k016, k003)
2. **TypeScript Patterns** (k006, k007, k021, k028)
3. **Environment Setup** (k004, k005, k013, k025)
4. **Performance & Architecture** (k020, k027, k030)
5. **Documentation & Knowledge Management** (k029)

## 🚀 Usage for AI Development

### For Claude Code Sessions
1. **Before Starting**: Review relevant knowledge using search commands
2. **During Development**: Reference knowledge IDs in solutions
3. **After Problem Solving**: Add new knowledge with proper IDs and relationships
4. **Regular Maintenance**: Validate and update knowledge base

### Integration with CLAUDE.md
The main instruction file (`../CLAUDE.md`) includes specific rules for:
- Knowledge recording procedures
- Search strategies  
- Relationship mapping
- Version compatibility checking

## 🔄 Knowledge Lifecycle

### Adding New Knowledge
1. Use knowledge manager to generate template
2. Fill in structured information with unique ID
3. Add to appropriate current/ file
4. Update index.json and knowledge-graph.json
5. Validate consistency

### Maintaining Knowledge
1. Regular validation runs
2. Quarterly archiving of old entries
3. Relationship graph updates
4. Version compatibility reviews

### Archiving Strategy
- Archive entries older than 6 months
- Keep frequently referenced patterns current
- Maintain searchable archive index
- Preserve critical relationships

## 🎓 Benefits for AI Development

### For Human Developers
- **Faster Problem Resolution**: Search past solutions quickly
- **Consistent Decision Making**: Reference previous technical decisions
- **Pattern Recognition**: Learn from accumulated best practices
- **Knowledge Retention**: Prevent loss of critical insights

### For AI Assistants
- **Contextual Awareness**: Find relevant knowledge based on current situation
- **Relationship Understanding**: Traverse knowledge connections
- **Version Compatibility**: Match solutions to current technology stack
- **Structured Learning**: Build upon previous project knowledge

## 🔮 Future Enhancements

### Planned Features
- **Global Knowledge Base**: Share knowledge across multiple projects
- **AI-Powered Suggestions**: Automatic knowledge recommendations
- **Visual Knowledge Map**: Interactive relationship exploration
- **Automated Archiving**: Smart identification of outdated knowledge

### Integration Opportunities
- **IDE Integration**: Direct knowledge access from development environment
- **CI/CD Hooks**: Automatic knowledge updates from build processes
- **Team Collaboration**: Shared knowledge base for development teams
- **Cross-Project Learning**: Knowledge transfer between similar projects

---

This knowledge management system transforms how AI assistants learn from and build upon past development experiences, creating a continuously improving development environment.