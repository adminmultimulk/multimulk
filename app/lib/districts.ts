/**
 * Where İstanbul's districts are, so a listing can be pinned by name.
 *
 * The pin was first drawn from a listing's `mapLat`/`mapLng`, which turned out
 * to be wrong twice over. Those fields are optional and mostly empty — the
 * development this was built for has neither — so the map fell back to an
 * embed on the listings that matter. And where they *are* filled in they hold
 * the building, which is the one thing this section is not supposed to give
 * away; pinning them meant blunting them again afterwards.
 *
 * A district centre is the better source on both counts. It is what a buyer is
 * being told — the address is an area, not a doorway — it is available for
 * every listing whose `location` names a district, and it cannot leak a
 * building because it does not know about one.
 *
 * Centres are approximate. On a picture of the whole city a kilometre is about
 * twelve pixels, and the question the pin answers is "which part of İstanbul",
 * which a kilometre does not change.
 */

export type Point = { lat: number; lng: number };

/**
 * Keys are normalised by `normalise` below — lower case, and Turkish letters
 * folded to ASCII, so "Şişli", "SISLI" and "sisli" are one entry.
 */
const DISTRICTS: Record<string, Point> = {
  adalar: { lat: 40.876, lng: 29.09 },
  arnavutkoy: { lat: 41.184, lng: 28.74 },
  atasehir: { lat: 40.984, lng: 29.107 },
  avcilar: { lat: 40.98, lng: 28.717 },
  bagcilar: { lat: 41.034, lng: 28.856 },
  bahcelievler: { lat: 41.0, lng: 28.859 },
  bakirkoy: { lat: 40.98, lng: 28.872 },
  basaksehir: { lat: 41.093, lng: 28.802 },
  bayrampasa: { lat: 41.047, lng: 28.912 },
  besiktas: { lat: 41.043, lng: 29.007 },
  beykoz: { lat: 41.125, lng: 29.109 },
  beylikduzu: { lat: 41.002, lng: 28.642 },
  beyoglu: { lat: 41.033, lng: 28.977 },
  buyukcekmece: { lat: 41.02, lng: 28.575 },
  catalca: { lat: 41.143, lng: 28.461 },
  cekmekoy: { lat: 41.036, lng: 29.18 },
  esenler: { lat: 41.043, lng: 28.876 },
  esenyurt: { lat: 41.029, lng: 28.673 },
  eyupsultan: { lat: 41.048, lng: 28.933 },
  fatih: { lat: 41.019, lng: 28.94 },
  gaziosmanpasa: { lat: 41.058, lng: 28.912 },
  gungoren: { lat: 41.021, lng: 28.871 },
  kadikoy: { lat: 40.99, lng: 29.03 },
  kagithane: { lat: 41.085, lng: 28.972 },
  kartal: { lat: 40.889, lng: 29.188 },
  kucukcekmece: { lat: 41.0, lng: 28.775 },
  maltepe: { lat: 40.936, lng: 29.156 },
  pendik: { lat: 40.876, lng: 29.234 },
  sancaktepe: { lat: 41.001, lng: 29.231 },
  sariyer: { lat: 41.167, lng: 29.057 },
  sultanbeyli: { lat: 40.964, lng: 29.267 },
  sultangazi: { lat: 41.106, lng: 28.867 },
  sisli: { lat: 41.06, lng: 28.988 },
  tuzla: { lat: 40.816, lng: 29.303 },
  umraniye: { lat: 41.016, lng: 29.121 },
  uskudar: { lat: 41.023, lng: 29.015 },
  zeytinburnu: { lat: 40.994, lng: 28.909 },
  // Silivri (28.25E) and Şile (29.61E) are real districts that fall outside
  // the rectangle the picture covers. They are deliberately absent: an unknown
  // name falls back to the interactive embed, which is the right answer for a
  // place the picture cannot show.
};

/**
 * Turkish letters folded to ASCII.
 *
 * `toLowerCase` alone is not enough. NFD splits the accented forms apart so the
 * combining marks can be dropped, but dotless ı and ş carry no separable mark
 * in every form, so they are mapped directly.
 */
function normalise(value: string): string {
  return value
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]/g, "");
}

/**
 * The centre of the district a `location` names, or null.
 *
 * `location` is written as the lister typed it — "Kartal, Istanbul", "Şişli",
 * "Beylikdüzü, İstanbul" — so each comma-separated part is tried and the first
 * that names a district wins. "İstanbul" itself is not a district and matches
 * nothing, which is what should happen: the city is not a pin.
 */
export function districtCentre(location: string): Point | null {
  for (const part of location.split(",")) {
    const found = DISTRICTS[normalise(part)];
    if (found) return found;
  }
  return null;
}

/**
 * The districts a lister can pin to, as written for people.
 *
 * The keys above are folded to ASCII so that whatever a lister typed into
 * `location` still matches; these are the same places spelled properly, for
 * the dashboard's dropdown. Kept in this file so that adding a district means
 * adding its centre — a name in the list with no coordinates behind it would
 * be a pin that silently never appears.
 */
export const DISTRICT_NAMES = [
  "Adalar",
  "Arnavutköy",
  "Ataşehir",
  "Avcılar",
  "Bağcılar",
  "Bahçelievler",
  "Bakırköy",
  "Başakşehir",
  "Bayrampaşa",
  "Beşiktaş",
  "Beykoz",
  "Beylikdüzü",
  "Beyoğlu",
  "Büyükçekmece",
  "Çatalca",
  "Çekmeköy",
  "Esenler",
  "Esenyurt",
  "Eyüpsultan",
  "Fatih",
  "Gaziosmanpaşa",
  "Güngören",
  "Kadıköy",
  "Kağıthane",
  "Kartal",
  "Küçükçekmece",
  "Maltepe",
  "Pendik",
  "Sancaktepe",
  "Sarıyer",
  "Sultanbeyli",
  "Sultangazi",
  "Şişli",
  "Tuzla",
  "Ümraniye",
  "Üsküdar",
  "Zeytinburnu",
] as const;

/** Whether a stored value still names a district this file knows about. */
export function isDistrict(value: string): boolean {
  return Boolean(DISTRICTS[normalise(value)]);
}
