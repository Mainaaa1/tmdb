import Image from 'next/image';
import type { CastMember } from '@/lib/types';
import { posterSrc } from '@/lib/format';

type CastListProps = {
  cast: CastMember[];
};

export function CastList({ cast }: CastListProps) {
  if (!cast.length) {
    return <p className="text-sm text-white/55">Cast data is unavailable for this title.</p>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {cast.map((member) => {
        const image = posterSrc(member.profilePath, 'w342');
        return (
          <div
            key={member.id}
            className="w-[64px] flex-shrink-0 text-center"
          >
            <div className="relative mx-auto mb-2 h-[52px] w-[52px] overflow-hidden rounded-full bg-ink-800 ring-2 ring-white/10">
              {image ? (
                <Image src={image} alt={member.name} fill className="object-cover" sizes="56px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/45">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <p className="truncate text-[11px] text-white/75">{member.name}</p>
          </div>
        );
      })}
    </div>
  );
}
