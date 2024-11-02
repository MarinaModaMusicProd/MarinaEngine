import {Trans} from '@ui/i18n/trans';
import {ReactNode} from 'react';
import {ChatVisitor} from '@livechat/widget/chat/chat';
import {useSettings} from '@ui/settings/use-settings';

interface Props {
  visitor: ChatVisitor;
}
export function TechnologyPanel({visitor}: Props) {
  return (
    <div className="space-y-8 text-sm">
      <PanelItem label={<Trans message="IP address" />}>
        {visitor.user_ip}
      </PanelItem>
      <PanelItem label={<Trans message="Platform" />}>
        <PlatformIcon platformName={visitor.platform} />{' '}
        <span className="capitalize">
          <Trans message={visitor.platform} />
        </span>
      </PanelItem>
      <PanelItem label={<Trans message="Browser" />}>
        <BrowserIcon browserName={visitor.browser} />{' '}
        <span className="capitalize">
          <Trans message={visitor.browser} />
        </span>
      </PanelItem>
      <PanelItem label={<Trans message="Device" />}>
        <span className="capitalize">
          <Trans message={visitor.device} />
        </span>
      </PanelItem>
    </div>
  );
}

interface PanelItemProps {
  label: ReactNode;
  children: ReactNode;
}
function PanelItem({label, children}: PanelItemProps) {
  return (
    <div>
      <span className="text-muted">{label}</span>: {children}
    </div>
  );
}

const browsers = ['chrome', 'firefox', 'safari', 'edge', 'brave', 'opera'];
interface BrowserIconProps {
  browserName: string;
}
function BrowserIcon({browserName}: BrowserIconProps) {
  const {base_url} = useSettings();
  const normalizedName = browsers.find(b =>
    browserName.toLowerCase().includes(b.toLowerCase()),
  );
  if (normalizedName) {
    return (
      <img
        src={`${base_url}/images/browsers/${normalizedName}.svg`}
        alt={browserName}
        className="inline-block h-12 w-12 align-middle"
      />
    );
  }
}

const platforms = ['windows', 'osx', 'linux', 'android', 'ios'];
interface PlatformIconProps {
  platformName: string;
}
function PlatformIcon({platformName}: PlatformIconProps) {
  const {base_url} = useSettings();
  const normalizedName = platforms.find(p => {
    return platformName
      .toLowerCase()
      .replace(' ', '')
      .includes(p.replace(' ', '').toLowerCase());
  });
  if (normalizedName) {
    return (
      <img
        src={`${base_url}/images/platforms/${normalizedName}.png`}
        alt={platformName}
        className="mb-2 inline-block h-12 w-12 align-middle"
      />
    );
  }
}
