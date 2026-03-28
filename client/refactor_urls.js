import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFiles = [
    'src/pages/TeacherDashboard.jsx',
    'src/pages/StudentDashboard.jsx',
    'src/pages/Register.jsx',
    'src/pages/Login.jsx',
    'src/pages/AdminTeachersList.jsx',
    'src/pages/AdminStudentsList.jsx',
    'src/pages/AdminDashboard.jsx',
    'src/components/ProfileModal.jsx'
];

console.log("Commencing strict relative-URL global component refactor...");
let changedCount = 0;

targetFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if(fs.existsSync(fullPath)) {
        const originalContent = fs.readFileSync(fullPath, 'utf8');
        const refactoredContent = originalContent.replace(/http:\/\/localhost:5000/g, '');
        
        if(originalContent !== refactoredContent) {
            fs.writeFileSync(fullPath, refactoredContent, 'utf8');
            console.log(`[SUCCESS] Stripped hardcoded domain from: ${file}`);
            changedCount++;
        }
    } else {
        console.warn(`[WARNING] Skipping isolated file mapping - ${file}`);
    }
});

console.log(`Successfully rewrote ${changedCount} frontend components converting legacy URLs into responsive relative API mappings seamlessly!`);
process.exit(0);
