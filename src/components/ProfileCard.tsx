import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/lib/site-data';

/**
 * The author card that sits beside the blog — on the index and, from a wide
 * enough viewport, alongside an article too.
 *
 * Sticky positioning and whether it shows at all belong to the layouts that use
 * it: the index drops it at 760px, the article needs a good deal more room
 * before there is anywhere to put it.
 */
export default function ProfileCard() {
  return (
    <div className="bg-surface border-line shadow-card-sm flex flex-col items-center gap-3.5 rounded-[20px] border px-5 py-[26px] text-center">
      <span
        className="h-[76px] w-[76px] flex-none rounded-full p-[3px]"
        style={{ background: 'linear-gradient(135deg,var(--a1),var(--a3))' }}
      >
        <Image
          src="/profile-avatar.webp"
          alt={SITE.name}
          width={152}
          height={152}
          className="h-full w-full rounded-full object-cover"
        />
      </span>

      <span className="flex flex-col gap-[3px]">
        <span className="font-display text-ink text-base font-semibold">{SITE.name}</span>
        <span className="text-muted text-[12.5px]">{SITE.role}</span>
      </span>

      <p className="text-muted m-0 text-[12.5px] leading-[1.55]">
        Building fast, scalable web experiences — currently at ByteDance, previously Tokopedia.
      </p>

      <Link
        href="/"
        className="bg-primary w-full rounded-[11px] py-[11px] text-center text-[13.5px] font-semibold text-white no-underline"
      >
        View profile
      </Link>
    </div>
  );
}
