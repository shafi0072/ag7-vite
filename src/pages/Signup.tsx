import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";

export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("auth.signup.passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("auth.signup.passwordTooShort"));
      return;
    }

    setLoading(true);

    try {
      await api.auth.signup(email, password);
      const data = await api.auth.login(email, password);
      localStorage.setItem("ag7_token", data.session.access_token);
      navigate("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-card p-8 shadow-[0_0_0_1px_#1f1f1f]">
      <div className="text-center mb-8">
        <img src="/logo.svg" alt="AG7" width={60} height={24} className="mx-auto mb-2" />
        <p className="text-text-secondary text-sm">{t("auth.signup.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-btn px-4 py-2 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="text-text-secondary text-xs block mb-1.5">
            {t("auth.signup.email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full bg-bg border border-border rounded-btn py-2.5 px-3 text-sm text-white placeholder:text-text-secondary focus:outline-none focus:border-accent/50 transition-colors duration-200"
          />
        </div>

        <div>
          <label className="text-text-secondary text-xs block mb-1.5">
            {t("auth.signup.password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full bg-bg border border-border rounded-btn py-2.5 px-3 text-sm text-white placeholder:text-text-secondary focus:outline-none focus:border-accent/50 transition-colors duration-200"
          />
        </div>

        <div>
          <label className="text-text-secondary text-xs block mb-1.5">
            {t("auth.signup.confirmPassword")}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full bg-bg border border-border rounded-btn py-2.5 px-3 text-sm text-white placeholder:text-text-secondary focus:outline-none focus:border-accent/50 transition-colors duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent rounded-btn py-2.5 text-white text-sm font-medium hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("auth.signup.submitting") : t("auth.signup.submit")}
        </button>
      </form>

      <p className="text-center text-text-secondary text-sm mt-6">
        {t("auth.signup.hasAccount")}{" "}
        <Link
          to="/login"
          className="text-accent hover:text-accent/80 transition-colors duration-200"
        >
          {t("auth.signup.signIn")}
        </Link>
      </p>
    </div>
  );
}
