

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
function SettingsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        <path d="M3.08206 13.9467C2.55306 12.9967 2.28906 12.5207 2.28906 12.0017C2.28906 11.4827 2.55306 11.0077 3.08206 10.0577L4.43006 7.63172L5.85606 5.25072C6.41506 4.31772 6.69406 3.85072 7.14306 3.59072C7.59306 3.33172 8.13606 3.32372 9.22306 3.30572L12.0001 3.26172L14.7751 3.30572C15.8631 3.32372 16.4061 3.33172 16.8551 3.59172C17.3041 3.85172 17.5851 4.31772 18.1431 5.25072L19.5701 7.63172L20.9201 10.0577C21.4481 11.0077 21.7121 11.4827 21.7121 12.0017C21.7121 12.5207 21.4481 12.9957 20.9191 13.9457L19.5701 16.3717L18.1441 18.7527C17.5851 19.6857 17.3061 20.1527 16.8571 20.4127C16.4071 20.6717 15.8641 20.6797 14.7771 20.6977L12.0001 20.7417L9.22506 20.6977C8.13706 20.6797 7.59406 20.6717 7.14506 20.4117C6.69606 20.1517 6.41506 19.6857 5.85706 18.7527L4.43006 16.3717L3.08206 13.9467Z" stroke="white" strokeWidth="1.5"/>
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="1.5"/>
      </g>
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        <path d="M13 12.0017H22M22 12.0017L18.667 8.00168M22 12.0017L18.667 16.0017M14 7.00168V5.17568C14 4.89906 13.9426 4.62544 13.8314 4.37213C13.7203 4.11882 13.5578 3.89132 13.3542 3.70401C13.1507 3.51671 12.9104 3.37367 12.6488 3.28393C12.3871 3.1942 12.1097 3.15972 11.834 3.18268L3.834 3.84868C3.33405 3.89032 2.86801 4.11833 2.5283 4.48749C2.18859 4.85665 2.00002 5.34 2 5.84168V18.1617C2.00002 18.6634 2.18859 19.1467 2.5283 19.5159C2.86801 19.885 3.33405 20.113 3.834 20.1547L11.834 20.8217C12.1098 20.8446 12.3873 20.8101 12.649 20.7204C12.9107 20.6306 13.151 20.4874 13.3546 20.3C13.5582 20.1126 13.7206 19.885 13.8317 19.6315C13.9428 19.3781 14.0001 19.1044 14 18.8277V17.0017" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.75 10.954C0.75 8.665 0.75 7.521 1.27 6.573C1.788 5.624 2.737 5.036 4.634 3.858L6.634 2.617C8.639 1.372 9.642 0.75 10.75 0.75C11.858 0.75 12.86 1.372 14.866 2.617L16.866 3.858C18.763 5.036 19.712 5.624 20.231 6.573C20.75 7.522 20.75 8.665 20.75 10.953V12.475C20.75 16.375 20.75 18.326 19.578 19.538C18.406 20.75 16.521 20.75 12.75 20.75H8.75C4.979 20.75 3.093 20.75 1.922 19.538C0.751 18.326 0.75 16.376 0.75 12.475V10.954Z" stroke="white" strokeWidth="1.5"/>
      <path d="M10.75 13.75V16.75" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        <path d="M8 10H16M8 14H12M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 13.821 2.487 15.53 3.338 17L2.5 21.5L7 20.662C8.51963 21.5408 10.2445 22.0024 12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        <path d="M2 12C2 7.286 2 4.929 3.464 3.464C4.93 2 7.286 2 12 2C16.714 2 19.071 2 20.535 3.464C22 4.93 22 7.286 22 12C22 16.714 22 19.071 20.535 20.535C19.072 22 16.714 22 12 22C7.286 22 4.929 22 3.464 20.535C2 19.072 2 16.714 2 12Z" stroke="white" strokeWidth="1.5"/>
        <path d="M6 15.8L7.143 17L10 14M6 8.8L7.143 10L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 9H18M13 16H18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M5.749 0C5.94791 0 6.13868 0.0790177 6.27933 0.21967C6.41998 0.360322 6.499 0.551088 6.499 0.75V1.513C7.161 1.5 7.89 1.5 8.692 1.5H12.805C13.608 1.5 14.337 1.5 14.999 1.513V0.75C14.999 0.551088 15.078 0.360322 15.2187 0.21967C15.3593 0.0790177 15.5501 0 15.749 0C15.9479 0 16.1387 0.0790177 16.2793 0.21967C16.42 0.360322 16.499 0.551088 16.499 0.75V1.577C16.759 1.597 17.0053 1.62233 17.238 1.653C18.41 1.811 19.359 2.143 20.108 2.891C20.856 3.64 21.188 4.589 21.346 5.761C21.499 6.901 21.499 8.356 21.499 10.194V12.306C21.499 14.144 21.499 15.6 21.346 16.739C21.188 17.911 20.856 18.86 20.108 19.609C19.359 20.357 18.41 20.689 17.238 20.847C16.098 21 14.643 21 12.805 21H8.694C6.856 21 5.4 21 4.261 20.847C3.089 20.689 2.14 20.357 1.391 19.609C0.643 18.86 0.311 17.911 0.153 16.739C0 15.599 0 14.144 0 12.306V10.194C0 8.356 0 6.9 0.153 5.761C0.311 4.589 0.643 3.64 1.391 2.891C2.14 2.143 3.089 1.811 4.261 1.653C4.49433 1.62233 4.74067 1.597 5 1.577V0.75C5 0.551261 5.07888 0.360647 5.21932 0.220023C5.35975 0.0793996 5.55026 0.000264986 5.749 0ZM4.459 3.14C3.454 3.275 2.874 3.529 2.451 3.952C2.028 4.375 1.774 4.955 1.639 5.96C1.61633 6.13 1.597 6.30967 1.581 6.499H19.917C19.901 6.30967 19.8817 6.12967 19.859 5.959C19.724 4.954 19.47 4.374 19.047 3.951C18.624 3.528 18.044 3.274 17.038 3.139C16.011 3.001 14.656 2.999 12.749 2.999H8.749C6.842 2.999 5.488 3.002 4.459 3.14ZM1.499 10.25C1.499 9.396 1.499 8.653 1.512 8H19.986C19.999 8.653 19.999 9.396 19.999 10.25V12.25C19.999 14.157 19.997 15.512 19.859 16.54C19.724 17.545 19.47 18.125 19.047 18.548C18.624 18.971 18.044 19.225 17.038 19.36C16.011 19.498 14.656 19.5 12.749 19.5H8.749C6.842 19.5 5.488 19.498 4.459 19.36C3.454 19.225 2.874 18.971 2.451 18.548C2.028 18.125 1.774 17.545 1.639 16.539C1.501 15.512 1.499 14.157 1.499 12.25V10.25Z" fill="white"/>
    </svg>
  );
}


function ActivityIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        <path d="M2 12H6L9 4L15 20L18 12H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const topNavItems = [
    { icon: HomeIcon, href: "/", label: t("nav.home") },
    { icon: ChatIcon, href: "/chat", label: t("nav.chat") },
    { icon: TasksIcon, href: "/tasks", label: t("nav.tasks") },
    { icon: CalendarIcon, href: "/calendar", label: t("nav.calendar") },
    { icon: ActivityIcon, href: "/activity", label: t("nav.activity", "Activity") },
  ];

  const bottomNavItems = [
    { icon: SettingsIcon, href: "/settings", label: t("nav.settings") },
  ];

  function handleLogout() {
    localStorage.removeItem("ag7_token");
    navigate("/login");
  }

  return (
    <aside className="flex flex-col justify-between py-4 pl-3 flex-shrink-0 overflow-hidden">
      {/* Top floating group */}
      <div className="bg-[#FFFFFF1A] border border-border rounded-[35px] flex flex-col items-center py-3 px-2 gap-1 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        {topNavItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`w-10 h-10 rounded-[24px] flex items-center justify-center  transition-all duration-200 ${
                isActive
                  ? "bg-accent text-white shadow-[0_0_15px_rgba(232,97,42,0.3)]"
                  : "text-text-secondary hover:text-white hover:bg-surface-hover"
              }`}
              title={item.label}
            >
              <item.icon />
            </Link>
          );
        })}
      </div>

      {/* Bottom floating group */}
      <div className="bg-[#FFFFFF1A] border border-border rounded-full flex flex-col items-center py-3 px-2 gap-1 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        {bottomNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`w-10 h-10 rounded-[24px] flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? "bg-accent text-white shadow-[0_0_15px_rgba(232,97,42,0.3)]"
                  : "text-text-secondary hover:text-white hover:bg-surface-hover"
              }`}
              title={item.label}
            >
              <item.icon />
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 text-text-secondary hover:text-red-400 hover:bg-red-500/10"
          title={t("nav.logout")}
        >
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}
