import { useState } from "react";
import { ArrowRight, UserPlus } from "lucide-react";
import InputComponent from "../../../ui/InputComponent";
import ButtonComponent from "../../../ui/ButtonComponent";
import SnackBar from "../../../ui/SnackBar";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layout/AuthLayout";

import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
} from "../../../../utils/Validation";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success", title: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const showToast = (message, severity = "success", title = "") =>
    setToast({ open: true, message, severity, title });

  const closeToast = () => setToast((p) => ({ ...p, open: false }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      showToast(
        "Please fill in all required fields.",
        "warning",
        "Missing details"
      );
      return;
    }

    if (form.name.trim().length < 2) {
      showToast("Please enter a valid name.", "error");
      return;
    }

    const emailError = validateEmail(form.email);

    if (emailError) {
      showToast(emailError, "error");
      return;
    }

    const phoneError = validatePhone(form.phone);

    if (phoneError) {
      showToast(phoneError, "error");
      return;
    }

    const passwordError = validatePassword(form.password);

    if (passwordError) {
      showToast(passwordError, "error");
      return;
    }

    const confirmPasswordError = validateConfirmPassword(form.password, form.confirmPassword);

    if (confirmPasswordError) {
      showToast(confirmPasswordError, "error");
      return;
    }

    const users = JSON.parse(sessionStorage.getItem("users")) || [];

const emailExists = users.some(
  (user) => user.email === form.email
);

if (emailExists) {
  showToast("Email already registered.", "error");
  return;
}

users.push({
  name: form.name,
  email: form.email,
  phone: form.phone,
  password: form.password,
});

sessionStorage.setItem("users", JSON.stringify(users));

    setLoading(true);

   setTimeout(() => {
  setLoading(false);

  const user = {
    name: form.name,
    email: form.email,
    phone: form.phone,
    password: form.password,
  };

  sessionStorage.setItem("user", JSON.stringify(user));

  showToast(
    "Account created successfully!",
    "success",
    "Welcome"
  );

  navigate("/login");
}, 1500);
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--whiold-primary-soft)]">
          <UserPlus size={30} className="text-[var(--whiold-primary)]" />
        </div>

        <h2 className="text-3xl font-bold text-[var(--whiold-text-heading)]">
          <span className="text-[var(--whiold-primary)] text-4xl">Create</span> an Account
        </h2>

        <p className="mt-1.5 text-[14.5px] text-[var(--whiold-text-body)]">
          Sign up to get started with your account.
        </p>
      </div>

      <div className="rounded-[28px] border border-[var(--whiold-border)] bg-white/90 p-7 shadow-[var(--whiold-shadow-card)] backdrop-blur-sm sm:p-9 w-full">

        {/* Name */}
        <div className="mt-3.5">
          <InputComponent
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={update("name")}
          />
        </div>

        {/* Email */}
        <div className="mt-3.5">
          <InputComponent
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={update("email")}
          />
        </div>

        {/* Phone */}
        <div className="mt-3.5">
          <InputComponent
            type="tel"
            placeholder="Mobile number"
            value={form.phone}
            onChange={update("phone")}
          />
        </div>
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Password */}
        <div className="mt-3.5">
          <InputComponent
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={update("password")}
          />
        </div>

        {/* Confirm Password */}
        <div className="mt-3.5">
          <InputComponent
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
          />
        </div>
        </div>

        {/* Button */}
        <div className="mt-6">
          <ButtonComponent
            fullWidth
            size="large"
            loading={loading}
            onClick={handleSubmit}
            endIcon={<ArrowRight size={17} />}
          >
            Create Account
          </ButtonComponent>
        </div>

        <p className="mt-5 text-center text-[13.5px] text-[var(--whiold-text-muted)]">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer font-semibold text-[var(--whiold-primary)]"
          >
            Log In
          </span>
        </p>
      </div>

      <p className="mt-5 text-center text-[12px] leading-relaxed text-[var(--whiold-text-muted)]">
        By signing up, you agree to our{" "}
        <span className="cursor-pointer text-[var(--whiold-text-body)] underline">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="cursor-pointer text-[var(--whiold-text-body)] underline">
          Privacy Policy
        </span>.
      </p>

      <SnackBar
        open={toast.open}
        onClose={closeToast}
        message={toast.message}
        title={toast.title}
        severity={toast.severity}
      />
    </AuthLayout>
  );
};

export default Register;