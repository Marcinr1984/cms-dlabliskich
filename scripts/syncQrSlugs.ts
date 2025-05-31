import 'dotenv/config'
import fetch from 'node-fetch'
import { createClient } from '@sanity/client'

// 1. Dane z .env lub na sztywno (lepiej z .env)
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY!
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID!
const SANITY_TOKEN = process.env.SANITY_TOKEN!

// 2. Klient Sanity
const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'dlabliskich',
  useCdn: false,
  apiVersion: '2023-01-01',
  token: SANITY_TOKEN,
})

// 3. Funkcja pobierająca dane z Supabase (widok publiczny)
async function fetchQrSlugsFromSupabase(): Promise<{ qr_slug: string; url: string }[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/public_qr_slugs`, {
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`,
    },
  })

  if (!res.ok) throw new Error('Nie udało się pobrać danych z Supabase')
  return res.json() as Promise<{ qr_slug: string; url: string }[]>
}

// 4. Główna funkcja synchronizująca dane do Sanity
async function syncSlugs() {
  const qrSlugs: { qr_slug: string; url: string }[] = await fetchQrSlugsFromSupabase()

  for (const { qr_slug, url } of qrSlugs) {
    console.log(`✅ Nadpisuję slug: ${qr_slug}`)
    await sanity.createOrReplace({
      _id: `qrslug-${qr_slug}`,
      _type: 'public_qr_slug',
      qr_slug,
      url,
      printed: false,
    })
    console.log(`✅ Zapisano slug w Sanity: ${qr_slug}`)
  }
}

syncSlugs().catch(console.error)