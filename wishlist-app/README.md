# 🌸 Lista Wyprawkowa — Baby Wish List

Elegancka aplikacja do zarządzania listą prezentów dla maluszka.
Zbudowana w Next.js z Vercel KV jako bazą danych.

---

## 🚀 Wdrożenie na Vercel (krok po kroku)

### Krok 1 — Umieść kod na GitHubie

1. Utwórz nowe repozytorium na [github.com](https://github.com) (możesz je nazwać np. `wyprawka` lub `baby-wishlist`)
2. W folderze projektu wykonaj:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TWOJA_NAZWA/NAZWA_REPO.git
git push -u origin main
```

### Krok 2 — Połącz z Vercel

1. Wejdź na [vercel.com](https://vercel.com) i zaloguj się kontem `patrycjazurawska@hotmail.com`
2. Kliknij **"Add New → Project"**
3. Wybierz repozytorium z GitHuba
4. Kliknij **"Deploy"** — Vercel sam wykryje Next.js

### Krok 3 — Dodaj bazę danych Vercel KV

1. Po wdrożeniu przejdź do projektu na Vercelu
2. Kliknij zakładkę **"Storage"**
3. Kliknij **"Connect Store" → "KV"** → **"Create New"**
4. Nazwij store np. `wishlist-kv`
5. Vercel automatycznie doda zmienne środowiskowe `KV_REST_API_URL` i `KV_REST_API_TOKEN` do projektu

### Krok 4 — Ustaw swój PIN

1. W projekcie na Vercelu kliknij **"Settings" → "Environment Variables"**
2. Dodaj zmienną:
   - **Name:** `OWNER_PIN`
   - **Value:** `TwójBezpiecznyPIN` (wybierz coś trudnego!)
3. Kliknij **"Save"**
4. Kliknij **"Redeploy"** w zakładce "Deployments"

### Krok 5 — Gotowe! 🎉

Twoja aplikacja jest dostępna pod adresem np. `https://wyprawka.vercel.app`

Możesz też ustawić własną domenę w zakładce **"Domains"**.

---

## 💻 Uruchomienie lokalnie

```bash
# Zainstaluj zależności
npm install

# Ustaw PIN w pliku .env.local (już jest ustawiony jako 1234)
# Edytuj plik .env.local jeśli chcesz zmienić

# Uruchom serwer deweloperski
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000)

> **Uwaga lokalna:** Lokalnie dane są przechowywane w pamięci — znikają po restarcie serwera.
> Na produkcji (Vercel) dane są trwałe dzięki Vercel KV.

---

## 🔑 Jak korzystać z panelu właścicielki

1. Na stronie kliknij ikonę 🔒 (zamek) w prawym górnym rogu paska filtrów
2. Wpisz swój PIN
3. Pojawią się przyciski **Edytuj** i **Usuń** przy każdej pozycji
4. Pojawi się przycisk **"+ Dodaj"** w pasku

---

## 📁 Struktura projektu

```
wishlist-app/
├── app/
│   ├── api/
│   │   └── items/
│   │       ├── route.ts              # GET (lista), POST (dodaj)
│   │       └── [id]/
│   │           ├── route.ts          # PUT (edytuj), DELETE (usuń)
│   │           └── reserve/
│   │               └── route.ts     # POST (rezerwuj), DELETE (anuluj)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # Główna strona
├── components/
│   ├── ItemCard.tsx                 # Karta produktu
│   ├── ItemFormModal.tsx            # Formularz dodawania/edycji
│   ├── ReserveModal.tsx             # Modal rezerwacji
│   └── PinModal.tsx                 # Modal PIN
├── lib/
│   ├── auth.ts                      # Weryfikacja PIN
│   ├── storage.ts                   # Abstrakcja storage (KV / pamięć)
│   └── types.ts                     # Typy TypeScript
├── .env.local                       # Zmienne lokalne (nie wgrywa na git)
├── .env.example                     # Przykład zmiennych
└── README.md
```

---

## 🛠 Stack techniczny

| Technologia | Zastosowanie |
|------------|-------------|
| **Next.js 15** (App Router) | Framework full-stack |
| **TypeScript** | Typowanie |
| **Tailwind CSS** | Style |
| **Vercel KV** (Redis) | Trwałe przechowywanie danych |
| **Vercel** | Hosting |

---

## 🎨 Dostosowanie

- **Nagłówek/opis** — edytuj `app/page.tsx`, sekcja `HERO`
- **Kolory** — edytuj `app/globals.css`, zmienne CSS w `:root`
- **Kategorie** — edytuj `lib/types.ts`, typ `Category`
