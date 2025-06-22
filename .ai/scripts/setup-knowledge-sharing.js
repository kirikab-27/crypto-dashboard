#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const GLOBAL_KNOWLEDGE_DIR = path.join(os.homedir(), '.vibe-knowledge');
const LOCAL_AI_DIR = path.join(process.cwd(), '.ai');
const KNOWLEDGE_DIR = path.join(LOCAL_AI_DIR, 'knowledge');
const CURRENT_DIR = path.join(KNOWLEDGE_DIR, 'current');
const CURRENT_LOCAL_DIR = path.join(KNOWLEDGE_DIR, 'current-local');
const SHARED_SYMLINK = path.join(KNOWLEDGE_DIR, 'shared');
const SHARED_INDEX_SYMLINK = path.join(KNOWLEDGE_DIR, 'shared-index.json');

function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    }
}

function copyDirectory(src, dest) {
    if (!fs.existsSync(src)) {
        console.log(`⚠️  Source directory ${src} does not exist, skipping copy`);
        return;
    }
    
    ensureDirectoryExists(dest);
    
    const items = fs.readdirSync(src);
    for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function createSymlink(target, linkPath) {
    if (fs.existsSync(linkPath)) {
        if (fs.lstatSync(linkPath).isSymbolicLink()) {
            console.log(`🔗 Symlink already exists: ${linkPath}`);
            return;
        } else {
            console.log(`⚠️  File exists but is not a symlink: ${linkPath}`);
            return;
        }
    }
    
    try {
        fs.symlinkSync(target, linkPath);
        console.log(`🔗 Created symlink: ${linkPath} -> ${target}`);
    } catch (error) {
        console.error(`❌ Failed to create symlink: ${error.message}`);
    }
}

function main() {
    console.log('🚀 Setting up vibe-coding shared knowledge system...\n');
    
    // 1. Ensure global knowledge directory exists
    ensureDirectoryExists(GLOBAL_KNOWLEDGE_DIR);
    ensureDirectoryExists(path.join(GLOBAL_KNOWLEDGE_DIR, 'current'));
    
    // 2. If current directory exists, copy it to global knowledge (first time setup)
    if (fs.existsSync(CURRENT_DIR)) {
        console.log('📁 Found existing current knowledge directory');
        
        // Check if global knowledge is empty (first time setup)
        const globalCurrentDir = path.join(GLOBAL_KNOWLEDGE_DIR, 'current');
        const globalFiles = fs.existsSync(globalCurrentDir) ? fs.readdirSync(globalCurrentDir) : [];
        
        if (globalFiles.length === 0) {
            console.log('📋 Copying current knowledge to global shared location...');
            copyDirectory(CURRENT_DIR, globalCurrentDir);
        }
        
        // 3. Rename current to current-local
        console.log('📝 Renaming current to current-local...');
        if (fs.existsSync(CURRENT_LOCAL_DIR)) {
            console.log('⚠️  current-local already exists, removing old current directory');
            fs.rmSync(CURRENT_DIR, { recursive: true, force: true });
        } else {
            fs.renameSync(CURRENT_DIR, CURRENT_LOCAL_DIR);
        }
        console.log('✅ Renamed current -> current-local');
    }
    
    // 4. Create symlinks to shared knowledge
    const globalCurrentDir = path.join(GLOBAL_KNOWLEDGE_DIR, 'current');
    const globalIndexFile = path.join(GLOBAL_KNOWLEDGE_DIR, 'shared-index.json');
    
    // Ensure global index file exists
    if (!fs.existsSync(globalIndexFile)) {
        fs.writeFileSync(globalIndexFile, '{}');
        console.log('📄 Created global shared-index.json');
    }
    
    createSymlink(globalCurrentDir, SHARED_SYMLINK);
    createSymlink(globalIndexFile, SHARED_INDEX_SYMLINK);
    
    console.log('\n🎉 Knowledge sharing setup completed!');
    console.log('\n📚 Knowledge structure:');
    console.log('  - current-local/: Project-specific knowledge');
    console.log('  - shared/: Global shared knowledge (symlink to ~/.vibe-knowledge/current)');
    console.log('  - shared-index.json: Global knowledge index (symlink)');
    console.log('\n💡 All knowledge gained in any project is now automatically shared across all projects!');
}

if (require.main === module) {
    main();
}

module.exports = { main };