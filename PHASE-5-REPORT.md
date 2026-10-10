# Hurra Lingo landing — Phase 5 report

Date: 10 October 2026 (Europe/Istanbul).

## 1. Files created and modified

Created:

- `de.html`: complete German landing page.
- `az.html`: complete Azerbaijani landing page.
- `localization.css`: narrowly scoped text fitting for translations and small-screen issues found during QA.
- `PHASE-5-REPORT.md`: this report.

Modified:

- `index.html` and `en.html`: four-language desktop/mobile switchers, staging canonical/hreflang metadata and the local text-fitting stylesheet link.
- `README.md`: four-language structure, local and planned preview paths, 38 displayed tutors, approved TRY pricing, staging SEO and Phase 5 documentation.

No framework, build system, project dependency, media replacement or new form was introduced. `desktop-density.css` and `robots.txt` are unchanged.

## 2. Source review and localization coverage

The latest local Turkish/English pages and completed Phase 1, 3 and 4 reports were reviewed. Latest code takes precedence over the outdated two-language/42-card README. German and Azerbaijani use the current English page structure and equivalent localized copy, including all subsequent hero updates:

| Page | Main slogan | Supporting slogan |
| --- | --- | --- |
| German | LERNEN. SPRECHEN. LIEBEN! | Live-Unterricht trifft auf intelligente Lerntechnologie. |
| Azerbaijani | ÖYRƏN. DANIŞ. SEV! | Canlı dərslərlə öyrən, ağıllı texnologiya ilə möhkəmləndir. |

The longer expert-teacher/seven-language description immediately below the supporting slogan remains on both new pages, including mobile.

Coverage includes announcement, desktop navigation/dropdowns, mobile drawer, hero and informational age/language card, proof cards, seven-language/learning cards, video-section titles and questions, age programs, pricing/payment tabs, tutor cards/filters, testimonials, learning process, corporate section, FAQ/contact, closing CTA, footer, cookie preferences, metadata, alt text and accessibility labels. The inventory covered 390 unique source text/attribute values, including names and deliberately preserved terms. Dynamic tutor-count labels, trial CTA labels, payment summaries/live announcements, menu open/close labels, video play/pause labels, copy-number feedback and cookie save labels are localized.

German uses formal Sie in parent-facing and commercial communication and consistent “Kostenlose Probestunde”. Azerbaijani uses Azerbaijan-oriented spelling, Latin characters and “Ödənişsiz tanışlıq dərsi”, “Müəllimlər”, “Valideyn paneli” and “Təhsil məsləhətçisi”. Teacher names, Hurra Lingo, Hurra Türkiye, institutional/company names and verified brand names remain unchanged. German GER terminology expresses the same CEFR framework; levels remain equivalent.

Intentional source differences and ambiguities:

- Turkish and English marketing copy differs in the “why us” lead and teacher-list empty-state explanation. The new languages follow the latest English meaning; existing Turkish and English copy is untouched.
- The existing English FAQ heading is the incomplete “Frequently asked”. The new pages use complete natural headings: “Häufige Fragen” / “Tez-tez verilən suallar”. The source heading was preserved.
- Native language names in the switcher remain Türkçe, English, Deutsch and Azərbaycanca on every page.
- All seven language greetings remain in their own languages, including 你好!. The Turkish-to-English vocabulary example retains `kitap / book / look / cook` as teaching content; its instruction and accessible description are localized and its answer group is explicitly `lang="en"`. These are intentional multilingual learning content, rather than untranslated interface labels.
- Original videos and their spoken audio are retained. This phase localizes video titles, descriptions and controls; it does not create translated audio or subtitles.

No previously removed teacher badge, separate speaking-price promotion, agency footer disclaimer or business-registration placeholder was restored.

## 3. Language switcher

Both desktop and mobile selectors now contain real local links on all four pages:

| Code | Native label | Destination | HTML lang |
| --- | --- | --- | --- |
| TR | Türkçe | `/` | tr |
| EN | English | `/en.html` | en |
| DE | Deutsch | `/de.html` | de |
| AZ | Azərbaycanca | `/az.html` | az |

