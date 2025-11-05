#!/usr/bin/env node

/**
 * Mission Validation System
 * 
 * Validates that all missions are properly defined and ready for execution.
 * Performs static analysis and dependency checks.
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class MissionValidator {
  constructor() {
    this.missionsPath = path.join(__dirname, '.raindrop-code', 'missions');
    this.srcPath = path.join(__dirname, 'src');
    this.errors = [];
    this.warnings = [];
  }

  async validateAllMissions() {
    console.log('🔍 Validating all missions...\n');
    
    // Check if missions directory exists
    if (!fs.existsSync(this.missionsPath)) {
      this.errors.push('Missions directory not found');
      return this.printResults();
    }

    const missionFiles = await this.getMissionFiles();
    
    for (const file of missionFiles) {
      await this.validateMissionFile(file);
    }

    await this.validateProjectStructure();
    await this.validateDependencies();
    
    return this.printResults();
  }

  async getMissionFiles() {
    const pattern = path.join(this.missionsPath, '*.md');
    return await glob(pattern);
  }

  async validateMissionFile(filePath) {
    const fileName = path.basename(filePath);
    console.log(`📋 Validating ${fileName}`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check required sections
      const requiredSections = [
        '## Goal',
        '## Tasks',
        '## Acceptance Criteria',
        '## Verification Steps'
      ];
      
      for (const section of requiredSections) {
        if (!content.includes(section)) {
          this.errors.push(`${fileName}: Missing required section "${section}"`);
        }
      }
      
      // Check file modification section
      if (!content.includes('## Files to Modify')) {
        this.warnings.push(`${fileName}: Missing "Files to Modify" section`);
      }
      
      // Validate file paths in Files to Modify section
      const filesMatch = content.match(/## Files to Modify\n\n([\s\S]*?)(?=\n## |\n$)/);
      if (filesMatch) {
        const filesContent = filesMatch[1];
        const filePaths = this.extractFilePaths(filesContent);
        
        for (const filePath of filePaths) {
          if (!this.validateFilePath(filePath)) {
            this.errors.push(`${fileName}: Invalid file path "${filePath}"`);
          }
        }
      }
      
      // Check mission number consistency
      const missionNumber = this.extractMissionNumber(fileName);
      if (missionNumber) {
        const contentNumbers = this.extractMissionNumbersFromContent(content);
        if (contentNumbers.length > 0 && !contentNumbers.includes(missionNumber)) {
          this.warnings.push(`${fileName}: Mission number mismatch`);
        }
      }
      
      console.log(`  ✅ ${fileName} validated`);
      
    } catch (error) {
      this.errors.push(`${fileName}: Failed to read file - ${error.message}`);
    }
  }

  extractFilePaths(content) {
    const filePaths = [];
    const regex = /`([^`]+)`/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const filePath = match[1];
      if (filePath.startsWith('src/')) {
        filePaths.push(filePath);
      }
    }
    
    return filePaths;
  }

  validateFilePath(filePath) {
    const fullPath = path.join(__dirname, filePath);
    
    // Check if it's a valid path pattern
    if (!filePath.startsWith('src/')) {
      return false;
    }
    
    // Check extension
    const validExtensions = ['.tsx', '.ts', '.js', '.jsx', '.css', '.md'];
    const hasValidExtension = validExtensions.some(ext => filePath.endsWith(ext));
    
    if (!hasValidExtension && !filePath.includes('/')) {
      return false;
    }
    
    return true;
  }

  extractMissionNumber(fileName) {
    const match = fileName.match(/^(\d+)-/);
    return match ? parseInt(match[1]) : null;
  }

  extractMissionNumbersFromContent(content) {
    const numbers = [];
    const matches = content.matchAll(/Mission\s+(\d+)/g);
    
    for (const match of matches) {
      numbers.push(parseInt(match[1]));
    }
    
    return numbers;
  }

  async validateProjectStructure() {
    console.log('\n🏗️  Validating project structure...');
    
    const requiredStructure = [
      'src/app',
      'src/components',
      'src/lib',
      'src/hooks',
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.ts'
    ];
    
    for (const item of requiredStructure) {
      const fullPath = path.join(__dirname, item);
      if (!fs.existsSync(fullPath)) {
        this.errors.push(`Missing required project item: ${item}`);
      }
    }
    
    console.log('  ✅ Project structure validated');
  }

  async validateDependencies() {
    console.log('\n📦 Validating dependencies...');
    
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
      );
      
      const requiredDeps = [
        'next',
        'react',
        'react-dom',
        '@clerk/nextjs',
        '@prisma/client',
        '@radix-ui/react-dialog',
        '@tiptap/react',
        'tailwindcss',
        'typescript'
      ];
      
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      for (const dep of requiredDeps) {
        if (!allDeps[dep]) {
          this.errors.push(`Missing required dependency: ${dep}`);
        }
      }
      
      console.log('  ✅ Dependencies validated');
      
    } catch (error) {
      this.errors.push(`Failed to validate dependencies: ${error.message}`);
    }
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 MISSION VALIDATION RESULTS');
    console.log('='.repeat(60));
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All validations passed!');
      console.log('🚀 Ready to execute missions');
      return true;
    }
    
    if (this.errors.length > 0) {
      console.log(`\n❌ Errors (${this.errors.length}):`);
      this.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.warnings.length}):`);
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    console.log(`\n💡 Fix errors before executing missions`);
    return false;
  }
}

// CLI interface
if (require.main === module) {
  const validator = new MissionValidator();
  validator.validateAllMissions().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = MissionValidator;