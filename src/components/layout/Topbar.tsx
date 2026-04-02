

import { useState, useRef, useEffect } from "react";

const VolumeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.9">
      <path d="M1.535 10.971C1.608 9.76301 1.645 9.15801 1.959 8.57701C2.27713 8.01423 2.75825 7.561 3.339 7.27701C3.94 7.00001 4.627 7.00001 6 7.00001C6.512 7.00001 6.768 7.00001 7.016 6.95801C7.26129 6.91647 7.50046 6.84459 7.728 6.74401C7.958 6.64301 8.172 6.50201 8.599 6.22001L8.819 6.07601C11.36 4.39901 12.632 3.56001 13.7 3.92501C13.905 3.99501 14.103 4.09501 14.28 4.22001C15.202 4.86801 15.273 6.37701 15.413 9.39401C15.4587 10.262 15.4877 11.1309 15.5 12C15.5 12.532 15.465 13.488 15.413 14.605C15.273 17.623 15.203 19.131 14.28 19.78C14.1016 19.9053 13.9063 20.0047 13.7 20.075C12.633 20.439 11.361 19.601 8.818 17.924L8.6 17.78C8.173 17.498 7.96 17.357 7.729 17.255C7.50141 17.1548 7.26224 17.0832 7.017 17.042C6.768 17 6.512 17 6 17C4.626 17 3.94 17 3.34 16.723C2.75888 16.4392 2.27739 15.9859 1.959 15.423C1.645 14.841 1.609 14.237 1.535 13.028C1.51297 12.6858 1.50129 12.3429 1.5 12C1.5 11.677 1.513 11.329 1.535 10.971Z" stroke="white" strokeWidth="1.5"/>
      <path d="M20 6C20 6 21.5 7.8 21.5 12C21.5 16.2 20 18 20 18M18 9C18 9 18.5 9.9 18.5 12C18.5 14.1 18 15 18 15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  </svg>
);

