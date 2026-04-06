// scripts/enforce-strict-css.js
const fs = require('fs');
const path = require('path');

// Target the Next.js global type declarations
const typesPath = path.join(
  process.cwd(),
  'node_modules',
  'next',
  'types',
  'global.d.ts',
);

if (fs.existsSync(typesPath)) {
  const content = fs.readFileSync(typesPath, 'utf8');

  // UPDATED: Regex now accounts for the nested braces by explicitly matching
  // through the 'export default' statement to the final closing brace.
  const cssModulesRegex =
    /declare module '\*\.module\.(css|sass|scss)'\s*{[\s\S]*?export default[^}]*}/g;

  // The side-effect imports (like 'import "./style.css"') don't have nested objects,
  // so your original regex for them is perfectly fine.
  const cssSideEffectsRegex = /declare module '\*\.(css|sass|scss)'\s*{}/g;

  // Strip the wildcards from the file content
  const newContent = content
    .replace(cssModulesRegex, '')
    .replace(cssSideEffectsRegex, '');

  // Only write to the file if changes were actually made
  if (content !== newContent) {
    fs.writeFileSync(typesPath, newContent, 'utf8');
    console.log(
      '✅ Next.js CSS wildcards removed. Strict TCM typing enforced.',
    );
  } else {
    console.log(
      'ℹ️ No CSS wildcards found to remove. File may already be strict.',
    );
  }
} else {
  console.warn('⚠️ Could not find Next.js global.d.ts to enforce strict CSS.');
}
