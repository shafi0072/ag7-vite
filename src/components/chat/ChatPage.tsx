

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Mic,
  MoreHorizontal,
  ArrowUp,
  Shield,
  Clock,
  Zap,
  Send,
} from "lucide-react";
import { api } from "@/lib/api";

const ADD_MENU_ITEMS = [
  {
    label: "Add photos & files",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7185 1.38778 15.78 1.38778C16.8415 1.38778 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7822 4.32855 19.7822 5.39C19.7822 6.45145 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8"/>
      </svg>
    ),
  },
  {
    label: "Create image",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.93700 1.9502L11.197 5.6842L14.9 6.9342L11.197 8.1842L9.93700 11.9182L8.677 8.1842L4.974 6.9342L8.677 5.6842L9.93700 1.9502ZM19.065 10.066L19.937 12.626L22.497 13.498L19.937 14.37L19.065 16.93L18.193 14.37L15.633 13.498L18.193 12.626L19.065 10.066ZM16.25 17.5L17.5 21L21 22.25L17.5 23.5L16.25 27L15 23.5L11.5 22.25L15 21L16.25 17.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" strokeOpacity="0.8"/>
      </svg>
    ),
  },
  {
    label: "Thinking",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H15M12 3C10.4087 3 8.88258 3.63214 7.75736 4.75736C6.63214 5.88258 6 7.4087 6 9C6 10.4 6.45 11.69 7.22 12.73C7.67 13.35 8 14.34 8 15H16C16 14.34 16.34 13.35 16.78 12.73C17.55 11.69 18 10.4 18 9C18 7.4087 17.3679 5.88258 16.2426 4.75736C15.1174 3.63214 13.5913 3 12 3ZM12 6V9M12 9L14 11M12 9L10 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8"/>
      </svg>
    ),
    active: true,
  },
  {
    label: "Research",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8"/>
        <path d="M21 21L15 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8"/>
        <path d="M10 7C9 7 7 7.6 7 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8"/>
      </svg>
    ),
  },
];

function PaletteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.99998 14.6667C7.1245 14.6667 6.25759 14.4942 5.44876 14.1592C4.63992 13.8242 3.90499 13.3331 3.28593 12.714C2.03569 11.4638 1.33331 9.76811 1.33331 8C1.33331 6.23189 2.03569 4.5362 3.28593 3.28595C4.53618 2.03571 6.23187 1.33333 7.99998 1.33333C11.6666 1.33333 14.6666 4 14.6666 7.33333C14.6666 8.3942 14.2452 9.41161 13.4951 10.1618C12.7449 10.9119 11.7275 11.3333 10.6666 11.3333H9.46665C9.26665 11.3333 9.13331 11.4667 9.13331 11.6667C9.13331 11.7333 9.19998 11.8 9.19998 11.8667C9.46665 12.2 9.59998 12.6 9.59998 13C9.66665 13.9333 8.93331 14.6667 7.99998 14.6667ZM7.99998 2.66667C6.58549 2.66667 5.22894 3.22857 4.22874 4.22876C3.22855 5.22896 2.66665 6.58551 2.66665 8C2.66665 9.41449 3.22855 10.771 4.22874 11.7712C5.22894 12.7714 6.58549 13.3333 7.99998 13.3333C8.19998 13.3333 8.33331 13.2 8.33331 13C8.33331 12.8667 8.26665 12.8 8.26665 12.7333C7.99998 12.4 7.86665 12.0667 7.86665 11.6667C7.86665 10.7333 8.59998 10 9.53331 10H10.6666C11.3739 10 12.0522 9.71905 12.5523 9.21895C13.0524 8.71885 13.3333 8.04058 13.3333 7.33333C13.3333 4.73333 10.9333 2.66667 7.99998 2.66667ZM4.33331 6.66667C4.86665 6.66667 5.33331 7.13333 5.33331 7.66667C5.33331 8.2 4.86665 8.66667 4.33331 8.66667C3.79998 8.66667 3.33331 8.2 3.33331 7.66667C3.33331 7.13333 3.79998 6.66667 4.33331 6.66667ZM6.33331 4C6.86665 4 7.33331 4.46667 7.33331 5C7.33331 5.53333 6.86665 6 6.33331 6C5.79998 6 5.33331 5.53333 5.33331 5C5.33331 4.46667 5.79998 4 6.33331 4ZM9.66665 4C10.2 4 10.6666 4.46667 10.6666 5C10.6666 5.53333 10.2 6 9.66665 6C9.13331 6 8.66665 5.53333 8.66665 5C8.66665 4.46667 9.13331 4 9.66665 4ZM11.6666 6.66667C12.2 6.66667 12.6666 7.13333 12.6666 7.66667C12.6666 8.2 12.2 8.66667 11.6666 8.66667C11.1333 8.66667 10.6666 8.2 10.6666 7.66667C10.6666 7.13333 11.1333 6.66667 11.6666 6.66667Z" fill="white"/>
    </svg>
  );
}