const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.9">
      <path d="M5 12C5 11.7348 4.89464 11.4804 4.70711 11.2929C4.51957 11.1054 4.26522 11 4 11H3C2.73478 11 2.48043 11.1054 2.29289 11.2929C2.10536 11.4804 2 11.7348 2 12C2 12.2652 2.10536 12.5196 2.29289 12.7071C2.48043 12.8946 2.73478 13 3 13H4C4.26522 13 4.51957 12.8946 4.70711 12.7071C4.89464 12.5196 5 12.2652 5 12ZM5.64 17L4.93 17.71C4.74375 17.8974 4.63921 18.1508 4.63921 18.415C4.63921 18.6792 4.74375 18.9326 4.93 19.12C5.11736 19.3063 5.37081 19.4108 5.635 19.4108C5.89919 19.4108 6.15264 19.3063 6.34 19.12L7.05 18.41C7.21383 18.2187 7.29943 17.9726 7.28971 17.7209C7.27999 17.4693 7.17566 17.2305 6.99756 17.0524C6.81947 16.8743 6.58073 16.77 6.32905 16.7603C6.07738 16.7506 5.8313 16.8362 5.64 17ZM12 5C12.2652 5 12.5196 4.89464 12.7071 4.70711C12.8946 4.51957 13 4.26522 13 4V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2C11.7348 2 11.4804 2.10536 11.2929 2.29289C11.1054 2.48043 11 2.73478 11 3V4C11 4.26522 11.1054 4.51957 11.2929 4.70711C11.4804 4.89464 11.7348 5 12 5ZM17.66 7.34C17.9223 7.3389 18.1737 7.23474 18.36 7.05L19.07 6.34C19.1747 6.25035 19.2597 6.14004 19.3197 6.01597C19.3797 5.89191 19.4135 5.75677 19.4188 5.61905C19.4241 5.48133 19.4009 5.344 19.3506 5.21568C19.3004 5.08735 19.2241 4.9708 19.1266 4.87335C19.0292 4.77589 18.9126 4.69964 18.7843 4.64936C18.656 4.59909 18.5187 4.57588 18.3809 4.5812C18.2432 4.58652 18.1081 4.62025 17.984 4.68027C17.86 4.7403 17.7496 4.82532 17.66 4.93L17 5.64C16.8137 5.82736 16.7092 6.08081 16.7092 6.345C16.7092 6.60919 16.8137 6.86264 17 7.05C17.1763 7.22536 17.4116 7.32875 17.66 7.34ZM5.66 7.05C5.84626 7.23474 6.09766 7.3389 6.36 7.34C6.49161 7.34076 6.62207 7.31554 6.74391 7.26577C6.86574 7.21601 6.97656 7.14268 7.07 7.05C7.25625 6.86264 7.36079 6.60919 7.36079 6.345C7.36079 6.08081 7.25625 5.82736 7.07 5.64L6.36 4.93C6.17302 4.74037 5.91837 4.63278 5.65207 4.63091C5.38577 4.62903 5.12963 4.73302 4.94 4.92C4.75037 5.10698 4.64278 5.36163 4.64091 5.62793C4.63903 5.89423 4.74302 6.15037 4.93 6.34L5.66 7.05ZM21 11H20C19.7348 11 19.4804 11.1054 19.2929 11.2929C19.1054 11.4804 19 11.7348 19 12C19 12.2652 19.1054 12.5196 19.2929 12.7071C19.4804 12.8946 19.7348 13 20 13H21C21.2652 13 21.5196 12.8946 21.7071 12.7071C21.8946 12.5196 22 12.2652 22 12C22 11.7348 21.8946 11.4804 21.7071 11.2929C21.5196 11.1054 21.2652 11 21 11ZM18.36 17C18.17 16.8943 17.9508 16.8534 17.7355 16.8835C17.5202 16.9136 17.3205 17.0131 17.1668 17.1668C17.0131 17.3205 16.9136 17.5202 16.8835 17.7355C16.8534 17.9508 16.8943 18.17 17 18.36L17.71 19.07C17.8974 19.2563 18.1508 19.3608 18.415 19.3608C18.6792 19.3608 18.9326 19.2563 19.12 19.07C19.3063 18.8826 19.4108 18.6292 19.4108 18.365C19.4108 18.1008 19.3063 17.8474 19.12 17.66L18.36 17ZM12 6.5C10.9122 6.5 9.84883 6.82257 8.94436 7.42692C8.03989 8.03126 7.33494 8.89025 6.91866 9.89524C6.50238 10.9002 6.39346 12.0061 6.60568 13.073C6.8179 14.1399 7.34172 15.1199 8.11091 15.8891C8.8801 16.6583 9.86011 17.1821 10.927 17.3943C11.9939 17.6065 13.0998 17.4976 14.1048 17.0813C15.1098 16.6651 15.9687 15.9601 16.5731 15.0556C17.1774 14.1512 17.5 13.0878 17.5 12C17.4974 10.5421 16.917 9.14471 15.8862 8.11383C14.8553 7.08295 13.4579 6.50264 12 6.5ZM12 15.5C11.3078 15.5 10.6311 15.2947 10.0555 14.9101C9.47993 14.5256 9.03133 13.9789 8.76642 13.3394C8.50151 12.6999 8.4322 11.9961 8.56725 11.3172C8.7023 10.6383 9.03564 10.0146 9.52513 9.52513C10.0146 9.03564 10.6383 8.7023 11.3172 8.56725C11.9961 8.4322 12.6999 8.50151 13.3394 8.76642C13.9789 9.03133 14.5256 9.47993 14.9101 10.0555C15.2947 10.6311 15.5 11.3078 15.5 12C15.5 12.9283 15.1313 13.8185 14.4749 14.4749C13.8185 15.1313 12.9283 15.5 12 15.5ZM12 19C11.7348 19 11.4804 19.1054 11.2929 19.2929C11.1054 19.4804 11 19.7348 11 20V21C11 21.2652 11.1054 21.5196 11.2929 21.7071C11.4804 21.8946 11.7348 22 12 22C12.2652 22 12.5196 21.8946 12.7071 21.7071C12.8946 21.5196 13 21.2652 13 21V20C13 19.7348 12.8946 19.4804 12.7071 19.2929C12.5196 19.1054 12.2652 19 12 19Z" fill="white"/>
    </g>
  </svg>
);

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.8">
      <path d="M18.7499 9.71V9.005C18.7499 5.136 15.7259 2 11.9999 2C8.27394 2 5.24994 5.136 5.24994 9.005V9.71C5.25114 10.5516 5.01098 11.3758 4.55794 12.085L3.44994 13.81C2.43894 15.385 3.21094 17.526 4.96994 18.024C9.56623 19.3257 14.4337 19.3257 19.0299 18.024C20.7889 17.526 21.5609 15.385 20.5499 13.811L19.4419 12.086C18.9885 11.3769 18.748 10.5527 18.7489 9.711L18.7499 9.71Z" stroke="white" strokeWidth="1.5"/>
      <path d="M7.5 19C8.155 20.748 9.922 22 12 22C14.078 22 15.845 20.748 16.5 19M12 6V10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  </svg>
);

