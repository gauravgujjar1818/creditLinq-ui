"use client"
import Image from "next/image";
import Head from 'next/head';
import Header from '../app/components/header';
import Footer from "./components/footer";
import Company_details from "./companyInfo/CompanyDetails";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <div>
    <Head>
      <title>SME Health Check</title>
    </Head>
    <Header />
    <Company_details/>
    <Footer />
  </div>
  );
}