The active button code, checkmark and `aria-current="page"` match each page. No language option points to `#top` or an external website. Actual clicks were tested from all four source languages at each requested width: mobile navigation below the existing desktop breakpoint and desktop dropdown at 1440px. The destination HTML language and active code match.

Root-relative links require HTTP hosting or the local preview server; opening an HTML file directly with `file://` is not the language-navigation test environment.

## 4. SEO and accessibility

All pages retain `noindex, nofollow`; `robots.txt` still contains `Disallow: /`. German and Azerbaijani have localized titles, descriptions, Open Graph titles/descriptions/locales, navigation labels, image alternatives and dynamic accessibility text. Their Open Graph images use the same local `og.jpg` asset via the staging origin.

Each page has its own canonical on `https://hurralingo-landing.pages.dev` and the same reciprocal TR/EN/DE/AZ alternate links. `x-default` points to the Turkish staging homepage. No production-domain canonical was introduced. The current source had no canonical or hreflang declarations; the new declarations explicitly identify staging and do not relax indexing restrictions. Existing TR/EN titles, descriptions and other metadata were preserved.

Technical IDs, classes, internal payment/program identifiers and filenames were preserved. Root language declarations in HTML and JavaScript agree.

## 5. Tutor roster parity

Each page has exactly **38 displayed tutor cards**, in the same order, with identical names, image paths and photo offsets. Language labels and TONE/filter assignments alone are localized. Source-record comparison and rendered-name checks passed.

Mehtap Taşçıoğlu, Büşra Ağca, Ayberk Savaş and Kübra Toral are absent from all four tutor arrays; no replacement cards or availability claims were added. Decorative uses of Mehtap’s retained image remain as approved in Phase 4. No image was deleted or modified and no official WordPress roster was reimported or edited.

| Teaching language | Count | German filter | Azerbaijani filter |
| --- | --- | --- | --- |
| English | 28 | Englisch | İngilis dili |
| German | 5 | Deutsch | Alman dili |
| French | 1 | Französisch | Fransız dili |
| Spanish | 2 | Spanisch | İspan dili |
| Russian | 1 | Russisch | Rus dili |
| Chinese | 1 | Chinesisch | Çin dili |
| All | 38 | Alle | Hamısı |

Yanshan Lin is the Chinese filter’s single card. Every existing filter was exercised at all widths. Normal-motion Chinese filtering and rapid filter changes followed by All were also checked. Seven offered languages and EN · DE · FR · ES · RU · ZH · TR remain; the approved roster has no Turkish tutor/filter, so none was invented. No platform-wide active-teacher claim was changed.

## 6. Pricing parity

All values remain Turkish lira. No EUR/AZN conversion or calculation change was made.

| Approved value | All four pages |
| --- | --- |
| Group starting price | ₺446 |
| Group range | ₺446–550 |
| Mini-group starting price | ₺623 |
| Individual starting price | ₺890 |
| Example package | Individual, 2 lessons weekly, 12 months, 96 lessons |
| One-time total / per lesson | ₺85.440 / ₺890 |
| Installment total / per lesson | ₺94.944 / ₺989 |
| Monthly installments | 12 × ₺7.912 |
| Difference | ₺9.504 |
| Relative difference | Approximately 11% |
| Comparison bars | Existing 89.989889% / 100% |

German and Azerbaijani use the requested dot thousands separators. English retains its existing comma separators. German explicitly calls the weekly lessons “Unterrichtseinheiten”, avoiding confusion with two clock hours. Both payment modes and animated number updates passed on all pages at every width.

## 7. CTA, contact and social links

Each rendered page contains 55 trial-request anchors. Every one retains `https://www.hurralingo.app/trial-request`, `target="_blank"` and `rel="noopener noreferrer"`. Actual popup clicks from announcement, hero, program table, pricing, tutor, learning process, closing section and mobile drawer reached the exact destination on all four pages. The QA harness intercepted destination requests; no application was submitted.

The approved WhatsApp number, `https://wa.me/905395167070`, email and all five Instagram/Facebook/YouTube/TikTok/LinkedIn destinations are unchanged. Corporate rows remain informational and the corporate CTA opens the approved WhatsApp destination. Copy-number feedback is localized and the exact number was supplied to an instrumented clipboard API.

