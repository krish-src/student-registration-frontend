import { FormEvent, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Nav from "@/components/Nav";
import { ApiError, loginAdmin } from "@/lib/api";

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await loginAdmin(username, password);
            const redirectTo = (router.query.redirect as string) || "/students";
            router.push(redirectTo);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>Admin Login</title>
            </Head>
            <Nav />
            <main className="max-w-sm mx-auto px-4 py-16">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Admin Login</h1>
                <p className="text-slate-500 mb-6 text-sm">Log in to view the list of registered students.</p>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 border border-red-300 px-4 py-3 text-red-800 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Logging in..." : "Log In"}
                    </button>
                </form>
            </main>
        </>
    );
}
