import { Group, Button, Menu } from '@mantine/core';
import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';

export function LanguageThemeControls() {
  const { locale, switchLocale, t } = useI18n();
  const { colorScheme, toggleColorScheme } = useTheme();

  return (
    <Group gap={8}>
      {/* 语言切换 */}
      <Menu shadow="md" width={120}>
        <Menu.Target>
          <Button variant="subtle" size="sm">
            {locale === 'zh' ? '中' : 'EN'}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>{t('common.language')}</Menu.Label>
          <Menu.Item 
            onClick={() => {
              switchLocale('zh');
              // Notify Electron of language change
              if (typeof window !== 'undefined' && (window as any).electronAPI) {
                (window as any).electronAPI.setLanguage('zh');
              }
            }}
            color={locale === 'zh' ? 'blue' : undefined}
          >
            中文
          </Menu.Item>
          <Menu.Item 
            onClick={() => {
              switchLocale('en');
              // Notify Electron of language change
              if (typeof window !== 'undefined' && (window as any).electronAPI) {
                (window as any).electronAPI.setLanguage('en');
              }
            }}
            color={locale === 'en' ? 'blue' : undefined}
          >
            English
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {/* 主题切换 */}
      <Button 
        variant="subtle" 
        size="sm"
        onClick={() => {
          toggleColorScheme();
          // Notify Electron of theme change
          if (typeof window !== 'undefined' && (window as any).electronAPI) {
            (window as any).electronAPI.setTheme(colorScheme === 'dark' ? 'light' : 'dark');
          }
        }}
        title={t('common.theme')}
      >
        {colorScheme === 'dark' ? '🌞' : '🌙'}
      </Button>
    </Group>
  );
}