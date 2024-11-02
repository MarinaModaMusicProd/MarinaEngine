import {Trans} from '@ui/i18n/trans';
import {useSettings} from '@ui/settings/use-settings';
import claimLabelImage from './images/claim-label.jpg';
import claimArtistImage from './images/claim-artist.jpg';
import {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {usePrimaryArtistForCurrentUser} from '@app/web-player/backstage/use-primary-artist-for-current-user';
import clsx from 'clsx';
import {BackstageLayout} from '@app/web-player/backstage/backstage-layout';

export function BackstageTypeSelector() {
  const {branding} = useSettings();
  const isArtist = usePrimaryArtistForCurrentUser() != null;
  return (
    <BackstageLayout>
      <div className="my:20 mx-auto max-w-780 md:my-40">
        <h1 className="mb-10 text-center text-3xl font-medium md:text-5xl">
          <Trans
            message="Get access to :siteName for artists"
            values={{siteName: branding.site_name}}
          />
        </h1>
        <h2 className="mb-54 text-center text-lg font-medium">
          <Trans message="First, select the type of your request" />
        </h2>
        <div className="items-center gap-54 md:flex">
          <ClaimPanelLayout
            className="mb-14 md:mb-0"
            title={
              isArtist ? (
                <Trans message="Get verified" />
              ) : (
                <Trans message="Become an artist" />
              )
            }
            link={isArtist ? 'verify-artist' : 'become-artist'}
            image={claimArtistImage}
          />
          <ClaimPanelLayout
            title={<Trans message="Claim existing artist" />}
            link="claim-artist"
            image={claimLabelImage}
          />
        </div>
      </div>
    </BackstageLayout>
  );
}

interface ClaimPanelLayoutProps {
  title: ReactNode;
  link: string;
  image: string;
  className?: string;
}
function ClaimPanelLayout({
  title,
  image,
  link,
  className,
}: ClaimPanelLayoutProps) {
  return (
    <Link
      to={link}
      className={clsx(
        'block flex flex-auto cursor-pointer flex-col items-center justify-center rounded-md border border-2 bg-paper p-34 transition-shadow hover:bg-primary/4 hover:shadow-xl',
        className,
      )}
    >
      <h3 className="mb-10 text-lg font-medium">{title}</h3>
      <img
        className="h-132 w-132 rounded-full object-cover"
        src={image}
        alt=""
      />
    </Link>
  );
}
