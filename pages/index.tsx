import Head from "next/head";
import Link from "next/link";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Head>
        <title>Student Registration System</title>
      </Head>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Student Registration System
        </h1>
        <p className="text-slate-600 mb-8">
          Register new students and view the list of registered students.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/student/register"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-blue-700"
          >
            Register a Student
          </Link>
          <Link
            href="/students"
            className="bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded-md font-medium hover:bg-slate-50"
          >
            View Students
          </Link>
        </div>
      </main>
    </>
  );
}
