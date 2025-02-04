# Photo Gallery App

Ez egy egyszerű webalkalmazás, amely lehetővé teszi a felhasználók számára képek feltöltését, megtekintését, hozzászólások írását, valamint albumok létrehozását és kezelését.

## Követelmények

A projekt futtatásához az alábbi szoftverek telepítése szükséges:

- **Node.js** 
- **MongoDB Compass**
- **Git** (a repository klónozásához)
- **Webstorm** (vagy más tetszőleges IDE)

## Telepítési lépések

1. **Repository klónozása:**
   ```bash
   git clone https://github.com/nagyp997/photo-gallery.git
   cd photo-gallery
   ```

2. **Adatbázis beállítása:**
    - Győződj meg arról, hogy a MongoDB fut.
    - Az alapértelmezett adatbázis a `mongodb://localhost:27017/photogallery` címen érhető el.
    - Ha szükséges, szerkeszd a `photo-gallery-backend/.env` fájlt.

3. **Backend telepítése:**
   ```bash
   cd photo-gallery-backend
   npm install
   npx nodemon server.js
   ```

4. **Frontend telepítése és indítása:**
   ```bash
   cd photo-gallery-frontend
   npm install
   npm start
   ```

5. **Webalkalmazás elérése:**
    - Nyisd meg a böngésződben a következő címet: [http://localhost:3000](http://localhost:3000)

## Tesztelés

Jelenleg manuális teszteléssel ellenőrizhető a projekt funkciói:
- **Bejelentkezés és regisztráció**
- **Galéria és albumok kezelése**
- **Kommentelési funkciók**

## Fontos megjegyzések

- Az adatbázis indulásakor üres lesz, manuálisan töltheted fel az adatokat a felületen keresztül.
- Az alkalmazás két különböző szerveren fut:
    - Backend: [http://localhost:5000](http://localhost:5000)
    - Frontend: [http://localhost:3000](http://localhost:3000)

## Hibakezelés

- **Adatbázis hiba:** Győződj meg róla, hogy a MongoDB Compass-ban a `photogallery` adatbázis elérhető.
- **Node.js hiba:** Ellenőrizd, hogy az összes `npm install` parancs sikeresen lefutott.