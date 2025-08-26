import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Group, 
  Stack,
  TextInput,
  Button,
  Alert,
  Loader,
  Box,
  Divider,
  PasswordInput,
  Center
} from '@mantine/core';
import { useTranslation, useI18n } from '../src/contexts/I18nContext';
import { LanguageThemeControls } from '../src/components/LanguageThemeControls';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // AI Provider configuration states
  const [deepSeekConfig, setDeepSeekConfig] = useState({
    apiKey: '',
    model: '',
    timeout: '',
    maxTokens: ''
  });
  
  const [openAIConfig, setOpenAIConfig] = useState({
    apiKey: '',
    model: ''
  });
  
  const [qwenConfig, setQwenConfig] = useState({
    apiKey: '',
    model: ''
  });
  
  const [claudeConfig, setClaudeConfig] = useState({
    apiKey: '',
    model: ''
  });
  
  const [ollamaConfig, setOllamaConfig] = useState({
    endpoint: '',
    model: ''
  });
  
  // Language preference is handled by the main UI, not in settings

  // Load current configuration
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        // Check if we're running in Electron
        if (typeof window !== 'undefined' && (window as any).electronAPI) {
          // Load configuration from Electron main process
          const result = await (window as any).electronAPI.loadConfiguration();
          if (result.success && result.data) {
            const data = result.data;
            setDeepSeekConfig(data.deepSeek || { apiKey: '', model: '', timeout: '', maxTokens: '' });
            setOpenAIConfig(data.openAI || { apiKey: '', model: '' });
            setQwenConfig(data.qwen || { apiKey: '', model: '' });
            setClaudeConfig(data.claude || { apiKey: '', model: '' });
            setOllamaConfig(data.ollama || { endpoint: '', model: '' });
          }
        } else {
          // Web mode: Load from localStorage first, fallback to environment variables
          const savedConfig = localStorage.getItem('ai-provider-config');
          if (savedConfig) {
            try {
              const config = JSON.parse(savedConfig);
              setDeepSeekConfig(config.deepSeek || { apiKey: '', model: '', timeout: '', maxTokens: '' });
              setOpenAIConfig(config.openAI || { apiKey: '', model: '' });
              setQwenConfig(config.qwen || { apiKey: '', model: '' });
              setClaudeConfig(config.claude || { apiKey: '', model: '' });
              setOllamaConfig(config.ollama || { endpoint: '', model: '' });
            } catch (parseError) {
              console.error('Error parsing saved configuration:', parseError);
              // Fallback to environment variables
              setDeepSeekConfig({
                apiKey: process.env.DEEPSEEK_API_KEY || '',
                model: process.env.DEEPSEEK_MODEL || '',
                timeout: process.env.DEEPSEEK_API_TIMEOUT || '',
                maxTokens: process.env.DEEPSEEK_MAX_TOKENS || ''
              });
              
              setOpenAIConfig({
                apiKey: process.env.OPENAI_API_KEY || '',
                model: process.env.OPENAI_MODEL || ''
              });
              
              setQwenConfig({
                apiKey: process.env.QWEN_API_KEY || '',
                model: process.env.QWEN_MODEL || ''
              });
              
              setClaudeConfig({
                apiKey: process.env.CLAUDE_API_KEY || '',
                model: process.env.CLAUDE_MODEL || ''
              });
              
              setOllamaConfig({
                endpoint: process.env.OLLAMA_ENDPOINT || '',
                model: process.env.OLLAMA_MODEL || ''
              });
            }
          } else {
            // Fallback to environment variables
            setDeepSeekConfig({
              apiKey: process.env.DEEPSEEK_API_KEY || '',
              model: process.env.DEEPSEEK_MODEL || '',
              timeout: process.env.DEEPSEEK_API_TIMEOUT || '',
              maxTokens: process.env.DEEPSEEK_MAX_TOKENS || ''
            });
            
            setOpenAIConfig({
              apiKey: process.env.OPENAI_API_KEY || '',
              model: process.env.OPENAI_MODEL || ''
            });
            
            setQwenConfig({
              apiKey: process.env.QWEN_API_KEY || '',
              model: process.env.QWEN_MODEL || ''
            });
            
            setClaudeConfig({
              apiKey: process.env.CLAUDE_API_KEY || '',
              model: process.env.CLAUDE_MODEL || ''
            });
            
            setOllamaConfig({
              endpoint: process.env.OLLAMA_ENDPOINT || '',
              model: process.env.OLLAMA_MODEL || ''
            });
          }
        }
      } catch (err) {
        setError('Failed to load configuration');
        console.error('Error loading configuration:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfiguration();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Prepare configuration data
      const configData = {
        deepSeek: deepSeekConfig,
        openAI: openAIConfig,
        qwen: qwenConfig,
        claude: claudeConfig,
        ollama: ollamaConfig
      };
      
      // Check if we're running in Electron
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        // Save configuration to Electron main process
        const result = await (window as any).electronAPI.saveConfiguration(configData);
        if (result.success) {
          setSuccess('Configuration saved successfully!');
          // Reload the page to refresh the AI provider detection
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setError(`Failed to save configuration: ${result.error}`);
        }
      } else {
        // Web mode: Save to localStorage
        try {
          localStorage.setItem('ai-provider-config', JSON.stringify(configData));
          setSuccess('Configuration saved successfully!');
          // Reload the page to refresh the AI provider detection
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (storageError) {
          setError('Failed to save configuration to localStorage');
          console.error('Error saving to localStorage:', storageError);
        }
      }
    } catch (err) {
      setError('Failed to save configuration');
      console.error('Error saving configuration:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Title>{t('settings.title')}</Title>
            <LanguageThemeControls />
          </Group>
          
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Center style={{ minHeight: '300px' }}>
              <Stack align="center" gap="md">
                <Loader />
                <Text>{t('common.loading')}</Text>
              </Stack>
            </Center>
          </Card>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Button 
            variant="subtle"
            onClick={() => window.location.href = '/'}
            size="md"
          >
            ← {t('common.home')}
          </Button>
          <Title>{t('settings.title')}</Title>
          <LanguageThemeControls />
        </Group>
        
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xl">
            <Text size="sm" c="dimmed">
              {t('settings.description')}
            </Text>
            
            {error && (
              <Alert color="red" title={t('common.error')}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert color="green" title={t('common.success')}>
                {success}
              </Alert>
            )}
            
            {/* DeepSeek Configuration */}
            <Box>
              <Title order={3} mb="md">DeepSeek</Title>
              <Stack gap="sm">
                <PasswordInput
                  label={t('settings.deepseek.apiKey')}
                  placeholder={t('settings.deepseek.apiKeyPlaceholder')}
                  value={deepSeekConfig.apiKey}
                  onChange={(e) => setDeepSeekConfig({...deepSeekConfig, apiKey: e.target.value})}
                />
                <TextInput
                  label={t('settings.deepseek.model')}
                  placeholder={t('settings.deepseek.modelPlaceholder')}
                  value={deepSeekConfig.model}
                  onChange={(e) => setDeepSeekConfig({...deepSeekConfig, model: e.target.value})}
                />
                <TextInput
                  label={t('settings.deepseek.timeout')}
                  placeholder={t('settings.deepseek.timeoutPlaceholder')}
                  value={deepSeekConfig.timeout}
                  onChange={(e) => setDeepSeekConfig({...deepSeekConfig, timeout: e.target.value})}
                  type="number"
                />
                <TextInput
                  label={t('settings.deepseek.maxTokens')}
                  placeholder={t('settings.deepseek.maxTokensPlaceholder')}
                  value={deepSeekConfig.maxTokens}
                  onChange={(e) => setDeepSeekConfig({...deepSeekConfig, maxTokens: e.target.value})}
                  type="number"
                />
              </Stack>
            </Box>
            
            <Divider />
            
            {/* OpenAI Configuration */}
            <Box>
              <Title order={3} mb="md">OpenAI</Title>
              <Stack gap="sm">
                <PasswordInput
                  label={t('settings.openai.apiKey')}
                  placeholder={t('settings.openai.apiKeyPlaceholder')}
                  value={openAIConfig.apiKey}
                  onChange={(e) => setOpenAIConfig({...openAIConfig, apiKey: e.target.value})}
                />
                <TextInput
                  label={t('settings.openai.model')}
                  placeholder={t('settings.openai.modelPlaceholder')}
                  value={openAIConfig.model}
                  onChange={(e) => setOpenAIConfig({...openAIConfig, model: e.target.value})}
                />
              </Stack>
            </Box>
            
            <Divider />
            
            {/* Qwen Configuration */}
            <Box>
              <Title order={3} mb="md">Qwen (通义千问)</Title>
              <Stack gap="sm">
                <PasswordInput
                  label={t('settings.qwen.apiKey')}
                  placeholder={t('settings.qwen.apiKeyPlaceholder')}
                  value={qwenConfig.apiKey}
                  onChange={(e) => setQwenConfig({...qwenConfig, apiKey: e.target.value})}
                />
                <TextInput
                  label={t('settings.qwen.model')}
                  placeholder={t('settings.qwen.modelPlaceholder')}
                  value={qwenConfig.model}
                  onChange={(e) => setQwenConfig({...qwenConfig, model: e.target.value})}
                />
              </Stack>
            </Box>
            
            <Divider />
            
            {/* Claude Configuration */}
            <Box>
              <Title order={3} mb="md">Claude</Title>
              <Stack gap="sm">
                <PasswordInput
                  label={t('settings.claude.apiKey')}
                  placeholder={t('settings.claude.apiKeyPlaceholder')}
                  value={claudeConfig.apiKey}
                  onChange={(e) => setClaudeConfig({...claudeConfig, apiKey: e.target.value})}
                />
                <TextInput
                  label={t('settings.claude.model')}
                  placeholder={t('settings.claude.modelPlaceholder')}
                  value={claudeConfig.model}
                  onChange={(e) => setClaudeConfig({...claudeConfig, model: e.target.value})}
                />
              </Stack>
            </Box>
            
            <Divider />
            
            {/* Ollama Configuration */}
            <Box>
              <Title order={3} mb="md">Ollama (Local)</Title>
              <Stack gap="sm">
                <TextInput
                  label={t('settings.ollama.endpoint')}
                  placeholder={t('settings.ollama.endpointPlaceholder')}
                  value={ollamaConfig.endpoint}
                  onChange={(e) => setOllamaConfig({...ollamaConfig, endpoint: e.target.value})}
                />
                <TextInput
                  label={t('settings.ollama.model')}
                  placeholder={t('settings.ollama.modelPlaceholder')}
                  value={ollamaConfig.model}
                  onChange={(e) => setOllamaConfig({...ollamaConfig, model: e.target.value})}
                />
              </Stack>
            </Box>
            
            <Group justify="flex-end">
              <Button 
                onClick={handleSave} 
                loading={saving}
                size="md"
              >
                {saving ? t('settings.saving') : t('settings.save')}
              </Button>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}