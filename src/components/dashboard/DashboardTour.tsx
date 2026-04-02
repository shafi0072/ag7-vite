

import { useState, useEffect } from "react";
import { Joyride, type EventData, type Step } from "react-joyride";

const steps: Step[] = [
  {
    target: "#tour-calendar",
    content: "View and manage your schedule here. Keep track of important dates and events.",
    title: "Calendar",
    skipBeacon: true,
  },
  {
    target: "#tour-areas-of-life",
    content: "Monitor your progress across different areas of life — work, health, personal growth, and more.",
    title: "Areas of Life",
    skipBeacon: true,
  },
  {
    target: "#tour-tasks",
    content: "Manage your tasks in a Kanban-style board. Drag and drop to update progress.",
    title: "Tasks",
    skipBeacon: true,
  },
  {
    target: "#tour-container-panel",
    content: "Quick stats and time-saving metrics at a glance.",
    title: "Stats Panel",
    skipBeacon: true,
  },
  {
    target: "#tour-tasks-done",
    content: "Track how many tasks you've completed over time.",
    title: "Tasks Done",
    skipBeacon: true,
  },
  {
    target: "#tour-ai-assistant",
    content: "Your personalised AI assistant helps boost productivity and manage your workflows.",
    title: "AI Assistant",
    skipBeacon: true,
  },
];

export default function DashboardTour() {
  const [mounted, setMounted] = useState(false);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!localStorage.getItem("ag7_tour_seen")) {
      const timer = setTimeout(() => setRun(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleEvent(data: EventData) {
    if (data.status === "finished" || data.status === "skipped") {
      setRun(false);
      localStorage.setItem("ag7_tour_seen", "1");
    }
  }

  if (!mounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleEvent}
      options={{
        arrowColor: "#431C10",
        backgroundColor: "#431C10",
        primaryColor: "#FF763A",
        textColor: "#ffffff",
        overlayColor: "rgba(0,0,0,0.7)",
        zIndex: 9999,
        showProgress: true,
        buttons: ["back", "primary", "skip"],
      }}
      styles={{
        tooltip: {
          borderRadius: "16px",
          padding: "20px",
          background: "#431C10",
          border: "1px solid #6b2e1a",
          boxShadow: "0 0 0 1px #3a1a0a, 0 24px 48px rgba(0,0,0,0.6)",
        },
        tooltipTitle: {
          color: "#FF6B1A",
          fontSize: "15px",
          fontWeight: 700,
          marginBottom: "6px",
        },
        tooltipContent: {
          color: "#9CA3AF",
          fontSize: "13px",
          lineHeight: "1.6",
          padding: "0",
        },
        tooltipFooter: {
          marginTop: "16px",
          gap: "8px",
        },
        buttonPrimary: {
          background: "#FF763A",
          color: "#fff",
          borderRadius: "10px",
          fontSize: "13px",
          fontWeight: 600,
          padding: "8px 16px",
          border: "none",
        },
        buttonBack: {
          color: "#6B7280",
          fontSize: "13px",
          fontWeight: 500,
          marginRight: "4px",
        },
        buttonSkip: {
          color: "#6B7280",
          fontSize: "13px",
          fontWeight: 500,
        },
        buttonClose: {
          color: "#6B7280",
          width: "16px",
          height: "16px",
        },
      }}
    />
  );
}
