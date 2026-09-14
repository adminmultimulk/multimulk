/**
 * Country dialling codes, and how a phone number is assembled from one.
 *
 * Pure, like `./schema.ts`, and for the same reason: the client renders the
 * country picker from this list and the Server Action validates the choice
 * against it, so both have to agree on what a country is. Nothing here is
 * translated — the client names countries through `Intl.DisplayNames` in the
 * reader's language and falls back to the English here where a browser has no
 * name for one.
 *
 * ISO 3166-1 alpha-2 is the key throughout. Dialling codes are not unique —
 * `+1` is shared by the whole North American plan and `+7` by Russia and
 * Kazakhstan — so the code alone cannot round-trip to a country, and it is the
 * country the CRM wants to know.
 */

import type { Locale } from "../i18n/config";

/** `[ISO 3166-1 alpha-2, dialling code without the plus, English name]`. */
export const countries = [
  ["AF", "93", "Afghanistan"],
  ["AL", "355", "Albania"],
  ["DZ", "213", "Algeria"],
  ["AS", "1684", "American Samoa"],
  ["AD", "376", "Andorra"],
  ["AO", "244", "Angola"],
  ["AI", "1264", "Anguilla"],
  ["AG", "1268", "Antigua & Barbuda"],
  ["AR", "54", "Argentina"],
  ["AM", "374", "Armenia"],
  ["AW", "297", "Aruba"],
  ["AU", "61", "Australia"],
  ["AT", "43", "Austria"],
  ["AZ", "994", "Azerbaijan"],
  ["BS", "1242", "Bahamas"],
  ["BH", "973", "Bahrain"],
  ["BD", "880", "Bangladesh"],
  ["BB", "1246", "Barbados"],
  ["BY", "375", "Belarus"],
  ["BE", "32", "Belgium"],
  ["BZ", "501", "Belize"],
  ["BJ", "229", "Benin"],
  ["BM", "1441", "Bermuda"],
  ["BT", "975", "Bhutan"],
  ["BO", "591", "Bolivia"],
  ["BA", "387", "Bosnia & Herzegovina"],
  ["BW", "267", "Botswana"],
  ["BR", "55", "Brazil"],
  ["IO", "246", "British Indian Ocean Territory"],
  ["VG", "1284", "British Virgin Islands"],
  ["BN", "673", "Brunei"],
  ["BG", "359", "Bulgaria"],
  ["BF", "226", "Burkina Faso"],
  ["BI", "257", "Burundi"],
  ["KH", "855", "Cambodia"],
  ["CM", "237", "Cameroon"],
  ["CA", "1", "Canada"],
  ["CV", "238", "Cape Verde"],
  ["BQ", "599", "Caribbean Netherlands"],
  ["KY", "1345", "Cayman Islands"],
  ["CF", "236", "Central African Republic"],
  ["TD", "235", "Chad"],
  ["CL", "56", "Chile"],
  ["CN", "86", "China"],
  ["CO", "57", "Colombia"],
  ["KM", "269", "Comoros"],
  ["CG", "242", "Congo - Brazzaville"],
  ["CD", "243", "Congo - Kinshasa"],
  ["CK", "682", "Cook Islands"],
  ["CR", "506", "Costa Rica"],
  ["CI", "225", "Côte d’Ivoire"],
  ["HR", "385", "Croatia"],
  ["CU", "53", "Cuba"],
  ["CW", "599", "Curaçao"],
  ["CY", "357", "Cyprus"],
  ["CZ", "420", "Czechia"],
  ["DK", "45", "Denmark"],
  ["DJ", "253", "Djibouti"],
  ["DM", "1767", "Dominica"],
  ["DO", "1809", "Dominican Republic"],
  ["EC", "593", "Ecuador"],
  ["EG", "20", "Egypt"],
  ["SV", "503", "El Salvador"],
  ["GQ", "240", "Equatorial Guinea"],
  ["ER", "291", "Eritrea"],
  ["EE", "372", "Estonia"],
  ["SZ", "268", "Eswatini"],
  ["ET", "251", "Ethiopia"],
  ["FK", "500", "Falkland Islands"],
  ["FO", "298", "Faroe Islands"],
  ["FJ", "679", "Fiji"],
  ["FI", "358", "Finland"],
  ["FR", "33", "France"],
  ["GF", "594", "French Guiana"],
  ["PF", "689", "French Polynesia"],
  ["GA", "241", "Gabon"],
  ["GM", "220", "Gambia"],
  ["GE", "995", "Georgia"],
  ["DE", "49", "Germany"],
  ["GH", "233", "Ghana"],
  ["GI", "350", "Gibraltar"],
  ["GR", "30", "Greece"],
  ["GL", "299", "Greenland"],
  ["GD", "1473", "Grenada"],
  ["GP", "590", "Guadeloupe"],
  ["GU", "1671", "Guam"],
  ["GT", "502", "Guatemala"],
  ["GG", "44", "Guernsey"],
  ["GN", "224", "Guinea"],
  ["GW", "245", "Guinea-Bissau"],
  ["GY", "592", "Guyana"],
  ["HT", "509", "Haiti"],
  ["HN", "504", "Honduras"],
  ["HK", "852", "Hong Kong"],
  ["HU", "36", "Hungary"],
  ["IS", "354", "Iceland"],
  ["IN", "91", "India"],
  ["ID", "62", "Indonesia"],
  ["IR", "98", "Iran"],
  ["IQ", "964", "Iraq"],
  ["IE", "353", "Ireland"],
  ["IM", "44", "Isle of Man"],
  ["IL", "972", "Israel"],
  ["IT", "39", "Italy"],
  ["JM", "1876", "Jamaica"],
  ["JP", "81", "Japan"],
  ["JE", "44", "Jersey"],
  ["JO", "962", "Jordan"],
  ["KZ", "7", "Kazakhstan"],
  ["KE", "254", "Kenya"],
  ["KI", "686", "Kiribati"],
  ["XK", "383", "Kosovo"],
  ["KW", "965", "Kuwait"],
  ["KG", "996", "Kyrgyzstan"],
  ["LA", "856", "Laos"],
  ["LV", "371", "Latvia"],
  ["LB", "961", "Lebanon"],
  ["LS", "266", "Lesotho"],
  ["LR", "231", "Liberia"],
  ["LY", "218", "Libya"],
  ["LI", "423", "Liechtenstein"],
  ["LT", "370", "Lithuania"],
  ["LU", "352", "Luxembourg"],
  ["MO", "853", "Macao"],
  ["MG", "261", "Madagascar"],
  ["MW", "265", "Malawi"],
  ["MY", "60", "Malaysia"],
  ["MV", "960", "Maldives"],
  ["ML", "223", "Mali"],
  ["MT", "356", "Malta"],
  ["MH", "692", "Marshall Islands"],
  ["MQ", "596", "Martinique"],
  ["MR", "222", "Mauritania"],
  ["MU", "230", "Mauritius"],
  ["YT", "262", "Mayotte"],
  ["MX", "52", "Mexico"],
  ["FM", "691", "Micronesia"],
  ["MD", "373", "Moldova"],
  ["MC", "377", "Monaco"],
  ["MN", "976", "Mongolia"],
  ["ME", "382", "Montenegro"],
  ["MS", "1664", "Montserrat"],
  ["MA", "212", "Morocco"],
  ["MZ", "258", "Mozambique"],
  ["MM", "95", "Myanmar"],
  ["NA", "264", "Namibia"],
  ["NR", "674", "Nauru"],
  ["NP", "977", "Nepal"],
  ["NL", "31", "Netherlands"],
  ["NC", "687", "New Caledonia"],
  ["NZ", "64", "New Zealand"],
  ["NI", "505", "Nicaragua"],
  ["NE", "227", "Niger"],
  ["NG", "234", "Nigeria"],
  ["NU", "683", "Niue"],
  ["NF", "672", "Norfolk Island"],
  ["KP", "850", "North Korea"],
  ["MK", "389", "North Macedonia"],
  ["MP", "1670", "Northern Mariana Islands"],
  ["NO", "47", "Norway"],
  ["OM", "968", "Oman"],
  ["PK", "92", "Pakistan"],
  ["PW", "680", "Palau"],
  ["PS", "970", "Palestine"],
  ["PA", "507", "Panama"],
  ["PG", "675", "Papua New Guinea"],
  ["PY", "595", "Paraguay"],
  ["PE", "51", "Peru"],
  ["PH", "63", "Philippines"],
  ["PL", "48", "Poland"],
  ["PT", "351", "Portugal"],
  ["PR", "1787", "Puerto Rico"],
  ["QA", "974", "Qatar"],
  ["RE", "262", "Réunion"],
  ["RO", "40", "Romania"],
  ["RU", "7", "Russia"],
  ["RW", "250", "Rwanda"],
  ["WS", "685", "Samoa"],
  ["SM", "378", "San Marino"],
  ["ST", "239", "São Tomé & Príncipe"],
  ["SA", "966", "Saudi Arabia"],
  ["SN", "221", "Senegal"],
  ["RS", "381", "Serbia"],
  ["SC", "248", "Seychelles"],
  ["SL", "232", "Sierra Leone"],
  ["SG", "65", "Singapore"],
  ["SX", "1721", "Sint Maarten"],
  ["SK", "421", "Slovakia"],
  ["SI", "386", "Slovenia"],
  ["SB", "677", "Solomon Islands"],
  ["SO", "252", "Somalia"],
  ["ZA", "27", "South Africa"],
  ["KR", "82", "South Korea"],
  ["SS", "211", "South Sudan"],
  ["ES", "34", "Spain"],
  ["LK", "94", "Sri Lanka"],
  ["BL", "590", "St. Barthélemy"],
  ["SH", "290", "St. Helena"],
  ["KN", "1869", "St. Kitts & Nevis"],
  ["LC", "1758", "St. Lucia"],
  ["MF", "590", "St. Martin"],
  ["PM", "508", "St. Pierre & Miquelon"],
  ["VC", "1784", "St. Vincent & Grenadines"],
  ["SD", "249", "Sudan"],
  ["SR", "597", "Suriname"],
  ["SE", "46", "Sweden"],
  ["CH", "41", "Switzerland"],
  ["SY", "963", "Syria"],
  ["TW", "886", "Taiwan"],
  ["TJ", "992", "Tajikistan"],
  ["TZ", "255", "Tanzania"],
  ["TH", "66", "Thailand"],
  ["TL", "670", "Timor-Leste"],
  ["TG", "228", "Togo"],
  ["TK", "690", "Tokelau"],
  ["TO", "676", "Tonga"],
  ["TT", "1868", "Trinidad & Tobago"],
  ["TN", "216", "Tunisia"],
  ["TR", "90", "Türkiye"],
  ["TM", "993", "Turkmenistan"],
  ["TC", "1649", "Turks & Caicos Islands"],
  ["TV", "688", "Tuvalu"],
  ["UG", "256", "Uganda"],
  ["UA", "380", "Ukraine"],
  ["AE", "971", "United Arab Emirates"],
  ["GB", "44", "United Kingdom"],
  ["US", "1", "United States"],
  ["VI", "1340", "U.S. Virgin Islands"],
  ["UY", "598", "Uruguay"],
  ["UZ", "998", "Uzbekistan"],
  ["VU", "678", "Vanuatu"],
  ["VA", "39", "Vatican City"],
  ["VE", "58", "Venezuela"],
  ["VN", "84", "Vietnam"],
  ["WF", "681", "Wallis & Futuna"],
  ["YE", "967", "Yemen"],
  ["ZM", "260", "Zambia"],
  ["ZW", "263", "Zimbabwe"],
] as const;

