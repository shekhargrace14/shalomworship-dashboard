import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Balloon, ChevronDown, ChevronUp, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { channel } from '@prisma/client';
import { useState } from 'react';

export function CardProfile({ data }: any) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardAction>
          <Badge onClick={() => setOpen((prev) => !prev)}>{open ? <ChevronUp /> : <ChevronDown />}</Badge>
        </CardAction>

        <div className="flex items-end gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={data?.avatar} />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-2xl line-clamp-1">{data?.title}</CardTitle>

            <CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Worship Leader</Badge>

                <Badge variant="secondary">Producer</Badge>

                <Badge variant="secondary">Song Writer</Badge>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* <CardContent className="space-y-5">
        <div className="space-y-2 text-sm text-muted-foreground flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            connect@shalomworship.com
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Verified Account
          </div>
        </div>

      </CardContent> */}
      {open && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" className="">
            View Profile
          </Button>

          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
