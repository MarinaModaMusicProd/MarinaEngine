import {getBootstrapData} from '@ui/bootstrap-data/bootstrap-data-store';
import {getWidgetBootstrapData} from '@livechat/widget/use-widget-bootstrap-data';
import {getCurrentDateTime} from '@ui/i18n/use-current-date-time';
import {ChatVisit} from '@livechat/widget/chat/chat';

interface NavigationMessageData {
  source: 'livechat-loader';
  type: 'navigate';
  title: string;
  url: string;
  referer: string;
}

let currentVisit: ChatVisit | null = null;
let pendingVisitTimeout: ReturnType<typeof setTimeout> | null = null;

export function trackUserPageVisits() {
  window.addEventListener(
    'message',
    async (e: MessageEvent<NavigationMessageData>) => {
      if (e.data.source === 'livechat-loader' && e.data.type === 'navigate') {
        if (pendingVisitTimeout) {
          clearTimeout(pendingVisitTimeout);
        }

        if (currentVisit) {
          changeVisitStatus(currentVisit, 'ended');
          currentVisit = null;
        }

        // don't create a visit if user was on page for less than 5 sec,
        // to avoid creating visits for accidental clicks
        pendingVisitTimeout = setTimeout(async () => {
          currentVisit = await createNewVisit(e.data);
        }, 5000);
      }
    },
  );

  document.addEventListener('visibilitychange', e => {
    if (!currentVisit) return;
    if (document.visibilityState === 'hidden') {
      changeVisitStatus(currentVisit, 'ended');
    } else {
      changeVisitStatus(currentVisit, 'active');
    }
  });
}

async function createNewVisit({
  url,
  title,
  referer,
}: NavigationMessageData): Promise<ChatVisit> {
  const data = getWidgetBootstrapData();
  const response = await fetch(
    `${getBootstrapData().settings.base_url}/api/v1/lc/visitors/${
      data.mostRecentChat.visitor.id
    }/visits`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        url,
        title,
        referer,
        started_at: getCurrentDateTime().toAbsoluteString(),
      }),
    },
  );
  return (await response.json()).visit;
}

function changeVisitStatus(visit: ChatVisit, status: 'active' | 'ended') {
  const {base_url} = getBootstrapData().settings;
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      `${base_url}/lc/visits/${visit.id}/change-status`,
      JSON.stringify({status}),
    );
  }
}
