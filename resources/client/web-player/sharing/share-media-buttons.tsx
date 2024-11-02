import {IconButton, IconButtonProps} from '@ui/buttons/icon-button';
import {FacebookIcon} from '@ui/icons/social/facebook';
import {TwitterIcon} from '@ui/icons/social/twitter';
import {TumblrIcon} from '@ui/icons/social/tumblr';
import {ShareIcon} from '@ui/icons/material/Share';
import {toast} from '@ui/toast/toast';
import {message} from '@ui/i18n/message';
import {
  ShareableNetworks,
  shareLinkSocially,
} from '@ui/utils/urls/share-link-socially';

interface ShareButtonsProps {
  link: string;
  name?: string;
  image?: string;
  size?: IconButtonProps['size'];
}
export function ShareMediaButtons({
  link,
  name,
  image,
  size = 'lg',
}: ShareButtonsProps) {
  const share = (network: ShareableNetworks) => {
    shareLinkSocially(network, link, name, image);
  };

  return (
    <div>
      <IconButton
        size={size}
        onClick={() => share('facebook')}
        className="text-facebook"
      >
        <FacebookIcon />
      </IconButton>
      <IconButton
        size={size}
        onClick={() => share('twitter')}
        className="text-twitter"
      >
        <TwitterIcon />
      </IconButton>
      <IconButton
        size={size}
        onClick={() => share('tumblr')}
        className="text-tumblr"
      >
        <TumblrIcon viewBox="0 0 512 512" />
      </IconButton>
      {navigator.share && (
        <IconButton
          size={size}
          onClick={() => {
            try {
              navigator.share({
                title: name,
                url: link,
              });
            } catch (e) {
              if ((e as DOMException).name !== 'AbortError') {
                toast(message('Could not share link'));
              }
            }
          }}
          className="text-muted"
        >
          <ShareIcon />
        </IconButton>
      )}
    </div>
  );
}