const RIGHT_ICONS = [VolumeIcon, SunIcon, BellIcon];

const BatteryIcon = ({ level = 100, charging = false }: { level?: number; charging?: boolean }) => {
  // Fill width proportional to battery level: max fill width is ~10 units (from x=3.25 to x=13.25)
  const fillWidth = Math.max(0, Math.min(10, (level / 100) * 10));
  const fillColor = level <= 20 ? "#FF3B30" : level <= 50 ? "#FFD60A" : "white";
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 0.75H4C2.20507 0.75 0.75 2.20507 0.75 4V9.5C0.75 11.2949 2.20507 12.75 4 12.75H13.5C15.2949 12.75 16.75 11.2949 16.75 9.5V4C16.75 2.20507 15.2949 0.75 13.5 0.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3.25" y="3.25" width={fillWidth} height="7" rx="1.5" fill={fillColor}/>
      {charging && (
        <path d="M9.5 3L7 7.5H10L8 11L12 6.5H9L11 3H9.5Z" fill="#1c1c1e" stroke="#1c1c1e" strokeWidth="0.3" strokeLinejoin="round"/>
      )}
      <path d="M19.25 4.75V8.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const SignalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.9">
      <path d="M6 6.5L17 17L11.5 22V2L17 7L6 17.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

const WifiIcon = ({ color = "white" }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.9">
      <path d="M10.2251 20.275C9.74176 19.7917 9.5001 19.2 9.5001 18.5C9.5001 17.8 9.74176 17.2083 10.2251 16.725C10.7084 16.2417 11.3001 16 12.0001 16C12.7001 16 13.2918 16.2417 13.7751 16.725C14.2584 17.2083 14.5001 17.8 14.5001 18.5C14.5001 19.2 14.2584 19.7917 13.7751 20.275C13.2918 20.7583 12.7001 21 12.0001 21C11.3001 21 10.7084 20.7583 10.2251 20.275ZM15.5631 10.6C16.6878 11 17.7084 11.55 18.6251 12.25C18.9584 12.5 19.1294 12.8293 19.1381 13.238C19.1468 13.6467 19.0008 14.0007 18.7001 14.3C18.4168 14.5833 18.0668 14.7293 17.6501 14.738C17.2334 14.7467 16.8584 14.634 16.5251 14.4C15.8918 13.9667 15.1918 13.625 14.4251 13.375C13.6584 13.125 12.8501 13 12.0001 13C11.1501 13 10.3418 13.125 9.5751 13.375C8.80843 13.625 8.10843 13.9667 7.47509 14.4C7.14176 14.6333 6.76676 14.7417 6.35009 14.725C5.93343 14.7083 5.58343 14.5583 5.3001 14.275C5.01676 13.975 4.87509 13.621 4.87509 13.213C4.87509 12.805 5.04176 12.4757 5.37509 12.225C6.29176 11.525 7.31276 10.979 8.43809 10.587C9.56343 10.195 10.7508 9.99933 12.0001 10C13.2494 10.0007 14.4371 10.2007 15.5631 10.6ZM17.8871 5.025C19.7291 5.70833 21.3834 6.675 22.8501 7.925C23.1834 8.20833 23.3584 8.55833 23.3751 8.975C23.3918 9.39167 23.2501 9.75 22.9501 10.05C22.6668 10.3333 22.3168 10.4793 21.9001 10.488C21.4834 10.4967 21.1084 10.3673 20.7751 10.1C19.5751 9.11667 18.2294 8.35433 16.7381 7.813C15.2468 7.27167 13.6674 7.00067 12.0001 7C10.3328 6.99933 8.75376 7.27033 7.26309 7.813C5.77243 8.35567 4.42643 9.118 3.2251 10.1C2.89176 10.3667 2.51676 10.496 2.1001 10.488C1.68343 10.48 1.33343 10.334 1.0501 10.05C0.750095 9.75 0.608428 9.39167 0.625095 8.975C0.641762 8.55833 0.816762 8.20833 1.1501 7.925C2.61676 6.675 4.27109 5.70833 6.11309 5.025C7.95509 4.34167 9.91743 4 12.0001 4C14.0828 4 16.0454 4.34167 17.8881 5.025" fill={color}/>
    </g>
  </svg>
);

const BT_DEVICES = [
  { name: "P2961", connected: true },
  { name: "Wireless Earbuds 101", connected: false },
  { name: "AudioWave Xtreme", connected: false },
  { name: "SoundSphere Pro", connected: false },
];

function HeadphonesIcon({ active }: { active?: boolean }) {
  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: 32, height: 32, background: active ? "#FF7439" : "rgba(255,255,255,0.12)" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 18V12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12V18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M21 19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H18C17.4696 21 16.9609 20.7893 16.5858 20.4142C16.2107 20.0391 16 19.5304 16 19V16C16 15.4696 16.2107 14.9609 16.5858 14.5858C16.9609 14.2107 17.4696 14 18 14H21V19ZM3 19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H6C6.53043 21 7.03914 20.7893 7.41421 20.4142C7.78929 20.0391 8 19.5304 8 19V16C8 15.4696 7.78929 14.9609 7.41421 14.5858C7.03914 14.2107 6.53043 14 6 14H3V19Z" stroke="white" strokeWidth="1.5"/>
      </svg>
    </div>
  );
}

