const fs = require('fs');
const path = require('path');

function getRelativePath(fromFile, targetPath) {
  const fromDir = path.dirname(fromFile);
  let rel = path.relative(fromDir, targetPath);
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel.replace(/\.ts$/, '');
}

function findControllers(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findControllers(filePath, fileList);
    } else if (filePath.endsWith('.controller.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const controllers = findControllers(path.join(__dirname, 'src'));
const decoratorPath = path.join(__dirname, 'src', 'common', 'decorators', 'require-permissions.decorator.ts');

for (const file of controllers) {
  let content = fs.readFileSync(file, 'utf-8');
  if (file.includes('auth.controller') || file.includes('app.controller') || file.includes('health.controller')) continue;
  
  const lines = content.split('\n');
  let newLines = [];
  let modified = false;

  // e.g. governance.controller.ts -> 'enterprise.manage'
  const basename = path.basename(file, '.controller.ts');
  let permScope = basename;
  
  // Custom mapping based on folder or logic
  if (file.includes('enterprise/')) permScope = 'enterprise.manage';
  else if (file.includes('platform/')) permScope = 'platform.manage';
  else if (file.includes('branding/')) permScope = 'branding.manage';
  else if (file.includes('communication/')) permScope = 'communication.manage';
  else if (file.includes('ai/')) permScope = 'ai.manage';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(\s*)@(Get|Post|Put|Patch|Delete)\(/);
    
    if (match) {
      let hasDecorator = false;
      for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
        if (!lines[j].trim().startsWith('@')) break;
        if (lines[j].includes('@RequirePermissions') || lines[j].includes('@Public') || lines[j].includes('@RequireRoles') || lines[j].includes('@RequireScopes')) {
          hasDecorator = true;
          break;
        }
      }
      
      if (!hasDecorator) {
        const indent = match[1];
        const method = match[2];
        let action = '';
        if (method === 'Get') action = `read:${permScope}`;
        if (method === 'Post') action = `create:${permScope}`;
        if (method === 'Put' || method === 'Patch') action = `update:${permScope}`;
        if (method === 'Delete') action = `delete:${permScope}`;
        
        // If it's a generic manage scope, just use that
        if (permScope.includes('.')) action = permScope;
        
        newLines.push(`${indent}@RequirePermissions('${action}')`);
        modified = true;
      }
    }
    
    newLines.push(line);
  }
  
  if (modified) {
    if (!content.includes('RequirePermissions')) {
      const relPath = getRelativePath(file, decoratorPath);
      // insert import after first line
      newLines.splice(1, 0, `import { RequirePermissions } from '${relPath}';`);
    }
    fs.writeFileSync(file, newLines.join('\n'));
    console.log(`Updated ${file}`);
  }
}
