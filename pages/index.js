import Head from 'next/head';
import Form from './Form';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className="dark:bg-black flex flex-col min-h-screen">
      <Head>
        <title>税务计算小工具</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-4 flex items-center justify-center flex-1">
        <Form />
      </main>

      <footer className="flex items-center justify-center w-full h-20 border-t border-gray-100 dark:border-gray-800">
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="dark:text-white"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
