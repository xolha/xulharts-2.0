const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse and set environment variables
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    process.env[key] = value;
  }
});

// Run better-auth CLI generate
try {
  execSync('npx @better-auth/cli@latest generate', {
    stdio: 'inherit',
    env: process.env
  });
  console.log('Better Auth schema generated successfully!');
} catch (error) {
  console.error('Failed to generate schema:', error.message);
  process.exit(1);
}
