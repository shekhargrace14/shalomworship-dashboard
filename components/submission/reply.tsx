"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ReplyProps {
    id: string;
    email: string;
    name?: string;
    subject?: string;
}

export default function Reply({
    id,
    email,
    name,
    subject,
}: ReplyProps) {
    const [message, setMessage] = useState("");
    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        try {
            console.log({email,name,subject,message})
            const res = await fetch(`/api/submission/${id}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    name,
                    subject,
                    message,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error("Failed to send reply");
                return;
            }

            toast.success("Reply sent");
            setMessage("");

            console.log(data);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-4 rounded-lg border p-4"
        >
            <Input
                value={name}
                disabled
            />

            <Input
                value={email}
                disabled
            />

            <Input
                value={subject}
                disabled
            />

            <Textarea
                rows={6}
                placeholder="Write your reply..."
                value={message}
                onChange={(e) =>
                    setMessage(e.target.value)
                }
            />

            <Button type="submit">
                Send Reply
            </Button>
        </form>
    );
}