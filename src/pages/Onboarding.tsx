import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, ChevronLeft } from "lucide-react";
import i18n from "@/lib/i18n";
import { api } from "@/lib/api";

const LANGUAGES = [
  { code: "en",    country: "us", name: "English" },
  { code: "fr",    country: "fr", name: "French" },
  { code: "de",    country: "de", name: "German" },
  { code: "es",    country: "es", name: "Spanish" },
  { code: "it",    country: "it", name: "Italian" },
  { code: "pt",    country: "pt", name: "Portuguese" },
  { code: "pt-br", country: "br", name: "Portuguese (Brazil)" },
  { code: "ru",    country: "ru", name: "Russian" },
  { code: "zh",    country: "cn", name: "Chinese (Simplified)" },
  { code: "zh-tw", country: "tw", name: "Chinese (Traditional)" },
  { code: "ja",    country: "jp", name: "Japanese" },
  { code: "ko",    country: "kr", name: "Korean" },
  { code: "ar",    country: "sa", name: "Arabic" },
  { code: "hi",    country: "in", name: "Hindi" },
  { code: "bn",    country: "bd", name: "Bengali" },
  { code: "tr",    country: "tr", name: "Turkish" },
  { code: "nl",    country: "nl", name: "Dutch" },
  { code: "pl",    country: "pl", name: "Polish" },
  { code: "sv",    country: "se", name: "Swedish" },
  { code: "da",    country: "dk", name: "Danish" },
  { code: "fi",    country: "fi", name: "Finnish" },
  { code: "no",    country: "no", name: "Norwegian" },
  { code: "cs",    country: "cz", name: "Czech" },
  { code: "hu",    country: "hu", name: "Hungarian" },
  { code: "ro",    country: "ro", name: "Romanian" },
  { code: "uk",    country: "ua", name: "Ukrainian" },
  { code: "el",    country: "gr", name: "Greek" },
  { code: "he",    country: "il", name: "Hebrew" },
  { code: "fa",    country: "ir", name: "Persian" },
  { code: "id",    country: "id", name: "Indonesian" },
  { code: "th",    country: "th", name: "Thai" },
  { code: "vi",    country: "vn", name: "Vietnamese" },
];

const TIMEZONES = [
  { value: "Pacific/Honolulu",    label: "UTC -10:00 (Hawaii)" },
  { value: "America/Anchorage",   label: "UTC -09:00 (Alaska)" },
  { value: "America/Los_Angeles", label: "UTC -08:00 (Pacific Time)" },
  { value: "America/Denver",      label: "UTC -07:00 (Mountain Time)" },
  { value: "America/Chicago",     label: "UTC -06:00 (Central Time)" },
  { value: "America/New_York",    label: "UTC -05:00 (Eastern Time)" },
  { value: "America/Halifax",     label: "UTC -04:00 (Atlantic Time)" },
  { value: "America/Sao_Paulo",   label: "UTC -03:00 (Brasilia)" },
  { value: "Atlantic/Azores",     label: "UTC -01:00 (Azores)" },
  { value: "Europe/London",       label: "UTC +00:00 (London)" },
  { value: "Europe/Paris",        label: "UTC +01:00 (Paris)" },
  { value: "Europe/Helsinki",     label: "UTC +02:00 (Helsinki)" },
  { value: "Europe/Moscow",       label: "UTC +03:00 (Moscow)" },
  { value: "Asia/Dubai",          label: "UTC +04:00 (Dubai)" },
  { value: "Asia/Karachi",        label: "UTC +05:00 (Karachi)" },
  { value: "Asia/Dhaka",          label: "UTC +06:00 (Dhaka)" },
  { value: "Asia/Bangkok",        label: "UTC +07:00 (Bangkok)" },
  { value: "Asia/Shanghai",       label: "UTC +08:00 (Beijing)" },
  { value: "Asia/Tokyo",          label: "UTC +09:00 (Tokyo)" },
  { value: "Australia/Sydney",    label: "UTC +10:00 (Sydney)" },
  { value: "Pacific/Auckland",    label: "UTC +12:00 (Auckland)" },
];

