import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PUBLIC_ROUTES = ["/login", "/signup"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ag7_token");
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!token && !isPublic) {
      navigate("/login", { replace: true });
      return;
    }

    if (token && isPublic) {
      navigate("/", { replace: true });
      return;
    }

    setChecked(true);
  }, [pathname, navigate]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
