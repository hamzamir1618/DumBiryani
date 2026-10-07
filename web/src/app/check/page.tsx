"use client";

import { useEffect, useState } from "react";

/**
 * A diagnostic page. The scroll choreography depends on two things the
 * browser controls and the build cannot see from here — whether the machine
 * is asking for reduced motion, and whether scroll timelines actually work —
 * so this reads both on the machine that has the problem and says plainly
 * which one is biting.
 */

type Check = {
  label: string;
  value: string;
  ok: boolean;
  note?: string;
};

export default function CheckPage() {
  const [checks, setChecks] = useState<Check[] | null>(null);
  const [verdict, setVerdict] = useState("");

  useEffect(() => {
    const read = () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const claims = CSS.supports("animation-timeline: view()");

      // Put a real scroll-driven animation on the page and see what it got.
      const probe = document.createElement("div");
      probe.style.cssText =
        "position:fixed;top:-9999px;height:10px;width:10px;animation:check-spin 1s linear both;animation-timeline:view();";
      document.body.appendChild(probe);
      const anims = probe.getAnimations();
      const timeline = anims[0]?.timeline;
      const wired = Boolean(timeline && timeline !== document.timeline);
      const timelineName = timeline ? timeline.constructor.name : "none";
      probe.remove();

      // The pinned run rides a *named* view timeline. Some browsers do the
      // anonymous kind and not this one, and then only that set-piece is dead.
      const host = document.createElement("div");
      host.style.cssText =
        "position:fixed;top:-9999px;height:10px;width:10px;view-timeline-name:--probe;view-timeline-axis:block;";
      const inner = document.createElement("div");
      inner.style.cssText =
        "height:10px;width:10px;animation:check-spin 1s linear both;animation-timeline:--probe;";
      host.appendChild(inner);
      document.body.appendChild(host);
      const namedTl = inner.getAnimations()[0]?.timeline;
      const namedOk = Boolean(namedTl && namedTl !== document.timeline);
      const namedName = namedTl ? namedTl.constructor.name : "none";
      host.remove();

      const cls = document.documentElement.className;
      const engaged = /no-scene-timeline/.test(cls)
        ? "yes, the pot section only"
        : /no-timeline/.test(cls)
          ? "yes, the whole page"
          : "no";

      const rows: Check[] = [
        {
          label: "Reduced motion",
          value: reduced ? "ON — the system is asking for less motion" : "off",
          ok: !reduced,
          note: reduced
            ? "This is what stops the pot section moving. Windows: Settings → Accessibility → Visual effects → Animation effects. Battery saver also forces this off, so check that too, or plug the laptop in."
            : undefined,
        },
        {
          label: "Browser claims scroll-timeline support",
          value: claims ? "yes" : "no",
          ok: true,
        },
        {
          label: "Scroll timeline actually wired up",
          value: wired ? `yes (${timelineName})` : `no (${timelineName})`,
          ok: true,
          note: wired
            ? undefined
            : "The browser does not really do scroll-driven animation, so the page falls back to driving it from JavaScript.",
        },
        {
          label: "Named scroll timelines (the pot section)",
          value: namedOk ? `yes (${namedName})` : `NO (${namedName})`,
          ok: namedOk,
          note: namedOk
            ? undefined
            : "This is the one the pot section rides. Your browser does not do it, so that section has to be driven from JavaScript.",
        },
        {
          label: "JavaScript fallback engaged",
          value: engaged,
          ok: true,
          note:
            (!wired || !namedOk) && engaged === "no" && !reduced
              ? "This is wrong — the fallback should have taken over. Tell me this."
              : undefined,
        },
        {
          label: "Window",
          value: `${window.innerWidth} × ${window.innerHeight}`,
          ok: true,
        },
        { label: "Browser", value: navigator.userAgent, ok: true },
      ];

      setChecks(rows);
      setVerdict(
        reduced
          ? "Reduced motion is on. That is the problem — nothing will animate on scroll until it is off. Windows: Settings → Accessibility → Visual effects → Animation effects. Battery saver forces it off too, so check that or plug the laptop in."
          : (!wired || !namedOk) && engaged === "no"
            ? "Scroll timelines are missing here and the fallback has not taken over. Send me this page."
            : !namedOk
              ? "Your browser does not do named scroll timelines, which is exactly what the pot section rides. The fallback is driving it, so it should move now."
              : "Everything the page needs is working here. If a section still looks static, send me this page.",
      );
    };
    const id = requestAnimationFrame(() => requestAnimationFrame(read));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main
      style={{
        minHeight: "100svh",
        background: "#070f2b",
        color: "#fff",
        padding: "48px 24px",
        font: "16px/1.5 ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <style>
        {"@keyframes check-spin{from{rotate:0deg}to{rotate:360deg}}"}
      </style>
      {/* The driver looks for a real effect before deciding anything. This page
          has none of its own, so without this it would always report that the
          fallback had not engaged — a false alarm. */}
      <span
        className="s-rise"
        aria-hidden
        style={{ position: "fixed", top: -9999 }}
      />
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h1 style={{ fontSize: 30, fontWeight: 400, margin: 0 }}>
          Scroll animation check
        </h1>

        {!checks ? (
          <p style={{ opacity: 0.6, marginTop: 24 }}>Reading the browser…</p>
        ) : (
          <>
            <p
              style={{
                marginTop: 24,
                padding: "16px 20px",
                borderRadius: 12,
                background: verdict.startsWith("Reduced")
                  ? "#5c1d1d"
                  : "#13225c",
                border: "1px solid rgba(255,255,255,.18)",
              }}
            >
              {verdict}
            </p>

            <dl style={{ marginTop: 32 }}>
              {checks.map((c) => (
                <div
                  key={c.label}
                  style={{
                    padding: "16px 0",
                    borderTop: "1px solid rgba(255,255,255,.14)",
                  }}
                >
                  <dt
                    style={{
                      fontSize: 13,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      opacity: 0.6,
                    }}
                  >
                    {c.label}
                  </dt>
                  <dd
                    style={{
                      margin: "6px 0 0",
                      fontSize: 18,
                      wordBreak: "break-word",
                      color: c.ok ? "#2ec4ce" : "#ff9a8a",
                    }}
                  >
                    {c.value}
                  </dd>
                  {c.note && (
                    <p
                      style={{ margin: "8px 0 0", fontSize: 14, opacity: 0.75 }}
                    >
                      {c.note}
                    </p>
                  )}
                </div>
              ))}
            </dl>
          </>
        )}
      </div>
    </main>
  );
}
