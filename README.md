KORÇA HIDDEN KEY
=====================

PËRDORIMI
1. Hap index.html në Chrome/Edge/Firefox/Safari.
2. Kliko "Filloni aventurën".
3. Zgjidh një mision.
4. Ndiq udhëzimin në vendin real.
5. Shkruaj kodin e misionit dhe kliko "Kontrollo".
6. Përfundo misionin për të marrë XP dhe thesarin.
7. Përdor Hartën, Thesarin, Renditjen dhe Profilin.
8. Te "Si funksionon?" shfaqet udhëzuesi dhe pajisjet e mbështetura.

PAJISJET
- Telefon: Android / iPhone
- Tablet: iPad / Android
- PC/Laptop: Chrome / Edge / Safari / Firefox
- Dizajni përshtatet automatikisht me madhësinë e ekranit.
- PWA: kur faqja shërbehet nga HTTPS ose localhost, mund të shfaqet butoni "Instalo aplikacionin".

FUNKSIONET
- 5 misione
- XP dhe nivele
- Timer për çdo mision
- Kontroll kodi
- Streak
- Badge
- Koleksion thesares
- Hartë interaktive
- Renditje lokale
- Tingull ON/OFF
- Ruajtje automatike në localStorage
- Offline cache me service worker
- Modalitet instalimi PWA

SHËNIM
Renditja aktuale është demo dhe ruhet vetëm në pajisjen e përdoruesit. Për një version real me shumë lojtarë, duhet backend/database.


VERSION 2.1 — MJETE TERRENI
- GPS: përdor navigator.geolocation për të kontrolluar distancën nga pikat e misionit.
- QR: përdor kamerën dhe BarcodeDetector kur mbështetet nga shfletuesi.
- GPS koordinatat në app.js janë shembull dhe duhen verifikuar me koordinatat reale të pikave.
- Renditja ende është lokale/demo. Për renditje reale online duhet backend (p.sh. Supabase/Firebase) dhe autentikim.

