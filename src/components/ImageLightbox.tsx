'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

type Shot = { src: string; alt: string };

/**
 * Opens a post's images full size: one dialog for the whole article, fed by
 * clicks on any `button.ik-zoom` (mdx-components wraps every image in one).
 *
 * An image in a gallery opens with its neighbours, so the arrows — on screen
 * and on the keyboard — step through the gallery; a lone image opens alone.
 * A native <dialog> traps focus and turns Escape into close; a click on the
 * backdrop closes it too.
 */
export default function ImageLightbox() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const [index, setIndex] = useState(0);
  const open = shots.length > 0;

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest<HTMLButtonElement>('button.ik-zoom');
      if (!button) return;
      const group = button.closest('.ik-gallery');
      const buttons = group ? [...group.querySelectorAll<HTMLButtonElement>('button.ik-zoom')] : [button];
      setShots(
        buttons.map((b) => {
          const img = b.querySelector('img');
          return { src: img?.currentSrc || img?.src || '', alt: img?.alt ?? '' };
        }),
      );
      setIndex(buttons.indexOf(button));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = useCallback(() => setShots([]), []);
  const step = useCallback(
    (by: number) => setIndex((i) => (i + by + shots.length) % shots.length),
    [shots.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const onKey = (event: KeyboardEvent) => {
      if (shots.length < 2) return;
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    // The dialog spans the viewport; a click on it rather than inside the
    // frame is a click on the backdrop.
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) close();
    };
    dialog.addEventListener('keydown', onKey);
    dialog.addEventListener('click', onClick);
    return () => {
      dialog.removeEventListener('keydown', onKey);
      dialog.removeEventListener('click', onClick);
    };
  }, [open, shots.length, step, close]);

  const shot = shots[index];
  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      aria-label={shot?.alt || 'Image'}
      className="ik-lightbox fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 p-4 sm:p-10"
    >
      {shot && (
        <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-4">
          {/* oxlint-disable-next-line nextjs/no-img-element -- the original, already loaded by the article */}
          <img src={shot.src} alt={shot.alt} className="pointer-events-auto max-h-[80vh] max-w-full rounded-[14px] object-contain" />
          <div className="pointer-events-auto flex items-center gap-3 text-white">
            {shots.length > 1 && (
              <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="ik-lightbox-btn">
                ←
              </button>
            )}
            <span className="font-mono max-w-[60vw] text-center text-[13px] opacity-80">
              {shots.length > 1 ? `${index + 1} / ${shots.length} · ` : ''}
              {shot.alt}
            </span>
            {shots.length > 1 && (
              <button type="button" onClick={() => step(1)} aria-label="Next image" className="ik-lightbox-btn">
                →
              </button>
            )}
          </div>
        </div>
      )}
      <button type="button" onClick={close} aria-label="Close" autoFocus className="ik-lightbox-btn absolute top-4 right-4">
        ✕
      </button>
    </dialog>
  );
}
