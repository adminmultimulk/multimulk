/**
 * 简体中文.
 *
 * A `partial` locale (see `localeStatus` in `../config`): complete, and typed
 * as a full `Dictionary` so a missing key fails the build, but kept out of
 * `hreflang` and the sitemap until a native speaker has reviewed it.
 *
 * The routing segment is `zh`; the tag published in `hreflang` and `<html lang>`
 * is `zh-Hans`, because a bare `zh` says nothing about script. See
 * `hreflangFor` in `../config`.
 *
 * Register: the vocabulary Chinese investment-migration agencies use —
 * 投资入籍 for citizenship by investment, 黄金签证 for golden visas. Development
 * and operator names stay in Latin script, as they appear in listings.
 *
 * Once that review is done, set `localeStatus.zh = "published"`.
 */

import type { Dictionary } from "../index";

const zh: Dictionary = {
  meta: {
    articleFallback: "文章",
    propertyFallback: "房产",
    citizenship: {
      turkiye: {
        title: "土耳其投资入籍",
        description: "通过购买 400,000 美元房产获得土耳其国籍——门槛、时间线，以及符合条件的伊斯坦布尔与沿海住宅。",
      },
      caribbean: {
        title: "加勒比投资入籍",
        description: "通过政府批准的度假村投资，获得格林纳达、多米尼克及圣基茨和尼维斯的第二国籍——门槛、时间线与获批项目。",
      },
    },
    team: {
      title: "我们的团队",
      description: "Multi Mulk 背后的团队——管理层，以及迪拜、伊斯坦布尔和拉合尔三处办公室，全程负责土耳其入籍、加勒比投资入籍和房产案件。",
    },
    home: {
      title: "Multi Mulk | 为全球公民提供全球方案",
      description:
        "土耳其投资入籍、居留项目，以及土耳其与加勒比地区房地产投资的专业顾问服务。",
    },
    about: {
      title: "关于我们",
      description:
        "Multi Mulk 是一家专注于投资入籍与国际房地产的顾问机构。",
    },
    media: {
      title: "媒体中心",
      description: "投资入籍、居留项目与房地产市场的最新资讯与指南。",
    },
    publications: {
      title: "刊物",
      description:
        "Multi Mulk 自行撰写的指南与报告——投资入籍土耳其、加勒比计划与黄金签证居留，为正在权衡取舍的人而写。",
    },
    marketInsights: {
      title: "市场洞察",
      description:
        "土耳其与加勒比市场的真实状况——价格、审批、门槛与时限，取自公开记录并标注日期。",
    },
    events: {
      title: "活动",
      description:
        "在哪里与 Multi Mulk 见面——海湾地区、土耳其及其他地方的展会、研讨会与私人洽谈。",
    },
    search: {
      title: "房源搜索",
      description:
        "按地区、类型与预算搜索我们在土耳其和加勒比地区的房源组合。",
    },
    contact: {
      title: "联系我们",
      description:
        "联系 Multi Mulk 顾问团队。我们在阿联酋、土耳其和巴基斯坦设有办公室。",
    },
  },

  common: {
    getInTouch: "联系我们",
    learnMore: "了解更多",
    viewAll: "查看全部",
    readMore: "阅读全文",
    enquireNow: "立即咨询",
    loadMore: "加载更多",
    startingFrom: "起价",
    priceOnRequest: "价格请咨询",
    any: "不限",
    sortBy: "排序方式",
    resetAll: "重置全部",
    searchProperties: "搜索房源",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    close: "关闭",
    logoAlt: "Multi Mulk — 为全球公民提供全球方案",
    chooseLanguage: "选择语言",
    socialProfile: "{name} 社交主页",
  },

  review: {
    line: "最后审核日期：{date}",
    by: "审核人：{name}",
    sources: "资料来源",
    retrieved: "查阅于 {date}",
    stale: "本页有待复核。在依据任何数据作出决定前，请先向我们确认。",
  },

  figures: {
    qualifiers: {
      statutory: "由法律规定。",
      estimated:
        "估计值——取决于政府审理进度及每位申请人的具体情况，并非承诺。",
      indicative: "仅供参考。请结合自身情况向我们确认。",
      market: "市场估计值，随房产与时间而变动。",
    },
    units: {
      months: "个月",
      years: "年",
      days: "天",
      count: "个目的地",
      percent: "%",
    },
  },

  authors: {
    reviewedContent: "审阅内容",
    noCredentials: "资质待确认。",
    knowsAbout: "专业领域",
    credentials: "资质",
    body: "移民与投资建议的价值，取决于提供建议的人。以下就是本站内容背后的团队成员。",
    heading: "谁在为您提供建议",
    eyebrow: "我们的团队",
    roles: {
      founder: "创始人兼首席执行官",
      advisory: "顾问总监",
      team: "顾问团队",
    },
  },

  routes: {
    roadshow: "2026巴基斯坦路演",
    roadshowThanks: "谢谢",
    partners: "与我们合作",
    calculatorResult: "计算结果",
    freeGuide: "免费指南",
    team: "我们的团队",
    documents: "资料库",
    home: "首页",
    about: "关于我们",
    contact: "联系我们",
    search: "房源",
    knowledge: "资讯与洞察",
    publications: "刊物",
    marketInsights: "市场洞察",
    events: "活动",
    article: "文章",
    development: "项目",
    citizenshipHub: "投资入籍",
    citizenshipProgramme: "项目",
    goldenVisaHub: "居留",
    goldenVisaProgramme: "项目",
    realEstateHub: "房地产",
    country: "国家",
    compareIndex: "项目对比",
    comparison: "对比",
    investorProtection: "投资者保护",
    secondPassport: "第二本护照",
    eligibilityReview: "资格评估",
    faqIndex: "向 Multi Mulk 提问",
    faq: "问题",
    caseStudies: "客户成果",
    caseStudy: "案例研究",
    tools: "工具",
    authors: "我们的团队",
    author: "简介",
    legal: "法律条款",
  },

  hero: {
    heading: "入籍、居留与全球投资",
    body: "在全球布局投资，取得居留身份，构建第二家园策略——由会直言某个项目并不适合您的顾问团队提供建议。",
    pathsLabel: "您想从哪里开始？",
    paths: {
      citizenship: "获取国籍",
      residency: "获取居留",
      property: "投资房产",
    },
    slides: {
      "istanbul-dusk": "两大洲交汇之地",
      "island": "经政府批准的加勒比项目",
      "dubai": "十年居留，可续签",
      "advisory": "顾问先于房源",
    },
    showSlide: "显示 {name}",
    propertyType: "房产类型",
    bedroom: "卧室",
    country: "国家",
    currency: "货币",
    maximumPrice: "最高价格",
  },

  nav: {
    citizenship: "入籍",
    goldenVisa: "居留",
    realEstate: "房地产",
    protection: "投资者保护",
    knowledge: "资讯与洞察",
    about: "关于我们",
  },

  footer: {
    addresses: {
      UAE: "迪拜 Barsha Heights，Al Thanyah First，Grosvenor Business Tower 1909 室",
      "Türkiye": "Burc Plaza, Gökevler Mah. 2312 Sk. Blok No:18J, Kat:5, Ofis No:48-49, Beykent / 伊斯坦布尔",
      Pakistan: "巴基斯坦拉合尔 DHA Phase VIII，Broadway Commercial，192-B 三楼",
    },
    columns: {
      turkiye: "土耳其",
      caribbean: "加勒比",
      services: "服务",
      resources: "资源与对比",
      about: "关于我们",
    },
    aboutItems: {
      imageCredits: "图片来源",
      ourStory: "我们的故事",
      ourTeam: "我们的团队",
      turkishCitizenship: "土耳其入籍",
      caribbeanCbi: "加勒比投资入籍",
      mediaCentre: "媒体中心",
      construction: "工程进度",
      terms: "条款与条件",
      privacy: "隐私政策",
    },
    contactTitle: "联系我们",
    reviewsTitle: "留下评价",
    reviews: {
      trustpilot: "Trustpilot",
      google: "Google",
    },
    copyright: "© 2026 Multi Mulk. 版权所有。",
    offices: { UAE: "阿联酋", Türkiye: "土耳其", Pakistan: "巴基斯坦" },
  },
  pillars: {
    citizenship: {
      eyebrow: "投资入籍",
      heading: "把第二身份作为一项资产",
      body: "以合格投资换取完整公民身份的项目。我们会告诉您哪一个适合——同样常见的是，哪一个并不适合。",
      hubIntro: "下列每个项目都按相同字段呈现，可以彼此对照阅读，而不是一次翻一本手册。每个数据都附带来源与最近核对日期。",
    },
    goldenVisa: {
      eyebrow: "居留",
      heading: "无需搬迁的居留身份",
      body: "通过投资取得的居留许可——一个落脚点、一种税务安排，在若干情形下还是通往公民身份的路径。",
      hubIntro: "居留与入籍有一处决定性差别：它是可续签、也可撤销的居留许可，而不是国籍。下表列出每个项目实际给予的内容。",
    },
    realEstate: {
      eyebrow: "房地产",
      heading: "能当作投资运作的房产",
      body: "位于伊斯坦布尔、土耳其海岸、迪拜及加勒比地区的项目——在进入我们的组合之前完成评估，而非之后。",
    },
    protection: {
      eyebrow: "投资者保护",
      heading: "并非每套合格房产都是好投资",
      body: "一套房产可以满足项目门槛，同时仍是一项糟糕的资产。以下是我们在向客户推荐任何标的之前所做的核查。",
    },
  },

  compare: {
    eyebrow: "对比",
    heading: "项目并排比较",
    intro: "这些表格中的每个数据都读自同一份项目记录，因此某个门槛不可能在这里是一个说法、在项目页面上又是另一个说法。",
    factor: "比较项",
    unknownLabel: "未经确认",
    noneRequired: "无要求",
    noAgeLimit: "无年龄上限",
    grantedDirectly: "直接授予",
    noRoute: "无此路径",
    yes: "是",
    no: "否",
    bestLabel: "最有利",
    /** Marks the column the practice would advise; the verdict argues it. */
    recommended: "Multi Mulk 推荐",
    verdictHeading: "我们的看法",
    /** The three return rows; see `comparisonRows`. */
    resale: {
      open: "公开市场",
      limited: "项目申请人或工具自身条款",
      none: "无可出售资产",
    },
    returnRetained: "{percent} · {money} 收入",
    returnLost: "−100% · {money} 不予返还",
    returnNote: "5 年示意回报：按上方所示的毛租金收益率，以所示最低投资额计算五年的收益——未扣除购置成本、税费——若该路径为可转售资产，则本金本身得以保留。此为市场区间，并非预测或保证。",
    /** The comparison page in the resort design; see /compare/[slug]. */
    heroTagline: "基于同一事实并列阅读，附一条明确建议",
    programmesLabel: "个项目",
    factorsLabel: "项因素",
    tableHeading: "逐项比较",
    programmeIndex: "项目 {index}",
    recommendedHeading: "Multi Mulk 推荐{name}",
    otherComparisons: "其他对比",
    allComparisons: "全部对比",
    enquireSubject: "对比：{programmes}",
    ctaHeading: "仍在犹豫？",
    ctaBody: "告诉我们您想解决的问题以及正在权衡的项目，顾问将为您的家庭填好这张表并作答。",
    rows: {
      minimumInvestment: "最低投资额",
      holdingPeriod: "持有期",
      processingTime: "办理时长",
      visaFree: "免签目的地",
      schengen: "申根准入",
      dualCitizenship: "允许双重国籍",
      residencyRequired: "境内居住要求",
      physicalVisit: "须本人到访",
      dependentChildren: "受养子女年龄上限",
      parentsIncluded: "可包含父母",
      citizenshipAfter: "入籍所需年限",
      worldwideTax: "对全球收入征税",
      rentalYield: "毛租金收益率",
      capitalReturned: "退出时返还本金",
      resaleMarket: "转售市场",
      fiveYearReturn: "5 年示意回报（ROI）",
    },
    /** The verdict under each table, keyed by the comparison's `copyKey`. */
    copy: {
      "turkiye-vs-caribbean": {
        verdict:
          "论回报，两者相去甚远。土耳其的合格资产是一座一千六百万人口城市中的永久产权住宅：年租金收益率 5–7%，三年后可在公开市场出售，本金与护照一并收回。格林纳达的度假村份额年收益 2–4%，须持有五年，实际上只能转售给该项目的下一位申请人。格林纳达门槛更低、护照通行范围更广——美国 E-2 条约和免签中国是实实在在的优势，表格中也有体现。但我们接触的大多数家庭真正想要的，是一本能够自我回本的第二公民身份；以此衡量，我们推荐土耳其。",
      },
      "turkiye-citizenship-vs-residency": {
        verdict:
          "房产相同，回报也相同：伊斯坦布尔的一套公寓年收益 5–7%，家庭可随时在公开市场出售。不同的是这笔钱买到的东西。居留许可价格减半、办理更快，但它只是一份许可——需要续期、以持有房产为条件，且距离一份并无保证的入籍申请还有五年。公民身份直接授予并传给家人，而所依托的资产收益完全相同。当预算达到门槛时，我们推荐公民身份。",
      },
      "turkiye-vs-uae": {
        verdict:
          "两者都以一处年收益 5–7%、可在公开市场出售的房产取得，因此回报持平——而土耳其的入门门槛更低。区别在于授予的内容：黄金居留是一份每十年续期一次的居留许可，永远不会成为护照；土耳其则直接授予公民身份。两者并不互斥——我们的许多客户同时拥有迪拜的落脚点和土耳其护照。若目标是第二国籍，我们推荐土耳其。",
      },
      "caribbean-islands": {
        verdict:
          "多米尼克门槛最低，圣基茨和尼维斯的护照通行最广，但论回报，三者都远不及土耳其：伊斯坦布尔的公寓年租金收益 5–7%，三年后可在公开市场出售；而加勒比度假村份额年收益 2–4%，须持有五年，实际上只能转售给下一位申请人。在岛国之中应选格林纳达——该地区唯一同时拥有美国 E-2 条约和免签中国的护照。而在该地区与土耳其之间，我们推荐土耳其：一本能自我回本的公民身份。",
      },
      "golden-visas": {
        verdict:
          "土耳其和阿联酋是仅有的两个资产能产生收益的项目——年收益 5–7% 的房产，可在公开市场转售。葡萄牙于 2023 年关闭房产路径，其基金路径距离护照还有十年和一场语言考试；希腊仍以房产换居留，但对全球收入征税，入籍之路需七年。阿联酋黄金居留是我们实际办理的居留项目——可续期、不对全球收入征税、无最低居住要求——但它是许可，永远不是护照。土耳其直接授予公民身份，四者中入门最低，且房产收益相同。若家庭的目标是一本能自我回本的第二国籍，我们推荐土耳其；若还想在海湾地区有个落脚点，则搭配阿联酋。",
      },
      "turkiye-vs-portugal": {
        verdict:
          "论回报毫无悬念：土耳其的房产年收益 5–7%，三年后可在公开市场出售；葡萄牙的基金认购则按基金的条款、返还基金所得——而让该项目成名的房产路径已于 2023 年关闭。多数家庭真正询问的公民身份，在土耳其是直接授予，在葡萄牙则距离十年和一场语言考试。土耳其护照不能免签进入申根区，而葡萄牙居留卡可以——这是唯一值得权衡的葡萄牙优势。若家庭的目标是第二公民身份而非一个欧洲地址，我们推荐土耳其。",
      },
    },
  },

  programmes: {
    copy: {},
    routes: {
      "real-estate": "房地产",
      donation: "政府基金捐赠",
      bonds: "政府债券",
      business: "企业投资",
      deposit: "银行存款",
      fund: "投资基金",
    },
    offeredLabel: "我们提供该路径的顾问服务",
    notOfferedLabel: "该路径获认可，但我们不承办",
    routesHeading: "合格投资路径",
    statusHeading: "项目状态",
    status: {
      open: "开放",
      suspended: "暂停",
      closed: "关闭",
      announced: "已公布",
    },
    sinceLabel: "开放年份",
    unreviewed: "本页数据尚未完成法律复核，未予发布。在依据其中任何一项作出决定前，请先向我们确认。",
    /** The banner and sections of a programme page; see `programme-pages.ts`. */
    aboutEyebrow: "关于本项目",
    highlightsEyebrow: "项目亮点",
    highlightHeadings: {
      grants: "项目授予什么",
      family: "谁可以随同申请",
      asks: "项目对您的要求",
    },
    routesBody: "项目认可的投资路径，以及我们实际办理的路径。",
    compareEyebrow: "并列比较",
    compareHeading: "{name}对比",
    compareBody: "本页的每一个数字都与最常被比较的项目同列一表——读自同一份记录，并附有我们的建议。",
    compareButton: "查看对比",
    allComparisons: "全部对比",
    keyFactsHeading: "{name} 一览",
    keyFactsBody:
      "最常被问到的数据，与本站所有对比表取自同一份记录。",
    hubFaqHeading: "常见问题",
    hubFaqQuestion: "{name} 有哪些要求，又能带来什么？",
    otherProgrammes: "其他项目",
    viewProgramme: "查看项目",
    ctaHeading: "了解{name}",
    ctaBody: "告诉我们您想解决的问题，我们会告诉您这个项目是否合适——以及全部费用是多少。",
  },

  faq: {
    eyebrow: "向 Multi Mulk 提问",
    heading: "人们真正会问的问题",
    body: "能给出结论的回答。若答案确实取决于某个条件，我们会写明该条件，而不是把它留作让您来电的理由。",
    fullAnswer: "阅读完整回答",
    topics: {
      eligibility: "资格",
      cost: "费用",
      timeline: "时间",
      family: "家庭",
      property: "房产",
      tax: "税务",
      process: "流程",
      travel: "出行",
    },
  },

  caseStudies: {
    eyebrow: "客户成果",
    heading: "实际的工作是什么样子",
    body: "匿名处理的真实案例，保留了判断依据与过程中的波折。没有波折的案例研究只是宣传册。",
    objective: "目标",
    family: "家庭",
    invested: "投资额",
    timeline: "从开始到完成",
    afterwards: "其后",
    year: "年份",
    /** The case-study page in the resort design; see /case-studies/[slug]. */
    aboutHeading: "关于本案例",
    outcome: "结果",
    otherOutcomes: "其他客户案例",
    allOutcomes: "全部客户案例",
    viewOutcome: "阅读案例",
    ctaHeading: "这会是您的案例吗？",
    ctaBody: "告诉我们您想解决的问题，顾问会告诉您一个与您相似的家庭是如何做到的——以及全部费用是多少。",
    reasoning: "为何选它，又排除了什么",
    complication: "哪里出了问题",
    consentPending: "目前尚未发布任何客户成果。发布需取得客户书面同意，而 Multi Mulk 迄今未就任何一例取得该同意。",
    /** Shown wherever a composed, no-client engagement is listed. */
    representativeNote:
      "代表性案例：每个案例均根据我们顾问团队处理的典型档案的结构编写，不包含任何特定客户的信息。真实案例的结果仅在获得客户书面同意后发布。",
  },

  tools: {
    eyebrow: "工具",
    heading: "自己算一遍",
    body: "每个计算器读取的都是本站其余部分所依据的同一份项目记录，因此这里不会出现与项目页面相互矛盾的门槛数字。",
    calculator: {
      heading: "全部计入后的成本",
      body: "门槛是投资额，不是成本。此处在其之上加计交易费用，所用假设列于总额下方。",
      programme: "项目",
      adults: "成人",
      children: "18 岁以下子女",
      total: "预估总额",
      lines: {
        investment: "合格投资额",
        transferTax: "产权过户税",
        legal: "法律与顾问费",
        documentation: "评估、翻译与公证",
        government: "政府规费",
      },
      assumptions: "假设过户税为 {tax}，法律与顾问费 {legal}，文件费用 {docs}，并按 {people} 名申请人每人 {gov} 计算。",
      caveat: "这是用于规划的估算，并非报价。费率因房产、司法辖区与时间而异，且未计入增值税处理。在您作出任何承诺之前，我们会以书面形式提供实际数字。",
    },
  },

  welcome: {
    eyebrow: "欢迎来到 Multi Mulk",
    heading: "为全球公民提供全球方案",
    body: "Multi Mulk 协助具有国际视野的家庭与投资者在世界上最理想的地方扎根。我们业务的核心是土耳其投资入籍——从伊斯坦布尔的地标住址到爱琴海沿岸——并辅以精选的加勒比项目。从房产甄选、购置到入籍申请，我们全程陪同；办公室分布于土耳其、阿联酋与巴基斯坦。",
  },

  video: {
    eyebrow: "2026 迪拜 IPS 展会",
    heading: "伊斯坦布尔十四大投资项目",
    play: "播放视频",
  },

  regions: {
    turkiye: {
      label: "土耳其",
    },
    caribbean: {
      label: "加勒比",
    },
  },

  turkiyeSection: {
    eyebrow: "土耳其房产",
    heading: "土耳其入籍生活",
    body: "探索我们的土耳其房产组合：当代建筑、伊斯坦布尔与海岸的优质地段，以及符合投资入籍条件的住宅。",
    descriptions: {
      "bosphorus-heights": "位于贝伊奥卢，距加拉塔与渡轮码头咫尺之遥。Bosphorus Heights 提供 165 套住宅，将海峡与其后的历史半岛尽收眼底。",
      "marmara-vista": "Marmara Vista 坐落于伊斯坦布尔西岸，提供 151 套精致的开间、一居与两居住宅，可远眺马尔马拉海的开阔全景。",
      "levent-residences": "希什利的地标住址，距离莱文特金融区仅数分钟车程，含 420 套公寓与 11 套专属联排别墅。",
      "aegean-bay-residences": "坐落于博德鲁姆一处静谧海湾之上，提供 88 套豪华开间、一居与两居住宅。",
      "antalya-coast": "位于孔亚阿尔特海岸线，Antalya Coast 以三栋标志性建筑呈现 1,023 套住宅，融合公寓、顶层住宅与配套设施。",
      "anatolian-villas": "探索我们在萨勒耶尔的四种别墅户型，为追求私密、优雅与定制化现代奢华的居住者而设计。",
    },
  },

  awards: {
    eyebrow: "奖项与荣誉",
    heading: "卓越获得认可",
    // Empty: `awardItems` in content.ts is empty, and the badges it
    // used to hold belonged to the reference site's resorts.
    captions: {
      luxuryHotels: "今年全球开业的 31 家非凡奢华酒店",
      newHotels: "北美及加勒比地区最佳新酒店",
      travel: "2025 年最佳旅行目的地",
      eco: "年度最佳生态友好度假村——2025",
      michelin: "米其林一钥——非常特别的住宿体验",
      beachfront: "年度最佳海滨物业",
    },
  },

  articlesSection: {
    heading: "最新文章",
    body: "在此获取最新动态、洞察与实用资料。本栏目汇集博客文章、新闻稿与详尽指南，让您及时了解我们的项目。",
    categoryLabel: "文章分类",
  },

  articles: {
    topics: {
      citizenship: "入籍",
      residency: "居留",
      "real-estate": "房地产",
      turkiye: "土耳其",
      news: "新闻",
    },
    categories: {
      All: "全部",
      "Press Media": "媒体报道",
      Blog: "博客",
      Publication: "刊物",
      "Market Insight": "市场洞察",
      Event: "活动",
    },
    sort: {
      Newest: "最新",
      Oldest: "最早",
    },
    sortLabel: "文章排序",
    empty: "{filter} 下暂无内容。",
    emptyHere: "此处尚未发布任何内容。",
    filter: "筛选",
    filterLabel: "筛选文章",
    filterType: "类型",
    filterTopic: "主题",
    searchLabel: "搜索文章",
    searchPlaceholder: "按标题或关键词搜索",
    noMatch: "没有与“{query}”匹配的结果。",
    pagination: "分页",
    previousPage: "上一页",
    nextPage: "下一页",
    pageN: "第 {n} 页",
    clearSearch: "清除",
    copy: {},
  },

  media: {
    heroEyebrow: "资讯与洞察",
    showArticle: "显示《{title}》",
    newsletter: {
      heading: "深入了解，持续关注",
      body: "不错过任何一次更新。",
      cta: "立即咨询",
    },
    article: {
      categoryLabel: "分类：",
      authorLabel: "作者：",
      publishedLabel: "发布于：",
      sourceLabel: "来源：",
      relatedHeading: "相关文章",
      readingTime: { one: "阅读 {count} 分钟", other: "阅读 {count} 分钟" },
    },
  },

  insights: {
    menuHeading: "资讯与洞察",
    menuBody: "Multi Mulk 发布的全部内容——我们获得的媒体报道、我们撰写的指南、市场的真实走向，以及与我们见面的场合。",
    sections: {
      articles: {
        label: "文章",
        menuLine: "新闻与博客",
        heading: "新闻与博客",
        body: "在此获取最新动态、洞察与实用资料。本栏目汇集博客文章、新闻稿与详尽指南，让您及时了解我们的项目。",
      },
      publications: {
        label: "刊物",
        menuLine: "指南与报告",
        heading: "刊物",
        body: "我们自己的指南与报告，为决策而写而非为点击而写——每项计划给予什么、要求什么，以及全部费用是多少。",
      },
      marketInsights: {
        label: "市场洞察",
        menuLine: "数据与分析",
        heading: "市场洞察",
        body: "土耳其与加勒比市场的真实状况——价格、审批、门槛与时限，取自公开记录并标注日期，让您清楚数据的新旧。",
      },
      events: {
        label: "活动",
        menuLine: "与我们见面",
        heading: "活动",
        body: "在海湾地区、土耳其及其他地方举办的展会、研讨会与私人洽谈。欢迎当面向我们提问。",
      },
    },
  },

  search: {
    heading: "您的下一个住址由此开始",
    body: "按您的条件浏览可享度假村配套、开阔景观与轻松海岸生活的住宅。",
    panelHeading: "寻找最优质的住宅",
    showing: {
      one: "显示 {count} 套",
      other: "显示 {count} 套",
    },
    searchLabel: "搜索",
    searchPlaceholder: "住宅名称",
    propertyType: "房产类型",
    bedroom: "卧室",
    currency: "货币",
    location: "地区",
    cbiOnly: "仅显示符合入籍条件",
    cbiHint: "{amount} 美元起——土耳其入籍房产门槛",
    noResults: "没有符合筛选条件的住宅",
  },

  places: {
    Türkiye: "土耳其",
    Caribbean: "加勒比",
    "İstanbul": "伊斯坦布尔",
    Antalya: "安塔利亚",
    Muğla: "穆拉",
    Grenada: "格林纳达",
    "Şişli": "希什利",
    Beylikdüzü: "贝利克居兹",
    Beyoğlu: "贝伊奥卢",
    Bodrum: "博德鲁姆",
    Sarıyer: "萨勒耶尔",
    Konyaaltı: "孔亚阿尔特",
    Dominica: "多米尼克",
    "St. Kitts & Nevis": "圣基茨和尼维斯",
    "Antigua & Barbuda": "安提瓜和巴布达",
    "St. Lucia": "圣卢西亚",
    "La Sagesse Bay": "拉萨热斯湾",
    "Cabrits National Park": "卡布里茨国家公园",
    "Christophe Harbour": "克里斯托夫港",
    Portsmouth: "朴次茅斯",
    "United Arab Emirates": "阿拉伯联合酋长国",
    Portugal: "葡萄牙",
    Greece: "希腊",
    Malta: "马耳他",
  },

  unit: {
    citizenshipEligible: "符合入籍条件",
    soldOut: "已售罄",
    enquirySubject: "关于 {unit}（{place}）的咨询",
    types: {
      Apartment: "公寓",
      Townhouse: "联排别墅",
      Villa: "独栋别墅",
    },
    studio: "开间",
    bedrooms: {
      one: "{count} 间卧室",
      other: "{count} 间卧室",
    },
    bathrooms: {
      one: "{count} 间浴室",
      other: "{count} 间浴室",
    },
    layouts: {
      Simplex: "平层",
      Duplex: "复式",
      "Townhouse + Maid": "联排别墅 + 佣人房",
    },
    sqft: "平方英尺",
    level: "{range} 层",
    levels: {
      "Ground Floor": "底层",
      "First Floor": "二层",
      "East Wing": "东翼",
      "West Wing": "西翼",
      "Sky Lofts": "Sky Lofts",
      "Marjan Lofts": "Marjan Lofts",
      "Mrjan Lofts": "Marjan Lofts",
      "Luxury Residences": "豪华住宅",
      Townhouses: "联排别墅",
    },
    views: {
      "Sea View": "海景",
      "City View": "城市景观",
      "Sea View & Island View": "海景与岛景",
      "Casino & Island View": "Casino & Island View",
      "Island & Casino": "Island & Casino",
    },
  },

  protection: {
    filtersHeading: "三道筛选，依次进行",
    filters: {
      eligible: {
        heading: "是否合格",
        body: "该房产在法律上是否符合项目要求？答案只有是或否，而“否”就意味着谈话到此为止。",
      },
      sensible: {
        heading: "财务上是否合理",
        body: "价格是否接近房产的真实价值？满足门槛并不说明价值，而仅为跨过门槛而买下的房产，通常都买得不好。",
      },
      exitReady: {
        heading: "能否退出",
        body: "它能出租吗？持有期满后能卖掉吗？无法退出的资产不是投资，而是一项负担。",
      },
    },
    checksHeading: "在您投资之前，我们核查什么",
    checksIntro: "二十个问题，每次都按相同顺序提出。它们写成问句，因为它们本就是问题：每一个在我们这里都有存档的答案，否则该房产不会进入下一步。",
    checks: {
      developerRecord: "开发商是谁，此前完成过哪些项目？",
      developerFinances: "开发商的账目与备案文件显示了什么？",
      titleDeed: "产权是否清晰，是否登记在卖方名下？",
      ownershipHistory: "这套房产历经哪些业主，最近一次转手是何时？",
      citizenshipEligibility: "该房产是否满足项目的资格规定？",
      gyoStatus: "卖方是否为房地产投资信托（GYO），这是否影响本次交易？",
      valuation: "官方评估是否支持所要价格？",
      sellerEligibility: "卖方是否具备向入籍申请人出售的资格？",
      buildingPermits: "建筑许可是否齐备且在有效期内？",
      constructionStage: "工程处于哪个阶段，相对于哪份进度表？",
      comparablePrices: "附近可比房产的实际成交价是多少？",
      pricePerSqm: "每平方米单价与该区域相比处于什么水平？",
      rentalDemand: "此处是否存在真实的租赁需求，还是仅为预测需求？",
      rentalYield: "扣除各项成本后，该需求能支撑多少净收益？",
      resaleLiquidity: "此类房源在该市场的转售速度如何？",
      exitStrategy: "退出方式是什么，取决于哪些条件？",
      hiddenCosts: "标价之外还有哪些费用？",
      vatPosition: "增值税情况如何，是否适用免税？",
      titleDeedCosts: "产权过户实际需要多少费用？",
      deliveryRisk: "若项目延期交付或无法交付，会发生什么？",
    },
    scoreHeading: "Multi Mulk 投资评分",
    scoreIntro: "我们推荐的每套房产都会依据八项加权因素进行百分制评分。权重在此公开，因为一个算法不透明的分数只是数字，而非评估。",
    scoreCaveat: "评分是某位评估人在特定日期的判断，既非预测也非保证。每个分数都注明评估人与日期。任何数字的依据，都可以向我们索取。",
    factorLabel: "因素",
    weightLabel: "权重",
    factors: {
      citizenshipSafety: "入籍安全性",
      developerStrength: "开发商实力",
      location: "地段",
      priceVsMarket: "价格与市场对比",
      rentalPotential: "租赁潜力",
      resaleLiquidity: "转售流动性",
      capitalAppreciation: "资本增值",
      deliveryRisk: "交付风险",
    },
  },

  destinations: {
    passportAlt: "{region}投资入籍项目所签发的护照",
    turkiye: {
      label: "土耳其",
      eyebrow: "土耳其，伊斯坦布尔",
      heading: "两大洲交汇之地",
      body: "土耳其将世界级都市与自爱琴海延伸至地中海的海岸线结合在一起。仅伊斯坦布尔一城便横跨两大洲，而投资入籍项目使得在此购置房产成为取得第二本护照的路径——这一组合在其他市场难以同等规模复制。",
      stats: {
        threshold: "入籍门槛",
        months: "办理时长",
        visaFree: "免签目的地",
      },
    },
    caribbean: {
      label: "加勒比",
      eyebrow: "加勒比",
      heading: "加勒比最具标志性目的地的所在",
      body: "加勒比地区汇聚了我们所代理的住宅与度假村项目中不断增长的一部分，其中许多与政府批准的投资入籍路径相关联。",
      stats: {
        years: "年经验",
        clients: "满意客户",
        properties: "已核验房源",
      },
    },
  },

  menus: {
    about: {
      heading: "关于我们",
      body: "Multi Mulk 是一家国际房地产与身份规划顾问机构，专注于土耳其投资入籍，为全球公民对接土耳其与加勒比地区的地标住宅。",
      ourStory: "我们的故事",
      ourTeam: "我们的团队",
    },
    realEstate: {
      heading: "房地产",
      body: "位于伊斯坦布尔、土耳其海岸及加勒比地区的项目——每一个在进入组合前都已对照其所在市场完成评估。",
    },
    citizenship: {
      label: "投资入籍",
      turkiyeRoutes: [
        "{investment} 房产路径",
        "持有 {holding}",
        "配偶及 18 岁以下子女均可包含",
      ],
    },
    /**
     * Hangs from Residence. Only the eyebrow over each card: the country
     * names come from `places`, and every figure on a card is read from the
     * programme record and labelled with the comparison table's own row
     * names, so the menu has nothing else of its own to translate.
     */
    goldenVisa: {
      label: "居留",
    },
    detail: {
      "bosphorus-heights": "165 套公寓",
      "marmara-vista": "151 套公寓",
      "levent-residences": "420 套公寓 + 11 套联排别墅",
      "aegean-bay-residences": "88 套公寓",
      "antalya-coast": "3 栋建筑内 1,023 套公寓",
      "anatolian-villas": "高端社区内的私人别墅",
      "la-sagesse-collection": "94 套优质公寓",
      "intercontinental-grenada": "120 间客房，含 30 间私人套房",
      "six-senses-la-sagesse": "56 间泳池套房与 15 栋泳池别墅",
      "intercontinental-dominica": "151 间客房与 10 间私人套房",
      "park-hyatt-st-kitts": "126 间客房及专属游艇码头",
      "port-cabrits-marina": "150 个泊位的超级游艇设施",
    },
  },

  caribbeanSection: {
    heading: "加勒比岛屿度假地",
    body: "探索我们在加勒比不断扩展的项目组合——具备长期价值、沉浸式体验与全球吸引力的海滨度假村与标志性品牌项目；其中经政府批准的部分项目同时提供通往投资入籍的合规路径。",
    descriptions: {
      "park-hyatt-st-kitts": "Park Hyatt St. Kitts 于 2017 年开业，拥有 126 间融合海岛设计的豪华客房与套房、开阔海景，并可直达 Christophe Harbour 码头。",
      "intercontinental-grenada": "该度假村将于 2026 年开业，设有 120 间客房、30 余间豪华套房、卓越餐饮与水疗体验，以及深具加勒比风情的建筑设计。",
      "intercontinental-dominica": "坐落于多米尼克的白沙滩上，怀抱雨林与海洋的奢华静所：设计典雅，加勒比海景动人，探险近在咫尺。",
      "six-senses-la-sagesse": "作为康养与奢华的静修之地，Six Senses La Sagesse 提供低层别墅、海洋景致，以及私密而富有文化底蕴的格林纳达体验。",
      "la-sagesse-collection": "在拉萨热斯湾体验 96 套专属住宅：自然之美与奢华在此相遇，清澈海水与阳光沙滩相伴，毗邻 Six Senses La Sagesse 与 InterContinental Grenada La Sagesse。",
      "port-cabrits-marina": "位于朴次茅斯附近的 Bell Hall，这一顶级滨水目的地将静谧、自然之美与世界级款待融为一体，配有超级游艇泊位、高端餐饮与精品零售。",
    },
  },
  contact: {
    heading: "联系我们",
    leadHeading: "更高层次的奢华生活正在等待，今天就让它属于您。",
    leadBody: "无论您是在了解土耳其投资入籍、在伊斯坦布尔或海岸寻找房产，还是在考虑加勒比项目，我们的团队都将以审慎、清晰与专业为您提供指引。",
    emailLabel: "电子邮箱",
    phoneLabel: "电话",
    addressLabel: "地址",
    mapTitle: "Multi Mulk 办公室地图 — {office}",
    mapLink: "在 Google 地图中打开",
    reviewsHeading: "分享您的体验",
    reviewsBody:
      "如果我们对您有所帮助，请在 Trustpilot 或 Google 上留下简短评价，帮助他人放心找到 Multi Mulk。",
    reviewsTrustpilot: "在 Trustpilot 上评价我们",
    reviewsGoogle: "在 Google 上评价我们",
    form: {
      name: "姓名",
      namePlaceholder: "请输入您的姓名",
      phone: "电话号码",
      phonePlaceholder: "电话号码",
      /** Accessible name of the dialling-code picker beside the number. */
      countryCode: "国家区号",
      email: "电子邮箱",
      emailPlaceholder: "myemail@email.com",
      enquiryAbout: "您想咨询哪方面？",
      subject: "主题",
      subjectPlaceholder: "您想咨询什么？",
      message: "留言",
      messagePlaceholder: "请输入您的留言..",
      consent: "提交本表单即表示您同意我们就您的咨询与您联系。有关我们如何处理您的数据，请参阅隐私政策。",
      submit: "发送咨询",
      types: {
        calculator: "计算报告申请",
        roadshow: "巴基斯坦路演登记",
        guide: "免费指南申请",
        partnership: "合作伙伴登记",
        turkishCitizenship: "土耳其入籍咨询",
        turkiyeProperty: "土耳其房产咨询",
        caribbeanCbi: "加勒比入籍咨询",
        general: "一般咨询",
      },
      ack: {
        subject: "我们已收到您的咨询",
        greeting: "尊敬的 {name}：",
        yourMessage: "您的留言",
        closing: "如有紧急事宜，请回复此邮件或致电离您最近的办事处。",
      },
      sentHeading: "感谢您",
      sentBody: "感谢您的来信。Multi Mulk 团队成员将尽快回复。",
      sentAgain: "再发送一条",
      submitting: "发送中…",
      errors: {
        required: "此项为必填。",
        email: "请输入有效的电子邮箱地址。",
        phone: "请输入有效的电话号码。",
        tooLong: "内容超出了可接受的长度。",
        load: "表单加载失败。联系页面提供同样的表单，或使用旁边的联系方式。",
        rate: "您近期已发送多条咨询。请稍后再试，或发送邮件至 info@multimulk.com。",
        server: "未能发送您的咨询。请重试，或发送邮件至 info@multimulk.com。",
      },
    },
  },
  about: {
    hero: {
      heading: "铸就无与伦比的传承",
      body: "我们的工作始于我们所服务的人。Multi Mulk 汇聚房产专家、身份规划顾问与法律顾问，使在伊斯坦布尔或加勒比海湾的一次购置，成为一个深思熟虑的决定，而不是一连串未了之事。",
    },
    intro: {
      heading: "重新定义奢华，一个目的地接一个目的地",
      paragraphs: [
        "Multi Mulk 是一家国际房地产与身份规划顾问机构，业务覆盖全球公民可进入的两个最具吸引力的市场。在土耳其，我们代理伊斯坦布尔两岸以及爱琴海与地中海沿岸的地标住宅，每一处都对照开启土耳其投资入籍项目的 400,000 美元门槛进行衡量。",
        "在加勒比，我们与格林纳达、多米尼克以及圣基茨和尼维斯经政府批准的项目合作——其中包括 Six Senses La Sagesse、InterContinental Grenada – La Sagesse 与 Park Hyatt St. Kitts——在这些项目中，一笔投资同时带来一处住所与第二本护照。我们在土耳其、阿联酋与巴基斯坦的办公室，让客户始终贴近经办其档案的团队。",
      ],
      stats: {
        experience: "年经验",
        clients: "满意客户",
        properties: "已核验房源",
      },
      imageAlt: "Multi Mulk 组合中的滨水住宅",
    },
    regions: {
      turkiye: {
        label: "土耳其",
        body: "两大洲在此交汇，海岸线自博斯普鲁斯海峡延伸至地中海。我们的土耳其项目将市中心住址与静谧海湾结合，并提供一条由政府支持、直通入籍的路径。",
        imageAlt: "俯瞰博斯普鲁斯海峡的伊斯坦布尔住宅",
      },
      caribbean: {
        label: "加勒比",
        body: "一个水面平静、天际柔和、不疾不徐的世界。我们的加勒比目的地承袭海岛生活的本质，营造自然、建筑与身心康宁完美平衡的静思之所。",
        imageAlt: "Multi Mulk 组合中的一处加勒比海湾",
      },
    },
    principles: {
      heading: "我们所建之物背后的原则",
      items: {
        craftsmanship: {
          title: "定义奢华的工艺",
          body: "我们所代理的住宅，均以世界上最顶级房地产所具备的精确与匠心为标准。从定制内装到沉浸式户外空间，我们寻求毫不妥协的细节水准——那种交付十年之后仍显考究的水准。",
        },
        advice: {
          title: "顾问先于房源",
          body: "第二身份首先是一项法律承诺，其次才是一次购置。我们以平实的语言说明门槛、持有期与时间表，并且会直言某个项目并不合适。从甄选、购置到申请本身，客户始终由同一个团队陪同。",
        },
        lifestyle: {
          title: "以生活方式为核心的体验",
          body: "在房产之外，我们寻找的是生活目的地——从伊斯坦布尔交通便捷的城区，到静谧的滨水社区与高端康养居所，皆依据人们向往的生活方式而选。在文件签署完成很久以后，真正保有价值的是联结、私密与身心安适。",
        },
      },
    },
    developments: {
      heading: "我们的最新项目",
      body: "探索我们在土耳其与加勒比地区的最新住宅与酒店项目，为呈现精致生活、长期价值与卓越体验而打造。",
      cards: {
        "bosphorus-heights": "位于贝伊奥卢的 165 套住宅，将海峡与其后的历史半岛尽收眼底。",
        "aegean-bay-residences": "坐落于博德鲁姆一处静谧海湾之上，提供 88 套开间、一居与两居住宅。",
        "la-sagesse-collection": "在格林纳达一处私人海滩之畔、紧邻 Six Senses La Sagesse 的 94 套优质公寓限量精选。",
      },
      actions: {
        turkiye: "探索土耳其房产",
        caribbean: "探索加勒比房产",
      },
    },
    leadership: {
      heading: "以专业与远见引领",
      body: "我们工作的核心，是分布于三个办公室的房产专家、身份规划顾问与法律顾问团队。每份档案都由距离客户最近的团队自始至终负责，因此回答您第一个问题的人，也是把申请办到底的人。",
      portraitAlt: "{name}，Multi Mulk {title}",
      roles: {
        "sajid-ali-haydar": "首席执行官",
        "nader-djebbi": "首席增长官",
      },
    },
    map: {
      heading: "从海岸到岛屿，我们的工作聚焦于能够支撑更从容、更有联结感的生活的环境。",
      body: "在土耳其与加勒比，我们专注于由其周遭塑造的地方——以清晰、舒适与归属感为设计前提。我们代理的每个项目，都体现着对用心建筑、自然环境，以及轻松而真实的生活方式的同一份坚持。",
      imageAlt: "Multi Mulk 目的地的航拍视角",
    },
    places: {
      istanbul: {
        title: "伊斯坦布尔",
        caption: "两大洲交汇之地",
      },
      bodrum: {
        title: "博德鲁姆",
        caption: "爱琴海岸",
      },
      antalya: {
        title: "安塔利亚",
        caption: "绿松石海岸",
      },
      grenada: {
        title: "格林纳达",
        caption: "拉萨热斯湾",
      },
    },
  },
  citizenship: {
    caribbean: {
      hero: {
        heading: "加勒比投资入籍",
        body: "格林纳达、多米尼克及圣基茨和尼维斯运营着全球历史最悠久的三个项目——每个项目都可通过我们代理的度假村，走政府批准的途径入籍。",
      },
      intro: {
        eyebrow: "简介",
        heading: "三个项目，一个获批组合",
        paragraphs: [
          "投资入籍发源于加勒比。圣基茨和尼维斯于 1984 年推出首个项目，多米尼克于 1993 年紧随其后，这也是这些护照在边境和银行受到认可、而新兴项目难以企及的原因。每个岛国都有各自的立法、门槛和获批项目清单。",
          "Multi Mulk 只与政府批准的项目合作——包括 Six Senses La Sagesse 和 InterContinental Grenada – La Sagesse、InterContinental Dominica Cabrits Resort & Spa，以及 Park Hyatt St. Kitts。一笔投资，既能获得品牌度假村资产的份额，又能为家人带来第二本护照。格林纳达尤其值得一提：它是唯一与美国签有条约的加勒比项目。",
        ],
      },
      stats: {
        investment: "最低房地产投资额",
        timeline: "办理时间",
        visaFree: "免签目的地",
        holding: "持有期",
      },
      benefits: {
        eyebrow: "项目优势",
        heading: "传承，更上一层",
        body: "加勒比护照既是对冲工具，也是一项资产——出行自由不依赖于任何单一政府，同时持有一座持续运营的度假村的份额。",
        items: {
          citizenship: {
            title: "终身国籍，代代相传",
            body: "加勒比国籍终身有效，并可传给后代。视岛国而定，一份申请可涵盖您的配偶、子女，以及受您供养的父母或祖父母——这使其成为一项传承资产，而不只是一份旅行证件。",
          },
          mobility: {
            title: "通行 140 多个目的地",
            body: "这些护照可免签或落地签前往 140 多个目的地，包括申根区、英国、新加坡和香港。格林纳达还与美国签有条约，是唯一拥有此条约的加勒比项目。",
          },
          assets: {
            title: "拥有品牌度假村",
            body: "获批项目并非空壳项目。它们由 Six Senses、InterContinental 和 Park Hyatt 运营，这意味着资产具备租金表现、转售市场，以及远超所在岛屿的品牌知名度。",
          },
          process: {
            title: "历史最悠久的项目",
            body: "圣基茨和尼维斯自 1984 年起运营该项目，多米尼克自 1993 年起。四十年的立法、国际审视和独立尽职调查机构，正是这些护照至今仍能通过新兴项目难以通过的审查的原因。",
          },
        },
      },
      gallery: {
        eyebrow: "图集",
        heading: "岛屿，以及在其上建起的一切",
        body: "格林纳达的 La Sagesse 湾、多米尼克的 Cabrits、圣基茨的 Christophe Harbour——获批项目的真实面貌。",
      },
      signature: {
        heading: "横跨三岛的标志性入籍投资",
        body: "这里的获批项目由 Six Senses、InterContinental 和 Park Hyatt 运营——这些品牌自带租赁市场与转售市场。格林纳达、多米尼克和圣基茨各有立法与门槛，因此首要问题从来不是选哪套房，而是选哪个岛，我们会在向您展示任何房源之前先把这一点理清。",
        button: "咨询加勒比投资入籍",
      },
      enquire: {
        heading: "通过加勒比投资入籍项目获得全球出行自由",
        body: "告诉我们您的目标，我们将为您推荐合适的岛国、该国获批的项目，以及切实可行的时间线。",
      },
      projects: {
        heading: "政府批准项目",
        body: "以下每个项目均已获得所在岛国项目的批准。门槛和房源因项目而异，并随立法变化，因此在作出任何承诺之前，我们会以书面形式确认两者。",
      },
      process: {
        eyebrow: "办理流程",
        heading: "从首次沟通到护照",
        body: "五个阶段，由一个团队负责。任何岛国都不要求您亲自前往，大多数家庭在三到六个月内完成全部流程。",
        steps: {
          consultation: {
            title: "咨询",
            body: "格林纳达、多米尼克和圣基茨在门槛、受养人范围以及护照所能开启的机会上各不相同。在看任何一处房产之前，我们会先确定三者中哪一个真正适合您的家庭。",
          },
          selection: {
            title: "选择项目",
            body: "我们在您所选岛国的政府批准项目中筛选房源，并说明每一套对租金表现和日后转售意味着什么——而不只是是否符合资格。",
          },
          purchase: {
            title: "预订与托管",
            body: "资金存入指定的托管代理，而非直接支付给开发商，并按施工节点释放。如您不便出行，购房协议可凭授权书签署。",
          },
          application: {
            title: "申请与尽职调查",
            body: "由授权代理向岛国的入籍部门递交申请。随后由独立国际机构进行背景及资金来源审查，这一阶段决定了整体时间线。",
          },
          passport: {
            title: "获批与护照",
            body: "获批后，您可远程、在使馆或在岛上宣誓，申请中列明的每个人都将获发护照。度假村份额仍归您所有，持有期满后可以出售。",
          },
        },
      },
      faq: {
        heading: "常见问题",
        items: {
          what: {
            question: "什么是加勒比投资入籍？",
            answer: "格林纳达、多米尼克及圣基茨和尼维斯各自依本国法律设立项目，向作出获批经济贡献的外国人授予国籍——即向国家基金捐款，或投资政府批准的房地产项目。圣基茨于 1984 年推出全球首个此类项目，使这些项目成为业内历史最悠久、受审视最严格的途径。",
          },
          options: {
            question: "有哪些投资方式？",
            answer: "每个岛国都提供两种途径：向国家发展基金作出不可退还的捐款，成本较低但没有任何回报；或投资约 200,000 美元起的获批房地产项目。房地产途径前期成本更高，但会为您留下一项持有期满后可出售的资产。Multi Mulk 专注于房地产途径。",
          },
          timeline: {
            question: "整个流程需要多长时间？",
            answer: "一般案件从申请到护照需要三到六个月。决定进度的是尽职调查阶段而非文书工作，因此我们在递交申请之前就备齐资金来源文件，而不是等到被问询时才准备。",
          },
          family: {
            question: "哪些人可以纳入申请？",
            answer: "所有岛国都涵盖您的配偶和受养子女；视项目而定，还可纳入受您供养的父母或祖父母，以及未婚的受养兄弟姐妹。格林纳达、多米尼克和圣基茨的规定各不相同，这往往决定了一个家庭应选择哪个项目。",
          },
          residency: {
            question: "我需要前往或居住在加勒比吗？",
            answer: "不需要。三个项目均无居住、最低停留、面试或语言考试要求，整个流程可远程完成。格林纳达完全无需到访；其他两国可在使馆或领事馆宣誓。",
          },
          benefits: {
            question: "这些护照能给我带来什么？",
            answer: "可免签或落地签前往 140 多个目的地，包括申根区、英国、新加坡和香港；终身国籍并可传给后代；三个国家均不对全球收入、资本利得或遗产征税。格林纳达护照持有人还可申请美国 E-2 投资者签证。",
          },
          dueDiligence: {
            question: "申请人需要接受哪些审查？",
            answer: "各国政府除本国入籍部门审核外，还委托独立的国际尽职调查机构核实身份、犯罪记录、制裁风险和资金来源。在欧盟和美国的压力下，审查标准已显著收紧，确有申请被拒。在您为一个案件花费任何费用之前，我们都会如实评估。",
          },
          resale: {
            question: "之后可以出售房地产吗？",
            answer: "可以，在持有期满后——通常为五年，但具体因岛国以及买方本人是否申请入籍而有所不同。许多获批项目在持有期内还会支付租金回报。出售不会影响您终身有效的国籍。",
          },
        },
      },
    },
    turkiye: {
      hero: {
        heading: "土耳其投资入籍",
        body: "一次符合条件的购房，即可让您、您的配偶及 18 岁以下子女获得国籍——入籍前后均无需在土耳其居住。",
      },
      intro: {
        eyebrow: "简介",
        heading: "以您真正拥有的房产入籍",
        paragraphs: [
          "土耳其是唯一一个能将普通购房直接转化为完整国籍的主要项目。无需捐款，也无需放弃任何东西：您购买一套不低于 400,000 美元门槛的住宅，持有三年，之后这笔投资仍归您所有并可出售，而国籍则终身属于您的家庭。",
          "Multi Mulk 代理伊斯坦布尔两岸以及爱琴海和地中海沿岸的项目，每个项目在进入我们的房源组合之前都会对照这一门槛进行衡量。房产专家、入籍顾问和法律顾问作为一个团队协作，因此回答您第一个问题的人，也将是陪伴申请直至拿到护照的人。",
        ],
      },
      stats: {
        investment: "最低房产投资额",
        timeline: "办理时间",
        visaFree: "免签目的地",
        holding: "持有期",
      },
      benefits: {
        eyebrow: "项目优势",
        heading: "土耳其国籍带来什么",
        body: "在这里，国籍是一项有用的资产，而不是抽屉里的一份文件：出行自由、横跨欧亚的立足点，以及持续产生收益的房产。",
        items: {
          citizenship: {
            title: "终身国籍，惠及家人",
            body: "土耳其国籍终身有效，并可传给后代。一份申请即可涵盖您、您的配偶及 18 岁以下子女，入籍后出生的子女自出生即为土耳其公民。土耳其允许双重国籍，因此入籍无需放弃任何东西。",
          },
          mobility: {
            title: "畅行欧亚",
            body: "土耳其护照可免签或落地签前往 110 多个目的地；土耳其与美国的条约还为公民开辟了申请 E-2 投资者签证的途径，这是大多数项目无法提供的。伊斯坦布尔的两座机场让欧洲、海湾地区和中亚的大部分地区都在几小时航程之内。",
          },
          assets: {
            title: "持续增值的住宅",
            body: "门槛通过购买而非捐款达成。您获得真实市场中一套真实住宅的产权——可以自住、出租或留给子女——三年持有期满后，可按市场届时的价值出售。",
          },
          process: {
            title: "快速且有法可依的流程",
            body: "该项目以土耳其法律明文规定，而非个案审批，从估值到护照通常稳定在三到六个月。无需面试、无需语言考试，任何阶段都无需在土耳其居住。",
          },
        },
      },
      gallery: {
        eyebrow: "图集",
        heading: "两大洲交汇之地",
        body: "伊斯坦布尔两岸、博德鲁姆的爱琴海、安塔利亚的地中海——符合条件的住宅所在之处。",
      },
      signature: {
        heading: "横跨两岸的标志性入籍投资",
        body: "土耳其是唯一一个以持有而非捐款达成门槛的主要项目，而且市场足够深厚，便于日后转售。伊斯坦布尔横跨两大洲，房价仅为欧洲同类首都的零头；海岸线从爱琴海延伸至地中海——因此在这里，一笔符合条件的购房往往在考虑护照之前，就已凭自身价值站得住脚。",
        button: "咨询土耳其投资入籍",
      },
      enquire: {
        heading: "通过土耳其投资入籍项目获得全球出行自由",
        body: "告诉我们您的目标，我们将为您提供符合条件的住宅、购房价格之外的总成本，以及切实可行的时间线。",
      },
      projects: {
        heading: "符合条件的项目",
        body: "以下每套住宅按当前估值均达到或超过 400,000 美元门槛。合格价位的房源流转很快，因此在作出任何承诺之前，所有数字都会以官方估值报告为准进行确认。",
      },
      process: {
        eyebrow: "办理流程",
        heading: "从首次沟通到护照",
        body: "五个阶段，由一个团队负责。大多数家庭在三到六个月内完成全部流程，全程无需踏足土耳其。",
        steps: {
          consultation: {
            title: "咨询",
            body: "我们讲清门槛、持有期、购房价格之外的费用和切实可行的时间线——如果该项目并不适合您的目标，我们也会直言相告。",
          },
          selection: {
            title: "选房",
            body: "我们按官方估值而非挂牌价筛选达到门槛的住宅，并安排实地或远程看房。",
          },
          purchase: {
            title: "购买与地契",
            body: "如您不便出行，您的律师可凭授权书完成过户。地契登记时会附上项目要求的三年禁售注记。",
          },
          application: {
            title: "入籍申请",
            body: "我们同时递交合规证明、居留许可和入籍申请，并提前备齐尽职调查文件，确保流程不会在窗口卡住。",
          },
          passport: {
            title: "获批与护照",
            body: "获批后，您及申请中列明的每位家庭成员都将获发护照。房产始终归您所有，三年期满后可自由出售。",
          },
        },
      },
      faq: {
        heading: "常见问题",
        items: {
          what: {
            question: "什么是土耳其投资入籍项目？",
            answer: "这是一条写入土耳其法律的途径：外国人在土耳其购买不低于 400,000 美元的房产并持有三年，即可获得完整国籍。与捐款类项目不同，这笔投资是您拥有的资产，持有期满后可以出售，而国籍本身是永久的。",
          },
          options: {
            question: "哪些投资方式符合条件？",
            answer: "我们大多数客户选择房产途径，最低 400,000 美元，并以官方估值报告确认。土耳其法律还认可 500,000 美元的银行存款、政府债券购买或资本投资，均需持有三年。只有房产途径能让您在自己选择的市场中保留一项可用的资产。",
          },
          timeline: {
            question: "整个流程需要多长时间？",
            answer: "一般案件从购房到护照需要三到六个月。过户本身只需几天，大部分时间用于合规证明和入籍申请。案件往往因文件不全而停滞，因此我们在购房之前而非之后就准备好尽职调查文件。",
          },
          family: {
            question: "哪些人可以纳入申请？",
            answer: "您、您的配偶及 18 岁以下子女可通过一份申请、一笔门槛投资一并入籍。18 岁以上子女须以自己的投资单独申请。入籍后出生的子女自出生即为土耳其公民。",
          },
          residency: {
            question: "我需要在土耳其居住或前往土耳其吗？",
            answer: "不需要。入籍前后均无居住要求，也无维持国籍的最低停留时间，更无面试或语言考试。购房手续可由您的律师凭授权书办理，因此整个流程无需您离开家。",
          },
          benefits: {
            question: "土耳其护照能给我带来什么？",
            answer: "可免签或落地签前往 110 多个目的地；有权在土耳其生活、工作和学习；并可依据土耳其的条约申请美国 E-2 投资者签证。土耳其允许双重国籍，因此您可保留原有国籍。",
          },
          dueDiligence: {
            question: "申请人需要接受哪些审查？",
            answer: "申请人需接受犯罪记录、制裁名单及投资资金来源的审查。审查标准是实打实的，确有申请被拒，这正是该项目在重要银行和边境机构面前保持公信力的原因。在您作出承诺之前，我们会指出任何可能造成困难的问题。",
          },
          resale: {
            question: "之后可以出售房产吗？",
            answer: "可以。地契附有三年禁售注记；注记失效后，您可按市场价值出售、出租或继续持有该住宅。出售不会影响申请中列明的任何人的国籍——国籍终身有效。",
          },
        },
      },
    },
    eyebrow: "投资入籍",
    anchors: {
      introduction: "概述",
      benefits: "优势",
      gallery: "图集",
      projects: "项目",
      process: "办理流程",
      industry: "行业概览",
      about: "关于 Multi Mulk",
      faq: "常见问题",
    },
    browseAll: "浏览符合条件的住宅",
    onThisPage: "本页内容",
    cta: {
      heading: "您的下一步由此开始",
      body: "就资格、时间安排以及哪些住宅符合条件，与我们的团队谈一谈。该项目是否契合您的目标，我们会直言相告。",
      button: "立即咨询",
    },
    industry: {
      eyebrow: "行业概览",
      heading: "投资移民行业",
      body: "投资入籍并非新近出现的构想。首个项目于 1984 年开放，四十年的立法、审查与改革已使其成为一类成熟的资产配置方式，而非新奇事物。",
      marketLabel: "全球市场规模",
      growthLabel: "年增长率",
      timelineHeading: "各项目按开放先后排列",
      thisProgramme: "本项目",
    },
    about: {
      eyebrow: "关于 Multi Mulk",
      heading: "您取得第二身份的伙伴",
      body: "Multi Mulk 将房产专家、身份规划顾问与法律顾问汇聚一处，办公室遍及土耳其、阿联酋与巴基斯坦。我们亲自代理这些项目，而非远距离居间撮合——正因如此，我们才能明确说出一处住宅究竟值多少、一个项目究竟要求什么，以及何时两者都不合适。我们给出的每一个数字，都会在您作出任何承诺之前以书面确认。",
      link: "了解更多关于我们",
    },
  },
  /** “下载宣传册”——按钮、其后的表单，以及宣传册所在的邮件。 */
  roadshow: {
    meta: {
      title: "2026土耳其房产路演——拉合尔、伊斯兰堡、卡拉奇 | Multi Mulk",
      description:
        "预约与 Multi Mulk 的免费私人会面：拉合尔（11月11日）、伊斯兰堡（11月13日）或卡拉奇（11月15日），了解土耳其投资入籍及伊斯坦布尔精选项目。",
    },
    eyebrow: "2026土耳其–巴基斯坦房产路演",
    heading: "在拉合尔、伊斯兰堡或卡拉奇与我们会面",
    body: "一对一私人会面，介绍土耳其投资入籍、为家人取得第二本护照以及伊斯坦布尔精选项目——今年十一月，就在您的城市。",
    pillars: ["土耳其公民身份", "第二本护照", "伊斯坦布尔房产"],
    cta: "预约私人会面",
    cities: {
      lahore: { name: "拉合尔" },
      islamabad: { name: "伊斯兰堡" },
      karachi: { name: "卡拉奇" },
    },
    hours: "会面时间 {range}",
    venueTbc: "确认时告知地点",
    bookCity: "预约{city}",
    cityClosed: "会面已结束",
    citiesHeading: "三座城市，三天",
    citiesBody:
      "每次会面均为私人会面，约一小时。请选择城市和方便的时段，我们将通过电话或 WhatsApp 确认具体时间和地点。",
    agendaEyebrow: "您的会面",
    agendaHeading: "会面内容",
    agenda: [
      {
        title: "您是否符合条件",
        body: "通过购房获得土耳其公民身份的门槛为 {minimum}，须持有 {years} 年。我们首先根据规定评估您的情况。",
      },
      {
        title: "全部费用",
        body: "购房价格之外的费用：地契税、律师费、估价及政府收费——让您按真实总额做规划。",
      },
      {
        title: "伊斯坦布尔精选项目",
        body: "一份符合入籍条件的项目短名单，以及我们在推荐任何项目之前进行的地契和估价核查。",
      },
      {
        title: "流程与时间",
        body: "从预订到护照通常需要 {min}–{max} 个月，无须在土耳其居住——以及每一步您需要做什么。",
      },
    ],
    factsHeading: "土耳其公民身份一览",
    facts: {
      minimum: "最低房产投资",
      processing: "常规办理时间",
      processingValue: "{min}–{max} 个月",
      visaFree: "免签目的地",
      family: "可随同申请",
      familyValue: "配偶及 {age} 岁以下子女",
      residence: "居住要求",
      residenceValue: "无",
    },
    factsNote:
      "数据最近一次审核于 {date}。项目规定可能变化，我们会在会面时逐项确认。",
    stepsHeading: "流程",
    steps: [
      {
        title: "登记",
        body: "选择城市、时段和预算，只需一分钟。",
      },
      {
        title: "我们确认",
        body: "我们的团队将在一个工作日内致电或通过 WhatsApp 与您确认具体时间和地点。",
      },
      {
        title: "私人会面",
        body: "与顾问面谈约一小时，免费且无任何义务。",
      },
    ],
    formHeading: "申请会面",
    formBody: "会面免费、私密、无任何义务。每个城市名额有限。",
    form: {
      city: "城市和日期",
      slot: "首选时段",
      slotPlaceholder: "选择时段",
      slots: {
        morning: "上午",
        afternoon: "下午",
        evening: "傍晚",
      },
      budget: "投资预算",
      budgetPlaceholder: "选择范围",
      budgets: {
        under400k: "40万美元以下",
        "400kTo600k": "40万–60万美元",
        "600kTo1m": "60万–100万美元",
        over1m: "100万美元以上",
      },
      errors: {
        choose: "请选择一项。",
        closed: "该城市的会面已结束，请选择其他城市。",
      },
      consent:
        "登记即表示您同意我们通过电话、WhatsApp 和电子邮件就路演及土耳其投资入籍与您联系。有关我们如何处理您的数据，请参阅隐私政策。",
      submit: "提交会面申请",
      submitting: "正在提交…",
    },
    faqHeading: "预约前的常见问题",
    faqs: [
      {
        question: "参加需要付费吗？",
        answer: "不需要。会面免费，也没有任何购买义务。",
      },
      {
        question: "会面在哪里进行？",
        answer: "在每个城市的市中心地点。我们会在确认时间时告知地址，以确保每次会面的私密性。",
      },
      {
        question: "可以带家人一起来吗？",
        answer: "可以，我们也鼓励这样做。您的配偶及 {age} 岁以下子女可一并纳入土耳其入籍申请，因此最好让所有参与决定的人都到场。",
      },
      {
        question: "需要携带什么吗？",
        answer: "没有必须携带的物品。如果您已有预算或心仪项目，欢迎带着问题前来；携带护照复印件可帮助我们当场核查资格。",
      },
      {
        question: "这些日期我无法参加，怎么办？",
        answer: "请通过 WhatsApp 或联系页面给我们留言，我们会在您方便的时间安排视频通话。",
      },
    ],
    ended: {
      heading: "2026路演已结束",
      body: "感谢所有在拉合尔、伊斯兰堡和卡拉奇与我们会面的朋友。您仍可通过视频通话或电话与顾问交流。",
      formHeading: "预约在线咨询",
      formBody: "留下您的联系方式，顾问将与您联系安排时间。",
    },
    summary: {
      heading: "您的申请",
      city: "城市",
      date: "日期",
      time: "首选时段",
      venue: "地点",
    },
    thanks: {
      meta: {
        title: "登记已收到 | 2026巴基斯坦路演 | Multi Mulk",
        description: "您的路演会面申请已收到。",
      },
      eyebrow: "登记已收到",
      heading: "谢谢——我们会尽快与您联系",
      body: "我们的团队将在一个工作日内致电或通过 WhatsApp 确认具体时间和地点。申请副本正发送至您的邮箱。",
      addToCalendar: "添加到日历",
      googleCalendar: "Google 日历",
      icsCalendar: "Apple / Outlook",
      calendarTitle: "Multi Mulk——土耳其房产路演，{city}",
      calendarDetails: "与 Multi Mulk 的私人会面。具体时间和地点将由我们的团队确认。",
      whatsapp: "通过 WhatsApp 联系我们",
      whatsappMessage: "您好 Multi Mulk，我已登记参加{city}的路演。",
      exploreHeading: "在此期间",
      exploreCitizenship: "土耳其投资入籍",
      exploreProperties: "浏览伊斯坦布尔房产",
      exploreGuide: "下载免费指南",
      back: "返回路演页面",
    },
    email: {
      subject: "您的路演会面申请——Multi Mulk",
      greeting: "{name}，您好：",
      body: "感谢您登记参加土耳其–巴基斯坦房产路演。以下是您申请的会面：",
      next: "我们的团队成员将在一个工作日内致电或通过 WhatsApp 与您确认具体时间和地点。",
      closing: "如需更改，直接回复此邮件即可。",
    },
  },

  brochure: {
    cta: "下载宣传册",
    heading: "{project} 宣传册",
    body: "户型图、精装标准、技术参数与付款条件，尽在同一份文件中。留下您的联系方式，宣传册稍后即达您的邮箱。",
    consent:
      "索取宣传册即表示您同意我们就该项目与您联系。有关我们如何处理您的数据，请参阅隐私政策。",
    submit: "把宣传册发给我",
    submitting: "发送中…",
    sentHeading: "已发送",
    sentBody:
      "我们已将 {project} 宣传册发送至您的邮箱。若几分钟内仍未收到，请查看垃圾邮件文件夹。",
    email: {
      subject: "您的 {project} 宣传册",
      greeting: "尊敬的 {name}：",
      body: "感谢您对 {project} 的关注。您的宣传册已准备好——户型图、精装标准、技术参数与付款条件。",
      button: "下载宣传册",
      closing:
        "Multi Mulk 团队成员将尽快与您联系。如需安排看房或咨询付款条件，直接回复本邮件即可。",
    },
  },
  /** /properties/<slug> 上单套住宅的页面。 */
  resort: {
    copy: {},
    about: "关于",
    highlights: "度假村亮点",
    location: "位置",
    caribbeanSea: "加勒比海",
    exterior: "外观",
    interior: "室内",
    video: "视频",
    galleryLabel: "{name}的照片",
    findYourWay: "如何前往{name}",
    otherProperties: "其他加勒比物业",
    cbiEyebrow: "投资入籍",
    cbiButton: "了解投资入籍方案",
    ctaHeading: "探索{name}",
    viewResort: "查看度假村",
    slide: "第 {index} 张，共 {count} 张",
  },

  listing: {
    galleryNext: "下一张",
    galleryPrevious: "上一张",
    galleryCounter: "{index} / {count}",
    galleryMore: "+{count} 张",
    galleryViewAll: {
      one: "查看照片",
      other: "查看全部 {count} 张照片",
    },
    specs: "概览",
    about: "关于项目",
    gallery: "图库",
    floorPlans: "户型图",
    terms: "交易条件",
    paymentPlan: "付款计划",
    handover: "交付时间",
    serviceCharge: "物业费",
    titleDeed: "产权状况",
    gyo: "房地产投资信托 (GYO)",
    vat: "增值税",
    titleDeedTax: "产权过户税",
    watchTour: "观看视频导览",
    location: "位置",
    mapTitle: "{title} 地图",
    moreAt: "{project} 的更多房源",
    ctaHeading: "关于这套住宅，欢迎向我们咨询。",
    viewDevelopment: "查看该项目",
    pricingHeading: "联系我们的团队，了解价格及可选方案",
    pricingBody:
      "如需了解最新价格、在售房源及投资方案，请联系我们的团队。",
    pricingRequest: "索取详情",
    pricingWhatsApp: "WhatsApp 联系我们",
    pricingWhatsAppMessage:
      "您好 Multi Mulk，我想了解 {project} 的最新价格及可选方案。",
  },

  legal: {
    pending: "本页面正在等待 Multi Mulk 提供最终文本。在此发布之前，如需了解现行条款，请发送邮件至 info@multimulk.com。",
    updated: "最后修订：{date}",
    headOffice: "总部",
    copy: {},
    credits: {
      intro: "本站几乎所有照片均来自图库或公有领域，无需任何回报。少数照片采用知识共享（Creative Commons）许可，其许可要求在此注明来源。",
      authorLabel: "摄影师",
      sourceLabel: "来源",
      licenceLabel: "许可",
      shareAlike: "该许可为“相同方式共享”。本站使用的版本经过裁剪，属于演绎作品，因此以相同许可发布——您可按相同条款再次使用。",
      rest: "其余图片均为 Pexels 图库、公有领域图片，或由项目方提供的照片。每个文件来源的完整记录均与文件一并保存。",
    },
  },

  documents: {
    meta: {
      title: "资料库",
      description: "下载 Multi Mulk 关于土耳其投资入籍、居留项目及与我们合作的指南、清单和演示文稿。",
    },
    eyebrow: "资源",
    heading: "资料库",
    body: "我们的指南、清单和演示文稿，均可免费下载：土耳其投资入籍如何运作、申请需要哪些材料，以及全球各项目如何比较。",
    listHeading: "全部资料",
    searchLabel: "搜索资料",
    searchPlaceholder: "按标题或关键词搜索",
    filter: "筛选",
    filterLabel: "筛选资料",
    filterCategory: "类别",
    categories: {
      citizenship: "土耳其入籍",
      applications: "申请材料",
      programmes: "全球项目",
      company: "公司与合作伙伴",
    },
    pages: {
      one: "{count} 页",
      other: "{count} 页",
    },
    size: "PDF · {size} MB",
    view: "查看",
    download: "下载",
    viewLabel: "查看 {title}（PDF，在新标签页中打开）",
    downloadLabel: "下载 {title}（PDF，{size} MB）",
    noMatch: "没有与“{query}”匹配的资料。",
    empty: "{filter} 类别下暂无内容。",
    items: {
      "turkiye-citizenship-guide": {
        title: "通过房地产投资获得土耳其国籍",
        summary: "购房入籍如何运作，以及这笔投资如何通过租金收入和增值获得回报。",
      },
      "step-by-step-process-timeline-guide": {
        title: "分步流程与时间线指南",
        summary: "土耳其购房入籍从购买到护照的每个阶段，以及各阶段所需时间。",
      },
      "turkish-citizenship-application-stages": {
        title: "土耳其入籍申请阶段",
        summary: "一张总览表呈现申请各阶段：每一步发生什么，大约需要多长时间。",
      },
      "cbi-bank-deposit": {
        title: "通过银行存款获得土耳其国籍",
        summary: "政府批准的途径：在土耳其银行存入 500,000 美元，家人可一并入籍。",
      },
      "turkey-visa-document-checklist": {
        title: "土耳其签证材料清单",
        summary: "申请土耳其签证需携带的材料：申请表、护照、照片及证明文件。",
      },
      "turkish-citizenship-application-documents": {
        title: "巴基斯坦公民入籍申请材料",
        summary: "巴基斯坦申请人所需的个人及家庭文件，以及每份文件如何认证、翻译和公证。",
      },
      "global-citizenship-and-residency-programs": {
        title: "全球入籍与居留项目",
        summary: "比较欧盟、加勒比、大洋洲和中东地区的投资入籍与投资居留项目。",
      },
      "multi-mulk-company-profile": {
        title: "Multi Mulk 公司简介",
        summary: "我们是谁，以及我们为全球投资者在房地产、居留和入籍领域提供哪些服务。",
      },
      "multi-mulk-b2b": {
        title: "Multi Mulk B2B 合作伙伴计划",
        summary: "土耳其投资入籍，以及我们面向中介和顾问的合作伙伴计划。",
      },
    },
  },

  partners: {
    meta: {
      title: "与 Multi Mulk 合作 | 土耳其房地产与入籍",
      description: "与 Multi Mulk 合作，在专属合作团队的支持下，为您的客户提供土耳其房地产投资和土耳其投资入籍服务。",
    },
    whatsappMessage: "您好 Multi Mulk，我想洽谈合作事宜。",
    hero: {
      eyebrow: "与 Multi Mulk 合作",
      heading: "为现有客户提供更多服务",
      subheading: "无需自建土耳其业务团队，即可在您的服务中加入土耳其房地产、土耳其投资入籍和国际居留解决方案。",
      body: "您负责客户关系，Multi Mulk 提供专业服务该客户所需的市场渠道、精选投资机会、最新项目信息和专业支持。Multi Mulk 的合作旨在长期共赢，而非一次性交易。",
      primary: "成为合作伙伴",
      secondary: "联系我们的合作团队",
      audience: "面向房地产中介、投资移民顾问、财富顾问、律师事务所及国际商业网络。",
    },
    why: {
      heading: "为什么选择与 Multi Mulk 合作？",
      intro: "Multi Mulk 为中介、顾问和咨询机构提供土耳其房地产投资和土耳其投资入籍领域的专业合作伙伴。合作伙伴将获得为国际客户提供优质服务所需的渠道、信息和支持。",
      items: [
        {
          title: "获取精选投资机会",
          body: "为客户提供已通过 Multi Mulk [资格、价值与退出审核](protection) 的土耳其房产，并搭配相关国际投资方案。",
        },
        {
          title: "最新项目信息",
          body: "使用最新的项目简介、价格、房源和销售资料，而非过时的价目表。",
        },
        {
          title: "投资与入籍专业知识",
          body: "当客户目标涉及土耳其国籍、居留或更广泛的投资规划时，Multi Mulk 的[房产专家、入籍顾问和法律顾问](team)将为洽谈提供支持。",
        },
        {
          title: "专属合作支持",
          body: "咨询和客户推荐直接对接 Multi Mulk 合作团队，无需在不相关的部门之间辗转。",
        },
        {
          title: "客户全程支持",
          body: "Multi Mulk 为每一次推荐提供支持，从初步咨询和机会评估，到选房、购买及相关咨询阶段。",
        },
        {
          title: "国际市场覆盖",
          body: "Multi Mulk 在[伊斯坦布尔、迪拜和拉合尔设有办公室](contact)，既了解土耳其房地产市场，也了解被其吸引的国际投资者。",
        },
      ],
    },
    who: {
      heading: "谁可以与 Multi Mulk 合作？",
      intro: "Multi Mulk 与客户对土耳其房产投资、土耳其国籍或国际居留感兴趣的专业公司及独立顾问合作。合作伙伴可位于土耳其境内或境外。",
      items: [
        {
          title: "房地产中介与经纪人",
          body: "向合适的客户推荐精选土耳其投资机会，拓展您的国际业务组合。",
        },
        {
          title: "国际房产顾问",
          body: "借助最新项目信息以及与 Multi Mulk 合作团队的直接联络，将土耳其纳入您覆盖的市场。",
        },
        {
          title: "移民与入籍顾问",
          body: "以与房产挂钩的土耳其入籍途径，补充您的移民或跨境流动服务。",
        },
        {
          title: "财富管理机构、家族办公室与理财顾问",
          body: "在符合客户整体财富策略时，引入房地产与国际身份规划方案。",
        },
        {
          title: "律师事务所与企业服务机构",
          body: "当客户在您的服务之外还需要协调一致的房产、投资、居留或入籍支持时，与我们携手合作。",
        },
        {
          title: "移居与留学顾问",
          body: "为跨国流动的客户及其家庭提供土耳其相关房产与居留解决方案。",
        },
        {
          title: "商业顾问与国际网络",
          body: "将有意投资土耳其的客户和会员，与当地专业合作伙伴对接。",
        },
        {
          title: "推荐合作伙伴与独立顾问",
          body: "推荐合格投资者，由 Multi Mulk 负责相关咨询与交易流程。",
        },
      ],
      note: "合作伙伴在其自身执照和职业义务范围内开展工作。受监管的法律、金融或移民建议仅应由具备相应资质的专业人士提供。",
    },
    models: {
      eyebrow: "合作机会",
      heading: "与 Multi Mulk 合作的四种方式",
      intro: "Multi Mulk 提供四种合作模式：土耳其房地产、土耳其入籍与投资推荐、国际入籍与居留，以及战略或机构合作。",
      bestForLabel: "适合：",
      items: {
        "real-estate": {
          title: "土耳其房地产合作",
          bestFor: "房地产中介、经纪人、房产顾问及国际顾问。",
          body: "适合客户有以下需求的合作伙伴：",
          points: [
            "出于投资、移居或第二居所目的[在土耳其购房](realEstate)",
            "[投资伊斯坦布尔、博德鲁姆或安塔利亚的房产](search)",
            "建立土耳其房地产投资组合",
            "了解[符合土耳其入籍条件的房产](citizenshipGuide)",
          ],
          after: "Multi Mulk 提供精选项目渠道、最新房源与价格、项目简介和投资信息，并在交易全程提供支持。",
          link: "注册成为房地产合作伙伴",
        },
        "citizenship-referral": {
          title: "土耳其入籍与投资推荐合作",
          bestFor: "移民及投资移民顾问、入籍顾问和财富管理专业人士。",
          body: "适合国际客户对[土耳其投资入籍](turkiye)感兴趣的顾问和机构。Multi Mulk 通过其咨询网络协助协调相关房产与入籍流程，从选择合格房产到递交入籍申请。推荐方将在全程获悉进展。",
          points: [],
          after: "",
          link: "洽谈推荐合作",
        },
        "citizenship-residency": {
          title: "国际入籍与居留合作",
          bestFor: "客户目光超越土耳其的精选专业合作伙伴。",
          body: "适合客户考虑土耳其以外入籍或[居留方案](goldenVisa)的合作伙伴，包括通过 Multi Mulk 提供的符合条件的[加勒比投资入籍项目](caribbean)。Multi Mulk 与格林纳达、多米尼克及圣基茨和尼维斯的政府批准项目合作。项目是否适合，取决于每位客户的具体情况及当时的现行规定。",
          points: [],
          after: "",
          link: "咨询入籍与居留合作",
        },
        strategic: {
          title: "战略与机构合作",
          bestFor: "房地产开发商、投资公司、家族办公室、国际机构、专业服务公司及企业网络。",
          body: "适合希望与 Multi Mulk 开展更广泛、更系统合作的机构。视契合程度，合作可包括：",
          points: [
            "推荐安排与战略分销",
            "市场进入合作",
            "联合营销与联名教育内容",
            "网络研讨会、投资者活动和路演，例如 Multi Mulk 在巴基斯坦举办的土耳其房产路演",
            "研究合作",
          ],
          after: "",
          link: "提出战略合作建议",
        },
      },
      note: "具体商业条款取决于合作模式，并在任何客户推荐之前与每位合作伙伴单独商定。",
    },
    provides: {
      eyebrow: "Multi Mulk 提供的支持",
      heading: "助您更好地服务客户",
      intro: "Multi Mulk 通过一个合作团队，为合作伙伴提供项目渠道、最新房源与价格、销售资料、投资信息、入籍与居留协调以及客户会面支持。",
      items: [
        {
          title: "项目渠道",
          body: "为国际买家精选的土耳其投资房产，从伊斯坦布尔市中心住宅到爱琴海和地中海沿岸项目。",
        },
        {
          title: "最新房源与价格",
          body: "最新房源情况、现行价格，以及适用时的项目动态。",
        },
        {
          title: "合作伙伴销售资料",
          body: "项目简介、核心参数、演示文稿、宣传册及经批准的视觉素材（如有）。",
        },
        {
          title: "投资信息",
          body: "房产、市场与投资信息，包括 Multi Mulk 公开发布的投资评分框架，帮助您清晰讲解每个机会。",
        },
        {
          title: "入籍与居留协调",
          body: "为目标包括土耳其国籍、居留或其他国际身份项目的客户提供协调支持。",
        },
        {
          title: "客户会面支持",
          body: "在适当情况下，协助咨询会、项目推介、线上会议及实地看房。",
        },
      ],
      strip: {
        title: "一个合作联络人，一段长期关系。",
        body: "每位合作伙伴都与 Multi Mulk 合作团队中的一位核心联络人对接，负责协调、咨询和客户推荐。这段关系旨在远远超越单次推荐。",
      },
    },
    process: {
      heading: "与 Multi Mulk 的合作如何运作？",
      intro: "与 Multi Mulk 的合作分为四步，从您的首次咨询到每次客户推荐的协同工作。",
      steps: [
        {
          title: "登记意向",
          body: "填写合作表格，向 Multi Mulk 介绍您的机构、客户以及您服务的市场。",
        },
        {
          title: "合作洽谈",
          body: "Multi Mulk 合作团队审阅您的申请，并与您商讨最合适的合作架构和商业条款。",
        },
        {
          title: "推介机会",
          body: "合作确立后，您使用约定的资料和流程，向合适的客户推介相关机会。",
        },
        {
          title: "共同服务客户",
          body: "Multi Mulk 与您协同，并在相关房产、投资、居留或入籍流程中为客户提供支持。",
        },
      ],
      cta: "登记意向",
    },
    whyUs: {
      heading: "为什么选择 Multi Mulk？",
      subheading: "先咨询，后房源。",
      body: "Multi Mulk 是一家国际房地产与入籍咨询机构，在土耳其、阿联酋和巴基斯坦设有办公室。我们的工作从投资者想要实现的目标出发；当某个项目或计划并不合适时，我们会直言相告。对合作伙伴而言，这种坦诚保护了您与客户建立的关系。",
      principles: [
        {
          lead: "咨询优先。",
          body: "根据客户目标匹配机会，而不是反过来。",
        },
        {
          lead: "专为国际投资者打造。",
          body: "面向外国人的土耳其房产是 Multi Mulk 的核心业务，因此团队熟悉海外买家会问的问题，从地契到持有期。",
        },
        {
          lead: "房产与入籍一体化。",
          body: "房产专家、入籍顾问和法律顾问作为一个团队工作，因此购房与入籍申请被视为同一个决定来处理。",
        },
        {
          lead: "透明筛选。",
          body: "Multi Mulk 公开其房产评估方法，包括 20 项尽职调查审核和加权投资评分。",
        },
        {
          lead: "有条理的沟通。",
          body: "每个案件由最贴近客户的团队主导，合作伙伴清楚每次推荐由谁负责。",
        },
        {
          lead: "长期关系。",
          body: "入籍案件需要数月，合格房产需持有多年，因此 Multi Mulk 着眼长远规划客户关系与合作伙伴关系。",
        },
      ],
      link: "了解 Multi Mulk 如何评估房产",
    },
    form: {
      heading: "探索与 Multi Mulk 的合作",
      body: "请简要介绍您的业务和您服务的客户。我们的合作团队将审阅您的申请，并与您联系，商讨最合适的合作方式。",
      name: "您的姓名与公司",
      namePlaceholder: "您的全名和公司名称",
      contact: "商务邮箱 / WhatsApp",
      contactPlaceholder: "我们的合作团队应如何联系您？",
      type: "您对哪种合作类型感兴趣？",
      typePlaceholder: "选择合作类型",
      types: {
        "real-estate": "土耳其房地产合作",
        "citizenship-referral": "土耳其入籍 / 投资推荐",
        "citizenship-residency": "国际入籍与居留",
        developer: "开发商 / 项目合作",
        strategic: "战略 / 机构合作",
        referral: "推荐合作",
        "not-sure": "不确定——希望进一步沟通",
      },
      markets: "您目前服务哪些市场或客户群体？",
      marketsPlaceholder: "例如：巴基斯坦、阿联酋、海湾国家、欧洲、亚洲、高净值投资者、购房者、移居客户等。",
      message: "请简要说明您希望如何与 Multi Mulk 合作。",
      messagePlaceholder: "介绍您的业务、客户以及您期望的合作类型。",
      submit: "提交合作咨询",
      privacy: "提交此表格即表示您同意 Multi Mulk 就您的合作咨询与您联系。有关您信息处理方式的详情，请参阅[隐私政策](privacy)。",
      sentHeading: "谢谢。",
      sentBody: "您的咨询已送达 Multi Mulk 合作团队，他们将与您联系，商讨后续步骤。",
      errors: {
        contact: "请输入邮箱地址，或带国家代码的 WhatsApp 号码（例如 +92 300 1234567）。",
        type: "请选择合作类型。",
      },
    },
    cta: {
      heading: "当客户问起土耳其时，您已准备就绪",
      body: "无论您是为国际投资者提供咨询、代表购房者，还是从事投资移民业务，Multi Mulk 都欢迎为您的机构和客户创造价值的系统化合作。与合作团队简短交流，即可判断是否契合。",
      button: "开始合作洽谈",
    },
    faq: {
      heading: "合作常见问题",
      items: [
        {
          question: "谁可以成为 Multi Mulk 的合作伙伴？",
          answer: "Multi Mulk 与客户对土耳其房地产投资、土耳其投资入籍或国际居留感兴趣的专业公司及独立顾问合作，包括房地产中介与经纪人、移民与入籍顾问、律师事务所、财富管理机构、家族办公室、移居服务公司、企业服务机构以及推荐合作伙伴。每项咨询都会单独审阅，以商定最合适的合作模式。",
        },
        {
          question: "土耳其境外的房地产经纪人可以与 Multi Mulk 合作吗？",
          answer: "可以。Multi Mulk 欢迎与土耳其境外、客户希望在土耳其购房的房地产经纪人、中介和房产顾问合作。海外合作伙伴将获得项目简介、最新价格与房源以及经批准的销售资料，Multi Mulk 伊斯坦布尔团队则支持每笔交易的本地环节。Multi Mulk 全程与推荐方保持协调。",
        },
        {
          question: "我可以推荐对土耳其投资入籍感兴趣的客户吗？",
          answer: "可以。移民顾问、入籍顾问及其他专业人士均可推荐对土耳其投资入籍（包括购房入籍）感兴趣的客户。Multi Mulk 通过其咨询网络协助协调相关房产与入籍流程。资格取决于每位客户的具体情况及申请时现行的项目规定，因此每个案件都会单独评估。",
        },
        {
          question: "Multi Mulk 为合作伙伴提供哪些支持？",
          answer: "Multi Mulk 为合作伙伴提供精选土耳其房地产项目渠道、最新房源与价格、项目简介、经批准的销售资料和投资信息。合作伙伴还可为寻求土耳其国籍或居留的客户获得协调支持，在适当情况下获得客户会面和看房协助，并在合作团队中拥有一位处理咨询和推荐的核心联络人。",
        },
        {
          question: "如何开始与 Multi Mulk 合作？",
          answer: "填写本页的合作表格。表格会询问您的姓名和公司、联系方式、感兴趣的合作类型、服务的市场以及希望如何合作。Multi Mulk 合作团队会审阅每项咨询，并与您联系商讨最合适的模式。商业条款取决于合作模式，并单独商定。",
        },
      ],
    },
  },

  whatsapp: {
    label: "您好！",
    message: "您好 Multi Mulk，我想进一步了解你们的房产。",
    aria: "通过 WhatsApp 与 Multi Mulk 聊天",
  },

  property: {
    viewResidences: "查看住宅",
    viewProgress: "查看施工进度",
    residencesEyebrow: "寻找理想家园",
    residencesHeading: "在售住宅",
    residencesBody: {
      one: "了解 {project} 目前推出的 {count} 套住宅。",
      other: "了解 {project} 目前推出的 {count} 套住宅。",
    },
    residencesCount: {
      one: "{count} 套住宅",
      other: "{count} 套住宅",
    },
    residencesEmpty: "{project} 的住宅分期推出——请咨询当前房源情况。",
    browseAll: "浏览全部住宅",
    about: "项目介绍",
    amenities: "配套设施",
    architecture: "建筑理念",
    earthquake: "抗震性能",
    distancesEyebrow: "交通出行",
    distancesHeading: "{project} 周边距离",
    areaEyebrow: "所在区域",
    areaOverview: "区位介绍",
    marketEyebrow: "市场洞察",
    marketPerformance: "住宅市场表现",
    distanceGroups: {
      "Cultural Hubs": "文化中心",
      Airports: "机场",
      Hospitals: "医院",
      "Business Hubs": "商务中心",
      Transportation: "交通",
      Education: "教育",
      Universities: "大学",
      Schools: "学校",
      "Shopping Centres": "购物中心",
    },
    otherDevelopments: "其他项目",
    enquireEyebrow: "联系顾问",
    enquireHeading: "咨询 {project}",
    enquireSubject: "关于 {project} 的咨询",
    enquireBody: "告诉我们您的需求，顾问将向您提供当前房源、价格及后续步骤。",
    projects: {
      "levent-residences": {
        tagline: "伊斯坦布尔中心的地标地址",
        overviewHeading: "每一套住宅，都是一幅城市全景。",
      },
      "bosphorus-heights": {
        tagline: "俯瞰海峡的高处生活",
        overviewHeading: "以水为框，以天为冠。",
      },
      "marmara-vista": {
        tagline: "伊斯坦布尔西岸的海滨宁静",
        overviewHeading: "空间、光线与开阔海景。",
      },
      "aegean-bay-residences": {
        tagline: "博德鲁姆半岛的理想居所",
        overviewHeading: "在爱琴海边醒来。",
      },
    },
    highlights: {
      "Central Connectivity": "交通便利",
      "Citizenship Eligible": "符合入籍条件",
      "City and Bosphorus Views": "城市与博斯普鲁斯海峡景观",
      "Bosphorus Outlook": "博斯普鲁斯海峡景观",
      "Heritage Quarter": "历史街区",
      "Marmara Sea Views": "马尔马拉海景观",
      "Family Neighbourhood": "家庭社区",
      "Airport Access": "近机场",
      "Bodrum Peninsula": "博德鲁姆半岛",
      "Unmatched Coastal Living": "无与伦比的海滨生活",
    },
    stats: {
      Quantity: "数量",
      Floors: "楼层",
      Location: "位置",
      "Room Sizes": "户型面积",
      Apartments: "公寓",
      Townhouses: "联排别墅",
      "Studio Apartments": "开间公寓",
    },
    statValues: {
      "420 apartments": "420 套公寓",
      "11 townhouses with 3 & 5 bedrooms": "11 套三居及五居联排别墅",
      "Studio, 1, 2, 3 bedroom units": "开间、一居、两居、三居",
      "512 sq. ft. - 6,600 sq. ft.": "512 - 6,600 平方英尺",
      "165 total apartments": "共 165 套公寓",
      "78 studio units": "78 套开间",
      "87 one-bedroom units": "87 套一居室",
      "Beyoğlu, İstanbul": "伊斯坦布尔贝伊奥卢",
      "151 apartments": "151 套公寓",
      "Studio, 1 & 2 bedroom units": "开间、一居及两居",
      "479 sq. ft. - 1,709 sq. ft.": "479 - 1,709 平方英尺",
      "Floor 1 - 15": "1 - 15 层",
      "88 apartments": "88 套公寓",
      "Studio to 3 bedrooms": "开间至三居",
      "572 sq. ft. - 3,874 sq. ft.": "572 - 3,874 平方英尺",
      "Bodrum, Muğla": "穆拉省博德鲁姆",
    },
    copy: {},
    amenityItems: {
      "Lobby & Concierge": "大堂与礼宾服务",
      Lobby: "大堂",
      Concierge: "礼宾服务",
      "Spa & Hammam": "水疗与土耳其浴",
      "Residents’ Lounge": "住户休息室",
      "Fitness Centre": "健身中心",
      Gym: "健身房",
      "Landscaped Terrace": "景观露台",
      "Secure Parking": "安保停车场",
      "Indoor Pool": "室内泳池",
      "Outdoor Pool": "室外泳池",
      "Pool Terrace": "泳池露台",
      "Rooftop Lounge": "屋顶休息区",
      "Promenade Access": "直通滨海步道",
      "Bay Access": "直通海湾",
      "24/7 Security": "24 小时安保",
      "Cinema Room": "影音室",
      "Co-working Space": "共享办公空间",
      "Private Elevator": "私人电梯",
      "Retail & Dining": "零售与餐饮",
      Sauna: "桑拿",
      "Yoga Studio": "瑜伽室",
      "Landscaped Gardens": "景观花园",
      "Children’s Play Area": "儿童游乐区",
      "Jogging Track": "慢跑道",
      "Tennis Court": "网球场",
      "Padel Court": "板式网球场",
      "BBQ Area": "烧烤区",
      "EV Charging": "电动车充电",
      "Smart Home": "智能家居",
      "Pet Friendly": "宠物友好",
      "Beach Access": "直通海滩",
      "Spa & Wellness": "水疗与康体",
      "Green Spaces": "绿地",
      "Walking Paths": "步行道",
      "Dining Areas": "用餐区",
      "Educational Facilities": "教育设施",
      "Private Parking": "私人停车位",
    },
  },

  team: {
    hero: {
      heading: "亲自负责您案件的人",
      body: "Multi Mulk 有意保持小而精的规模。回答您第一个问题的人，就是陪伴申请走到最后的人，两者之间没有任何中转环节。",
    },
    leadership: {
      eyebrow: "管理层",
      heading: "具有全球视野的领导团队",
      body: "统筹 Multi Mulk 的咨询业务、各地办公室及长期发展的战略领导。",
    },
    people_section: {
      eyebrow: "我们的成员",
      heading: "覆盖各职能的专业团队",
      body: "运营、销售、客户咨询与数字媒体团队在迪拜、伊斯坦布尔和拉合尔协同工作，让每个案件由一家公司统一负责，而不是三个办公室各自为政。",
    },
    portraitAlt: "{name}，Multi Mulk {title}",
    departments: {
      executiveLeadership: "管理层",
      growthDubai: "增长与迪拜运营",
      turkeyOperations: "土耳其运营",
      operations: "运营",
      istanbulSales: "伊斯坦布尔销售",
      sales: "销售",
      clientAdvisory: "客户咨询",
      digitalMedia: "数字媒体",
      mediaProduction: "媒体制作",
      humanResources: "人力资源",
      legal: "法务",
      education: "教育",
      marketing: "市场营销",
    },
    people: {
      "mohd-imad": [
        "SEO 专员",
      ],
      afsheen: [
        "内容创作者",
      ],
      "raazia-sanam": [
        "投资顾问",
      ],
      shahid: [
        "社交媒体副经理",
      ],
      "shaik-mohammed-aburuddin": [
        "投资顾问",
      ],
      "souha-koudmani": [
        "总经理",
      ],
      "hashim-hashimdan": [
        "摄像师",
      ],
      "zeynep-nehir-karap": [
        "投资顾问",
      ],
      "sajid-ali-haydar": [
        "首席执行官（CEO）",
      ],
      "nader-djebbi": [
        "首席增长官（CGO）",
        "办公室经理（迪拜）",
      ],
      "seyhan-ozman": [
        "行政专员",
      ],
      "nilofar-sadiq": [
        "投资顾问",
      ],
      "zeeshan-haider": [
        "视频剪辑师",
      ],
      "mahenur-azlem": [
        "人力资源协调员",
      ],
      "mubark-ali": [
        "投资顾问",
      ],
      "tariq-tahir": [
        "高级投资顾问",
      ],
      "sobhi-al-sabhi": [
        "高级投资顾问",
      ],
      "muhammad-mubashir": [
        "投资顾问",
      ],
      "muhammet-kurtulus": [
        "高级投资顾问",
      ],
      "maryam-shad": [
        "社交媒体经理",
      ],
      "muhammad-jamal": [
        "投资顾问",
      ],
      "sinan-sadikhov": [
        "投资顾问",
      ],
      "kubra-senturk": [
        "法律顾问",
      ],
      "elnaz-aminzadeh": [
        "投资顾问",
      ],
      "alireza-akbari": [
        "市场团队经理",
      ],
      "asad-ullah-saif": [
        "高级投资顾问",
      ],
      "muhammad-ali-shahid": [
        "投资顾问",
      ],
      "rizwan-aslam": [
        "视频制作专员",
      ],
      "ayshe-ali-haydar": [
        "投资顾问",
      ],
      "badar-naseem": [
        "投资顾问",
      ],
      "iffah-mir": [
        "平面设计师",
      ],
      "amina-ashraf": [
        "内容开发专员",
      ],
      "faizan-asif": [
        "网站 / SEO 专员",
      ],
      "sarmad-al-kaseer": [
        "高级投资顾问",
      ],
    },
    cta: {
      heading: "与真正做事的人对话",
      body: "告诉我们您的目标。在任何人要求您作出承诺之前，您会先得到我们的判断：目标能否实现、在标价之外还需花费多少，以及大约需要多长时间。",
    },
  },

  freeGuide: {
    meta: {
      title: "免费指南 | 土耳其投资入籍 | Multi Mulk",
      description: "下载 Multi Mulk 关于土耳其购房入籍的免费指南：购房途径如何运作、费用多少，以及流程对您有哪些要求。",
    },
    eyebrow: "免费指南",
    heading: "通过房地产获得土耳其国籍",
    body: "购房途径如何运作、总费用多少、申请对您有哪些要求——为决策而写，而非为点击而写。",
    leadHeading: "指南内容",
    leadBody: "二十四页内容，涵盖投资门槛、持有期、家属纳入，以及一笔购房如何通过租金收入和增值获得回报。",
    includes: [
      "购房入籍途径的分步说明",
      "政府要求什么，不要求什么",
      "如何从资格、价值和退出三方面评估项目",
      "从购房到护照的时间线",
    ],
    formHeading: "发送指南给我",
    formBody: "告诉我们发送到哪里。PDF 将即刻送达您的邮箱，只有在您需要时才会有顾问跟进。",
    consent: "申请指南即表示您同意我们就土耳其投资入籍事宜与您联系。有关我们如何处理您数据的详情，请参阅我们的隐私政策。",
    submit: "发送指南给我",
    submitting: "发送中…",
    sentHeading: "已发送",
    sentBody: "我们已将指南发送至您的邮箱。如几分钟内未收到，请检查垃圾邮件文件夹。",
    email: {
      subject: "您的免费指南：{title}",
      greeting: "尊敬的 {name}：",
      body: "感谢您申请《{title}》。您的指南已准备就绪——请在下方下载。",
      button: "下载指南",
      closing: "Multi Mulk 团队成员将很快与您联系。如想了解某个项目或时间线，直接回复本邮件即可。",
    },
  },

  calculatorResult: {
    meta: {
      title: "您的费用估算 | Multi Mulk",
      description: "查看入籍或居留项目的全部费用——投资、服务费及政府收费——并将完整明细发送到您的邮箱。",
    },
    eyebrow: "计算结果",
    heading: "您的全部费用估算",
    body: "门槛是投资额，而非费用。调整项目和家庭人数，然后解锁完整明细。",
    formHeading: "将明细发送到我的邮箱",
    formBody: "留下您的信息，我们会将逐项估算发送至您的邮箱，并在本页为您解锁。",
    unlockHint: "在旁边的表格中填写信息，即可解锁各项明细。",
    cta: "将此估算发送到我的邮箱",
    consent: "申请估算即表示您同意我们就您所选项目与您联系。有关我们如何处理您数据的详情，请参阅我们的隐私政策。",
    submit: "将明细发送到我的邮箱",
    submitting: "发送中…",
    sentHeading: "明细已解锁",
    sentBody: "各项明细已在上方显示，同一份估算也正在发送至您的邮箱。如几分钟内未收到，请检查垃圾邮件文件夹。",
    email: {
      subject: "您的费用估算：{programme}",
      greeting: "尊敬的 {name}：",
      body: "以下是您申请的 {programme} 全部费用估算。",
      closing: "以上数字仅供规划参考，并非报价。Multi Mulk 团队成员将很快与您联系——如有任何问题，请直接回复本邮件。",
    },
  },
};

export default zh;
