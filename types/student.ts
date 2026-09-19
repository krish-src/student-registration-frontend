export type Gender = "Male" | "Female" | "Other";
export type Course = "BCA" | "BSc" | "BCom" | "MCA" | "MBA";

export interface StudentFormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  date_of_birth: string; // ISO date string, e.g. "2002-05-15"
  gender: Gender | "";
  course: Course | "";
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  date_of_birth: string;
  gender: string;
  course: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterSuccessResponse {
  success: true;
  message: string;
  student_id: number;
}

export interface ValidationErrorItem {
  field: string;
  message: string;
}

export interface RegisterValidationErrorResponse {
  success: false;
  message: string;
  errors: ValidationErrorItem[];
}

export interface ConflictErrorResponse {
  detail: string;
}
