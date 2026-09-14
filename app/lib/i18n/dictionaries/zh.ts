/**
 * 简体中文.
 *
 * A `preview` locale (see `localeStatus` in `../config`): it renders and can be
 * linked, but it is kept out of `hreflang`, out of the sitemap and out of the
 * language switcher until it is complete. Everything absent here shows through
 * from English.
 *
 * The routing segment is `zh`; the tag published in `hreflang` and `<html lang>`
 * is `zh-Hans`, because a bare `zh` says nothing about script. See
 * `hreflangFor` in `../config`.
 *
 * Register: the vocabulary Chinese investment-migration agencies use —
 * 投资入籍 for citizenship by investment, 黄金签证 for golden visas. Development
 * and operator names stay in Latin script, as they appear in listings.
 *
 * When every key is present, change the annotation below to
 * `const zh: Dictionary = { ... }`, move it out of the overlaid branch of the
 * loader in `../index.ts`, and set `localeStatus.zh = "published"`.
 */

import type { PartialDictionary } from "../index";

const zh = {
  meta: {
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
    roles: {
      founder: "创始人兼首席执行官",
      advisory: "顾问总监",
      team: "顾问团队",
    },
  },

  routes: {
    home: "首页",
    about: "关于我们",
    contact: "联系我们",
    search: "房源",
    knowledge: "知识中心",
    article: "文章",
    development: "项目",
    citizenshipHub: "投资入籍",
    citizenshipProgramme: "项目",
    goldenVisaHub: "黄金签证与居留",
    goldenVisaProgramme: "项目",
    realEstateHub: "房地产",
    country: "国家",
    compareIndex: "项目对比",
    comparison: "对比",
    investorProtection: "投资者保护",
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
    goldenVisa: "黄金签证",
    realEstate: "房地产",
    protection: "投资者保护",
    knowledge: "知识中心",
    about: "关于我们",
  },

  footer: {
    columns: {
      turkiye: "土耳其",
      caribbean: "加勒比",
      services: "服务",
      resources: "资源与对比",
      about: "关于我们",
    },
    aboutItems: {
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
      eyebrow: "黄金签证与居留",
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
    },
    /** The verdict under each table, keyed by the comparison's `copyKey`. */
    copy: {
      "turkiye-vs-caribbean": {
        verdict:
          "格林纳达门槛更低，其护照在纸面上通行范围更广。但土耳其是更稳健的投资：合格资产是一座千六百万人口城市中的永久产权住宅，持有期间按市场收益率出租，三年后可在公开市场出售——而加勒比度假村份额收益更低、退出更难。公民身份直接授予，办理更快，且无需到访。对于希望以第二国籍实现自我回报的家庭，我们推荐土耳其。",
      },
      "turkiye-citizenship-vs-residency": {
        verdict:
          "居留许可成本减半、办理更快，但它终究是许可：需要续签，取决于是否继续持有房产，且距离并无保证的入籍申请还有五年。公民身份直接授予、惠及家庭，同一房产在两种情况下收益相同。预算达到门槛时，我们建议选择公民身份。",
      },
      "turkiye-vs-uae": {
        verdict:
          "黄金居留是每十年续签一次的居留许可，永远不是护照；土耳其以更低的入门金额直接授予公民身份，且房产收益相当。两者并不互斥——我们的许多客户同时拥有迪拜的基地和土耳其护照。若目标是第二国籍，我们推荐土耳其。",
      },
      "caribbean-islands": {
        verdict:
          "三者之中多米尼克门槛最低，而仅看表格，圣基茨和尼维斯的护照通行范围最广。但决定性的因素不在表格里。格林纳达是三者中唯一凭护照可申请美国 E-2 条约投资者签证的国家，也是唯一免签进入中国的国家；圣基茨和尼维斯是全球最古老的项目，也是在边境最为公认的名字；多米尼克的房产路径则是入股品牌度假村的最低门槛。若家庭的目标包含通往美国的路径，我们推荐格林纳达；若追求度假村份额的最低成本，则选多米尼克。",
      },
      "golden-visas": {
        verdict:
          "葡萄牙和希腊是几乎每次初次咨询都会被问到的两个欧洲黄金签证，而两者都已不再是五年前的样子：葡萄牙于 2023 年关闭了房产路径，其基金路径如今距离入籍申请还有十年和一场语言考试；希腊仍以房产换居留许可，但对全球收入征税，通往护照的路要走七年。阿联酋黄金居留是一种许可，永远不是护照，但它可续期、不对全球收入征税、没有最低居住要求，且合格资产是一处按市场收益率出租的迪拜房产——这正是我们实际办理的居留项目。若要在海湾地区建立没有税务风险的落脚点，我们推荐阿联酋；若家庭的目标是欧洲护照，希腊是两条路中较短的一条，我们会转介而非亲自办理。",
      },
      "turkiye-vs-portugal": {
        verdict:
          "葡萄牙几乎是每次初次咨询中都会提到的欧洲名字，但它已不再是人们记忆中的样子：房产路径于 2023 年关闭，剩下的是基金认购，审批耗时数年，而多数家庭真正询问的入籍如今距离十年和一场语言考试。土耳其直接授予公民身份，数月即可，凭一处持有期间持续产生收益的永久产权房产，无需居住、无需到访、无需语言考试。土耳其护照不能免签进入申根区，而葡萄牙居留卡可以——这是唯一值得权衡的葡萄牙优势。若家庭的目标是第二公民身份而非一个欧洲地址，我们推荐土耳其。",
      },
    },
  },

  programmes: {
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
    captions: {},
  },

  articlesSection: {
    heading: "最新文章",
    body: "在此获取最新动态、洞察与实用资料。本栏目汇集博客文章、新闻稿与详尽指南，让您及时了解我们的项目。",
    categoryLabel: "文章分类",
  },

  articles: {
    categories: {
      All: "全部",
      "Press Media": "媒体报道",
      Blog: "博客",
    },
    sort: {
      Newest: "最新",
      Oldest: "最早",
    },
    sortLabel: "文章排序",
    empty: "{filter} 下暂无内容。",
    copy: {},
  },

  media: {
    heroEyebrow: "媒体中心",
    showArticle: "显示《{title}》",
    indexHeading: "全部文章",
    indexBody: "在此获取最新动态、洞察与实用资料。本栏目汇集博客文章、新闻稿与详尽指南，让您及时了解我们的项目。",
    newsletter: {
      heading: "深入了解，持续关注",
      body: "不错过任何一次更新。",
      cta: "立即咨询",
    },
    article: {
      categoryLabel: "分类：",
      publishedLabel: "发布于：",
      sourceLabel: "来源：",
      relatedHeading: "相关文章",
      readingTime: { one: "阅读 {count} 分钟", other: "阅读 {count} 分钟" },
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
    specs: "概览",
    about: "关于这套住宅",
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
  },
} satisfies PartialDictionary;

export default zh;
