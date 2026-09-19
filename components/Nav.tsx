import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCurrentAdmin, logoutAdmin } from "@/lib/api";

export default function Nav() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCurrentAdmin().then((admin) => {
      if (!cancelled) {
        setUsername(admin?.username ?? null);
        setChecked(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router.pathname]);

  async function handleLogout() {
    await logoutAdmin();
    setUsername(null);
    router.push("/login");
  }

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <span className="font-semibold text-slate-800">Student Registration System</span>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/student/register" className="text-blue-600 hover:underline">Register</Link>
          <Link href="/students" className="text-blue-600 hover:underline">Students</Link>
          {checked && username && (
            <>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">{username}</span>
              <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
            </>
          )}
          {checked && !username && (
            <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
