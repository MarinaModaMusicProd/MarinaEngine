import {UserLink} from '@app/web-player/user-profile/user-link';
import {Tooltip} from '@ui/tooltip/tooltip';
import {IconButton} from '@ui/buttons/icon-button';
import {RemoteFavicon} from '@common/ui/other/remote-favicon';

interface ProfileLinksProps {
  links?: UserLink[];
}
export function ProfileLinks({links}: ProfileLinksProps) {
  if (!links?.length) return null;
  return (
    <div className="flex items-center">
      {links.map(link => (
        <Tooltip label={link.title} key={link.url}>
          <IconButton
            size="xs"
            elementType="a"
            href={link.url}
            target="_blank"
            rel="noreferrer"
          >
            <RemoteFavicon url={link.url} alt={link.title} />
          </IconButton>
        </Tooltip>
      ))}
    </div>
  );
}
