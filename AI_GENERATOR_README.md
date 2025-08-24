# AI Problem Generator Setup

This feature can use either DeepSeek-V3 AI or local Ollama models to generate custom coding problems based on user requests.

## Prerequisites

### Option 1: DeepSeek API (Cloud)
1. **DeepSeek API Key**: You need to obtain an API key from DeepSeek (https://platform.deepseek.com/)

### Option 2: Ollama (Local)
1. **Ollama**: Install Ollama from https://ollama.com/
2. **Model**: Download a suitable model (e.g., `ollama pull llama3` or `ollama pull mistral`)

## Environment Setup

> **Important**: The system will automatically detect which AI providers are configured based on the environment variables you set. You no longer need to explicitly specify which provider to use - the system will automatically select from what's available. The frontend will fetch this configuration from the server via the `/api/ai-providers` endpoint.

### For DeepSeek API (Cloud)

#### Option 1: Using .env.local file (Recommended)

1. Create a file named `.env.local` in the root directory of your project
2. Add your DeepSeek API key:

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

#### Option 2: Using system environment variables

##### Windows (PowerShell)
```powershell
$env:DEEPSEEK_API_KEY="your_deepseek_api_key_here"
```

##### Windows (Command Prompt)
```cmd
set DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

##### macOS/Linux (Bash)
```bash
export DEEPSEEK_API_KEY="your_deepseek_api_key_here"
```

#### Option 3: Using .env file for development

1. Create a file named `.env` in the root directory
2. Add your API key:

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### For Ollama (Local)

#### Option 1: Using .env.local file (Recommended)

1. Create a file named `.env.local` in the root directory of your project
2. Add your Ollama configuration:

```bash
# Optional: Set Ollama endpoint (default: http://localhost:11434)
# OLLAMA_ENDPOINT=http://localhost:11434

# Optional: Set Ollama model (default: llama3)
# OLLAMA_MODEL=llama3
```

#### Option 2: Using system environment variables

##### Windows (PowerShell)
```powershell
$env:OLLAMA_ENDPOINT="http://localhost:11434"  # Optional
$env:OLLAMA_MODEL="llama3"  # Optional
```

##### Windows (Command Prompt)
```cmd
set OLLAMA_ENDPOINT=http://localhost:11434  # Optional
set OLLAMA_MODEL=llama3  # Optional
```

##### macOS/Linux (Bash)
```bash
export OLLAMA_ENDPOINT=http://localhost:11434  # Optional
export OLLAMA_MODEL=llama3  # Optional
```

#### Option 3: Using .env file for development

1. Create a file named `.env` in the root directory
2. Add your Ollama configuration:

```bash
# Optional: Set Ollama endpoint (default: http://localhost:11434)
# OLLAMA_ENDPOINT=http://localhost:11434

# Optional: Set Ollama model (default: llama3)
# OLLAMA_MODEL=llama3
```

### Using Both Providers

If you have both DeepSeek and Ollama configured, the system will automatically prefer Ollama. You can switch between providers using the UI controls on the AI Generator page.

## How It Works

The system uses a server-side detection mechanism to determine which AI providers are configured:

1. The server checks environment variables to see what's configured
2. The frontend fetches this configuration via the `/api/ai-providers` endpoint
3. The UI adapts based on what's available
4. When generating problems, the system automatically selects the appropriate provider

This approach ensures proper security (sensitive variables stay server-side) and compliance with Next.js environment variable restrictions. The frontend never directly accesses environment variables like `DEEPSEEK_API_KEY` - instead, it queries the server endpoint which checks what's configured and returns a safe response.

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the AI Generator page:
   - Click the "🤖 AI Generator" button on the homepage
   - Or visit `/generator` directly

3. Enter your problem request in Chinese or English:
   - "我想做一道动态规划题目"
   - "Generate a medium difficulty array manipulation problem"
   - "创建一个关于二分搜索的问题"
   - "I want a string processing problem with sliding window"

4. Click "Generate Problem" and wait for the AI to create your custom problem

## Features

- **Bilingual Support**: Works with both English and Chinese requests
- **Multi-language Templates**: Generates problems with templates for JavaScript, Python, Java, C++, and C
- **Working Solutions**: Each generated problem includes a complete JavaScript solution
- **Comprehensive Test Cases**: Problems come with multiple test cases including edge cases
- **Automatic Integration**: Generated problems are automatically added to your problems.json file
- **Difficulty Control**: You can specify the difficulty level in your request
- **Algorithm Targeting**: Request specific algorithm types (DP, graphs, trees, etc.)
- **Auto-Detection**: System automatically detects which providers are configured
- **Provider Switching**: UI controls allow switching between providers when both are available

## API Endpoint

- **Endpoint**: `/api/generate-problem`
- **Method**: POST
- **Body**: `{ "request": "your problem description" }`
- **Response**: Generated problem data or error message

## Security Notes

- Keep your API key secure and never commit it to version control
- The `.env.local` file is automatically ignored by Git
- API calls are made server-side to protect your API key from exposure
- Sensitive environment variables are never exposed to the frontend

## Troubleshooting

### "DEEPSEEK_API_KEY environment variable is not set"
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

### Generated problem format issues
- The AI generates problems in a specific JSON format
- If parsing fails, the error will include the raw response for debugging
- Try rephrasing your request to be more specific

## Example Requests

**Dynamic Programming (Chinese):**
```
我想做一道中等难度的动态规划题目，关于最优子结构
```

**Array Manipulation (English):**
```
Generate a medium difficulty array manipulation problem using two pointers technique
```

**String Processing (Mixed):**
```
创建一个关于字符串处理的题目，使用sliding window算法
```