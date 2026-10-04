# আমার দেশ ম্যাপ (bd-maps)

Next.js 16 + Tailwind CSS 4 দিয়ে বানানো Bangladesh district travel map।
জেলা বাছাই করুন, থিম দিন, নাম/ছবি যোগ করুন, তারপর PNG / JPG / PDF ডাউনলোড করুন।

## চালানোর নিয়ম

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Node.js 20+ লাগবে।

## ফিচার

- ৬৪ জেলা, ৮ বিভাগ, জেলা সার্চ, বিভাগ অনুযায়ী "সব বাছাই"
- ম্যাপে সরাসরি ক্লিক করে জেলা বাছাই
- ৫টি থিম, ছবি যোগ, নাম (ঐচ্ছিক), জেলার নাম চালু/বন্ধ
- PNG / JPG / PDF ডাউনলোড (browser-এই তৈরি হয়)
- কোথায় ঘুরবেন: না-যাওয়া জেলার সেরা জায়গা
- ট্রিপ প্ল্যানার: দিন অনুযায়ী সাজানো, টিক দিলে ম্যাপে যোগ

## ব্যাকএন্ড / ডাটাবেস

লাগেনি। সব বাছাই, ছবি ও ট্রিপ ব্রাউজারের `localStorage`-এ থাকে (`src/lib/useAppState.ts`)।
পরে অ্যাকাউন্ট/সেভ করা ম্যাপ লাগলে NestJS + PostgreSQL যোগ করা যাবে।

## ফোল্ডার

```
src/app/            layout, page, globals.css
src/components/     Header, MyMapTab, DistrictPicker, MapCard, ExploreTab, TripPlannerTab
src/data/           districts.ts (generated), divisions, themes, attractions
src/lib/            useAppState, exportCard, bn (বাংলা সংখ্যা)
scripts/            build-districts.py (GeoJSON -> SVG path)
```

## ম্যাপ ডাটা

`src/data/districts.ts` তৈরি হয়েছে geoBoundaries gbOpen (BGD ADM2, simplified) থেকে।
সীমানা © geoBoundaries (geoboundaries.org), CC BY 4.0, তাই footer-এ credit আছে, ওটা রেখে দেবেন।
আবার বানাতে: `pip install shapely` তারপর `python3 scripts/build-districts.py <geojson-file>`।

## কাস্টমাইজ

- জায়গার তালিকা: `src/data/attractions.ts`
- থিমের রং: `src/data/themes.ts`
- ফন্ট: Hind Siliguri + Anek Bangla (`@fontsource`, offline কাজ করে)
