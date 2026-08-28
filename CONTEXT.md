# indrakusuma.web.id

A single-page personal site, statically exported. The page is a fixed sequence of
**Sections**; this file names the concepts that recur across them so the code and
the conversation about it use the same words.

## Language

### Page structure

**Section**:
One numbered stop on the page, addressable by a hash and listed in the nav.
_Avoid_: block, panel

**Site Chrome**:
The fixed furniture that floats over every Section — the nav island and the theme
toggle.
_Avoid_: header, navbar

**Reveal**:
A fade-and-slide applied to an element the first time it enters the viewport.
_Avoid_: animation, transition

### Marquee

**Marquee**:
A track that scrolls its items horizontally forever, wrapping without a visible
seam.
_Avoid_: carousel, slider, ticker

**Set**:
One pass of a Marquee's items. A Marquee renders several copies of its Set and
translates by exactly one Set's width before wrapping.
_Avoid_: page, slide, batch

**Wrap width**:
The width of one Set — measured as the distance from the first item to its
counterpart in the next copy, never from the track's total width.

**Drift**:
A Marquee's unprompted movement, as opposed to movement the visitor caused by
dragging. Reduced motion suppresses Drift only; dragging still works.
_Avoid_: autoplay, scroll

## Relationships

- The page is an ordered list of **Sections**; **Site Chrome** floats above all of them
- A **Marquee** renders `copies` of its **Set**, derived from the **Wrap width** and the viewport
- A **Marquee** **Drifts** unless it is hovered, dragged, or the visitor asked for reduced motion
- Skills and Awards are each a **Marquee**; they differ only in rendering, not in looping

## Example dialogue

> **Dev:** "The awards strip leaves a gap on an ultrawide monitor — do we add more cards?"
> **Designer:** "No, more copies of the same **Set**. The **Wrap width** is fixed by the six cards; the copy count is whatever it takes to cover the viewport while the track travels one **Set**."
> **Dev:** "And with reduced motion on?"
> **Designer:** "No **Drift**. But it is still a **Marquee** — dragging it is the visitor asking, so that stays."

## Flagged ambiguities

- "Experience" names both the data type for one company in `site-data.ts` and the
  `Experience` Section component. Unresolved; they are distinct concepts.
- Section 04's eyebrow reads "Honors" while its nav label reads "Awards". The two
  are maintained separately and have drifted.
