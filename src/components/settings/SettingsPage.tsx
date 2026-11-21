

import { useState, useRef, useEffect } from "react";
import { Check, Plus, ChevronDown, User, Layers, Copy, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { api, IS_DEMO } from "@/lib/api";
import EditProfileModal from "./EditProfileModal";
import AddEmailModal from "./AddEmailModal";

const LANGUAGES = [
  { code: "en",    country: "us", name: "English" },
  { code: "en-gb", country: "gb", name: "English (UK)" },
  { code: "es",    country: "es", name: "Spanish" },
  { code: "es-mx", country: "mx", name: "Spanish (Mexico)" },
  { code: "fr",    country: "fr", name: "French" },
  { code: "de",    country: "de", name: "German" },
  { code: "it",    country: "it", name: "Italian" },
  { code: "pt",    country: "pt", name: "Portuguese" },
  { code: "pt-br", country: "br", name: "Portuguese (Brazil)" },
  { code: "ru",    country: "ru", name: "Russian" },
  { code: "zh",    country: "cn", name: "Chinese (Simplified)" },
  { code: "zh-tw", country: "tw", name: "Chinese (Traditional)" },
  { code: "ja",    country: "jp", name: "Japanese" },
  { code: "ko",    country: "kr", name: "Korean" },
  { code: "ar",    country: "sa", name: "Arabic" },
  { code: "ar-eg", country: "eg", name: "Arabic (Egypt)" },
  { code: "hi",    country: "in", name: "Hindi" },
  { code: "bn",    country: "bd", name: "Bengali" },
  { code: "tr",    country: "tr", name: "Turkish" },
  { code: "nl",    country: "nl", name: "Dutch" },
  { code: "pl",    country: "pl", name: "Polish" },
  { code: "sv",    country: "se", name: "Swedish" },
  { code: "no",    country: "no", name: "Norwegian" },
  { code: "da",    country: "dk", name: "Danish" },
  { code: "fi",    country: "fi", name: "Finnish" },
  { code: "cs",    country: "cz", name: "Czech" },
  { code: "sk",    country: "sk", name: "Slovak" },
  { code: "hu",    country: "hu", name: "Hungarian" },
  { code: "ro",    country: "ro", name: "Romanian" },
  { code: "bg",    country: "bg", name: "Bulgarian" },
  { code: "hr",    country: "hr", name: "Croatian" },
  { code: "sr",    country: "rs", name: "Serbian" },
  { code: "uk",    country: "ua", name: "Ukrainian" },
  { code: "el",    country: "gr", name: "Greek" },
  { code: "he",    country: "il", name: "Hebrew" },
  { code: "fa",    country: "ir", name: "Persian" },
  { code: "id",    country: "id", name: "Indonesian" },
  { code: "ms",    country: "my", name: "Malay" },
  { code: "th",    country: "th", name: "Thai" },
  { code: "vi",    country: "vn", name: "Vietnamese" },
  { code: "tl",    country: "ph", name: "Filipino" },
  { code: "sw",    country: "ke", name: "Swahili" },
  { code: "am",    country: "et", name: "Amharic" },
  { code: "af",    country: "za", name: "Afrikaans" },
  { code: "ca",    country: "ad", name: "Catalan" },
  { code: "eu",    country: "es", name: "Basque" },
  { code: "gl",    country: "es", name: "Galician" },
  { code: "lt",    country: "lt", name: "Lithuanian" },
  { code: "lv",    country: "lv", name: "Latvian" },
  { code: "et",    country: "ee", name: "Estonian" },
  { code: "sl",    country: "si", name: "Slovenian" },
  { code: "mk",    country: "mk", name: "Macedonian" },
  { code: "sq",    country: "al", name: "Albanian" },
  { code: "hy",    country: "am", name: "Armenian" },
  { code: "ka",    country: "ge", name: "Georgian" },
  { code: "az",    country: "az", name: "Azerbaijani" },
  { code: "kk",    country: "kz", name: "Kazakh" },
  { code: "uz",    country: "uz", name: "Uzbek" },
  { code: "tk",    country: "tm", name: "Turkmen" },
  { code: "ky",    country: "kg", name: "Kyrgyz" },
  { code: "tg",    country: "tj", name: "Tajik" },
  { code: "mn",    country: "mn", name: "Mongolian" },
  { code: "ne",    country: "np", name: "Nepali" },
  { code: "si",    country: "lk", name: "Sinhala" },
  { code: "km",    country: "kh", name: "Khmer" },
  { code: "lo",    country: "la", name: "Lao" },
  { code: "my",    country: "mm", name: "Burmese" },
  { code: "ur",    country: "pk", name: "Urdu" },
  { code: "pa",    country: "in", name: "Punjabi" },
  { code: "gu",    country: "in", name: "Gujarati" },
  { code: "mr",    country: "in", name: "Marathi" },
  { code: "ta",    country: "lk", name: "Tamil" },
  { code: "te",    country: "in", name: "Telugu" },
  { code: "kn",    country: "in", name: "Kannada" },
  { code: "ml",    country: "in", name: "Malayalam" },
  { code: "or",    country: "in", name: "Odia" },
  { code: "as",    country: "in", name: "Assamese" },
  { code: "is",    country: "is", name: "Icelandic" },
  { code: "ga",    country: "ie", name: "Irish" },
  { code: "cy",    country: "gb", name: "Welsh" },
  { code: "mt",    country: "mt", name: "Maltese" },
  { code: "lb",    country: "lu", name: "Luxembourgish" },
  { code: "bs",    country: "ba", name: "Bosnian" },
  { code: "ht",    country: "ht", name: "Haitian Creole" },
  { code: "so",    country: "so", name: "Somali" },
  { code: "yo",    country: "ng", name: "Yoruba" },
  { code: "ig",    country: "ng", name: "Igbo" },
  { code: "ha",    country: "ng", name: "Hausa" },
  { code: "zu",    country: "za", name: "Zulu" },
  { code: "xh",    country: "za", name: "Xhosa" },
  { code: "st",    country: "ls", name: "Sotho" },
  { code: "tn",    country: "bw", name: "Tswana" },
  { code: "sn",    country: "zw", name: "Shona" },
  { code: "rw",    country: "rw", name: "Kinyarwanda" },
  { code: "ny",    country: "mw", name: "Chichewa" },
  { code: "mg",    country: "mg", name: "Malagasy" },
  { code: "ln",    country: "cd", name: "Lingala" },
  { code: "lg",    country: "ug", name: "Luganda" },
  { code: "om",    country: "et", name: "Oromo" },
  { code: "ti",    country: "er", name: "Tigrinya" },
  { code: "dz",    country: "bt", name: "Dzongkha" },
  { code: "ps",    country: "af", name: "Pashto" },
  { code: "sd",    country: "pk", name: "Sindhi" },
  { code: "ug",    country: "cn", name: "Uyghur" },
  { code: "bo",    country: "cn", name: "Tibetan" },
  { code: "jv",    country: "id", name: "Javanese" },
  { code: "su",    country: "id", name: "Sundanese" },
  { code: "ceb",   country: "ph", name: "Cebuano" },
  { code: "ilo",   country: "ph", name: "Ilocano" },
  { code: "mi",    country: "nz", name: "Māori" },
  { code: "haw",   country: "us", name: "Hawaiian" },
  { code: "sm",    country: "ws", name: "Samoan" },
  { code: "to",    country: "to", name: "Tongan" },
  { code: "fj",    country: "fj", name: "Fijian" },
  { code: "qu",    country: "pe", name: "Quechua" },
  { code: "ay",    country: "bo", name: "Aymara" },
  { code: "gn",    country: "py", name: "Guaraní" },
  { code: "nah",   country: "mx", name: "Nahuatl" },
  { code: "be",    country: "by", name: "Belarusian" },
  { code: "fy",    country: "nl", name: "Frisian" },
  { code: "fo",    country: "fo", name: "Faroese" },
  { code: "kl",    country: "gl", name: "Greenlandic" },
  { code: "se",    country: "no", name: "Northern Sami" },
  { code: "yi",    country: "il", name: "Yiddish" },
  { code: "la",    country: "va", name: "Latin" },
];

function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function FlagImage({ country, name }: { country: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        className="flex items-center justify-center flex-shrink-0 text-sm"
        style={{ width: 20, height: 20 }}
      >
        {getFlagEmoji(country)}
      </span>
    );
  }
  return (
    <img
      src={`https://flagcdn.com/w40/${country}.png`}
      width={20}
      height={20}
      alt={name}
      className="object-cover flex-shrink-0"
      style={{ width: 20, height: 20 }}
      onError={() => setFailed(true)}
    />
  );
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"accounts" | "resources">("accounts");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddEmailOpen, setIsAddEmailOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [telegramMenuOpen, setTelegramMenuOpen] = useState(false);
  const [telegramBotTokenInput, setTelegramBotTokenInput] = useState("");
  const [telegramSaving, setTelegramSaving] = useState(false);
  const [telegramStatusMsg, setTelegramStatusMsg] = useState("");
  const [telegramError, setTelegramError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const langRef = useRef<HTMLDivElement>(null);

  async function fetchUserName() {
    try {
      const data = await api.user.profile() as { name?: string };
      if (data.name) setUserName(data.name);
    } catch {}
  }

  useEffect(() => {
    fetchUserName();
  }, []);

  // Check telegram connection from container status
  useEffect(() => {
    api.containers.status().then((data) => {
      if (data.container?.telegram_bot_token) {
        setTelegramConnected(true);
      }
    }).catch(() => {});
  }, []);

  function handleOpenTelegramModal() {
    setTelegramBotTokenInput("");
    setTelegramError("");
    setIsTelegramModalOpen(true);
  }

  async function handleTelegramConnect() {
    const token = telegramBotTokenInput.trim();
    if (!token) {
      setTelegramError("Please enter your bot token");
      return;
    }
    if (!/^\d+:[A-Za-z0-9_-]{30,}$/.test(token)) {
      setTelegramError("Invalid bot token format. It should look like 123456789:ABCdef...");
      return;
    }

    setTelegramSaving(true);
    setTelegramError("");
    setTelegramStatusMsg("Verifying token...");
    try {
      // Verify the token with Telegram API
      // Demo mode skips the live Telegram check (no external calls).
      const data = IS_DEMO
        ? { ok: true }
        : await (await fetch(`https://api.telegram.org/bot${token}/getMe`)).json();
      if (!data.ok) {
        setTelegramError("Invalid bot token. Please check and try again.");
        setTelegramSaving(false);
        setTelegramStatusMsg("");
        return;
      }

      // Save token to backend & restart container with it
      setTelegramStatusMsg("Configuring bot...");
      await api.containers.connectTelegram(token);
      setTelegramStatusMsg("Starting Telegram channel...");
      // Wait 30s for container to fully restart and configure Telegram channel
      await new Promise((r) => setTimeout(r, IS_DEMO ? 1500 : 30000));
      setTelegramStatusMsg("");
      setTelegramConnected(true);
      setIsTelegramModalOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save token";
      setTelegramError(msg.includes("No container") ? "Deploy your OpenClaw bot first from the dashboard." : msg);
      setTelegramStatusMsg("");
    } finally {
      setTelegramSaving(false);
    }
  }

  async function handleDisconnectTelegram() {
    try {
      await api.containers.disconnectTelegram();
    } catch {
      // ignore
    }
    setTelegramConnected(false);
  }

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  // Initialise from localStorage
  const savedCode = typeof window !== "undefined" ? (localStorage.getItem("ag7_language") || "en") : "en";
  const initialLang = LANGUAGES.find((l) => l.code === savedCode) || LANGUAGES[0];
  const [selectedLanguage, setSelectedLanguage] = useState(initialLang);

  function handleLanguageSelect(lang: typeof LANGUAGES[0]) {
    setSelectedLanguage(lang);
    setIsLangOpen(false);
    localStorage.setItem("ag7_language", lang.code);
    i18n.changeLanguage(lang.code);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      setTelegramMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 w-[795px]">
        <h1 className="text-white text-2xl font-bold">{t("settings.title")}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {t("settings.subtitle")}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center justify-center bg-surface border border-border rounded-[100px] p-2 gap-1 w-[795px] h-[64px]">
          <button
            onClick={() => setActiveTab("accounts")}
            className={`flex items-center justify-center gap-1 w-[135px] h-[48px] rounded-[35px] pt-1 pr-5 pb-1 pl-2 text-sm font-semibold transition-all duration-200 ${activeTab === "accounts"
              ? "bg-gradient-to-r from-[#e8612a] to-[#c94f1f] text-white shadow-lg"
              : "text-white/60 hover:text-white"
              }`}
          >
            <User size={16} strokeWidth={1.8} />
            {t("settings.accounts")}
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`flex items-center justify-center gap-1 w-[135px] h-[48px] rounded-[35px] pt-1 pr-5 pb-1 pl-2 text-sm font-semibold transition-all duration-200 ${activeTab === "resources"
              ? "bg-gradient-to-r from-[#e8612a] to-[#c94f1f] text-white shadow-lg"
              : "text-white/60 hover:text-white"
              }`}
          >
            <Layers size={16} strokeWidth={1.8} />
            {t("settings.resources")}
          </button>
        </div>
      </div>

      {activeTab === "accounts" ? (
        <div className="flex flex-col gap-6">
          {/* Channels */}
          <div className="bg-surface border border-border rounded-[8px] p-6 w-[795px]">
            <div className="flex items-start justify-between mb-5">
              <p className="text-white text-lg font-bold leading-snug">
                Which channel do you want to use for sending messages?
              </p>
              <button className=" bg-[#FFFFFF1A]/10 flex items-center gap-2 px-4 py-2 border border-border rounded-[35px] text-white text-sm hover:bg-surface-hover transition-colors duration-200 flex-shrink-0 ml-4">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.6665 4.66666H3.99984C3.64621 4.66666 3.30708 4.80713 3.05703 5.05718C2.80698 5.30723 2.6665 5.64637 2.6665 5.99999V12C2.6665 12.3536 2.80698 12.6927 3.05703 12.9428C3.30708 13.1928 3.64621 13.3333 3.99984 13.3333H9.99983C10.3535 13.3333 10.6926 13.1928 10.9426 12.9428C11.1927 12.6927 11.3332 12.3536 11.3332 12V11.3333" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M10.6667 3.33333L12.6667 5.33333M13.59 4.38999C13.8526 4.12743 14.0001 3.77132 14.0001 3.39999C14.0001 3.02867 13.8526 2.67256 13.59 2.40999C13.3274 2.14743 12.9713 1.99992 12.6 1.99992C12.2287 1.99992 11.8726 2.14743 11.61 2.40999L6 7.99999V9.99999H8L13.59 4.38999Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                Edit
              </button>
            </div>
            <div className="flex items-center gap-3">
              {/* Telegram */}
              {telegramConnected ? (
                /* Active: connected — click for edit/delete menu */
                <div className="relative">
                  <button
                    onClick={() => setTelegramMenuOpen(!telegramMenuOpen)}
                    className="w-[204px] h-[43px] flex items-center gap-[12px] bg-[#FFFFFF1A] border border-border rounded-[8px] px-[16px] py-[8px] hover:bg-[#FFFFFF26] transition-colors"
                  >
                    <div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_1_982)">
                          <path d="M8 0C5.87875 0 3.8425 0.843375 2.34375 2.34313C0.843465 3.84348 0.000429311 5.87823 0 8C0 10.1209 0.84375 12.1571 2.34375 13.6569C3.8425 15.1566 5.87875 16 8 16C10.1213 16 12.1575 15.1566 13.6562 13.6569C15.1562 12.1571 16 10.1209 16 8C16 5.87913 15.1562 3.84288 13.6562 2.34313C12.1575 0.843375 10.1213 0 8 0Z" fill="url(#paint0_linear_1_982)" />
                          <path d="M3.62107 7.9155C5.95357 6.8995 7.50857 6.22966 8.28607 5.906C10.5086 4.98187 10.9698 4.82137 11.2711 4.81593C11.3373 4.81487 11.4848 4.83125 11.5811 4.90906C11.6611 4.97468 11.6836 5.06343 11.6948 5.12575C11.7048 5.188 11.7186 5.32987 11.7073 5.44062C11.5873 6.70562 11.0661 9.77537 10.8011 11.1922C10.6898 11.7917 10.4686 11.9927 10.2548 12.0124C9.78982 12.0551 9.43732 11.7054 8.98732 11.4105C8.28357 10.9489 7.88607 10.6616 7.20232 10.2112C6.41232 9.69075 6.92482 9.40462 7.37482 8.93712C7.49232 8.81475 9.53982 6.95287 9.57857 6.784C9.58357 6.76287 9.58857 6.68412 9.54107 6.64262C9.49482 6.601 9.42607 6.61525 9.37607 6.6265C9.30482 6.6425 8.18107 7.386 6.00107 8.85687C5.68232 9.07612 5.39357 9.183 5.13357 9.17737C4.84857 9.17125 4.29857 9.01587 3.88982 8.88312C3.38982 8.72025 2.99107 8.63412 3.02607 8.3575C3.04357 8.2135 3.24232 8.06612 3.62107 7.9155Z" fill="white" />
                        </g>
                        <defs>
                          <linearGradient id="paint0_linear_1_982" x1="800" y1="0" x2="800" y2="1600" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2AABEE" />
                            <stop offset="1" stopColor="#229ED9" />
                          </linearGradient>
                          <clipPath id="clip0_1_982">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <p className="text-white text-sm font-semibold">Telegram</p>
                      <span className="flex items-center gap-1 text-[#22c55e] text-xs font-medium">
                        <Check size={11} strokeWidth={3} /> Connected
                      </span>
                    </div>
                    <ChevronDown size={12} className="ml-auto text-[#8A8A8A]" />
                  </button>
                  {telegramMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 w-[204px] bg-[#1a1a1a] border border-[#222222] rounded-lg overflow-hidden z-50 shadow-lg">
                      <button
                        onClick={() => { setTelegramMenuOpen(false); handleOpenTelegramModal(); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#FFFFFF1A] transition-colors flex items-center gap-2"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Change Bot
                      </button>
                      <button
                        onClick={() => { setTelegramMenuOpen(false); handleDisconnectTelegram(); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-[#FFFFFF1A] transition-colors flex items-center gap-2"
                      >
                        <X size={14} />
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Not connected */
                <button
                  onClick={handleOpenTelegramModal}
                  className="w-[204px] h-[43px] flex items-center gap-[12px] border border-[#e8612a] rounded-[8px] px-[16px] py-[8px] bg-[#e8612a]/10 hover:bg-[#e8612a]/20 transition-colors duration-200"
                >
                  <div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_1_982_btn)">
                        <path d="M8 0C5.87875 0 3.8425 0.843375 2.34375 2.34313C0.843465 3.84348 0.000429311 5.87823 0 8C0 10.1209 0.84375 12.1571 2.34375 13.6569C3.8425 15.1566 5.87875 16 8 16C10.1213 16 12.1575 15.1566 13.6562 13.6569C15.1562 12.1571 16 10.1209 16 8C16 5.87913 15.1562 3.84288 13.6562 2.34313C12.1575 0.843375 10.1213 0 8 0Z" fill="url(#paint0_linear_1_982_btn)" />
                        <path d="M3.62107 7.9155C5.95357 6.8995 7.50857 6.22966 8.28607 5.906C10.5086 4.98187 10.9698 4.82137 11.2711 4.81593C11.3373 4.81487 11.4848 4.83125 11.5811 4.90906C11.6611 4.97468 11.6836 5.06343 11.6948 5.12575C11.7048 5.188 11.7186 5.32987 11.7073 5.44062C11.5873 6.70562 11.0661 9.77537 10.8011 11.1922C10.6898 11.7917 10.4686 11.9927 10.2548 12.0124C9.78982 12.0551 9.43732 11.7054 8.98732 11.4105C8.28357 10.9489 7.88607 10.6616 7.20232 10.2112C6.41232 9.69075 6.92482 9.40462 7.37482 8.93712C7.49232 8.81475 9.53982 6.95287 9.57857 6.784C9.58357 6.76287 9.58857 6.68412 9.54107 6.64262C9.49482 6.601 9.42607 6.61525 9.37607 6.6265C9.30482 6.6425 8.18107 7.386 6.00107 8.85687C5.68232 9.07612 5.39357 9.183 5.13357 9.17737C4.84857 9.17125 4.29857 9.01587 3.88982 8.88312C3.38982 8.72025 2.99107 8.63412 3.02607 8.3575C3.04357 8.2135 3.24232 8.06612 3.62107 7.9155Z" fill="white" />
                      </g>
                      <defs>
                        <linearGradient id="paint0_linear_1_982_btn" x1="800" y1="0" x2="800" y2="1600" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#2AABEE" />
                          <stop offset="1" stopColor="#229ED9" />
                        </linearGradient>
                        <clipPath id="clip0_1_982_btn">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <p className="text-white text-sm font-semibold">Telegram</p>
                    <span className="text-[#e8612a] text-xs font-semibold">Connect</span>
                  </div>
                </button>
              )}

              <div className="flex gap-4">
                <div className="flex gap-3">
                  {/* WhatsApp */}
                  <div className="w-[130px] h-[42px] flex items-center gap-[8px] rounded-[8px] border border-[#FFFFFF1A] bg-[#FFFFFF0A] px-[16px] py-[8px]">
                    <div className="w-6 h-6 rounded-full  flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1_996)">
                          <path d="M0.34123 7.90425C0.340855 9.24856 0.694855 10.5612 1.36798 11.7181L0.276855 15.6711L4.35386 14.6104C5.4815 15.2195 6.74495 15.5387 8.02886 15.5388H8.03223C12.2707 15.5388 15.7209 12.1166 15.7227 7.91026C15.7235 5.872 14.9242 3.95535 13.4721 2.51336C12.0202 1.0715 10.0893 0.277023 8.03192 0.276093C3.79298 0.276093 0.343043 3.69811 0.341293 7.90425" fill="url(#paint0_linear_1_996)" />
                          <path d="M0.066875 7.90177C0.0664375 9.29445 0.433125 10.654 1.13025 11.8524L0 15.9471L4.22319 14.8484C5.38681 15.4779 6.69694 15.8098 8.03006 15.8103H8.0335C12.424 15.8103 15.9981 12.265 16 7.90809C16.0007 5.79659 15.1727 3.81104 13.6687 2.3174C12.1646 0.823938 10.1646 0.000868217 8.0335 0C3.64225 0 0.068625 3.54481 0.066875 7.90177ZM2.58194 11.646L2.42425 11.3976C1.76137 10.3518 1.4115 9.14326 1.412 7.90226C1.41337 4.28087 4.38363 1.33457 8.036 1.33457C9.80475 1.33532 11.467 2.01947 12.7172 3.26078C13.9674 4.5022 14.6554 6.15243 14.6549 7.9076C14.6533 11.529 11.683 14.4757 8.0335 14.4757H8.03088C6.84256 14.475 5.67712 14.1584 4.66075 13.56L4.41888 13.4177L1.91275 14.0696L2.58194 11.646Z" fill="url(#paint1_linear_1_996)" />
                          <path d="M6.04223 4.59832C5.8931 4.26946 5.73616 4.26282 5.59435 4.25705C5.47823 4.25209 5.34548 4.25246 5.21285 4.25246C5.0801 4.25246 4.86441 4.30201 4.6821 4.49953C4.4996 4.69724 3.98535 5.17501 3.98535 6.14673C3.98535 7.11845 4.69866 8.05761 4.7981 8.18952C4.89766 8.32118 6.17516 10.3791 8.19841 11.1708C9.87991 11.8287 10.2221 11.6979 10.587 11.6649C10.952 11.632 11.7648 11.1872 11.9306 10.726C12.0965 10.2649 12.0965 9.86958 12.0468 9.78697C11.997 9.70468 11.8643 9.65525 11.6652 9.55652C11.4662 9.4578 10.4875 8.97991 10.305 8.91398C10.1225 8.84812 9.98985 8.81525 9.8571 9.01302C9.72435 9.21048 9.34316 9.65525 9.22698 9.78697C9.11091 9.91901 8.99473 9.93544 8.79573 9.83665C8.59654 9.73755 7.95548 9.52924 7.19491 8.85643C6.60316 8.3329 6.20366 7.68639 6.08754 7.48862C5.97141 7.29116 6.0751 7.18412 6.17491 7.0857C6.26435 6.99721 6.37404 6.85507 6.47366 6.73978C6.57291 6.62443 6.60604 6.54214 6.67241 6.41042C6.73885 6.27857 6.7056 6.16322 6.65591 6.06443C6.60604 5.96564 6.21923 4.98884 6.04223 4.59832Z" fill="white" />
                        </g>
                        <defs>
                          <linearGradient id="paint0_linear_1_996" x1="772.568" y1="1539.78" x2="772.568" y2="0.276093" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#1FAF38" />
                            <stop offset="1" stop-color="#60D669" />
                          </linearGradient>
                          <linearGradient id="paint1_linear_1_996" x1="800" y1="1594.71" x2="800" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#F9F9F9" />
                            <stop offset="1" stop-color="white" />
                          </linearGradient>
                          <clipPath id="clip0_1_996">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                    </div>

                    <div className="leading-tight">
                      <p className="text-[#FFFFFF] text-[10px] font-semibold">WhatsApp</p>
                      <span className="text-[9px] text-[#8A8A8A] block">
                        Coming Soon
                      </span>
                    </div>
                  </div>

                  {/* Slack */}
                  <div className="w-[130px] h-[42px] flex items-center gap-[8px] rounded-[8px] border border-[#FFFFFF1A] bg-[#FFFFFF0A] px-[16px] py-[8px]">
                    <div className="w-6 h-6 rounded-full bg-[#4A154B] flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1_1005)">
                          <path d="M3.36156 10.1107C3.36156 11.0358 2.60586 11.7915 1.68078 11.7915C0.7557 11.7915 0 11.0358 0 10.1107C0 9.18567 0.7557 8.42997 1.68078 8.42997H3.36156V10.1107ZM4.20847 10.1107C4.20847 9.18567 4.96417 8.42997 5.88925 8.42997C6.81433 8.42997 7.57003 9.18567 7.57003 10.1107V14.3192C7.57003 15.2443 6.81433 16 5.88925 16C4.96417 16 4.20847 15.2443 4.20847 14.3192V10.1107ZM5.88925 3.36156C4.96417 3.36156 4.20847 2.60586 4.20847 1.68078C4.20847 0.7557 4.96417 0 5.88925 0C6.81433 0 7.57003 0.7557 7.57003 1.68078V3.36156H5.88925ZM5.88925 4.20847C6.81433 4.20847 7.57003 4.96417 7.57003 5.88925C7.57003 6.81433 6.81433 7.57003 5.88925 7.57003H1.68078C0.7557 7.57003 0 6.81433 0 5.88925C0 4.96417 0.7557 4.20847 1.68078 4.20847H5.88925ZM12.6384 5.88925C12.6384 4.96417 13.3941 4.20847 14.3192 4.20847C15.2443 4.20847 16 4.96417 16 5.88925C16 6.81433 15.2443 7.57003 14.3192 7.57003H12.6384V5.88925ZM11.7915 5.88925C11.7915 6.81433 11.0358 7.57003 10.1107 7.57003C9.18567 7.57003 8.42997 6.81433 8.42997 5.88925V1.68078C8.42997 0.7557 9.18567 0 10.1107 0C11.0358 0 11.7915 0.7557 11.7915 1.68078V5.88925ZM10.1107 12.6384C11.0358 12.6384 11.7915 13.3941 11.7915 14.3192C11.7915 15.2443 11.0358 16 10.1107 16C9.18567 16 8.42997 15.2443 8.42997 14.3192V12.6384H10.1107ZM10.1107 11.7915C9.18567 11.7915 8.42997 11.0358 8.42997 10.1107C8.42997 9.18567 9.18567 8.42997 10.1107 8.42997H14.3192C15.2443 8.42997 16 9.18567 16 10.1107C16 11.0358 15.2443 11.7915 14.3192 11.7915H10.1107Z" fill="#3F0F3F" />
                        </g>
                        <defs>
                          <clipPath id="clip0_1_1005">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                    </div>

                    <div className="leading-tight">
                      <p className="text-white text-[10px] font-semibold">Slack</p>
                      <span className="text-[9px] text-[#8A8A8A] block">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Email Notifications */}
          <div className="bg-surface border border-border rounded-[8px] p-6 w-[795px]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white text-lg font-bold">{t("settings.email.title")}</p>
                <p className="text-text-secondary text-sm mt-1">
                  {t("settings.email.subtitle")}
                </p>
              </div>
              <button onClick={() => setIsAddEmailOpen(true)} className=" bg-[#FFFFFF1A]/10 flex items-center gap-2 px-4 py-2 border border-border rounded-[35px] text-white text-sm hover:bg-surface-hover transition-colors duration-200 flex-shrink-0 ml-4">
                <Plus size={14} />
                {t("settings.email.addEmail")}
              </button>
            </div>
          </div>

          {/* Languages */}
          <div className="bg-surface border border-border rounded-[8px] p-6 w-[795px]">
            <p className="text-white text-lg font-bold mb-4">{t("settings.languages")}</p>
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="w-full flex items-center justify-between rounded-[8px] px-4 py-3 text-white text-sm transition-colors duration-200 border border-border hover:bg-white/10"
                style={{ background: "#FFFFFF1A" }}
              >
                <span className="flex items-center gap-3">
                  <FlagImage country={selectedLanguage.country} name={selectedLanguage.name} />
                  {selectedLanguage.name}
                </span>
                <ChevronDown
                  size={16}
                  className="text-text-secondary transition-transform duration-200"
                  style={{ transform: isLangOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {isLangOpen && (
                <div
                  className="absolute z-50 left-0 right-0 mt-1 rounded-[8px] border border-border overflow-hidden"
                  style={{ background: "#1a1a1a", maxHeight: "240px", overflowY: "auto" }}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors duration-150"
                      style={selectedLanguage.code === lang.code ? { background: "#FFFFFF1A" } : {}}
                    >
                      <FlagImage country={lang.country} name={lang.name} />
                      {lang.name}
                      {selectedLanguage.code === lang.code && (
                        <Check size={13} className="ml-auto text-white/60" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* My Profile */}
          <div className="bg-surface border border-border rounded-[8px] p-6 w-[795px]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white text-lg font-bold">{t("settings.profile.title")}</p>
                {userName && (
                  <p className="text-white text-sm font-semibold mt-0.5">{userName}</p>
                )}
                <p className="text-text-secondary text-sm mt-1">
                  {t("settings.profile.subtitle")}
                </p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="bg-[#FFFFFF1A]/10 flex items-center gap-2 px-4 py-2 border border-border rounded-[35px] text-white text-sm hover:bg-surface-hover transition-colors duration-200 flex-shrink-0 ml-4"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.6665 8.66666H7.99984C7.64621 8.66666 7.30708 8.80713 7.05703 9.05718C6.80698 9.30723 6.6665 9.64637 6.6665 9.99999V16C6.6665 16.3536 6.80698 16.6927 7.05703 16.9428C7.30708 17.1928 7.64621 17.3333 7.99984 17.3333H13.9998C14.3535 17.3333 14.6926 17.1928 14.9426 16.9428C15.1927 16.6927 15.3332 16.3536 15.3332 16V15.3333" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M14.6667 7.33333L16.6667 9.33333M17.59 8.38999C17.8526 8.12743 18.0001 7.77132 18.0001 7.39999C18.0001 7.02867 17.8526 6.67256 17.59 6.40999C17.3274 6.14743 16.9713 5.99992 16.6 5.99992C16.2287 5.99992 15.8726 6.14743 15.61 6.40999L10 12V14H12L17.59 8.38999Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                {t("settings.profile.editProfile")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-[8px] p-6 w-[795px]">
          <h3 className="text-white text-base font-semibold mb-6">
            Current Usage
          </h3>
          <div className="flex flex-col gap-5">
            {[
              { label: "Workspaces", value: "1 / 1", used: 1, total: 1, pct: 100 },
              { label: "Agents", value: "2 / 3", used: 2, total: 3, pct: 66 },
              { label: "Local Storage", value: "5 GB of 128 GB used", used: 5, total: 128, pct: 4 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">{item.label}</span>
                  <span className="text-text-secondary text-xs">{item.value}</span>
                </div>
                <div className="w-full h-[6px] bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.pct}%`,
                      background: "#FFFFFF",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaved={fetchUserName}
      />
      <AddEmailModal
        isOpen={isAddEmailOpen}
        onClose={() => setIsAddEmailOpen(false)}
      />

      {/* Telegram Connect Modal */}
      {isTelegramModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setIsTelegramModalOpen(false)}
        >
          <div
            className="relative w-[480px] p-6"
            style={{
              background: "#111111",
              border: "1px solid #222222",
              borderRadius: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsTelegramModalOpen(false)}
              className="absolute top-4 right-4 text-[#8A8A8A] hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-white text-lg font-bold mb-6">Connect Telegram</h2>

            <div className="flex flex-col gap-5">
              {/* Step 1 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#e8612a] flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-1">
                    Open Telegram and search for
                  </p>
                  <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#222222] rounded-lg px-3 py-2">
                    <code className="text-[#e8612a] text-sm flex-1">@BotFather</code>
                    <button
                      onClick={() => handleCopy("@BotFather", "bf")}
                      className="flex-shrink-0 text-[#8A8A8A] hover:text-white transition-colors"
                    >
                      {copied === "bf" ? <Check size={14} className="text-[#22c55e]" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#e8612a] flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-1">
                    Send this command to create a new bot:
                  </p>
                  <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#222222] rounded-lg px-3 py-2">
                    <code className="text-[#e8612a] text-sm flex-1">/newbot</code>
                    <button
                      onClick={() => handleCopy("/newbot", "cmd")}
                      className="flex-shrink-0 text-[#8A8A8A] hover:text-white transition-colors"
                    >
                      {copied === "cmd" ? <Check size={14} className="text-[#22c55e]" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className="text-[#8A8A8A] text-xs mt-1.5">
                    Follow the prompts to set a name and username for your bot.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#e8612a] flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-2">
                    Paste the bot token you received from BotFather:
                  </p>
                  <input
                    type="text"
                    value={telegramBotTokenInput}
                    onChange={(e) => { setTelegramBotTokenInput(e.target.value); setTelegramError(""); }}
                    placeholder="123456789:ABCdefGhIjKlMnOpQrStUvWxYz..."
                    className="w-full bg-[#1a1a1a] border border-[#222222] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#e8612a] transition-colors"
                  />
                  {telegramError && (
                    <p className="text-red-400 text-xs mt-1.5">{telegramError}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleTelegramConnect}
              disabled={telegramSaving}
              className="w-full mt-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors duration-200 hover:brightness-110 disabled:opacity-50"
              style={{ background: "#e8612a" }}
            >
              {telegramSaving ? (telegramStatusMsg || "Connecting...") : "Connect"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
