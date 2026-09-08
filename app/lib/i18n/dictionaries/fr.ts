/**
 * Français.
 *
 * Register: the vouvoiement throughout, and the vocabulary of the French
 * luxury-property market — « résidences » rather than « propriétés » for the
 * developments themselves, « biens » when speaking of the asset. Development
 * and operator names are left in the original, as the market writes them.
 */

import type { Dictionary } from "../index";
import { plural, staged, type ArticleCopy, type ProjectCopy } from "../format";

const fr: Dictionary = {
  meta: {
    home: {
      title: "Multi Mulk | Des solutions globales pour des citoyens du monde",
      description:
        "Multi Mulk accompagne les citoyens du monde vers des résidences de prestige et des programmes de citoyenneté par investissement aux Émirats, en Türkiye et dans les Caraïbes.",
    },
    about: {
      title: "À propos",
      description:
        "Multi Mulk est un cabinet international de conseil en immobilier et en citoyenneté, qui relie les citoyens du monde à des résidences d’exception en Türkiye et dans les Caraïbes.",
    },
    media: {
      title: "Espace presse",
      description:
        "Retombées presse, annonces et guides signés Multi Mulk — citoyenneté turque par investissement, programmes d’İstanbul et du littoral, et portefeuille caribéen.",
    },
    search: {
      title: "Rechercher un bien",
      description:
        "Parcourez des résidences avec accès resort, vues dégagées et art de vivre balnéaire — filtrées selon vos critères.",
    },
    contact: {
      title: "Nous contacter",
      description:
        "Échangez avec l’équipe Multi Mulk sur la citoyenneté turque par investissement, l’immobilier en Türkiye et les programmes caribéens.",
    },
    team: {
      title: "Notre équipe",
      description:
        "Les personnes derrière Multi Mulk — la direction, et les trois bureaux de Dubaï, İstanbul et Lahore qui suivent de bout en bout les dossiers de citoyenneté turque, de programmes caribéens et d’immobilier.",
    },
    /** Clé par slug de programme, comme dans `citizenship.ts`. */
    citizenship: {
      turkiye: {
        title: "Citoyenneté turque par investissement",
        description:
          "La citoyenneté turque par l’achat d’un bien à partir de 400 000 USD — seuils, délais et résidences éligibles à İstanbul et sur la côte.",
      },
      caribbean: {
        title: "Citoyenneté caribéenne par investissement",
        description:
          "Une seconde citoyenneté à Grenade, en Dominique et à Saint-Christophe-et-Niévès par un investissement dans des projets approuvés par les États — seuils, délais et programmes immobiliers.",
      },
    },
    propertyFallback: "Bien immobilier",
    articleFallback: "Article",
  },

  common: {
    getInTouch: "Nous contacter",
    learnMore: "En savoir plus",
    viewAll: "Tout voir",
    readMore: "Lire la suite",
    enquireNow: "Nous consulter",
    loadMore: "Voir plus",
    startingFrom: "À partir de",
    any: "Indifférent",
    sortBy: "Trier par",
    resetAll: "Tout réinitialiser",
    searchProperties: "Rechercher",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    close: "Fermer",
    logoAlt: "Multi Mulk — Des solutions globales pour des citoyens du monde",
    chooseLanguage: "Choisir une langue",
    socialProfile: "Profil social de {name}",
  },

  review: {
    line: "Dernière vérification le {date}",
    by: "Vérifié par {name}",
    sources: "Sources",
    retrieved: "consulté le {date}",
    stale: "Cette page doit être revue. Confirmez tout chiffre auprès de nous avant d’agir.",
  },

  figures: {
    qualifiers: {
      statutory: "Fixé par la loi.",
      estimated:
        "Estimation — sous réserve des délais de traitement administratif et de la situation de chaque demandeur. Sans garantie.",
      indicative: "À titre indicatif. Confirmez le chiffre pour votre propre situation.",
      market: "Estimation de marché, variable selon le bien et la date.",
    },
    units: {
      months: "mois",
      years: "ans",
      days: "jours",
      count: "destinations",
      percent: "%",
    },
  },

  /** Ask Multi Mulk, client outcomes, the calculators and the author pages. */
  faq: {
    eyebrow: "Demandez à Multi Mulk",
    heading: "Les questions que l’on pose vraiment",
    body: "Des réponses qui aboutissent. Lorsque la réponse dépend réellement de quelque chose, ce quelque chose est nommé plutôt que laissé comme prétexte à nous appeler.",
    fullAnswer: "Lire la réponse complète",
    topics: {
      eligibility: "Éligibilité",
      cost: "Coût",
      timeline: "Délais",
      family: "Famille",
      property: "Immobilier",
      tax: "Fiscalité",
      process: "Procédure",
      travel: "Voyage",
    },
  },

  caseStudies: {
    eyebrow: "Résultats clients",
    heading: "À quoi ressemble le travail",
    body: "Des dossiers anonymisés, avec le raisonnement et les complications laissés intacts. Une étude de cas sans complication est une brochure.",
    objective: "Objectif",
    family: "Famille",
    invested: "Investi",
    timeline: "Du début à la fin",
    afterwards: "Ensuite",
    reasoning: "Pourquoi ce choix, et ce qui a été écarté",
    complication: "Ce qui a coincé",
    consentPending: "Aucun résultat client n’est encore publié. Cela exige le consentement écrit du client, que Multi Mulk ne détient pour aucun à ce jour.",
  },

  tools: {
    eyebrow: "Outils",
    heading: "Faites les calculs vous-même",
    body: "Chaque calculateur lit les mêmes fiches de programme que le reste du site : aucun ne peut donc citer un seuil que la page du programme contredit.",
    calculator: {
      heading: "Ce que cela coûte, tout compris",
      body: "Le seuil est l’investissement, pas le coût. Ceci y ajoute la transaction, selon les hypothèses listées sous le total.",
      programme: "Programme",
      adults: "Adultes",
      children: "Enfants de moins de 18 ans",
      total: "Total estimé",
      lines: {
      investment: "Investissement éligible",
      transferTax: "Droits de mutation",
      legal: "Honoraires juridiques et de conseil",
      documentation: "Évaluation, traduction et notaire",
      government: "Frais gouvernementaux",
      },
      assumptions: "Hypothèses : droits de mutation de {tax}, {legal} d’honoraires, {docs} de documentation et {gov} par personne pour {people} demandeurs.",
      caveat: "Une estimation pour planifier, non un devis. Les taux varient selon le bien, la juridiction et la date, et la TVA n’est pas prise en compte. Nous mettons le chiffre réel par écrit avant tout engagement.",
    },
  },

  authors: {
    eyebrow: "Notre équipe",
    heading: "Qui vous conseille",
    body: "Un conseil en immigration et en investissement ne vaut que ce que vaut celui qui le donne. Voici les personnes derrière ce qui est écrit ici.",
    credentials: "Qualifications",
    knowsAbout: "Domaines d’intervention",
    noCredentials: "Qualifications en attente de confirmation.",
    reviewedContent: "Contenus vérifiés",
    roles: {
      founder: "Fondateur et directeur général",
      advisory: "Directeur du conseil",
      team: "Équipe de conseil",
    },
  },

  /** The Investor Protection framework: the three filters, the twenty checks
   *  and the scoring model. Structure lives in `app/lib/due-diligence.ts`. */
  legal: {
    pending: "Cette page attend son texte définitif de Multi Mulk. En attendant sa publication ici, écrivez à info@multimulk.com pour connaître les conditions en vigueur.",
    credits: {
      intro: "Presque toutes les photographies de ce site sont des banques d’images ou relèvent du domaine public, et n’exigent rien en retour. Deux sont sous licence Creative Commons, et cette licence demande à être créditée ici.",
      authorLabel: "Photographe",
      sourceLabel: "Source",
      licenceLabel: "Licence",
      shareAlike: "Cette licence impose le partage à l’identique. La version utilisée ici est recadrée, ce qui en fait une œuvre dérivée : elle est donc publiée sous la même licence, et vous pouvez la réutiliser aux mêmes conditions.",
      rest: "Tout le reste provient de la banque d’images Pexels, du domaine public, ou de photographies fournies par les promoteurs eux-mêmes. Le relevé complet de la provenance de chaque fichier est conservé avec les fichiers.",
    },
  },

  protection: {
    filtersHeading: "Trois filtres, dans cet ordre",
    filters: {
      eligible: { heading: "Éligible", body: "Le bien satisfait-il juridiquement aux règles du programme ? C’est oui ou non, et un non clôt la discussion." },
      sensible: { heading: "Financièrement sensé", body: "Le prix est-il proche de ce que le bien vaut réellement ? Franchir un seuil ne dit rien de la valeur, et un bien acheté pour franchir un seuil est généralement mal acheté." },
      exitReady: { heading: "Prêt à la sortie", body: "Peut-il être loué, et peut-il être vendu à la fin de la période de détention ? Un actif dont on ne peut sortir n’est pas un investissement, c’est un engagement." },
    },
    checksHeading: "Ce que nous vérifions avant que vous investissiez",
    checksIntro: "Vingt questions, posées chaque fois dans le même ordre. Elles sont écrites comme des questions parce qu’elles en sont : chacune a une réponse que nous conservons, faute de quoi le bien ne va pas plus loin.",
    checks: {
      developerRecord: "Qui est le promoteur, et qu’a-t-il livré auparavant ?",
      developerFinances: "Que montrent les comptes et les dépôts du promoteur ?",
      titleDeed: "Le titre est-il libre, et est-il au nom du vendeur ?",
      ownershipHistory: "Qui a possédé ce bien, et quand a-t-il changé de mains ?",
      citizenshipEligibility: "Le bien satisfait-il aux règles d’éligibilité du programme ?",
      gyoStatus: "Le vendeur est-il une foncière cotée (GYO), et cela change-t-il quelque chose ?",
      valuation: "L’évaluation officielle justifie-t-elle le prix demandé ?",
      sellerEligibility: "Le vendeur est-il habilité à vendre à un demandeur de citoyenneté ?",
      buildingPermits: "Les permis de construire sont-ils en règle et à jour ?",
      constructionStage: "Où en est le chantier, et par rapport à quel calendrier ?",
      comparablePrices: "À quels prix des biens comparables se sont-ils réellement vendus ?",
      pricePerSqm: "Comment le prix au mètre carré se situe-t-il dans le quartier ?",
      rentalDemand: "Y a-t-il une demande locative réelle, ou seulement projetée ?",
      rentalYield: "Quel rendement net cette demande permet-elle, charges déduites ?",
      resaleLiquidity: "À quelle vitesse ce type de bien se revend-il sur ce marché ?",
      exitStrategy: "Quelle est la sortie, et de quoi dépend-elle ?",
      hiddenCosts: "Quels coûts ne figurent pas dans le prix affiché ?",
      vatPosition: "Quel est le régime de TVA, et une exonération s’applique-t-elle ?",
      titleDeedCosts: "Combien coûtera réellement le transfert du titre ?",
      deliveryRisk: "Que se passe-t-il en cas de livraison tardive, ou d’absence de livraison ?",
    },
    scoreHeading: "Le score d’investissement Multi Mulk",
    scoreIntro: "Chaque bien que nous recommandons est noté sur cent selon huit facteurs pondérés. Les pondérations sont publiées ici, car un score dont le calcul reste caché est un chiffre, pas une évaluation.",
    scoreCaveat: "Un score est le jugement d’un évaluateur à une date donnée, ni une prévision ni une garantie. Chaque score porte le nom de son auteur et sa date. Demandez-nous le raisonnement derrière tout chiffre.",
    factorLabel: "Critère",
    weightLabel: "Pondération",
    factors: {
      citizenshipSafety: "Sécurité de l’éligibilité",
      developerStrength: "Solidité du promoteur",
      location: "Emplacement",
      priceVsMarket: "Prix face au marché",
      rentalPotential: "Potentiel locatif",
      resaleLiquidity: "Liquidité à la revente",
      capitalAppreciation: "Appréciation du capital",
      deliveryRisk: "Risque de livraison",
    },
  },

  pillars: {
    citizenship: {
      eyebrow: "Citoyenneté par investissement",
      heading: "Une seconde citoyenneté, détenue comme un actif",
      body: "Des programmes qui accordent la pleine citoyenneté en contrepartie d’un investissement éligible. Nous conseillons celui qui convient — et, aussi souvent, celui qui ne convient pas.",
      hubIntro: "Chaque programme ci-dessous est présenté selon les mêmes champs, afin d’être lu en regard des autres plutôt qu’une brochure à la fois. Chaque chiffre porte sa source et la date de sa dernière vérification.",
    },
    goldenVisa: {
      eyebrow: "Visa doré et résidence",
      heading: "La résidence sans le déménagement",
      body: "Des titres de séjour obtenus par investissement — une base, une position fiscale et, dans plusieurs cas, une voie vers la citoyenneté avec le temps.",
      hubIntro: "La résidence diffère de la citoyenneté sur un point décisif : c’est une autorisation de séjour, renouvelable et révocable, et non une nationalité. Le tableau ci-dessous expose ce que chaque programme accorde réellement.",
    },
    realEstate: {
      eyebrow: "Immobilier",
      heading: "Un bien qui travaille comme un investissement",
      body: "Des programmes à İstanbul, sur la côte turque, à Dubaï et dans les Caraïbes — évalués avant d’entrer dans notre portefeuille, non après.",
    },
    protection: {
      eyebrow: "Protection de l’investisseur",
      heading: "Tout bien éligible n’est pas un bon investissement",
      body: "Un bien peut satisfaire au seuil d’un programme et rester un actif médiocre. Voici les vérifications que nous menons avant de présenter quoi que ce soit à un client.",
    },
  },

  compare: {
    eyebrow: "Comparer",
    heading: "Les programmes, côte à côte",
    intro: "Chaque chiffre de ces tableaux est lu dans la même fiche de programme : un seuil ne peut donc pas dire une chose ici et une autre sur la page du programme.",
    factor: "Critère",
    unknownLabel: "Non confirmé",
    noneRequired: "Aucune",
    noAgeLimit: "Sans limite d’âge",
    grantedDirectly: "Accordée directement",
    noRoute: "Aucune voie",
    yes: "Oui",
    no: "Non",
    bestLabel: "Le plus favorable",
    rows: {
      minimumInvestment: "Investissement minimum",
      holdingPeriod: "Durée de détention",
      processingTime: "Délai de traitement",
      visaFree: "Destinations sans visa",
      schengen: "Accès à l’espace Schengen",
      dualCitizenship: "Double nationalité autorisée",
      residencyRequired: "Présence requise dans le pays",
      physicalVisit: "Visite requise",
      dependentChildren: "Enfants à charge jusqu’à",
      parentsIncluded: "Parents pouvant être inclus",
      citizenshipAfter: "Citoyenneté après",
      worldwideTax: "Impose les revenus mondiaux",
    },
  },

  programmes: {
    routes: {
      "real-estate": "Immobilier",
      donation: "Don à un fonds public",
      bonds: "Obligations d’État",
      business: "Investissement en entreprise",
      deposit: "Dépôt bancaire",
      fund: "Fonds d’investissement",
    },
    offeredLabel: "Nous conseillons sur cette voie",
    notOfferedLabel: "Reconnue, mais que nous ne traitons pas",
    routesHeading: "Voies éligibles",
    statusHeading: "Statut du programme",
    status: {
      open: "Ouvert",
      suspended: "Suspendu",
      closed: "Fermé",
      announced: "Annoncé",
    },
    sinceLabel: "Ouvert depuis",
    unreviewed: "Les chiffres de cette page n’ont pas achevé leur revue juridique et ne sont pas publiés. Confirmez chacun d’eux auprès de nous avant d’agir.",
  },

  routes: {
    home: "Accueil",
    about: "À propos",
    team: "Notre équipe",
    contact: "Nous contacter",
    search: "Biens immobiliers",
    knowledge: "Centre de ressources",
    article: "Article",
    development: "Programme immobilier",
    citizenshipHub: "Citoyenneté par investissement",
    citizenshipProgramme: "Programme",
    goldenVisaHub: "Visa doré et résidence",
    goldenVisaProgramme: "Programme",
    realEstateHub: "Immobilier",
    country: "Pays",
    compareIndex: "Comparer les programmes",
    comparison: "Comparaison",
    investorProtection: "Protection de l’investisseur",
    faqIndex: "Demandez à Multi Mulk",
    faq: "Question",
    caseStudies: "Résultats clients",
    caseStudy: "Étude de cas",
    tools: "Outils",
    authors: "Notre équipe",
    author: "Profil",
    legal: "Mentions légales",
  },

  nav: {
    citizenship: "Citoyenneté",
    goldenVisa: "Visa doré",
    realEstate: "Immobilier",
    protection: "Protection",
    knowledge: "Ressources",
    about: "À propos",
  },

  menus: {
    about: {
      heading: "À propos",
      body: "Multi Mulk est un cabinet international de conseil en immobilier et en citoyenneté, spécialisé dans la citoyenneté turque par investissement, qui relie les citoyens du monde à des résidences d’exception en Türkiye et dans les Caraïbes.",
      ourStory: "Notre histoire",
      ourTeam: "Notre équipe",
    },
    realEstate: {
      heading: "Immobilier",
      body: "Des programmes à İstanbul, sur la côte turque et dans les Caraïbes — chacun évalué face à son marché avant d’entrer au portefeuille.",
    },
    citizenship: {
      label: "Citoyenneté par investissement",
      turkiyeRoutes: [
        "Voie immobilière à partir de {investment}",
        "Détention pendant {holding}",
        "Conjoint et enfants de moins de 18 ans inclus",
      ],
    },
    detail: {
      "bosphorus-heights": "165 appartements",
      "marmara-vista": "151 appartements",
      "levent-residences": "420 appartements + 11 maisons de ville",
      "aegean-bay-residences": "88 appartements",
      "antalya-coast": "1 023 appartements répartis sur 3 bâtiments",
      "anatolian-villas": "Villas privées dans des quartiers d’exception",
      "la-sagesse-collection": "94 appartements de premier rang",
      "intercontinental-grenada": "120 chambres dont 30 suites privées",
      "six-senses-la-sagesse": "56 suites avec piscine et 15 villas avec piscine",
      "intercontinental-dominica": "151 chambres et 10 suites privées",
      "park-hyatt-st-kitts": "126 chambres et une marina privée",
      "port-cabrits-marina": "Port d’accueil de 150 postes pour superyachts",
    },
  },

  hero: {
    heading: "Citoyenneté, résidence et investissement mondial",
    body: "Investissez à l’international. Obtenez une résidence. Bâtissez une stratégie de seconde résidence — conseillé par ceux qui vous diront quand un programme ne convient pas.",
    pathsLabel: "Par où souhaitez-vous commencer ?",
    paths: {
      citizenship: "Obtenir la citoyenneté",
      residency: "Obtenir la résidence",
      property: "Investir dans l’immobilier",
    },
    slides: {
      "istanbul-dusk": "Où deux continents se rencontrent",
      "island": "Des programmes caribéens agréés",
      "dubai": "Une résidence de dix ans, renouvelable",
      "advisory": "Le conseil avant le stock",
    },
    showSlide: "Afficher {name}",
    propertyType: "Type de bien",
    bedroom: "Chambres",
    country: "Pays",
    currency: "Devise",
    maximumPrice: "Prix maximum",
  },

  welcome: {
    eyebrow: "Bienvenue chez Multi Mulk",
    heading: "Des solutions globales pour des citoyens du monde",
    body: "Multi Mulk accompagne les familles et les investisseurs internationaux qui souhaitent s’enraciner dans les lieux les plus désirables au monde. La citoyenneté turque par investissement est au cœur de notre métier — des adresses emblématiques d’İstanbul à la côte égéenne — aux côtés de programmes caribéens sélectionnés. Nous accompagnons chaque étape : choix du bien, acquisition et dossier de citoyenneté, depuis nos bureaux en Türkiye, aux Émirats et au Pakistan.",
  },

  video: {
    eyebrow: "Salon IPS Dubaï 2026",
    heading: "Les 14 meilleurs projets d’investissement à İstanbul",
    play: "Lire la vidéo",
  },

  regions: {
    turkiye: { label: "Türkiye" },
    caribbean: { label: "Caraïbes" },
  },

  turkiyeSection: {
    eyebrow: "Immobilier en Türkiye",
    heading: "Vivre la citoyenneté turque",
    body: "Découvrez notre portefeuille de biens en Türkiye : architecture contemporaine, emplacements de premier ordre à İstanbul et sur le littoral, et des résidences éligibles à la citoyenneté par investissement.",
    descriptions: {
      "bosphorus-heights":
        "À Beyoğlu, à deux pas de Galata et des embarcadères, Bosphorus Heights propose 165 résidences ouvertes sur le détroit et la péninsule historique.",
      "marmara-vista":
        "Marmara Vista offre 151 résidences raffinées — studios, une et deux chambres — sur la rive occidentale d’İstanbul, avec des vues panoramiques et sereines sur la mer de Marmara.",
      "levent-residences":
        "Une adresse emblématique à Şişli, à quelques minutes du quartier d’affaires de Levent, avec 420 appartements et 11 maisons de ville d’exception.",
      "aegean-bay-residences":
        "Un refuge surplombant une baie paisible de Bodrum, avec 88 résidences de luxe en studio, une et deux chambres.",
      "antalya-coast":
        "Sur le littoral de Konyaaltı, Antalya Coast réunit 1 023 résidences dans trois bâtiments signature, entre appartements, penthouses et espaces communs.",
      "anatolian-villas":
        "Découvrez nos quatre typologies de villas à Sarıyer, pensées pour ceux qui recherchent l’intimité, l’élégance et un luxe contemporain sur mesure.",
    },
  },

  awards: {
    eyebrow: "Prix et distinctions",
    heading: "Une excellence reconnue",
    captions: {
      beachfront: "Meilleur bien en bord de mer de l’année",
      michelin: "Une Clé Michelin — un séjour très singulier",
      eco: "Meilleur resort écoresponsable de l’année — 2025",
      travel: "Les meilleures destinations 2025",
      newHotels:
        "Les meilleurs nouveaux hôtels d’Amérique du Nord et des Caraïbes",
      luxuryHotels:
        "31 hôtels de luxe exceptionnels ouvrant dans le monde cette année",
    },
  },

  caribbeanSection: {
    heading: "Retraites insulaires des Caraïbes",
    body: "Découvrez notre portefeuille caribéen en pleine expansion — resorts en bord de mer et programmes sous enseigne emblématique, porteurs de valeur à long terme, d’expériences immersives et d’un rayonnement international ; certains projets, agréés par les gouvernements, ouvrent également une voie reconnue vers la citoyenneté par investissement.",
    descriptions: {
      "park-hyatt-st-kitts":
        "Ouvert en 2017, le Park Hyatt St. Kitts propose 126 chambres et suites de luxe au design insulaire, avec de vastes vues sur l’océan et un accès à la marina de Christophe Harbour.",
      "intercontinental-grenada":
        "Ouverture en 2026 : 120 chambres, plus de 30 suites de luxe, une restauration d’exception, des expériences spa et une architecture d’inspiration caribéenne.",
      "intercontinental-dominica":
        "Une retraite luxueuse sur les plages de sable blanc de la Dominique, entre forêt tropicale et mer, au design élégant, avec des vues saisissantes et l’aventure à portée de main.",
      "six-senses-la-sagesse":
        "Sanctuaire de bien-être et de luxe, le Six Senses La Sagesse réunit villas basses, panoramas sur l’océan et une expérience grenadienne intime et culturellement riche.",
      "la-sagesse-collection":
        "96 résidences exclusives sur la baie de La Sagesse, où la beauté naturelle rejoint le luxe : eaux cristallines, sable doré, et pour voisins le Six Senses La Sagesse et l’InterContinental Grenada La Sagesse.",
      "port-cabrits-marina":
        "À Bell Hall, près de Portsmouth, cette destination portuaire de premier plan conjugue quiétude, beauté naturelle et hospitalité de classe mondiale : postes pour superyachts, restauration de luxe et boutiques.",
    },
  },

  destinations: {
    passportAlt:
      "Le passeport délivré par le programme de citoyenneté par investissement — {region}",
    turkiye: {
      label: "Türkiye",
      eyebrow: "İstanbul, Türkiye",
      heading: "Là où deux continents se rencontrent",
      body: "La Türkiye associe l’une des grandes villes du monde à un littoral qui court de la mer Égée à la Méditerranée. İstanbul s’étend à elle seule sur deux continents, et le programme de citoyenneté par investissement fait d’une acquisition immobilière une voie vers un second passeport — une combinaison qu’aucun autre marché n’offre à cette échelle.",
      stats: {
        threshold: "Seuil de citoyenneté",
        months: "Délai de traitement",
        visaFree: "Destinations sans visa",
      },
    },
    caribbean: {
      label: "Caraïbes",
      eyebrow: "Caraïbes",
      heading: "Au cœur des destinations les plus emblématiques des Caraïbes",
      body: "Les Caraïbes accueillent un ensemble grandissant de résidences et de resorts que nous représentons, répartis sur plusieurs îles — dont beaucoup sont adossés à des programmes de citoyenneté par investissement agréés par les gouvernements.",
      stats: {
        years: "ans d’expérience",
        clients: "clients satisfaits",
        properties: "biens vérifiés",
      },
    },
  },

  articlesSection: {
    heading: "Les derniers articles",
    body: "Retrouvez ici l’ensemble des actualités, analyses et ressources utiles. Cet espace réunit articles de fond, communiqués de presse et guides détaillés pour suivre nos projets.",
    categoryLabel: "Catégorie",
  },

  articles: {
    categories: {
      All: "Tout",
      "Press Media": "Presse",
      Blog: "Blog",
    },
    topics: {
      citizenship: "Citoyenneté",
      residency: "Résidence",
      "real-estate": "Immobilier",
      turkiye: "Türkiye",
      news: "Actualités",
    },
    sort: { Newest: "Plus récents", Oldest: "Plus anciens" },
    sortLabel: "Trier les articles",
    empty: "Rien de classé sous « {filter} » pour l’instant.",
    copy: staged<ArticleCopy>({
      "levent-residences-tops-out": {
        title: "Levent Residences atteint sa hauteur définitive et devient la nouvelle adresse phare de Şişli",
        body: [
          "Levent Residences a atteint sa hauteur définitive sur la ligne d’horizon de Şişli, marquant l’achèvement du gros œuvre du programme le plus central de Multi Mulk à İstanbul. Le bouquet final a été observé sur place par l’équipe du projet, l’entreprise générale et les représentants de l’arrondissement, et fait entrer la tour en phase de second œuvre avant la livraison.",
          "L’immeuble domine le quartier d’affaires de Levent avec un accès direct au métro, et ses étages supérieurs embrassent le Bosphore à l’est et la forêt de Belgrad au nord. Les intérieurs sont livrés en trois palettes, l’étage réservé aux résidents — piscine, spa, salle de projection et terrasse paysagère — occupant le socle.",
          "Multi Mulk commercialise les résidences restantes par phases. Les demandes portant sur la tranche en cours sont traitées par le bureau de vente d’İstanbul.",
        ],
      },
      "turkish-citizenship-guide-2026": {
        title: "Guide de la citoyenneté turque par investissement en 2026",
        body: [
          "La voie turque de la citoyenneté par investissement reste l’une des plus directes au monde : l’achat d’un bien éligible, conservé trois ans, ouvre l’accès au passeport turc pour l’acquéreur, son conjoint et ses enfants à charge. Ce guide expose le fonctionnement concret du programme en 2026.",
          "Le seuil immobilier s’établit à 400 000 USD, apprécié sur un rapport d’expertise officiel et non sur le prix du contrat — une distinction qui prend de court les acheteurs calant leur budget au seuil exact. L’expertise doit être établie par un évaluateur agréé, et le titre de propriété porte, dès l’enregistrement, la mention d’engagement de conservation de trois ans.",
          "Les démarches se mènent en parallèle plutôt qu’en série : le transfert de titre, le permis de séjour et le dossier de citoyenneté peuvent avancer de front, ce qui maintient le délai habituel entre quatre et huit mois. La période de conservation court à compter de la date de la mention, non de celle de la demande.",
          "Les programmes de Multi Mulk à İstanbul et sur la côte sont tous valorisés au-dessus du seuil et livrés avec les pièces qu’exige la demande. Notre équipe de conseil accompagne votre avocat jusqu’à l’entretien de remise du passeport.",
        ],
      },
      "aegean-bay-residences-opens": {
        title: "Aegean Bay Residences ouvre au-dessus d’une baie tranquille de Bodrum",
        body: [
          "Aegean Bay Residences a ouvert sur la péninsule de Bodrum, sur un versant exposé au sud dominant une baie qui reste calme hors des semaines d’été. Le programme descend la colline en terrasses basses, de sorte qu’aucune résidence ne donne sur la terrasse d’une autre, et chaque logement conserve une vue dégagée sur l’eau.",
          "L’ensemble comprend un beach club, un appontement pour annexes, deux restaurants et un spa creusé dans la roche au bord de l’eau. Les aménagements paysagers reprennent le maquis existant — olivier, caroubier et lentisque — plutôt que des plantations rapportées, ce qui laisse le site se lire depuis la mer comme un coteau et non comme un complexe hôtelier.",
        ],
      },
      "bodrum-or-antalya": {
        title: "Bodrum ou Antalya ? Choisir sa portion de côte turque",
        body: [
          "Les deux noms reviennent dans presque chaque demande côtière que nous recevons, et ce sont réellement deux propositions différentes. En résumé : Bodrum est une saison, Antalya est une année.",
          "La péninsule de Bodrum est compacte, tournée vers la voile et intensément mondaine de juin à septembre, avec un marché locatif concentré sur ces semaines et une culture de marina qui donne le ton à tout ce qui l’entoure. Les prix au mètre carré y dépassent ceux d’Antalya, et les meilleurs terrains — les baies exposées au nord, ombragées l’après-midi — sont de fait en nombre fini.",
          "Antalya est le marché le plus vaste et le plus régulier. L’aéroport fonctionne toute l’année, la vieille ville abrite une population résidente et non saisonnière, et les montagnes qui ferment la ville gardent des hivers assez doux pour que le taux d’occupation tienne en mi-saison. Pour un acheteur qui met en balance rendement locatif et usage personnel, cet étalement compte davantage que le tarif estival affiché.",
          "Si l’achat est avant tout une résidence de vacances que vous occuperez en août, Bodrum. Si c’est un actif que vous voulez voir travailler douze mois sur douze, Antalya.",
        ],
      },
      "caribbean-routes-for-gulf-investors": {
        title: "Multi Mulk ouvre les voies caribéennes de citoyenneté aux investisseurs du Golfe",
        body: [
          "Multi Mulk a ouvert son portefeuille caribéen aux investisseurs basés dans le Golfe, associant sa pratique de conseil en Türkiye à des projets approuvés à Grenade, à Saint-Christophe-et-Niévès et en Dominique. Cette décision répond à une demande constante de clients titulaires d’un titre de séjour turc, qui souhaitent y adjoindre un second document de voyage peu contraignant.",
          "Les programmes sont des projets approuvés par les États au titre du dispositif de citoyenneté par investissement de chaque île, et comprennent les résidences Six Senses La Sagesse à Grenade et le Park Hyatt St. Kitts à Christophe Harbour. Le programme grenadien offre en outre l’accès au visa E-2 des États-Unis au titre du traité bilatéral.",
          "Les demandes sont déposées par des agents locaux agréés ; le rôle de Multi Mulk porte sur la sélection du bien, le dossier de due diligence et la coordination entre les deux.",
        ],
      },
      "buying-property-in-istanbul": {
        title: "Cinq choses à savoir avant d’acheter un bien à İstanbul",
        body: [
          "İstanbul récompense les acheteurs qui font leurs devoirs et sanctionne ceux qui la traitent comme un marché unique. Cinq points reviennent dans presque chaque transaction que nous accompagnons.",
          "D’abord, la ville n’est pas un marché mais des dizaines. Un prix au mètre carré à Şişli ne vous apprend rien sur Beykoz, et les rives européenne et asiatique suivent des cycles différents. Ensuite, c’est le rapport d’expertise officiel — et non le prix demandé — qui gouverne à la fois le seuil de citoyenneté et les droits de mutation : obtenez-le tôt.",
          "Troisièmement, vérifiez l’iskan, le permis d’occupation. Un immeuble qui en est dépourvu ne peut être légalement occupé et peut se révéler difficile à revendre, aussi fini qu’il paraisse. Quatrièmement, budgétez les frais annexes au prix : droits de mutation, frais de notaire et de traduction, et l’assurance obligatoire contre les séismes.",
          "Cinquièmement, et c’est le moins séduisant : lisez le règlement de copropriété. Les charges des tours dotées de vastes étages d’équipements varient fortement, et c’est le coût récurrent qui surprend le plus souvent les propriétaires étrangers la deuxième année.",
        ],
      },
      "port-cabrits-marina": {
        title: "Port Cabrits Marina impose un nouveau standard au yachting caribéen",
        body: [
          "Port Cabrits, sur la côte nord-ouest de la Dominique, a été décrit comme le projet de marina le plus important des Caraïbes orientales depuis dix ans. Les postes en eau profonde accueillent des navires jusqu’à 90 mètres, et le port se tient à l’abri du promontoire des Cabrits, ce qui le rend praticable malgré la houle d’hiver.",
          "Au-dessus du front de mer, l’InterContinental Dominica Cabrits Resort & Spa fournit les infrastructures à terre — village de marina, avitaillement, dédouanement et logement des équipages — qui manquaient historiquement à la région hors d’Antigua et de Saint-Martin.",
        ],
      },
      "christophe-harbour-rising": {
        title: "Le Park Hyatt St. Kitts et l’essor de Christophe Harbour",
        body: [
          "Christophe Harbour occupe la péninsule sud-est de Saint-Christophe, une étendue de salines et de collines sèches pratiquement vide il y a dix ans, qui accueille aujourd’hui une marina pour superyachts, un beach club et le Park Hyatt St. Kitts.",
          "L’hôtel se tient sur Banana Bay, Niévès en face du détroit, et ses résidences figurent parmi les biens éligibles au programme de citoyenneté de Saint-Christophe-et-Niévès — le plus ancien au monde, en vigueur depuis 1984.",
        ],
      },
      "six-senses-la-sagesse-michelin-key": {
        title: "Un paradis à découvrir : pourquoi Six Senses La Sagesse, à Grenade, est une escapade distinguée d’une Clé MICHELIN",
        body: [
          "Six Senses La Sagesse a reçu une Clé MICHELIN, la distinction du guide pour les hôtels offrant un séjour exceptionnel. C’est la première adresse de la marque dans les Caraïbes, déployée sur deux plages de la côte sud-est de Grenade.",
          "Le complexe est bâti autour des ruines d’une ancienne maison de maître, avec 56 suites et 15 villas résidentielles disposées le long du rivage de la baie de La Sagesse et de Chemin Bay. Le programme de bien-être Six Senses se déploie depuis un spa et un earth lab installés en retrait sous les palmiers, et la cuisine s’approvisionne auprès des producteurs de l’île et des bateaux de pêche de la baie.",
          "Les villas sont éligibles au programme grenadien de citoyenneté par investissement, qui ouvre l’accès au visa E-2 des États-Unis au titre du traité bilatéral.",
        ],
      },
      "marmara-vista-presentation-istanbul": {
        title: "Présentation du complexe résidentiel Marmara Vista à İstanbul",
        body: [
          "Multi Mulk a présenté Marmara Vista à des invités, partenaires et journalistes à İstanbul, dévoilant le plan-masse et la première tranche de résidences sur le rivage de la mer de Marmara.",
          "La présentation a exposé les trois phases du programme, l’offre d’équipements et le calendrier de livraison, ainsi que la voie de citoyenneté par investissement ouverte aux acquéreurs étrangers. Les participants ont visité l’appartement témoin et découvert la palette de matériaux retenue pour la première phase.",
        ],
      },
      "marmara-vista-launch": {
        title: "Lancement prestigieux de Marmara Vista, İstanbul",
        body: [
          "Marmara Vista est lancé sur la mer de Marmara avec 240 résidences réparties en trois bâtiments bas, chacun orienté pour offrir une vue sur la mer depuis les pièces principales. C’est la plus importante mise sur le marché de Multi Mulk à İstanbul à ce jour.",
          "Le programme est livré avec une plage privée, une allocation d’anneaux de port pour les résidents, un spa et une école inscrite au plan-masse. Toutes les résidences sont proposées au-dessus du seuil de la citoyenneté par investissement.",
        ],
      },
      "istanbul-portfolio-expansion": {
        title: "Multi Mulk étoffe son portefeuille à İstanbul",
        body: [
          "Multi Mulk a ajouté trois programmes à son portefeuille stambouliote, portant à huit le nombre de projets en cours dans la ville et étendant sa couverture du corridor du Bosphore au rivage de la mer de Marmara.",
          "Cette expansion fait suite à une demande soutenue des acheteurs du Golfe et d’Asie centrale, pour qui İstanbul continue d’associer une voie vers la citoyenneté à un marché locatif domestique qui fonctionne — une combinaison que peu de programmes offrent.",
        ],
      },
    }),
  },

  footer: {
    columns: {
      turkiye: "Türkiye",
      caribbean: "Caraïbes",
      services: "Nos services",
      resources: "Ressources",
      about: "À propos",
    },
    aboutItems: {
      ourStory: "Notre histoire",
      ourTeam: "Notre équipe",
      turkishCitizenship: "Citoyenneté turque",
      caribbeanCbi: "Citoyenneté caribéenne",
      mediaCentre: "Espace presse",
      construction: "Avancement des chantiers",
      terms: "Conditions générales",
      privacy: "Politique de confidentialité",
      imageCredits: "Crédits photographiques",
    },
    contactTitle: "Nous contacter",
    addresses: {
      UAE: "Grosvenor Business Tower, Bureau 1909, Al Thanyah First, Barsha Heights, Dubaï",
      "Türkiye": "Burc Plaza, Gökevler Mah. 2312 Sk. Blok No:18J, Kat:5, Bureau 48-49, Beykent / Istanbul",
      Pakistan: "13 Sher Shah Block, Garden Town, Lahore, Pakistan",
    },
    copyright: "© 2026 Multi Mulk. Tous droits réservés.",
    offices: { UAE: "Émirats", Türkiye: "Türkiye", Pakistan: "Pakistan" },
  },

  whatsapp: {
    label: "Bonjour !",
    message:
      "Bonjour Multi Mulk, je souhaite en savoir plus sur vos biens immobiliers.",
    aria: "Discuter avec Multi Mulk sur WhatsApp",
  },

  about: {
    hero: {
      heading: "Bâtir un héritage d’une distinction sans égale",
      body: "Notre travail commence par ceux que nous représentons. Multi Mulk réunit spécialistes de l’immobilier, conseillers en citoyenneté et juristes afin qu’une acquisition à İstanbul ou sur une baie caribéenne soit traitée comme une décision réfléchie — et non comme une succession de démarches éparses.",
    },
    intro: {
      heading: "Redéfinir le luxe, une destination à la fois",
      paragraphs: [
        "Multi Mulk est un cabinet international de conseil en immobilier et en citoyenneté, présent sur deux des marchés les plus attractifs pour les citoyens du monde. En Türkiye, nous représentons des résidences d’exception sur les deux rives d’İstanbul ainsi que sur les côtes égéenne et méditerranéenne, chacune évaluée au regard du seuil de 400 000 USD qui ouvre le programme turc de citoyenneté par investissement.",
        "Dans les Caraïbes, nous travaillons avec des programmes agréés par les gouvernements de Grenade, de la Dominique et de Saint-Christophe-et-Niévès — parmi lesquels Six Senses La Sagesse, InterContinental Grenada – La Sagesse et Park Hyatt St. Kitts — où un seul investissement ouvre à la fois une résidence et un second passeport. Nos bureaux en Türkiye, aux Émirats et au Pakistan gardent nos clients au plus près de l’équipe qui suit leur dossier.",
      ],
      stats: {
        experience: "ans d’expérience",
        clients: "clients satisfaits",
        properties: "biens vérifiés",
      },
      imageAlt: "Résidences en front de mer du portefeuille Multi Mulk",
    },
    regions: {
      turkiye: {
        label: "Türkiye",
        body: "Un pays où deux continents se rejoignent et où le littoral court du Bosphore à la Méditerranée. Nos programmes turcs associent adresses urbaines centrales et baies côtières paisibles — avec une voie directe, garantie par l’État, vers la citoyenneté.",
        imageAlt: "Résidences d’İstanbul surplombant le Bosphore",
      },
      caribbean: {
        label: "Caraïbes",
        body: "Un monde d’eaux calmes, d’horizons doux et de beauté sans hâte. Nos destinations caribéennes cultivent l’essence de la vie insulaire : des retraites pensées où la nature, l’architecture et le bien-être s’équilibrent parfaitement.",
        imageAlt: "Une baie caribéenne du portefeuille Multi Mulk",
      },
    },
    principles: {
      heading: "Les principes qui guident tout ce que nous bâtissons",
      items: {
        craftsmanship: {
          title: "Un savoir-faire qui définit le luxe",
          body: "Les résidences que nous représentons répondent à la précision et à l’art que l’on trouve dans l’immobilier le plus exclusif au monde. Des intérieurs sur mesure aux espaces extérieurs immersifs, nous recherchons un niveau de détail sans concession — celui qui se lit encore comme réfléchi dix ans après la livraison.",
        },
        advice: {
          title: "Le conseil avant le catalogue",
          body: "Une seconde citoyenneté est un engagement juridique avant d’être un achat. Nous exposons les seuils, les durées de détention et les délais en termes clairs, et nous disons quand un projet ne convient pas. Nos clients sont accompagnés par une seule équipe, de la sélection à l’acquisition puis au dépôt du dossier.",
        },
        lifestyle: {
          title: "Des expériences centrées sur l’art de vivre",
          body: "Au-delà des biens, nous recherchons des destinations de vie — des quartiers connectés d’İstanbul aux enclaves sereines en bord d’eau et aux retraites de bien-être — choisies selon la manière dont on aspire à vivre. Le lien, l’intimité et le bien-être sont ce qui conserve sa valeur longtemps après la signature.",
        },
      },
    },
    developments: {
      heading: "Nos derniers programmes",
      body: "Découvrez nos nouveaux programmes résidentiels et hôteliers en Türkiye et dans les Caraïbes, conçus pour offrir un art de vivre raffiné, une valeur durable et des expériences d’exception.",
      cards: {
        "bosphorus-heights":
          "165 résidences à Beyoğlu, ouvertes sur le détroit et la péninsule historique.",
        "aegean-bay-residences":
          "Un refuge surplombant une baie paisible de Bodrum, avec 88 résidences en studio, une et deux chambres.",
        "la-sagesse-collection":
          "Une sélection limitée de 94 appartements de premier rang en bordure d’une plage privée grenadienne, aux côtés du Six Senses La Sagesse.",
      },
      actions: {
        turkiye: "Découvrir les biens en Türkiye",
        caribbean: "Découvrir les biens aux Caraïbes",
      },
    },
    leadership: {
      heading: "Diriger avec expertise et vision",
      body: "Au cœur de notre travail se trouve une équipe de spécialistes de l’immobilier, de conseillers en citoyenneté et de juristes répartie sur trois bureaux. Chaque dossier est mené de bout en bout par l’équipe la plus proche du client : celui qui répond à la première question est celui qui mène la demande à son terme.",
      portraitAlt: "{name}, {title} chez Multi Mulk",
      roles: {
        "sajid-ali-haydar": "Directeur général",
        "nader-djebbi": "Directeur du développement",
      },
    },
    map: {
      heading:
        "Des littoraux aux îles, notre travail se concentre sur des environnements qui rendent la vie plus calme et mieux reliée.",
      body: "En Türkiye comme dans les Caraïbes, nous privilégions des lieux façonnés par ce qui les entoure — conçus avec clarté, confort et un vrai sentiment d’appartenance. Chaque programme que nous représentons traduit le même engagement : une architecture pensée, un cadre naturel et un art de vivre à la fois simple et sincère.",
      imageAlt: "Vue aérienne d’une destination Multi Mulk",
    },
    places: {
      istanbul: {
        title: "İstanbul",
        caption: "Là où deux continents se rencontrent",
      },
      bodrum: { title: "Bodrum", caption: "La côte égéenne" },
      antalya: { title: "Antalya", caption: "La côte turquoise" },
      grenada: { title: "Grenade", caption: "Baie de La Sagesse" },
    },
  },

  citizenship: {
    eyebrow: "Citoyenneté par investissement",
    anchors: {
      introduction: "Introduction",
      benefits: "Avantages",
      gallery: "Galerie",
      projects: "Programmes",
      process: "Comment ça marche",
      industry: "Le secteur",
      about: "À propos de Multi Mulk",
      faq: "FAQ",
    },
    browseAll: "Voir les résidences éligibles",
    onThisPage: "Sur cette page",
    cta: {
      heading: "Votre prochaine étape commence ici",
      body: "Parlez à notre équipe de votre éligibilité, des délais et des résidences qui ouvrent droit au programme. Nous vous dirons franchement si le programme correspond à ce que vous cherchez à obtenir.",
      button: "Nous consulter",
    },

    industry: {
      eyebrow: "Le secteur",
      heading: "Le secteur de la migration par investissement",
      body: "La citoyenneté par investissement n’est pas une idée récente. Le premier programme a ouvert en 1984, et quatre décennies de législation, de contrôle et de réformes en ont fait une classe d’actifs établie plutôt qu’une curiosité.",
      marketLabel: "Valeur du marché mondial",
      growthLabel: "Croissance annuelle",
      timelineHeading: "Les programmes, dans l’ordre de leur ouverture",
      thisProgramme: "Ce programme",
    },

    about: {
      eyebrow: "À propos de Multi Mulk",
      heading: "Votre partenaire pour une seconde citoyenneté",
      body: "Multi Mulk réunit sous un même toit des spécialistes de l’immobilier, des conseillers en citoyenneté et des juristes, dans ses bureaux en Türkiye, aux Émirats et au Pakistan. Nous représentons nous-mêmes les programmes immobiliers plutôt que de les placer à distance, ce qui nous permet d’être précis sur ce que vaut une résidence, sur ce qu’exige un programme, et sur le moment où ni l’un ni l’autre ne convient. Chaque chiffre que nous avançons est confirmé par écrit avant tout engagement de votre part.",
      link: "En savoir plus sur nous",
    },

    turkiye: {
      hero: {
        heading: "Citoyenneté turque par investissement",
        body: "Un seul achat immobilier éligible conduit à la citoyenneté pour vous, votre conjoint et vos enfants de moins de 18 ans — sans obligation de résider en Türkiye, ni avant ni après.",
      },
      intro: {
        eyebrow: "Introduction",
        heading: "La citoyenneté par un bien qui vous appartient",
        paragraphs: [
          "La Türkiye est le seul grand programme à transformer un simple achat immobilier en citoyenneté pleine et entière. Rien n’est donné, rien n’est abandonné : vous achetez une résidence au seuil de 400 000 USD ou au-dessus, vous la conservez trois ans, et l’investissement reste le vôtre — revendable ensuite — tandis que la citoyenneté demeure acquise à votre famille pour la vie.",
          "Multi Mulk représente des programmes immobiliers sur les deux rives d’İstanbul ainsi que sur les côtes égéenne et méditerranéenne, chacun mesuré à ce seuil avant d’entrer dans notre portefeuille. Spécialistes de l’immobilier, conseillers en citoyenneté et juristes travaillent en une seule équipe : la personne qui répond à votre première question est celle qui mène le dossier jusqu’au passeport.",
        ],
      },
      stats: {
        investment: "Investissement immobilier minimum",
        timeline: "Délai de traitement",
        visaFree: "Destinations sans visa",
        holding: "Ans de détention",
      },
      benefits: {
        eyebrow: "Avantages du programme",
        heading: "Ce qu’ouvre la citoyenneté turque",
        body: "Ici, la citoyenneté est un actif qui travaille plutôt qu’un document rangé dans un tiroir : mobilité, ancrage entre l’Europe et l’Asie, et un bien qui continue de rapporter.",
        items: {
          citizenship: {
            title: "Une citoyenneté à vie, et pour votre famille",
            body: "La citoyenneté turque est accordée à vie et se transmet à vos descendants. Une seule demande vous couvre, vous, votre conjoint et vos enfants de moins de 18 ans, et les enfants nés ensuite sont turcs de naissance. La Türkiye autorise la double nationalité : rien n’a à être abandonné pour l’obtenir.",
          },
          mobility: {
            title: "Une mobilité entre l’Europe et l’Asie",
            body: "Le passeport turc ouvre l’accès sans visa ou avec visa à l’arrivée à plus de 110 destinations, et le traité entre la Türkiye et les États-Unis donne à ses citoyens une voie vers le visa investisseur E-2 que la plupart des programmes ne peuvent offrir. Les deux aéroports d’İstanbul placent une grande partie de l’Europe, du Golfe et de l’Asie centrale à quelques heures.",
          },
          assets: {
            title: "Une résidence qui continue de travailler",
            body: "Le seuil se franchit en achetant, non en donnant. Vous devenez propriétaire d’une résidence réelle sur un marché réel — que vous pouvez habiter, louer ou transmettre — et une fois les trois ans de détention écoulés, elle peut être revendue à sa valeur de marché.",
          },
          process: {
            title: "Une procédure rapide et codifiée",
            body: "Le programme est inscrit dans le droit turc plutôt qu’accordé au cas par cas, et se déroule en trois à six mois entre l’expertise et le passeport. Il n’y a ni entretien, ni test de langue, ni obligation de résider en Türkiye à un quelconque moment.",
          },
        },
      },
      gallery: {
        eyebrow: "Galerie",
        heading: "Là où deux continents se rencontrent",
        body: "İstanbul sur ses deux rives, l’Égée à Bodrum, la Méditerranée à Antalya — les décors des résidences éligibles.",
      },
      signature: {
        heading: "Un investissement CBI de premier plan sur deux rives",
        body: "La Türkiye est le seul grand programme où le seuil se franchit en devenant propriétaire plutôt qu’en donnant, sur un marché assez profond pour y revendre. İstanbul s’étend sur deux continents à une fraction du prix des capitales européennes comparables, et la côte va de l’Égée à la Méditerranée — c’est pourquoi un achat éligible se juge ici sur ses propres mérites avant même que le passeport n’entre en ligne de compte.",
        button: "Se renseigner sur la CBI turque",
      },
      enquire: {
        heading: "Assurez votre mobilité mondiale grâce au programme CBI de la Türkiye",
        body: "Dites-nous ce que vous cherchez à obtenir et nous reviendrons vers vous avec les résidences éligibles, le coût total au-delà du prix d’achat, et un calendrier réaliste.",
      },
      projects: {
        heading: "Les programmes éligibles",
        body: "Chaque résidence ci-dessous atteint ou dépasse le seuil de 400 000 USD aux valorisations actuelles. Les stocks partent vite à ce niveau : les montants sont confirmés sur le rapport d’expertise officiel avant tout engagement.",
      },
      process: {
        eyebrow: "Comment ça marche",
        heading: "Du premier échange au passeport",
        body: "Cinq étapes, menées par une seule équipe. La plupart des familles bouclent le parcours en trois à six mois sans jamais se rendre en Türkiye.",
        steps: {
          consultation: {
            title: "Consultation",
            body: "Nous exposons le seuil, la durée de détention, les frais au-delà du prix d’achat et un calendrier réaliste — et nous le disons lorsque le programme ne correspond pas à ce que vous cherchez à obtenir.",
          },
          selection: {
            title: "Sélection du bien",
            body: "Nous présélectionnons les résidences qui franchissent le seuil sur leur expertise officielle plutôt que sur leur prix affiché, et organisons les visites sur place ou à distance.",
          },
          purchase: {
            title: "Achat et titre de propriété",
            body: "Votre avocat réalise le transfert sous procuration si vous préférez ne pas voyager. Le titre est enregistré avec la mention d’incessibilité de trois ans qu’exige le programme.",
          },
          application: {
            title: "Demande de citoyenneté",
            body: "Nous déposons ensemble le certificat de conformité, le permis de séjour et la demande de citoyenneté, les pièces de due diligence étant préparées en amont pour que rien ne bloque au guichet.",
          },
          passport: {
            title: "Approbation et passeport",
            body: "À l’approbation, les passeports sont délivrés pour vous et chaque membre de la famille inscrit à la demande. Votre bien reste le vôtre tout du long, et devient librement cessible une fois les trois ans écoulés.",
          },
        },
      },
      faq: {
        heading: "Questions fréquentes",
        items: {
          what: {
            question: "Qu’est-ce que le programme turc de citoyenneté par investissement ?",
            answer:
              "Une voie inscrite dans le droit turc qui accorde la citoyenneté pleine et entière aux ressortissants étrangers achetant un bien en Türkiye pour 400 000 USD ou plus et le conservant trois ans. Contrairement à un programme fondé sur le don, l’investissement est un actif que vous possédez et pouvez revendre à l’issue de la période de détention, tandis que la citoyenneté, elle, est définitive.",
          },
          options: {
            question: "Quelles options d’investissement sont éligibles ?",
            answer:
              "L’immobilier est la voie que choisissent la plupart de nos clients, à partir de 400 000 USD confirmés par un rapport d’expertise officiel. Le droit turc reconnaît également un dépôt bancaire, un achat d’obligations d’État ou un apport en capital de 500 000 USD, détenus trois ans chacun. Seule la voie immobilière vous laisse un actif exploitable sur un marché que vous avez choisi.",
          },
          timeline: {
            question: "Combien de temps la procédure prend-elle ?",
            answer:
              "Trois à six mois entre l’achat et le passeport pour un dossier ordinaire. Le transfert de titre lui-même prend quelques jours ; l’essentiel du délai tient au certificat de conformité et à la demande de citoyenneté. Les dossiers s’enlisent quand les pièces sont incomplètes, raison pour laquelle nous préparons la due diligence avant l’achat et non après.",
          },
          family: {
            question: "Qui peut être inclus dans la demande ?",
            answer:
              "Vous, votre conjoint et vos enfants de moins de 18 ans êtes couverts par une seule demande et un seul seuil. Les enfants majeurs doivent déposer une demande sur leur propre investissement. Tout enfant né après l’octroi de la citoyenneté est turc de naissance.",
          },
          residency: {
            question: "Dois-je vivre en Türkiye ou m’y rendre ?",
            answer:
              "Non. Il n’y a aucune obligation de résidence avant ou après la citoyenneté, aucune durée de séjour minimale pour la conserver, ni entretien ni test de langue. L’achat lui-même peut être conclu par votre avocat sous procuration : tout le parcours peut se dérouler sans quitter votre domicile.",
          },
          benefits: {
            question: "Que m’apporte un passeport turc ?",
            answer:
              "Un accès sans visa ou avec visa à l’arrivée à plus de 110 destinations, le droit de vivre, travailler et étudier en Türkiye, et l’éligibilité au visa investisseur E-2 américain au titre du traité turco-américain. La Türkiye admet la double nationalité : vous conservez la vôtre.",
          },
          dueDiligence: {
            question: "Quelles vérifications sont menées sur les candidats ?",
            answer:
              "Les candidats sont contrôlés sur leur casier judiciaire, les listes de sanctions et l’origine des fonds investis. Le standard est réel et des demandes sont refusées : c’est ce qui maintient la crédibilité du programme auprès des banques et des services frontaliers qui comptent. Nous signalons en amont tout élément susceptible de poser difficulté.",
          },
          resale: {
            question: "Puis-je revendre le bien ensuite ?",
            answer:
              "Oui. Le titre porte une mention d’incessibilité de trois ans ; une fois échue, la résidence est libre d’être vendue, louée ou conservée, à sa valeur de marché. La vente n’affecte la citoyenneté d’aucune personne inscrite à la demande : elle est accordée à vie.",
          },
        },
      },
    },

    caribbean: {
      hero: {
        heading: "Citoyenneté caribéenne par investissement",
        body: "Grenade, la Dominique et Saint-Christophe-et-Niévès administrent trois des programmes les plus anciens au monde — chacun avec une voie approuvée par l’État passant par les complexes que nous représentons.",
      },
      intro: {
        eyebrow: "Introduction",
        heading: "Trois programmes, un portefeuille approuvé",
        paragraphs: [
          "La Caraïbe a inventé la citoyenneté par investissement. Saint-Christophe-et-Niévès a ouvert le premier programme en 1984, la Dominique a suivi en 1993 : c’est pourquoi ces passeports sont reconnus aux frontières et par les banques comme ne le sont pas des programmes plus récents. Chaque île applique sa propre législation, ses propres seuils et sa propre liste de projets approuvés.",
          "Multi Mulk ne travaille qu’avec des projets approuvés par les États — parmi eux Six Senses La Sagesse et InterContinental Grenada – La Sagesse, l’InterContinental Dominica Cabrits Resort & Spa et le Park Hyatt St. Kitts. Un même investissement porte à la fois une part dans un actif hôtelier de marque et un second passeport pour la famille. Grenade mérite d’être signalée : c’est le seul programme caribéen lié aux États-Unis par un traité.",
        ],
      },
      stats: {
        investment: "Investissement immobilier minimum",
        timeline: "Délai de traitement",
        visaFree: "Destinations sans visa",
        holding: "Ans de détention",
      },
      benefits: {
        eyebrow: "Avantages du programme",
        heading: "Votre héritage, augmenté",
        body: "Un passeport caribéen est à la fois une couverture et un actif : une mobilité qui ne dépend d’aucun gouvernement en particulier, doublée d’une part dans un complexe qui continue d’exploiter.",
        items: {
          citizenship: {
            title: "Une citoyenneté à vie, sur plusieurs générations",
            body: "La citoyenneté caribéenne est accordée à vie et se transmet à vos descendants. Selon l’île, une seule demande peut couvrir votre conjoint, vos enfants et vos parents ou grands-parents à charge — ce qui en fait un actif patrimonial plutôt qu’un simple document de voyage.",
          },
          mobility: {
            title: "L’accès à plus de 140 destinations",
            body: "Ces passeports donnent un accès sans visa ou avec visa à l’arrivée à plus de 140 destinations, dont l’espace Schengen, le Royaume-Uni, Singapour et Hong Kong. Grenade y ajoute un traité avec les États-Unis, le seul programme caribéen à en détenir un.",
          },
          assets: {
            title: "Une part dans des complexes de marque",
            body: "Les projets approuvés ne sont pas des coquilles vides. Ils sont exploités par Six Senses, InterContinental et Park Hyatt : un actif avec un rendement locatif, un marché de revente et un nom reconnu bien au-delà de l’île où il se trouve.",
          },
          process: {
            title: "Les programmes les plus anciens",
            body: "Saint-Christophe-et-Niévès administre son programme depuis 1984 et la Dominique depuis 1993. Quatre décennies de législation, de contrôle international et de cabinets de due diligence indépendants expliquent que ces passeports passent encore des vérifications où des programmes plus récents achoppent.",
          },
        },
      },
      gallery: {
        eyebrow: "Galerie",
        heading: "Des îles, et ce qui y a été bâti",
        body: "La baie de La Sagesse à Grenade, les Cabrits en Dominique, Christophe Harbour à Saint-Christophe — les projets approuvés, tels qu’ils se présentent.",
      },
      signature: {
        heading: "Un investissement CBI de premier plan sur trois îles",
        body: "Les projets approuvés ici sont exploités par Six Senses, InterContinental et Park Hyatt — des noms qui emportent avec eux un marché locatif et un marché de revente. Grenade, la Dominique et Saint-Christophe appliquent chacune leur propre législation et leurs propres seuils : la première question n’est donc jamais quel lot, mais quelle île, et nous la tranchons avant de vous montrer quoi que ce soit.",
        button: "Se renseigner sur la CBI caribéenne",
      },
      enquire: {
        heading: "Assurez votre mobilité mondiale grâce aux programmes CBI caribéens",
        body: "Dites-nous ce que vous cherchez à obtenir et nous reviendrons vers vous avec l’île qui convient, les projets qui y sont approuvés, et un calendrier réaliste.",
      },
      projects: {
        heading: "Projets approuvés par les États",
        body: "Chaque projet ci-dessous est approuvé au titre du programme de son île. Les seuils et les disponibilités varient selon le projet et évoluent avec la législation : nous confirmons les deux par écrit avant tout engagement.",
      },
      process: {
        eyebrow: "Comment ça marche",
        heading: "Du premier échange au passeport",
        body: "Cinq étapes, menées par une seule équipe. Aucune île n’exige de vous déplacer, et la plupart des familles bouclent le parcours en trois à six mois.",
        steps: {
          consultation: {
            title: "Consultation",
            body: "Grenade, la Dominique et Saint-Christophe diffèrent sur les seuils, sur la définition d’une personne à charge et sur ce que le passeport ouvre. Nous déterminons laquelle des trois convient réellement à votre famille avant d’examiner le moindre bien.",
          },
          selection: {
            title: "Sélection du projet",
            body: "Nous présélectionnons des lots au sein des projets approuvés de l’île retenue, et exposons ce que chacun implique en rendement locatif et en revente — pas seulement en éligibilité.",
          },
          purchase: {
            title: "Réservation et séquestre",
            body: "Les fonds sont déposés auprès de l’agent de séquestre désigné plutôt que versés directement au promoteur, et libérés au fil des jalons de construction. Votre contrat d’acquisition peut être signé sous procuration si vous préférez ne pas voyager.",
          },
          application: {
            title: "Demande et due diligence",
            body: "Un agent agréé dépose la demande auprès de l’unité de citoyenneté de l’île. Des cabinets internationaux indépendants mènent ensuite les vérifications d’antécédents et d’origine des fonds : c’est cette étape qui fixe le calendrier.",
          },
          passport: {
            title: "Approbation et passeport",
            body: "À l’approbation, vous prêtez serment — à distance, dans une ambassade ou sur l’île — et les passeports sont délivrés à toutes les personnes inscrites à la demande. La part dans le complexe reste la vôtre et peut être cédée à l’issue de la période de détention.",
          },
        },
      },
      faq: {
        heading: "Questions fréquentes",
        items: {
          what: {
            question: "Qu’est-ce que la citoyenneté caribéenne par investissement ?",
            answer:
              "Grenade, la Dominique et Saint-Christophe-et-Niévès administrent chacune un programme, inscrit dans leur propre droit, accordant la citoyenneté aux ressortissants étrangers qui réalisent une contribution économique approuvée — un don à un fonds national ou un investissement dans un projet immobilier approuvé par l’État. Saint-Christophe a ouvert le premier de ces programmes en 1984 : ce sont les voies les plus anciennes et les plus contrôlées du secteur.",
          },
          options: {
            question: "Quelles options d’investissement existent ?",
            answer:
              "Chaque île propose deux voies : un don non remboursable à un fonds national de développement, moins coûteux mais sans contrepartie, et un investissement dans un projet immobilier approuvé à partir d’environ 200 000 USD. La voie immobilière coûte davantage au départ et vous laisse un actif cessible après la période de détention. Multi Mulk travaille sur la voie immobilière.",
          },
          timeline: {
            question: "Combien de temps la procédure prend-elle ?",
            answer:
              "Trois à six mois pour un dossier ordinaire, du dépôt au passeport. C’est la due diligence qui donne le rythme, non la paperasse : c’est pourquoi nous réunissons les justificatifs d’origine des fonds avant le dépôt plutôt qu’en réponse à une question.",
          },
          family: {
            question: "Qui peut être inclus dans la demande ?",
            answer:
              "Votre conjoint et vos enfants à charge sont couverts sur chaque île, et selon le programme vous pouvez aussi inclure parents ou grands-parents à charge, ainsi que des frères et sœurs célibataires à charge. Les règles diffèrent entre Grenade, la Dominique et Saint-Christophe, et c’est souvent ce qui décide du programme qu’une famille devrait choisir.",
          },
          residency: {
            question: "Dois-je me rendre ou vivre dans la Caraïbe ?",
            answer:
              "Non. Aucun des trois programmes n’exige de résidence, de durée de séjour minimale, d’entretien ni de test de langue, et la procédure peut se dérouler entièrement à distance. Grenade n’impose aucune visite ; les autres peuvent faire prêter serment dans une ambassade ou un consulat.",
          },
          benefits: {
            question: "Que m’apportent ces passeports ?",
            answer:
              "Un accès sans visa ou avec visa à l’arrivée à plus de 140 destinations, dont l’espace Schengen, le Royaume-Uni, Singapour et Hong Kong ; une citoyenneté à vie qui se transmet à vos descendants ; et aucune imposition sur les revenus mondiaux, les plus-values ou les successions dans les trois pays. Grenade rend en outre ses ressortissants éligibles au visa investisseur E-2 américain.",
          },
          dueDiligence: {
            question: "Quelles vérifications sont menées sur les candidats ?",
            answer:
              "Chaque gouvernement mandate des cabinets internationaux de due diligence indépendants pour vérifier l’identité, le casier judiciaire, l’exposition aux sanctions et l’origine des fonds, en sus de l’examen mené par son unité de citoyenneté. Le standard s’est nettement resserré sous la pression de l’Union européenne et des États-Unis, et des demandes sont refusées. Nous évaluons honnêtement un dossier avant que vous n’engagiez la moindre dépense.",
          },
          resale: {
            question: "Puis-je revendre le bien ensuite ?",
            answer:
              "Oui, une fois la période de détention écoulée — cinq ans en général, mais cela varie selon l’île et selon que votre acheteur demande lui-même la citoyenneté. Beaucoup de projets approuvés versent en outre un rendement locatif pendant la période de détention. La vente est sans effet sur votre citoyenneté, accordée à vie.",
          },
        },
      },
    },
  },

  media: {
    heroEyebrow: "Espace presse",
    showArticle: "Afficher « {title} »",
    indexHeading: "Tous les articles",
    indexBody:
      "Retrouvez ici l’ensemble des actualités, analyses et ressources utiles. Cet espace réunit articles de fond, communiqués de presse et guides détaillés pour suivre nos projets.",
    newsletter: {
      heading: "Aller plus loin, rester informé",
      body: "Ne manquez aucune actualité — suivez chaque étape avec nous.",
      cta: "Nous consulter",
    },
    article: {
      categoryLabel: "Catégorie :",
      publishedLabel: "Publié le :",
      sourceLabel: "Source :",
      relatedHeading: "Articles liés",
      readingTime: plural({
        one: "{count} min de lecture",
        other: "{count} min de lecture",
      }),
    },
  },

  search: {
    heading: "Votre prochaine adresse commence ici",
    body: "Parcourez des résidences avec accès resort, vues dégagées et art de vivre balnéaire — adaptées à votre recherche. Explorez une sélection de biens en bord de mer aux Émirats et dans les Caraïbes, filtrés selon vos critères.",
    panelHeading: "Trouver les plus belles résidences",
    showing: plural({
      one: "{count} bien affiché",
      other: "{count} biens affichés",
    }),
    searchLabel: "Recherche",
    searchPlaceholder: "Nom de la résidence",
    propertyType: "Type de bien",
    bedroom: "Chambres",
    currency: "Devise",
    location: "Localisation",
    cbiOnly: "Éligibles à la citoyenneté uniquement",
    cbiHint:
      "À partir de {amount} USD — seuil immobilier du programme turc de citoyenneté",
    noResults: "Aucune résidence ne correspond à ces filtres",
  },

  unit: {
    citizenshipEligible: "Éligible à la citoyenneté",
    soldOut: "Vendu",
    enquirySubject: "Demande concernant {unit}, {place}",
    types: {
      Apartment: "Appartement",
      Townhouse: "Maison de ville",
      Villa: "Villa",
    },
    studio: "Studio",
    bedrooms: plural({ one: "{count} chambre", other: "{count} chambres" }),
    bathrooms: plural({
      one: "{count} salle de bain",
      other: "{count} salles de bain",
    }),
    layouts: {
      Simplex: "Simplex",
      Duplex: "Duplex",
      "Townhouse + Maid": "Maison de ville + chambre de service",
    },
    sqft: "pi²",
    level: "Niveaux {range}",
    levels: {
      "Ground Floor": "Rez-de-chaussée",
      "First Floor": "Premier étage",
      "East Wing": "Aile est",
      "West Wing": "Aile ouest",
      "Sky Lofts": "Sky Lofts",
      "Marjan Lofts": "Marjan Lofts",
      "Mrjan Lofts": "Marjan Lofts",
      "Luxury Residences": "Résidences de luxe",
      Townhouses: "Maisons de ville",
    },
    views: {
      "Sea View": "Vue mer",
      "City View": "Vue ville",
      "Sea View & Island View": "Vue mer et vue île",
      "Casino & Island View": "Vue casino et île",
      "Island & Casino": "Île et casino",
    },
  },

  places: {
    Türkiye: "Türkiye",
    Caribbean: "Caraïbes",
    İstanbul: "İstanbul",
    Antalya: "Antalya",
    Muğla: "Muğla",
    Grenada: "Grenade",
    Şişli: "Şişli",
    Beylikdüzü: "Beylikdüzü",
    Beyoğlu: "Beyoğlu",
    Bodrum: "Bodrum",
    Sarıyer: "Sarıyer",
    Konyaaltı: "Konyaaltı",
    Dominica: "Dominique",
    "St. Kitts & Nevis": "Saint-Christophe-et-Niévès",
    "Antigua & Barbuda": "Antigua-et-Barbuda",
    "St. Lucia": "Sainte-Lucie",
    "La Sagesse Bay": "Baie de La Sagesse",
    "Cabrits National Park": "Parc national des Cabrits",
    "Christophe Harbour": "Christophe Harbour",
    Portsmouth: "Portsmouth",
  },

  property: {
    viewResidences: "Voir les résidences",
    viewProgress: "Suivre l’avancement du chantier",
    residencesEyebrow: "Trouvez la maison de vos rêves",
    residencesHeading: "Résidences disponibles",
    residencesBody: plural({
      one: "Découvrez la {count} résidence actuellement commercialisée à {project}.",
      other:
        "Découvrez les {count} résidences actuellement commercialisées à {project}.",
    }),
    residencesCount: plural({
      one: "{count} résidence",
      other: "{count} résidences",
    }),
    residencesEmpty:
      "Les résidences de {project} sont commercialisées par phases — consultez-nous pour les disponibilités actuelles.",
    browseAll: "Parcourir toutes les résidences",
    amenities: "Prestations",
    otherDevelopments: "Autres programmes",
    projects: {
      "levent-residences": {
        tagline: "Une adresse emblématique au cœur d’İstanbul",
        overviewHeading: "Chaque résidence : un panorama sur la ville.",
      },
      "bosphorus-heights": {
        tagline: "Vivre en hauteur, au-dessus du détroit",
        overviewHeading: "Cadré par l’eau, couronné par le ciel.",
      },
      "marmara-vista": {
        tagline: "La quiétude du littoral, sur la rive ouest d’İstanbul",
        overviewHeading: "Espace, lumière et grand large.",
      },
      "aegean-bay-residences": {
        tagline: "L’évasion idéale sur la péninsule de Bodrum",
        overviewHeading: "Se réveiller face à la mer Égée.",
      },
    },
    copy: staged<ProjectCopy>({
      "levent-residences": {
        description:
          "Dressées à Şişli, à quelques pas du quartier d’affaires de Levent, ces résidences allient une adresse centrale au calme d’intérieurs pensés dans le détail. Des volumes généreux, des baies toute hauteur et un étage d’équipements soigneusement composé en font un choix naturel pour les familles comme pour les investisseurs qui cherchent İstanbul dans sa version la mieux reliée — et une voie éligible à la citoyenneté turque.",
        overviewBody:
          "Conçues pour concilier commodité urbaine et sérénité, les Levent Residences déclinent une gamme de typologies — du studio efficace à la maison de ville familiale — chacune finie à un niveau qui préserve sa valeur.",
        amenitiesBody:
          "Un étage entier d’équipements accompagne le quotidien : hall d’arrivée avec conciergerie, spa et hammam, salon des résidents, salle de sport et terrasse paysagère pour la belle saison.",
        highlights: {
          "Central Connectivity":
            "À quelques minutes des quartiers d’affaires de Levent et Maslak, avec le métro au pied de l’immeuble",
          "Citizenship Eligible":
            "Certaines résidences atteignent le seuil de 400 000 USD du programme turc de citoyenneté par investissement",
          "City and Bosphorus Views":
            "Les étages supérieurs sont orientés pour capter la ligne d’horizon et des échappées sur le Bosphore",
        },
      },
      "bosphorus-heights": {
        description:
          "Une collection exclusive de 165 résidences à Beyoğlu, placées pour embrasser le Bosphore et la péninsule historique au-delà. À deux pas de Galata, d’İstiklal et des embarcadères, Bosphorus Heights offre une alliance rare entre cadre patrimonial et architecture contemporaine.",
        overviewBody:
          "Prenez de la hauteur sur la ville et découvrez İstanbul depuis un point de vue plus calme. Pied-à-terre ou résidence principale, c’est une invitation à vivre au point de rencontre de deux continents.",
        amenitiesBody:
          "Les résidents disposent d’un ensemble d’équipements pensé autant pour l’effort que pour le repos — piscine intérieure, salle de sport entièrement équipée et salon en toiture avec vue ininterrompue sur le détroit.",
        highlights: {
          "Bosphorus Outlook":
            "Des résidences orientées pour cadrer le détroit et la péninsule historique",
          "Heritage Quarter":
            "À distance de marche de la tour de Galata, d’İstiklal Caddesi et des quais de Karaköy",
          "Citizenship Eligible":
            "Certaines résidences atteignent le seuil de 400 000 USD du programme turc de citoyenneté par investissement",
        },
      },
      "marmara-vista": {
        description:
          "Implanté à Beylikdüzü sur la côte de Marmara, Marmara Vista propose 151 résidences en studio, une et deux chambres, largement ouvertes sur la mer. À courte distance de l’aéroport et du nouveau centre-ville, il convient aux familles comme aux investisseurs qui veulent de l’espace et de la lumière sans quitter İstanbul.",
        overviewBody:
          "Marmara Vista propose 151 résidences raffinées en studio, une et deux chambres sur la rive occidentale d’İstanbul, avec des vues panoramiques et paisibles sur la mer de Marmara.",
        amenitiesBody:
          "Un ensemble d’équipements bien pensé rythme le quotidien à Marmara Vista — du hall d’arrivée à la terrasse de la piscine, jusqu’à la promenade côtière à quelques pas.",
        highlights: {
          "Marmara Sea Views":
            "Des résidences orientées pour capter des vues ininterrompues sur la Marmara",
          "Family Neighbourhood":
            "Parcs, écoles internationales et promenade de Beylikdüzü à portée immédiate",
          "Airport Access":
            "Un accès direct à l’aéroport d’İstanbul et au corridor E-5",
        },
      },
      "aegean-bay-residences": {
        description:
          "Posé au-dessus d’une baie tranquille de la péninsule de Bodrum, Aegean Bay Residences est une adresse côtière raffinée où des intérieurs apaisés, la lumière naturelle et une vie sans effort se rejoignent. Pensé pour ceux qui tiennent à l’intimité et à la qualité, il installe un rythme simple : les matins au bord de l’eau, les soirs cadrés par l’horizon.",
        overviewBody:
          "Fusion rare de raffinement et de sérénité, Aegean Bay Residences redéfinit l’exclusivité côtière sur la péninsule de Bodrum. Par son charme intime et la beauté de son cadre, c’est un havre d’élégance contemporaine — aussi juste pour une retraite estivale que pour une adresse permanente de premier rang.",
        amenitiesBody:
          "Un ensemble d’équipements resserré soutient une façon de vivre calme et privée — hall d’arrivée, salle de sport, terrasse de la piscine et quelques marches jusqu’à la baie.",
        highlights: {
          "Unmatched Coastal Living":
            "Un accès direct à la baie et la simplicité d’un véritable art de vivre en bord de resort, fondé sur le confort et l’intimité",
          "Bodrum Peninsula":
            "À quelques minutes de la marina de Yalıkavak et des villages portuaires de la péninsule",
          "Citizenship Eligible":
            "Certaines résidences atteignent le seuil de 400 000 USD du programme turc de citoyenneté par investissement",
        },
      },
    }),
    highlights: {
      "Central Connectivity": "Au cœur des connexions",
      "Citizenship Eligible": "Éligible à la citoyenneté",
      "City and Bosphorus Views": "Vues sur la ville et le Bosphore",
      "Bosphorus Outlook": "Perspective sur le Bosphore",
      "Heritage Quarter": "Quartier historique",
      "Marmara Sea Views": "Vues sur la mer de Marmara",
      "Family Neighbourhood": "Quartier familial",
      "Airport Access": "Accès à l’aéroport",
      "Bodrum Peninsula": "Péninsule de Bodrum",
      "Unmatched Coastal Living": "Un art de vivre côtier sans égal",
    },
    stats: {
      Quantity: "Nombre de lots",
      Floors: "Étages",
      Location: "Localisation",
      "Room Sizes": "Surfaces",
      Apartments: "Appartements",
      Townhouses: "Maisons de ville",
      "Studio Apartments": "Studios",
    },
    statValues: {
      "420 apartments": "420 appartements",
      "11 townhouses with 3 & 5 bedrooms": "11 maisons de ville de 3 et 5 chambres",
      "Studio, 1, 2, 3 bedroom units": "Studios, 1, 2 et 3 chambres",
      "512 sq. ft. - 6,600 sq. ft.": "512 - 6 600 pi²",
      "165 total apartments": "165 appartements au total",
      "78 studio units": "78 studios",
      "87 one-bedroom units": "87 logements d’une chambre",
      "Beyoğlu, İstanbul": "Beyoğlu, İstanbul",
      "151 apartments": "151 appartements",
      "Studio, 1 & 2 bedroom units": "Studios, 1 et 2 chambres",
      "479 sq. ft. - 1,709 sq. ft.": "479 - 1 709 pi²",
      "Floor 1 - 15": "Étages 1 à 15",
      "88 apartments": "88 appartements",
      "Studio to 3 bedrooms": "Du studio au 3 chambres",
      "572 sq. ft. - 3,874 sq. ft.": "572 - 3 874 pi²",
      "Bodrum, Muğla": "Bodrum, Muğla",
    },
    amenityItems: {
      "Lobby & Concierge": "Lobby et conciergerie",
      Lobby: "Lobby",
      Concierge: "Conciergerie",
      "Spa & Hammam": "Spa et hammam",
      "Residents’ Lounge": "Salon des résidents",
      "Fitness Centre": "Centre de fitness",
      Gym: "Salle de sport",
      "Landscaped Terrace": "Terrasse paysagée",
      "Secure Parking": "Parking sécurisé",
      "Indoor Pool": "Piscine intérieure",
      "Outdoor Pool": "Piscine extérieure",
      "Pool Terrace": "Terrasse de la piscine",
      "Rooftop Lounge": "Salon en rooftop",
      "Promenade Access": "Accès à la promenade",
      "Bay Access": "Accès à la baie",
      "24/7 Security": "Sécurité 24h/24",
      "Cinema Room": "Salle de cinéma",
      "Co-working Space": "Espace de coworking",
      "Private Elevator": "Ascenseur privé",
      "Retail & Dining": "Commerces et restauration",
      Sauna: "Sauna",
      "Yoga Studio": "Studio de yoga",
      "Landscaped Gardens": "Jardins paysagers",
      "Children’s Play Area": "Aire de jeux pour enfants",
      "Jogging Track": "Piste de jogging",
      "Tennis Court": "Court de tennis",
      "Padel Court": "Terrain de padel",
      "BBQ Area": "Espace barbecue",
      "EV Charging": "Recharge pour véhicules électriques",
      "Smart Home": "Domotique",
      "Pet Friendly": "Animaux acceptés",
      "Beach Access": "Accès à la plage",
    },
  },

  team: {
    hero: {
      heading: "Celles et ceux qui suivent le dossier",
      body: "Multi Mulk est un cabinet volontairement restreint. La personne qui répond à votre première question est celle qui mène la demande jusqu’au bout, sans aucun intermédiaire entre les deux.",
    },
    leadership: {
      eyebrow: "Direction générale",
      heading: "Une direction à perspective internationale",
      body: "La direction stratégique du conseil de Multi Mulk, de ses bureaux et de sa croissance à long terme.",
    },
    people_section: {
      eyebrow: "Nos équipes",
      heading: "Une expertise dans chaque fonction",
      body: "Opérations, ventes, conseil client et médias numériques travaillent ensemble entre Dubaï, İstanbul et Lahore, pour qu’un dossier soit suivi par un cabinet plutôt que par trois bureaux.",
    },
    portraitAlt: "{name}, {title} chez Multi Mulk",
    departments: {
      executiveLeadership: "Direction générale",
      growthDubai: "Développement et opérations à Dubaï",
      turkeyOperations: "Opérations Türkiye",
      operations: "Opérations",
      istanbulSales: "Ventes İstanbul",
      sales: "Ventes",
      clientAdvisory: "Conseil client",
      digitalMedia: "Médias numériques",
      mediaProduction: "Production audiovisuelle",
    },
    people: {
      "sajid-ali-haydar": ["Directeur général (CEO)"],
      "nader-djebbi": ["Directeur du développement", "Responsable du bureau (Dubaï)"],
      "nargis-sadiq": ["Responsable du bureau (Türkiye)"],
      "seyhan-ozman": ["Assistante de bureau"],
      "fatih-abbas": ["Coordinateur des ventes", "Bureau d’İstanbul"],
      "errfan-balouch": ["Coordinateur des ventes"],
      "nilofar-sadiq": ["Conseillère commerciale"],
      "danish-anwar": ["Conseiller commercial"],
      "rizwan-saeed": ["Conseiller commercial"],
      "sadaf-sarwar": ["Responsable des réseaux sociaux"],
      "abdul-hadi": ["Vidéaste"],
      "zeeshan-haider": ["Monteur vidéo"],
    },
    cta: {
      heading: "Parlez à celles et ceux qui feront le travail",
      body: "Dites-nous ce que vous cherchez à obtenir. Vous saurez si c’est réalisable, ce que cela coûtera au-delà du montant affiché et combien de temps cela devrait prendre — avant qu’on ne vous demande de vous engager à quoi que ce soit.",
    },
  },

  contact: {
    heading: "Nous contacter",
    leadHeading:
      "Un nouvel art de vivre vous attend — faites-en le vôtre dès aujourd’hui.",
    leadBody:
      "Que vous exploriez la citoyenneté turque par investissement, que vous recherchiez un bien à İstanbul ou sur le littoral, ou que vous envisagiez un programme caribéen, notre équipe vous accompagne avec discrétion, clarté et expertise.",
    emailLabel: "E-mail",
    phoneLabel: "Téléphone",
    addressLabel: "Adresse",
    mapTitle: "Carte du bureau Multi Mulk à Beykent, İstanbul",
    mapLink: "Ouvrir dans Google Maps",
    form: {
      name: "Nom",
      namePlaceholder: "Saisissez votre nom",
      phone: "Téléphone",
      phonePlaceholder: "Numéro de téléphone",
      email: "E-mail",
      emailPlaceholder: "monadresse@email.com",
      enquiryAbout: "Quel est l’objet de votre demande ?",
      subject: "Objet",
      subjectPlaceholder: "Sur quoi souhaitez-vous nous consulter ?",
      message: "Message",
      messagePlaceholder: "Rédigez votre message…",
      consent:
        "En soumettant ce formulaire, vous acceptez que nous vous recontactions au sujet de votre demande. Consultez notre politique de confidentialité pour savoir comment nous traitons vos données.",
      submit: "Envoyer la demande",
      types: {
        turkishCitizenship: "Citoyenneté turque",
        turkiyeProperty: "Bien immobilier en Türkiye",
        caribbeanCbi: "Programme caribéen",
        general: "Demande générale",
      },
      ack: {
        subject: "Nous avons bien reçu votre demande",
        greeting: "Bonjour {name},",
        yourMessage: "Votre message",
        closing:
          "Si votre demande est urgente, répondez à cet e-mail ou appelez le bureau le plus proche.",
      },
      sentHeading: "Merci",
      sentBody:
        "Merci de nous avoir contactés. Un membre de l’équipe Multi Mulk vous répondra très prochainement.",
      sentAgain: "Envoyer un autre message",
      submitting: "Envoi en cours…",
      errors: {
        required: "Ce champ est obligatoire.",
        email: "Saisissez une adresse e-mail valide.",
        phone: "Saisissez un numéro de téléphone valide, avec l’indicatif du pays.",
        tooLong: "Ce texte dépasse la longueur acceptée.",
        load: "Nous n’avons pas pu charger le formulaire. La page de contact propose le même — ou utilisez nos coordonnées ci-contre.",
        rate: "Vous avez envoyé plusieurs demandes récemment. Réessayez plus tard ou écrivez à info@multimulk.com.",
        server: "Nous n’avons pas pu envoyer votre demande. Réessayez ou écrivez à info@multimulk.com.",
      },
    },
  },
  /** « Télécharger la brochure » — le bouton, le formulaire et l’e-mail. */
  brochure: {
    cta: "Télécharger la brochure",
    heading: "La brochure {project}",
    body: "Plans, finitions, spécifications et conditions de paiement en un seul document. Dites-nous où l’envoyer et il arrivera dans votre boîte de réception en un instant.",
    consent:
      "En demandant la brochure, vous acceptez que nous vous contactions au sujet de cette résidence. Consultez notre Politique de confidentialité pour savoir comment nous traitons vos données.",
    submit: "Envoyez-moi la brochure",
    submitting: "Envoi en cours…",
    sentHeading: "En route",
    sentBody:
      "Nous avons envoyé la brochure {project} à votre adresse e-mail. Si elle n’arrive pas d’ici quelques minutes, vérifiez vos courriers indésirables.",
    email: {
      subject: "Votre brochure {project}",
      greeting: "Bonjour {name},",
      body: "Merci de l’intérêt que vous portez à {project}. Votre brochure est prête — plans, finitions, spécifications et conditions de paiement.",
      button: "Télécharger la brochure",
      closing:
        "Un membre de l’équipe Multi Mulk vous recontactera sous peu. Pour organiser une visite ou poser une question sur les conditions de paiement, il vous suffit de répondre à cet e-mail.",
    },
  },
  /** La page d’une résidence, sur /properties/<slug>. */
  listing: {
    specs: "En bref",
    about: "À propos de cette résidence",
    gallery: "Galerie",
    galleryViewAll: plural({
      one: "Voir la photo",
      other: "Voir les {count} photos",
    }),
    galleryMore: "+{count} de plus",
    galleryCounter: "{index} sur {count}",
    galleryPrevious: "Précédent",
    galleryNext: "Suivant",
    floorPlans: "Plans",
    terms: "Conditions",
    paymentPlan: "Échéancier de paiement",
    handover: "Livraison",
    serviceCharge: "Charges annuelles",
    titleDeed: "Titre de propriété",
    gyo: "SIIC (GYO)",
    vat: "TVA",
    titleDeedTax: "Droits de mutation",
    watchTour: "Voir la visite",
    location: "Emplacement",
    mapTitle: "Carte de {title}",
    moreAt: "Plus à {project}",
    ctaHeading: "Posez-nous toutes vos questions sur cette résidence.",
    viewDevelopment: "Voir le programme",
  },
};

export default fr;
