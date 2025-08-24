import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, createTheme, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import '../styles/globals.css';
import { I18nProvider, useI18n } from '../src/contexts/I18nContext';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';

// 创建主题配置
const lightTheme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
});

const darkTheme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262b',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
});

function AppContent({ Component, pageProps }: AppProps) {
  const { colorScheme } = useTheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const forceScheme = (colorScheme === 'dark' || colorScheme === 'light') ? colorScheme : 'light';

  return (
    <MantineProvider theme={theme} defaultColorScheme={forceScheme} forceColorScheme={forceScheme}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}

function AppHead() {
  const { t } = useI18n();
  const title = t('header.title');
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <ColorSchemeScript />
    </Head>
  );
}

export default function App(props: AppProps) {
  return (
    <>
      <I18nProvider>
        <AppHead />
        <ThemeProvider>
          <AppContent {...props} />
        </ThemeProvider>
      </I18nProvider>
    </>
  );
}