export type CountryCode = (typeof countries)[number][0];

export const countryCodes: readonly CountryCode[] = countries.map(
  ([iso]) => iso,
);

const byCode = new Map<string, (typeof countries)[number]>(
  countries.map((entry) => [entry[0], entry]),
);

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === "string" && byCode.has(value);
}

/** The dialling prefix as it is shown and stored: `+90`. */
export function dialCodeFor(country: CountryCode): string {
  return `+${byCode.get(country)![1]}`;
}

export function countryNameFor(country: CountryCode): string {
  return byCode.get(country)![2];
}

/**
 * Where the picker opens before the reader has touched it.
 *
 * Only a first guess, and a deliberately modest one: the language a page is
 * read in says something about where the reader is, and nothing more. The
 * client refines it from the browser's own region where it has one. English
 * lands on Türkiye because the site sells Türkiye and no other single country
 * is a better guess for an English-speaking reader.
 */
export function defaultCountryFor(locale: Locale): CountryCode {
  switch (locale) {
    case "tr":
      return "TR";
    case "ar":
      return "AE";
    case "ur":
      return "PK";
    case "zh":
      return "CN";
    case "ru":
      return "RU";
    case "fr":
      return "FR";
    default:
      return "TR";
  }
}

/** Of the countries sharing a dialling code, the one a bare code usually means. */
const principal = new Set<CountryCode>(["US", "RU", "GB", "IT", "CW", "GP", "RE"]);

