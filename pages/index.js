import Head from 'next/head';
import Form from './Form';
import styles from '../styles/Home.module.css';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="dark:bg-black flex flex-col h-screen">
      <Head>
        <title>税务计算小工具</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="color-scheme" content="dark light" />
        <meta property="og:title" content="个税计算" />
        <meta property="og:image" content="/og-image.png" />
        <meta
          property="og:description"
          content="掌握自己每个月税后收入，做一个明白人"
        />
      </Head>

      <main className="py-4 flex items-center justify-center flex-1">
        <Form />
      </main>

      <footer className="flex items-center justify-center w-full h-20 border-t border-gray-100 dark:border-gray-800">
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="dark:text-white flex flex-col items-center justify-center"
        >
          Powered by{' '}
          <Image height="16" width="70" src="/vercel.svg" alt="Vercel Logo" />
        </a>
      </footer>
    </div>
  );
}