function AddMenu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<string[]>(["Thinking"]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  function handleItemClick(label: string) {
    if (label === "Add photos & files") {
      fileInputRef.current?.click();
      return;
    }
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  }

  return (
    <div ref={ref} className="absolute top-full mt-2 left-0 z-50">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        multiple
        className="hidden"
      />
      <div
        className="rounded-2xl overflow-hidden"
        style={{ width: 280, background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {ADD_MENU_ITEMS.map((item, i) => {
          const isActive = selected.includes(item.label);
          return (
            <div key={item.label}>
              <button
                onClick={() => handleItemClick(item.label)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-white/5"
                style={{ background: isActive ? "rgba(255,255,255,0.08)" : "transparent" }}
              >
                {item.icon}
                <span className="text-sm text-white">{item.label}</span>
              </button>
              {i === 0 && <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const COLORS = ["#000000", "#ef4444", "#22c55e", "#3b82f6", "#eab308", "#06b6d4", "#f97316"];
const SIZES = [4, 8, 14];

function SketchDrawModal({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState(1);
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  function getPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((h) => [...h, snap]);
    isDrawing.current = true;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = SIZES[size];
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDraw() { isDrawing.current = false; }

  function undo() {
    if (!history.length) return;
    const prev = history[history.length - 1];
    canvasRef.current!.getContext("2d")!.putImageData(prev, 0, 0);
    setHistory((h) => h.slice(0, -1));
  }

  function clear() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
  }

  function saveToChat() {
    canvasRef.current!.toBlob((blob) => {
      if (blob) console.log("Saved sketch:", blob);
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="rounded-lg overflow-hidden flex flex-col" style={{ width: 1080, height: 569, background: "#2c2c2e", padding: 24, gap: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold text-base">Sketch &amp; Draw</span>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Size */}
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-xs">Size:</span>
              {SIZES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSize(i)}
                  className="flex items-center justify-center rounded-full transition-all"
                  style={{
                    width: 22, height: 22,
                    border: size === i ? "2px solid #FF7439" : "2px solid rgba(255,255,255,0.2)",
                    background: size === i ? "rgba(255,116,57,0.15)" : "transparent",
                  }}
                >
                  <div className="rounded-full bg-white" style={{ width: s / 2, height: s / 2 }} />
                </button>
              ))}
            </div>
            {/* Colors */}
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-xs">Color:</span>
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="rounded-md transition-all"
                  style={{
                    width: 22, height: 22,
                    background: c,
                    outline: color === c ? "2px solid #FF7439" : "2px solid transparent",
                    outlineOffset: 2,
                  }}
                />
              ))}
              {/* Custom color */}
              <label className="cursor-pointer text-white/50 hover:text-white transition-colors" title="Custom color">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L9.5 9.5H2L7.75 13.75L5.5 21L12 16.75L18.5 21L16.25 13.75L22 9.5H14.5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="hidden" />
              </label>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={undo} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 7H16C18.761 7 21 9.239 21 12C21 14.761 18.761 17 16 17H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 3L3 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Undo
            </button>
            <button onClick={clear} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M8 6V4H16V6M19 6L18 20H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Clear
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={1032}
            height={300}
            className="cursor-crosshair"
            style={{ display: "block", width: 1032, height: 300, background: "rgba(255,255,255,0.1)", borderRadius: 8, opacity: 0.8 }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-white text-sm hover:bg-white/5 transition-colors" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
            Cancel
          </button>
          <button onClick={saveToChat} className="px-5 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90" style={{ background: "#FF7439" }}>
            Save to Chat
          </button>
        </div>
      </div>
    </div>
  );
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  time: string;
  /** Set on the error bubble so the user can retry the last request. */
  failed?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [draggableOpen, setDraggableOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const chatHistory = [
      ...messages.filter((m) => !m.failed).map((m) => ({
        role: m.sender === "user" ? "user" as const : "assistant" as const,
        content: m.text,
      })),
      { role: "user" as const, content: text },
    ];
    sendToAI(chatHistory);
  }

  function sendToAI(chatHistory: { role: "user" | "assistant"; content: string }[]) {
    setIsTyping(true);
    api.chat
      .send(chatHistory)
      .then((data) => {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          sender: "bot",
          time: getTime(),
        };
        setMessages((prev) => [...prev, botMsg]);
      })
      .catch((err) => {
        console.error("Chat error:", err);
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: err instanceof Error && err.message ? `Couldn't get a reply: ${err.message}` : "Sorry, I couldn't process your request.",
          sender: "bot",
          time: getTime(),
          failed: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  }

  function handleRetry(failedId: string) {
    const remaining = messages.filter((m) => m.id !== failedId);
    setMessages(remaining);
    sendToAI(
      remaining.filter((m) => !m.failed).map((m) => ({
        role: m.sender === "user" ? "user" as const : "assistant" as const,
        content: m.text,
      }))
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-104px)] max-w-2xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-white text-3xl font-bold mb-2">
            Hello! How can we assist you today?
          </h1>
          {/* <p className="text-text-secondary text-sm">
            Your AI-powered assistant is ready to help
          </p> */}
        </div>

        <div className="w-full mb-5 relative">
          {addMenuOpen && <AddMenu onClose={() => setAddMenuOpen(false)} />}
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              rows={4}
              className="w-full bg-transparent p-4 pb-0 text-white text-sm placeholder:text-text-secondary focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <button
                  className="h-8 w-8 p-1.5 flex items-center justify-center rounded-full bg-[#FFFFFF33] text-white hover:bg-white/40 transition-all duration-200"
                  onClick={() => setAddMenuOpen((v) => !v)}
                >
                  <Plus size={16} />
                </button>
                <button className="text-text-white hover:text-secondary transition-colors duration-200">
                  <Mic size={16} />
                </button>
                <button className="text-text-white hover:text-secondary transition-colors duration-200" onClick={() => setDraggableOpen((v) => !v)}>
                  <PaletteIcon />
                </button>
                <button className="text-text-white hover:text-secondary transition-colors duration-200">
                  <MoreHorizontal size={16} />
                </button>
                {draggableOpen && <SketchDrawModal onClose={() => setDraggableOpen(false)} />}
              </div>
              <button onClick={handleSend} className="h-8 w-8 p-1.5 flex items-center justify-center rounded-full bg-[#FFFFFF33] text-white hover:bg-white/40 transition-all duration-200">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2 text-white text-xs">
            <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center">
              <Clock size={12} />
            </div>
            <span>Works 24/7</span>
          </div>
          <div className="flex items-center gap-2 text-white text-xs">
            <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center">
              <Shield size={12} />
            </div>
            <span>Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-white text-xs">
            <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center">
              <Zap size={12} />
            </div>
            <span>1000+ Automations</span>
          </div>
        </div>

        <p className="text-text-secondary text-[11px]">
          By using Agent 7, you agree to our{" "}
          <span className="text-white/60 hover:text-white cursor-pointer transition-colors duration-200">
            Terms
          </span>{" "}
          and{" "}
          <span className="text-white/60 hover:text-white cursor-pointer transition-colors duration-200">
            Privacy Policy
          </span>
        </p>
      </div>
    );
  }

  // Chat view with messages
  return (
    <div className="flex flex-col h-[calc(100vh-104px)] max-w-3xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.sender === "user"
                ? "bg-accent text-white rounded-br-md"
                : msg.failed
                  ? "bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-md"
                  : "bg-surface border border-border text-white rounded-bl-md"
                }`}
            >
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
              {msg.failed && (
                <button
                  onClick={() => handleRetry(msg.id)}
                  disabled={isTyping}
                  className="mt-2 px-3 py-1 rounded-btn bg-white/10 text-white text-xs hover:bg-white/15 disabled:opacity-50"
                >
                  Retry
                </button>
              )}
              <p
                className={`text-[10px] mt-1.5 ${msg.sender === "user" ? "text-white/60" : "text-text-secondary"
                  }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-surface border border-border text-white rounded-bl-md">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pb-4 px-2 relative">
        {addMenuOpen && <AddMenu onClose={() => setAddMenuOpen(false)} />}
        <div className="bg-surface border border-border rounded-card overflow-hidden">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            rows={2}
            className="w-full bg-transparent p-4 pb-0 text-white text-sm placeholder:text-text-secondary focus:outline-none resize-none"
          />
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary hover:text-white transition-colors duration-200"
                onClick={() => setAddMenuOpen((v) => !v)}
              >
                <Plus size={16} />
              </button>
              <button className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary hover:text-white transition-colors duration-200">
                <Mic size={16} />
              </button>
              <button className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary hover:text-white transition-colors duration-200" onClick={() => setDraggableOpen((v) => !v)}>
                <PaletteIcon />
              </button>
              <button className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary hover:text-white transition-colors duration-200">
                <MoreHorizontal size={16} />
              </button>
              {draggableOpen && <SketchDrawModal onClose={() => setDraggableOpen(false)} />}
            </div>
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent/90 transition-colors duration-200"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
