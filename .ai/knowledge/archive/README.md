# Knowledge Archive

This directory contains archived knowledge entries organized by month.

## Structure

```
archive/
├── 2025-06/           # June 2025 archive
│   ├── index.json     # Archived entries metadata
│   └── README.md      # Archive summary
├── 2025-07/           # July 2025 archive
└── ...
```

## Archiving Process

### Manual Archiving
```bash
node ../.ai/scripts/knowledge-manager.js archive 2025-06
```

### Automatic Archiving (Future Enhancement)
- Archive entries older than 6 months
- Maintain index for searchability
- Preserve relationships in knowledge graph

## Accessing Archived Knowledge

1. **Browse by Month**: Navigate to specific month directories
2. **Search Archived Entries**: Use the knowledge manager script
3. **Restore to Current**: Copy entries back to `current/` if needed

## Archive Guidelines

### What to Archive
- Entries older than 6 months
- Obsolete technology decisions
- Solved problems with no recurrence
- Historical context that's no longer relevant

### What to Keep Current
- Recurring problems and their solutions
- Active technology decisions
- Patterns that are still applicable
- Recent lessons learned

### Migration Strategy
1. Review entries quarterly
2. Archive based on relevance and age
3. Update knowledge graph relationships
4. Maintain searchable index

## Restoration Process

If an archived knowledge entry becomes relevant again:

1. Copy the entry back to appropriate `current/` file
2. Update the entry ID if conflicts exist
3. Add to current `index.json`
4. Update `knowledge-graph.json` relationships
5. Run validation: `node ../scripts/knowledge-manager.js validate`

## Future Enhancements

- **Global Knowledge Base**: Connect to shared knowledge across projects
- **Version Control**: Track knowledge evolution over time
- **Automated Suggestions**: AI-powered archiving recommendations
- **Cross-Project Search**: Find similar problems across different projects