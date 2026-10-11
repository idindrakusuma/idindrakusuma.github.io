/**
 * Replays the hero's entrance on an element that has just come back into view
 * — a filtered-in post card, or a /projects list.
 *
 * Removing the class, forcing layout, then adding it back is what restarts the
 * animation; a class that is already there does not replay. The animation fills
 * forwards, and a filled animation outranks ordinary rules — left in place it
 * would pin `transform` and kill a card's hover lift — so the class comes off
 * once the element's own animation ends. Only its own: animations of its
 * children (a card's reveal) bubble up as `animationend` too.
 */
export function replayEntrance(el: HTMLElement, delayMs = 0): void {
  el.classList.remove('ik-post-enter');
  void el.offsetWidth;
  el.style.animationDelay = delayMs ? `${delayMs}ms` : '';
  el.classList.add('ik-post-enter');
  const done = (event: AnimationEvent) => {
    if (event.target !== el) return;
    el.classList.remove('ik-post-enter');
    el.style.animationDelay = '';
    el.removeEventListener('animationend', done);
  };
  el.addEventListener('animationend', done);
}
