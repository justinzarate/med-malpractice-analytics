#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// CONFIGURATION: Map input files to output names
// ==========================================
// Update the keys below to match your downloaded BigQuery filenames
const FILE_MAPPING = {
  // Example: "bquxjob_12345678_abc.json": "kpi_summary",
  "kpi_summary.json": "kpi_summary",
  "severity_bucket_dist.json": "severity_bucket_dist",
  "insurance_mix.json": "insurance_mix",
  "top_specialties.json": "top_specialties",
  "amount_by_insurance_severity.json": "amount_by_insurance_severity"
};

// Required output files
const REQUIRED_OUTPUTS = [
  "kpi_summary",
  "severity_bucket_dist",
  "insurance_mix",
  "top_specialties",
  "amount_by_insurance_severity"
];

// ==========================================
// PATHS
// ==========================================
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_RAW_DIR = path.join(PROJECT_ROOT, 'data_raw');
const PUBLIC_DATA_DIR = path.join(PROJECT_ROOT, 'public', 'data');

// ==========================================
// MAIN CONVERSION LOGIC
// ==========================================
function convertFile(inputPath, outputBaseName) {
  console.log(`\n📝 Processing: ${path.basename(inputPath)} → ${outputBaseName}.json`);
  
  try {
    const fileContent = fs.readFileSync(inputPath, 'utf8').trim();
    
    if (!fileContent) {
      throw new Error('File is empty');
    }
    
    let jsonArray;
    
    // Check if already a JSON array
    if (fileContent.startsWith('[')) {
      console.log('   ✓ Already JSON array format');
      jsonArray = JSON.parse(fileContent);
    } else {
      // Treat as JSONL (newline-delimited JSON)
      console.log('   ✓ Detected JSONL format, converting...');
      const lines = fileContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      jsonArray = lines.map((line, index) => {
        try {
          return JSON.parse(line);
        } catch (parseError) {
          throw new Error(`Failed to parse line ${index + 1}: ${parseError.message}`);
        }
      });
    }
    
    // Write output
    const outputPath = path.join(PUBLIC_DATA_DIR, `${outputBaseName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(jsonArray, null, 2), 'utf8');
    
    console.log(`   ✓ Written ${jsonArray.length} rows to public/data/${outputBaseName}.json`);
    
    return { success: true, rowCount: jsonArray.length };
    
  } catch (error) {
    console.error(`   ✗ Error processing file: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// ==========================================
// RUN CONVERSION
// ==========================================
function main() {
  console.log('🚀 BigQuery JSONL → JSON Array Converter\n');
  console.log(`Input directory:  ${DATA_RAW_DIR}`);
  console.log(`Output directory: ${PUBLIC_DATA_DIR}\n`);
  
  // Ensure directories exist
  if (!fs.existsSync(DATA_RAW_DIR)) {
    console.error(`❌ Error: data_raw/ directory not found at ${DATA_RAW_DIR}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(PUBLIC_DATA_DIR)) {
    fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
    console.log(`✓ Created output directory: ${PUBLIC_DATA_DIR}\n`);
  }
  
  // Process each file
  const results = {};
  let successCount = 0;
  let failureCount = 0;
  
  for (const [inputFilename, outputBaseName] of Object.entries(FILE_MAPPING)) {
    const inputPath = path.join(DATA_RAW_DIR, inputFilename);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`\n⚠️  Skipping: ${inputFilename} (file not found in data_raw/)`);
      results[outputBaseName] = { success: false, error: 'File not found' };
      failureCount++;
      continue;
    }
    
    const result = convertFile(inputPath, outputBaseName);
    results[outputBaseName] = result;
    
    if (result.success) {
      successCount++;
    } else {
      failureCount++;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONVERSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✓ Successful: ${successCount}`);
  console.log(`✗ Failed:     ${failureCount}`);
  
  // Check for missing required outputs
  const missingOutputs = REQUIRED_OUTPUTS.filter(name => {
    const outputPath = path.join(PUBLIC_DATA_DIR, `${name}.json`);
    return !fs.existsSync(outputPath);
  });
  
  if (missingOutputs.length > 0) {
    console.log('\n❌ ERROR: Missing required output files:');
    missingOutputs.forEach(name => console.log(`   - ${name}.json`));
    console.log('\nPlease check your FILE_MAPPING configuration and ensure all input files are present.');
    process.exit(1);
  }
  
  console.log('\n✅ All required datasets converted successfully!');
  console.log('\nYou can now access these files from your frontend:');
  REQUIRED_OUTPUTS.forEach(name => {
    console.log(`   fetch("/data/${name}.json")`);
  });
  console.log('');
}

main();
