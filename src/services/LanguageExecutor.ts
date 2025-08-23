import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ExecutionResult {
  output: string;
  error: string;
  executionTime: number;
  success: boolean;
}

export interface LanguageConfig {
  extension: string;
  compileCommand?: string;
  executeCommand: string;
  cleanup?: string[];
  timeout: number;
}

// Language configurations
const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  javascript: {
    extension: '.js',
    executeCommand: 'node {file}',
    timeout: 5000
  },
  python: {
    extension: '.py',
    executeCommand: 'python {file}',
    timeout: 10000
  },
  java: {
    extension: '.java',
    compileCommand: 'javac {file}',
    executeCommand: 'java -cp {dir} {className}',
    cleanup: ['Solution.class', 'TestRunner.class', 'TestRunnerMain.class'],
    timeout: 15000
  },
  cpp: {
    extension: '.cpp',
    compileCommand: 'g++ -o {executable} {file}',
    executeCommand: '{executable}',
    cleanup: ['{executable}', '{executable}.exe'],
    timeout: 15000
  },
  c: {
    extension: '.c',
    compileCommand: 'gcc -o {executable} {file}',
    executeCommand: '{executable}',
    cleanup: ['{executable}', '{executable}.exe'],
    timeout: 15000
  }
};

export class LanguageExecutor {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp');
    this.ensureTempDir();
  }

  private ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  private generateTempFileName(language: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `code_${timestamp}_${random}`;
  }

  private replaceCommandVariables(command: string, variables: Record<string, string>): string {
    let result = command;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
  }

  private async executeCommand(command: string, timeout: number): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const child = exec(command, { timeout }, (error, stdout, stderr) => {
        const executionTime = Date.now() - startTime;
        
        if (error) {
          resolve({
            output: stdout,
            error: stderr || error.message,
            executionTime,
            success: false
          });
        } else {
          resolve({
            output: stdout,
            error: stderr,
            executionTime,
            success: true
          });
        }
      });

      // Handle timeout
      setTimeout(() => {
        child.kill('SIGTERM');
        resolve({
          output: '',
          error: 'Execution timeout',
          executionTime: timeout,
          success: false
        });
      }, timeout);
    });
  }

  public async executeCode(
    code: string, 
    language: string, 
    input?: string
  ): Promise<ExecutionResult> {
    const config = LANGUAGE_CONFIGS[language];
    if (!config) {
      return {
        output: '',
        error: `Unsupported language: ${language}`,
        executionTime: 0,
        success: false
      };
    }

    const fileName = this.generateTempFileName(language);
    let filePath: string;
    let javaClassName = 'Solution'; // Default class name
    
    if (language === 'java') {
      // Java requires the filename to match the public class name
      // Check if code contains TestRunnerMain class (when user code has class declaration)
      if (code.includes('class TestRunnerMain')) {
        filePath = path.join(this.tempDir, 'TestRunnerMain.java');
        javaClassName = 'TestRunnerMain';
      } else {
        filePath = path.join(this.tempDir, 'Solution.java');
        javaClassName = 'Solution';
      }
    } else {
      filePath = path.join(this.tempDir, fileName + config.extension);
    }
    
    const className = javaClassName; // Use the Java class name or default for other languages
    const executable = path.join(this.tempDir, fileName);

    try {
      // Pre-execution cleanup for Java to prevent duplicate class definitions
      if (language === 'java') {
        // Clean up any existing Java files in temp directory
        const tempFiles = await fs.promises.readdir(this.tempDir);
        for (const file of tempFiles) {
          if (file.endsWith('.java') || file.endsWith('.class')) {
            const fullPath = path.join(this.tempDir, file);
            try {
              await fs.promises.unlink(fullPath);
            } catch (error) {
              // Ignore cleanup errors
            }
          }
        }
      }
      
      console.log(filePath, code)
      // Write code to file
      await fs.promises.writeFile(filePath, code);

      // Compile if needed
      if (config.compileCommand) {
        const compileCmd = this.replaceCommandVariables(config.compileCommand, {
          file: filePath,
          dir: this.tempDir,
          className,
          executable
        });

        const compileResult = await this.executeCommand(compileCmd, config.timeout);
        if (!compileResult.success) {
          return {
            output: compileResult.output,
            error: `Compilation failed: ${compileResult.error}`,
            executionTime: compileResult.executionTime,
            success: false
          };
        }
      }

      // Execute
      const executeCmd = this.replaceCommandVariables(config.executeCommand, {
        file: filePath,
        dir: this.tempDir,
        className,
        executable: process.platform === 'win32' && (language === 'cpp' || language === 'c') ? executable + '.exe' : executable
      });

      let finalCommand = executeCmd;
      if (input) {
        finalCommand = `echo "${input}" | ${executeCmd}`;
      }

      const result = await this.executeCommand(finalCommand, config.timeout);

      // Cleanup
      await this.cleanup(filePath, config, { className, executable });

      return result;

    } catch (error) {
      // Cleanup on error
      await this.cleanup(filePath, config, { className, executable });
      
      return {
        output: '',
        error: `Execution error: ${error}`,
        executionTime: 0,
        success: false
      };
    }
  }

  private async cleanup(filePath: string, config: LanguageConfig, variables: Record<string, string>) {
    try {
      // For Java, clean up all Java-related files thoroughly
      if (filePath.includes('.java')) {
        const tempFiles = await fs.promises.readdir(this.tempDir);
        for (const file of tempFiles) {
          if (file.endsWith('.java') || file.endsWith('.class')) {
            const fullPath = path.join(this.tempDir, file);
            try {
              if (fs.existsSync(fullPath)) {
                await fs.promises.unlink(fullPath);
              }
            } catch (error) {
              // Ignore individual file cleanup errors
            }
          }
        }
      } else {
        // Remove source file for other languages
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      }

      // Remove additional files specified in config
      if (config.cleanup) {
        for (const cleanupFile of config.cleanup) {
          const cleanupPath = this.replaceCommandVariables(cleanupFile, variables);
          const fullCleanupPath = path.isAbsolute(cleanupPath) ? cleanupPath : path.join(this.tempDir, cleanupPath);
          if (fs.existsSync(fullCleanupPath)) {
            await fs.promises.unlink(fullCleanupPath);
          }
        }
      }
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }
  }

  public getSupportedLanguages(): string[] {
    return Object.keys(LANGUAGE_CONFIGS);
  }

  public getLanguageConfig(language: string): LanguageConfig | null {
    return LANGUAGE_CONFIGS[language] || null;
  }
}