import React from 'react';
import {Skeleton} from '@ui/skeleton/skeleton';
import {SettingsSeparator} from '@common/admin/settings/form/settings-separator';
import {m} from 'framer-motion';
import {opacityAnimation} from '@ui/animation/opacity-animation';

export function SettingsFormLoadingIndicator() {
  return (
    <m.div className="text-sm" {...opacityAnimation}>
      <div>
        <Skeleton className="mb-4 max-w-140" />
        <Skeleton variant="rect" size="h-42 w-full" />
        <div className="mt-10 flex items-center gap-8">
          <Skeleton variant="rect" size="h-20 w-20" />
          <Skeleton className="max-w-64 text-xs" />
        </div>
      </div>
      <SettingsSeparator />
      <div>
        <Skeleton className="mb-4 max-w-140" />
        <Skeleton variant="rect" size="h-42 w-full" />
        <Skeleton className="mt-10 max-w-4/5 text-xs" />
      </div>
      <SettingsSeparator />
      <div>
        <Skeleton className="mb-4 max-w-140" />
        <Skeleton variant="rect" size="h-42 w-full" />
        <Skeleton className="mt-10 max-w-[90%] text-xs" />
      </div>
      <div>
        <div className="mt-20 flex items-center gap-12">
          <Skeleton variant="rect" size="h-20 w-40" radius="rounded-full" />
          <Skeleton className="max-w-140" />
        </div>
        <Skeleton className="mt-10 max-w-240 text-xs" />
      </div>
      <SettingsSeparator />
      <div>
        <Skeleton variant="rect" size="h-30 w-132" radius="rounded-button" />
        <div className="mt-14">
          <Skeleton className="max-w-240" />
          <Skeleton className="max-w-384" />
        </div>
      </div>
      <div className="mt-40">
        <Skeleton variant="rect" size="h-36 w-132" radius="rounded-button" />
      </div>
    </m.div>
  );
}
