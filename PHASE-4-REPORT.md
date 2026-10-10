# Hurra Lingo landing — Phase 4 report

Date: 10 October 2026 (Europe/Istanbul).

## Modified files

- `index.html`: contact copy, payment FAQ copy, four tutor-array removals, initial displayed count.
- `en.html`: equivalent English changes.
- `PHASE-4-REPORT.md`: this report.

## Exact text changes

| Location | Before | After |
| --- | --- | --- |
| Turkish contact | WhatsApp'tan yazın, ekibimiz size dönsün. | WhatsApp'tan yazın, ekibimiz size geri dönüş yapsın. |
| English contact | Message us on WhatsApp and our team will get back to you. | Message us on WhatsApp and our team will follow up with you. |
| Turkish payment FAQ ending | Peşin ödemede ders başı ücret daha düşüktür; örnek paketi fiyatlar bölümünde görebilirsiniz. | Peşin ödemede ders başı ücret daha düşüktür. Detaylı fiyat bilgisi için fiyatlar bölümüne göz atabilirsiniz. |
| English payment FAQ ending | Paying up front lowers the price per lesson; you can see an example package in the pricing section. | Paying up front lowers the price per lesson. For detailed pricing information, take a look at the pricing section. |
| Turkish initial count | 42 öğretmen gösteriliyor | 38 öğretmen gösteriliyor |
| English initial count | Showing 42 teachers | Showing 38 teachers |

The FAQ's preceding sentences remain exact. The up-front payment statement is retained; its semicolon becomes a period to separate the new pricing-information sentence. The existing `#fiyatlar` link wraps “fiyatlar bölümüne” / “pricing section”. Accordion behavior is unchanged.

WhatsApp number `+90 539 516 70 70`, destination `https://wa.me/905395167070`, copy-number button, email `hello@hurralingo.com` and contact design are preserved.

## Removed tutors and final roster

Removed from both underlying `T` arrays, so their cards are never generated:

- Mehtap Taşçıoğlu
- Büşra Ağca
- Ayberk Savaş
- Kübra Toral

Each page previously had 42 unique tutors and now displays **38 unique tutor cards** with the All/Tümü filter. No replacement tutors were added. All remaining array records, photographs, image offsets and ordering match the pre-edit versions exactly. Yanshan Lin and the Chinese greeting remain.

The names are absent from both HTML files and from the rendered card names. There is no separate tutor search or carousel data source in this project. Historical reports are retained. No claim about the total number of active Hurra Lingo teachers was updated. Official WordPress tutor pages were not changed.

## Tutor filter results

Every existing filter was clicked on both pages at every requested width, with normal animation enabled. Visible card names were compared with the corresponding source records; aria-pressed state and displayed count matched each selection. Restoring All/Tümü returned 38 cards.

| Filter | Turkish label | Visible cards | Result |
| --- | --- | --- | --- |
| All | Tümü | 38 | Pass |
| English | İngilizce | 28 | Pass |
| German | Almanca | 5 | Pass |
| French | Fransızca | 1 | Pass |
| Spanish | İspanyolca | 2 | Pass |
| Russian | Rusça | 1 | Pass |
| Chinese | Çince | 1 | Pass |

The existing seven-language information and language mappings remain. Before this phase, the roster UI had All plus six language filters and no Turkish filter/card; this existing structure was preserved without adding a filter or tutor.

## Image assets

No image assets were removed or modified.

| Asset | Decision and reference check |
| --- | --- |
| `img/t-mehtap.webp` | Retained: still used by decorative avatar groups in both pages (summary, teacher introduction and closing CTA), and listed in README.md. Removed from the tutor roster only. |
| `img/t-busra.webp` | Retained: no remaining runtime use; still listed in README.md. |
| `img/t-ayberk-savas.jpg` | Retained: no remaining runtime use; still referenced in the historical PHASE-1-REPORT.md asset inventory. |
| `img/t-kubra-toral.jpg` | Retained: no remaining runtime use; still referenced in the historical PHASE-1-REPORT.md asset inventory. |

Repository reference searches were performed before deciding to retain these assets. The requested roster removals do not alter unrelated decorative avatar groups.

## Responsive QA

Local installed Chrome with the previously available Playwright installation tested both pages at a 1000px viewport height:

| Width | index.html | en.html |
| --- | --- | --- |
| 390px | Pass | Pass |
| 768px | Pass | Pass |
| 1024px | Pass | Pass |
| 1440px | Pass | Pass |

All eight runs passed:

- Exact updated contact and payment FAQ text; pricing link retained.
- 38 tutor cards; four removed names absent; remaining names/order exact; Yanshan Lin present.
- All existing language filters and rendered count updates, including resetting to All/Tümü.
- Every page image decoded successfully, including all tutor photos; no broken images.
- No horizontal page overflow, including while each filter was selected.
- No JavaScript page exceptions, console errors or HTTP error responses.
- Payment FAQ opens and closes the previously open accordion item.
- Copy-number handler supplies the exact WhatsApp number to the clipboard API (instrumented during QA); WhatsApp link remains exact.

Inline JavaScript syntax passed. All inline scripts except the tutor-array contents and all inline styles match the pre-edit versions byte-for-byte. Diff review confirms only four lines changed per HTML file: contact text, FAQ ending, tutor array and initial roster count. Pricing values/calculations, trial links, social links, logo, typography/colors, videos, Chinese greetings, corporate CTA, section order, responsive layout, SEO and prior phase changes are preserved.

Screenshots were captured for FAQ and tutor sections at 390px and 1440px in both languages. QA scripts, pre-edit snapshots, screenshots and full results are outside the repository in `%TEMP%/hurra-phase4`; detailed results are in `qa-results.json`. The temporary preview server was closed after testing. No project dependencies were installed or added.

## Chatbot production TODO

Production TODO: Integrate approved Hurra Lingo chatbots after provider, embed script, consent/privacy requirements and deployment scope are confirmed.

No chatbot, external chatbot script, fake chat widget or third-party dependency was added.

## Stop status

Changes are local and uncommitted. No push, deployment, Cloudflare change or DNS change was performed. Phase 4 stops with these changes and this report.
