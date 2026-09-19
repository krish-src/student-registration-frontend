import { RegisterSuccessResponse, Student, StudentFormData } from "@/types/student";
import { Admin } from "@/types/auth";

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

export async function registerStudent(data: StudentFormData): Promise<RegisterSuccessResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    throw new ApiError("Could not reach the server. Please make sure the backend is running and try again.", 0);
  }

  if (response.status === 201) return response.json();

  if (response.status === 409) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.detail || "This email or mobile number is already registered.", 409);
  }

  if (response.status === 422) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError("Please fix the highlighted fields and try again.", 422, body.errors || []);
  }

  throw new ApiError("Something went wrong while registering. Please try again.", response.status);
}

/**
 * Requires the admin auth cookie - "credentials: include" tells the
 * browser to send it even though this is a cross-origin request
 * (localhost:3000 -> localhost:8000).
 */
export async function fetchStudents(): Promise<Student[]> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1/students`, {
      method: "GET",
      credentials: "include",
    });
  } catch (err) {
    throw new ApiError("Could not reach the server. Please make sure the backend is running and try again.", 0);
  }

  if (response.status === 401) {
    throw new ApiError("You must be logged in to view this page.", 401);
  }

  if (!response.ok) {
    throw new ApiError("Failed to load students from the server.", response.status);
  }

  return response.json();
}

/**
 * On success, the backend sets an httpOnly cookie via Set-Cookie - this
 * function never sees or stores the token itself.
 */
export async function loginAdmin(username: string, password: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
  } catch (err) {
    throw new ApiError("Could not reach the server. Please make sure the backend is running and try again.", 0);
  }

  if (response.status === 401) {
    throw new ApiError("Invalid username or password.", 401);
  }

  if (!response.ok) {
    throw new ApiError("Login failed. Please try again.", response.status);
  }

  const body = await response.json();
  return body.username;
}

export async function logoutAdmin(): Promise<void> {
  await fetch(`${API_URL}/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => { });
}

/**
 * The frontend cannot read the httpOnly cookie directly, so this is how
 * it finds out "am I logged in?".
 */
export async function getCurrentAdmin(): Promise<Admin | null> {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
