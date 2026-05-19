const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

try {
  // 1. Get all files tracked by git containing helijet.to.com
  console.log("Searching for helijet.to.com...");
  let filesStr = '';
  try {
    filesStr = execSync('git grep -il "helijet.to.com"', { encoding: 'utf-8' });
  } catch (e) {
    // git grep exits with 1 if no matches are found
    console.log("No files with helijet.to.com found.");
  }
  
  let files = filesStr.split('\n').filter(f => f.trim() !== '');
  
  // Also check for helijet.com just in case
  console.log("Searching for helijet.com...");
  let legacyFilesStr = '';
  try {
    legacyFilesStr = execSync('git grep -il "helijet.com"', { encoding: 'utf-8' });
  } catch (e) {
    console.log("No files with helijet.com found.");
  }
  
  const legacyFiles = legacyFilesStr.split('\n').filter(f => f.trim() !== '');
  
  // Combine unique files
  const allFiles = Array.from(new Set([...files, ...legacyFiles]));
  
  console.log(`Found ${allFiles.length} unique files to update.`);

  let replacedCount = 0;
  for (const file of allFiles) {
    // Avoid modifying the script itself
    if (file.includes('replace_to_it.js') || file.includes('replace.js')) {
      continue;
    }
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Perform case-insensitive replacements
      let newContent = content.replace(/helijet\.to\.com/gi, 'helijet.it.com');
      newContent = newContent.replace(/helijet\.com/gi, 'helijet.it.com');
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf-8');
        replacedCount++;
      }
    }
  }
  console.log(`Successfully replaced text in ${replacedCount} files.`);
  
  // 2. Now rename the directory
  const oldDir = path.join(__dirname, 'helijet.to.com');
  const newDir = path.join(__dirname, 'helijet.it.com');
  
  if (fs.existsSync(oldDir)) {
    console.log("Renaming helijet.to.com directory to helijet.it.com via git mv...");
    execSync(`git mv helijet.to.com helijet.it.com`);
    console.log(`Successfully renamed directory helijet.to.com to helijet.it.com`);
  } else {
    console.log("helijet.to.com directory does not exist or was already renamed.");
  }
} catch (e) {
  console.error("Error during migration:", e.message);
}
