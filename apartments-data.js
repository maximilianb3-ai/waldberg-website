// ═══════════════════════════════════════════════════════════════
//  WOHNUNGSDATEN – Waldberg e.G.
//  Hier freie Wohnungen eintragen. Leeres Array = keine verfügbar,
//  die Warteliste wird automatisch angezeigt.
// ═══════════════════════════════════════════════════════════════

const APARTMENTS = [

  // ── Beispiel (auskommentiert) ──────────────────────────────────
  // {
  //   id: 1,
  //   entrance: 4,           // Hauseingang 1–12
  //   floor: '2. OG',        // 'EG', '1. OG', '2. OG', '3. OG'
  //   type: '3-Zimmer',      // '2-Zimmer', '3-Zimmer', '4-Zimmer'
  //   size: 68,              // Wohnfläche in m²
  //   rent: 420,             // Kaltmiete in €
  //   available: '01.09.2026', // Verfügbar ab
  //   features: ['Balkon', 'Badewanne'], // optional
  // },

];

// ── Blockdaten (für wohnblock.html) ─────────────────────────────
const BLOCK = {
  entrances: 12,
  totalUnits: 119,
  floors: 4,
  types: ['2-Zimmer', '3-Zimmer', '4-Zimmer'],
  address: 'Kurt-Tucholsky-Straße 12',
  city: '07973 Greiz, Thüringen',
};
