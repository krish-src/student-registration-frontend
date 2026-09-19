import { RegisterSuccessResponse, Student, StudentFormData } from "@/types/student";

// The frontend NEVER connects directly to PostgreSQL. It only ever talks
// to the FastAPI backend over HTTP, using this base URL.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  fieldErrors?: { field: string; message: string }[];

  constructor(message: string, status: number, fieldErrors?: { field: string; message: string }[]) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Calls POST /api/students on the backend.
 * Throws ApiError with a clean, user-friendly message on failure.
 */
export async function registerStudent(data: StudentFormData): Promise<RegisterSuccessResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    // Network-level failure: backend not running, wrong URL, CORS block, etc.
    throw new ApiError(
      "Could not reach the server. Please make sure the backend is running and try again.",
      0
    );
  }

  if (response.status === 201) {
    return response.json();
  }

  if (response.status === 409) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.detail || "This email or mobile number is already registered.", 409);
  }

  if (response.status === 422) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      "Please fix the highlighted fields and try again.",
      422,
      body.errors || []
    );
  }

  throw new ApiError("Something went wrong while registering. Please try again.", response.status);
}

/**
 * Calls GET /api/students on the backend.
 */
export async function fetchStudents(): Promise<Student[]> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/students`, { method: "GET" });
  } catch (err) {
    throw new ApiError(
      "Could not reach the server. Please make sure the backend is running and try again.",
      0
    );
  }

  if (!response.ok) {
    throw new ApiError("Failed to load students from the server.", response.status);
  }

  return response.json();
}
