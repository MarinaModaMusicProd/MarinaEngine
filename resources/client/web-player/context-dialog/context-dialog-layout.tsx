import {AnimatePresence} from 'framer-motion';
import {
  cloneElement,
  ComponentPropsWithRef,
  createContext,
  forwardRef,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {SvgIconProps} from '@ui/icons/svg-icon';
import clsx from 'clsx';
import {PlaylistPanel} from '@app/web-player/context-dialog/playlist-panel';
import {Track} from '@app/web-player/tracks/track';
import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {Link, To, useLocation} from 'react-router-dom';
import {usePrevious} from '@ui/utils/hooks/use-previous';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';

interface ContextMenuLayoutStateValue {
  playlistPanelIsActive: boolean;
  setPlaylistPanelIsActive: (value: boolean) => void;
  loadTracks: () => Promise<Track[]>;
}
export const ContextMenuLayoutState =
  createContext<ContextMenuLayoutStateValue>(null!);

export interface ContextMenuLayoutProps {
  image?: ReactElement<{className: string}> | null;
  title?: ReactElement | null;
  description?: ReactElement;
  children: ReactNode;
  loadTracks: () => Promise<Track[]>;
}
export function ContextDialogLayout({
  image,
  title,
  description,
  children,
  loadTracks,
}: ContextMenuLayoutProps) {
  const [playlistPanelIsActive, setPlaylistPanelIsActive] = useState(false);
  const {close} = useDialogContext();
  const contextValue: ContextMenuLayoutStateValue = useMemo(() => {
    return {
      playlistPanelIsActive,
      setPlaylistPanelIsActive,
      loadTracks,
    };
  }, [playlistPanelIsActive, loadTracks]);

  const {pathname} = useLocation();

  // close dialog on route change
  const previousPathname = usePrevious(pathname);
  useEffect(() => {
    if (previousPathname && previousPathname !== pathname) {
      close();
    }
  }, [pathname, previousPathname, close]);

  const header =
    image || title ? (
      <div className="mb-10 flex items-center gap-14 border-b p-14">
        {image && cloneElement(image, {className: 'w-44 h-44 rounded'})}
        <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
          {title}
          {description && (
            <div className="text-xs text-muted">{description}</div>
          )}
        </div>
      </div>
    ) : null;

  return (
    <ContextMenuLayoutState.Provider value={contextValue}>
      <Dialog size="xs">
        <DialogBody
          padding="p-0"
          onContextMenu={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="pb-10">
            {header}
            <AnimatePresence initial={false} mode="wait">
              {playlistPanelIsActive ? (
                <PlaylistPanel key="playlist-panel" />
              ) : (
                <ul key="menu" className="text-base md:text-sm">
                  {children}
                </ul>
              )}
            </AnimatePresence>
          </div>
        </DialogBody>
      </Dialog>
    </ContextMenuLayoutState.Provider>
  );
}

interface ButtonMenuItemProps
  extends Omit<ComponentPropsWithRef<'button'>, 'type'> {
  type?: 'button';
}

interface LinkMenuItemProps
  extends Omit<ComponentPropsWithRef<'link'>, 'type'> {
  type?: 'link';
}

type ContextMenuListItemProps = (ButtonMenuItemProps | LinkMenuItemProps) & {
  children: ReactNode;
  endIcon?: ReactElement<SvgIconProps>;
  startIcon?: ReactElement<SvgIconProps>;
  className?: string;
  to?: To;
};
export const ContextMenuButton = forwardRef<any, ContextMenuListItemProps>(
  (
    {
      children,
      endIcon,
      startIcon,
      className,
      type = 'button',
      to,
      ...buttonProps
    },
    ref,
  ) => {
    const Element = type === 'button' ? 'button' : Link;
    return (
      <li>
        <Element
          {...(buttonProps as any)}
          to={to as any}
          ref={ref}
          className={clsx(
            'flex w-full cursor-pointer items-center gap-12 px-20 py-12 text-left outline-none hover:bg-hover focus-visible:ring focus-visible:ring-inset',
            className,
          )}
        >
          {startIcon}
          <span className="mr-auto min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {children}
          </span>
          {endIcon}
        </Element>
      </li>
    );
  },
);
