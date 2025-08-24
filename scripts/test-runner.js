#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Comprehensive test runner for the OfflineLeetPractice API
 * Ensures environment is ready and runs all test suites
 */
class TestRunner {
  constructor() {
    this.testSuites = [
      {
        name: 'Problem Data Integrity',
        file: 'tests/api/problem-data.test.js',
        description: 'Validates problem structure and data integrity'
      },
      {
        name: 'API Functionality',
        file: 'tests/api/run.test.js', 
        description: 'Tests core API endpoints and basic functionality'
      },
      {
        name: 'Language-Specific Features',
        file: 'tests/api/language-specific.test.js',
        description: 'Tests language-specific template handling and edge cases'
      },
      {
        name: 'Solution Validation',
        file: 'tests/api/solutions.test.js',
        description: 'Validates all provided solutions work correctly'
      }
    ];
  }

  /**
   * Check if required files exist
   */
  checkEnvironment() {
    console.log('🔍 Checking test environment...');
    
    const requiredFiles = [
      'public/problems.json',
      'pages/api/run.ts',
      'jest.config.js',
      'jest.setup.js'
    ];

    const missingFiles = requiredFiles.filter(file => 
      !fs.existsSync(path.join(process.cwd(), file))
    );

    if (missingFiles.length > 0) {
      console.error('❌ Missing required files:');
      missingFiles.forEach(file => console.error(`   - ${file}`));
      return false;
    }

    console.log('✅ Environment check passed');
    return true;
  }

  /**
   * Validate problems.json structure
   */
  validateProblems() {
    console.log('🔍 Validating problems.json...');
    
    try {
      const problemsPath = path.join(process.cwd(), 'public', 'problems.json');
      const problems = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));
      
      if (!Array.isArray(problems) || problems.length === 0) {
        console.error('❌ Invalid problems.json: must be non-empty array');
        return false;
      }

      const requiredFields = ['id', 'title', 'tests', 'template'];
      const invalidProblems = problems.filter(problem => 
        !requiredFields.every(field => problem.hasOwnProperty(field))
      );

      if (invalidProblems.length > 0) {
        console.error('❌ Invalid problems found (missing required fields):');
        invalidProblems.forEach(p => console.error(`   - ${p.id || 'Unknown'}`));
        return false;
      }

      console.log(`✅ Found ${problems.length} valid problems`);
      return true;
    } catch (error) {
      console.error('❌ Error validating problems.json:', error.message);
      return false;
    }
  }

  /**
   * Run a specific test suite
   */
  async runTestSuite(suite, options = {}) {
    console.log(`\n🧪 Running ${suite.name}...`);
    console.log(`   ${suite.description}`);
    
    return new Promise((resolve) => {
      const jestArgs = [
        suite.file,
        '--verbose',
        '--no-cache',
        '--forceExit'
      ];

      if (options.coverage) {
        jestArgs.push('--coverage');
      }

      if (options.bail) {
        jestArgs.push('--bail');
      }

      const jest = spawn('npx', ['jest', ...jestArgs], {
        stdio: 'inherit',
        shell: true
      });

      jest.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ ${suite.name} passed`);
        } else {
          console.log(`❌ ${suite.name} failed with code ${code}`);
        }
        resolve(code === 0);
      });

      jest.on('error', (error) => {
        console.error(`❌ Error running ${suite.name}:`, error.message);
        resolve(false);
      });
    });
  }

  /**
   * Run all test suites
   */
  async runAllTests(options = {}) {
    console.log('🚀 Starting comprehensive API test suite\n');
    
    // Environment checks
    if (!this.checkEnvironment()) {
      process.exit(1);
    }

    if (!this.validateProblems()) {
      process.exit(1);
    }

    // Run test suites
    const results = [];
    for (const suite of this.testSuites) {
      const success = await this.runTestSuite(suite, options);
      results.push({ suite: suite.name, success });
      
      if (!success && options.bail) {
        console.log('\n❌ Test suite failed, stopping due to --bail flag');
        break;
      }
    }

    // Summary
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const passed = results.filter(r => r.success).length;
    const total = results.length;
    
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.suite}`);
    });

    console.log(`\nOverall: ${passed}/${total} test suites passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! API is working correctly.');
      process.exit(0);
    } else {
      console.log('💥 Some tests failed. Please check the output above.');
      process.exit(1);
    }
  }

  /**
   * Run specific test by name or pattern
   */
  async runSpecificTest(pattern, options = {}) {
    const matchingSuites = this.testSuites.filter(suite => 
      suite.name.toLowerCase().includes(pattern.toLowerCase()) ||
      suite.file.includes(pattern)
    );

    if (matchingSuites.length === 0) {
      console.error(`❌ No test suites found matching pattern: ${pattern}`);
      console.log('\nAvailable test suites:');
      this.testSuites.forEach(suite => {
        console.log(`   - ${suite.name} (${suite.file})`);
      });
      process.exit(1);
    }

    console.log(`🎯 Running ${matchingSuites.length} matching test suite(s):\n`);
    
    for (const suite of matchingSuites) {
      await this.runTestSuite(suite, options);
    }
  }

  /**
   * Display help information
   */
  showHelp() {
    console.log(`
🧪 OfflineLeetPractice API Test Runner

Usage: node scripts/test-runner.js [command] [options]

Commands:
  all              Run all test suites (default)
  specific <name>  Run specific test suite by name or pattern
  help             Show this help message

Options:
  --coverage       Generate coverage report
  --bail           Stop on first test failure
  --verbose        Show detailed output

Test Suites:
${this.testSuites.map(suite => `  • ${suite.name}\n    ${suite.description}`).join('\n')}

Examples:
  node scripts/test-runner.js
  node scripts/test-runner.js all --coverage
  node scripts/test-runner.js specific "API" --bail
  node scripts/test-runner.js specific "solution" --verbose
`);
  }
}

// Main execution
async function main() {
  const runner = new TestRunner();
  const args = process.argv.slice(2);
  
  const command = args[0] || 'all';
  const options = {
    coverage: args.includes('--coverage'),
    bail: args.includes('--bail'),
    verbose: args.includes('--verbose')
  };

  switch (command) {
    case 'help':
      runner.showHelp();
      break;
      
    case 'all':
      await runner.runAllTests(options);
      break;
      
    case 'specific':
      const pattern = args[1];
      if (!pattern) {
        console.error('❌ Please specify a test pattern');
        process.exit(1);
      }
      await runner.runSpecificTest(pattern, options);
      break;
      
    default:
      console.error(`❌ Unknown command: ${command}`);
      runner.showHelp();
      process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled rejection:', reason);
  process.exit(1);
});

main().catch(error => {
  console.error('💥 Test runner error:', error);
  process.exit(1);
});