/**
 * Türkçe.
 *
 * A `partial` locale (see `localeStatus` in `../config`): complete, and typed
 * as a full `Dictionary` so a missing key fails the build, but kept out of
 * `hreflang` and the sitemap until a native speaker has reviewed it.
 *
 * Register: the second-person plural used in Turkish property and legal
 * marketing. Development and operator names stay as written, which is how they
 * are listed and searched for.
 *
 * Once that review is done, set `localeStatus.tr = "published"`.
 */

import type { Dictionary } from "../index";

const tr: Dictionary = {
  meta: {
    articleFallback: "Makale",
    propertyFallback: "Gayrimenkul",
    citizenship: {
      turkiye: {
        title: "Yatırımla Türk Vatandaşlığı",
        description: "400.000 ABD doları tutarında bir gayrimenkul alımıyla Türk vatandaşlığı — eşikler, süreler ve programa uygun İstanbul ve kıyı rezidansları.",
      },
      caribbean: {
        title: "Yatırımla Karayip Vatandaşlığı",
        description: "Devlet onaylı resort yatırımlarıyla Grenada, Dominika ve Saint Kitts ve Nevis'te ikinci vatandaşlık — eşikler, süreler ve onaylı projeler.",
      },
    },
    team: {
      title: "Ekibimiz",
      description: "Multi Mulk'un arkasındaki insanlar — yönetim ekibi ve Türk vatandaşlığı, Karayip yatırımla vatandaşlık ve gayrimenkul dosyalarını baştan sona yürüten Dubai, İstanbul ve Lahor'daki üç ofis.",
    },
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
    publications: {
      title: "Yayınlar",
      description:
        "Multi Mulk’un kendi rehber ve raporları — yatırım yoluyla Türk vatandaşlığı, Karayip programları ve Altın Vize ikameti; aralarında karar verenler için yazıldı.",
    },
    marketInsights: {
      title: "Pazar Analizleri",
      description:
        "Türkiye ve Karayipler piyasalarının gerçekte ne yaptığı — fiyatlar, onaylar, eşikler ve süreler; kayıtlardan okunmuş ve tarihlendirilmiş.",
    },
    events: {
      title: "Etkinlikler",
      description:
        "Multi Mulk ile nerede buluşabilirsiniz — Körfez, Türkiye ve ötesinde fuarlar, seminerler ve özel görüşmeler.",
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
    priceOnRequest: "Fiyat için iletişime geçin",
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
    reviewedContent: "İncelenen içerikler",
    noCredentials: "Yeterlilikler onay bekliyor.",
    knowsAbout: "Uzmanlık alanları",
    credentials: "Yeterlilikler",
    body: "Göç ve yatırım danışmanlığı, ancak onu veren kişi kadar iyidir. Burada yazılanların arkasındaki insanlar bunlar.",
    heading: "Size Kim Danışmanlık Veriyor",
    eyebrow: "Ekibimiz",
    roles: {
      founder: "Kurucu ve Genel Müdür",
      advisory: "Danışmanlık Direktörü",
      team: "Danışmanlık Ekibi",
    },
  },

  routes: {
    roadshow: "Pakistan Roadshow 2026",
    roadshowThanks: "Teşekkürler",
    partners: "Bizimle İş Ortaklığı",
    calculatorResult: "Hesaplama Sonucu",
    freeGuide: "Ücretsiz Rehber",
    team: "Ekibimiz",
    documents: "Belge Kütüphanesi",
    home: "Ana Sayfa",
    about: "Hakkımızda",
    contact: "İletişim",
    search: "Gayrimenkuller",
    knowledge: "Haberler ve Analizler",
    publications: "Yayınlar",
    marketInsights: "Pazar Analizleri",
    events: "Etkinlikler",
    article: "Makale",
    development: "Proje",
    citizenshipHub: "Yatırım Yoluyla Vatandaşlık",
    citizenshipProgramme: "Program",
    goldenVisaHub: "Oturum İzni",
    goldenVisaProgramme: "Program",
    realEstateHub: "Gayrimenkul",
    country: "Ülke",
    compareIndex: "Programları Karşılaştır",
    comparison: "Karşılaştırma",
    investorProtection: "Yatırımcı Koruması",
    secondPassport: "İkinci Pasaport",
    eligibilityReview: "Uygunluk Değerlendirmesi",
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
    goldenVisa: "Oturum İzni",
    realEstate: "Gayrimenkul",
    protection: "Yatırımcı Koruması",
    knowledge: "Haberler ve Analizler",
    about: "Hakkımızda",
  },

  footer: {
    addresses: {
      UAE: "Grosvenor Business Tower, Ofis 1909, Al Thanyah First, Barsha Heights, Dubai",
      "Türkiye": "Burc Plaza, Gökevler Mah. 2312 Sk. Blok No:18J, Kat:5, Ofis No:48-49, Beykent / İstanbul",
      Pakistan: "192-B, 3. Kat, Broadway Commercial, DHA Phase VIII, Lahor, Pakistan",
    },
    columns: {
      turkiye: "Türkiye",
      caribbean: "Karayipler",
      services: "Hizmetler",
      resources: "Kaynaklar",
      about: "Hakkımızda",
    },
    aboutItems: {
      imageCredits: "Görsel Kaynakları",
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
    reviewsTitle: "Değerlendirme Yazın",
    reviews: {
      trustpilot: "Trustpilot",
      google: "Google",
    },
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
      eyebrow: "Oturum İzni",
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
    /** Marks the column the practice would advise; the verdict argues it. */
    recommended: "Multi Mulk tavsiyesi",
    verdictHeading: "Görüşümüz",
    /** The three return rows; see `comparisonRows`. */
    resale: {
      open: "Açık pazar",
      limited: "Program alıcıları veya aracın kendi koşulları",
      none: "Satılacak bir şey yok",
    },
    returnRetained: "{percent} · {money} gelir",
    returnLost: "−%100 · {money} geri dönmez",
    returnNote: "5 yıllık örnek getiri: yukarıda gösterilen brüt kira getirisinin, gösterilen asgari yatırım üzerinden beş yıl boyunca hesaplanmış hali — satın alma masrafları, vergiler ve ücretler öncesi — ve rotanın yeniden satılabilir bir varlık olduğu durumlarda sermayenin kendisi korunur. Bir piyasa aralığıdır; tahmin ya da garanti değildir.",
    /** The comparison page in the resort design; see /compare/[slug]. */
    heroTagline: "Aynı gerçekler üzerinden yan yana, tek bir öneriyle",
    programmesLabel: "Program",
    factorsLabel: "Ölçüt",
    tableHeading: "Ölçüt Ölçüt",
    programmeIndex: "Program {index}",
    recommendedHeading: "Multi Mulk’un Önerisi: {name}",
    otherComparisons: "Diğer Karşılaştırmalar",
    allComparisons: "Tüm Karşılaştırmalar",
    enquireSubject: "Karşılaştırma: {programmes}",
    ctaHeading: "Hâlâ Karar Veremediniz mi?",
    ctaBody: "Neyi çözmek istediğinizi ve hangi programları tarttığınızı söyleyin; bir danışman bu tabloyu aileniz için doldurup yanıtlasın.",
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
      rentalYield: "Brüt kira getirisi",
      capitalReturned: "Çıkışta sermayenin geri dönüşü",
      resaleMarket: "Yeniden satış pazarı",
      fiveYearReturn: "5 yıllık örnek getiri (ROI)",
    },
    /** The verdict under each table, keyed by the comparison's `copyKey`. */
    copy: {
      "turkiye-vs-caribbean": {
        verdict:
          "Getiri açısından ikisi yakın bile değil. Türkiye’de hak kazandıran varlık on altı milyonluk bir şehirde tapulu bir konuttur: yılda %5–7 kira getirir, üç yıl sonra açık pazarda satılır ve sermayeyle pasaportu birlikte geri getirir. Grenada’da bir tesis payı %2–4 kazandırır, beş yıl elde tutulur ve fiilen yalnızca programın bir sonraki başvurucusuna satılır. Grenada daha azını ister ve pasaportu daha uzağa gider — ABD E-2 anlaşması ve vizesiz Çin gerçek avantajlardır ve tablo bunları gösterir. Ama görüştüğümüz ailelerin çoğunun aradığı, kendi masrafını çıkaran ikinci bir vatandaşlıktır; bu ölçüte göre önerimiz Türkiye’dir.",
      },
      "turkiye-citizenship-vs-residency": {
        verdict:
          "Gayrimenkul aynı, getiri de aynı: İstanbul’da bir dairede yılda %5–7, aile dilediğinde açık pazarda satılır. Fark, paranın ne aldığındadır. Oturma izni yarı fiyata ve daha hızlıdır; ama bir izindir — yenilenir, gayrimenkulü elde tutmaya bağlıdır ve garantisi olmayan bir vatandaşlık başvurusuna beş yıl uzaktadır. Vatandaşlık doğrudan verilir ve aileye geçer; üstelik tıpatıp aynı getiriyi sağlayan bir varlık üzerinden. Bütçe eşiğe ulaştığında önerimiz vatandaşlıktır.",
      },
      "turkiye-vs-uae": {
        verdict:
          "İkisi de yılda %5–7 kira getiren ve açık pazarda satılan bir gayrimenkulle alınır; getiride başa baştırlar — ve Türkiye’nin giriş eşiği ikisinin daha düşüğüdür. Fark verilendedir: Altın İkamet her on yılda bir yenilenen bir oturma iznidir ve asla pasaport olmaz; Türkiye ise vatandaşlığı doğrudan verir. İkisi birbirini dışlamaz — birçok müşterimiz Dubai’de bir üs ile Türk pasaportunu birlikte tutar. Hedef ikinci bir vatandaşlıksa önerimiz Türkiye’dir.",
      },
      "caribbean-islands": {
        verdict:
          "En azını Dominika ister, en uzağa St. Kitts ve Nevis gider; ama getiride üçünden hiçbiri Türkiye’ye yaklaşamaz: İstanbul’da bir daire yılda %5–7 kira getirir ve üç yıl sonra açık pazarda satılır; bir Karayip tesis payı ise %2–4 kazandırır, beş yıl tutulur ve fiilen yalnızca bir sonraki başvurucuya satılır. Adalar arasında seçilecek olan Grenada’dır — bölgede ABD E-2 anlaşması ve vizesiz Çin’i taşıyan tek pasaport. Bölge ile Türkiye arasında ise önerimiz Türkiye’dir: kendi masrafını çıkaran bir vatandaşlık.",
      },
      "golden-visas": {
        verdict:
          "Varlığı gelir getiren ikisi Türkiye ve BAE’dir — yılda %5–7 getiren, açık pazarda yeniden satılan bir gayrimenkul. Portekiz gayrimenkul rotasını 2023’te kapattı; fon rotası pasaporta on yıl ve bir dil sınavı uzaklıkta. Yunanistan hâlâ gayrimenkul karşılığı oturma izni satıyor ama dünya genelindeki geliri vergilendiriyor ve vatandaşlığa giden yolu yedi yıl sürüyor. BAE Altın İkameti işlem yaptığımız ikamettir — yenilenebilir, dünya genelindeki gelire vergi yok, asgari kalış şartı yok — ama bir izindir, asla pasaport değil. Türkiye vatandaşlığı doğrudan, dördü arasında en düşük girişle, aynı getiriyi sağlayan bir gayrimenkul üzerinden verir. Hedefi kendi masrafını çıkaran ikinci bir vatandaşlık olan bir aile için önerimiz Türkiye’dir; yanına Körfez’de bir üs için BAE.",
      },
      "turkiye-vs-portugal": {
        verdict:
          "Getiride tartışma yok: Türkiye’deki gayrimenkul yılda %5–7 kira getirir ve üç yıl sonra açık pazarda satılır; bir Portekiz fon katılımı ise fonun kazandığı kadarını, fonun koşullarıyla geri verir — programı ünlü yapan gayrimenkul rotası 2023’te kapandı. Çoğu ailenin asıl sorduğu vatandaşlık Türkiye’de doğrudan verilir; Portekiz’de ise on yıl ve bir dil sınavı uzaktadır. Türk pasaportu Schengen bölgesine vizesiz girmez, Portekiz oturma kartı girer — Portekiz lehine tartılmaya değer tek nokta budur. Hedefi bir Avrupa adresi değil ikinci bir vatandaşlık olan bir aile için önerimiz Türkiye’dir.",
      },
    },
  },

  programmes: {
    copy: {},
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
    /** The banner and sections of a programme page; see `programme-pages.ts`. */
    aboutEyebrow: "Program Hakkında",
    highlightsEyebrow: "Programın Öne Çıkanları",
    highlightHeadings: {
      grants: "Ne Sağlar",
      family: "Kimler Dahil Edilebilir",
      asks: "Sizden Ne İster",
    },
    routesBody: "Programın tanıdığı rotalar ve bunlardan işlem yaptıklarımız.",
    compareEyebrow: "Yan Yana",
    compareHeading: "{name} Karşılaştırması",
    compareBody: "Bu sayfadaki her rakam, en sık kıyaslandığı programlarla aynı tabloda yer alır — aynı kayıttan okunur, altında da önerimiz bulunur.",
    compareButton: "Karşılaştırmayı Görün",
    allComparisons: "Tüm Karşılaştırmalar",
    keyFactsHeading: "Bir Bakışta {name}",
    keyFactsBody:
      "En sık sorulan rakamlar; bu sitedeki her karşılaştırmayla aynı kayıttan alınmıştır.",
    hubFaqHeading: "Sık Sorulan Sorular",
    hubFaqQuestion: "{name} neler gerektirir ve ne sağlar?",
    otherProgrammes: "Diğer Programlar",
    viewProgramme: "Programı Görüntüleyin",
    ctaHeading: "{name} Programını Keşfedin",
    ctaBody: "Neyi çözmek istediğinizi söyleyin; bu programın size uygun olup olmadığını ve her şey dahil ne kadara mal olacağını söyleyelim.",
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
    year: "Yıl",
    /** The case-study page in the resort design; see /case-studies/[slug]. */
    aboutHeading: "Bu Dosya Hakkında",
    outcome: "Sonuç",
    otherOutcomes: "Diğer Müşteri Sonuçları",
    allOutcomes: "Tüm Müşteri Sonuçları",
    viewOutcome: "Sonucu Okuyun",
    ctaHeading: "Bu Sizin Dosyanız Olabilir mi?",
    ctaBody: "Neyi çözmek istediğinizi söyleyin; bir danışman sizinki gibi bir ailenin bunu nasıl yaptığını ve her şey dahil neye mal olduğunu anlatsın.",
    reasoning: "Neden bu ve nelerin elendiği",
    complication: "Nerede aksadı",
    consentPending: "Henüz yayımlanmış bir müşteri sonucu yok. Bunun için müşterinin yazılı onayı gerekiyor ve Multi Mulk şu ana kadar hiçbiri için bu onaya sahip değil.",
    /** Shown wherever a composed, no-client engagement is listed. */
    representativeNote:
      "Temsili dosyalar: her biri danışmanlık ekibimizin yürüttüğü dosyaların genel yapısından oluşturulmuştur; hiçbir müşterinin kişisel bilgisini içermez. Gerçek dosyaların sonuçları yalnızca müşterinin yazılı onayıyla yayımlanır.",
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
    captions: {
      luxuryHotels: "Bu Yıl Dünya Genelinde Açılan 31 Muhteşem Lüks Otel",
      newHotels: "Kuzey Amerika ve Karayipler'in En İyi Yeni Otelleri",
      travel: "Seyahatte En İyiler 2025",
      eco: "Yılın En İyi Çevre Dostu Resortu — 2025",
      michelin: "Bir Michelin Anahtarı — Çok Özel Bir Konaklama",
      beachfront: "Yılın En İyi Sahil Mülkü",
    },
  },

  articlesSection: {
    heading: "En Son Yazılar",
    body: "En güncel haberleri, analizleri ve kaynakları burada bulun. Bu merkez; blog yazıları, basın bültenleri ve ayrıntılı rehberlerle projelerimizden haberdar olmanızı sağlar.",
    categoryLabel: "Yazı kategorisi",
  },

  articles: {
    topics: {
      citizenship: "Vatandaşlık",
      residency: "Oturum İzni",
      "real-estate": "Gayrimenkul",
      turkiye: "Türkiye",
      news: "Haberler",
    },
    categories: {
      All: "Tümü",
      "Press Media": "Basında Biz",
      Blog: "Blog",
      Publication: "Yayın",
      "Market Insight": "Pazar Analizi",
      Event: "Etkinlik",
    },
    sort: {
      Newest: "En yeni",
      Oldest: "En eski",
    },
    sortLabel: "Yazıları sırala",
    empty: "{filter} altında henüz bir şey yok.",
    emptyHere: "Burada henüz bir şey yayımlanmadı.",
    filter: "Filtrele",
    filterLabel: "Yazıları filtrele",
    filterType: "Tür",
    filterTopic: "Konu",
    searchLabel: "Yazılarda ara",
    searchPlaceholder: "Başlık veya anahtar kelimeyle arayın",
    noMatch: "“{query}” için sonuç bulunamadı.",
    pagination: "Sayfalama",
    previousPage: "Önceki sayfa",
    nextPage: "Sonraki sayfa",
    pageN: "Sayfa {n}",
    clearSearch: "Temizle",
    copy: {},
  },

  media: {
    heroEyebrow: "Haberler ve Analizler",
    showArticle: "“{title}” yazısını göster",
    newsletter: {
      heading: "Daha derine inin, haberdar kalın",
      body: "Hiçbir gelişmeyi kaçırmayın — her güncellemeden haberiniz olsun.",
      cta: "Hemen Başvurun",
    },
    article: {
      categoryLabel: "Kategori:",
      authorLabel: "Yazan:",
      publishedLabel: "Yayın tarihi:",
      sourceLabel: "Kaynak:",
      relatedHeading: "İlgili Yazılar",
      readingTime: { one: "{count} dk okuma", other: "{count} dk okuma" },
    },
  },

  insights: {
    menuHeading: "Haberler ve Analizler",
    menuBody: "Multi Mulk’un yayımladığı her şey — hakkımızda çıkan haberler, yazdığımız rehberler, piyasaların gerçekte ne yaptığı ve bizimle nerede buluşabileceğiniz.",
    sections: {
      articles: {
        label: "Yazılar",
        menuLine: "Haberler ve blog",
        heading: "Haberler ve Blog",
        body: "En güncel haberleri, analizleri ve kaynakları burada bulun. Bu merkez; blog yazıları, basın bültenleri ve ayrıntılı rehberlerle projelerimizden haberdar olmanızı sağlar.",
      },
      publications: {
        label: "Yayınlar",
        menuLine: "Rehberler ve raporlar",
        heading: "Yayınlar",
        body: "Tıklanmak için değil, karar verilmek için yazılmış kendi rehber ve raporlarımız: her program ne veriyor, ne istiyor ve her şey dâhil ne tutuyor.",
      },
      marketInsights: {
        label: "Pazar Analizleri",
        menuLine: "Veri ve analiz",
        heading: "Pazar Analizleri",
        body: "Türkiye ve Karayipler piyasalarının gerçekte ne yaptığı — fiyatlar, onaylar, eşikler ve süreler; kayıtlardan okunmuş ve ne zamana ait olduğu görülsün diye tarihlendirilmiş.",
      },
      events: {
        label: "Etkinlikler",
        menuLine: "Bizimle nerede buluşursunuz",
        heading: "Etkinlikler",
        body: "Körfez, Türkiye ve ötesinde fuarlar, seminerler ve özel görüşmeler. Gelin, sorularınızı yüz yüze sorun.",
      },
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
    "United Arab Emirates": "Birleşik Arap Emirlikleri",
    Portugal: "Portekiz",
    Greece: "Yunanistan",
    Malta: "Malta",
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
    /**
     * Hangs from Residence. Only the eyebrow over each card: the country
     * names come from `places`, and every figure on a card is read from the
     * programme record and labelled with the comparison table's own row
     * names, so the menu has nothing else of its own to translate.
     */
    goldenVisa: {
      label: "Oturum İzni",
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
    mapTitle: "Multi Mulk ofisinin haritası — {office}",
    mapLink: "Google Haritalar'da aç",
    reviewsHeading: "Deneyiminizi paylaşın",
    reviewsBody:
      "Size yardımcı olduysak, Trustpilot veya Google’da kısa bir değerlendirme başkalarının Multi Mulk’u güvenle bulmasına yardımcı olur.",
    reviewsTrustpilot: "Trustpilot’ta değerlendirin",
    reviewsGoogle: "Google’da değerlendirin",
    form: {
      name: "Ad Soyad",
      namePlaceholder: "Adınızı yazın",
      phone: "Telefon numarası",
      phonePlaceholder: "Telefon numarası",
      /** Accessible name of the dialling-code picker beside the number. */
      countryCode: "Ülke kodu",
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
        calculator: "Hesaplama raporu talebi",
        roadshow: "Pakistan roadshow kaydı",
        guide: "Ücretsiz rehber talebi",
        partnership: "İş ortağı kaydı",
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
        phone: "Geçerli bir telefon numarası girin.",
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
    caribbean: {
      hero: {
        heading: "Yatırımla Karayip Vatandaşlığı",
        body: "Grenada, Dominika ve Saint Kitts ve Nevis, dünyanın en köklü üç programını yürütür — her biri temsil ettiğimiz resortlar üzerinden devlet onaylı bir yol sunar.",
      },
      intro: {
        eyebrow: "Giriş",
        heading: "Üç Program, Tek Bir Onaylı Portföy",
        paragraphs: [
          "Yatırımla vatandaşlığı Karayipler icat etti. Saint Kitts ve Nevis ilk programı 1984'te açtı, Dominika da 1993'te onu izledi; bu pasaportların sınırlarda ve bankalarda yeni programların göremediği şekilde tanınmasının nedeni budur. Her ada kendi mevzuatını, kendi eşiklerini ve kendi onaylı proje listesini yürütür.",
          "Multi Mulk yalnızca devlet onaylı projelerle çalışır — bunlar arasında Six Senses La Sagesse ve InterContinental Grenada – La Sagesse, InterContinental Dominica Cabrits Resort & Spa ve Park Hyatt St. Kitts bulunur. Tek bir yatırım, hem markalı bir resort varlığında pay hem de aile için ikinci bir pasaport sağlar. Grenada ayrıca belirtilmeye değer: Amerika Birleşik Devletleri ile antlaşması olan tek Karayip programıdır.",
        ],
      },
      stats: {
        investment: "Asgari Gayrimenkul Yatırımı",
        timeline: "İşlem Süresi",
        visaFree: "Vizesiz Destinasyonlar",
        holding: "Elde Tutma Süresi",
      },
      benefits: {
        eyebrow: "Programın Avantajları",
        heading: "Mirasınız, Bir Üst Seviyede",
        body: "Bir Karayip pasaportu aynı anda hem bir güvence hem de bir varlıktır — tek bir hükümete bağlı olmayan hareket özgürlüğü, faaliyetini sürdüren bir resortta payla birlikte.",
        items: {
          citizenship: {
            title: "Ömür Boyu, Nesiller Boyu Vatandaşlık",
            body: "Karayip vatandaşlığı ömür boyu verilir ve nesilden nesile geçer. Adaya bağlı olarak tek bir başvuru eşinizi, çocuklarınızı ve bakmakla yükümlü olduğunuz anne-babanızı veya büyükanne-büyükbabanızı kapsayabilir — bu da onu bir seyahat belgesi değil, bir miras varlığı yapar.",
          },
          mobility: {
            title: "140'tan Fazla Destinasyona Erişim",
            body: "Bu pasaportlar Schengen Bölgesi, Birleşik Krallık, Singapur ve Hong Kong dahil 140'tan fazla destinasyona vizesiz veya kapıda vizeyle erişim sağlar. Grenada buna Amerika Birleşik Devletleri ile bir antlaşma ekler; bunu sunan tek Karayip programıdır.",
          },
          assets: {
            title: "Markalı Resortlarda Sahiplik",
            body: "Onaylı projeler göstermelik projeler değildir. Six Senses, InterContinental ve Park Hyatt tarafından işletilirler; bu da kira performansı, ikinci el piyasası ve bulunduğu adanın çok ötesinde tanınan bir isme sahip bir varlık demektir.",
          },
          process: {
            title: "En Köklü Programlar",
            body: "Saint Kitts ve Nevis programını 1984'ten, Dominika ise 1993'ten beri yürütüyor. Kırk yıllık mevzuat, uluslararası denetim ve bağımsız durum tespiti firmaları, bu pasaportların yeni programların zorlandığı kontrollerden hâlâ geçmesinin nedenidir.",
          },
        },
      },
      gallery: {
        eyebrow: "Galeri",
        heading: "Adalar ve Üzerlerine İnşa Edilenler",
        body: "Grenada'da La Sagesse Koyu, Dominika'da Cabrits, Saint Kitts'te Christophe Harbour — onaylı projeler, bugünkü halleriyle.",
      },
      signature: {
        heading: "Üç Adada İmza Niteliğinde Bir Vatandaşlık Yatırımı",
        body: "Buradaki onaylı projeler Six Senses, InterContinental ve Park Hyatt tarafından işletilir — beraberinde bir kira piyasası ve bir ikinci el piyasası getiren isimler. Grenada, Dominika ve Saint Kitts'in her biri kendi mevzuatını ve kendi eşiklerini yürütür; bu yüzden ilk soru hiçbir zaman hangi daire değil, hangi adadır ve size herhangi bir şey göstermeden önce bunu belirleriz.",
        button: "Karayip Vatandaşlığı Hakkında Bilgi Alın",
      },
      enquire: {
        heading: "Karayip Yatırımla Vatandaşlık Programlarıyla Küresel Hareket Özgürlüğünüzü Güvenceye Alın",
        body: "Neyi başarmak istediğinizi bize anlatın; size uygun adayı, o adada onaylı projeleri ve gerçekçi bir zaman çizelgesini iletelim.",
      },
      projects: {
        heading: "Devlet Onaylı Projeler",
        body: "Aşağıdaki her proje kendi adasının programı kapsamında onaylıdır. Eşikler ve daire stoku projeye göre değişir ve mevzuatla birlikte değişir; bu nedenle herhangi bir taahhütten önce her ikisini de yazılı olarak teyit ederiz.",
      },
      process: {
        eyebrow: "Nasıl İşler",
        heading: "İlk Görüşmeden Pasaporta",
        body: "Tek bir ekip tarafından yürütülen beş aşama. Hiçbir ada seyahat etmenizi gerektirmez ve ailelerin çoğu süreci üç ila altı ayda tamamlar.",
        steps: {
          consultation: {
            title: "Danışmanlık",
            body: "Grenada, Dominika ve Saint Kitts; eşikler, kimin bakmakla yükümlü olunan kişi sayıldığı ve pasaportun açtığı kapılar bakımından farklıdır. Tek bir mülke bakmadan önce bu üçünden hangisinin ailenize gerçekten uyduğunu belirleriz.",
          },
          selection: {
            title: "Proje Seçimi",
            body: "Seçtiğiniz adadaki devlet onaylı projelerde daireleri kısa listeye alır ve her birinin yalnızca uygunluk için değil, kira performansı ve ileride yeniden satış için ne anlama geldiğini ortaya koyarız.",
          },
          purchase: {
            title: "Rezervasyon ve Emanet Hesabı",
            body: "Fonlar doğrudan geliştiriciye ödenmek yerine atanmış emanet acentesine yatırılır ve inşaat aşamalarına göre serbest bırakılır. Seyahat etmek istemezseniz satış sözleşmeniz vekâletnameyle imzalanabilir.",
          },
          application: {
            title: "Başvuru ve Durum Tespiti",
            body: "Yetkili bir acente başvuruyu adanın vatandaşlık birimine sunar. Ardından bağımsız uluslararası firmalar geçmiş ve fon kaynağı kontrollerini yürütür; zaman çizelgesini belirleyen aşama budur.",
          },
          passport: {
            title: "Onay ve Pasaport",
            body: "Onayın ardından yemin edersiniz — uzaktan, bir büyükelçilikte ya da adada — ve başvuruda adı geçen herkesin pasaportu düzenlenir. Resort payı sizin olarak kalır ve elde tutma süresi bittiğinde satılabilir.",
          },
        },
      },
      faq: {
        heading: "Sık Sorulan Sorular",
        items: {
          what: {
            question: "Yatırımla Karayip Vatandaşlığı nedir?",
            answer: "Grenada, Dominika ve Saint Kitts ve Nevis'in her biri, kendi mevzuatında düzenlenmiş ve onaylı bir ekonomik katkıda bulunan yabancılara vatandaşlık veren bir program yürütür — ya ulusal bir fona bağış ya da devlet onaylı bir gayrimenkul projesine yatırım. Saint Kitts bu türdeki ilk programı 1984'te açmıştır; bu da bunları sektördeki en eski ve en sıkı denetlenen yollar yapar.",
          },
          options: {
            question: "Hangi yatırım seçenekleri mevcut?",
            answer: "Her ada iki yol sunar: daha ucuz olan ama geri hiçbir şey döndürmeyen, ulusal bir kalkınma fonuna geri alınamaz bağış ve yaklaşık 200.000 ABD dolarından başlayan onaylı bir gayrimenkul projesine yatırım. Gayrimenkul yolu başlangıçta daha maliyetlidir ve size elde tutma süresinden sonra satılabilecek bir varlık bırakır. Multi Mulk gayrimenkul yolunda çalışır.",
          },
          timeline: {
            question: "Süreç ne kadar sürer?",
            answer: "Tipik bir dosyada başvurudan pasaporta üç ila altı ay. Hızı evrak değil durum tespiti aşaması belirler; bu nedenle fon kaynağı belgelerini bir soruya yanıt olarak değil, başvurudan önce hazırlarız.",
          },
          family: {
            question: "Başvuruya kimler dahil edilebilir?",
            answer: "Eşiniz ve bakmakla yükümlü olduğunuz çocuklarınız her adada kapsanır; programa bağlı olarak bakmakla yükümlü olduğunuz anne-babanızı veya büyükanne-büyükbabanızı ve bekâr, bakmakla yükümlü olduğunuz kardeşlerinizi de dahil edebilirsiniz. Kurallar Grenada, Dominika ve Saint Kitts arasında farklılık gösterir ve bir ailenin hangi programı seçeceğini çoğu zaman bu belirler.",
          },
          residency: {
            question: "Karayipler'e gitmem veya orada yaşamam gerekiyor mu?",
            answer: "Hayır. Üç programın hiçbiri ikamet, asgari kalış süresi, mülakat veya dil sınavı şartı koymaz ve süreç uzaktan tamamlanabilir. Grenada hiç ziyaret gerektirmez; diğerleri yemini bir büyükelçilik veya konsoloslukta yaptırabilir.",
          },
          benefits: {
            question: "Bu pasaportlar bana ne kazandırır?",
            answer: "Schengen Bölgesi, Birleşik Krallık, Singapur ve Hong Kong dahil 140'tan fazla destinasyona vizesiz veya kapıda vizeyle erişim; nesilden nesile geçen ömür boyu vatandaşlık; ve üç ülkenin hiçbirinde dünya çapındaki gelir, sermaye kazancı veya miras üzerinde vergi olmaması. Grenada ayrıca sahiplerini Amerika Birleşik Devletleri E-2 yatırımcı vizesine uygun kılar.",
          },
          dueDiligence: {
            question: "Başvuru sahipleri hangi kontrollerden geçer?",
            answer: "Her hükümet, kendi vatandaşlık biriminin incelemesinin yanı sıra kimlik, sabıka kaydı, yaptırım maruziyeti ve fon kaynağını doğrulamak için bağımsız uluslararası durum tespiti firmalarını görevlendirir. Standart, Avrupa Birliği ve Amerika Birleşik Devletleri'nin baskısıyla önemli ölçüde sıkılaşmıştır ve başvurular reddedilir. Bir dosyaya herhangi bir harcama yapmadan önce onu dürüstçe değerlendiririz.",
          },
          resale: {
            question: "Gayrimenkulü sonradan satabilir miyim?",
            answer: "Evet, elde tutma süresi bittiğinde — genellikle beş yıl; ancak bu süre adaya ve alıcınızın kendisinin vatandaşlık için başvurup başvurmadığına göre değişir. Onaylı projelerin çoğu elde tutma süresi boyunca kira getirisi de öder. Satış, ömür boyu verilen vatandaşlığınızı hiçbir şekilde etkilemez.",
          },
        },
      },
    },
    turkiye: {
      hero: {
        heading: "Yatırımla Türk Vatandaşlığı",
        body: "Tek bir uygun gayrimenkul alımı; size, eşinize ve 18 yaşından küçük çocuklarınıza vatandaşlık kazandırır — öncesinde ya da sonrasında Türkiye'de yaşama zorunluluğu olmadan.",
      },
      intro: {
        eyebrow: "Giriş",
        heading: "Gerçekten Sahip Olduğunuz Mülk Üzerinden Vatandaşlık",
        paragraphs: [
          "Türkiye, basit bir gayrimenkul alımını tam vatandaşlığa dönüştüren tek büyük programı yürütür. Hiçbir şey bağışlanmaz, hiçbir şeyden vazgeçilmez: 400.000 ABD doları eşiğinde veya üzerinde bir konut satın alırsınız, üç yıl elde tutarsınız ve yatırım sonrasında satmak üzere sizin olarak kalır; vatandaşlık ise ömür boyu ailenizde kalır.",
          "Multi Mulk, İstanbul'un iki yakasında ve Ege ile Akdeniz kıyıları boyunca projeleri temsil eder; her biri portföyümüze girmeden önce bu eşiğe göre ölçülür. Gayrimenkul uzmanları, vatandaşlık danışmanları ve hukuk müşavirleri tek bir ekip olarak çalışır; böylece ilk sorunuzu yanıtlayan kişi, başvuruyu pasaporta kadar götüren kişidir.",
        ],
      },
      stats: {
        investment: "Asgari Gayrimenkul Yatırımı",
        timeline: "İşlem Süresi",
        visaFree: "Vizesiz Destinasyonlar",
        holding: "Elde Tutma Süresi",
      },
      benefits: {
        eyebrow: "Programın Avantajları",
        heading: "Türk Vatandaşlığının Açtığı Kapılar",
        body: "Buradaki vatandaşlık çekmecedeki bir belge değil, çalışan bir varlıktır: hareket özgürlüğü, Avrupa ile Asya arasında bir dayanak noktası ve kazanmaya devam eden bir mülk.",
        items: {
          citizenship: {
            title: "Ömür Boyu Vatandaşlık, Aileniz İçin de",
            body: "Türk vatandaşlığı ömür boyu verilir ve nesilden nesile geçer. Tek bir başvuru sizi, eşinizi ve 18 yaşından küçük çocuklarınızı kapsar; sonradan doğan çocuklar doğuştan Türk'tür. Türkiye çifte vatandaşlığa izin verir, bu yüzden almak için hiçbir şeyden vazgeçmeniz gerekmez.",
          },
          mobility: {
            title: "Avrupa ile Asya Arasında Hareket Özgürlüğü",
            body: "Türk pasaportu 110'dan fazla destinasyona vizesiz veya kapıda vizeyle erişim sağlar ve Türkiye'nin Amerika Birleşik Devletleri ile antlaşması, vatandaşlara çoğu programın sunamadığı E-2 yatırımcı vizesine giden bir yol açar. İstanbul'un iki havalimanı, Avrupa'nın, Körfez'in ve Orta Asya'nın büyük kısmını birkaç saat uzaklığa getirir.",
          },
          assets: {
            title: "Çalışmaya Devam Eden Bir Konut",
            body: "Eşik bağışla değil, satın almayla karşılanır. Gerçek bir piyasada gerçek bir konutun tapusunu alırsınız — içinde yaşayabileceğiniz, kiraya verebileceğiniz ya da çocuklarınıza bırakabileceğiniz bir konut — ve üç yıllık elde tutma süresi bittiğinde piyasa onu ne kadar değerli kıldıysa o fiyattan satabilirsiniz.",
          },
          process: {
            title: "Hızlı ve Kanunla Düzenlenmiş Bir Süreç",
            body: "Program, vaka bazında verilmek yerine Türk mevzuatında düzenlenmiştir ve değerlemeden pasaporta öngörülebilir biçimde üç ila altı ay sürer. Mülakat, dil sınavı ya da herhangi bir aşamada Türkiye'de ikamet etme zorunluluğu yoktur.",
          },
        },
      },
      gallery: {
        eyebrow: "Galeri",
        heading: "İki Kıtanın Buluştuğu Yer",
        body: "İki yakasıyla İstanbul, Bodrum'da Ege, Antalya'da Akdeniz — programa uygun konutların bulunduğu ortamlar.",
      },
      signature: {
        heading: "İki Yakada İmza Niteliğinde Bir Vatandaşlık Yatırımı",
        body: "Türkiye, eşiğin bağışla değil sahiplikle karşılandığı tek büyük programdır ve piyasa yeniden satış yapılabilecek kadar derindir. İstanbul iki kıtaya yayılır ve fiyatları benzer Avrupa başkentlerinin çok altındadır; kıyı şeridi ise Ege'den Akdeniz'e uzanır — bu yüzden buradaki uygun bir alım, pasaport hesaba katılmadan önce genellikle kendi değeriyle değerlendirilir.",
        button: "Türk Vatandaşlığı Hakkında Bilgi Alın",
      },
      enquire: {
        heading: "Türkiye'nin Yatırımla Vatandaşlık Programıyla Küresel Hareket Özgürlüğünüzü Güvenceye Alın",
        body: "Neyi başarmak istediğinizi bize anlatın; size programa uygun konutları, satın alma fiyatının ötesindeki toplam maliyeti ve gerçekçi bir zaman çizelgesini iletelim.",
      },
      projects: {
        heading: "Programa Uygun Projeler",
        body: "Aşağıdaki her konut, güncel değerlemelere göre 400.000 ABD doları eşiğinde veya üzerindedir. Uygun segmentte stok hızla tükenir; bu nedenle rakamlar herhangi bir taahhütten önce resmi değerleme raporuyla teyit edilir.",
      },
      process: {
        eyebrow: "Nasıl İşler",
        heading: "İlk Görüşmeden Pasaporta",
        body: "Tek bir ekip tarafından yürütülen beş aşama. Ailelerin çoğu bu süreci Türkiye'ye hiç ayak basmadan üç ila altı ayda tamamlar.",
        steps: {
          consultation: {
            title: "Danışmanlık",
            body: "Eşiği, elde tutma süresini, satın alma fiyatının ötesindeki maliyetleri ve gerçekçi bir zaman çizelgesini ortaya koyarız — program hedefiniz için doğru seçim değilse bunu da söyleriz.",
          },
          selection: {
            title: "Gayrimenkul Seçimi",
            body: "Satış fiyatına göre değil, resmi değerlemesine göre eşiği aşan konutları kısa listeye alır ve yerinde ya da uzaktan görüntülemeler ayarlarız.",
          },
          purchase: {
            title: "Satın Alma ve Tapu",
            body: "Seyahat etmek istemezseniz avukatınız devri vekâletnameyle tamamlar. Tapu, programın gerektirdiği üç yıllık satılamaz şerhiyle tescil edilir.",
          },
          application: {
            title: "Vatandaşlık Başvurusu",
            body: "Uygunluk belgesini, ikamet iznini ve vatandaşlık başvurusunu birlikte sunarız; durum tespiti belgeleri önceden hazırlanır, böylece hiçbir şey masada takılmaz.",
          },
          passport: {
            title: "Onay ve Pasaport",
            body: "Onayın ardından sizin ve başvuruda adı geçen her aile üyesinin pasaportu düzenlenir. Mülkünüz süreç boyunca sizin olarak kalır ve üç yıl dolduğunda serbestçe satılabilir.",
          },
        },
      },
      faq: {
        heading: "Sık Sorulan Sorular",
        items: {
          what: {
            question: "Yatırımla Türk Vatandaşlığı Programı nedir?",
            answer: "Türkiye'de 400.000 ABD doları veya üzerinde gayrimenkul satın alan ve bunu üç yıl elde tutan yabancılara tam vatandaşlık veren, Türk mevzuatında düzenlenmiş bir yoldur. Bağışa dayalı programlardan farklı olarak yatırım, sahip olduğunuz ve elde tutma süresi bittiğinde satabileceğiniz bir varlıktır; vatandaşlığın kendisi ise kalıcıdır.",
          },
          options: {
            question: "Hangi yatırım seçenekleri uygundur?",
            answer: "Müşterilerimizin çoğunun tercih ettiği yol, resmi değerleme raporuyla teyit edilen en az 400.000 ABD dolarlık gayrimenkuldür. Türk mevzuatı ayrıca her biri üç yıl elde tutulan 500.000 ABD dolarlık banka mevduatını, devlet tahvili alımını veya sermaye yatırımını da tanır. Size seçtiğiniz bir piyasada kullanılabilir bir varlık bırakan tek yol gayrimenkuldür.",
          },
          timeline: {
            question: "Süreç ne kadar sürer?",
            answer: "Tipik bir dosyada satın almadan pasaporta üç ila altı ay. Tapu devri birkaç gün sürer; zamanın büyük kısmı uygunluk belgesine ve vatandaşlık başvurusuna gider. Dosyalar belgeler eksik olduğunda takılır; bu nedenle durum tespiti evraklarını satın almadan sonra değil, önce hazırlarız.",
          },
          family: {
            question: "Başvuruya kimler dahil edilebilir?",
            answer: "Siz, eşiniz ve 18 yaşından küçük çocuklarınız tek bir başvuru ve tek bir eşikle kapsanırsınız. 18 yaşından büyük çocuklar kendi yatırımlarıyla başvurmalıdır. Vatandaşlık verildikten sonra doğan her çocuk doğuştan Türk'tür.",
          },
          residency: {
            question: "Türkiye'de yaşamam veya Türkiye'ye gitmem gerekiyor mu?",
            answer: "Hayır. Vatandaşlıktan önce veya sonra ikamet zorunluluğu, vatandaşlığı korumak için asgari kalış süresi, mülakat veya dil sınavı yoktur. Satın alma işlemi avukatınız tarafından vekâletnameyle tamamlanabilir; böylece tüm süreç siz evinizden ayrılmadan yürüyebilir.",
          },
          benefits: {
            question: "Türk pasaportu bana ne kazandırır?",
            answer: "110'dan fazla destinasyona vizesiz veya kapıda vizeyle erişim, Türkiye'de yaşama, çalışma ve eğitim alma hakkı ve Türkiye'nin antlaşması kapsamında Amerika Birleşik Devletleri E-2 yatırımcı vizesine başvurabilme imkânı. Türkiye çifte vatandaşlığa izin verir, bu yüzden mevcut vatandaşlığınızı korursunuz.",
          },
          dueDiligence: {
            question: "Başvuru sahipleri hangi kontrollerden geçer?",
            answer: "Başvuru sahipleri sabıka kaydı, yaptırım listeleri ve yatırılan fonların kaynağı açısından incelenir. Bu standart gerçektir ve başvurular reddedilir; programı önemli bankalar ve sınır makamları nezdinde güvenilir kılan da budur. Sorun yaratması muhtemel her şeyi, siz taahhütte bulunmadan önce belirtiriz.",
          },
          resale: {
            question: "Mülkü sonradan satabilir miyim?",
            answer: "Evet. Tapuda üç yıllık satılamaz şerhi bulunur; şerh kalktığında konutu piyasanın biçtiği değerden satabilir, kiraya verebilir ya da elinizde tutabilirsiniz. Satış, başvuruda adı geçen hiç kimsenin vatandaşlığını etkilemez — vatandaşlık ömür boyu verilir.",
          },
        },
      },
    },
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
  /** "Broşürü İndirin" — düğme, arkasındaki form ve broşürün geldiği e-posta. */
  roadshow: {
    meta: {
      title: "Türkiye Gayrimenkul Roadshow 2026 — Lahor, İslamabad, Karaçi | Multi Mulk",
      description:
        "Lahor (11 Kasım), İslamabad (13 Kasım) veya Karaçi'de (15 Kasım) Multi Mulk ile yatırım yoluyla Türk vatandaşlığı ve seçkin İstanbul projeleri üzerine ücretsiz özel görüşme ayarlayın.",
    },
    eyebrow: "Türkiye – Pakistan Gayrimenkul Roadshow 2026",
    heading: "Lahor, İslamabad veya Karaçi'de Bizimle Görüşün",
    body: "Yatırım yoluyla Türk vatandaşlığı, aileniz için ikinci pasaport ve seçkin İstanbul projeleri üzerine birebir özel görüşmeler — bu kasımda, kendi şehrinizde.",
    pillars: ["Türk Vatandaşlığı", "İkinci Pasaport", "İstanbul Gayrimenkulü"],
    cta: "Özel Görüşme Ayarlayın",
    cities: {
      lahore: { name: "Lahor" },
      islamabad: { name: "İslamabad" },
      karachi: { name: "Karaçi" },
    },
    hours: "Görüşmeler {range}",
    venueTbc: "Adres onayla birlikte paylaşılır",
    bookCity: "{city} için randevu alın",
    cityClosed: "Görüşmeler tamamlandı",
    citiesHeading: "Üç Şehir, Üç Gün",
    citiesBody:
      "Her görüşme özeldir ve yaklaşık bir saat sürer. Şehrinizi ve size uygun gün dilimini seçin; kesin saati ve adresi telefonla ya da WhatsApp üzerinden teyit ederiz.",
    agendaEyebrow: "Görüşmeniz",
    agendaHeading: "Neleri Konuşacağız",
    agenda: [
      {
        title: "Uygun olup olmadığınız",
        body: "Gayrimenkul yoluyla Türk vatandaşlığı {minimum} tutarından başlar ve mülkün {years} yıl elde tutulması gerekir. Her şeyden önce durumunuzu kurallara göre değerlendiririz.",
      },
      {
        title: "Toplam maliyet",
        body: "Satın alma bedelinin ötesinde: tapu harcı, hukuki ücretler, değerleme ve resmi masraflar — planladığınız rakamın gerçek rakam olması için.",
      },
      {
        title: "Seçkin İstanbul projeleri",
        body: "Vatandaşlığa uygun projelerden kısa bir liste ve herhangi birini önermeden önce yaptığımız tapu ve değerleme kontrolleri.",
      },
      {
        title: "Süreç ve zamanlama",
        body: "Rezervasyondan pasaporta genellikle {min}–{max} ay; Türkiye'de ikamet şartı yok — ve her adımda sizden beklenenler.",
      },
    ],
    factsHeading: "Bir Bakışta Türk Vatandaşlığı",
    facts: {
      minimum: "Asgari gayrimenkul yatırımı",
      processing: "Olağan işlem süresi",
      processingValue: "{min}–{max} ay",
      visaFree: "Vizesiz gidilebilen ülke",
      family: "Kimler dahil edilebilir",
      familyValue: "Eş ve {age} yaş altı çocuklar",
      residence: "İkamet şartı",
      residenceValue: "Yok",
    },
    factsNote:
      "Rakamlar en son {date} tarihinde gözden geçirildi. Program kuralları değişebilir; bu nedenle her rakamı görüşmenizde teyit ederiz.",
    stepsHeading: "Nasıl İşliyor",
    steps: [
      {
        title: "Kaydolun",
        body: "Şehrinizi, gün dilimini ve bütçenizi seçin. Bir dakika sürer.",
      },
      {
        title: "Teyit ederiz",
        body: "Ekibimiz bir iş günü içinde sizi arar ya da WhatsApp'tan yazarak kesin saati ve adresi bildirir.",
      },
      {
        title: "Özel görüşme",
        body: "Bir danışmanla yaklaşık bir saat; ücretsiz ve hiçbir yükümlülük olmadan.",
      },
    ],
    formHeading: "Görüşme Talebinde Bulunun",
    formBody:
      "Görüşmeler ücretsiz, özel ve yükümlülük gerektirmez. Her şehirde kontenjan sınırlıdır.",
    form: {
      city: "Şehir ve tarih",
      slot: "Tercih edilen saat",
      slotPlaceholder: "Gün dilimi seçin",
      slots: {
        morning: "Sabah",
        afternoon: "Öğleden sonra",
        evening: "Akşam",
      },
      budget: "Yatırım bütçesi",
      budgetPlaceholder: "Aralık seçin",
      budgets: {
        under400k: "400.000 $ altı",
        "400kTo600k": "400.000 $ – 600.000 $",
        "600kTo1m": "600.000 $ – 1.000.000 $",
        over1m: "1.000.000 $ üzeri",
      },
      errors: {
        choose: "Lütfen bir seçim yapın.",
        closed: "Bu şehirdeki görüşmeler sona erdi. Lütfen başka bir şehir seçin.",
      },
      consent:
        "Kaydolarak roadshow ve yatırım yoluyla Türk vatandaşlığı hakkında sizinle telefon, WhatsApp ve e-posta yoluyla iletişime geçmemize onay vermiş olursunuz. Verilerinizi nasıl işlediğimizi Gizlilik Politikamızda bulabilirsiniz.",
      submit: "Görüşme Talebi Gönder",
      submitting: "Gönderiliyor…",
    },
    faqHeading: "Randevu Öncesi Sorular",
    faqs: [
      {
        question: "Katılım ücretli mi?",
        answer: "Hayır. Görüşme ücretsizdir ve herhangi bir satın alma yükümlülüğü yoktur.",
      },
      {
        question: "Görüşme nerede yapılacak?",
        answer: "Her şehirde merkezi bir mekânda. Her görüşmenin gizli kalması için adresi saatinizi teyit ederken paylaşırız.",
      },
      {
        question: "Ailemi getirebilir miyim?",
        answer: "Evet, hatta öneririz. Eşiniz ve {age} yaş altı çocuklarınız Türk vatandaşlığı başvurusuna dahil edilebilir; bu yüzden karara katılacak herkesin orada olması iyi olur.",
      },
      {
        question: "Yanımda bir şey getirmem gerekiyor mu?",
        answer: "Zorunlu bir şey yok. Aklınızda bir bütçe ya da proje varsa sorularınızla gelin; pasaport fotokopiniz uygunluğunuzu yerinde kontrol etmemize yardımcı olur.",
      },
      {
        question: "Bu tarihlerde gelemiyorum. Ne yapabilirim?",
        answer: "Bize WhatsApp'tan ya da iletişim sayfamızdan yazın; size uygun bir saatte görüntülü görüşme ayarlayalım.",
      },
    ],
    ended: {
      heading: "2026 Roadshow Sona Erdi",
      body: "Lahor, İslamabad ve Karaçi'de bizimle görüşen herkese teşekkür ederiz. Bir danışmanla görüntülü görüşme ya da telefonla hâlâ konuşabilirsiniz.",
      formHeading: "Çevrim İçi Danışmanlık Ayarlayın",
      formBody:
        "Bilgilerinizi bırakın, bir danışman saat belirlemek için sizinle iletişime geçsin.",
    },
    summary: {
      heading: "Talebiniz",
      city: "Şehir",
      date: "Tarih",
      time: "Tercih edilen saat",
      venue: "Mekân",
    },
    thanks: {
      meta: {
        title: "Kaydınız Alındı | Pakistan Roadshow 2026 | Multi Mulk",
        description: "Roadshow görüşme talebiniz alındı.",
      },
      eyebrow: "Kaydınız Alındı",
      heading: "Teşekkürler — Sizinle İletişime Geçeceğiz",
      body: "Ekibimiz bir iş günü içinde sizi arayarak ya da WhatsApp'tan yazarak kesin saati ve adresi teyit edecek. Talebinizin bir kopyası e-postanıza gönderiliyor.",
      addToCalendar: "Takviminize ekleyin",
      googleCalendar: "Google Takvim",
      icsCalendar: "Apple / Outlook",
      calendarTitle: "Multi Mulk — Türkiye Gayrimenkul Roadshow, {city}",
      calendarDetails:
        "Multi Mulk ile özel görüşme. Kesin saat ve adres ekibimiz tarafından teyit edilecek.",
      whatsapp: "WhatsApp'tan Yazın",
      whatsappMessage:
        "Merhaba Multi Mulk, {city} roadshow'u için kayıt oldum.",
      exploreHeading: "Bu Arada",
      exploreCitizenship: "Yatırım Yoluyla Türk Vatandaşlığı",
      exploreProperties: "İstanbul Gayrimenkullerini İnceleyin",
      exploreGuide: "Ücretsiz Rehberi İndirin",
      back: "Roadshow sayfasına dön",
    },
    email: {
      subject: "Roadshow görüşme talebiniz — Multi Mulk",
      greeting: "Sayın {name},",
      body: "Türkiye – Pakistan Gayrimenkul Roadshow'una kaydolduğunuz için teşekkür ederiz. Talep ettiğiniz görüşmenin ayrıntıları:",
      next: "Ekibimizden biri bir iş günü içinde sizi arayarak ya da WhatsApp'tan yazarak kesin saati ve adresi teyit edecek.",
      closing: "Herhangi bir değişiklik için bu e-postayı yanıtlamanız yeterli.",
    },
  },

  brochure: {
    cta: "Broşürü İndirin",
    heading: "{project} Broşürü",
    body: "Kat planları, malzemeler, teknik özellikler ve ödeme koşulları tek bir belgede. Nereye göndereceğimizi yazın, birkaç dakika içinde e-posta kutunuzda olsun.",
    consent:
      "Broşürü talep ederek bu proje hakkında sizinle iletişime geçmemizi kabul etmiş olursunuz. Verilerinizi nasıl işlediğimizi Gizlilik Politikamızda bulabilirsiniz.",
    submit: "Broşürü Bana Gönderin",
    submitting: "Gönderiliyor…",
    sentHeading: "Yola Çıktı",
    sentBody:
      "{project} broşürünü e-posta adresinize gönderdik. Birkaç dakika içinde ulaşmazsa spam klasörünüzü kontrol edin.",
    email: {
      subject: "{project} broşürünüz",
      greeting: "Sayın {name},",
      body: "{project} projesine gösterdiğiniz ilgi için teşekkür ederiz. Broşürünüz hazır — kat planları, malzemeler, teknik özellikler ve ödeme koşulları.",
      button: "Broşürü indirin",
      closing:
        "Multi Mulk ekibinden bir yetkili kısa süre içinde sizinle iletişime geçecek. Randevu almak veya ödeme koşullarını sormak için bu e-postayı yanıtlamanız yeterli.",
    },
  },
  /** /properties/<slug> adresindeki tek bir rezidansın sayfası. */
  resort: {
    copy: {},
    about: "Hakkında",
    highlights: "Tesisin Öne Çıkanları",
    location: "Konum",
    caribbeanSea: "Karayip Denizi",
    exterior: "Dış Mekân",
    interior: "İç Mekân",
    video: "Video",
    galleryLabel: "{name} fotoğrafları",
    findYourWay: "{name} tesisine ulaşım",
    otherProperties: "Karayipler’deki Diğer Tesisler",
    cbiEyebrow: "Yatırım Yoluyla Vatandaşlık",
    cbiButton: "Vatandaşlık Seçenekleri Hakkında Bilgi Alın",
    ctaHeading: "{name} tesisini keşfedin",
    viewResort: "Tesisi Görüntüle",
    slide: "{index} / {count}",
  },

  listing: {
    galleryNext: "Sonraki",
    galleryPrevious: "Önceki",
    galleryCounter: "{index} / {count}",
    galleryMore: "+{count} daha",
    galleryViewAll: {
      one: "Fotoğrafı görüntüle",
      other: "{count} fotoğrafın tümünü görüntüle",
    },
    specs: "Bir Bakışta",
    about: "Proje Hakkında",
    gallery: "Galeri",
    floorPlans: "Kat Planları",
    terms: "Koşullar",
    paymentPlan: "Ödeme planı",
    handover: "Teslim",
    serviceCharge: "Aidat",
    titleDeed: "Tapu durumu",
    gyo: "GYO",
    vat: "KDV",
    titleDeedTax: "Tapu harcı",
    watchTour: "Turu İzleyin",
    location: "Konum",
    mapTitle: "{title} haritası",
    moreAt: "{project} projesinde daha fazlası",
    ctaHeading: "Bu rezidansla ilgili her şeyi bize sorun.",
    viewDevelopment: "Projeyi Görüntüleyin",
    pricingHeading: "Fiyatlar ve Mevcut Paketler için Ekibimizle İletişime Geçin",
    pricingBody:
      "Güncel fiyatlar, mevcut daireler ve yatırım paketleri için lütfen ekibimizle iletişime geçin.",
    pricingRequest: "Detayları İsteyin",
    pricingWhatsApp: "WhatsApp’tan Yazın",
    pricingWhatsAppMessage:
      "Merhaba Multi Mulk, {project} için güncel fiyatları ve mevcut paketleri öğrenmek istiyorum.",
  },

  legal: {
    pending: "Bu sayfa, Multi Mulk'tan nihai metnini bekliyor. Burada yayımlanana kadar güncel koşullar için info@multimulk.com adresine yazın.",
    updated: "Son güncelleme: {date}",
    headOffice: "Merkez ofis",
    copy: {},
    credits: {
      intro: "Bu sitedeki fotoğrafların neredeyse tamamı stok ya da kamu malıdır ve karşılığında hiçbir şey istemez. Birkaçı Creative Commons lisanslıdır ve lisansları burada kaynak gösterilmesini ister.",
      authorLabel: "Fotoğrafçı",
      sourceLabel: "Kaynak",
      licenceLabel: "Lisans",
      shareAlike: "Bu lisans aynı lisansla paylaşım (share-alike) türündedir. Bu sitede kullanılan sürüm kırpılmıştır, bu da onu türev bir eser yapar; bu nedenle aynı lisansla yayımlanır — aynı koşullarla yeniden kullanabilirsiniz.",
      rest: "Geri kalan her şey Pexels stok fotoğrafı, kamu malı ya da projelerin kendilerinin sağladığı fotoğraflardır. Her dosyanın nereden geldiğinin eksiksiz kaydı dosyalarla birlikte tutulur.",
    },
  },

  documents: {
    meta: {
      title: "Doküman Kütüphanesi",
      description: "Multi Mulk'un yatırımla Türk vatandaşlığı, oturum izni programları ve bizimle çalışma hakkındaki rehberlerini, kontrol listelerini ve sunumlarını indirin.",
    },
    eyebrow: "Kaynaklar",
    heading: "Doküman Kütüphanesi",
    body: "Rehberlerimiz, kontrol listelerimiz ve sunumlarımız, ücretsiz olarak indirilebilir: yatırımla Türk vatandaşlığının nasıl işlediği, bir başvurunun neler istediği ve dünyadaki programların nasıl karşılaştırıldığı.",
    listHeading: "Tüm Dokümanlar",
    searchLabel: "Dokümanlarda ara",
    searchPlaceholder: "Başlık veya anahtar kelimeyle arayın",
    filter: "Filtre",
    filterLabel: "Dokümanları filtrele",
    filterCategory: "Kategori",
    categories: {
      citizenship: "Türk Vatandaşlığı",
      applications: "Başvuru Belgeleri",
      programmes: "Küresel Programlar",
      company: "Şirket ve İş Ortakları",
    },
    pages: {
      one: "{count} sayfa",
      other: "{count} sayfa",
    },
    size: "PDF · {size} MB",
    view: "Görüntüle",
    download: "İndir",
    viewLabel: "{title} belgesini görüntüle (PDF, yeni sekmede açılır)",
    downloadLabel: "{title} belgesini indir (PDF, {size} MB)",
    noMatch: "“{query}” ile eşleşen doküman yok.",
    empty: "{filter} altında henüz bir şey yok.",
    items: {
      "turkiye-citizenship-guide": {
        title: "Gayrimenkul Yatırımıyla Türk Vatandaşlığı",
        summary: "Gayrimenkul alımıyla vatandaşlığın nasıl işlediği ve yatırımın kira geliri ve değer artışıyla nasıl geri dönebileceği.",
      },
      "step-by-step-process-timeline-guide": {
        title: "Adım Adım Süreç ve Zaman Çizelgesi Rehberi",
        summary: "Gayrimenkul yatırımıyla Türk vatandaşlığının alımdan pasaporta kadar her aşaması ve her birinin ne kadar sürdüğü.",
      },
      "turkish-citizenship-application-stages": {
        title: "Türk Vatandaşlığı Başvuru Aşamaları",
        summary: "Başvurunun aşamaları tek bir özet tabloda: her aşamada ne olduğu ve yaklaşık ne kadar sürdüğü.",
      },
      "cbi-bank-deposit": {
        title: "Banka Mevduatıyla Türk Vatandaşlığı",
        summary: "Bir Türk bankasında 500.000 ABD doları mevduat yoluyla, ailenizle birlikte devlet onaylı yol.",
      },
      "turkey-visa-document-checklist": {
        title: "Türkiye Vizesi Belge Kontrol Listesi",
        summary: "Türkiye vize başvurusuna götürmeniz gerekenler: form, pasaport, fotoğraflar ve destekleyici belgeler.",
      },
      "turkish-citizenship-application-documents": {
        title: "Pakistan Vatandaşları için Vatandaşlık Başvuru Belgeleri",
        summary: "Pakistanlı bir başvuru sahibinin ihtiyaç duyduğu kişisel ve aile belgeleri ile her birinin nasıl tasdik ettirildiği, tercüme edildiği ve noterden onaylatıldığı.",
      },
      "global-citizenship-and-residency-programs": {
        title: "Küresel Vatandaşlık ve Oturum İzni Programları",
        summary: "AB, Karayipler, Okyanusya ve Orta Doğu genelinde yatırımla vatandaşlık ve oturum izninin karşılaştırması.",
      },
      "multi-mulk-company-profile": {
        title: "Multi Mulk Şirket Profili",
        summary: "Kim olduğumuz ve dünyanın dört bir yanındaki yatırımcılar için gayrimenkul, oturum izni ve vatandaşlık alanlarında ne yaptığımız.",
      },
      "multi-mulk-b2b": {
        title: "Multi Mulk B2B İş Ortaklığı Programı",
        summary: "Yatırımla Türk vatandaşlığı ve aracılar ile danışmanlar için iş ortaklığı programımız.",
      },
    },
  },

  partners: {
    meta: {
      title: "Multi Mulk ile İş Ortaklığı | Türkiye Gayrimenkul ve Vatandaşlık",
      description: "Müşterilerinize Türkiye gayrimenkul yatırımı ve yatırımla Türk vatandaşlığı sunmak için, özel bir iş ortaklığı ekibinin desteğiyle Multi Mulk ile ortaklık kurun.",
    },
    whatsappMessage: "Merhaba Multi Mulk, bir iş ortaklığını görüşmek istiyorum.",
    hero: {
      eyebrow: "Multi Mulk ile İş Ortaklığı",
      heading: "Zaten Hizmet Verdiğiniz Müşterilere Daha Fazlasını Sunun",
      subheading: "Kendi Türkiye operasyonunuzu kurmadan hizmetlerinize Türkiye gayrimenkulü, yatırımla Türk vatandaşlığı ve uluslararası oturum izni çözümlerini ekleyin.",
      body: "Müşteri ilişkisini siz getirirsiniz. Multi Mulk, o müşteriye profesyonelce hizmet vermek için gereken pazar erişimini, seçilmiş yatırım fırsatlarını, güncel proje bilgilerini ve uzman desteğini sağlar. Multi Mulk iş ortaklıkları tek seferlik işlemler için değil, uzun vadeli iş birliği için kurulur.",
      primary: "İş Ortağı Olun",
      secondary: "İş Ortaklığı Ekibimizle Görüşün",
      audience: "Emlak ofisleri, yatırımla göç danışmanları, varlık danışmanları, hukuk büroları ve uluslararası iş ağları için.",
    },
    why: {
      heading: "Neden Multi Mulk ile İş Ortaklığı?",
      intro: "Multi Mulk, aracılara, danışmanlara ve müşavirlere Türkiye gayrimenkul yatırımı ve yatırımla Türk vatandaşlığı konusunda uzman bir ortak sunar. İş ortakları, uluslararası müşterilere iyi hizmet vermek için gereken erişimi, bilgiyi ve desteği elde eder.",
      items: [
        {
          title: "Seçilmiş Yatırım Fırsatlarına Erişim",
          body: "Müşterilerinize, Multi Mulk'un [uygunluk, değer ve çıkış kontrollerinden](protection) zaten geçmiş Türkiye gayrimenkullerini, ilgili uluslararası yatırım çözümleriyle birlikte sunun.",
        },
        {
          title: "Güncel Proje Bilgileri",
          body: "Eskimiş fiyat listeleriyle değil; güncel proje özetleri, fiyatlar, stok durumu ve satış materyalleriyle çalışın.",
        },
        {
          title: "Yatırım ve Vatandaşlık Uzmanlığı",
          body: "Bir müşterinin hedefleri Türk vatandaşlığını, oturum iznini ya da daha geniş bir yatırım planını içerdiğinde, Multi Mulk'un [gayrimenkul uzmanları, vatandaşlık danışmanları ve hukuk müşavirleri](team) görüşmeye destek verir.",
        },
        {
          title: "Özel İş Ortaklığı Desteği",
          body: "Talepler ve yönlendirmeler doğrudan Multi Mulk'un iş ortaklığı ekibine gider; böylece ilgisiz departmanlar arasında dolaştırılmazsınız.",
        },
        {
          title: "Müşteri Yolculuğu Desteği",
          body: "Multi Mulk her yönlendirmeyi ilk talepten ve fırsat değerlendirmesinden gayrimenkul seçimine, satın almaya ve ilgili danışmanlık aşamalarına kadar destekler.",
        },
        {
          title: "Uluslararası Pazar Erişimi",
          body: "[İstanbul, Dubai ve Lahor'daki ofisleriyle](contact) Multi Mulk, hem Türk gayrimenkul piyasasını hem de bu piyasanın çektiği uluslararası yatırımcıları tanır.",
        },
      ],
    },
    who: {
      heading: "Kimler Multi Mulk ile İş Ortaklığı Kurabilir?",
      intro: "Multi Mulk, müşterileri Türkiye gayrimenkul yatırımı, Türk vatandaşlığı ya da uluslararası oturum izniyle ilgilenen profesyonel firmalar ve bağımsız danışmanlarla iş ortaklığı kurar. İş ortakları Türkiye'de ya da yurt dışında bulunabilir.",
      items: [
        {
          title: "Emlak Ofisleri ve Aracılar",
          body: "Uygun müşterileri seçilmiş Türkiye yatırım fırsatlarıyla tanıştırarak uluslararası portföyünüzü genişletin.",
        },
        {
          title: "Uluslararası Gayrimenkul Danışmanları",
          body: "Güncel proje bilgileri ve Multi Mulk'un iş ortaklığı ekibine doğrudan bir hatla Türkiye'yi kapsadığınız pazarlara ekleyin.",
        },
        {
          title: "Göç ve Vatandaşlık Danışmanları",
          body: "Göç veya mobilite hizmetlerinizi, gayrimenkule dayalı Türk vatandaşlığı yollarıyla tamamlayın.",
        },
        {
          title: "Varlık Yöneticileri, Aile Ofisleri ve Finans Danışmanları",
          body: "Gayrimenkul ve uluslararası mobilite seçeneklerini, müşterinin genel varlık stratejisine uyduğu yerde sunun.",
        },
        {
          title: "Hukuk Büroları ve Kurumsal Hizmet Sağlayıcılar",
          body: "Müşterilerin sizin hizmetlerinizin yanında koordineli gayrimenkul, yatırım, oturum izni veya vatandaşlık desteğine ihtiyaç duyduğu durumlarda iş birliği yapın.",
        },
        {
          title: "Taşınma ve Eğitim Danışmanları",
          body: "Uluslararası alanda hareketli müşterilere ve ailelere Türkiye'deki ilgili gayrimenkul ve oturum izni çözümlerine erişim sağlayın.",
        },
        {
          title: "İş Danışmanları ve Uluslararası Ağlar",
          body: "Türkiye'de yatırımı araştıran müşterilerinizi ve üyelerinizi sahada uzman bir ortakla buluşturun.",
        },
        {
          title: "Yönlendirme Ortakları ve Bağımsız Danışmanlar",
          body: "Nitelikli yatırımcıları yönlendirin; ilgili danışmanlık ve işlem sürecini Multi Mulk yürütsün.",
        },
      ],
      note: "İş ortakları kendi lisansları ve mesleki yükümlülükleri çerçevesinde çalışır. Düzenlemeye tabi hukuki, mali veya göç danışmanlığı yalnızca uygun yetkiye sahip profesyonellerce verilmelidir.",
    },
    models: {
      eyebrow: "İş Ortaklığı Fırsatları",
      heading: "Multi Mulk ile İş Ortaklığının Dört Yolu",
      intro: "Multi Mulk dört iş ortaklığı modeli sunar: Türkiye gayrimenkulü, Türk vatandaşlığı ve yatırım yönlendirmesi, uluslararası vatandaşlık ve oturum izni, stratejik veya kurumsal ortaklıklar.",
      bestForLabel: "Kimler için:",
      items: {
        "real-estate": {
          title: "Türkiye Gayrimenkul İş Ortaklığı",
          bestFor: "Emlak ofisleri, aracılar, gayrimenkul danışmanları ve uluslararası danışmanlar.",
          body: "Müşterileri şunları isteyen iş ortakları için:",
          points: [
            "Yatırım, taşınma veya ikinci konut için [Türkiye'de mülk satın almak](realEstate)",
            "[İstanbul, Bodrum veya Antalya'da gayrimenkul yatırımı](search) yapmak",
            "Bir Türkiye gayrimenkul yatırım portföyü oluşturmak",
            "[Türk vatandaşlığına uygun gayrimenkulleri](citizenshipGuide) incelemek",
          ],
          after: "Multi Mulk seçilmiş projelere erişim, güncel stok ve fiyatlar, proje özetleri ve yatırım bilgileri sağlar; ayrıca işlem boyunca destek verir.",
          link: "Gayrimenkul iş ortağı olarak kaydolun",
        },
        "citizenship-referral": {
          title: "Türk Vatandaşlığı ve Yatırım Yönlendirme Ortaklığı",
          bestFor: "Göç ve yatırımla göç danışmanları, vatandaşlık danışmanları ve varlık uzmanları.",
          body: "Uluslararası müşterileri [yatırımla Türk vatandaşlığı](turkiye) ile ilgilenen danışmanlar ve kuruluşlar için. Multi Mulk, uygun gayrimenkulün seçiminden vatandaşlık başvurusuna kadar ilgili gayrimenkul ve vatandaşlık süreçlerinin danışmanlık ağı aracılığıyla koordine edilmesine yardımcı olur. Yönlendiren iş ortağı süreç boyunca bilgilendirilir.",
          points: [],
          after: "",
          link: "Yönlendirme ortaklığını görüşün",
        },
        "citizenship-residency": {
          title: "Uluslararası Vatandaşlık ve Oturum İzni Ortaklığı",
          bestFor: "Müşterileri Türkiye'nin ötesine bakan seçilmiş profesyonel iş ortakları.",
          body: "Müşterileri Türkiye dışında vatandaşlık veya [oturum izni seçeneklerini](goldenVisa) değerlendiren iş ortakları için; Multi Mulk aracılığıyla sunulan uygun [yatırımla Karayip vatandaşlığı programları](caribbean) da buna dahildir. Multi Mulk, Grenada, Dominika ve Saint Kitts ve Nevis'teki devlet onaylı projelerle çalışır. Programın uygunluğu her müşterinin koşullarına ve o tarihte yürürlükte olan kurallara bağlıdır.",
          points: [],
          after: "",
          link: "Vatandaşlık ve oturum izni ortaklıklarını sorun",
        },
        strategic: {
          title: "Stratejik ve Kurumsal İş Ortaklığı",
          bestFor: "Gayrimenkul geliştiricileri, yatırım şirketleri, aile ofisleri, uluslararası ajanslar, profesyonel hizmet firmaları ve kurumsal ağlar.",
          body: "Multi Mulk ile daha geniş ve yapılandırılmış bir iş birliği isteyen kuruluşlar için. Uyuma bağlı olarak iş birliği şunları içerebilir:",
          points: [
            "Yönlendirme anlaşmaları ve stratejik dağıtım",
            "Pazara giriş iş birliği",
            "Ortak pazarlama ve ortak markalı eğitim içerikleri",
            "Webinarlar, yatırımcı etkinlikleri ve roadshow'lar; örneğin Multi Mulk'un Pakistan'daki Türkiye Gayrimenkul Roadshow'u",
            "Araştırma iş birliği",
          ],
          after: "",
          link: "Stratejik bir ortaklık önerin",
        },
      },
      note: "Belirli ticari koşullar iş ortaklığı modeline bağlıdır ve herhangi bir müşteri yönlendirmesinden önce her iş ortağıyla ayrı ayrı kararlaştırılır.",
    },
    provides: {
      eyebrow: "Multi Mulk'un Sağladıkları",
      heading: "Müşterilerinize Daha İyi Hizmet Vermeniz İçin Tasarlandı",
      intro: "Multi Mulk iş ortaklarına proje erişimi, güncel stok ve fiyatlar, satış materyalleri, yatırım bilgileri, vatandaşlık ve oturum izni koordinasyonu ile müşteri görüşmesi desteğini tek bir iş ortaklığı ekibi üzerinden sağlar.",
      items: [
        {
          title: "Proje Erişimi",
          body: "Merkezi İstanbul rezidanslarından Ege ve Akdeniz kıyılarındaki projelere kadar, uluslararası alıcılar için seçilmiş Türkiye yatırım gayrimenkulleri.",
        },
        {
          title: "Güncel Stok ve Fiyatlar",
          body: "Güncel stok durumu, mevcut fiyatlar ve gerektiğinde proje güncellemeleri.",
        },
        {
          title: "İş Ortağı Satış Materyalleri",
          body: "Mevcut olduğu durumlarda proje özetleri, temel özellikler, sunumlar, broşürler ve onaylı görseller.",
        },
        {
          title: "Yatırım Bilgileri",
          body: "Her fırsatı açıkça anlatabilmeniz için, Multi Mulk'un yayımlanmış Yatırım Puanı çerçevesi de dahil olmak üzere gayrimenkul, piyasa ve yatırım bilgileri.",
        },
        {
          title: "Vatandaşlık ve Oturum İzni Koordinasyonu",
          body: "Hedefleri Türk vatandaşlığı, oturum izni veya başka bir uluslararası mobilite programını içeren müşteriler için koordineli destek.",
        },
        {
          title: "Müşteri Görüşmesi Desteği",
          body: "Uygun olduğunda danışmanlık görüşmeleri, proje sunumları, çevrim içi toplantılar ve mülk ziyaretlerinde yardım.",
        },
      ],
      strip: {
        title: "Tek Bir İş Ortaklığı Muhatabı. Süregelen Bir İlişki.",
        body: "Her iş ortağı; koordinasyon, talepler ve müşteri yönlendirmeleri için Multi Mulk'un iş ortaklığı ekibindeki merkezi bir muhatapla çalışır. İlişki, tek bir yönlendirmenin çok ötesine geçecek şekilde tasarlanmıştır.",
      },
    },
    process: {
      heading: "Multi Mulk İş Ortaklığı Nasıl İşler?",
      intro: "Bir Multi Mulk iş ortaklığı, ilk talebinizden her müşteri yönlendirmesinde birlikte çalışmaya kadar dört adımdan oluşur.",
      steps: [
        {
          title: "İlginizi Bildirin",
          body: "İş ortaklığı formunu doldurun ve Multi Mulk'a kuruluşunuzu, müşterilerinizi ve hizmet verdiğiniz pazarları anlatın.",
        },
        {
          title: "İş Ortaklığı Görüşmesi",
          body: "Multi Mulk'un iş ortaklığı ekibi başvurunuzu inceler ve en uygun iş birliği yapısını ve ticari koşulları sizinle görüşür.",
        },
        {
          title: "Fırsatları Tanıtın",
          body: "İş ortaklığı kurulduktan sonra, kararlaştırılan materyalleri ve süreci kullanarak ilgili fırsatları uygun müşterilere tanıtırsınız.",
        },
        {
          title: "Müşteri Yolculuğunda Birlikte Çalışın",
          body: "Multi Mulk sizinle koordineli çalışır ve müşteriyi ilgili gayrimenkul, yatırım, oturum izni veya vatandaşlık sürecinde destekler.",
        },
      ],
      cta: "İlginizi Bildirin",
    },
    whyUs: {
      heading: "Neden Multi Mulk?",
      subheading: "Önce danışmanlık, sonra portföy.",
      body: "Multi Mulk, Türkiye, BAE ve Pakistan'da ofisleri bulunan uluslararası bir gayrimenkul ve vatandaşlık danışmanlığıdır. İşi, yatırımcının neyi başarmak istediğiyle başlar ve bir proje ya da program yanlış seçimse bunu açıkça söyler. İş ortakları için bu dürüstlük, kurduğunuz müşteri ilişkisini korur.",
      principles: [
        {
          lead: "Önce danışmanlık.",
          body: "Fırsatlar müşterinin hedeflerine göre eşleştirilir, tersi değil.",
        },
        {
          lead: "Uluslararası yatırımcılar için kuruldu.",
          body: "Yabancılara Türkiye'de gayrimenkul, Multi Mulk'un ana işidir; bu yüzden ekip, tapudan elde tutma sürelerine kadar yurt dışındaki alıcıların sorduğu soruları bilir.",
        },
        {
          lead: "Gayrimenkul ve vatandaşlık bir arada.",
          body: "Gayrimenkul uzmanları, vatandaşlık danışmanları ve hukuk müşavirleri tek ekip olarak çalışır; böylece satın alma ve vatandaşlık başvurusu tek bir karar olarak ele alınır.",
        },
        {
          lead: "Şeffaf seçim.",
          body: "Multi Mulk, 20 soruluk bir durum tespiti incelemesi ve ağırlıklı bir Yatırım Puanı dahil olmak üzere gayrimenkulü nasıl değerlendirdiğini yayımlar.",
        },
        {
          lead: "Yapılandırılmış iletişim.",
          body: "Her dosyayı müşteriye en yakın ekip yürütür; böylece iş ortakları her yönlendirmeyle kimin ilgilendiğini bilir.",
        },
        {
          lead: "Uzun vadeli ilişkiler.",
          body: "Vatandaşlık dosyaları aylar sürer ve uygun gayrimenkul yıllarca elde tutulur; bu nedenle Multi Mulk müşteri ilişkilerini ve iş ortaklıklarını uzun vadeli planlar.",
        },
      ],
      link: "Multi Mulk'un gayrimenkulü nasıl değerlendirdiğini görün",
    },
    form: {
      heading: "Multi Mulk ile İş Ortaklığını Keşfedin",
      body: "Bize işinizden ve hizmet verdiğiniz müşterilerden biraz bahsedin. İş ortaklığı ekibimiz başvurunuzu inceleyecek ve birlikte çalışmanın en uygun yolunu görüşmek için sizinle iletişime geçecek.",
      name: "Adınız ve Şirketiniz",
      namePlaceholder: "Tam adınız ve şirket adınız",
      contact: "İş E-postası / WhatsApp",
      contactPlaceholder: "İş ortaklığı ekibimiz size nasıl ulaşmalı?",
      type: "Hangi tür iş ortaklığıyla ilgileniyorsunuz?",
      typePlaceholder: "Bir iş ortaklığı türü seçin",
      types: {
        "real-estate": "Türkiye Gayrimenkul İş Ortaklığı",
        "citizenship-referral": "Türk Vatandaşlığı / Yatırım Yönlendirmesi",
        "citizenship-residency": "Uluslararası Vatandaşlık ve Oturum İzni",
        developer: "Geliştirici / Proje Ortaklığı",
        strategic: "Stratejik / Kurumsal İş Ortaklığı",
        referral: "Yönlendirme Ortaklığı",
        "not-sure": "Emin değilim — görüşmek istiyorum",
      },
      markets: "Şu anda hangi pazarlara veya müşteri gruplarına hizmet veriyorsunuz?",
      marketsPlaceholder: "Örneğin: Pakistan, BAE, Körfez ülkeleri, Avrupa, Asya, yüksek net değerli yatırımcılar, mülk alıcıları, taşınma müşterileri vb.",
      message: "Multi Mulk ile nasıl çalışmak istediğinizi kısaca anlatın.",
      messagePlaceholder: "İşinizden, müşterilerinizden ve aradığınız iş birliği türünden bahsedin.",
      submit: "İş Ortaklığı Talebini Gönder",
      privacy: "Bu formu göndererek Multi Mulk'un iş ortaklığı talebinizle ilgili sizinle iletişime geçebileceğini kabul edersiniz. Bilgilerinizin nasıl işlendiğine dair ayrıntılar için [Gizlilik Politikası](privacy) sayfasına bakın.",
      sentHeading: "Teşekkür ederiz.",
      sentBody: "Talebiniz Multi Mulk iş ortaklığı ekibine ulaştı; sonraki adımları görüşmek için sizinle iletişime geçecekler.",
      errors: {
        contact: "Bir e-posta adresi ya da ülke koduyla birlikte bir WhatsApp numarası girin (ör. +92 300 1234567).",
        type: "Lütfen bir iş ortaklığı türü seçin.",
      },
    },
    cta: {
      heading: "Müşterileriniz Türkiye'yi Sorduğunda Hazır Olun",
      body: "İster uluslararası yatırımcılara danışmanlık yapın, ister mülk alıcılarını temsil edin, ister yatırımla göç alanında çalışın; Multi Mulk, kuruluşunuz ve müşterileriniz için değer yaratan yapılandırılmış iş ortaklıklarına açıktır. Bir uyum olup olmadığını görmek için iş ortaklığı ekibiyle kısa bir görüşme yeterlidir.",
      button: "İş Ortaklığı Görüşmesi Başlatın",
    },
    faq: {
      heading: "İş Ortaklığı Hakkında Sık Sorulan Sorular",
      items: [
        {
          question: "Kimler Multi Mulk iş ortağı olabilir?",
          answer: "Multi Mulk, müşterileri Türkiye'de gayrimenkul yatırımı, yatırımla Türk vatandaşlığı veya uluslararası oturum izniyle ilgilenen profesyonel firmalar ve bağımsız danışmanlarla iş ortaklığı kurar. Buna emlak ofisleri ve aracılar, göç ve vatandaşlık danışmanları, hukuk büroları, varlık yöneticileri, aile ofisleri, taşınma şirketleri, kurumsal hizmet sağlayıcılar ve yönlendirme ortakları dahildir. En uygun iş ortaklığı modelini belirlemek için her talep ayrı ayrı incelenir.",
        },
        {
          question: "Türkiye dışındaki emlak danışmanları Multi Mulk ile iş ortaklığı kurabilir mi?",
          answer: "Evet. Multi Mulk, müşterileri Türkiye'de mülk satın almak isteyen, Türkiye dışındaki emlak danışmanları, aracılar ve gayrimenkul danışmanlarıyla iş ortaklığını memnuniyetle karşılar. Yurt dışındaki iş ortakları proje özetleri, güncel fiyat ve stok bilgileri ile onaylı satış materyalleri alır; Multi Mulk'un İstanbul ekibi ise her satın almanın yerel aşamalarını destekler. Multi Mulk, süreç boyunca yönlendiren iş ortağıyla koordineli çalışır.",
        },
        {
          question: "Yatırımla Türk vatandaşlığıyla ilgilenen müşterileri yönlendirebilir miyim?",
          answer: "Evet. Göç danışmanları, vatandaşlık danışmanları ve diğer profesyoneller, gayrimenkul yoluyla Türk vatandaşlığı dahil olmak üzere yatırımla Türk vatandaşlığıyla ilgilenen müşterileri yönlendirebilir. Multi Mulk, ilgili gayrimenkul ve vatandaşlık süreçlerinin danışmanlık ağı aracılığıyla koordine edilmesine yardımcı olur. Uygunluk her müşterinin koşullarına ve başvuru tarihinde yürürlükte olan program kurallarına bağlıdır; bu nedenle her dosya ayrı ayrı değerlendirilir.",
        },
        {
          question: "Multi Mulk iş ortaklarına hangi desteği sağlar?",
          answer: "Multi Mulk iş ortaklarına seçilmiş Türkiye gayrimenkul projelerine erişim, güncel stok ve fiyatlar, proje özetleri, onaylı satış materyalleri ve yatırım bilgileri sağlar. İş ortakları ayrıca Türk vatandaşlığı veya oturum izni hedefleyen müşteriler için koordinasyon, uygun olduğunda müşteri görüşmeleri ve mülk ziyaretlerinde yardım ve talepler ile yönlendirmeler için iş ortaklığı ekibinde merkezi bir muhatap alır.",
        },
        {
          question: "Multi Mulk ile iş ortaklığına nasıl başlarım?",
          answer: "Bu sayfadaki iş ortaklığı formunu doldurun. Form adınızı ve şirketinizi, iletişim bilgilerinizi, ilgilendiğiniz iş ortaklığı türünü, hizmet verdiğiniz pazarları ve nasıl birlikte çalışmak istediğinizi sorar. Multi Mulk'un iş ortaklığı ekibi her talebi inceler ve en uygun modeli görüşmek için sizinle iletişime geçer. Ticari koşullar modele bağlıdır ve ayrı ayrı kararlaştırılır.",
        },
      ],
    },
  },

  whatsapp: {
    label: "Merhaba!",
    message: "Merhaba Multi Mulk, mülkleriniz hakkında daha fazla bilgi almak istiyorum.",
    aria: "WhatsApp'ta Multi Mulk ile sohbet edin",
  },

  property: {
    viewResidences: "Konutları Görüntüle",
    viewProgress: "İnşaat İlerlemesini Görüntüle",
    residencesEyebrow: "Hayalinizdeki Evi Bulun",
    residencesHeading: "Mevcut Konutlar",
    residencesBody: {
      one: "{project} projesinde şu anda satışa sunulan {count} konutu keşfedin.",
      other: "{project} projesinde şu anda satışa sunulan {count} konutu keşfedin.",
    },
    residencesCount: {
      one: "{count} konut",
      other: "{count} konut",
    },
    residencesEmpty: "{project} konutları etaplar halinde satışa sunulur — güncel stok için bilgi alın.",
    browseAll: "Tüm konutlara göz atın",
    about: "Proje Hakkında",
    amenities: "Olanaklar",
    architecture: "Mimari Konsept",
    earthquake: "Deprem Dayanıklılığı",
    distancesEyebrow: "Ulaşım",
    distancesHeading: "{project} Projesine ve Projeden Mesafeler",
    areaEyebrow: "Bölge",
    areaOverview: "Konum Hakkında",
    marketEyebrow: "Piyasa Analizi",
    marketPerformance: "Konut Piyasası Performansı",
    distanceGroups: {
      "Cultural Hubs": "Kültür Merkezleri",
      Airports: "Havalimanları",
      Hospitals: "Hastaneler",
      "Business Hubs": "İş Merkezleri",
      Transportation: "Ulaşım",
      Education: "Eğitim",
      Universities: "Üniversiteler",
      Schools: "Okullar",
      "Shopping Centres": "Alışveriş Merkezleri",
    },
    otherDevelopments: "Diğer Projeler",
    enquireEyebrow: "Bir Danışmanla Görüşün",
    enquireHeading: "{project} hakkında bilgi alın",
    enquireSubject: "{project} hakkında talep",
    enquireBody: "Ne aradığınızı bize anlatın; bir danışman güncel stok, fiyatlar ve sonraki adımlarla size dönüş yapsın.",
    projects: {
      "levent-residences": {
        tagline: "İstanbul'un Kalbinde Simge Bir Adres",
        overviewHeading: "Her Konut: Şehrin Bir Panoraması.",
      },
      "bosphorus-heights": {
        tagline: "Boğaz'ın Üzerinde Yükselen Bir Yaşam",
        overviewHeading: "Suyla Çerçevelenmiş, Gökyüzüyle Taçlanmış.",
      },
      "marmara-vista": {
        tagline: "İstanbul'un Batı Kıyısında Sahil Huzuru",
        overviewHeading: "Ferahlık, Işık ve Açık Deniz.",
      },
      "aegean-bay-residences": {
        tagline: "Bodrum Yarımadası'nda İdeal Kaçış",
        overviewHeading: "Ege'ye Uyanın.",
      },
    },
    highlights: {
      "Central Connectivity": "Merkezi Ulaşım",
      "Citizenship Eligible": "Vatandaşlığa Uygun",
      "City and Bosphorus Views": "Şehir ve Boğaz Manzarası",
      "Bosphorus Outlook": "Boğaz Manzarası",
      "Heritage Quarter": "Tarihi Semt",
      "Marmara Sea Views": "Marmara Denizi Manzarası",
      "Family Neighbourhood": "Aile Mahallesi",
      "Airport Access": "Havalimanı Erişimi",
      "Bodrum Peninsula": "Bodrum Yarımadası",
      "Unmatched Coastal Living": "Eşsiz Sahil Yaşamı",
    },
    stats: {
      Quantity: "Adet",
      Floors: "Katlar",
      Location: "Konum",
      "Room Sizes": "Daire Büyüklükleri",
      Apartments: "Daireler",
      Townhouses: "Sıra Evler",
      "Studio Apartments": "Stüdyo Daireler",
    },
    statValues: {
      "420 apartments": "420 daire",
      "11 townhouses with 3 & 5 bedrooms": "3 ve 5 yatak odalı 11 sıra ev",
      "Studio, 1, 2, 3 bedroom units": "Stüdyo, 1+1, 2+1, 3+1 daireler",
      "512 sq. ft. - 6,600 sq. ft.": "512 - 6.600 ft²",
      "165 total apartments": "Toplam 165 daire",
      "78 studio units": "78 stüdyo daire",
      "87 one-bedroom units": "87 adet 1+1 daire",
      "Beyoğlu, İstanbul": "Beyoğlu, İstanbul",
      "151 apartments": "151 daire",
      "Studio, 1 & 2 bedroom units": "Stüdyo, 1+1 ve 2+1 daireler",
      "479 sq. ft. - 1,709 sq. ft.": "479 - 1.709 ft²",
      "Floor 1 - 15": "1. - 15. kat",
      "88 apartments": "88 daire",
      "Studio to 3 bedrooms": "Stüdyodan 3+1'e",
      "572 sq. ft. - 3,874 sq. ft.": "572 - 3.874 ft²",
      "Bodrum, Muğla": "Bodrum, Muğla",
    },
    copy: {},
    amenityItems: {
      "Lobby & Concierge": "Lobi ve Konsiyerj",
      Lobby: "Lobi",
      Concierge: "Konsiyerj",
      "Spa & Hammam": "Spa ve Hamam",
      "Residents’ Lounge": "Site Sakinleri Salonu",
      "Fitness Centre": "Fitness Merkezi",
      Gym: "Spor Salonu",
      "Landscaped Terrace": "Peyzajlı Teras",
      "Secure Parking": "Güvenli Otopark",
      "Indoor Pool": "Kapalı Havuz",
      "Outdoor Pool": "Açık Havuz",
      "Pool Terrace": "Havuz Terası",
      "Rooftop Lounge": "Çatı Salonu",
      "Promenade Access": "Sahil Yürüyüş Yoluna Erişim",
      "Bay Access": "Koya Erişim",
      "24/7 Security": "7/24 Güvenlik",
      "Cinema Room": "Sinema Odası",
      "Co-working Space": "Ortak Çalışma Alanı",
      "Private Elevator": "Özel Asansör",
      "Retail & Dining": "Mağazalar ve Restoranlar",
      Sauna: "Sauna",
      "Yoga Studio": "Yoga Stüdyosu",
      "Landscaped Gardens": "Peyzajlı Bahçeler",
      "Children’s Play Area": "Çocuk Oyun Alanı",
      "Jogging Track": "Koşu Parkuru",
      "Tennis Court": "Tenis Kortu",
      "Padel Court": "Padel Kortu",
      "BBQ Area": "Barbekü Alanı",
      "EV Charging": "Elektrikli Araç Şarjı",
      "Smart Home": "Akıllı Ev",
      "Pet Friendly": "Evcil Hayvan Dostu",
      "Beach Access": "Plaja Erişim",
      "Spa & Wellness": "Spa ve Wellness",
      "Green Spaces": "Yeşil Alanlar",
      "Walking Paths": "Yürüyüş Yolları",
      "Dining Areas": "Yemek Alanları",
      "Educational Facilities": "Eğitim Tesisleri",
      "Private Parking": "Özel Otopark",
    },
  },

  team: {
    hero: {
      heading: "Dosyayı Yürüten İnsanlar",
      body: "Multi Mulk bilinçli olarak küçük bir danışmanlıktır. İlk sorunuzu yanıtlayan kişi başvuruyu sonuna kadar götüren kişidir ve ikisinin arasında başka bir masa yoktur.",
    },
    leadership: {
      eyebrow: "Üst Yönetim",
      heading: "Küresel Bakış Açısıyla Liderlik",
      body: "Multi Mulk'un danışmanlık çalışmaları, ofisleri ve uzun vadeli büyümesi genelinde stratejik liderlik.",
    },
    people_section: {
      eyebrow: "Ekibimiz",
      heading: "Her Alanda Uzmanlık",
      body: "Operasyon, satış, müşteri danışmanlığı ve dijital medya; bir dosyanın üç ayrı ofis tarafından değil tek bir firma tarafından yürütülmesi için Dubai, İstanbul ve Lahor'da birlikte çalışır.",
    },
    portraitAlt: "{name}, Multi Mulk {title}",
    departments: {
      executiveLeadership: "Üst Yönetim",
      growthDubai: "Büyüme ve Dubai Operasyonları",
      turkeyOperations: "Türkiye Operasyonları",
      operations: "Operasyon",
      istanbulSales: "İstanbul Satış",
      sales: "Satış",
      clientAdvisory: "Müşteri Danışmanlığı",
      digitalMedia: "Dijital Medya",
      mediaProduction: "Medya Prodüksiyonu",
      humanResources: "İnsan Kaynakları",
      legal: "Hukuk",
      education: "Eğitim",
      marketing: "Pazarlama",
    },
    people: {
      "mohd-imad": [
        "SEO Uzmanı",
      ],
      afsheen: [
        "İçerik Üreticisi",
      ],
      "raazia-sanam": [
        "Yatırım Danışmanı",
      ],
      shahid: [
        "Sosyal Medya Yönetici Yardımcısı",
      ],
      "shaik-mohammed-aburuddin": [
        "Yatırım Danışmanı",
      ],
      "souha-koudmani": [
        "Genel Müdür",
      ],
      "hashim-hashimdan": [
        "Kameraman",
      ],
      "zeynep-nehir-karap": [
        "Yatırım Danışmanı",
      ],
      "sajid-ali-haydar": [
        "İcra Kurulu Başkanı (CEO)",
      ],
      "nader-djebbi": [
        "Büyümeden Sorumlu Yönetici (CGO)",
        "Ofis Müdürü (Dubai)",
      ],
      "seyhan-ozman": [
        "Ofis Yöneticisi",
      ],
      "nilofar-sadiq": [
        "Yatırım Danışmanı",
      ],
      "zeeshan-haider": [
        "Video Editörü",
      ],
      "mahenur-azlem": [
        "İK Koordinatörü",
      ],
      "mubark-ali": [
        "Yatırım Danışmanı",
      ],
      "tariq-tahir": [
        "Kıdemli Yatırım Danışmanı",
      ],
      "sobhi-al-sabhi": [
        "Kıdemli Yatırım Danışmanı",
      ],
      "muhammad-mubashir": [
        "Yatırım Danışmanı",
      ],
      "muhammet-kurtulus": [
        "Kıdemli Yatırım Danışmanı",
      ],
      "maryam-shad": [
        "Sosyal Medya Yöneticisi",
      ],
      "muhammad-jamal": [
        "Yatırım Danışmanı",
      ],
      "sinan-sadikhov": [
        "Yatırım Danışmanı",
      ],
      "kubra-senturk": [
        "Hukuk Danışmanı",
      ],
      "elnaz-aminzadeh": [
        "Yatırım Danışmanı",
      ],
      "alireza-akbari": [
        "Pazarlama Ekibi Yöneticisi",
      ],
      "asad-ullah-saif": [
        "Kıdemli Yatırım Danışmanı",
      ],
      "muhammad-ali-shahid": [
        "Yatırım Danışmanı",
      ],
      "rizwan-aslam": [
        "Video Prodüksiyon Uzmanı",
      ],
      "ayshe-ali-haydar": [
        "Yatırım Danışmanı",
      ],
      "badar-naseem": [
        "Yatırım Danışmanı",
      ],
      "iffah-mir": [
        "Grafik Tasarımcı",
      ],
      "amina-ashraf": [
        "İçerik Geliştirici",
      ],
      "faizan-asif": [
        "Web Sitesi / SEO Uzmanı",
      ],
      "sarmad-al-kaseer": [
        "Kıdemli Yatırım Danışmanı",
      ],
    },
    cta: {
      heading: "İşi Yapacak İnsanlarla Konuşun",
      body: "Neyi başarmak istediğinizi bize anlatın. Kimse sizden herhangi bir taahhütte bulunmanızı istemeden önce; bunun ulaşılabilir olup olmadığına, ilan edilen rakamın ötesinde neye mal olacağına ve ne kadar sürmesi gerektiğine dair bir görüş alırsınız.",
    },
  },

  freeGuide: {
    meta: {
      title: "Ücretsiz Rehber | Yatırımla Türk Vatandaşlığı | Multi Mulk",
      description: "Multi Mulk'un gayrimenkul yoluyla Türk vatandaşlığı hakkındaki ücretsiz rehberini indirin: gayrimenkul yolunun nasıl işlediği, maliyeti ve sürecin sizden neler istediği.",
    },
    eyebrow: "Ücretsiz Rehber",
    heading: "Gayrimenkul Yoluyla Türk Vatandaşlığı",
    body: "Gayrimenkul yolunun nasıl işlediği, toplamda neye mal olduğu ve bir başvurunun sizden neler istediği — tıklama için değil, karar için yazıldı.",
    leadHeading: "Rehberde neler var",
    leadBody: "Yatırım eşiği, elde tutma süresi, ailenin dahil edilmesi ve bir alımın kira geliri ve değer artışıyla nasıl geri dönebileceği üzerine yirmi dört sayfa.",
    includes: [
      "Gayrimenkul yoluyla vatandaşlığın adım adım nasıl işlediği",
      "Devletin neler istediği ve neler istemediği",
      "Bir projeyi uygunluk, değer ve çıkış açısından nasıl değerlendireceğiniz",
      "Satın almadan pasaporta kadar süreler",
    ],
    formHeading: "Rehberi bana gönderin",
    formBody: "Nereye göndereceğimizi söyleyin. PDF birkaç saniye içinde gelen kutunuza ulaşır; bir danışman yalnızca siz isterseniz sizinle iletişime geçer.",
    consent: "Rehberi talep ederek yatırımla Türk vatandaşlığı konusunda sizinle iletişime geçmemize onay vermiş olursunuz. Verilerinizi nasıl işlediğimize dair ayrıntılar için Gizlilik Politikamıza bakın.",
    submit: "Rehberi Bana Gönderin",
    submitting: "Gönderiliyor…",
    sentHeading: "Yolda",
    sentBody: "Rehberi size e-postayla gönderdik. Birkaç dakika içinde ulaşmazsa spam klasörünüzü kontrol edin.",
    email: {
      subject: "Ücretsiz rehberiniz: {title}",
      greeting: "Sayın {name},",
      body: "{title} talebiniz için teşekkür ederiz. Rehberiniz hazır — aşağıdan indirebilirsiniz.",
      button: "Rehberi indirin",
      closing: "Multi Mulk ekibinden biri kısa süre içinde sizinle iletişime geçecek. Belirli bir proje veya süre hakkında soru sormak için bu e-postayı yanıtlamanız yeterli.",
    },
  },

  calculatorResult: {
    meta: {
      title: "Maliyet Tahmininiz | Multi Mulk",
      description: "Bir vatandaşlık veya oturum izni programının toplamda neye mal olduğunu görün — yatırım, ücretler ve devlet harçları — ve ayrıntılı dökümü kendinize e-postayla gönderin.",
    },
    eyebrow: "Hesaplama Sonucu",
    heading: "Toplam Maliyet Tahmininiz",
    body: "Eşik maliyet değil, yatırımdır. Programı ve aile büyüklüğünü ayarlayın, ardından ayrıntılı dökümün kilidini açın.",
    formHeading: "Dökümü bana e-postayla gönderin",
    formBody: "Bilgilerinizi bırakın; kalem kalem tahmini gelen kutunuza gönderelim ve bu sayfada da kilidini açalım.",
    unlockHint: "Kalemlerin kilidini açmak için bilgilerinizi karşıdaki forma girin.",
    cta: "Bu Tahmini Bana E-postayla Gönderin",
    consent: "Tahmini talep ederek seçtiğiniz programla ilgili sizinle iletişime geçmemize onay vermiş olursunuz. Verilerinizi nasıl işlediğimize dair ayrıntılar için Gizlilik Politikamıza bakın.",
    submit: "Dökümü Bana E-postayla Gönderin",
    submitting: "Gönderiliyor…",
    sentHeading: "Dökümün Kilidi Açıldı",
    sentBody: "Kalemler yukarıda açıldı ve aynı tahmin e-postanıza gönderiliyor. Birkaç dakika içinde ulaşmazsa spam klasörünüzü kontrol edin.",
    email: {
      subject: "Maliyet tahmininiz: {programme}",
      greeting: "Sayın {name},",
      body: "{programme} için talep ettiğiniz toplam maliyet tahmini aşağıdadır.",
      closing: "Bu rakamlar planlama içindir, teklif değildir. Multi Mulk ekibinden biri kısa süre içinde sizinle iletişime geçecek — sorularınız için bu e-postayı yanıtlayın.",
    },
  },
};

export default tr;
