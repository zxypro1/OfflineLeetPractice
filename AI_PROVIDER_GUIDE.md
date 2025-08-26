# AI Provider Configuration Guide for Offline Leet Practice

This guide explains how to configure AI model providers in the Offline Leet Practice application, which works in both desktop and web modes. The AI problem generator feature can use various AI providers to generate custom coding problems based on user requests.

## Accessing Settings

You can access the settings page in multiple ways:

1. **Desktop App**: 
   - Click on "Navigation" → "Settings" in the application menu
   - Click the "Settings" button on the loading screen

2. **Web Mode**: 
   - Navigate to the `/settings` path (e.g., http://localhost:3000/settings)

## AI Provider Configuration

The application supports multiple AI providers for generating coding problems. You can configure one or more providers, and the system will automatically select the best available option.

### DeepSeek Configuration

1. **API Key**: Obtain an API key from [DeepSeek Platform](https://platform.deepseek.com/)
2. **Model**: Specify which DeepSeek model to use (default: `deepseek-chat`)
3. **Timeout**: Set API timeout in milliseconds (default: 30000)
4. **Max Tokens**: Set maximum tokens for generation (default: 4000)

#### Environment Setup for DeepSeek API (Cloud)

##### Option 1: Using .env.local file (Recommended)

1. Create a file named `.env.local` in the root directory of your project
2. Add your DeepSeek API key:

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

##### Option 2: Using system environment variables

###### Windows (PowerShell)
```powershell
$env:DEEPSEEK_API_KEY="your_deepseek_api_key_here"
```

###### Windows (Command Prompt)
```cmd
set DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

###### macOS/Linux (Bash)
```bash
export DEEPSEEK_API_KEY="your_deepseek_api_key_here"
```

##### Option 3: Using .env file for development

1. Create a file named `.env` in the root directory
2. Add your API key:

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

Optional: Set DeepSeek model (default: deepseek-chat)
```bash
DEEPSEEK_MODEL=deepseek-coder
```

### OpenAI Configuration

1. **API Key**: Obtain an API key from [OpenAI Platform](https://platform.openai.com/)
2. **Model**: Specify which OpenAI model to use (default: `gpt-4-turbo`)

#### Environment Setup for OpenAI (Cloud)

##### Option 1: Using .env.local file (Recommended)

1. Create a file named `.env.local` in the root directory of your project
2. Add your OpenAI API key:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

##### Option 2: Using system environment variables

###### Windows (PowerShell)
```powershell
$env:OPENAI_API_KEY="your_openai_api_key_here"
```

###### Windows (Command Prompt)
```cmd
set OPENAI_API_KEY=your_openai_api_key_here
```

###### macOS/Linux (Bash)
```bash
export OPENAI_API_KEY="your_openai_api_key_here"
```

##### Option 3: Using .env file for development

1. Create a file named `.env` in the root directory
2. Add your API key:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Optional: Set OpenAI model (default: gpt-4-turbo)
```bash
OPENAI_MODEL=gpt-4
```

### Qwen (通义千问) Configuration

1. **API Key**: Obtain an API key from [Qwen Platform](https://dashscope.console.aliyun.com/)
2. **Model**: Specify which Qwen model to use (default: `qwen-turbo`)

#### Environment Setup for Qwen (通义千问) (Cloud)

##### Option 1: Using .env.local file (Recommended)

1. Create a file named `.env.local` in the root directory of your project
2. Add your Qwen API key:

```bash
QWEN_API_KEY=your_qwen_api_key_here
```

##### Option 2: Using system environment variables

###### Windows (PowerShell)
```powershell
$env:QWEN_API_KEY="your_qwen_api_key_here"
```

###### Windows (Command Prompt)
```cmd
set QWEN_API_KEY=your_qwen_api_key_here
```

###### macOS/Linux (Bash)
```bash
export QWEN_API_KEY="your_qwen_api_key_here"
```

##### Option 3: Using .env file for development

1. Create a file named `.env` in the root directory
2. Add your API key:

```bash
QWEN_API_KEY=your_qwen_api_key_here
```

Optional: Set Qwen model (default: qwen-turbo)
```bash
QWEN_MODEL=qwen-plus
```

### Claude Configuration

1. **API Key**: Obtain an API key from [Claude Platform](https://console.anthropic.com/)
2. **Model**: Specify which Claude model to use (default: `claude-3-haiku-20240307`)

#### Environment Setup for Claude (Cloud)

##### Option 1: Using .env.local file (Recommended)

1. Create a file named `.env.local` in the root directory of your project
2. Add your Claude API key:

```bash
CLAUDE_API_KEY=your_claude_api_key_here
```

##### Option 2: Using system environment variables

###### Windows (PowerShell)
```powershell
$env:CLAUDE_API_KEY="your_claude_api_key_here"
```

###### Windows (Command Prompt)
```cmd
set CLAUDE_API_KEY=your_claude_api_key_here
```

###### macOS/Linux (Bash)
```bash
export CLAUDE_API_KEY="your_claude_api_key_here"
```

##### Option 3: Using .env file for development

1. Create a file named `.env` in the root directory
2. Add your API key:

```bash
CLAUDE_API_KEY=your_claude_api_key_here
```

Optional: Set Claude model (default: claude-3-haiku-20240307)
```bash
CLAUDE_MODEL=claude-3-sonnet-20240229
```

### Ollama (Local) Configuration

1. **Endpoint**: Set your Ollama endpoint (default: `http://localhost:11434`)
2. **Model**: Specify which local model to use (default: `llama3`)

#### Prerequisites for Ollama (Local)

1. **Ollama**: Install Ollama from https://ollama.com/
2. **Model**: Download a suitable model (e.g., `ollama pull llama3` or `ollama pull mistral`)

#### Environment Setup for Ollama (Local)

##### Option 1: Using .env.local file (Recommended)

1. Create a file named `.env.local` in the root directory of your project
2. Add your Ollama configuration:

```bash
# Optional: Set Ollama endpoint (default: http://localhost:11434)
# OLLAMA_ENDPOINT=http://localhost:11434

# Optional: Set Ollama model (default: llama3)
# OLLAMA_MODEL=llama3
```

##### Option 2: Using system environment variables

###### Windows (PowerShell)
```powershell
$env:OLLAMA_ENDPOINT="http://localhost:11434"  # Optional
$env:OLLAMA_MODEL="llama3"  # Optional
```

###### Windows (Command Prompt)
```cmd
set OLLAMA_ENDPOINT=http://localhost:11434  # Optional
set OLLAMA_MODEL=llama3  # Optional
```

###### macOS/Linux (Bash)
```bash
export OLLAMA_ENDPOINT=http://localhost:11434  # Optional
export OLLAMA_MODEL=llama3  # Optional
```

##### Option 3: Using .env file for development

1. Create a file named `.env` in the root directory
2. Add your Ollama configuration:

```bash
# Optional: Set Ollama endpoint (default: http://localhost:11434)
# OLLAMA_ENDPOINT=http://localhost:11434

# Optional: Set Ollama model (default: llama3)
# OLLAMA_MODEL=llama3
```

## Saving Configuration

After entering your configuration details:

1. Click the "Save Configuration" button
2. You should see a success message if the configuration was saved correctly
3. In desktop mode, the configuration is stored in your user directory (`~/.offline-leet-practice/config.json`)
4. In web mode, the configuration is simulated for demonstration purposes

## Provider Priority

The application will automatically select providers in this order of preference:

1. Ollama (local)
2. OpenAI
3. Claude
4. Qwen
5. DeepSeek

If multiple providers are configured, you can manually select which one to use in the AI Generator interface.

## How It Works

The system uses a server-side detection mechanism to determine which AI providers are configured:

1. The server checks environment variables to see what's configured
2. The frontend fetches this configuration via the `/api/ai-providers` endpoint
3. The UI adapts based on what's available
4. When generating problems, the system automatically selects the appropriate provider

This approach ensures proper security (sensitive variables stay server-side) and compliance with Next.js environment variable restrictions. The frontend never directly accesses environment variables like `DEEPSEEK_API_KEY` - instead, it queries the server endpoint which checks what's configured and returns a safe response.

## First-run Interactive AI Configuration

If no `.env` file exists when you run the provided startup scripts (`start-local.sh` or `start-local.bat`), the script will detect this as a first-time startup and offer to interactively configure AI features for you. In non-interactive mode (use `--yes` or `START_LOCAL_NONINTERACTIVE=1`) the script will try to copy `.env.example` to `.env` if present; otherwise it will create a minimal `.env` with default model names and empty API keys. The interactive flow will:

- Ask whether you want to enable AI features.
- For each provider (OpenAI, DeepSeek, Qwen, Claude, Ollama) ask whether to enable it, then prompt for model name and API key (for Ollama it will ask for endpoint and model).
- Provide sensible defaults if you just press Enter:
  - OpenAI model: `gpt-4-turbo`
  - DeepSeek model: `deepseek-chat`
  - Qwen model: `qwen-turbo`
  - Claude model: `claude-3-haiku-20240307`
  - Ollama endpoint: `http://localhost:11434`, model: `llama3`

The script will write your choices into a `.env` file in the project root. If a `.env` already exists, the scripts will skip configuration. To change AI settings later, edit the `.env` file directly.

## Using AI Generator

1. Navigate to the AI Generator page by clicking the "🤖 AI Generator" button on the homepage
2. Enter your problem request in English or Chinese, for example:
   - "Generate a medium difficulty array manipulation problem"
   - "我想做一道动态规划题目"
   - "Create a binary search problem with edge cases"
3. Click "Generate Problem" and wait for the AI to create your custom problem
4. The generated problem will automatically be added to your local problem library
5. Click "Try Last Generated Problem" to immediately start solving it

## Features

- **Bilingual Support**: Works with both English and Chinese requests
- **Multi-language Templates**: Generates problems with templates for JavaScript, Python, Java, C++, and C
- **Working Solutions**: Each generated problem includes a complete JavaScript solution
- **Comprehensive Test Cases**: Problems come with multiple test cases including edge cases
- **Automatic Integration**: Generated problems are automatically added to your problems.json file
- **Difficulty Control**: You can specify the difficulty level in your request
- **Algorithm Targeting**: Request specific algorithm types (DP, graphs, trees, etc.)
- **Auto-Detection**: System automatically detects which providers are configured
- **Provider Switching**: UI controls allow switching between providers when multiple are available
- **Model Selection**: Each provider supports configurable models

## API Endpoint

- **Endpoint**: `/api/generate-problem`
- **Method**: POST
- **Body**: `{ "request": "your problem description" }`
- **Response**: Generated problem data or error message

## Security Notes

- Keep your API keys secure and never commit them to version control
- The `.env.local` file is automatically ignored by Git
- API calls are made server-side to protect your API keys from exposure
- Sensitive environment variables are never exposed to the frontend

## Troubleshooting

### "DEEPSEEK_API_KEY environment variable is not set"
- Make sure you've set the environment variable correctly
- Restart your development server after setting the environment variable
- Check that your `.env.local` file is in the correct location (project root)

### "OPENAI_API_KEY environment variable is not set"
- Make sure you've set the environment variable correctly
- Restart your development server after setting the environment variable
- Check that your `.env.local` file is in the correct location (project root)

### "QWEN_API_KEY environment variable is not set"
- Make sure you've set the environment variable correctly
- Restart your development server after setting the environment variable
- Check that your `.env.local` file is in the correct location (project root)

### "CLAUDE_API_KEY environment variable is not set"
- Make sure you've set the environment variable correctly
- Restart your development server after setting the environment variable
- Check that your `.env.local` file is in the correct location (project root)

### "Ollama API error"
- Ensure Ollama is running (`ollama serve`)
- Verify the OLLAMA_ENDPOINT is correct
- Check that the specified model is downloaded (`ollama list`)
- Try pulling the model if it's not available (`ollama pull llama3`)

### "DeepSeek API error"
- Verify your API key is correct and active
- Check your DeepSeek account for API usage limits
- Ensure you have sufficient credits/quota

### "OpenAI API error"
- Verify your API key is correct and active
- Check your OpenAI account for API usage limits
- Ensure you have sufficient credits/quota

### "Qwen API error"
- Verify your API key is correct and active
- Check your Qwen account for API usage limits
- Ensure you have sufficient credits/quota

### "Claude API error"
- Verify your API key is correct and active
- Check your Claude account for API usage limits
- Ensure you have sufficient credits/quota

### Generated problem format issues
- The AI generates problems in a specific JSON format
- If parsing fails, the error will include the raw response for debugging
- Try rephrasing your request to be more specific

## Example Requests

**Dynamic Programming (Chinese):**
```text
我想做一道中等难度的动态规划题目，关于最优子结构
```

**Array Manipulation (English):**
```text
Generate a medium difficulty array manipulation problem using two pointers technique
```

**String Processing (Mixed):**
```text
创建一个关于字符串处理的题目，使用sliding window算法
```