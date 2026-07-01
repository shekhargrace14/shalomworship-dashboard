"use client";

import { useChannelsStore } from "@/store/useChannelsStore";
import { channel } from "@prisma/client";
import { useEffect } from "react";

export default function ChannelsHydrator({
  channels,
  children,
}: {
  channels: channel[];
  children: React.ReactNode;
}) {
  const setChannels = useChannelsStore((u) => u.set);

  useEffect(() => {
    setChannels(channels);
  }, [channels, setChannels]);

  return <>{children}</>;
}