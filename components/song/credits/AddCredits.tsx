"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

interface Credit {
  id: string;
  name: string;
  role: string;
}

const roles = [
  "Producer",
  "Composer",
  "Lyricist",
  "Singer",
  "Translator",
  "Arranger",
  "Mix Engineer",
  "Mastering Engineer",
];

export default function AddCredits() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const [credits, setCredits] = useState<Credit[]>([
    {
      id: "1",
      name: "Marcus Aurelius",
      role: "Producer",
    },
    {
      id: "2",
      name: "Sarah Vox",
      role: "Singer",
    },
  ]);

  function addCredit() {
    if (!name || !role) return;

    setCredits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        role,
      },
    ]);

    setName("");
    setRole("");
  }

  function removeCredit(id: string) {
    setCredits((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Credits
        </CardTitle>

        <Badge variant="secondary">
          {credits.length} Credits
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add Credit */}

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Input
              placeholder="Search channel or artist..."
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="lg:col-span-4">
            <Select
              value={role}
              onValueChange={setRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>

              <SelectContent>
                {roles.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2">
            <Button
              onClick={addCredit}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Credits */}

        <div className="space-y-3">
          {credits.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No credits added yet.
            </div>
          )}

          {credits.map((credit) => (
            <div
              key={credit.id}
              className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-accent/40"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {credit.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">
                    {credit.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Artist / Channel
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge>{credit.role}</Badge>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    removeCredit(credit.id)
                  }
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}

        <div className="flex items-center justify-between border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Credits will appear on the song page after
            saving.
          </p>

          <Button>
            Save Credits
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}