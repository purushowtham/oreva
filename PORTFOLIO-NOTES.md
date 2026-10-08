# ORÉVA portfolio

The homepage is a single-page portfolio in `app/page.tsx`, styled by `app/portfolio.css`. The previous homepage, layout and stylesheet were preserved in `.design-backup/`; existing components and assets remain available.

## Updating content

- Services, concept projects, process stages and material cards are defined near the top of `app/page.tsx`.
- The `Art` component creates the labelled sculptural photo placeholders. Replace these with your own project, material and studio photographs, preserving their aspect ratios and meaningful alt text.
- The three portfolio entries are explicitly illustrative concept studies, not claims of completed client work. Replace their titles, descriptions and project details when real work is supplied.
- Enquiries are addressed to `likhithac6@gmail.com`. The form validates required fields, then opens a mailto draft in the visitor’s email application. It does not send or store messages on a server.
- Motion respects the system reduced-motion preference and can also be turned off in the footer.

## Running

`npm run dev` for development. `npm run build` and `npm run start` for production.

## Design

Warm ivory, bronze and brown; Cormorant Garamond and Montserrat with local fallback fonts. Photo placeholders are rendered entirely in CSS. Motion includes masked entry, scroll reveals, restrained hero parallax, drifting detail, material transitions and an audience marquee. Native dialogs provide focus containment and Escape handling. The material journal supports touch scrolling, mouse dragging and arrow controls.

The supplied documents informed the palette, voice and content. Reference websites were treated as inspiration, not copied. This version uses a flowing single-page layout and lightweight sculptural illustrations rather than separate routes or a WebGL gallery.