const AGENT_SUGGESTIONS = ["Atlas", "Pete", "Cipher"];
const TOTAL_STEPS = 4;

function FlagImage({ country, name }: { country: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span style={{ width: 28, height: 20, fontSize: 18, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {country.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))}
      </span>
    );
  }
  return (
    <img
      src={`https://flagcdn.com/w40/${country}.png`}
      alt={name}
      style={{ width: 28, height: 20, borderRadius: 3, objectFit: "cover", flexShrink: 0 }}
      onError={() => setFailed(true)}
    />
  );
}

function StepBars({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            height: 4,
            width: i <= current ? 56 : 40,
            background: i <= current ? "#E97334" : "#2a2a2d",
          }}
        />
      ))}
    </div>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-white text-sm font-medium hover:opacity-70 transition-opacity duration-200"
    >
      <span
        className="flex items-center justify-center"
        style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)" }}
      >
        <ChevronLeft size={16} />
      </span>
      {label}
    </button>
  );
}

function ContinueButton({ onClick, disabled, label = "Continue" }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-white text-sm font-semibold transition-opacity duration-200"
      style={{
        height: 50,
        borderRadius: 10,
        background: "linear-gradient(180deg, #E97334 0%, #CC4130 100%)",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}

function FooterText() {
  const { t } = useTranslation();
  return (
    <p className="text-center text-xs" style={{ color: "#6b6b6b", lineHeight: 1.6 }}>
      {t("onboarding.terms")}{" "}
      <span className="underline cursor-pointer hover:text-white transition-colors">{t("onboarding.termsLink")}</span>
      {" "}{t("onboarding.and")}{" "}
      <span className="underline cursor-pointer hover:text-white transition-colors">{t("onboarding.privacyLink")}</span>.
      <br />
      {t("onboarding.setup")}
    </p>
  );
}

function StepLanguage({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="w-full" style={{ maxWidth: 440 }}>
      <h1 className="text-white text-2xl font-bold text-center mb-2">{t("onboarding.language.title")}</h1>
      <p className="text-center text-sm mb-6" style={{ color: "#6b6b6b" }}>
        {t("onboarding.language.subtitle")}
      </p>

      <div
        className="overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{
          background: "#1c1c1e",
          border: "1px solid #2a2a2d",
          borderRadius: 14,
          maxHeight: 240,
          scrollbarWidth: "none",
        }}
      >
        {LANGUAGES.map((lang, i) => {
          const isSelected = lang.code === value;
          return (
            <button
              key={lang.code}
              onClick={() => onChange(lang.code)}
              className="w-full flex items-center gap-3 px-4 transition-colors duration-150"
              style={{
                height: 48,
                background: isSelected ? "rgba(255,255,255,0.06)" : "transparent",
                borderBottom: i < LANGUAGES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
              onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <FlagImage country={lang.country} name={lang.name} />
              <span className="flex-1 text-left text-sm text-white">{lang.name}</span>
              {isSelected && <Check size={16} style={{ color: "#E97334", flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepTimezone({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="w-full" style={{ maxWidth: 400 }}>
      <h1 className="text-white text-2xl font-bold text-center mb-2">{t("onboarding.timezone.title")}</h1>
      <p className="text-center text-sm mb-6" style={{ color: "#6b6b6b" }}>
        {t("onboarding.timezone.subtitle")}
      </p>

      <div
        className="overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{
          background: "#1c1c1e",
          border: "1px solid #2a2a2d",
          borderRadius: 14,
          maxHeight: 280,
          scrollbarWidth: "none",
        }}
      >
        {TIMEZONES.map((tz, i) => {
          const isSelected = tz.value === value;
          return (
            <button
              key={tz.value}
              onClick={() => onChange(tz.value)}
              className="w-full flex items-center justify-between px-4 transition-colors duration-150"
              style={{
                height: 48,
                background: isSelected ? "rgba(255,255,255,0.06)" : "transparent",
                borderBottom: i < TIMEZONES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
              onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <span className="text-sm text-white text-left">{tz.label}</span>
              {isSelected && <Check size={16} style={{ color: "#E97334", flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepName({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="w-full" style={{ maxWidth: 400 }}>
      <h1 className="text-white text-2xl font-bold text-center mb-2">{t("onboarding.name.title")}</h1>
      <p className="text-center text-sm mb-6" style={{ color: "#6b6b6b" }}>
        {t("onboarding.name.subtitle")}
      </p>

      <div
        style={{
          background: "#1c1c1e",
          border: "1px solid #2a2a2d",
          borderRadius: 14,
          padding: "20px 20px",
        }}
      >
        <p className="text-white text-sm font-semibold mb-3">{t("onboarding.name.label")}</p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("onboarding.name.placeholder")}
          autoFocus
          className="w-full text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none transition-colors duration-200"
          style={{
            background: "#2a2a2d",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            height: 44,
            padding: "0 14px",
          }}
        />
        <p className="text-xs mt-3" style={{ color: "#6b6b6b" }}>
          {t("onboarding.name.hint")}
        </p>
      </div>
    </div>
  );
}

function StepAgent({ name, onName }: { name: string; onName: (v: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="w-full" style={{ maxWidth: 400 }}>
      <h1 className="text-white text-2xl font-bold text-center mb-2">{t("onboarding.agent.title")}</h1>
      <p className="text-center text-sm mb-6" style={{ color: "#6b6b6b" }}>
        {t("onboarding.agent.subtitle")}
      </p>

      <div
        style={{
          background: "#1c1c1e",
          border: "1px solid #2a2a2d",
          borderRadius: 14,
          padding: "20px 20px",
        }}
      >
        <p className="text-white text-sm font-semibold mb-3">{t("onboarding.agent.label")}</p>
        <input
          type="text"
          value={name}
          onChange={(e) => onName(e.target.value)}
          placeholder={t("onboarding.agent.placeholder")}
          autoFocus
          className="w-full text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none transition-colors duration-200"
          style={{
            background: "#2a2a2d",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            height: 44,
            padding: "0 14px",
          }}
        />

        <div className="flex items-center gap-2 mt-3">
          {AGENT_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onName(s)}
              className="text-sm text-white transition-colors duration-150 hover:opacity-80"
              style={{
                flex: 1,
                height: 36,
                borderRadius: 8,
                background: name === s ? "rgba(233,115,52,0.2)" : "rgba(255,255,255,0.06)",
                border: name === s ? "1px solid rgba(233,115,52,0.5)" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [fullName, setFullName] = useState("");
  const [agentName, setAgentName] = useState("");

  const canContinue = [
    true,
    !!timezone,
    fullName.trim().length > 0,
    agentName.trim().length > 0,
  ][step];

  function handleLanguageChange(code: string) {
    setLanguage(code);
    i18n.changeLanguage(code);
  }

  async function handleContinue() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      localStorage.setItem("ag7_language", language);

      try {
        await api.user.updateProfile({ name: fullName });
      } catch {
        // Proceed even if profile update fails
      }

      navigate("/");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full flex flex-col" style={{ maxWidth: step === 0 ? 440 : 400 }}>
          {step > 0 && (
            <div className="mb-4">
              <BackButton onClick={() => setStep((s) => s - 1)} label={t("onboarding.back")} />
            </div>
          )}

          <div className="w-full flex flex-col items-center">
            {step === 0 && <StepLanguage value={language} onChange={handleLanguageChange} />}
            {step === 1 && <StepTimezone value={timezone} onChange={setTimezone} />}
            {step === 2 && <StepName value={fullName} onChange={setFullName} />}
            {step === 3 && <StepAgent name={agentName} onName={setAgentName} />}
          </div>

          <div className="w-full mt-6 flex flex-col items-center gap-3">
            <ContinueButton
              onClick={handleContinue}
              disabled={!canContinue}
              label={step === TOTAL_STEPS - 1 ? t("onboarding.getStarted") : t("onboarding.continue")}
            />
            <FooterText />
          </div>
        </div>
      </div>

      <div className="pb-28">
        <StepBars current={step} />
      </div>
    </div>
  );
}
