# Footer design QA

- Source of truth: `/Users/bandipurushowtham/.codex/generated_images/01a11bf6-33a7-76b2-b4c1-e4dacc6e6212/exec-65f3a677-d1d2-4280-ba22-bd5cc19b1dab.png` (third Italian footer concept, 1633 × 963).
- Implementation evidence: `/tmp/oreva-footer-desktop.png` (1440 × 900 viewport, footer below the 90 px fixed navigation) and `/tmp/oreva-footer-mobile.png` (390 × 844 viewport).
- Same-input comparison: `/tmp/oreva-footer-comparison.jpg`. The source and implementation footer were both center-cropped and scaled to 720 × 405 for side-by-side review; the fixed navigation was excluded from the implementation crop.
- State: page loaded at `http://localhost:3000/#contact`, reveal animation settled; mobile checked at the start of the footer and at the bottom where the image becomes visible.

## Fidelity review

| Surface | Result |
| --- | --- |
| Layout and composition | Passed. Ivory copy area and sunlit stone arch image retain the reference's two-part composition; mobile stacks copy before the image. |
| Typography and hierarchy | Passed. Large serif invitation, bronze italic line, prominent email, and restrained social row match the concept's reading order. |
| Color and imagery | Passed. Warm ivory, brown, bronze, and the generated travertine courtyard image preserve the Italian mood. |
| Interaction and accessibility | Passed. The email is a working `mailto:` link with a visible focus style. The image is decorative, reveal respects reduced motion, and the footer remains legible at 390 px. |
| Content and responsive behavior | Passed. The requested line element and Back to top link are removed. Extra tagline, repeated social notes, and oversized watermark were omitted to reduce clutter. |

## Findings and fix history

- P1: Existing global `footer` styles overrode the new text casing and spacing. Added scoped overrides; verified in the browser.
- P2: The first desktop heading was too large and entered the image more than intended. Reduced its size and verified the final balance.
- P2: On mobile the footer signature could sit behind the fixed navigation when the footer aligned at the viewport top. Increased mobile top spacing and verified the title and controls remain visible.
- No remaining P0 or P1 visual issues. `npm run build` passed with TypeScript checks.

final result: passed

## Home and landing update — 2026-10-11

Source visual truth: https://studiors.be/, captured in `/tmp/studiors-home-desktop.png` and `/tmp/studiors-home-mobile.png`.
Implementation: http://localhost:3000/, `/tmp/oreva-home-desktop.png` and `/tmp/oreva-home-mobile.png`.
Viewports and image dimensions: desktop 1280 × 720; mobile 390 × 844. Screenshots use one image pixel per CSS pixel; no density normalization required.
State: page top, entrance complete, 3D model loaded. Rotation phase varies because both source and implementation animate continuously.

Full-view comparison: source and implementation desktop/mobile images were opened together in the same comparison input. Both retain the large sans-serif/italic title, dark canvas, reflective 3D emblem behind the copy, and three compact navigation rows. The original ORÉVA SVG is extruded into a real beveled GLB; no replacement brand outline was drawn. Brand copy, warmer charcoal and bronze, existing navigation, and a color handoff replace the source's project names and repeated wordmark band intentionally. This is an ORÉVA adaptation of the captured composition, not a pixel-identical StudioRS copy.
Focused comparison: not needed for this scope; the emblem edges, heading, copy, and three links are readable in the full-size captures.

Required fidelity surfaces:
- Typography: retained the oversized sans-serif/italic hierarchy with ORÉVA's Montserrat and Cormorant Garamond. Source uses Cabinet Grotesk/Zodiak; retaining the existing brand families is intentional. No title clipping in final desktop/mobile captures.
- Spacing/layout: left title and right emblem/copy on desktop, layered title/emblem with copy and links below on mobile. Mobile stage starts at x=0 and document has no horizontal overflow.
- Colors/tokens: charcoal #141310, off-white heading, subdued warm gray italic, bronze model. The scroll animation approaches #EFECE5, identical to the next section; the short bridge covers the boundary.
- Assets: original logo contours retained, optimized GLB with extrusion, bevels, corrected winding, and bronze PBR material. Real WebGL canvas verified; SVG serves as a loading/WebGL-unavailable fallback.
- Copy: concise ORÉVA copy and working destinations for Selected projects, What we make, The ORÉVA method, and Enter the studio.

Comparison history / findings resolved:
1. [P1] Entrance/scroll timelines conflicted, leaving the copy and links transparent. Replaced implicit opacity capture with explicit from/to values; final captures show all content.
2. [P2] Mobile hero retained horizontal scroll after viewport resizing, clipping the title and copy. Changed overflow to clip; final mobile capture and DOM geometry confirm x=0 and no overflow.
3. [P2] Mirroring SVG coordinates reversed the model's triangle winding. Reversed triangle indices before GLB export and tuned bronze lighting; final screenshots show correctly lit front surfaces.

Validation:
- Desktop and mobile browser screenshots reviewed against the source together after fixes.
- Services link and mobile menu open/selection/close exercised.
- Hero Method link exercised; method heading and existing layout remain visible.
- Hero Selected projects link and subsequent scroll exercised; existing title/card reveal remains visible.
- Enter the studio link exercised; existing Curating spaces flythrough remains visible. Intermediate scroll background was sampled as rgb(150,147,142), transitioning to next section rgb(239,236,229).
- Console warning/error checks returned no entries in tested views.
- Production build and TypeScript passed after final code changes.
- Reduced-motion branch reviewed in code: intro/scroll motion disabled and logo rotation/pointer motion held static. OS-level reduced-motion and WebGL-unavailable states were not emulated in the browser.

Follow-up polish: fine tuning the logo's surface reflections is optional; its varying brightness follows rotation and light direction.
Implementation checklist: completed.
final result: passed
