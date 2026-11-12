# The Fade House - Barbershop

Site de prezentare și programări pentru **The Fade House - Barbershop**, frizerie premium din Constanța
(Strada Constantin Brătescu 45).

**Live:** https://thefadehouse.twopixeldev.com/ (Cloudflare) · copie pe GitHub Pages: https://vladimirtudor40-glitch.github.io/thefadehouse/

## Ce conține

- Preloader cu cortină, cursor magnetic (desktop) și scroll inerțial (Lenis)
- Badge „Deschis acum / Închis” calculat live după ora României
- Meniu de servicii pe categorii, cu previzualizare la hover
- Programare în 3 pași (servicii → zi și oră → confirmare) trimisă pe WhatsApp, cu intervale care respectă programul
- Lookbook cu efect 3D tilt, recenzii în marquee, hartă întunecată (Leaflet + Esri Dark Gray Canvas)

## Tehnologii

Next.js (App Router, export static) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Framer Motion · Lenis ·
Leaflet · Lucide

## Editare conținut

Toate textele, prețurile, programul, numărul de WhatsApp (`WHATSAPP_NUMBER`), coordonatele și imaginile sunt în
[`data/barbershopData.ts`](data/barbershopData.ts).

**Înainte de lansare:** confirmați prețurile marcate ca propuneri și înlocuiți cardurile de recenzii cu recenzii reale
de pe Google (vezi comentariile din fișier).

## Publicare automată

Fiecare push pe `main` declanșează workflow-ul [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), care face
build și publică site-ul pe branch-ul `gh-pages`. Site-ul live se actualizează în 1–2 minute.
Pentru pull request-uri rulează doar verificarea de tipuri și build-ul.

Adresa publică a site-ului (`SITE_URL`, folosită pentru sitemap, robots și imaginea de share) este tot în
[`data/barbershopData.ts`](data/barbershopData.ts).

## Comenzi

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # export static în ./out
npm run deploy   # publicare manuală (nu mai e necesară, o face GitHub Actions)
```

## Publicare pe thefadehouse.twopixeldev.com (Cloudflare)

Adresa principală e servită de Worker-ul Cloudflare `thefadehouse` (config în [`wrangler.jsonc`](wrangler.jsonc), fișiere statice din
`./out`). Se construiește fără calea `/thefadehouse`:

```bash
npm run build:cloudflare        # macOS/Linux; pe Windows (PowerShell): $env:BASE_PATH=""; npx next build; node scripts/fix-export-segments.mjs
npx wrangler deploy
```