export type ComposedPhone = {
  /** E.164 — `+905321234567`. What is dialled and what the CRM stores. */
  phone: string;
  country: CountryCode;
  /** `+90`, kept beside the number so nobody has to re-derive it. */
  code: string;
};

/**
 * Joins the country the reader picked to the number they typed.
 *
 * The number arrives in whatever convention the reader dials in at home — with
 * a trunk `0`, with spaces, with brackets — and the point of asking for the
 * country separately is that none of that has to be parsed. Two habits are
 * accommodated anyway, because readers have them: typing the country code
 * again in front of the number, and typing a full international number. The
 * first is stripped; the second overrides the picker, since a `+` at the front
 * is the reader stating the country more precisely than a menu could.
 *
 * Returns null for anything that could not be dialled.
 */
export function composePhone(
  country: CountryCode,
  typed: string,
): ComposedPhone | null {
  let raw = typed.trim().replace(/[\s().-]/g, "");

  // A leading `00` is the international prefix in most of the world; treat it
  // as the `+` it stands for.
  if (raw.startsWith("00")) raw = `+${raw.slice(2)}`;

  let chosen = country;

  if (raw.startsWith("+")) {
    const digits = raw.slice(1);
    if (!/^\d+$/.test(digits)) return null;

    // Longest dialling code that prefixes the digits. Several are shared —
    // `+1`, `+7`, `+44` — and a tie goes to the picker's own country, so a
    // reader who chose Canada and typed a `+1` number stays in Canada; failing
    // that, to the country the code is best known for.
    const chosenCode = byCode.get(chosen)![1];
    let match: (typeof countries)[number] | undefined =
      digits.startsWith(chosenCode) ? byCode.get(chosen) : undefined;
    for (const entry of countries) {
      if (!digits.startsWith(entry[1])) continue;
      if (
        !match ||
        entry[1].length > match[1].length ||
        (entry[1].length === match[1].length &&
          match[0] !== chosen &&
          principal.has(entry[0]))
      ) {
        match = entry;
      }
    }
    if (!match) return null;

    chosen = match[0];
    raw = digits.slice(match[1].length);
  }

  if (!/^\d*$/.test(raw)) return null;

  // The trunk prefix — the `0` in `0532 …` — is not dialled from abroad.
  // Italy keeps its leading zero, and is the only country in the list that
  // does.
  const national = chosen === "IT" ? raw : raw.replace(/^0+/, "");
  const code = byCode.get(chosen)![1];

  // E.164 allows fifteen digits in all; the floor rules out a number that was
  // only ever a country code and a typo.
  if (national.length < 4 || code.length + national.length > 15) return null;

  return {
    phone: `+${code}${national}`,
    country: chosen,
    code: `+${code}`,
  };
}
