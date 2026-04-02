import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.auth.login(email, password);
      localStorage.setItem("ag7_token", data.session.access_token);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-card p-8 shadow-[0_0_0_1px_#1f1f1f]">
      <div className="text-center mb-8">
        <img src="/logo.svg" alt="AG7" width={60} height={24} className="mx-auto mb-2" />
        <p className="text-text-secondary text-sm">
          {t("auth.login.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-btn px-4 py-2 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="text-text-secondary text-xs block mb-1.5">
            {t("auth.login.email")}
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
            {t("auth.login.password")}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent rounded-btn py-2.5 text-white text-sm font-medium hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("auth.login.submitting") : t("auth.login.submit")}
        </button>
      </form>

      <p className="text-center text-text-secondary text-sm mt-6">
        {t("auth.login.noAccount")}{" "}
        <Link
          to="/signup"
          className="text-accent hover:text-accent/80 transition-colors duration-200"
        >
          {t("auth.login.signUp")}
        </Link>
      </p>
    </div>
  );
}
