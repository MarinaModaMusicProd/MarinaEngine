import {useSettings} from '@ui/settings/use-settings';
import {useAuth} from '@common/auth/use-auth';
import React, {Fragment, useMemo} from 'react';
import {Button} from '@ui/buttons/button';
import {Link} from 'react-router-dom';
import {Trans} from '@ui/i18n/trans';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {usePrimaryArtistForCurrentUser} from '@app/web-player/backstage/use-primary-artist-for-current-user';
import {MenuItem} from '@ui/menu/menu-trigger';
import {MicIcon} from '@ui/icons/material/Mic';
import {getArtistLink} from '@app/web-player/artists/artist-link';
import {Navbar} from '@common/ui/navigation/navbar/navbar';
import {SearchAutocomplete} from '@app/web-player/search/search-autocomplete';
import clsx from 'clsx';

interface Props {
  className?: string;
}
export function PlayerNavbar({className}: Props) {
  const navigate = useNavigate();
  const primaryArtist = usePrimaryArtistForCurrentUser();
  const {player} = useSettings();
  const menuItems = useMemo(() => {
    if (primaryArtist) {
      return [
        <MenuItem
          value="author"
          key="author"
          startIcon={<MicIcon />}
          onSelected={() => {
            navigate(getArtistLink(primaryArtist));
          }}
        >
          <Trans message="Artist profile" />
        </MenuItem>,
      ];
    }
    if (player?.show_become_artist_btn) {
      return [
        <MenuItem
          value="author"
          key="author"
          startIcon={<MicIcon />}
          onSelected={() => {
            navigate('/backstage/requests');
          }}
        >
          <Trans message="Become an author" />
        </MenuItem>,
      ];
    }

    return [];
  }, [primaryArtist, navigate, player?.show_become_artist_btn]);

  return (
    <Navbar
      hideLogo
      color="bg"
      darkModeColor="bg"
      size="sm"
      authMenuItems={menuItems}
      className={clsx('dashboard-grid-header', className)}
    >
      <SearchAutocomplete />
      <ActionButtons />
    </Navbar>
  );
}

function ActionButtons() {
  const {player, billing} = useSettings();
  const {isLoggedIn, hasPermission, isSubscribed} = useAuth();

  const showUploadButton =
    player?.show_upload_btn && isLoggedIn && hasPermission('music.create');
  const showTryProButton =
    billing?.enable && hasPermission('plans.view') && !isSubscribed;

  return (
    <Fragment>
      {showTryProButton ? (
        <Button
          variant="outline"
          size="xs"
          color="primary"
          elementType={Link}
          to="/pricing"
        >
          <Trans message="Try Pro" />
        </Button>
      ) : null}
      {showUploadButton ? (
        <Button
          variant={showTryProButton ? 'text' : 'outline'}
          size="xs"
          color={showTryProButton ? undefined : 'primary'}
          elementType={Link}
          to="/backstage/upload"
        >
          <Trans message="Upload" />
        </Button>
      ) : null}
    </Fragment>
  );
}
