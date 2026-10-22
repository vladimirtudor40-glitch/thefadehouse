# The Fade House - Barbershop

Site de prezentare și programări pentru **The Fade House - Barbershop**, frizerie premium din Constanța
(Strada Constantin Brătescu 45).

**Live:** https://vladimirtudor40-glitch.github.io/thefadehouse/

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

## Comenzi

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # export static în ./out
npm run deploy   # build + publicare pe GitHub Pages (branch gh-pages)
```
