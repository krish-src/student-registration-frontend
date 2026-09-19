import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Nav from "@/components/Nav";
import { ApiError, fetchStudents } from "@/lib/api";
import { Student } from "@/types/student";

type LoadState = "loading" | "success" | "error";

export default function StudentsList() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState("loading");
      try {
        const data = await fetchStudents();
        if (!cancelled) {
          setStudents(data);
          setState("success");
        }
      } catch (err) {
        if (cancelled) return;

        if (err instanceof ApiError && err.status === 401) {
          router.push("/login?redirect=/students");
          return;
        }

        setErrorMessage(err instanceof ApiError ? err.message : "Failed to load students.");
        setState("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>Registered Students</title>
      </Head>
      <Nav />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Registered Students</h1>

        {state === "loading" && <p className="text-slate-500">Loading students...</p>}

        {state === "error" && (
          <div className="rounded-md bg-red-50 border border-red-300 px-4 py-3 text-red-800 text-sm">
            {errorMessage}
          </div>
        )}

        {state === "success" && students.length === 0 && (
          <div className="rounded-md bg-slate-50 border border-slate-200 px-4 py-8 text-center text-slate-500">
            No students registered yet.
          </div>
        )}

        {state === "success" && students.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Mobile</th>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">City</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3">{s.id}</td>
                    <td className="px-4 py-3">{s.first_name} {s.last_name}</td>
                    <td className="px-4 py-3">{s.email}</td>
                    <td className="px-4 py-3">{s.mobile}</td>
                    <td className="px-4 py-3">{s.course}</td>
                    <td className="px-4 py-3">{s.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
