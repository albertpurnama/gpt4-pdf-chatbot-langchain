import { useRef, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Home() {
  const [listError, setListError] = useState('');
  const [documentList, setDocumentList] = useState<Document[]>([]);
  useEffect(() => {

  }, [])
  return (
    <>
      <Layout>
        <div className="mx-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
            Your documents
          </h1>
          <div className="p-4">
          <form
            className="flex flex-col gap-4"
            encType="multipart/form-data"
            method="post"
            // action="/api/document/upload"
            onSubmit={(e) => {
              const formData = new FormData(e.target as HTMLFormElement);
              console.log(formData.values().next());
              e.preventDefault();
            }}
          >
            <label
              htmlFor="formFileLg"
              className="mb-2 inline-block"
              >
                Upload your docs here
              </label>
            <input
              // className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
              id="formFileLg"
              name="uploadedFile"
              accept="application/pdf"
              type="file"
            />
            <input type='submit'/>
          </form>
        </div>
          <main className={styles.main}>
            <div className={styles.cloud}>
            </div>
          </main>
        </div>
        <footer className="m-auto p-4">
          <a href="https://twitter.com/mayowaoshin">
            Powered by LangChainAI. Demo built by Mayo (Twitter: @mayowaoshin).
          </a>
        </footer>
      </Layout>
    </>
  );
}
