

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

function CustomSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between bg-[#ffffff1a] border border-[#ffffff1a] rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none transition-colors duration-200 hover:border-white/20"
      >
        <span>{value}</span>
        <ChevronDown
          size={15}
          className="text-[#6b6b6b] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 left-0 right-0 mt-1 rounded-lg border border-[#ffffff1a] overflow-hidden shadow-2xl"
          style={{ background: "#2a2a2d" }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-white hover:bg-[#ffffff1a] transition-colors duration-150"
              style={value === opt ? { background: "#ffffff1a" } : {}}
            >
              {opt}
              {value === opt && <Check size={13} className="text-white/60" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditProfileModal({ isOpen, onClose, onSaved }: EditProfileModalProps) {
  const { t } = useTranslation();

  const toneOptions = t("editProfile.toneOptions", { returnObjects: true }) as string[];
  const responseLengthOptions = t("editProfile.responseLengthOptions", { returnObjects: true }) as string[];
  const creativityOptions = t("editProfile.creativityOptions", { returnObjects: true }) as string[];

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [expertise, setExpertise] = useState("");
  const [tone, setTone] = useState(toneOptions[1] ?? "Professional");
  const [responseLength, setResponseLength] = useState(responseLengthOptions[1] ?? "Balanced");
  const [creativity, setCreativity] = useState(creativityOptions[1] ?? "Balanced");
  const [preferredLang, setPreferredLang] = useState("English");
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);

  // Load profile from Supabase when modal opens
  useEffect(() => {
    if (!isOpen) return;
    api.user.profile().then((data: unknown) => {
      const profile = data as { name?: string; role?: string; preferences?: Record<string, string> };
      if (profile.name) setName(profile.name);
      if (profile.role) setRole(profile.role);
      if (profile.preferences) {
        if (profile.preferences.expertise) setExpertise(profile.preferences.expertise);
        if (profile.preferences.tone) setTone(profile.preferences.tone);
        if (profile.preferences.responseLength) setResponseLength(profile.preferences.responseLength);
        if (profile.preferences.creativity) setCreativity(profile.preferences.creativity);
        if (profile.preferences.preferredLang) setPreferredLang(profile.preferences.preferredLang);
        if (profile.preferences.instructions) setInstructions(profile.preferences.instructions);
      }
    }).catch(() => {});
  }, [isOpen]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.user.updateProfile({
        name,
        role,
        preferences: { expertise, tone, responseLength, creativity, preferredLang, instructions },
      });
      onSaved?.();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#1A1A1ACC]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative shadow-2xl flex flex-col"
        style={{
          background: "#1c1c1e",
          border: "1px solid #2a2a2d",
          borderRadius: "16px",
          width: "450px",
          maxHeight: "90vh",
          padding: "24px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white text-base font-bold">{t("editProfile.title")}</h2>
          <button
            onClick={onClose}
            className="text-[#6b6b6b] hover:text-white transition-colors duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto space-y-5 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {/* About You */}
          <div>
            <p className="text-white text-sm font-bold mb-3">{t("editProfile.aboutYou")}</p>

            {/* Name + Role row */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[#6b6b6b] text-xs block mb-1.5">{t("editProfile.yourName")}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#ffffff1a] border border-[#ffffff1a] rounded-lg py-2.5 px-3 text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#e8612a]/50 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="text-[#6b6b6b] text-xs block mb-1.5">{t("editProfile.yourRole")}</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder={t("editProfile.rolePlaceholder")}
                  className="w-full bg-[#ffffff1a] border border-[#ffffff1a] rounded-lg py-2.5 px-3 text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#e8612a]/50 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Expertise */}
            <div>
              <label className="text-[#6b6b6b] text-xs block mb-1.5">{t("editProfile.expertise")}</label>
              <input
                type="text"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder={t("editProfile.expertisePlaceholder")}
                className="w-full bg-[#ffffff1a] border border-[#ffffff1a] rounded-lg py-2.5 px-3 text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#e8612a]/50 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Agent Behavior */}
          <div>
            <p className="text-white text-sm font-bold mb-3">{t("editProfile.agentBehavior")}</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#6b6b6b] text-xs block mb-1.5">{t("editProfile.tone")}</label>
                <CustomSelect
                  options={toneOptions}
                  value={tone}
                  onChange={setTone}
                />
              </div>
              <div>
                <label className="text-[#6b6b6b] text-xs block mb-1.5">{t("editProfile.responseLength")}</label>
                <CustomSelect
                  options={responseLengthOptions}
                  value={responseLength}
                  onChange={setResponseLength}
                />
              </div>
              <div>
                <label className="text-[#6b6b6b] text-xs block mb-1.5">{t("editProfile.creativity")}</label>
                <CustomSelect
                  options={creativityOptions}
                  value={creativity}
                  onChange={setCreativity}
                />
              </div>
              <div>
                <label className="text-[#6b6b6b] text-xs block mb-1.5">{t("editProfile.preferredLang")}</label>
                <CustomSelect
                  options={["English", "Spanish", "French", "German", "Portuguese", "Chinese", "Japanese", "Arabic", "Hindi"]}
                  value={preferredLang}
                  onChange={setPreferredLang}
                />
              </div>
            </div>
          </div>

          {/* Additional Instructions */}
          <div>
            <label className="text-[#6b6b6b] text-xs block mb-1.5">{t("editProfile.instructions")}</label>
            <textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={t("editProfile.instructionsPlaceholder")}
              className="w-full bg-[#ffffff1a] border border-[#ffffff1a] rounded-lg py-2.5 px-3 text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#e8612a]/50 transition-colors duration-200 resize-none"
            />
            <p className="text-[#6b6b6b] text-xs mt-2">
              {t("editProfile.instructionsHint")}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            style={{
              width: "96px",
              height: "45px",
              background: "#ffffff1a",
              border: "1px solid #ffffff1a",
              borderRadius: "8px",
            }}
            className="text-white text-sm font-medium hover:opacity-80 transition-opacity duration-200"
          >
            {t("editProfile.cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: "linear-gradient(180deg, #E97334 0%, #CC4130 100%)",
              width: "143px",
              height: "45px",
              borderRadius: "8px",
              opacity: saving ? 0.7 : 1,
            }}
            className="text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200"
          >
            {saving ? "..." : t("editProfile.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
