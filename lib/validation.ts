import { StudentFormData } from "@/types/student";

export type FormErrors = Partial<Record<keyof StudentFormData, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const PINCODE_REGEX = /^\d{6}$/;

function calculateAge(dobString: string): number {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Validates the registration form on the client, BEFORE calling the API.
 * These rules mirror the backend's Pydantic validation exactly, so the
 * user gets instant feedback - but the backend re-checks everything
 * independently and is the final authority.
 */
export function validateStudentForm(data: StudentFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.first_name.trim() || data.first_name.trim().length < 2) {
    errors.first_name = "First name is required (minimum 2 characters).";
  }

  if (!data.last_name.trim() || data.last_name.trim().length < 2) {
    errors.last_name = "Last name is required (minimum 2 characters).";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.mobile.trim()) {
    errors.mobile = "Mobile number is required.";
  } else if (!MOBILE_REGEX.test(data.mobile.trim())) {
    errors.mobile = "Enter a valid 10-digit Indian mobile number (must start with 6-9).";
  }

  if (!data.date_of_birth) {
    errors.date_of_birth = "Date of birth is required.";
  } else if (new Date(data.date_of_birth) > new Date()) {
    errors.date_of_birth = "Date of birth cannot be in the future.";
  } else if (calculateAge(data.date_of_birth) < 5) {
    errors.date_of_birth = "Student must be at least 5 years old.";
  }

  if (!data.gender) {
    errors.gender = "Please select a gender.";
  }

  if (!data.course) {
    errors.course = "Please select a course.";
  }

  if (!data.address.trim() || data.address.trim().length < 10) {
    errors.address = "Address is required (minimum 10 characters).";
  }

  if (!data.city.trim() || data.city.trim().length < 2) {
    errors.city = "City is required (minimum 2 characters).";
  }

  if (!data.state.trim() || data.state.trim().length < 2) {
    errors.state = "State is required.";
  }

  if (!data.pincode.trim()) {
    errors.pincode = "Pincode is required.";
  } else if (!PINCODE_REGEX.test(data.pincode.trim())) {
    errors.pincode = "Pincode must be exactly 6 digits.";
  }

  return errors;
}
