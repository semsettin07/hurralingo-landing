# Hurra Lingo landing — Phase 1 report

Date: 4 October 2026 (Europe/Istanbul).

## Scope and files

Updated only this repository's `index.html`, `en.html`, and `README.md`; added this report and 34 verified tutor JPG/PNG assets listed below. Existing logo, palette, typography, illustrations, media, eight tutor WebP assets, page sections and responsive patterns remain in use. No framework, package manifest, build step or runtime dependency was introduced. No work was performed on the old project.

## Trial CTAs and obsolete UI

Every trial action now uses a native link to [the trial-request page](https://www.hurralingo.app/trial-request), with `target="_blank"` and `rel="noopener noreferrer"`. Each rendered page contains 60 such links: 18 general CTAs and 42 tutor-card CTAs. Hidden announcement/drawer variants are included in that count.

Removed the trial/corporate dialog, fake form submission and success screen, validation, field restoration, preselection state, modal triggers, delegated handlers and exclusive form CSS (including mobile rules). Video playback and its separate dialog, cookie preferences, FAQ controls, navigation and other working interactions remain.

The hero card now presents four static age groups and seven static language pills; radio buttons, dropdown and submit handler are gone. Its “Devam et” / “Continue” link opens the real request page. Level and flexible-time notes remain. Tutor CTAs no longer promise that a particular teacher is preselected or booked by this landing page.

## Seven languages and Chinese

Canonical order: EN · DE · FR · ES · RU · ZH · TR. Updated hero copy, navigation summary, summary count and badges, large language-options card, teacher-related copy, corporate copy, FAQ and footer. Unrelated six-level CEFR and age references were retained.

Language options are informational spans with colored markers; removed click/hover-selection behavior and misleading “tap a language” copy. Badge layouts wrap; language-option columns adapt to available width. Added Chinese tutor filter, data/color mapping, Chinese greeting, Chinese tutor and ZH summary badge. The yellow illustration now has seven greetings, including 你好!, with mobile spacing adjusted. Age labels stay on one line.

## Official roster comparison

Sources actually inspected on the report date:

- [English tutor roster](https://www.hurralingo.com/tutors/): 39 named teacher/language entries plus one unnamed German entry.
- [Turkish tutor roster](https://www.hurralingo.com/tr/ogretmenlerimiz/): 36 named entries plus the same unnamed German entry.

The named rosters overlap on 33 people. Their deduplicated union supplies 42 displayed cards; this is an inventory of published named entries, not a verified total of currently active teachers. All eight original name/language pairs matched the official rosters and remain: Adam Büyükbiçer, Adeniyi Peace, Alexandra Çavuş, Ayzade Kahya, Bengü Kesen, Büşra Ağca, Mehtap Taşçıoğlu, Nesrin Yılmaz. No original tutor was removed. Added 34 name/language pairs; no biographies, qualifications, experience, certificates or native-speaker claims were added.

### Added tutors and changed asset files

EN/TR below identify the official roster(s) containing each name/language pair. Each new image was downloaded from the image element within that tutor's own card on an official page; original source formats were retained. Existing eight WebP photos were kept.

| Added tutor | Language | Official roster | Added file |
| --- | --- | --- | --- |
| Ayberk Savaş | İngilizce | EN + TR | `img/t-ayberk-savas.jpg` |
| Ayşegül Eskikurt | İngilizce | EN + TR | `img/t-aysegul-eskikurt.jpg` |
| Ayşegül Santur | İngilizce | EN + TR | `img/t-aysegul-santur.png` |
| Ayşın Yaşa | İngilizce | EN + TR | `img/t-aysin-yasa.jpg` |
| Betül Beyza | İngilizce | EN + TR | `img/t-betul-beyza.png` |
| Büşra Sürekçi | İngilizce | EN + TR | `img/t-busra-surekci.png` |
| Ghazaleh Ghazalifard | İngilizce | EN + TR | `img/t-ghazaleh-ghazalifard.png` |
| Burak Santur | İngilizce | EN + TR | `img/t-burak-santur.png` |
| Deniz Özlü | İngilizce | EN + TR | `img/t-deniz-ozlu.jpg` |
| J. Luis Fernandez Salazar | İspanyolca | EN + TR | `img/t-j-luis-fernandez-salazar.png` |
| Gizem Kenez | İngilizce | EN + TR | `img/t-gizem-kenez.jpg` |
| Kayra Ağır | İngilizce | EN + TR | `img/t-kayra-agir.jpg` |
| Kübra Toral | İngilizce | EN | `img/t-kubra-toral.jpg` |
| Mustafa Hakan | İngilizce | EN + TR | `img/t-mustafa-hakan.png` |
| Neslihan Kızılbayır | İngilizce | EN + TR | `img/t-neslihan-kizilbayir.jpg` |
| Parisa Khalegni | İngilizce | EN + TR | `img/t-parisa-khalegni.jpg` |
| Saskia Douglas | İngilizce | EN + TR | `img/t-saskia-douglas.png` |
| Sedef Şen | İngilizce | EN + TR | `img/t-sedef-sen.jpg` |
| Sibel Bulut | Almanca | EN + TR | `img/t-sibel-bulut.jpg` |
| Yağmur Irmak Özarslan | İngilizce | EN + TR | `img/t-yagmur-irmak-ozarslan.jpg` |
| Yasemin Ürer | İngilizce | EN + TR | `img/t-yasemin-urer.jpg` |
| Yolandi Bezuidenhout | İngilizce | EN + TR | `img/t-yolandi-bezuidenhout.jpg` |
| Zeynep Akgül | İngilizce | EN + TR | `img/t-zeynep-akgul.png` |
| Zeynep Sarıibrahimoğlu | İngilizce | EN + TR | `img/t-zeynep-sariibrahimoglu.jpg` |
| Deniz Okumuş | İngilizce | EN + TR | `img/t-deniz-okumus.jpg` |
| Elif Gizem Kaya | Almanca | EN + TR | `img/t-elif-gizem-kaya.jpg` |
| Müge Tınaz | İngilizce | EN + TR | `img/t-muge-tinaz.jpg` |
| Sultan Ecem Kolluoğlu | İngilizce | EN | `img/t-sultan-ecem-kolluoglu.jpg` |
| Ezgi Dinç | İngilizce | EN | `img/t-ezgi-dinc.jpg` |
| Hatice Onar | Almanca | EN | `img/t-hatice-onar.jpg` |
| Ceyda Sönmez | Almanca | EN | `img/t-ceyda-sonmez.jpg` |
| Duru Melek | İngilizce | TR | `img/t-duru-melek.jpg` |
| Yanshan Lin | Çince | TR | `img/t-yanshan-lin.jpg` |
| Füsun Köse | Fransızca | TR | `img/t-fusun-kose.jpg` |

### Source differences and ambiguous records

- English-only entries: Kübra Toral, Sultan Ecem Kolluoğlu, Ezgi Dinç, Hatice Onar, Ceyda Sönmez. Turkish-only: Duru Melek, Yanshan Lin, Füsun Köse. These are included because each is officially published, but availability and localization parity need owner confirmation; absence on the other page was not treated as proof of departure.
- Both rosters contain a German card with a blank name and a photo filename `michal-2.jpg`. Excluded rather than inferring a person's name from a filename. Owner must supply the verified display name.
- The displayed name “Mustafa Hakan” is used exactly as listed. A longer surname occurs in other official content/image filenames; it was not silently appended.
- Sibel Bulut is explicitly labeled German on both tutor pages despite an image filename containing “Ingilizce”. The displayed language was used; owner can resolve the misleading filename.
- The official English homepage mentions seven languages in one paragraph and omits Chinese in another. This repository follows the seven-language set explicitly requested for Phase 1.

### Chinese tutor/photo status

Yanshan Lin is explicitly listed as Çince Öğretmeni on the Turkish roster. The image is directly associated with that named card: [official Yanshan Lin photo](https://www.hurralingo.com/tr/wp-content/uploads/2026/06/ogretmen.jpg), saved as `img/t-yanshan-lin.jpg`. A neutral placeholder was unnecessary; no portrait was generated or borrowed from another person. The Chinese filter must show exactly this card.

## Corporate WhatsApp

The existing repository already used `https://wa.me/905395167070`. Both [the official Turkish homepage](https://www.hurralingo.com/tr/) and [English homepage](https://www.hurralingo.com/) publish that same WhatsApp link and +90 539 516 70 70. Reused the exact number. Corporate rows are plain informational divs; arrow/navigation affordances were removed. The main CTA is “Kurumsal Teklif Alın” / “Get a Corporate Quote” and opens only that WhatsApp link. No number or corporate form was invented.

## Social accounts and teacher count

The official homepage HTML/header/footer directly links these accounts; the landing footer now uses those exact URLs with the required new-tab/security attributes:

- [Instagram](https://www.instagram.com/HurraLingo/)
- [Facebook](https://www.facebook.com/HurraLingo/)
- [YouTube](https://www.youtube.com/@hurralingo1796)
- [LinkedIn](https://www.linkedin.com/company/hurraglobal)
- [TikTok](https://www.tiktok.com/@hurra_lingo)

TikTok was included because the official site's footer explicitly links it. This verifies official-site attribution; it does not claim successful logged-in access to each platform. LinkedIn search also surfaced `/company/hurralingo`; the implementation prefers the official website's `/company/hurraglobal` link. Owner can confirm the preferred alias.

The old “38 teachers” total could not be substantiated as a current active roster total. Removed exact teacher-total claims, related “+34” counters, and blanket “every teacher has an introduction video” claims. Footer and summary use count-free team wording. The 42-card filter result count describes actual rendered cards only.

## Link and interaction cleanup

Trial/corporate modal triggers and form buttons are gone. Social links no longer return to page top. “Full tutor list” links now open the corresponding official roster instead of linking back to the same section. Broken login links now open the official app login route with the page locale; the drawer Blog link opens the corresponding official blog route. Legal-document links that previously pointed to page top are now noninteractive text, with an implementation TODO for verified legal URLs. Genuine section navigation and “back to top” behavior remain.

Browser/static audits found no empty `href="#"`, JavaScript pseudo-links, missing fragment targets or obsolete trial handlers. Legal document content/URLs, business registration placeholders and unrelated existing prototype pricing remain owner work; no new pricing/payment flows were added.

## Validation

Passed local Chrome/Playwright checks for **both pages at 320, 390, 768, 1024 and 1440 px** (10 page/viewport combinations):

| Check | Result |
| --- | --- |
| Trial link destination, target and rel | 60 links per page; all correct |
| Static hero card | Four age groups, seven language pills, no form controls |
| Language summary / option card | Seven badges/options in canonical order |
| Tutor filters | All 42; English 30; German 6; French 2; Spanish 2; Russian 1; Chinese 1 |
| Chinese filter | Exactly Yanshan Lin |
| Tutor photos | All 42 local assets decode; no broken images |
| Corporate CTA / rows | Verified WhatsApp URL; all three rows noninteractive |
| Footer social links | Five official-site URLs with required target/rel |
| Page horizontal overflow | None at all requested widths |
| Age labels / language pills / contact text / corporate button | No detected clipping; narrow-screen wrapping checked |
| Tutor grid | Image aspect ratios retained; action baselines align within grid rows |
| Greeting illustration | Seven greetings; no bubble-to-bubble overlap |
| Fragment targets / empty or pseudo-links | No missing targets or stub links |
| Browser console / page errors / failed HTTP responses | None in tested local pages |
| Inline JavaScript / CSS parsing | 8 scripts and 10 style blocks per page pass syntax parsing |
| Git whitespace check | Pass |

Actual click tests on both pages cover announcement, hero, program-table, lesson-plan, steps, closing and tutor CTAs, plus the mobile drawer CTA. New tabs reach the exact trial-request URL; keyboard Enter on the hero CTA also works. Destination requests were intercepted by the test harness, so no application was submitted. Animated Chinese filtering, rapid filter changes followed by All, drawer closing, video-dialog open/close and FAQ toggling also pass. Screenshots of the announcement, navigation, hero card, summary, language options, tutor controls/card, corporate section, greetings and footer were captured at 320 and 1440 px and key changed layouts were visually inspected.

The existing summary/video rails intentionally scroll horizontally inside their own containers; this is retained and does not create page overflow. QA detected and fixed a tablet language-pill constraint, mobile age-label wrapping, greeting spacing, narrow corporate-button wrapping and footer contact-text wrapping. Cookie preferences were dismissed for layout screenshots. Fixed navigation and the mobile CTA bar can overlay section screenshots while scrolling, as in the existing design.

Local evidence: `%TEMP%/hurra-phase1/qa-results.json`, `interaction-results.json`, and the PNG screenshots. The temporary `qa.cjs`, `interactions.cjs` and `static-checks.cjs` scripts remain there for local reruns.

This is a direct static HTML project. No existing test runner or build process exists, so there is no build/test command to run and none was introduced. Validation uses temporary Playwright scripts with installed local Chrome; tooling and screenshots are outside the repository under `%TEMP%/hurra-phase1`. `git diff --check` is also run.

## Owner confirmation / unresolved items

1. Confirm availability of the eight teachers published on only one localized roster and bring official rosters into agreement.
2. Supply the blank German tutor's verified name; confirm any desired fuller display names.
3. Confirm an active total only if an exact marketing teacher count is desired. No replacement total is asserted.
4. Supply verified legal-document URLs/content and complete existing business-registration placeholders. Confirm preferred LinkedIn alias if the official-site link should change.
5. Existing prototype prices, package/payment descriptions and other unrelated content were not validated in this phase; review those separately before production use.

## Preview / deployment status

Changes are local and uncommitted. Browser QA uses a temporary local HTTP preview; it is stopped when tests finish. The existing [Cloudflare preview](https://hurralingo-landing.pages.dev/) was not redeployed and does not yet contain these local edits. No push, publication, production deployment, custom-domain connection, DNS or Cloudflare-setting changes were made.
