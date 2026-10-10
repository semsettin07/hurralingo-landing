# Hurra Lingo landing — Phase 3 report

Date: 10 October 2026 (Europe/Istanbul).

## 1. Files modified

- `index.html`: Turkish content corrections and scoped text-fit adjustments.
- `en.html`: equivalent English corrections and text-fit adjustments.
- `PHASE-3-REPORT.md`: this report.

No framework, dependencies, media assets, desktop-density stylesheet or responsive breakpoints were changed. The older `hurralingo` repository was not modified.

## 2. Changes completed

- Removed the yellow teacher badge while retaining the teacher image, white information card, expert-teacher heading, discovery copy and tutor-section link.
- Updated the Q&A heading and subtitle in both languages. All six videos, posters, order, cards, arrows and playback code remain.
- Removed the separate speaking-lesson price promotion and its trial CTA.
- Corrected the application explanation: submit the external form, receive an education consultant's call, agree on a time together, then meet the teacher for the introductory lesson.
- Standardized trial CTA labels to “Ücretsiz Tanışma Dersi” / “Free Introductory Lesson”, including generated tutor cards, header, drawer, announcements, hero, programs, pricing, process, closing section and mobile bar. English references to the same lesson now use introductory terminology.
- Removed the footer agency disclaimer and unverified registration placeholders/claim, retaining copyright and all other footer elements and links.
- Checked price units: all three main pricing cards already say “ders başı” / “per lesson”; the summary also already identifies its amounts as per lesson. No redundant labels were added.
- Made two narrowly scoped CSS adjustments for the longer copy: mobile tutor labels use two lines within the existing approximately 32px action height, preserving their roll animation; the Q&A final word and mascot stay together with enough space to avoid clipping or overlap. Existing font sizes, colors, layouts and breakpoints remain.

Implementation detail: the summary teacher card in this checkout uses `media/neden-ogretmen.jpg`, not a video element. That original image and its white card were preserved. No video was replaced or added.

## 3. Removed components

- Teacher card's `nd-stamp` badge and its exclusive base, hover, focus and mobile CSS.
- Entire `fy-extra` speaking promotion, including the separate ₺499,75 / ₺499.75 amount, free-trial link and exclusive CSS.
- Footer agency prototype disclaimer in Turkish and English.
- `[Ticari unvan]` / `[Company name]`, MERSİS/MERSIS number placeholders, and the unsupported ETBİS/ETBIS registration assertion.

Main pricing cards and unrelated free-lesson information were retained. No internal application form or booking interface was introduced.

## 4. Updated Turkish and English copy

| Location | Turkish | English |
| --- | --- | --- |
| Q&A title | Merak edilen soruları yanıtlıyoruz | We Answer Your Questions |
| Q&A subtitle | En çok merak edilen sorularımızı Öğretmen ve Eğitim Danışmanlarımız yanıtlıyor. | Our teachers and education consultants answer the questions you are most curious about. |
| Application wording | Formu doldurun, eğitim danışmanlarımız sizi arasın. | Fill out the form, and our education consultants will call you. |
| First-step explanation | Formu doldurun, eğitim danışmanımız sizi arasın ve size uygun saati birlikte belirleyin. Öğretmen, tanışma dersinde seviyeyi ve hedefleri belirler. | Fill out the form, and our education consultant will call you to agree on a suitable time together. During the introductory lesson, the teacher identifies the level and goals. |
| First-step illustration label | Birlikte planlayın | Plan together |
| Main CTA terminology | Ücretsiz Tanışma Dersi | Free Introductory Lesson |
| Footer copyright | © 2026 Hurra Lingo | © 2026 Hurra Lingo |

The first-step time chips remain static illustration elements; they do not book or select a lesson.

## 5. Business information verified or missing

Repository content and the prior Phase 1 report were inspected. No previously verified official business title, MERSİS number or ETBİS registration evidence was found. The previous footer contained placeholders and an unsupported registration statement.

