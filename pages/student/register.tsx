import { FormEvent, useState } from "react";
import Head from "next/head";
import Nav from "@/components/Nav";
import { ApiError, registerStudent } from "@/lib/api";
import { FormErrors, validateStudentForm } from "@/lib/validation";
import { StudentFormData } from "@/types/student";

const EMPTY_FORM: StudentFormData = {
  first_name: "",
  last_name: "",
  email: "",
  mobile: "",
  date_of_birth: "",
  gender: "",
  course: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

type SubmitState = "idle" | "loading" | "success" | "error";

export default function RegisterStudent() {
  const [form, setForm] = useState<StudentFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitState>("idle");
  const [apiErrorMessage, setApiErrorMessage] = useState<string>("");
  const [studentId, setStudentId] = useState<number | null>(null);

  function updateField<K extends keyof StudentFormData>(field: K, value: StudentFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiErrorMessage("");
    setStudentId(null);

    // 1. Frontend validation runs first.
    const validationErrors = validateStudentForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setStatus("idle");
      return;
    }

    // 2. Call the backend API.
    setStatus("loading");
    try {
      const result = await registerStudent(form);
      setStatus("success");
      setStudentId(result.student_id);
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError) {
        setApiErrorMessage(err.message);
        if (err.fieldErrors && err.fieldErrors.length > 0) {
          const mapped: FormErrors = {};
          for (const fe of err.fieldErrors) {
            mapped[fe.field as keyof StudentFormData] = fe.message;
          }
          setErrors(mapped);
        }
      } else {
        setApiErrorMessage("Something went wrong. Please try again.");
      }
    }
  }

  const isLoading = status === "loading";

  return (
    <>
      <Head>
        <title>Register Student</title>
      </Head>
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Student Registration</h1>
        <p className="text-slate-500 mb-6 text-sm">
          Fields marked <span className="text-red-500">*</span> are required.
        </p>

        {status === "success" && studentId !== null && (
          <div className="mb-6 rounded-md bg-green-50 border border-green-300 px-4 py-3 text-green-800">
            <p className="font-medium">Student registered successfully!</p>
            <p className="text-sm">
              Registration ID: <span className="font-mono font-semibold">{studentId}</span>
            </p>
          </div>
        )}

        {status === "error" && apiErrorMessage && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-300 px-4 py-3 text-red-800 text-sm">
            {apiErrorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="First Name" required error={errors.first_name}>
              <input
                type="text"
                className={inputClass(!!errors.first_name)}
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
              />
            </Field>

            <Field label="Last Name" required error={errors.last_name}>
              <input
                type="text"
                className={inputClass(!!errors.last_name)}
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Email" required error={errors.email}>
            <input
              type="email"
              className={inputClass(!!errors.email)}
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Mobile Number" required error={errors.mobile}>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                className={inputClass(!!errors.mobile)}
                value={form.mobile}
                onChange={(e) => updateField("mobile", e.target.value)}
              />
            </Field>

            <Field label="Date of Birth" required error={errors.date_of_birth}>
              <input
                type="date"
                className={inputClass(!!errors.date_of_birth)}
                value={form.date_of_birth}
                onChange={(e) => updateField("date_of_birth", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Gender" required error={errors.gender}>
              <select
                className={inputClass(!!errors.gender)}
                value={form.gender}
                onChange={(e) => updateField("gender", e.target.value as StudentFormData["gender"])}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field label="Course" required error={errors.course}>
              <select
                className={inputClass(!!errors.course)}
                value={form.course}
                onChange={(e) => updateField("course", e.target.value as StudentFormData["course"])}
              >
                <option value="">Select course</option>
                <option value="BCA">BCA</option>
                <option value="BSc">BSc</option>
                <option value="BCom">BCom</option>
                <option value="MCA">MCA</option>
                <option value="MBA">MBA</option>
              </select>
            </Field>
          </div>

          <Field label="Address" required error={errors.address}>
            <textarea
              rows={3}
              className={inputClass(!!errors.address)}
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field label="City" required error={errors.city}>
              <input
                type="text"
                className={inputClass(!!errors.city)}
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </Field>

            <Field label="State" required error={errors.state}>
              <input
                type="text"
                className={inputClass(!!errors.state)}
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
              />
            </Field>

            <Field label="Pincode" required error={errors.pincode}>
              <input
                type="text"
                placeholder="6-digit pincode"
                className={inputClass(!!errors.pincode)}
                value={form.pincode}
                onChange={(e) => updateField("pincode", e.target.value)}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registering..." : "Register Student"}
          </button>
        </form>
      </main>
    </>
  );
}

function inputClass(hasError: boolean): string {
  return `w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 ${
    hasError ? "border-red-400" : "border-slate-300"
  }`;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
