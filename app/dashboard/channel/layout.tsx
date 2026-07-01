import { ReactNode } from "react";

export default function ChannelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-full">
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </section>
    </div>
  );
}