import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <span className="font-semibold text-slate-800">Student Registration System</span>
        <div className="flex gap-4 text-sm">
          <Link href="/student/register" className="text-blue-600 hover:underline">
            Register
          </Link>
          <Link href="/students" className="text-blue-600 hover:underline">
            Students
          </Link>
        </div>
      </div>
    </nav>
  );
}
