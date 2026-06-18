"use client";

import { MdCheck } from "react-icons/md";

const MarkEpisodeAsWatched = () => {
  return (
    <button className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-[var(--app-overlay-hover)]">
      <MdCheck className="mr-2 size-5" />
      <span>Mark Episode as Watched</span>
    </button>
  );
};

export default MarkEpisodeAsWatched;
