import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Balloon, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { channel } from '@prisma/client';

export function CardDemo({ data }: any) {
    // console.log(data, 'CardDemo');
    return (
        <Card className="w-full">
            <CardHeader>
                {/* <CardAction>
                    <Badge>{data?.verified ? 'Verified' : 'Not Verified '}</Badge>
                </CardAction> */}

                <div className="flex items-end gap-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={data?.avatar} />
                        <AvatarFallback>CS</AvatarFallback>
                    </Avatar>

                    <div>
                        <CardTitle className="text-2xl line-clamp-1">{data?.title}</CardTitle>

                        <CardDescription>Singer Songwriter & Producer</CardDescription>
                    </div>
                </div>
            </CardHeader>

            {/* <CardContent className="space-y-5">
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        connect@shalomworship.com
                    </div>

                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Verified Account
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Worship Leader</Badge>

                    <Badge variant="secondary">Producer</Badge>

                    <Badge variant="secondary">Song Writer</Badge>
                </div>
            </CardContent> */}

            {/* <CardFooter className="grid grid-cols-2 gap-2">
                <Button variant="outline">View Profile</Button>

                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite
                </Button>
            </CardFooter> */}
        </Card>
    );
}