function BluetoothPopup({ onClose }: { onClose: () => void }) {
  const [btOn, setBtOn] = useState(true);
  const [selected, setSelected] = useState("Wireless Earbuds 101");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full mt-2 left-0 z-50 rounded-2xl overflow-hidden"
      style={{ width: 300, background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-white font-semibold text-base">Bluetooth</span>
        <button
          onClick={() => setBtOn((v) => !v)}
          className="relative transition-opacity"
          style={{ width: 44, height: 26 }}
        >
          <div
            className="w-full h-full rounded-full transition-colors duration-200"
            style={{ background: btOn ? "#FF7439" : "rgba(255,255,255,0.2)" }}
          />
          <div
            className="absolute top-[3px] rounded-full bg-white transition-all duration-200"
            style={{ width: 20, height: 20, left: btOn ? 21 : 3 }}
          />
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

      {/* Device list */}
      <div className="py-1">
        {BT_DEVICES.map((device) => {
          const isSelected = device.name === selected;
          return (
            <button
              key={device.name}
              onClick={() => setSelected(device.name)}
              className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 text-left"
              style={{ background: isSelected ? "rgba(255,255,255,0.07)" : "transparent" }}
            >
              <HeadphonesIcon active={device.connected} />
              <span className="flex-1 text-sm text-white">{device.name}</span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

      {/* Bluetooth Settings */}
      <button className="w-full flex items-center gap-3 px-4 py-3 hover:opacity-70 transition-opacity">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1135 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
        </svg>
        <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Bluetooth Settings...</span>
      </button>
    </div>
  );
}

const WIFI_NETWORKS = [
  { name: "Agent7-Guest" },
  { name: "Home Network" },
  { name: "Office WiFi" },
  { name: "Cafe_Public" },
  { name: "Neighbor 5G" },
];

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 11H7C5.89543 11 5 11.8954 5 13V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V13C19 11.8954 18.1046 11 17 11Z" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
      <path d="M8 11V7C8 5.67392 8.52678 4.40215 9.46447 3.46447C10.4021 2.52678 11.6739 2 13 2C13.6566 2 14.3068 2.12933 14.9134 2.3806C15.52 2.63188 16.0712 3.00017 16.5355 3.46447" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
    </svg>
  );
}

function WifiPopup({ onClose, isOnline }: { onClose: () => void; isOnline: boolean }) {
  const [wifiOn, setWifiOn] = useState(true);
  const [selected, setSelected] = useState("Home Network");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full mt-2 left-0 z-50 rounded-2xl overflow-hidden"
      style={{ width: 300, background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-white font-semibold text-base">Wifi</span>
        {/* Toggle */}
        <button
          onClick={() => setWifiOn((v) => !v)}
          className="relative transition-opacity"
          style={{ width: 44, height: 26 }}
        >
          <div
            className="w-full h-full rounded-full transition-colors duration-200"
            style={{ background: wifiOn ? "#FF7439" : "rgba(255,255,255,0.2)" }}
          />
          <div
            className="absolute top-[3px] rounded-full bg-white transition-all duration-200"
            style={{ width: 20, height: 20, left: wifiOn ? 21 : 3 }}
          />
        </button>
      </div>

      {/* Connection status */}
      <div className="flex items-center gap-2 px-4 py-2" style={{ background: "rgba(255,255,255,0.04)" }}>
        <div
          className="rounded-full"
          style={{ width: 8, height: 8, background: isOnline ? "#30D158" : "#FF3B30" }}
        />
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

      {/* Network list */}
      <div className="py-1">
        {WIFI_NETWORKS.map((net) => {
          const isSelected = net.name === selected;
          return (
            <button
              key={net.name}
              onClick={() => setSelected(net.name)}
              className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 text-left"
              style={{ background: isSelected ? "rgba(255,255,255,0.07)" : "transparent" }}
            >
              <WifiIcon color={isSelected ? "#FF7439" : "white"} />
              <span className="flex-1 text-sm text-white">{net.name}</span>
              <LockIcon />
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

      {/* Network Settings */}
      <button className="w-full flex items-center gap-3 px-4 py-3 hover:opacity-70 transition-opacity">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
        </svg>
        <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Network Settings...</span>
      </button>
    </div>
  );
}

function BrightnessPopup({ onClose }: { onClose: () => void }) {
  const [brightness, setBrightness] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ag7_brightness");
      return saved !== null ? Number(saved) : 100;
    }
    return 100;
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  useEffect(() => {
    const value = Math.max(10, brightness) / 100;
    document.documentElement.style.filter = `brightness(${value})`;
    localStorage.setItem("ag7_brightness", String(brightness));
    return () => {
      // Keep the filter applied even after unmount
    };
  }, [brightness]);

  return (
    <div
      ref={ref}
      className="absolute top-full mt-2 right-0 z-50 rounded-2xl"
      style={{ width: 320, background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.08)", padding: "20px 20px" }}
    >
      <div className="flex items-center gap-3">
        {/* Dim sun */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.5, flexShrink: 0 }}>
          <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5"/>
          <path d="M12 5V3M12 21V19M5 12H3M21 12H19M7.05 7.05L5.64 5.64M18.36 18.36L16.95 16.95M7.05 16.95L5.64 18.36M18.36 5.64L16.95 7.05" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>

        {/* Slider */}
        <div className="relative flex-1 h-[36px] flex items-center">
          <div className="relative w-full h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ width: `${brightness}%`, background: "#FF7439" }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            style={{ height: "100%" }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-white shadow-md pointer-events-none"
            style={{ left: `calc(${brightness}% - 11px)` }}
          />
        </div>

        {/* Bright sun */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5"/>
          <path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

function VolumePopup({ onClose }: { onClose: () => void }) {
  const [volume, setVolume] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ag7_volume");
      return saved !== null ? Number(saved) : 75;
    }
    return 75;
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  useEffect(() => {
    localStorage.setItem("ag7_volume", String(volume));
  }, [volume]);

  return (
    <div
      ref={ref}
      className="absolute top-full mt-2 right-0 z-50 rounded-2xl"
      style={{ width: 320, background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.08)", padding: "20px 20px" }}
    >
      <div className="flex items-center gap-3">
        {/* Muted icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.5, flexShrink: 0 }}>
          <path d="M1.5 10.97C1.57 9.76 1.61 9.16 1.92 8.58C2.24 8.01 2.72 7.56 3.3 7.28C3.9 7 4.59 7 5.96 7C6.47 7 6.73 7 6.98 6.96C7.22 6.92 7.46 6.84 7.69 6.74C7.92 6.64 8.13 6.5 8.56 6.22L8.78 6.08C11.32 4.4 12.59 3.56 13.66 3.93C13.87 4 14.07 4.1 14.24 4.22C15.16 4.87 15.23 6.38 15.37 9.39C15.42 10.26 15.45 11.13 15.46 12C15.46 12.53 15.43 13.49 15.37 14.61C15.23 17.62 15.16 19.13 14.24 19.78C14.06 19.91 13.87 20 13.66 20.08C12.59 20.44 11.32 19.6 8.78 17.92L8.56 17.78C8.13 17.5 7.92 17.36 7.69 17.26C7.46 17.15 7.22 17.08 6.98 17.04C6.73 17 6.47 17 5.96 17C4.59 17 3.9 17 3.3 16.72C2.72 16.44 2.24 15.99 1.92 15.42C1.61 14.84 1.57 14.24 1.5 13.03C1.48 12.69 1.47 12.34 1.46 12C1.46 11.68 1.47 11.33 1.5 10.97Z" stroke="white" strokeWidth="1.5"/>
        </svg>

        {/* Slider */}
        <div className="relative flex-1 h-[36px] flex items-center">
          <div className="relative w-full h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ width: `${volume}%`, background: "#FF7439" }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            style={{ height: "100%" }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-white shadow-md pointer-events-none"
            style={{ left: `calc(${volume}% - 11px)` }}
          />
        </div>

        {/* Loud icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M1.5 10.97C1.57 9.76 1.61 9.16 1.92 8.58C2.24 8.01 2.72 7.56 3.3 7.28C3.9 7 4.59 7 5.96 7C6.47 7 6.73 7 6.98 6.96C7.22 6.92 7.46 6.84 7.69 6.74C7.92 6.64 8.13 6.5 8.56 6.22L8.78 6.08C11.32 4.4 12.59 3.56 13.66 3.93C13.87 4 14.07 4.1 14.24 4.22C15.16 4.87 15.23 6.38 15.37 9.39C15.42 10.26 15.45 11.13 15.46 12C15.46 12.53 15.43 13.49 15.37 14.61C15.23 17.62 15.16 19.13 14.24 19.78C14.06 19.91 13.87 20 13.66 20.08C12.59 20.44 11.32 19.6 8.78 17.92L8.56 17.78C8.13 17.5 7.92 17.36 7.69 17.26C7.46 17.15 7.22 17.08 6.98 17.04C6.73 17 6.47 17 5.96 17C4.59 17 3.9 17 3.3 16.72C2.72 16.44 2.24 15.99 1.92 15.42C1.61 14.84 1.57 14.24 1.5 13.03C1.48 12.69 1.47 12.34 1.46 12C1.46 11.68 1.47 11.33 1.5 10.97Z" stroke="white" strokeWidth="1.5"/>
          <path d="M20 6C20 6 21.5 7.8 21.5 12C21.5 16.2 20 18 20 18M18 9C18 9 18.5 9.9 18.5 12C18.5 14.1 18 15 18 15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

const iconButtonStyle = {
  width: 48,
  height: 48,
  borderRadius: 24,
  padding: 12,
  background: "#FFFFFF1A",
  boxShadow: "0px 0px 6px 0px #FFFFFF40 inset",
};

export default function Topbar() {
  const [btOpen, setBtOpen] = useState(false);
  const [wifiOpen, setWifiOpen] = useState(false);
  const [brightnessOpen, setBrightnessOpen] = useState(false);
  const [volumeOpen, setVolumeOpen] = useState(false);

  // Battery state
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [batteryCharging, setBatteryCharging] = useState(false);

  // Online state
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Restore brightness from localStorage
    const savedBrightness = localStorage.getItem("ag7_brightness");
    if (savedBrightness !== null) {
      const value = Math.max(10, Number(savedBrightness)) / 100;
      document.documentElement.style.filter = `brightness(${value})`;
    }

    // Battery API
    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setBatteryCharging(battery.charging);
        battery.addEventListener("levelchange", () => setBatteryLevel(Math.round(battery.level * 100)));
        battery.addEventListener("chargingchange", () => setBatteryCharging(battery.charging));
      });
    }

    // Online/Offline
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-6 flex-shrink-0 mt-4">
      {/* Left section - logo + status icons */}
      <div className="flex items-center gap-4">
        <img src="/logo.svg" alt="AG7" width={46} height={18} />
        <div className="flex items-center gap-[10px]">
          <button
            className="flex items-center justify-center transition-opacity duration-200 hover:opacity-70 flex-shrink-0"
            style={iconButtonStyle}
          >
            <BatteryIcon level={batteryLevel} charging={batteryCharging} />
          </button>
          {/* Bluetooth button with popup */}
          <div className="relative">
            <button
              className="flex items-center justify-center transition-opacity duration-200 hover:opacity-70 flex-shrink-0"
              style={iconButtonStyle}
              onClick={() => setBtOpen((v) => !v)}
            >
              <SignalIcon />
            </button>
            {btOpen && <BluetoothPopup onClose={() => setBtOpen(false)} />}
          </div>
          {/* WiFi button with popup */}
          <div className="relative">
            <button
              className="flex items-center justify-center transition-opacity duration-200 hover:opacity-70 flex-shrink-0"
              style={iconButtonStyle}
              onClick={() => setWifiOpen((v) => !v)}
            >
              <WifiIcon />
            </button>
            {wifiOpen && <WifiPopup onClose={() => setWifiOpen(false)} isOnline={isOnline} />}
          </div>
        </div>
      </div>

      {/* Center search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.9">
                <path d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7 4 11C4 14.866 7.13401 18 11 18Z" stroke="white" strokeWidth="1.2"/>
                <path d="M11 8C10.2044 8 9.44129 8.31607 8.87868 8.87868C8.31607 9.44129 8 10.2044 8 11M20 20L17 17" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              </g>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Enter your search request"
            className="w-[400px] h-[48px] bg-white/10 border border-white/10 rounded-full pl-12 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/30 transition-all duration-200 shadow-inner"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-[10px]">
        <div className="relative">
          <button
            className="flex items-center justify-center transition-opacity duration-200 hover:opacity-70 flex-shrink-0"
            style={iconButtonStyle}
            onClick={() => setVolumeOpen((v) => !v)}
          >
            <VolumeIcon />
          </button>
          {volumeOpen && <VolumePopup onClose={() => setVolumeOpen(false)} />}
        </div>
        <div className="relative">
          <button
            className="flex items-center justify-center transition-opacity duration-200 hover:opacity-70 flex-shrink-0"
            style={iconButtonStyle}
            onClick={() => setBrightnessOpen((v) => !v)}
          >
            <SunIcon />
          </button>
          {brightnessOpen && <BrightnessPopup onClose={() => setBrightnessOpen(false)} />}
        </div>
        <button
          className="flex items-center justify-center transition-opacity duration-200 hover:opacity-70 flex-shrink-0"
          style={iconButtonStyle}
        >
          <BellIcon />
        </button>
        <img
          src="/avatar-main.jpg"
          alt="Profile"
          width={48}
          height={48}
          className="w-[48px] h-[48px] rounded-full object-cover"
        />
      </div>
    </header>
  );
}