Existing external app-login links retain `lng=en` on DE/AZ because provider support for German/Azerbaijani has not been confirmed. No unsupported external locale was invented. Existing desktop Blog behavior and external official tutor-list destinations were preserved.

## 8. Responsive and functional QA

Installed local Chrome and the previously available Playwright installation were used. No project QA dependency was added.

| Width | TR | EN | DE | AZ |
| --- | --- | --- | --- | --- |
| 320px | Pass | Pass | Pass | Pass |
| 390px | Pass | Pass | Pass | Pass |
| 768px | Pass | Pass | Pass | Pass |
| 1024px | Pass | Pass | Pass | Pass |
| 1440px | Pass | Pass | Pass | Pass |

All 20 final layout runs verified localized/root language metadata, reciprocal alternates, active language selectors, trial attributes, social/corporate links, seven language badges, tutor names and counts, all tutor filters, both payment states, FAQ accordion open/close behavior, copy feedback, menu opening/closing and decoding every image. Final runs recorded no broken images, horizontal page overflow, detected visible text clipping, JavaScript page exceptions, console errors or HTTP error responses.

All 20 functional runs tested hero play/pause controls and localized state labels, video-dialog playback/closing, video-carousel next navigation, animated Chinese filtering and rapid reset, payment animations, cookie settings/save behavior and actual language navigation. All six Q&A videos were played on each page at 390px; the first video was additionally played at every other requested width. Every tested video had positive duration, advancing playback time and no media error. Trial popups were checked at 390px on every page.

Screenshots of hero, pricing, tutor section, FAQ and footer were captured at 320px and 1440px for each language and representative new-language layouts were visually reviewed. Original internal horizontal proof/video rails remain scrollable. Screen-reader-only table header geometry can extend beyond the viewport while clipped by its existing hidden container; it creates neither visible text clipping nor page overflow.

Text-fitting changes are limited to `localization.css`: localized long words and grid children can wrap/shrink; German payment labels fit; localized pricing CTAs wrap; German tablet login moves into the existing mobile drawer; the German age card gives its adult label enough room. A few pre-existing narrow-source issues found by the required 320px checks are addressed across languages: long tutor surname wrapping, three-line tutor CTA capacity, narrow pricing CTA wrapping and mobile contact-button wrapping. The English tablet logo receives a small scoped size adjustment to prevent header overflow. Fonts, colors, videos, section order, original responsive rules and the desktop-density stylesheet remain.

Source integrity checks passed: TR/EN content and JavaScript match the starting versions outside language-switcher markup, staging SEO and the stylesheet link. New-page asset references, technical IDs and section sequence match the current English source. Inline JavaScript parses and `git diff --check` passes. One diagnostic iteration encountered transient external font-network errors; final recorded layout runs were clean.

Evidence is outside the repository in `%TEMP%/hurra-phase5`: `qa-results.json`, `functional-results.json`, screenshots, source snapshots, translation inventory and temporary QA scripts. Temporary preview servers are closed when each test finishes.

## 9. Translation review and owner decisions

The DE/AZ interface is complete; no missing interface translation is known. A native-speaking owner/editor should review terminology and tone before production, especially translated testimonials, award wording, legal labels and the German rendering of institutional references. This is editorial sign-off rather than missing implementation.

Confirm whether the external Hurra App login/trial-request flow supports DE/AZ before changing its language parameters. If the owner wants dubbed videos or translated captions, provide approved source scripts and media scope. No translated audio, legal terms or unsupported external-language support was fabricated.

## 10. Remaining production readiness and stop status

Previously unresolved official company-title/MERSİS/ETBİS details and legal-document content/URLs still require owner confirmation before production; removed placeholders were not restored. Production analytics/consent behavior, final domain/canonical migration and publication scope remain separate decisions. Existing TR/EN Open Graph image URLs retain their earlier source metadata and should be reviewed during the approved production SEO migration.

Production TODO: Integrate approved Hurra Lingo chatbots after provider, embed script, consent/privacy requirements and deployment scope are confirmed.

No chatbot, fake chat widget, external chatbot script, production-domain connection, Cloudflare-setting change, DNS change, push or deployment was performed. New DE/AZ preview paths are local deliverables and may be absent from the currently hosted preview until a separately authorized publication. Work stops with the local pages, README and this report.
