# Orchid English Secondary School — Website

Multi-page static website (HTML/CSS/JS). Easy to host on Himalayan Host (just upload the whole folder) and easy to hand over as source files.

## Pages
| File | Page |
|------|------|
| `index.html` | Home (hero, quick links, news, notices, testimonials, admission popup) |
| `about.html` | About Us (principal's message, vision/mission, history, faculty) |
| `academics.html` | Academics (School + College/+2, optional subjects, extracurriculars) |
| `download.html` | Downloads (prospectus, pedagogy, guides, old questions, e-magazine) |
| `notices.html` | Notice Board / News (live Google-Sheet ready) |
| `gallery.html` | Gallery (events / facilities / activities) |
| `contact.html` | Contact + Admission Inquiry form |

## Theme colors
- Navy Blue `#0B47A6`
- Golden Yellow `#EDB04C`
- Maroon `#800000`

## Integrations already wired
- **Login / Parent Portal** → `https://ingrails.com/school/` (Veda)
- **Play Store app** → floating button + footer
- **Contact / Admission inquiry form** → emails to `accounts@orchidharion.edu.np`
- **Floating buttons** (right-middle): WhatsApp, Facebook, Email, App

---

## TO DO — items needing real content from the school

1. **Logo:** A vector placeholder is in `assets/logo.svg`. To use the official logo, save the school's PNG as `assets/logo.png` and replace `logo.svg` with `logo.png` in the `<img>` tags (or just overwrite `logo.svg`).
2. **Photos:** Replace the Unsplash placeholder URLs with real photos (hero = 5 images in `index.html`; gallery = 12 images in `gallery.html`).
3. **Phone number / WhatsApp:** Replace `+977-046-XXXXXX` and `wa.me/97798XXXXXXXX` everywhere.
4. **Facebook URL:** Replace the `#` in the Facebook links/floating button.
5. **Admission popup graphic + QR:** In `index.html`, replace the `.popup-qr` placeholder div with `<img class="popup-graphic" src="assets/admission.png" alt="Admission">`.
6. **Principal / faculty / about text:** Fill in the `[ ... ]` placeholders in `about.html`.
7. **Download files:** Drop PDFs into `assets/` and point each `dl-card` link to them.

## Live Notice Board (Google Sheet)
1. Create a Google Sheet with columns: **Date | Title | Description**.
2. File → Share → **Publish to web** → choose the sheet → **CSV** → Publish.
3. Copy the CSV link and paste it into `NOTICE_CSV_URL` in `js/main.js`.
4. From then on, staff just edit the sheet and the Notice Board updates automatically.

## Local preview
Open `index.html` in a browser, or run a local server:
```
python -m http.server 8000
```
