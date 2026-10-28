# Visual validation — 27 October 2026

Historical frontend checks. Current enquiry storage and authentication are documented in [Supabase verification](supabase-validation.md).

## Results

- `npm run build`: PASS. Vite production build; route modules split; main compressed JS approximately 88 kB, career module approximately 20 kB.
- `npm run lint`: PASS, no errors/warnings.
- Dependency installation audit: zero known vulnerabilities at installation.
- Catalogue integrity: 80 unique and complete records; every related-career ID resolves; six packages; required local assets exist.
- Browser console: no errors or warnings in the checked navigation flows.
- All five routes checked at 1440×900, 1280×800, 768×1024, 390×844 and 360×800: no document horizontal overflow; one h1 on each page.
- Homepage screenshots saved for all five viewports. Desktop, tablet and mobile inspected visually. Reference desktop/mobile captures retain Claude's toolbar; site content was compared accounting for that vertical offset. Hero wrapping, spacing, colors and route geometry closely match. No claim of universal pixel-perfect fidelity.
- Local original images load. Lazy images were checked after scrolling into view. Fonts loaded during desktop capture.

## Interactions exercised

- Navigation between homepage, careers and contact; service-specific enquiry preselection.
- Combined `design` search with `New age` filter returns UX design; tile opens detail, moves focus to heading and offers related careers.
- Unmatched search shows the empty state; Clear filters restores catalogue.
- Mobile menu opens; Escape closes it and restores focus to Menu. Tab proceeds to the first form control with a visible 3px gold focus ring.
- Empty form shows four linked required-field errors and focuses student name.
- Valid dummy name, phone, email and stage plus interest checkbox shows the honest preview confirmation, resets the form and focuses the confirmation.
- Sticky header, button/card hover styles, route animation, vertical route and scroll reveal inspected.
- Cross-route anchors supported after lazy page loading.

## Accessibility and limits

Axe-core WCAG 2 A/AA, 2.1 AA and 2.2 AA: zero automated violations across Home, About, Services, Careers and Contact at 360px. Home and Contact each had one incomplete automated check; manual review remains necessary. Semantic landmarks, field labels/error associations, keyboard focus, mobile Escape and reduced-motion CSS were reviewed. This is not a complete screen-reader or WCAG conformance certification.

Core Web Vitals were not benchmarked; field INP needs real interaction telemetry. The saved screenshots cover homepage target viewports and a lower services section; every inner-page state was not visually compared at every viewport. Responsive geometry checks cover all five routes/sizes.

Original placeholders remain visible; contact channels require real production values. The contact form now saves enquiries through Supabase. Google Fonts needs network access; fallbacks are configured. Production hosting must serve index.html for SPA routes.

Raw results: [browser-results.json](browser-results.json). Evidence contract: [implementation-checklist.md](implementation-checklist.md).
