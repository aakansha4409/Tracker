import React from 'react';
import { TopBanner } from './TopBanner';
import { ProgressRow } from './ProgressRow';
import { ChecklistsRow } from './ChecklistsRow';
import { MiddleRow } from './MiddleRow';
import { TrackersRow } from './TrackersRow';
import { BottomRow } from './BottomRow';

export const MainDashboard = () => {
  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <TopBanner />
      <ProgressRow />
      <ChecklistsRow />
      <MiddleRow />
      <TrackersRow />
      <BottomRow />
    </div>
  );
};
