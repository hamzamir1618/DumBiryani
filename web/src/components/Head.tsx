import type { ReactNode } from 'react';

/** The opening band of an inner page. Plain, because the landing page is where the work is. */
export function Head({
  label, title, urdu, lead, children,
}: { label?: string; title: string; urdu?: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="hd">
      {label && <p className="label">{label}</p>}
      <h1 className="hd-title">{title}</h1>
      {urdu && <p className="nastaliq hd-ur">{urdu}</p>}
      <span className="hd-rule" />
      {lead && <p className="hd-lead">{lead}</p>}
      {children}
    </header>
  );
}
