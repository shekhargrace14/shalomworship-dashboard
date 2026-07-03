import { AppSidebar } from '@/components/app-sidebar';
import ChannelsHydrator from '@/components/hydrator/hydrator-channels';
import UserHydrator from '@/components/hydrator/hydrator-user';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getCurrentUserService } from '@/lib/services/auth.service';
import { getChannelsService } from '../api/channel/service';

export default async function DashboardLayout({ children }: any) {
  const user = await getCurrentUserService();
  console.log(user.role, 'layout');

  const mine = !(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN');
  const channels = await getChannelsService(mine);
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6 ">
              <UserHydrator user={user}>
                <ChannelsHydrator channels={channels}>{children}</ChannelsHydrator>
              </UserHydrator>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