All three fields remain unresolved in this report and are omitted from the visible footer. No company name, registration number or registration status was invented. Existing legal-document text/links were not changed; Phase 1's unresolved legal-document items remain unresolved.

## 6. Pricing validation results

| Approved item | Result |
| --- | --- |
| Group starting price | ₺446, unchanged |
| Group range | ₺446–550, unchanged |
| Mini-group starting price | ₺623, unchanged |
| Private starting price | ₺890, unchanged |
| Example duration and lessons | 12 months, 96 lessons, unchanged |
| Pay in full | ₺85.440; ₺890 per lesson, unchanged |
| Installments | ₺94.944; 12 × ₺7.912; ₺989 per lesson, unchanged |
| Installment difference | ₺9.504, unchanged |
| Comparison bars | Existing 90% / 100% proportions retained |
| Units | Explicit per-lesson notes already present in summary and main cards |

English amounts retain their existing comma thousands separators (₺85,440, ₺94,944, ₺7,912 and ₺9,504). Browser tests exercised both payment modes on both pages; totals, monthly payment and per-lesson amounts passed. The entire payment script matches the pre-edit version after line-ending normalization. No calculation or amount was changed.

## 7. Responsive and functional validation

Local installed Chrome/Playwright checks covered both pages at every requested width:

| Width | Turkish | English |
| --- | --- | --- |
| 390px | Pass | Pass |
| 768px | Pass | Pass |
| 1024px | Pass | Pass |
| 1440px | Pass | Pass |

Checks include page overflow, text clipping, tutor-action alignment, greeting overlap, correct trial-link attributes, media loading, browser console and page errors. The final heading checks additionally verify mascot bounds and overlap with heading text, and clipping of trial links. Screenshots of changed sections were captured and key mobile/desktop layouts visually inspected. Intentional internal horizontal rails, sticky navigation and the mobile action bar remain part of the original design.

Additional checks passed:

- Yellow badge and speaking promotion absent; white teacher information card retained.
- 59 rendered trial links per page (previously 60; the removed speaking promotion accounts for the difference). All use `https://www.hurralingo.app/trial-request`, `target="_blank"` and `rel="noopener noreferrer"`.
- Actual popup clicks from hero, program, main pricing, tutor, process, closing and mobile drawer CTAs reach the correct destination. The QA harness intercepted destination requests; no application was submitted.
- All six Q&A videos played in the existing dialog on each page, with valid duration, advancing playback time and no media error. Slider next navigation and dialog closing passed.
- All 42 tutor entries and their asset references match the pre-edit versions. Existing seven-language options and Chinese tutor/filter remain. All tutor photos decode.
- Media/poster references match the pre-edit versions. Non-trial anchor destinations, including corporate WhatsApp and social/legal links, are unchanged.
- Inline JavaScript syntax, inline CSS parsing and `git diff --check` passed. No build step exists or was introduced.
- Final responsive runs reported no console errors, page exceptions, failed HTTP responses, horizontal page overflow or detected text clipping. An initial run encountered one transient external DNS resource error; subsequent mobile and final checks were clean.

Local QA scripts, screenshots and JSON results are outside the repository in `%TEMP%/hurra-phase3`. Evidence includes `final-qa-results.json`, `heading-results.json`, `functional-results.json`, `mobile-results.json` and section screenshots. Temporary preview servers are closed when their checks finish.

## 8. Items requiring owner confirmation and stop status

The owner needs to supply the exact official business title, MERSİS number, and ETBİS registration details with their authoritative sources before those fields can be published. Existing unresolved legal-document URLs/content remain owner work from Phase 1.

Work is local and uncommitted. No push, deployment, Cloudflare/DNS change, German/Azerbaijani localization or unrelated improvement was performed. The existing hosted preview was not updated. Phase 3 stops with the local changes and this report.
