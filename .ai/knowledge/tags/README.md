# Knowledge Tags System

This directory contains tag-based organization of knowledge entries for quick access.

## Tag Categories

### Errors (`errors/`)
Problems and error conditions organized by type:
- `build-errors.json` - Build system and compilation errors
- `runtime-errors.json` - Runtime exceptions and failures
- `type-errors.json` - TypeScript and type-related errors
- `network-errors.json` - Network and connectivity issues

### Libraries (`libraries/`)
Library-specific knowledge organized by package:
- `react.json` - React framework knowledge
- `vite.json` - Vite build tool knowledge
- `typescript.json` - TypeScript language knowledge
- `testing.json` - Testing frameworks and utilities

### Patterns (`patterns/`)
Reusable patterns and best practices:
- `architecture.json` - Application architecture patterns
- `performance.json` - Performance optimization patterns
- `security.json` - Security best practices
- `testing.json` - Testing strategies and patterns

## Tag File Format

Each tag file contains references to knowledge entries:

```json
{
  "tag": "build-error",
  "description": "Build system and compilation errors",
  "entries": [
    {
      "id": "k001",
      "title": "prismjs Vite build error",
      "severity": "high",
      "file": "current/troubleshooting.md#k001"
    }
  ],
  "related_tags": ["vite", "library", "compatibility"],
  "last_updated": "2025-06-21T23:33:00Z"
}
```

## Usage Examples

### Find All Vite-Related Knowledge
```bash
node ../scripts/knowledge-manager.js search --tags vite
```

### Browse by Tag Category
```bash
# List all build errors
cat tags/errors/build-errors.json

# Find library-specific knowledge
cat tags/libraries/react.json
```

### Cross-Reference Tags
Use the `related_tags` field to discover connected knowledge areas.

## Maintenance

### Adding New Tags
1. Create appropriate category directory if needed
2. Add new tag file with proper format
3. Update related knowledge entries
4. Run validation to ensure consistency

### Updating Tag Files
Tag files are automatically updated when:
- New knowledge entries are added
- Existing entries are modified
- Knowledge manager script is run

### Tag Guidelines
- Use lowercase, hyphenated names
- Be specific but not overly narrow
- Maintain consistency across entries
- Include related tags for discoverability

## Future Enhancements

- **Automatic Tagging**: AI-powered tag suggestion
- **Tag Hierarchies**: Parent-child tag relationships
- **Tag Analytics**: Usage statistics and trending tags
- **Visual Tag Cloud**: Interactive tag exploration interface