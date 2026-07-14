import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import InputComponent from "../../../ui/InputComponent";
import ButtonComponent from "../../../ui/ButtonComponent";
import SnackBar from "../../../ui/SnackBar";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layout/AuthLayout";
import { userRoutes } from "../../../../constants/router";

import {
  validateEmail,
} from "../../../../utils/Validation";

const Login = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success", title: "" });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const showToast = (message, severity = "success", title = "") =>
    setToast({ open: true, message, severity, title });

  const closeToast = () => setToast((p) => ({ ...p, open: false }));

 const handleSubmit = () => {
  if (!form.email || !form.password) {
    showToast(
      "Please fill in all required fields.",
      "warning",
      "Missing details"
    );
    return;
  }

  const emailError = validateEmail(form.email);

  if (emailError) {
    showToast(emailError, "error");
    return;
  }

const users = JSON.parse(sessionStorage.getItem("users")) || [];

const user = users.find(
  (u) =>
    u.email === form.email &&
    u.password === form.password
);

if (!user) {
  showToast("Invalid email or password.", "error");
  return;
}

  setLoading(true);

  setTimeout(() => {
    setLoading(false);

    sessionStorage.setItem("isLoggedIn", "true");

    showToast(
      "Login successful!",
      "success",
      "Welcome Back"
    );

    navigate(userRoutes.DASHBOARD);
  }, 1500);
};

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--whiold-primary-soft)]">
          <ShieldCheck size={30} className="text-[var(--whiold-primary)]" />
        </div>

        <h2 className="text-3xl font-bold text-[var(--whiold-text-heading)]">
          <span className="text-[var(--whiold-primary)] text-4xl">Log In</span> to Your Account
        </h2>

        <p className="mt-1.5 text-[14.5px] text-[var(--whiold-text-body)]">
          Welcome back! Please sign in to continue.
        </p>
      </div>

      <div className="rounded-[28px] border border-[var(--whiold-border)] bg-white/90 p-7 shadow-[var(--whiold-shadow-card)] backdrop-blur-sm sm:p-9">

        {/* Email */}
        <div className="mt-3.5">
          <InputComponent
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={update("email")}
          />
        </div>

        {/* Password */}
        <div className="mt-3.5">
          <InputComponent
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={update("password")}
          />
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
            Log in
          </ButtonComponent>
        </div>

        <p className="mt-5 text-center text-[13.5px] text-[var(--whiold-text-muted)]">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="cursor-pointer font-semibold text-[var(--whiold-primary)]"
          >
            Create An Account!
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

export default Login;