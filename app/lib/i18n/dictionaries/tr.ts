/**
 * Türkçe.
 *
 * A `preview` locale (see `localeStatus` in `../config`): it renders and can be
 * linked, but it is kept out of `hreflang`, out of the sitemap and out of the
 * language switcher until it is complete. Everything absent here shows through
 * from English, so this file grows section by section rather than having to
 * land in one 1,000-line piece.
 *
 * Register: the second-person plural used in Turkish property and legal
 * marketing. Development and operator names stay as written, which is how they
 * are listed and searched for.
 *
 * When every key is present, change the annotation below to
 * `const tr: Dictionary = { ... }`, move it out of the overlaid branch of the
 * loader in `../index.ts`, and set `localeStatus.tr = "published"`.
 */

import type { PartialDictionary } from "../index";

const tr = {
  meta: {
    home: {
      title: "Multi Mulk | Küresel Vatandaşlar için Küresel Çözümler",
      description:
        "Türk vatandaşlığı, ikamet programları ve Türkiye ile Karayipler’de gayrimenkul yatırımı konusunda danışmanlık.",
    },
    about: {
      title: "Hakkımızda",
      description:
        "Multi Mulk, yatırım yoluyla vatandaşlık ve uluslararası gayrimenkul alanında çalışan bir danışmanlık şirketidir.",
    },
    media: {
      title: "Medya Merkezi",
      description:
        "Yatırım yoluyla vatandaşlık, ikamet ve gayrimenkul piyasalarına dair haberler ve rehberler.",
    },
    search: {
      title: "Gayrimenkul Arayın",
      description:
        "Türkiye ve Karayipler’deki portföyümüzde konum, tip ve bütçeye göre arama yapın.",
    },
    contact: {
      title: "İletişim",
      description:
        "Multi Mulk danışmanlık ekibiyle iletişime geçin. Ofislerimiz BAE, Türkiye ve Pakistan’dadır.",
    },
  },

  common: {
    getInTouch: "İletişime Geçin",
    learnMore: "Daha Fazla",
    viewAll: "Tümünü Gör",
    readMore: "Devamını Oku",
    enquireNow: "Hemen Başvurun",
    loadMore: "Daha Fazla Yükle",
    startingFrom: "Başlangıç Fiyatı",
    any: "Farketmez",
    sortBy: "Sırala",
    resetAll: "Tümünü Sıfırla",
    searchProperties: "Gayrimenkul Ara",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    close: "Kapat",
    logoAlt: "Multi Mulk — Küresel Vatandaşlar için Küresel Çözümler",
    chooseLanguage: "Bir dil seçin",
    socialProfile: "{name} sosyal medya hesabı",
  },

  review: {
    line: "Son inceleme: {date}",
    by: "İnceleyen: {name}",
    sources: "Kaynaklar",
    retrieved: "{date} tarihinde erişildi",
    stale: "Bu sayfanın gözden geçirilmesi gerekiyor. Herhangi bir rakama göre hareket etmeden önce bize teyit ettirin.",
  },

  figures: {
    qualifiers: {
      statutory: "Kanunda belirlenmiştir.",
      estimated:
        "Tahminî — resmî işlem sürelerine ve her başvuranın koşullarına bağlıdır. Garanti değildir.",
      indicative: "Yol gösterici niteliktedir. Kendi koşullarınız için teyit edin.",
      market: "Piyasa tahmini; taşınmaza ve tarihe göre değişir.",
    },
    units: {
      months: "ay",
      years: "yıl",
      days: "gün",
      count: "ülke",
      percent: "%",
    },
  },

  authors: {
    roles: {
      founder: "Kurucu ve Genel Müdür",
      advisory: "Danışmanlık Direktörü",
      team: "Danışmanlık Ekibi",
    },
  },

  routes: {
    home: "Ana Sayfa",
    about: "Hakkımızda",
    contact: "İletişim",
    search: "Gayrimenkuller",
    knowledge: "Bilgi Merkezi",
    article: "Makale",
    development: "Proje",
    citizenshipHub: "Yatırım Yoluyla Vatandaşlık",
    citizenshipProgramme: "Program",
    goldenVisaHub: "Altın Vize ve Oturum",
    goldenVisaProgramme: "Program",
    realEstateHub: "Gayrimenkul",
    country: "Ülke",
    compareIndex: "Programları Karşılaştır",
    comparison: "Karşılaştırma",
    investorProtection: "Yatırımcı Koruması",
    faqIndex: "Multi Mulk'a Sorun",
    faq: "Soru",
    caseStudies: "Müşteri Sonuçları",
    caseStudy: "Vaka Çalışması",
    tools: "Araçlar",
    authors: "Ekibimiz",
    author: "Profil",
    legal: "Yasal",
  },

  hero: {
    heading: "Vatandaşlık, Oturum ve Küresel Yatırım",
    body: "Küresel yatırım yapın. Oturum edinin. İkinci yurt stratejinizi kurun — bir programın size uymadığını da söyleyecek danışmanlarla.",
    pathsLabel: "Nereden başlamak istersiniz?",
    paths: {
      citizenship: "Vatandaşlık Edinin",
      residency: "Oturum Edinin",
      property: "Gayrimenkule Yatırım Yapın",
    },
    slides: {
      "istanbul-dusk": "İki kıtanın buluştuğu yer",
      "island": "Devlet onaylı Karayip programları",
      "dubai": "On yıllık, yenilenebilir oturum",
      "advisory": "Envanterden önce danışmanlık",
    },
    showSlide: "{name} göster",
    propertyType: "Gayrimenkul tipi",
    bedroom: "Yatak odası",
    country: "Ülke",
    currency: "Para birimi",
    maximumPrice: "Azami fiyat",
  },

  nav: {
    citizenship: "Vatandaşlık",
    goldenVisa: "Altın Vize",
    realEstate: "Gayrimenkul",
    protection: "Yatırımcı Koruması",
    knowledge: "Bilgi",
    about: "Hakkımızda",
  },

  footer: {
    columns: {
      turkiye: "Türkiye",
      caribbean: "Karayipler",
      about: "Hakkımızda",
    },
    aboutItems: {
      ourStory: "Hikâyemiz",
      ourTeam: "Ekibimiz",
      turkishCitizenship: "Türk Vatandaşlığı",
      caribbeanCbi: "Karayipler Vatandaşlığı",
      mediaCentre: "Medya Merkezi",
      construction: "İnşaat Güncellemeleri",
      terms: "Şartlar ve Koşullar",
      privacy: "Gizlilik Politikası",
    },
    contactTitle: "Bize Ulaşın",
    copyright: "© 2026 Multi Mulk. Tüm hakları saklıdır.",
    offices: { UAE: "BAE", Türkiye: "Türkiye", Pakistan: "Pakistan" },
  },
  pillars: {
    citizenship: {
      eyebrow: "Yatırım Yoluyla Vatandaşlık",
      heading: "Bir Varlık Olarak İkinci Vatandaşlık",
      body: "Uygun bir yatırım karşılığında tam vatandaşlık veren programlar. Hangisinin size uyduğu konusunda danışmanlık veriyoruz — çoğu zaman da hangisinin uymadığı konusunda.",
      hubIntro: "Aşağıdaki her program aynı alanlarla veriliyor; böylece tek tek broşür okumak yerine birbirine karşı okunabiliyorlar. Rakamlar kaynağını ve en son ne zaman doğrulandığını taşır.",
    },
    goldenVisa: {
      eyebrow: "Altın Vize ve Oturum",
      heading: "Taşınmadan Oturum",
      body: "Yatırım yoluyla alınan oturum izinleri — bir üs, bir vergi konumu ve birçok durumda zamanla vatandaşlığa giden bir yol.",
      hubIntro: "Oturum, vatandaşlıktan belirleyici bir noktada ayrılır: yenilenebilir ve iptal edilebilir bir kalma iznidir, bir uyrukluk değil. Aşağıdaki tablo her birinin gerçekte ne verdiğini gösteriyor.",
    },
    realEstate: {
      eyebrow: "Gayrimenkul",
      heading: "Yatırım Gibi Çalışan Gayrimenkul",
      body: "İstanbul'da, Türkiye kıyılarında, Dubai'de ve Karayipler'de projeler — portföyümüze girmeden önce değerlendirilir, sonrasında değil.",
    },
    protection: {
      eyebrow: "Yatırımcı Koruması",
      heading: "Her Uygun Gayrimenkul İyi Bir Yatırım Değildir",
      body: "Bir gayrimenkul programın eşiğini karşılayıp yine de kötü bir varlık olabilir. Bir müşteriye herhangi bir şey sunmadan önce yaptığımız denetimler bunlar.",
    },
  },

  compare: {
    eyebrow: "Karşılaştır",
    heading: "Programlar, Yan Yana",
    intro: "Bu tablolardaki her rakam aynı program kaydından okunur; dolayısıyla bir eşik burada başka, programın kendi sayfasında başka şey söyleyemez.",
    factor: "Ölçüt",
    unknownLabel: "Doğrulanmadı",
    noneRequired: "Gerekmiyor",
    noAgeLimit: "Yaş sınırı yok",
    grantedDirectly: "Doğrudan verilir",
    noRoute: "Yol yok",
    yes: "Evet",
    no: "Hayır",
    bestLabel: "En elverişli",
    rows: {
      minimumInvestment: "Asgari yatırım",
      holdingPeriod: "Elde tutma süresi",
      processingTime: "İşlem süresi",
      visaFree: "Vizesiz ülke sayısı",
      schengen: "Schengen erişimi",
      dualCitizenship: "Çifte vatandaşlığa izin",
      residencyRequired: "Ülkede kalma zorunluluğu",
      physicalVisit: "Ziyaret zorunlu",
      dependentChildren: "Bakmakla yükümlü çocuk yaşı",
      parentsIncluded: "Ebeveynler dâhil edilebilir",
      citizenshipAfter: "Vatandaşlık süresi",
      worldwideTax: "Dünya genelindeki geliri vergilendirir",
    },
  },

  programmes: {
    routes: {
      "real-estate": "Gayrimenkul",
      donation: "Devlet fonuna bağış",
      bonds: "Devlet tahvili",
      business: "İş yatırımı",
      deposit: "Banka mevduatı",
      fund: "Yatırım fonu",
    },
    offeredLabel: "Bu yol için danışmanlık veriyoruz",
    notOfferedLabel: "Tanınıyor, ancak bizim işlem yaptığımız bir yol değil",
    routesHeading: "Uygun yollar",
    statusHeading: "Program durumu",
    status: {
      open: "Açık",
      suspended: "Askıda",
      closed: "Kapalı",
      announced: "Duyuruldu",
    },
    sinceLabel: "Açılış yılı",
    unreviewed: "Bu sayfadaki rakamların hukuki incelemesi henüz tamamlanmadı ve yayımlanmış değil. Herhangi birine göre hareket etmeden önce bize teyit ettirin.",
  },

  faq: {
    eyebrow: "Multi Mulk'a Sorun",
    heading: "İnsanların Gerçekten Sorduğu Sorular",
    body: "Bitiren cevaplar. Cevap gerçekten bir şeye bağlıysa, o şey söylenir; bizi aramanız için bir bahane olarak bırakılmaz.",
    fullAnswer: "Tam cevabı okuyun",
    topics: {
      eligibility: "Uygunluk",
      cost: "Maliyet",
      timeline: "Süre",
      family: "Aile",
      property: "Gayrimenkul",
      tax: "Vergi",
      process: "Süreç",
      travel: "Seyahat",
    },
  },

  caseStudies: {
    eyebrow: "Müşteri Sonuçları",
    heading: "İş Gerçekte Nasıl Görünür",
    body: "Kimliği gizlenmiş dosyalar; gerekçeler ve aksaklıklar yerinde bırakılmış. Aksaklığı olmayan bir vaka çalışması broşürdür.",
    objective: "Amaç",
    family: "Aile",
    invested: "Yatırılan",
    timeline: "Baştan sona",
    afterwards: "Sonrasında",
    reasoning: "Neden bu ve nelerin elendiği",
    complication: "Nerede aksadı",
    consentPending: "Henüz yayımlanmış bir müşteri sonucu yok. Bunun için müşterinin yazılı onayı gerekiyor ve Multi Mulk şu ana kadar hiçbiri için bu onaya sahip değil.",
  },

  tools: {
    eyebrow: "Araçlar",
    heading: "Rakamları Kendiniz Hesaplayın",
    body: "Her hesaplayıcı, sitenin geri kalanının okuduğu program kayıtlarını okur; dolayısıyla buradaki hiçbir şey program sayfasının aksini söyleyen bir eşik veremez.",
    calculator: {
      heading: "Her şey dâhil maliyet",
      body: "Eşik yatırımdır, maliyet değil. Bu hesap, toplamın altında sıralanan varsayımlarla işlem masraflarını üzerine ekler.",
      programme: "Program",
      adults: "Yetişkin",
      children: "18 yaş altı çocuk",
      total: "Tahminî toplam",
      lines: {
        investment: "Uygun yatırım",
        transferTax: "Tapu devir vergisi",
        legal: "Hukuk ve danışmanlık ücretleri",
        documentation: "Ekspertiz, tercüme ve noter",
        government: "Devlet harçları",
      },
      assumptions: "{tax} devir vergisi, {legal} hukuk ve danışmanlık ücreti, {docs} belge masrafı ve {people} başvuran için kişi başı {gov} varsayılmıştır.",
      caveat: "Planlama için bir tahmindir, teklif değildir. Oranlar gayrimenkule, ülkeye ve tarihe göre değişir; KDV durumu dâhil değildir. Herhangi bir taahhütte bulunmadan önce gerçek rakamı yazılı olarak veririz.",
    },
  },

  welcome: {
    eyebrow: "Multi Mulk'a Hoş Geldiniz",
    heading: "Küresel Vatandaşlar için Küresel Çözümler",
    body: "Multi Mulk, uluslararası düşünen ailelerin ve yatırımcıların dünyanın en cazip yerlerinde kök salmasına yardımcı olur. Yaptığımız işin merkezinde yatırım yoluyla Türk vatandaşlığı vardır — İstanbul'un simge adreslerinden Ege kıyılarına — ve yanı sıra seçili Karayip programları. Gayrimenkul seçiminden satın almaya ve vatandaşlık başvurusuna kadar her adımda yanınızdayız; Türkiye, BAE ve Pakistan'daki ofislerimizle.",
  },

  video: {
    eyebrow: "IPS Dubai Fuarı 2026",
    heading: "İstanbul'un En İyi 14 Yatırım Projesi",
    play: "Videoyu oynat",
  },

  regions: {
    turkiye: {
      label: "Türkiye",
    },
    caribbean: {
      label: "Karayipler",
    },
  },

  turkiyeSection: {
    eyebrow: "Türkiye Gayrimenkul",
    heading: "Türk Vatandaşlığıyla Yaşam",
    body: "Çağdaş mimarisi, İstanbul ve kıyıdaki seçkin konumlarıyla ve yatırım yoluyla vatandaşlığa uygun rezidanslarıyla Türkiye portföyümüzü keşfedin.",
    descriptions: {
      "bosphorus-heights": "Beyoğlu'nda, Galata ve vapur iskelelerine birkaç adım mesafede; Bosphorus Heights, boğazı ve ardındaki tarihi yarımadayı çerçeveleyen 165 rezidans sunuyor.",
      "marmara-vista": "Marmara Vista, İstanbul'un batı kıyısında Marmara Denizi'ne bakan panoramik manzarasıyla 151 seçkin stüdyo, 1 ve 2 yatak odalı rezidans sunuyor.",
      "levent-residences": "Levent finans bölgesine dakikalar uzaklıkta simge bir Şişli adresi: 420 daire ve 11 özel sıra ev.",
      "aegean-bay-residences": "Sakin bir Bodrum koyunun üzerinde bir sığınak; 88 lüks stüdyo, 1 ve 2 yatak odalı rezidans.",
      "antalya-coast": "Konyaaltı sahilinde Antalya Coast, üç imza binada daireler, çatı katları ve sosyal donatıları bir araya getiren 1.023 rezidans sunuyor.",
      "anatolian-villas": "Sarıyer'deki dört villa tipimizi keşfedin; mahremiyet, zarafet ve modern lükse özel bir yaklaşım arayanlar için tasarlandı.",
    },
  },

  awards: {
    eyebrow: "Ödüller ve Başarılar",
    heading: "Mükemmellikle Anıldı",
    // Empty: `awardItems` in content.ts is empty, and the badges it
    // used to hold belonged to the reference site's resorts.
    captions: {},
  },

  articlesSection: {
    heading: "En Son Yazılar",
    body: "En güncel haberleri, analizleri ve kaynakları burada bulun. Bu merkez; blog yazıları, basın bültenleri ve ayrıntılı rehberlerle projelerimizden haberdar olmanızı sağlar.",
    categoryLabel: "Yazı kategorisi",
  },

  articles: {
    categories: {
      All: "Tümü",
      "Press Media": "Basında Biz",
      Blog: "Blog",
    },
    sort: {
      Newest: "En yeni",
      Oldest: "En eski",
    },
    sortLabel: "Yazıları sırala",
    empty: "{filter} altında henüz bir şey yok.",
    copy: {},
  },

  media: {
    heroEyebrow: "Medya Merkezi",
    showArticle: "“{title}” yazısını göster",
    indexHeading: "Tüm Yazılar",
    indexBody: "En güncel haberleri, analizleri ve kaynakları burada bulun. Bu merkez; blog yazıları, basın bültenleri ve ayrıntılı rehberlerle projelerimizden haberdar olmanızı sağlar.",
    newsletter: {
      heading: "Daha derine inin, haberdar kalın",
      body: "Hiçbir gelişmeyi kaçırmayın — her güncellemeden haberiniz olsun.",
      cta: "Hemen Başvurun",
    },
    article: {
      categoryLabel: "Kategori:",
      publishedLabel: "Yayın tarihi:",
      sourceLabel: "Kaynak:",
      relatedHeading: "İlgili Yazılar",
      readingTime: { one: "{count} dk okuma", other: "{count} dk okuma" },
    },
  },

  search: {
    heading: "Yeni Adresiniz Burada Başlıyor",
    body: "Resort olanaklarına erişimi, geniş manzaraları ve zahmetsiz kıyı yaşamı olan rezidansları aramanıza göre inceleyin.",
    panelHeading: "En Seçkin Rezidansları Bulun",
    showing: {
      one: "{count} birim gösteriliyor",
      other: "{count} birim gösteriliyor",
    },
    searchLabel: "Ara",
    searchPlaceholder: "Rezidans adı",
    propertyType: "Gayrimenkul tipi",
    bedroom: "Yatak odası",
    currency: "Para birimi",
    location: "Konum",
    cbiOnly: "Yalnızca vatandaşlığa uygun",
    cbiHint: "{amount} USD'den itibaren — Türkiye vatandaşlık eşiği",
    noResults: "Bu filtrelere uyan rezidans yok",
  },

  places: {
    Türkiye: "Türkiye",
    Caribbean: "Karayipler",
    "İstanbul": "İstanbul",
    Antalya: "Antalya",
    Muğla: "Muğla",
    Grenada: "Grenada",
    "Şişli": "Şişli",
    Beylikdüzü: "Beylikdüzü",
    Beyoğlu: "Beyoğlu",
    Bodrum: "Bodrum",
    Sarıyer: "Sarıyer",
    Konyaaltı: "Konyaaltı",
    Dominica: "Dominika",
    "St. Kitts & Nevis": "St. Kitts ve Nevis",
    "Antigua & Barbuda": "Antigua ve Barbuda",
    "St. Lucia": "St. Lucia",
    "La Sagesse Bay": "La Sagesse Bay",
    "Cabrits National Park": "Cabrits National Park",
    "Christophe Harbour": "Christophe Harbour",
    Portsmouth: "Portsmouth",
  },

  unit: {
    citizenshipEligible: "Vatandaşlığa uygun",
    soldOut: "Tükendi",
    enquirySubject: "{unit}, {place} hakkında talep",
    types: {
      Apartment: "Daire",
      Townhouse: "Müstakil sıra ev",
      Villa: "Villa",
    },
    studio: "Stüdyo",
    bedrooms: {
      one: "{count} Yatak Odası",
      other: "{count} Yatak Odası",
    },
    bathrooms: {
      one: "{count} Banyo",
      other: "{count} Banyo",
    },
    layouts: {
      Simplex: "Simpleks",
      Duplex: "Dubleks",
      "Townhouse + Maid": "Sıra ev + hizmetli odası",
    },
    sqft: "ft²",
    level: "Kat {range}",
    levels: {
      "Ground Floor": "Zemin kat",
      "First Floor": "Birinci kat",
      "East Wing": "Doğu kanadı",
      "West Wing": "Batı kanadı",
      "Sky Lofts": "Sky Lofts",
      "Marjan Lofts": "Marjan Lofts",
      "Mrjan Lofts": "Marjan Lofts",
      "Luxury Residences": "Lüks rezidanslar",
      Townhouses: "Sıra evler",
    },
    views: {
      "Sea View": "Deniz manzarası",
      "City View": "Şehir manzarası",
      "Sea View & Island View": "Deniz ve ada manzarası",
      "Casino & Island View": "Casino & Island View",
      "Island & Casino": "Island & Casino",
    },
  },

  protection: {
    filtersHeading: "Üç süzgeç, sırasıyla",
    filters: {
      eligible: {
        heading: "Uygun",
        body: "Gayrimenkul programa hukuken uyuyor mu? Bunun cevabı evet ya da hayırdır ve hayır konuşmayı bitirir.",
      },
      sensible: {
        heading: "Mali açıdan makul",
        body: "Fiyat, gayrimenkulün gerçek değerine yakın mı? Bir eşiği karşılamak değer hakkında hiçbir şey söylemez ve yalnızca eşiği geçmek için alınan bir gayrimenkul genellikle kötü alınmıştır.",
      },
      exitReady: {
        heading: "Çıkışa hazır",
        body: "Kiraya verilebilir mi ve elde tutma süresi bittiğinde satılabilir mi? Çıkamadığınız bir varlık yatırım değil, yükümlülüktür.",
      },
    },
    checksHeading: "Yatırım yapmadan önce neleri denetliyoruz",
    checksIntro: "Yirmi soru, her seferinde aynı sırayla. Soru olarak yazıldılar çünkü öyleler: her birinin dosyamızda bir cevabı vardır, yoksa gayrimenkul ilerlemez.",
    checks: {
      developerRecord: "Geliştirici kim ve daha önce neleri tamamladı?",
      developerFinances: "Geliştiricinin hesapları ve bildirimleri ne gösteriyor?",
      titleDeed: "Tapu temiz mi ve satıcının adına mı?",
      ownershipHistory: "Bu gayrimenkulün sahipleri kimlerdi ve en son ne zaman el değiştirdi?",
      citizenshipEligibility: "Gayrimenkul programın uygunluk kurallarını karşılıyor mu?",
      gyoStatus: "Satıcı bir GYO mu ve bu burada bir şeyi değiştiriyor mu?",
      valuation: "Resmî ekspertiz istenen fiyatı destekliyor mu?",
      sellerEligibility: "Satıcı, vatandaşlık başvurusu yapan birine satış yapmaya uygun mu?",
      buildingPermits: "Yapı ruhsatları mevcut ve geçerli mi?",
      constructionStage: "İnşaat hangi aşamada ve hangi takvime göre?",
      comparablePrices: "Yakındaki benzer gayrimenkuller gerçekte kaça satıldı?",
      pricePerSqm: "Metrekare fiyatı semte göre nerede duruyor?",
      rentalDemand: "Burada gerçek bir kira talebi var mı, yoksa yalnızca öngörülen mi?",
      rentalYield: "Bu talep, giderlerden sonra hangi net getiriyi destekliyor?",
      resaleLiquidity: "Bu tür bir stok bu piyasada ne kadar hızlı yeniden satılıyor?",
      exitStrategy: "Çıkış nedir ve neye bağlıdır?",
      hiddenCosts: "İlan edilen fiyatın içinde olmayan maliyetler neler?",
      vatPosition: "KDV durumu nedir ve bir istisna uygulanıyor mu?",
      titleDeedCosts: "Tapu devri gerçekte ne kadara mal olacak?",
      deliveryRisk: "Proje geç teslim edilirse ya da hiç edilmezse ne olur?",
    },
    scoreHeading: "Multi Mulk Yatırım Skoru",
    scoreIntro: "Önerdiğimiz her gayrimenkul, sekiz ağırlıklı ölçüt üzerinden yüz üzerinden puanlanır. Ağırlıklar burada yayımlanıyor, çünkü işleyişi gizlenen bir skor bir değerlendirme değil yalnızca bir sayıdır.",
    scoreCaveat: "Skor, belirli bir tarihte tek bir değerlendiricinin kanaatidir; öngörü ya da garanti değildir. Her skor, onu kimin ve ne zaman verdiğini taşır. Herhangi bir rakamın gerekçesini bizden isteyin.",
    factorLabel: "Ölçüt",
    weightLabel: "Ağırlık",
    factors: {
      citizenshipSafety: "Vatandaşlık güvenliği",
      developerStrength: "Geliştirici gücü",
      location: "Konum",
      priceVsMarket: "Piyasaya göre fiyat",
      rentalPotential: "Kira potansiyeli",
      resaleLiquidity: "Yeniden satış likiditesi",
      capitalAppreciation: "Sermaye artışı",
      deliveryRisk: "Teslim riski",
    },
  },

  destinations: {
    passportAlt:
      "{region} yatırım yoluyla vatandaşlık programı kapsamında verilen pasaport",
    turkiye: {
      label: "Türkiye",
      eyebrow: "İstanbul, Türkiye",
      heading: "İki Kıtanın Buluştuğu Yer",
      body: "Türkiye, dünyanın büyük şehirlerinden birini Ege'den Akdeniz'e uzanan bir kıyı şeridiyle bir araya getiriyor. Yalnızca İstanbul iki kıtaya yayılıyor ve yatırım yoluyla vatandaşlık programı buradaki bir gayrimenkul alımını ikinci bir pasaporta giden yola dönüştürüyor — başka hiçbir pazarın bu ölçekte sunmadığı bir bileşim.",
      stats: {
        threshold: "Vatandaşlık eşiği",
        months: "İşlem süresi",
        visaFree: "Vizesiz ülke sayısı",
      },
    },
    caribbean: {
      label: "Karayipler",
      eyebrow: "Karayipler",
      heading: "Karayipler'in En Simge Destinasyonlarının Evi",
      body: "Karayipler, temsil ettiğimiz rezidans ve resort projelerinin büyüyen bir bölümüne ev sahipliği yapıyor; birçoğu devlet onaylı vatandaşlık yollarına bağlı.",
      stats: {
        years: "yıllık deneyim",
        clients: "memnun müşteri",
        properties: "doğrulanmış gayrimenkul",
      },
    },
  },

  menus: {
    about: {
      heading: "Hakkımızda",
      body: "Multi Mulk, yatırım yoluyla Türk vatandaşlığında uzmanlaşan; küresel vatandaşları Türkiye ve Karayipler'deki simge rezidanslarla buluşturan uluslararası bir gayrimenkul ve vatandaşlık danışmanlığıdır.",
      ourStory: "Hikâyemiz",
      ourTeam: "Ekibimiz",
    },
    realEstate: {
      heading: "Gayrimenkul",
      body: "İstanbul'da, Türkiye kıyılarında ve Karayipler'de projeler — her biri portföye girmeden önce kendi piyasasına göre değerlendirilir.",
    },
    citizenship: {
      label: "Yatırım Yoluyla Vatandaşlık",
      turkiyeRoutes: [
        "{investment} tutarında gayrimenkul yolu",
        "{holding} elde tutma",
        "Eş ve 18 yaşından küçük çocuklar dâhil",
      ],
    },
    detail: {
      "bosphorus-heights": "165 daire",
      "marmara-vista": "151 daire",
      "levent-residences": "420 daire + 11 sıra ev",
      "aegean-bay-residences": "88 daire",
      "antalya-coast": "3 blokta 1.023 daire",
      "anatolian-villas": "Seçkin semtlerde özel villalar",
      "la-sagesse-collection": "94 seçkin daire",
      "intercontinental-grenada": "30 özel suit dâhil 120 oda",
      "six-senses-la-sagesse": "15 havuzlu villa ile 56 havuzlu suit",
      "intercontinental-dominica": "151 oda ve 10 özel suit",
      "park-hyatt-st-kitts": "126 oda ve özel yat marinası",
      "port-cabrits-marina": "150 bağlama kapasiteli süperyat tesisi",
    },
  },

  caribbeanSection: {
    heading: "Karayip Ada İnzivaları",
    body: "Karayipler'de büyüyen portföyümüzü keşfedin — uzun vadeli değer, sürükleyici deneyimler ve küresel çekim gücü sunan sahil resortları ve simge markalı projeler; seçili devlet onaylı projeler ayrıca yatırım yoluyla vatandaşlığa onaylı bir yol sunuyor.",
    descriptions: {
      "park-hyatt-st-kitts": "2017'de açılan Park Hyatt St. Kitts, ada esinli tasarımı, geniş okyanus manzaraları ve Christophe Harbour marinasına erişimiyle 126 lüks oda ve suit sunuyor.",
      "intercontinental-grenada": "2026'da açılacak resort; 120 oda, 30'u aşkın lüks suit, seçkin restoranlar, spa deneyimleri ve Karayip esinli çarpıcı tasarımıyla öne çıkıyor.",
      "intercontinental-dominica": "Dominika'nın beyaz kumsallarında, yağmur ormanı ile denizi kucaklayan lüks bir kaçış: zarif tasarım, etkileyici Karayip manzaraları ve kapınızın önünde macera.",
      "six-senses-la-sagesse": "Bir sağlıklı yaşam ve lüks sığınağı olan Six Senses La Sagesse; alçak katlı villalar, okyanus manzaraları ve samimi, kültürel açıdan zengin bir Grenada deneyimi sunuyor.",
      "la-sagesse-collection": "La Sagesse Körfezi'nde 96 ayrıcalıklı rezidans: berrak sular, güneşle yıkanmış kumlar ve komşuları Six Senses La Sagesse ile InterContinental Grenada La Sagesse.",
      "port-cabrits-marina": "Portsmouth yakınlarındaki Bell Hall'da; süperyat bağlama yerleri, lüks restoranlar ve butik mağazalarıyla tenhalığı, doğal güzelliği ve dünya standartlarında konukseverliği bir araya getiren öncü bir sahil destinasyonu.",
    },
  },
  contact: {
    heading: "İletişim",
    leadHeading: "Yeni bir lüks yaşam seviyesi sizi bekliyor; bugün sahiplenin.",
    leadBody: "İster yatırım yoluyla Türk vatandaşlığını araştırıyor, ister İstanbul'da ya da kıyıda bir gayrimenkul arıyor, ister bir Karayip programını değerlendiriyor olun; ekibimiz size gizlilik, açıklık ve uzmanlıkla yol göstermek için burada.",
    emailLabel: "E-posta",
    phoneLabel: "Telefon",
    addressLabel: "Adres",
    mapTitle: "Multi Mulk'un Beykent, İstanbul ofisinin haritası",
    mapLink: "Google Haritalar'da aç",
    form: {
      name: "Ad Soyad",
      namePlaceholder: "Adınızı yazın",
      phone: "Telefon numarası",
      phonePlaceholder: "Telefon numarası",
      email: "E-posta",
      emailPlaceholder: "eposta@ornek.com",
      enquiryAbout: "Talebiniz ne hakkında?",
      subject: "Konu",
      subjectPlaceholder: "Neyi sormak istersiniz?",
      message: "Mesaj",
      messagePlaceholder: "Mesajınızı yazın..",
      consent: "Bu formu göndererek, talebinizle ilgili sizinle iletişime geçmemize onay vermiş olursunuz. Verilerinizi nasıl işlediğimiz için Gizlilik Politikamıza bakın.",
      submit: "Talebi Gönder",
      types: {
        turkishCitizenship: "Türk vatandaşlığı talebi",
        turkiyeProperty: "Türkiye gayrimenkul talebi",
        caribbeanCbi: "Karayipler vatandaşlık talebi",
        general: "Genel talep",
      },
      ack: {
        subject: "Talebinizi aldık",
        greeting: "Sayın {name},",
        yourMessage: "Mesajınız",
        closing:
          "Talebiniz acilse bu e-postayı yanıtlayın veya size en yakın ofisi arayın.",
      },
      sentHeading: "Teşekkürler",
      sentBody: "Bize ulaştığınız için teşekkürler. Multi Mulk ekibinden bir üye kısa süre içinde yanıt verecek.",
      sentAgain: "Başka bir mesaj gönder",
      submitting: "Gönderiliyor…",
      errors: {
        required: "Bu alan zorunludur.",
        email: "Geçerli bir e-posta adresi girin.",
        phone: "Ülke kodu dâhil geçerli bir telefon numarası girin.",
        tooLong: "Bu, kabul edebileceğimizden daha uzun.",
        load: "Formu yükleyemedik. İletişim sayfasında aynısı var — ya da yandaki bilgileri kullanın.",
        rate: "Kısa süre içinde birkaç talep gönderdiniz. Lütfen daha sonra tekrar deneyin veya info@multimulk.com adresine yazın.",
        server: "Talebinizi gönderemedik. Lütfen tekrar deneyin veya info@multimulk.com adresine yazın.",
      },
    },
  },
  about: {
    hero: {
      heading: "Eşsiz Bir Ayrıcalık Mirası İnşa Etmek",
      body: "İşimiz, adına hareket ettiğimiz insanlarla başlar. Multi Mulk; gayrimenkul uzmanlarını, vatandaşlık danışmanlarını ve hukuk müşavirlerini bir araya getirir; böylece İstanbul'da ya da bir Karayip koyundaki bir alım, dağınık işler dizisi değil, düşünülmüş tek bir karar olarak yürütülür.",
    },
    intro: {
      heading: "Lüksü Yeniden Tanımlamak, Her Seferinde Bir Destinasyon",
      paragraphs: [
        "Multi Mulk, küresel vatandaşlara açık en dikkat çekici iki pazarda çalışan uluslararası bir gayrimenkul ve vatandaşlık danışmanlığıdır. Türkiye'de İstanbul'un iki yakasında ve Ege ile Akdeniz kıyılarında simge rezidansları temsil ediyoruz; her biri, Türk vatandaşlık programını açan 400.000 ABD doları eşiğine göre ölçülmüştür.",
        "Karayipler'de Grenada, Dominika ve St. Kitts ve Nevis'te devlet onaylı projelerle çalışıyoruz — aralarında Six Senses La Sagesse, InterContinental Grenada – La Sagesse ve Park Hyatt St. Kitts var — burada tek bir yatırım hem bir konut hem de ikinci bir pasaport taşıyor. Türkiye, BAE ve Pakistan'daki ofislerimiz, müşterilerimizi dosyalarını yürüten masaya yakın tutuyor.",
      ],
      stats: {
        experience: "yıllık deneyim",
        clients: "memnun müşteri",
        properties: "doğrulanmış gayrimenkul",
      },
      imageAlt: "Multi Mulk portföyünde sahil rezidansları",
    },
    regions: {
      turkiye: {
        label: "Türkiye",
        body: "İki kıtanın buluştuğu, kıyı şeridinin Boğaz'dan Akdeniz'e uzandığı bir ülke. Türkiye projelerimiz merkezi şehir adreslerini sakin kıyı koylarıyla — ve vatandaşlığa giden doğrudan, devlet destekli bir yolla — bir araya getiriyor.",
        imageAlt: "Boğaz'a bakan İstanbul rezidansları",
      },
      caribbean: {
        label: "Karayipler",
        body: "Sakin suların, yumuşak ufukların ve aceleye yer olmayan bir güzelliğin dünyası. Karayip destinasyonlarımız ada yaşamının özünü kucaklayarak doğanın, mimarinin ve iyi yaşamın kusursuz bir dengede var olduğu düşünülmüş inzivalar kuruyor.",
        imageAlt: "Multi Mulk portföyünde bir Karayip koyu",
      },
    },
    principles: {
      heading: "İnşa Ettiğimiz Her Şeyin Ardındaki İlkeler",
      items: {
        craftsmanship: {
          title: "Lüksü Tanımlayan Ustalık",
          body: "Temsil ettiğimiz rezidanslar, dünyanın en seçkin gayrimenkullerinde görülen hassasiyet ve sanata göre değerlendirilir. Özel tasarım iç mekânlardan sürükleyici dış alanlara kadar, tavizsiz bir detay düzeyi ararız — teslimden on yıl sonra da düşünülmüş görünen türden.",
        },
        advice: {
          title: "Envanterden Önce Danışmanlık",
          body: "İkinci vatandaşlık, bir alımdan önce hukuki bir taahhüttür. Eşikleri, elde tutma sürelerini ve takvimleri açık bir dille ortaya koyar, bir projenin yanlış tercih olduğunu söyleriz. Müşteriler; seçim, satın alma ve başvurunun kendisi boyunca tek bir ekip tarafından yönlendirilir.",
        },
        lifestyle: {
          title: "Yaşam Odaklı Deneyimler",
          body: "Gayrimenkulün ötesinde, yaşam destinasyonları ararız — İstanbul'un bağlantılı semtlerinden sakin sahil yerleşkelerine ve üst düzey sağlıklı yaşam inzivalarına kadar, insanların nasıl yaşamak istediğine göre seçilmiş. Evrak işleri kapandıktan çok sonra değeri koruyan şey bağ, mahremiyet ve iyi olma hâlidir.",
        },
      },
    },
    developments: {
      heading: "En Yeni Projelerimiz",
      body: "Türkiye ve Karayipler'deki en yeni konut ve konaklama projelerimizi keşfedin; rafine bir yaşam, uzun vadeli değer ve olağanüstü deneyimler sunmak üzere kurgulandı.",
      cards: {
        "bosphorus-heights": "Beyoğlu'nda boğazı ve ardındaki tarihi yarımadayı çerçeveleyen 165 rezidans.",
        "aegean-bay-residences": "Sakin bir Bodrum koyunun üzerinde bir sığınak; 88 stüdyo, 1 ve 2 yatak odalı rezidans.",
        "la-sagesse-collection": "Özel bir Grenada plajının kıyısında, Six Senses La Sagesse'in yanında 94 seçkin dairelik sınırlı bir seçki.",
      },
      actions: {
        turkiye: "Türkiye Gayrimenkullerini Keşfet",
        caribbean: "Karayip Gayrimenkullerini Keşfet",
      },
    },
    leadership: {
      heading: "Uzmanlık ve Vizyonla Yönetmek",
      body: "İşimizin merkezinde, üç ofise yayılmış gayrimenkul uzmanları, vatandaşlık danışmanları ve hukuk müşavirlerinden oluşan bir ekip var. Her dosya, müşteriye en yakın masa tarafından baştan sona yürütülür; böylece ilk soruyu yanıtlayan kişi, başvuruyu sonuna kadar götüren kişidir.",
      portraitAlt: "{name}, Multi Mulk'ta {title}",
      roles: {
        "sajid-ali-haydar": "Genel Müdür",
        "nader-djebbi": "Büyümeden Sorumlu Direktör",
      },
    },
    map: {
      heading: "Kıyılardan adalara, işimiz daha sakin ve daha bağlantılı bir yaşamı destekleyen çevrelerde yoğunlaşıyor.",
      body: "Türkiye ve Karayipler'de, çevresi tarafından biçimlenmiş yerlere odaklanıyoruz — açıklık, konfor ve aidiyet duygusuyla tasarlanmış. Temsil ettiğimiz her proje, düşünülmüş mimariye, doğal ortamlara ve zahmetsiz, samimi bir yaşama duyulan aynı bağlılığı yansıtıyor.",
      imageAlt: "Bir Multi Mulk destinasyonunun havadan görünümü",
    },
    places: {
      istanbul: {
        title: "İstanbul",
        caption: "İki kıtanın buluştuğu yer",
      },
      bodrum: {
        title: "Bodrum",
        caption: "Ege kıyısı",
      },
      antalya: {
        title: "Antalya",
        caption: "Turkuaz kıyı",
      },
      grenada: {
        title: "Grenada",
        caption: "La Sagesse Körfezi",
      },
    },
  },
  citizenship: {
    eyebrow: "Yatırım Yoluyla Vatandaşlık",
    anchors: {
      introduction: "Giriş",
      benefits: "Avantajlar",
      gallery: "Galeri",
      projects: "Projeler",
      process: "Nasıl İşliyor",
      industry: "Sektöre Bakış",
      about: "Multi Mulk Hakkında",
      faq: "SSS",
    },
    browseAll: "Uygun rezidansları inceleyin",
    onThisPage: "Bu sayfada",
    cta: {
      heading: "Bir Sonraki Adımınız Burada Başlıyor",
      body: "Uygunluk, süreler ve hangi rezidansların nitelik taşıdığı hakkında ekibimizle konuşun. Programın hedefinize uyup uymadığını açıkça söyleriz.",
      button: "Hemen Başvurun",
    },
    industry: {
      eyebrow: "Sektöre Bakış",
      heading: "Yatırım Göçü Sektörü",
      body: "Yatırım yoluyla vatandaşlık yeni bir fikir değil. İlk program 1984'te açıldı ve kırk yıllık mevzuat, denetim ve reform bunu bir merak konusu olmaktan çıkarıp yerleşik bir varlık sınıfına dönüştürdü.",
      marketLabel: "Küresel pazar büyüklüğü",
      growthLabel: "Yıllık büyüme",
      timelineHeading: "Programlar, açıldıkları sıraya göre",
      thisProgramme: "Bu program",
    },
    about: {
      eyebrow: "Multi Mulk Hakkında",
      heading: "İkinci Vatandaşlık için Ortağınız",
      body: "Multi Mulk; gayrimenkul uzmanlarını, vatandaşlık danışmanlarını ve hukuk müşavirlerini Türkiye, BAE ve Pakistan'daki ofisleriyle tek çatı altında buluşturur. Projeleri uzaktan aracılık ederek değil, bizzat temsil ederiz; bir rezidansın ne ettiği, bir programın ne gerektirdiği ve ikisinin de uymadığı durumlar konusunda bu yüzden net olabiliyoruz. Verdiğimiz her rakam, siz herhangi bir taahhütte bulunmadan önce yazılı olarak teyit edilir.",
      link: "Hakkımızda Daha Fazlası",
    },
  },
} satisfies PartialDictionary;

export default tr;
