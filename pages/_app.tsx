import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

const theme = createTheme({
  /** 主题配置 */
});

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <>
      <Head>
        <title>离线 Leet 刷题</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <MantineProvider theme={theme}>
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
