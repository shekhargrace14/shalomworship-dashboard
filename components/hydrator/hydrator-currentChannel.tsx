"use client";

import { useCurrentChannelStore } from "@/store/useCurrentChannelStore";
import { ChannelWithSongs } from "@/types";
import { channel } from "@prisma/client";
import { useEffect } from "react";

export default function CurrentChannelHydrator({
  channel,
  children,
}: {
  channel: ChannelWithSongs | null;
  children: React.ReactNode;
}) {
  const setCurrentChannel = useCurrentChannelStore((u) => u.setCurrentChannel);

  useEffect(() => {
    setCurrentChannel(channel);
  }, [channel, setCurrentChannel]);

  return <>{children}</>;
}