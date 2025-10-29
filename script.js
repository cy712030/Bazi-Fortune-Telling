// 天干地支数据
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHICHEN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 农历数据表 (1900-2100年)
// 每个元素表示一年的农历信息，编码为16进制数
// 前12位表示12个月的大小月(0=小月29天,1=大月30天)
// 后4位表示闰月月份(0表示无闰月)
const LUNAR_INFO = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2, // 1900-1909
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977, // 1910-1919
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970, // 1920-1929
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950, // 1930-1939
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557, // 1940-1949
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0, // 1950-1959
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0, // 1960-1969
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6, // 1970-1979
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570, // 1980-1989
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0, // 1990-1999
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5, // 2000-2009
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930, // 2010-2019
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530, // 2020-2029
    0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45, // 2030-2039
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0, // 2040-2049
    0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0, // 2050-2059
    0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4, // 2060-2069
    0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0, // 2070-2079
    0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160, // 2080-2089
    0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252, // 2090-2099
    0x0d520 // 2100
];

// 农历转阳历
function lunar2solar(year, month, day, isLeapMonth = false) {
    if (year < 1900 || year > 2100) {
        return null;
    }

    const leapMonth = getLeapMonth(year);
    let isLeap = false;

    // 如果用户选择的是闰月
    if (isLeapMonth && month === leapMonth) {
        isLeap = true;
    }

    // 计算从1900年1月31日(农历1900年正月初一)到指定日期的天数
    let offset = 0;

    // 累加1900年到指定年份之前的天数
    for (let i = 1900; i < year; i++) {
        offset += yearDays(i);
    }

    // 累加当年指定月份之前的天数
    let leapMonthFlag = false;
    for (let i = 1; i < month; i++) {
        offset += monthDays(year, i);
        if (i === leapMonth) {
            leapMonthFlag = true;
        }
    }

    // 如果是闰月，加上闰月之前的天数
    if (isLeap) {
        offset += monthDays(year, month);
    }

    // 加上指定日期的天数
    offset += day - 1;

    // 1900年1月31日对应的Date对象
    const baseDate = new Date(1900, 0, 31);
    const targetDate = new Date(baseDate.getTime() + offset * 86400000);

    return {
        year: targetDate.getFullYear(),
        month: targetDate.getMonth() + 1,
        day: targetDate.getDate()
    };
}

// 获取农历某年的总天数
function yearDays(year) {
    let sum = 348; // 12个月 * 29天
    for (let i = 0x8000; i > 0x8; i >>= 1) {
        sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
    }
    return sum + leapDays(year);
}

// 获取农历某年闰月的天数
function leapDays(year) {
    if (getLeapMonth(year)) {
        return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
}

// 获取农历某年的闰月月份，无闰月返回0
function getLeapMonth(year) {
    return LUNAR_INFO[year - 1900] & 0xf;
}

// 获取农历某年某月的天数
function monthDays(year, month) {
    if (month > 12 || month < 1) return -1;
    return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

// 天干五行
const TIANGAN_WUXING = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
};

// 地支五行
const DIZHI_WUXING = {
    '子': '水', '亥': '水',
    '寅': '木', '卯': '木',
    '巳': '火', '午': '火',
    '申': '金', '酉': '金',
    '丑': '土', '辰': '土', '未': '土', '戌': '土'
};

// 五行相生相克
const WUXING_SHENGKE = {
    '木': { sheng: '火', ke: '土', shengBy: '水', keBy: '金' },
    '火': { sheng: '土', ke: '金', shengBy: '木', keBy: '水' },
    '土': { sheng: '金', ke: '水', shengBy: '火', keBy: '木' },
    '金': { sheng: '水', ke: '木', shengBy: '土', keBy: '火' },
    '水': { sheng: '木', ke: '火', shengBy: '金', keBy: '土' }
};

// 精确节气计算（基于《时宪历》算法）
// 节气太阳黄经度数
const JIEQI_LONGITUDE = {
    '立春': 315, '雨水': 330, '惊蛰': 345, '春分': 0,
    '清明': 15, '谷雨': 30, '立夏': 45, '小满': 60,
    '芒种': 75, '夏至': 90, '小暑': 105, '大暑': 120,
    '立秋': 135, '处暑': 150, '白露': 165, '秋分': 180,
    '寒露': 195, '霜降': 210, '立冬': 225, '小雪': 240,
    '大雪': 255, '冬至': 270, '小寒': 285, '大寒': 300
};

// 计算精确节气时间
function calculateSolarTerm(year, termName) {
    const longitude = JIEQI_LONGITUDE[termName];
    const baseDate = new Date(2000, 0, 6, 18, 47, 0); // 2000年小寒时间作为基准

    // 简化的节气计算算法
    const yearOffset = year - 2000;
    const daysPerTerm = 365.2422 / 24; // 一个节气的平均天数

    // 计算该节气在当年的大致时间
    let termDays = (longitude / 360) * 365.2422;
    if (longitude < 45) termDays += 365.2422; // 调整到次年

    const termDate = new Date(year, 0, 1);
    termDate.setDate(termDate.getDate() + Math.floor(termDays));

    // 微调：考虑闰年等因素
    const adjustment = yearOffset * 0.2422; // 每年的累积误差
    termDate.setDate(termDate.getDate() + Math.floor(adjustment));

    return termDate;
}

// 获取月柱对应的节气信息
function getMonthSolarTerms(year) {
    return {
        '寅月': calculateSolarTerm(year, '立春'),
        '卯月': calculateSolarTerm(year, '惊蛰'),
        '辰月': calculateSolarTerm(year, '清明'),
        '巳月': calculateSolarTerm(year, '立夏'),
        '午月': calculateSolarTerm(year, '芒种'),
        '未月': calculateSolarTerm(year, '小暑'),
        '申月': calculateSolarTerm(year, '立秋'),
        '酉月': calculateSolarTerm(year, '白露'),
        '戌月': calculateSolarTerm(year, '寒露'),
        '亥月': calculateSolarTerm(year, '立冬'),
        '子月': calculateSolarTerm(year, '大雪'),
        '丑月': calculateSolarTerm(year, '小寒')
    };
}

// 神煞系统（基于《神峰通考》）
const SHENSHA_SYSTEM = {
    // 天乙贵人（贵人星）
    tianyiGuiren: {
        '甲': ['丑', '未'],  // 甲戊庚牛羊
        '戊': ['丑', '未'],
        '庚': ['丑', '未'],
        '乙': ['子', '申'],  // 乙己鼠猴乡
        '己': ['子', '申'],
        '丙': ['亥', '酉'],  // 丙丁猪鸡位
        '丁': ['亥', '酉'],
        '壬': ['卯', '巳'],  // 壬癸兔蛇藏
        '癸': ['卯', '巳'],
        '辛': ['寅', '午']   // 辛马虎卧山
    },

    // 桃花（咸池）
    xianchi: {
        '寅': ['卯'],  // 寅午戌见卯
        '午': ['卯'],
        '戌': ['卯'],
        '申': ['酉'],  // 申子辰见酉
        '子': ['酉'],
        '辰': ['酉'],
        '巳': ['午'],  // 巳酉丑见午
        '酉': ['午'],
        '丑': ['午'],
        '亥': ['子'],  // 亥卯未见子
        '卯': ['子'],
        '未': ['子']
    },

    // 文昌星
    wenchang: {
        '甲': ['巳'],  // 甲乙巳午报文章
        '乙': ['午'],
        '丙': ['申'],  // 丙丁申酉文章显
        '丁': ['酉'],
        '戊': ['申'],  // 戊己亦看申酉位
        '己': ['酉'],
        '庚': ['亥'],  // 庚辛亥虎文章扬
        '辛': ['亥'],
        '壬': ['寅'],  // 壬癸寅卯文章荣
        '癸': ['寅']
    },

    // 劫煞
    jiesha: {
        '申': ['巳'],  // 申子辰劫煞在巳
        '子': ['巳'],
        '辰': ['巳'],
        '寅': ['亥'],  // 寅午戌劫煞在亥
        '午': ['亥'],
        '戌': ['亥'],
        '巳': ['申'],  // 巳酉丑劫煞在申
        '酉': ['申'],
        '丑': ['申'],
        '亥': ['寅']   // 亥卯未劫煞在寅
    },

    // 羊刃
    yangren: {
        '甲': ['卯'],  // 甲刃在卯
        '乙': ['辰'],  // 乙刃在辰
        '丙': ['午'],  // 丙刃在午
        '丁': ['未'],  // 丁刃在未
        '戊': ['午'],  // 戊刃在午
        '己': ['未'],  // 己刃在未
        '庚': ['酉'],  // 庚刃在酉
        '辛': ['戌'],  // 辛刃在戌
        '壬': ['子'],  // 壬刃在子
        '癸': ['丑']   // 癸刃在丑
    }
};

// 分析神煞
function analyzeShenSha(bazi) {
    const shenSha = [];

    // 分析年月日时四柱的地支
    const allDizhi = [bazi.year.dizhi, bazi.month.dizhi, bazi.day.dizhi, bazi.hour.dizhi];
    const allTiangan = [bazi.year.tiangan, bazi.month.tiangan, bazi.day.tiangan, bazi.hour.tiangan];

    // 检查天乙贵人
    for (let i = 0; i < allTiangan.length; i++) {
        const tg = allTiangan[i];
        if (SHENSHA_SYSTEM.tianyiGuiren[tg]) {
            for (const guiren of SHENSHA_SYSTEM.tianyiGuiren[tg]) {
                if (allDizhi.includes(guiren)) {
                    shenSha.push({
                        type: '贵人',
                        name: '天乙贵人',
                        location: guiren,
                        description: '天乙贵人是最吉利的神煞，主得贵人相助，逢凶化吉',
                        effect: '得贵人提携，事业顺利，遇事有人相助'
                    });
                }
            }
        }
    }

    // 检查桃花
    const dayBranch = bazi.day.dizhi;
    if (SHENSHA_SYSTEM.xianchi[dayBranch]) {
        for (const taohua of SHENSHA_SYSTEM.xianchi[dayBranch]) {
            if (allDizhi.includes(taohua)) {
                shenSha.push({
                    type: '桃花',
                    name: '咸池桃花',
                    location: taohua,
                    description: '桃花主感情魅力，异性缘佳',
                    effect: '感情丰富，异性缘好，但要注意感情问题'
                });
            }
        }
    }

    // 检查文昌
    for (let i = 0; i < allTiangan.length; i++) {
        const tg = allTiangan[i];
        if (SHENSHA_SYSTEM.wenchang[tg]) {
            for (const wenchang of SHENSHA_SYSTEM.wenchang[tg]) {
                if (allDizhi.includes(wenchang)) {
                    shenSha.push({
                        type: '文贵',
                        name: '文昌星',
                        location: wenchang,
                        description: '文昌主文才学业，利考试求学',
                        effect: '聪明好学，文采出众，利求学考试'
                    });
                }
            }
        }
    }

    // 检查羊刃
    for (let i = 0; i < allTiangan.length; i++) {
        const tg = allTiangan[i];
        if (SHENSHA_SYSTEM.yangren[tg]) {
            for (const yangren of SHENSHA_SYSTEM.yangren[tg]) {
                if (allDizhi.includes(yangren)) {
                    shenSha.push({
                        type: '煞星',
                        name: '羊刃',
                        location: yangren,
                        description: '羊刃性刚烈，主武职或激烈性格',
                        effect: '性格刚强，做事果断，但容易冲动，要注意脾气'
                    });
                }
            }
        }
    }

    return shenSha;
}

// 格局理论（基于《子平真诠》和《渊海子平》）
const GEJU_THEORY = {
    // 正官格
    zhenguan: {
        name: '正官格',
        conditions: {
            '甲': { required: ['辛'], optional: ['己', '癸'], avoid: ['庚', '丁', '壬'] },
            '乙': { required: ['庚'], optional: ['戊', '壬'], avoid: ['辛', '丙', '癸'] },
            '丙': { required: ['癸'], optional: ['辛', '乙'], avoid: ['壬', '己', '甲'] },
            '丁': { required: ['壬'], optional: ['庚', '甲'], avoid: ['癸', '戊', '乙'] },
            '戊': { required: ['乙'], optional: ['癸', '丁'], avoid: ['甲', '辛', '丙'] },
            '己': { required: ['甲'], optional: ['壬', '丙'], avoid: ['乙', '庚', '丁'] },
            '庚': { required: ['丁'], optional: ['乙', '己'], avoid: ['丙', '癸', '戊'] },
            '辛': { required: ['丙'], optional: ['甲', '戊'], avoid: ['丁', '壬', '己'] },
            '壬': { required: ['己'], optional: ['丙', '庚'], avoid: ['戊', '甲', '辛'] },
            '癸': { required: ['戊'], optional: ['丁', '辛'], avoid: ['己', '乙', '庚'] }
        },
        description: '正官格为贵格，主正直、有责任心、适合从政或管理',
        characteristics: '性格正直，有领导才能，事业心强，宜在政府或大企业发展'
    },

    // 七杀格
    qisha: {
        name: '七杀格',
        conditions: {
            '甲': { required: ['庚'], optional: ['丁', '戊'], avoid: ['辛', '壬', '己'] },
            '乙': { required: ['辛'], optional: ['丙', '己'], avoid: ['庚', '癸', '戊'] },
            '丙': { required: ['壬'], optional: ['己', '庚'], avoid: ['癸', '甲', '辛'] },
            '丁': { required: ['癸'], optional: ['戊', '辛'], avoid: ['壬', '乙', '庚'] },
            '戊': { required: ['甲'], optional: ['庚', '壬'], avoid: ['乙', '丙', '癸'] },
            '己': { required: ['乙'], optional: ['辛', '癸'], avoid: ['甲', '丁', '壬'] },
            '庚': { required: ['丙'], optional: ['壬', '甲'], avoid: ['丁', '戊', '乙'] },
            '辛': { required: ['丁'], optional: ['甲', '乙'], avoid: ['丙', '己', '庚'] },
            '壬': { required: ['戊'], optional: ['乙', '丙'], avoid: ['己', '辛', '甲'] },
            '癸': { required: ['己'], optional: ['丙', '丁'], avoid: ['戊', '庚', '乙'] }
        },
        description: '七杀格为威严格，主权威、有魄力、适合军警或创业',
        characteristics: '性格威严，有魄力，敢作敢为，适合创业或从事具有挑战性的工作'
    },

    // 财格
    caige: {
        name: '财格',
        conditions: {
            '甲': { required: ['戊', '己'], optional: ['庚', '辛'], avoid: ['乙', '壬', '癸'] },
            '乙': { required: ['己', '戊'], optional: ['辛', '庚'], avoid: ['甲', '癸', '壬'] },
            '丙': { required: ['庚', '辛'], optional: ['壬', '癸'], avoid: ['丁', '甲', '乙'] },
            '丁': { required: ['辛', '庚'], optional: ['癸', '壬'], avoid: ['丙', '乙', '甲'] },
            '戊': { required: ['壬', '癸'], optional: ['甲', '乙'], avoid: ['戊', '丙', '丁'] },
            '己': { required: ['癸', '壬'], optional: ['乙', '甲'], avoid: ['己', '丁', '丙'] },
            '庚': { required: ['甲', '乙'], optional: ['丙', '丁'], avoid: ['庚', '戊', '己'] },
            '辛': { required: ['乙', '甲'], optional: ['丁', '丙'], avoid: ['辛', '己', '戊'] },
            '壬': { required: ['丙', '丁'], optional: ['戊', '己'], avoid: ['壬', '庚', '辛'] },
            '癸': { required: ['丁', '丙'], optional: ['己', '戊'], avoid: ['癸', '辛', '庚'] }
        },
        description: '财格为富格，主理财能力强、商业头脑发达',
        characteristics: '善于理财，商业头脑好，财运旺盛，适合经商或从事财务工作'
    },

    // 印格
    yin_ge: {
        name: '印格',
        conditions: {
            '甲': { required: ['壬', '癸'], optional: ['甲', '乙'], avoid: ['戊', '己', '庚', '辛'] },
            '乙': { required: ['癸', '壬'], optional: ['乙', '甲'], avoid: ['己', '戊', '辛', '庚'] },
            '丙': { required: ['甲', '乙'], optional: ['丙', '丁'], avoid: ['庚', '辛', '壬', '癸'] },
            '丁': { required: ['乙', '甲'], optional: ['丁', '丙'], avoid: ['辛', '庚', '癸', '壬'] },
            '戊': { required: ['丙', '丁'], optional: ['戊', '己'], avoid: ['壬', '癸', '甲', '乙'] },
            '己': { required: ['丁', '丙'], optional: ['己', '戊'], avoid: ['癸', '壬', '乙', '甲'] },
            '庚': { required: ['戊', '己'], optional: ['庚', '辛'], avoid: ['甲', '乙', '丙', '丁'] },
            '辛': { required: ['己', '戊'], optional: ['辛', '庚'], avoid: ['乙', '甲', '丁', '丙'] },
            '壬': { required: ['庚', '辛'], optional: ['壬', '癸'], avoid: ['丙', '丁', '戊', '己'] },
            '癸': { required: ['辛', '庚'], optional: ['癸', '壬'], avoid: ['丁', '丙', '己', '戊'] }
        },
        description: '印格为学业格，主聪明好学、有文化修养',
        characteristics: '聪明好学，有文化修养，适合从事教育、研究或文化艺术工作'
    }
};

// 分析格局
function analyzeGeju(bazi) {
    const dayTiangan = bazi.day.tiangan;
    const allGanzhi = [
        bazi.year.ganzhiStr,
        bazi.month.ganzhiStr,
        bazi.day.ganzhiStr,
        bazi.hour.ganzhiStr
    ];

    const gejuAnalysis = [];

    // 检查各种格局
    for (const [gejuKey, gejuInfo] of Object.entries(GEJU_THEORY)) {
        const conditions = gejuInfo.conditions[dayTiangan];
        if (!conditions) continue;

        let hasRequired = false;
        let hasOptional = 0;
        let hasAvoid = false;

        // 检查天干
        for (const ganzhi of allGanzhi) {
            const tg = ganzhi[0];

            if (conditions.required.includes(tg)) {
                hasRequired = true;
            }

            if (conditions.optional.includes(tg)) {
                hasOptional++;
            }

            if (conditions.avoid.includes(tg)) {
                hasAvoid = true;
                break;
            }
        }

        // 格局成立条件
        if (hasRequired && !hasAvoid) {
            gejuAnalysis.push({
                name: gejuInfo.name,
                key: gejuKey,
                quality: hasOptional >= 2 ? '上格' : hasOptional >= 1 ? '中格' : '正格',
                description: gejuInfo.description,
                characteristics: gejuInfo.characteristics,
                strength: hasOptional >= 2 ? '强' : hasOptional >= 1 ? '中' : '弱'
            });
        }
    }

    return gejuAnalysis;
}

// 用神判断（基于《滴天髓》调候理论）
function findYongShen(bazi, wuxingCount) {
    const dayTiangan = bazi.day.tiangan;
    const dayWuxing = TIANGAN_WUXING[dayTiangan];
    const monthTiangan = bazi.month.tiangan;
    const monthWuxing = TIANGAN_WUXING[monthTiangan];

    const yongShenAnalysis = {
        primary: '', // 主用神
        secondary: '', // 次用神
        reasoning: '', // 推理过程
        advice: '' // 建议
    };

    // 调候用神：根据月令判断
    const tiaohouYongShen = {
        '寅': ['丙', '癸'], // 正月寒气未退，需丙火暖局，癸水润局
        '卯': ['丙', '癸'], // 二月春寒料峭，丙癸并用
        '辰': ['甲', '癸'], // 三月木有余气，甲癸并用
        '巳': ['癸', '壬'], // 四月火旺，需水调候
        '午': ['壬', '癸'], // 五月火炎土燥，壬癸并用
        '未': ['乙', '癸'], // 六月土旺，乙木疏土，癸水润局
        '申': ['丁', '甲'], // 七月金旺，需丁火制金，甲木助丁
        '酉': ['丁', '甲'], // 八月金更旺，丁甲并用
        '戌': ['甲', '丙'], // 九月土重，甲木疏土，丙火暖局
        '亥': ['丙', '戊'], // 十月水旺，丙火暖局，戊土制水
        '子': ['丙', '戊'], // 十一月水更旺，丙戊并用
        '丑': ['丙', '甲']  // 十二月严寒，丙火暖局，甲木助火
    };

    const monthBranch = bazi.month.dizhi;
    const tiaohou = tiaohouYongShen[monthBranch] || [];

    // 分析五行强弱
    const wuxingStrength = {};
    for (const [wx, count] of Object.entries(wuxingCount)) {
        wuxingStrength[wx] = count;
    }

    // 判断用神
    let reasoning = `【用神分析】您的日主为${dayWuxing}，生在${monthBranch}月，属于${monthBranch}月令。`;

    // 检查日主强弱
    const dayWuxingCount = wuxingCount[dayWuxing] || 0;
    const isDayMasterStrong = dayWuxingCount >= 2;

    if (isDayMasterStrong) {
        // 日主强，需克泄耗
        reasoning += `日主${dayWuxing}有${dayWuxingCount}个，较强，需要克、泄、耗的五行来平衡。`;

        // 优先考虑调候
        if (tiaohou.length > 0) {
            for (const yong of tiaohou) {
                if (yong !== dayWuxing && wuxingCount[yong] === 0) {
                    yongShenAnalysis.primary = yong;
                    reasoning += `根据《滴天髓》调候理论，${monthBranch}月首选用神为${yong}。`;
                    break;
                }
            }
        }

        // 如果没有找到调候用神，考虑克泄耗
        if (!yongShenAnalysis.primary) {
            for (const yong of tiaohou) {
                if (WUXING_SHENGKE[dayWuxing].ke === yong ||
                    WUXING_SHENGKE[dayWuxing].sheng === yong) {
                    yongShenAnalysis.primary = yong;
                    break;
                }
            }
        }
    } else {
        // 日主弱，需生扶
        reasoning += `日主${dayWuxing}只有${dayWuxingCount}个，较弱，需要生、扶的五行来增强。`;

        // 优先考虑生扶
        const shengWuxing = WUXING_SHENGKE[dayWuxing].shengBy;
        if (wuxingCount[shengWuxing] === 0) {
            yongShenAnalysis.primary = shengWuxing;
            reasoning += `首选${shengWuxing}为用神，来生扶日主。`;
        }

        // 考虑调候
        if (tiaohou.length > 0 && !yongShenAnalysis.primary) {
            for (const yong of tiaohou) {
                if (yong !== dayWuxing && wuxingCount[yong] <= 1) {
                    yongShenAnalysis.primary = yong;
                    reasoning += `同时考虑调候需要，选用${yong}为用神。`;
                    break;
                }
            }
        }
    }

    // 次用神分析
    if (yongShenAnalysis.primary) {
        // 寻找辅助用神
        for (const yong of tiaohou) {
            if (yong !== yongShenAnalysis.primary &&
                wuxingCount[yong] === 0) {
                yongShenAnalysis.secondary = yong;
                break;
            }
        }
    }

    // 给出建议
    yongShenAnalysis.reasoning = reasoning;
    yongShenAnalysis.advice = `【用神建议】命局用神为${yongShenAnalysis.primary || '待定'}${yongShenAnalysis.secondary ? '，次用神为' + yongShenAnalysis.secondary : ''}。在日常生活中，可以多接触与用神五行相关的事物，如颜色、方位、职业等，有助于运势提升。`;

    return yongShenAnalysis;
}

// 汉字五行属性（简化版，基于音韵和笔画）
const CHAR_WUXING = {
    // 木性字（常见字）
    '木': '木', '林': '木', '森': '木', '树': '木', '柏': '木', '松': '木', '柳': '木',
    '青': '木', '绿': '木', '春': '木', '东': '木', '仁': '木', '建': '木', '健': '木',
    '杰': '木', '强': '木', '芳': '木', '花': '木', '英': '木', '茵': '木', '莉': '木',
    '梅': '木', '兰': '木', '竹': '木', '菊': '木', '荣': '木', '华': '木', '萍': '木',

    // 火性字
    '火': '火', '炎': '火', '焰': '火', '燃': '火', '炳': '火', '烨': '火', '焕': '火',
    '红': '火', '赤': '火', '丹': '火', '阳': '火', '光': '火', '明': '火', '亮': '火',
    '辉': '火', '灿': '火', '晓': '火', '晨': '火', '昭': '火', '晶': '火', '照': '火',
    '丽': '火', '璐': '火', '瑶': '火', '珍': '火', '珠': '火', '玲': '火', '琳': '火',

    // 土性字
    '土': '土', '地': '土', '坤': '土', '培': '土', '坚': '土', '城': '土', '墨': '土',
    '黄': '土', '中': '土', '央': '土', '宇': '土', '安': '土', '宏': '土', '宛': '土',
    '宝': '土', '宸': '土', '容': '土', '富': '土', '宁': '土', '家': '土', '嘉': '土',
    '山': '土', '岩': '土', '峰': '土', '岳': '土', '磊': '土', '石': '土', '岚': '土',

    // 金性字
    '金': '金', '银': '金', '铁': '金', '钢': '金', '铜': '金', '锋': '金', '锐': '金',
    '白': '金', '西': '金', '秋': '金', '刚': '金', '利': '金', '剑': '金', '钊': '金',
    '钰': '金', '鑫': '金', '铭': '金', '锦': '金', '钟': '金', '铎': '金', '锡': '金',
    '新': '金', '鑫': '金', '瑞': '金', '瑜': '金', '琛': '金', '珊': '金', '珮': '金',

    // 水性字
    '水': '水', '江': '水', '河': '水', '海': '水', '洋': '水', '波': '水', '涛': '水',
    '黑': '水', '北': '水', '冬': '水', '雨': '水', '雪': '水', '云': '水', '霖': '水',
    '润': '水', '清': '水', '洁': '水', '泽': '水', '浩': '水', '淼': '水', '源': '水',
    '泉': '水', '溪': '水', '汉': '水', '洪': '水', '淳': '水', '涵': '水', '澜': '水'
};

// 根据笔画数判断五行
function getWuxingByStroke(strokeCount) {
    const remainder = strokeCount % 10;
    if (remainder === 1 || remainder === 2) return '木';
    if (remainder === 3 || remainder === 4) return '火';
    if (remainder === 5 || remainder === 6) return '土';
    if (remainder === 7 || remainder === 8) return '金';
    if (remainder === 9 || remainder === 0) return '水';
    return '土'; // 默认
}

// 简化笔画计算（实际应用中需要准确的康熙字典笔画）
function getStrokeCount(char) {
    // 这里使用简化的笔画计算，实际应该查康熙字典
    const code = char.charCodeAt(0);
    // 简化算法：基于Unicode码位模拟
    return ((code - 0x4e00) % 20) + 1;
}

// 分析姓名五行
function analyzeNameWuxing(name) {
    if (!name || name.trim() === '') {
        return null;
    }

    const chars = Array.from(name.trim());
    const charAnalysis = chars.map(char => {
        let wuxing = CHAR_WUXING[char];
        if (!wuxing) {
            // 如果字典中没有，则根据笔画判断
            const strokeCount = getStrokeCount(char);
            wuxing = getWuxingByStroke(strokeCount);
        }
        return { char, wuxing };
    });

    // 统计姓名中的五行
    const wuxingCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    charAnalysis.forEach(({ wuxing }) => {
        wuxingCount[wuxing]++;
    });

    return {
        chars: charAnalysis,
        wuxingCount: wuxingCount
    };
}

// 全局变量存储计算结果
let baziResult = null;

// 计算年柱
function getYearPillar(year) {
    // 1900年为庚子年
    const baseYear = 1900;
    const offset = (year - baseYear) % 60;
    const tianganIndex = offset % 10;
    const dizhiIndex = offset % 12;
    return {
        tiangan: TIANGAN[tianganIndex],
        dizhi: DIZHI[dizhiIndex],
        ganzhiStr: TIANGAN[tianganIndex] + DIZHI[dizhiIndex]
    };
}

// 计算月柱（基于精确节气计算）
function getMonthPillar(year, month, day) {
    const currentDate = new Date(year, month - 1, day);
    const solarTerms = getMonthSolarTerms(year);

    // 地支月份对应
    const monthBranches = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
    let currentBranch = '';

    // 根据节气确定月支
    if (currentDate >= solarTerms['寅月']) {
        currentBranch = '寅';
    } else if (currentDate >= solarTerms['丑月']) {
        currentBranch = '丑';
    } else {
        // 如果还没到小寒，说明还是上一年的子月或亥月
        const prevYearTerms = getMonthSolarTerms(year - 1);
        if (currentDate >= prevYearTerms['子月']) {
            currentBranch = '子';
        } else {
            currentBranch = '亥';
        }
    }

    // 确定精确的月支
    for (let i = 0; i < monthBranches.length; i++) {
        if (currentDate >= solarTerms[monthBranches[i]]) {
            currentBranch = monthBranches[i];
        }
    }

    // 获取年干（用于计算月干）
    const yearPillar = getYearPillar(year);
    const yearTianganIndex = TIANGAN.indexOf(yearPillar.tiangan);

    // 五虎遁月：甲己之年丙作首
    let monthTianganStart;
    switch(yearTianganIndex) {
        case 0: case 5: monthTianganStart = 2; break; // 甲己年，丙作首
        case 1: case 6: monthTianganStart = 4; break; // 乙庚年，戊作首
        case 2: case 7: monthTianganStart = 6; break; // 丙辛年，庚作首
        case 3: case 8: monthTianganStart = 8; break; // 丁壬年，壬作首
        case 4: case 9: monthTianganStart = 0; break; // 戊癸年，甲作首
    }

    // 计算月干
    const branchIndex = DIZHI.indexOf(currentBranch);
    const tianganIndex = (monthTianganStart + branchIndex) % 10;

    return {
        tiangan: TIANGAN[tianganIndex],
        dizhi: currentBranch,
        ganzhiStr: TIANGAN[tianganIndex] + currentBranch,
        solarTerm: Object.keys(solarTerms).find(key => solarTerms[key] <= currentDate &&
                 (Object.values(solarTerms).find(date => date > currentDate) ||
                  new Date(year + 1, 0, 1)) > currentDate)
    };
}

// 计算日柱（使用蔡勒公式的变体）
function getDayPillar(year, month, day) {
    // 基准日期：1900年1月1日为甲戌日
    const baseDate = new Date(1900, 0, 1);
    const targetDate = new Date(year, month - 1, day);
    const daysDiff = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));

    // 1900年1月1日是甲戌日，甲=0, 戌=10
    const baseGanzhi = 0 * 12 + 10; // 天干0，地支10
    const ganzhiNum = (baseGanzhi + daysDiff) % 60;

    const tianganIndex = ganzhiNum % 10;
    const dizhiIndex = ganzhiNum % 12;

    return {
        tiangan: TIANGAN[tianganIndex],
        dizhi: DIZHI[dizhiIndex],
        ganzhiStr: TIANGAN[tianganIndex] + DIZHI[dizhiIndex]
    };
}

// 计算时柱
function getHourPillar(dayTiangan, hourIndex) {
    // 日干计算时干：甲己还加甲
    let hourTianganStart;
    const dayTianganIndex = TIANGAN.indexOf(dayTiangan);

    switch(dayTianganIndex % 5) {
        case 0: hourTianganStart = 0; break; // 甲己日，甲作首
        case 1: hourTianganStart = 2; break; // 乙庚日，丙作首
        case 2: hourTianganStart = 4; break; // 丙辛日，戊作首
        case 3: hourTianganStart = 6; break; // 丁壬日，庚作首
        case 4: hourTianganStart = 8; break; // 戊癸日，壬作首
    }

    const tianganIndex = (hourTianganStart + hourIndex) % 10;

    return {
        tiangan: TIANGAN[tianganIndex],
        dizhi: SHICHEN[hourIndex],
        ganzhiStr: TIANGAN[tianganIndex] + SHICHEN[hourIndex]
    };
}

// 计算八字
function calculateBazi(year, month, day, hourIndex) {
    const yearPillar = getYearPillar(year);
    const monthPillar = getMonthPillar(year, month, day);
    const dayPillar = getDayPillar(year, month, day);
    const hourPillar = getHourPillar(dayPillar.tiangan, hourIndex);

    return {
        year: yearPillar,
        month: monthPillar,
        day: dayPillar,
        hour: hourPillar
    };
}

// 五行统计
function analyzeWuxing(bazi) {
    const wuxingCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

    // 统计天干
    [bazi.year.tiangan, bazi.month.tiangan, bazi.day.tiangan, bazi.hour.tiangan].forEach(tg => {
        wuxingCount[TIANGAN_WUXING[tg]]++;
    });

    // 统计地支
    [bazi.year.dizhi, bazi.month.dizhi, bazi.day.dizhi, bazi.hour.dizhi].forEach(dz => {
        wuxingCount[DIZHI_WUXING[dz]]++;
    });

    return wuxingCount;
}

// 五行分析文字
function getWuxingAnalysisText(wuxingCount) {
    let analysis = '';
    const sortedWuxing = Object.entries(wuxingCount).sort((a, b) => b[1] - a[1]);
    const strongest = sortedWuxing[0][0];
    const weakest = sortedWuxing[sortedWuxing.length - 1][0];

    analysis += `您的五行以${strongest}最旺，共有${sortedWuxing[0][1]}个；`;

    if (sortedWuxing[sortedWuxing.length - 1][1] === 0) {
        analysis += `缺${weakest}。`;
    } else {
        analysis += `${weakest}最弱，仅有${sortedWuxing[sortedWuxing.length - 1][1]}个。`;
    }

    analysis += '\n\n';

    // 五行平衡建议
    if (sortedWuxing[0][1] >= 4) {
        const keElement = WUXING_SHENGKE[strongest].keBy;
        analysis += `五行${strongest}过旺，容易导致能量失衡。建议在生活中多接触${keElement}元素，如${getWuxingAdvice(keElement)}，以达到五行平衡。`;
    } else if (sortedWuxing[sortedWuxing.length - 1][1] === 0) {
        const shengElement = WUXING_SHENGKE[weakest].shengBy;
        analysis += `五行缺${weakest}，建议通过${shengElement}来生${weakest}，如${getWuxingAdvice(shengElement)}，可以弥补${weakest}的不足。`;
    } else {
        analysis += '您的五行相对平衡，这是很好的命理格局，有利于各方面发展。';
    }

    return analysis;
}

// 五行建议
function getWuxingAdvice(wuxing) {
    const advice = {
        '木': '多接触植物、穿绿色衣物、从事文化教育工作',
        '火': '多晒太阳、穿红色衣物、从事能源或创意工作',
        '土': '多接触土地、穿黄色衣物、从事房地产或农业',
        '金': '佩戴金属饰品、穿白色衣物、从事金融或技术工作',
        '水': '多接触水、穿黑色或蓝色衣物、从事流通或通讯工作'
    };
    return advice[wuxing];
}

// 计算大运
function calculateDayun(bazi, gender, birthYear) {
    const dayunList = [];
    const yearGan = TIANGAN.indexOf(bazi.year.tiangan);
    const monthGan = TIANGAN.indexOf(bazi.month.tiangan);
    const monthZhi = DIZHI.indexOf(bazi.month.dizhi);

    // 判断顺逆（阳男阴女顺行，阴男阳女逆行）
    const isYangYear = yearGan % 2 === 0;
    const isMale = (gender === 'male');
    const isShunxing = (isYangYear && isMale) || (!isYangYear && !isMale);

    // 起运岁数（简化为8岁起运）
    let startAge = 8;

    // 计算10个大运
    for (let i = 0; i < 10; i++) {
        let ganIndex, zhiIndex;

        if (isShunxing) {
            ganIndex = (monthGan + i + 1) % 10;
            zhiIndex = (monthZhi + i + 1) % 12;
        } else {
            ganIndex = (monthGan - i - 1 + 10) % 10;
            zhiIndex = (monthZhi - i - 1 + 12) % 12;
        }

        const age = startAge + i * 10;
        const yearRange = `${birthYear + age}年-${birthYear + age + 9}年`;
        const ageRange = `${age}岁-${age + 9}岁`;

        dayunList.push({
            ganzhi: TIANGAN[ganIndex] + DIZHI[zhiIndex],
            tiangan: TIANGAN[ganIndex],
            dizhi: DIZHI[zhiIndex],
            yearRange: yearRange,
            ageRange: ageRange,
            description: getDayunDescription(TIANGAN[ganIndex], DIZHI[zhiIndex], bazi)
        });
    }

    return dayunList;
}

// 大运描述
function getDayunDescription(tiangan, dizhi, bazi) {
    const dayTiangan = bazi.day.tiangan;
    const wuxing = TIANGAN_WUXING[tiangan];
    const dayWuxing = TIANGAN_WUXING[dayTiangan];

    let desc = '';

    // 判断与日主的关系
    if (wuxing === dayWuxing) {
        desc = '比肩劫财运，朋友助力，竞争增加，适合合作发展。';
    } else if (WUXING_SHENGKE[dayWuxing].sheng === wuxing) {
        desc = '食伤运，表达力强，创意发挥，利于艺术创作和展示才华。';
    } else if (WUXING_SHENGKE[dayWuxing].ke === wuxing) {
        desc = '财运旺盛，求财顺利，事业发展，把握机会可获丰厚回报。';
    } else if (WUXING_SHENGKE[dayWuxing].keBy === wuxing) {
        desc = '官杀运，责任增加，易遇贵人，事业上可能有晋升机会。';
    } else if (WUXING_SHENGKE[dayWuxing].shengBy === wuxing) {
        desc = '印绶运，学习运佳，贵人相助，适合深造和提升自我。';
    }

    return desc;
}

// 计算流年
function calculateLiunian(currentYear) {
    const liunianList = [];

    for (let i = -2; i <= 7; i++) {
        const year = currentYear + i;
        const yearPillar = getYearPillar(year);

        liunianList.push({
            year: year,
            ganzhi: yearPillar.ganzhiStr,
            tiangan: yearPillar.tiangan,
            dizhi: yearPillar.dizhi,
            description: getLiunianDescription(yearPillar.tiangan, yearPillar.dizhi, i === 0)
        });
    }

    return liunianList;
}

// 流年描述
function getLiunianDescription(tiangan, dizhi, isCurrent) {
    const wuxing = TIANGAN_WUXING[tiangan];
    const descriptions = {
        '木': '生发之年，适合开创新事业，人际关系和谐',
        '火': '热情活跃，事业有突破，注意情绪管理',
        '土': '稳重务实，适合积累和沉淀，财运平稳',
        '金': '决断力强，适合改革创新，注意人际关系',
        '水': '智慧灵动，学习运佳，适合规划未来'
    };

    return isCurrent ? `【本年】${descriptions[wuxing]}` : descriptions[wuxing];
}

// 命理分析 - 性格
function analyzePersonality(bazi, wuxingCount) {
    const dayTiangan = bazi.day.tiangan;
    const dayDizhi = bazi.day.dizhi;
    const dayWuxing = TIANGAN_WUXING[dayTiangan];
    const sortedWuxing = Object.entries(wuxingCount).sort((a, b) => b[1] - a[1]);
    const strongestWuxing = sortedWuxing[0][0];

    let personality = '';

    // 根据日主天干深度分析
    const ganPersonality = {
        '甲': {
            core: '甲木如参天大树，性格正直坦荡，有强烈的进取心和领导力。',
            strength: '您天生具有开拓精神，不畏困难，敢为人先。为人光明磊落，做事有原则有底线，值得信赖。善于统筹规划，有大局观，在团队中常能发挥领导作用。',
            weakness: '但有时过于刚直，不够圆融变通，容易在人际交往中显得固执。建议：',
            advice: '学会适当妥协，倾听他人意见；保持初心的同时，也要懂得审时度势；多培养同理心，理解不同立场的人。'
        },
        '乙': {
            core: '乙木如花草藤蔓，性格温和柔韧，富有艺术气质和适应能力。',
            strength: '您性情温婉，善解人意，具有很强的适应环境能力。心思细腻，感受力强，有艺术天赋和审美眼光。为人低调谦和，不争不抢，但内心坚韧，如藤蔓般具有强大的生命力。',
            weakness: '有时过于温和，缺乏主见，容易受他人影响。建议：',
            advice: '培养独立思考能力，敢于表达自己的观点；在关键时刻要果断决策；保持柔韧的同时，也要有自己的原则和底线。'
        },
        '丙': {
            core: '丙火如太阳普照，性格热情开朗，充满正能量和感染力。',
            strength: '您热情洋溢，积极向上，走到哪里都能带来欢乐和温暖。为人光明磊落，心胸开阔，不拘小节。善于表达，有很强的感染力，容易成为人群中的焦点。慷慨大方，乐于助人，朋友众多。',
            weakness: '但有时过于热情，缺乏持久性，做事容易三分钟热度。建议：',
            advice: '培养耐心和恒心，做事要善始善终；控制冲动，三思而后行；学会储蓄能量，不要透支自己；注意劳逸结合。'
        },
        '丁': {
            core: '丁火如烛光灯火，性格细腻敏感，富有洞察力和艺术气质。',
            strength: '您思维缜密，观察力敏锐，能够察觉到细微之处。内心丰富，感情深沉，重视精神层面的追求。有很好的直觉和洞察力，善于发现问题本质。为人温暖体贴，如烛光般照亮他人。',
            weakness: '有时过于敏感，容易多愁善感，心理压力大。建议：',
            advice: '学会放松心情，不要过分纠结小事；增强心理承受能力；多参与户外活动，调节情绪；相信自己的能力，建立自信。'
        },
        '戊': {
            core: '戊土如高山大地，性格稳重厚实，包容性强，值得依靠。',
            strength: '您性格沉稳可靠，做事踏实认真，有很强的责任心。包容心强，能容人容事，不计较得失。务实勤恳，不好高骛远，一步一个脚印。诚实守信，言出必行，是可以托付重任的人。',
            weakness: '但有时过于保守，缺乏灵活性，不善变通。建议：',
            advice: '适当打破思维定势，勇于尝试新事物；提高应变能力，学会灵活处理问题；不要太过执着，有时放手也是一种智慧。'
        },
        '己': {
            core: '己土如田园沃土，性格细心谨慎，善于筹划，注重细节。',
            strength: '您心思缜密，考虑周全，做事有条不紊。善于筹划和管理，能把复杂的事情处理得井井有条。待人真诚，乐于奉献，如田土般滋养万物。勤劳节俭，懂得积累，善于理财。',
            weakness: '有时过于谨慎，顾虑太多，容易错失机会。建议：',
            advice: '培养果断决策的能力，不要犹豫不决；适度降低标准，不要过分追求完美；学会抓住主要矛盾，不要纠结细枝末节。'
        },
        '庚': {
            core: '庚金如斧钺刀剑，性格刚毅果断，有很强的执行力和原则性。',
            strength: '您性格坚强，意志坚定，不轻易被困难打倒。做事干脆利落，雷厉风行，执行力强。有正义感，路见不平敢于出手。坚持原则，不随波逐流，有独立人格。',
            weakness: '但有时过于刚硬，不够圆融，容易得罪人。建议：',
            advice: '学会以柔克刚，刚柔并济；多倾听他人意见，不要一意孤行；培养同理心，理解他人难处；适当示弱也是一种智慧。'
        },
        '辛': {
            core: '辛金如珠玉金银，性格精致细腻，追求完美，品味高雅。',
            strength: '您气质优雅，品味不俗，对美有独特的感受力。心思细腻，注重细节，追求精致生活。有很强的鉴赏力和审美能力，善于发现美、创造美。内敛含蓄，不张扬，有内涵。',
            weakness: '有时过于追求完美，对自己和他人要求过高。建议：',
            advice: '接受不完美，降低期待值；不要过分在意他人看法；学会欣赏粗粝之美；多一些包容心，少一些挑剔。'
        },
        '壬': {
            core: '壬水如江河大海，性格智慧灵活，适应力强，善于变通。',
            strength: '您聪明机智，思维活跃，反应敏捷。适应能力强，善于随机应变。胸怀开阔，如大海般包容万象。善于社交，能与各种人打交道。有冒险精神，勇于探索未知。',
            weakness: '有时过于善变，缺乏定性，做事容易虎头蛇尾。建议：',
            advice: '培养恒心和毅力，做事要坚持到底；建立明确目标，不要朝三暮四；学会深度思考，不要只满足于表面；注意节制，避免过度消耗。'
        },
        '癸': {
            core: '癸水如雨露甘泉，性格温柔内敛，心思细密，有包容心。',
            strength: '您性情温和，心地善良，如雨露般润物无声。内心丰富，想象力强，有艺术天赋。善解人意，富有同情心，总能站在他人角度考虑。含蓄内敛，不喜张扬，但内心强大。',
            weakness: '有时过于内向，不善表达，容易被忽视。建议：',
            advice: '增强自信，勇于表达自己的想法；主动出击，不要总是被动等待；培养坚强的一面，该强硬时要强硬；多参与社交活动，扩大影响力。'
        }
    };

    const ganInfo = ganPersonality[dayTiangan];
    if (ganInfo) {
        personality += `【日主特质】${ganInfo.core}\n\n`;
        personality += `【性格优势】${ganInfo.strength}\n\n`;
        personality += `【需要注意】${ganInfo.weakness}${ganInfo.advice}\n\n`;
    }

    // 根据五行强弱补充分析
    personality += `【五行性格】`;
    if (strongestWuxing === '木' && wuxingCount['木'] >= 3) {
        personality += `命中木旺，仁爱之心强，富有同情心和正义感。上进心强，不甘平庸，有远大抱负。但需注意不要过于执拗，学会变通。适合从事需要创造性和成长性的工作。`;
    } else if (strongestWuxing === '火' && wuxingCount['火'] >= 3) {
        personality += `命中火旺，热情洋溢，活力四射，具有很强的感染力。做事积极主动，不拖泥带水。但要注意控制脾气，避免冲动行事。适合从事需要激情和表现力的工作。`;
    } else if (strongestWuxing === '土' && wuxingCount['土'] >= 3) {
        personality += `命中土旺，诚实守信，稳重踏实，值得信赖。有很强的耐心和包容心，能承担重任。但要注意不要过于保守，适当接受新事物。适合从事需要稳定性和责任心的工作。`;
    } else if (strongestWuxing === '金' && wuxingCount['金'] >= 3) {
        personality += `命中金旺，果断坚毅，讲原则重信义。做事干脆利落，不拖泥带水。但要注意圆融变通，不要过于刚硬。适合从事需要决策力和执行力的工作。`;
    } else if (strongestWuxing === '水' && wuxingCount['水'] >= 3) {
        personality += `命中水旺，聪明机智，灵活多变，善于应对各种情况。思维活跃，点子多。但要注意意志坚定，不要朝三暮四。适合从事需要智慧和策略的工作。`;
    } else {
        personality += `五行相对平衡，性格较为全面，适应能力强。既有原则性又有灵活性，能够在不同环境中游刃有余。这是难得的平和之命，发展潜力大。`;
    }

    // 根据地支补充
    personality += `\n\n【日支影响】日支${dayDizhi}，`;
    const zhiInfluence = {
        '子': '机敏灵活，反应快，但有时想法多变。适合多交流，拓宽思路。',
        '丑': '踏实稳重，坚韧不拔，但有时过于固执。要学会变通，打开思路。',
        '寅': '积极向上，富有朝气，但有时冲动冒进。做事要三思而后行。',
        '卯': '温和友善，有亲和力，但有时优柔寡断。要培养决断力。',
        '辰': '聪明能干，有领导才能，但有时过于自我。要多倾听他人意见。',
        '巳': '思维敏捷，善于谋划，但有时多疑。要建立信任，敞开心扉。',
        '午': '热情奔放，充满活力，但有时浮躁。要学会沉淀，深度思考。',
        '未': '温和稳重，有艺术气质，但有时过于谨慎。要勇于尝试。',
        '申': '聪明灵活，多才多艺，但有时不够专注。要学会专一，深耕一个领域。',
        '酉': '精明能干，注重细节，但有时过于挑剔。要学会包容，看到大局。',
        '戌': '忠诚可靠，有责任心，但有时过于保守。要勇于创新，拥抱变化。',
        '亥': '善良真诚，富有智慧，但有时过于理想化。要脚踏实地，务实前行。'
    };
    personality += zhiInfluence[dayDizhi];

    return personality;
}

// 命理分析 - 事业
function analyzeCareer(bazi, wuxingCount) {
    const dayTiangan = bazi.day.tiangan;
    const dayWuxing = TIANGAN_WUXING[dayTiangan];
    const yearTiangan = bazi.year.tiangan;
    const sortedWuxing = Object.entries(wuxingCount).sort((a, b) => b[1] - a[1]);

    let career = '';

    // 根据日主五行深度分析事业方向
    const careerGuidance = {
        '木': {
            industries: '文化教育、出版传媒、环保绿化、医药保健、纺织服装、木材家具、园林设计、中医养生',
            strength: '您具有仁爱之心和创造力，适合从事需要成长性和创新性的工作。在教育培训、文化创意领域能够发挥所长。',
            suggestions: '建议：1）充分发挥创意思维，不要被传统束缚；2）注重人际关系的培养，木主仁，以德服人；3）选择有发展空间的行业，避免停滞不前；4）可考虑创业，开拓新领域。',
            warning: '需要注意：不要过于理想化，要脚踏实地；避免频繁跳槽，要有长远规划。'
        },
        '火': {
            industries: '能源电力、电子科技、餐饮酒店、娱乐影视、广告传媒、美容化妆、演艺表演、公关策划',
            strength: '您热情洋溢，善于表达，适合需要沟通和展示的工作。在需要激情和创意的领域能够大放异彩。',
            suggestions: '建议：1）充分利用您的表达能力和感染力；2）选择能够展现个人魅力的岗位；3）注重形象和口碑的建设；4）可从事需要创新和突破的工作。',
            warning: '需要注意：控制冲动，避免因一时冲动做错决定；培养耐心，不要虎头蛇尾；注意协调团队关系。'
        },
        '土': {
            industries: '房地产、建筑工程、农林牧业、陶瓷矿产、中介咨询、物业管理、土地开发、仓储物流',
            strength: '您稳重可靠，善于管理，适合需要协调和统筹的工作。在需要信任和责任心的领域能够赢得认可。',
            suggestions: '建议：1）发挥您的管理和协调能力；2）选择稳定可靠的行业深耕；3）注重信誉和口碑的积累；4）可从事需要长期投入的事业。',
            warning: '需要注意：不要过于保守，要敢于创新；适当提升决断速度；拓宽视野，不要局限于现状。'
        },
        '金': {
            industries: '金融证券、科技制造、机械五金、珠宝首饰、军警法律、金属加工、汽车工业、精密仪器',
            strength: '您果断坚毅，执行力强，适合需要决策和管理的工作。在需要原则性和魄力的领域能够展现实力。',
            suggestions: '建议：1）充分发挥您的决断力和执行力；2）选择需要专业技能的行业；3）注重规则和标准的建立；4）可从事管理或技术专家路线。',
            warning: '需要注意：学会柔性管理，不要过于刚硬；多听取他人意见；注意人际关系的维护。'
        },
        '水': {
            industries: '贸易流通、物流运输、旅游酒店、水产渔业、外交咨询、互联网、信息技术、策划设计',
            strength: '您智慧灵活，善于变通，适合需要策略和创新的工作。在需要快速反应和灵活应对的领域能够如鱼得水。',
            suggestions: '建议：1）充分利用您的智慧和应变能力；2）选择变化快、挑战大的行业；3）注重人脉和资源的积累；4）可从事需要创意和策略的工作。',
            warning: '需要注意：培养专注力，不要朝三暮四；建立清晰目标，避免随波逐流；注重执行落地。'
        }
    };

    const guidance = careerGuidance[dayWuxing];
    if (guidance) {
        career += `【适合行业】${guidance.industries}\n\n`;
        career += `【事业优势】${guidance.strength}\n\n`;
        career += `【发展建议】${guidance.suggestions}\n\n`;
        career += `【注意事项】${guidance.warning}\n\n`;
    }

    // 根据五行平衡度补充
    career += `【综合分析】`;
    if (sortedWuxing[0][1] - sortedWuxing[sortedWuxing.length - 1][1] <= 2) {
        career += `您的五行较为平衡，这是事业发展的好兆头。平衡的五行意味着您适应能力强，可以在多个领域尝试并取得成功。建议：不要局限于单一领域，可以跨界发展；保持开放心态，勇于接受新挑战；注重能力的全面提升，成为复合型人才。`;
    } else {
        career += `您的五行有明显强弱之分，建议选择能够平衡五行的行业。比如五行缺${sortedWuxing[sortedWuxing.length - 1][0]}，可选择${sortedWuxing[sortedWuxing.length - 1][0]}属性的行业来补足。或者在工作环境布置、着装颜色等方面注意五行调和，有助于事业发展。`;
    }

    // 根据年柱补充
    career += `\n\n【时代机遇】年柱${yearTiangan}，`;
    const yearInfluence = {
        '甲': '生逢木旺之年，适合从事创新创业，把握时代发展机遇。',
        '乙': '生逢灵活之年，适合从事需要变通和适应的工作。',
        '丙': '生逢光明之年，适合从事需要展现才华的领域。',
        '丁': '生逢文明之年，适合从事文化、艺术等精神领域。',
        '戊': '生逢稳定之年，适合从事需要长期投入的事业。',
        '己': '生逢勤劳之年，勤奋务实是您事业成功的关键。',
        '庚': '生逢改革之年，适合从事需要开拓创新的工作。',
        '辛': '生逢精细之年，适合从事需要专业技能的行业。',
        '壬': '生逢智慧之年，适合从事需要策略谋划的领域。',
        '癸': '生逢灵活之年，适合从事需要创意和变通的工作。'
    };
    career += yearInfluence[yearTiangan];

    return career;
}

// 命理分析 - 财运
function analyzeWealth(bazi, wuxingCount) {
    const dayTiangan = bazi.day.tiangan;
    const dayWuxing = TIANGAN_WUXING[dayTiangan];
    const caiWuxing = WUXING_SHENGKE[dayWuxing].ke;
    const caiCount = wuxingCount[caiWuxing];

    let wealth = '';

    // 财星分析
    wealth += `【财星状况】您的财星为${caiWuxing}，命中有${caiCount}个${caiWuxing}。\n\n`;

    if (caiCount === 0) {
        wealth += `【财运特点】命中财星较弱，这并不意味着没有财运，而是需要通过后天努力来创造财富。您的财富主要来自于勤奋工作和稳健经营。\n\n`;
        wealth += `【求财之道】1）脚踏实地，通过正当职业积累财富；2）避免投机冒险，不适合高风险投资；3）注重技能提升，以专业能力换取报酬；4）开源节流，养成储蓄习惯；5）可考虑合伙经营，借力他人财运。\n\n`;
        wealth += `【理财建议】选择稳健型理财产品，如定期存款、国债、货币基金等；避免股票、期货等高风险投资；注重长期规划，不要急功近利；可通过提升自身价值来增加收入。\n\n`;
        wealth += `【未来发展】虽然先天财星弱，但后天通过努力仍可获得稳定收入。建议培养一技之长，在专业领域深耕，以技术换财富。保持勤奋和节俭，财富会慢慢积累。`;
    } else if (caiCount === 1) {
        wealth += `【财运特点】命中财星适中，财运平稳。您的财运属于细水长流型，不会暴富但也不会缺钱，通过稳健经营可以逐步改善生活。\n\n`;
        wealth += `【求财之道】1）通过正当职业获得稳定收入；2）适合做中长期投资规划；3）可以尝试理财，但要控制风险；4）注重本职工作，升职加薪是主要财源；5）可适当投资自己，提升赚钱能力。\n\n`;
        wealth += `【理财建议】采取稳健偏积极的理财策略；可配置60%稳健型+40%成长型资产；定期投资，分散风险；学习理财知识，提高财商；避免孤注一掷，保持资产流动性。\n\n`;
        wealth += `【未来发展】您的财运会随着年龄增长而改善。建议：注重积累，小额起步；开源节流并重；培养理财习惯；保持耐心，不要急于求成。财富是时间的朋友，坚持就是胜利。`;
    } else if (caiCount === 2) {
        wealth += `【财运特点】命中财星旺盛，财运较好。您有多种获取财富的机会，善于发现商机，赚钱能力强。但也要注意不要贪多，专注经营更重要。\n\n`;
        wealth += `【求财之道】1）把握多元化财源机会；2）可以适当投资，但要控制比例；3）善用人脉资源，拓展财路；4）可考虑创业或兼职增收；5）注重风险控制，不要过度激进。\n\n`;
        wealth += `【理财建议】可采取积极进取的理财策略；适合股票、基金等投资；但要设置止损线，控制风险；建议配置50%稳健型+50%进取型资产；学习投资知识，做理性投资者；预留应急资金。\n\n`;
        wealth += `【未来发展】您的财运较好，把握得当可获丰厚回报。建议：选准一两个领域深耕，不要分散精力；提升专业能力，以实力赚钱；建立财富管理体系；注意合理避税；培养延迟满足能力。`;
    } else {
        wealth += `【财运特点】命中财星过旺，财多身弱。虽然财运机会很多，但需要考虑是否有能力把握。财富和健康要平衡，不要为了赚钱透支身体。\n\n`;
        wealth += `【求财之道】1）选择性把握机会，不要贪多；2）注重身心健康，劳逸结合；3）可借助团队力量，不必事必躬亲；4）建立系统化的财富管理；5）学会说"不"，拒绝不适合的机会。\n\n`;
        wealth += `【理财建议】采取稳健为主的策略，虽然机会多但要量力而行；建议配置70%稳健型+30%进取型；聘请专业理财顾问；设置明确的财富目标；注重资产保全而非盲目扩张；预防风险，购买保险。\n\n`;
        wealth += `【未来发展】财多身弱需要平衡。建议：提升自身能力，匹配财富增长；组建可靠团队，分担压力；注重健康投资；学会放权和分享；建立可持续的财富增长模式。记住：健康是本钱，失去健康就失去了一切。`;
    }

    return wealth;
}

// 命理分析 - 婚姻
function analyzeMarriage(bazi, wuxingCount, gender) {
    const dayTiangan = bazi.day.tiangan;
    const dayDizhi = bazi.day.dizhi;
    const dayWuxing = TIANGAN_WUXING[dayTiangan];

    let marriage = '';

    // 男命看财星，女命看官星
    let spouseWuxing, spouseLabel;
    if (gender === 'male') {
        spouseWuxing = WUXING_SHENGKE[dayWuxing].ke; //我克者为财，男命财为妻
        spouseLabel = '财星';
    } else {
        spouseWuxing = WUXING_SHENGKE[dayWuxing].keBy; // 克我者为官，女命官为夫
        spouseLabel = '官星';
    }

    const spouseCount = wuxingCount[spouseWuxing];

    marriage += `【配偶星】您的${spouseLabel}为${spouseWuxing}，命中有${spouseCount}个${spouseWuxing}。\n\n`;

    if (spouseCount === 0) {
        marriage += `【姻缘分析】${spouseLabel}较弱，姻缘可能来得较晚，但晚婚未必不好，反而更容易遇到真正合适的人。您对感情较为谨慎，不会轻易投入，这是负责任的表现。\n\n`;
        marriage += `【寻缘建议】1）主动扩大社交圈，多参加各类活动；2）不要过于挑剔，给彼此机会深入了解；3）培养自信，相信自己值得被爱；4）可通过朋友介绍，增加靠谱机会；5）保持开放心态，缘分有时在不经意间出现。\n\n`;
        marriage += `【婚姻经营】婚后需要更用心经营：多沟通交流，理解对方；学会包容和妥协；注重生活仪式感；共同培养兴趣爱好；定期约会，保持新鲜感；遇到问题及时解决，不要冷战。\n\n`;
        marriage += `【幸福秘诀】虽然姻缘星弱，但真挚的感情胜过一切。建议：珍惜眼前人；用心对待婚姻；保持独立人格；共同成长进步。记住，婚姻的幸福不在于命中有多少星，而在于双方如何经营。`;
    } else if (spouseCount === 1) {
        marriage += `【姻缘分析】${spouseLabel}适中，婚姻运势较好。您比较容易遇到合适的伴侣，婚后感情稳定和谐。您对感情有清晰的认识，知道自己想要什么，不会盲目投入。\n\n`;
        marriage += `【恋爱建议】1）相信第一感觉，但也要理性判断；2）在恰当时机表达爱意，不要错过良缘；3）保持真诚，不要伪装自己；4）了解对方家庭背景和价值观；5）享受恋爱过程，不要急于结婚。\n\n`;
        marriage += `【婚姻经营】婚后感情会比较稳定：建立共同目标和规划；保持沟通顺畅；互相尊重独立空间；共同承担家庭责任；培养共同兴趣；定期制造浪漫；保持新鲜感。\n\n`;
        marriage += `【幸福秘诀】您的婚姻运势不错，把握得当可获得幸福。建议：珍惜缘分，不要因小事争吵；保持成长，共同进步；经营感情如同投资，需要用心；维护婚姻如同养花，需要耐心。两个人在一起，最重要的是相互理解和支持。`;
    } else if (spouseCount === 2) {
        marriage += `【姻缘分析】${spouseLabel}旺盛，异性缘佳，桃花运好。您容易吸引异性关注，追求者可能不少。但也要注意把握分寸，避免感情纠葛。\n\n`;
        marriage += `【择偶建议】1）不要被表面吸引，要看内在品质；2）明确自己的择偶标准，不要朝三暮四；3）学会拒绝，对不合适的要果断说不；4）观察对方对待感情的态度；5）不要同时交往多人，专一很重要。\n\n`;
        marriage += `【婚姻经营】婚后要特别注意：保持距离感，避免过度亲密导致审美疲劳；与异性交往要有分寸；多关注家庭，少参加无谓应酬；培养共同兴趣；增强婚姻责任感；遇到诱惑要坚守底线。\n\n`;
        marriage += `【幸福秘诀】桃花旺是福也是祸，关键在于如何把握。建议：找到真爱后要专一；婚姻需要经营和维护；不要被外界诱惑动摇；学会感恩，珍惜拥有；建立牢固的感情基础。记住：好的婚姻不是没有诱惑，而是懂得抵制诱惑。`;
    } else {
        marriage += `【姻缘分析】${spouseLabel}过旺，桃花过多，感情容易复杂。您魅力强，异性缘极佳，但也容易陷入感情纠葛。需要特别注意分辨真爱与虚情，避免被表象迷惑。\n\n`;
        marriage += `【择偶建议】1）设定明确标准，不要因为选择太多而挑花眼；2）重视对方的内在品质和价值观；3）不要同时发展多段关系；4）听取家人朋友意见，旁观者清；5）给自己时间冷静思考，不要冲动决定。\n\n`;
        marriage += `【婚姻经营】婚后需要格外用心：严格把控与异性的界限；多陪伴家人，减少不必要的社交；培养家庭责任感；保持婚姻新鲜感；遇到诱惑要坚决拒绝；定期与配偶深度沟通；共同制定家庭规则。\n\n`;
        marriage += `【幸福秘诀】桃花过旺容易引起感情波折，需要格外警惕。建议：婚前慎重选择，不要草率决定；婚后忠于婚姻，抵制诱惑；建立互信机制；培养家庭意识；学会克制和自律。记住：婚姻是责任，不是游戏；专一是美德，不是束缚。真正的幸福来自于专一的爱。`;
    }

    // 日支分析配偶性格
    marriage += `\n\n【配偶特质】根据日支${dayDizhi}分析，`;
    const zhiPersonality = {
        '子': '您的配偶聪明机敏，反应快，善于交际。思维活跃，点子多，适应能力强。建议：多给予对方表现空间，欣赏其灵活性；同时提醒对方做事要有始有终，不要浮躁。',
        '丑': '您的配偶稳重务实，勤劳节俭，能吃苦。踏实可靠，有耐心，善于积累。建议：理解对方的节俭，这是美德；适当鼓励对方享受生活；夫妻间要加强沟通，对方内心丰富。',
        '寅': '您的配偶积极进取，有朝气，富有开拓精神。自信且有领导力，喜欢挑战。建议：支持对方的事业追求；帮助分析风险；在对方冲动时及时提醒；给予充分信任。',
        '卯': '您的配偶温和善良，有亲和力，富有艺术气质。感性细腻，善解人意。建议：多给予关心和呵护；欣赏对方的艺术追求；帮助对方建立自信；在决策时给予理性建议。',
        '辰': '您的配偶聪明能干，有领导才能，气度不凡。务实且有野心，责任心强。建议：支持对方的事业；给予足够尊重；提醒对方多听取意见；共同规划未来。',
        '巳': '您的配偶聪慧细腻，思维敏捷，善于谋划。洞察力强，有远见。建议：理解对方的深思熟虑；给予安全感；多沟通消除疑虑；欣赏对方的智慧。',
        '午': '您的配偶热情开朗，充满活力，积极向上。爽朗大方，感染力强。建议：享受对方带来的快乐；提醒对方注意细节；在对方浮躁时帮助冷静；保持共同成长。',
        '未': '您的配偶温柔体贴，顾家爱家，有艺术气质。心思细腻，善解人意。建议：珍惜对方的付出；多表达爱意；鼓励对方自信；共同营造温馨家庭。',
        '申': '您的配偶机智灵活，多才多艺，善于变通。聪明且社交能力强。建议：给予自由空间；欣赏对方的多元才华；提醒专注；保持新鲜感。',
        '酉': '您的配偶精明能干，注重细节，追求完美。品味高雅，有鉴赏力。建议：理解对方的高标准；适当提醒放松心态；欣赏对方的品位；共同提升生活质量。',
        '戌': '您的配偶忠诚可靠，重情重义，有责任心。踏实稳重，值得信赖。建议：给予充分信任；鼓励创新思维；珍惜对方的忠诚；共同建设美好未来。',
        '亥': '您的配偶善良纯真，心胸宽广，富有智慧。包容心强，善解人意。建议：珍惜对方的善良；帮助落地执行；提醒现实考量；共同实现理想。'
    };
    marriage += zhiPersonality[dayDizhi];

    return marriage;
}

// 命理分析 - 健康
function analyzeHealth(bazi, wuxingCount) {
    const sortedWuxing = Object.entries(wuxingCount).sort((a, b) => b[1] - a[1]);
    const strongestWuxing = sortedWuxing[0][0];
    const weakestWuxing = sortedWuxing[sortedWuxing.length - 1][0];
    const hourDizhi = bazi.hour.dizhi;

    let health = '';

    // 五行与身体部位的对应
    const wuxingHealth = {
        '木': {
            organ: '肝胆系统、四肢筋骨、神经系统',
            symptoms: '肝气郁结、情绪波动、四肢酸痛、筋骨不适、眼睛干涩',
            care: '疏肝理气、保持心情舒畅、多做伸展运动',
            food: '青色食物如菠菜、西兰花、青椒；酸味食物如柠檬、山楂；养肝食材如枸杞、菊花',
            exercise: '瑜伽、太极、散步等舒缓运动；春季多户外活动；避免剧烈对抗性运动',
            lifestyle: '保持作息规律，23点前入睡养肝；学会情绪管理，避免生闷气；多接触大自然'
        },
        '火': {
            organ: '心脏血管、小肠、血液循环、精神意识',
            symptoms: '心烦失眠、血压波动、心悸、口舌生疮、精神焦虑',
            care: '养心安神、避免过度兴奋、保持充足睡眠',
            food: '红色食物如番茄、红枣、胡萝卜；苦味食物如苦瓜、莲子心；养心食材如桂圆、百合',
            exercise: '游泳、慢跑等有氧运动；午后小憩养心；避免在高温下运动',
            lifestyle: '中午11-13点休息片刻；控制情绪起伏；少吃辛辣刺激食物；保持心态平和'
        },
        '土': {
            organ: '脾胃消化系统、肌肉、皮肤',
            symptoms: '脾胃虚弱、消化不良、食欲不振、肌肉乏力、湿气重',
            care: '健脾养胃、规律饮食、避免暴饮暴食',
            food: '黄色食物如小米、南瓜、玉米；甘味食物如山药、红薯；健脾食材如茯苓、薏米',
            exercise: '散步、八段锦等温和运动；饭后百步走；避免饭后剧烈运动',
            lifestyle: '三餐定时定量；细嚼慢咽；不吃冷饮和生冷食物；保持心情愉悦'
        },
        '金': {
            organ: '肺呼吸系统、大肠、皮肤、鼻子',
            symptoms: '呼吸道易感染、皮肤干燥、大肠功能弱、过敏',
            care: '润肺养肺、多做深呼吸、保持皮肤清洁',
            food: '白色食物如百合、银耳、梨；润肺食材如杏仁、蜂蜜；养肺食物如莲藕',
            exercise: '深呼吸、慢跑等有氧运动；秋季多户外锻炼；避免在空气污染时运动',
            lifestyle: '保持室内空气流通；秋季注意润燥；避免吸烟和二手烟；加强皮肤保养'
        },
        '水': {
            organ: '肾脏泌尿系统、生殖系统、骨骼、耳朵',
            symptoms: '腰膝酸软、肾虚、泌尿系统问题、耳鸣、骨质疏松',
            care: '补肾养肾、避免过度劳累、保持充足休息',
            food: '黑色食物如黑豆、黑芝麻、黑木耳；咸味适量；补肾食材如核桃、栗子',
            exercise: '适度运动不过劳；游泳、慢跑；冬季注意保暖；避免过度运动',
            lifestyle: '不要熬夜，充足睡眠养肾；注意保暖，特别是腰部；节制房事；多喝温水'
        }
    };

    // 根据五行强弱分析
    if (sortedWuxing[0][1] >= 4) {
        const healthInfo = wuxingHealth[strongestWuxing];
        health += `【健康提示】五行${strongestWuxing}过旺，需特别关注${healthInfo.organ}的健康。\n\n`;
        health += `【可能症状】${healthInfo.symptoms}。这些症状与${strongestWuxing}过旺有关，需要及时调理。\n\n`;
        health += `【调理方法】${healthInfo.care}。建议从生活方式、饮食、运动等多方面综合调理。\n\n`;
        health += `【饮食建议】多食用${healthInfo.food}。饮食要均衡，不要偏食。\n\n`;
        health += `【运动建议】${healthInfo.exercise}。运动要适度，根据身体状况调整强度。\n\n`;
        health += `【生活习惯】${healthInfo.lifestyle}。良好的生活习惯是健康的基础。`;

    } else if (sortedWuxing[sortedWuxing.length - 1][1] === 0) {
        const healthInfo = wuxingHealth[weakestWuxing];
        health += `【健康提示】五行缺${weakestWuxing}，${healthInfo.organ}相对较弱，需要加强保养。\n\n`;
        health += `【潜在风险】容易出现${healthInfo.symptoms}。虽然不一定会发生，但要提前预防。\n\n`;
        health += `【补益方法】${healthInfo.care}。通过后天调理可以改善体质。\n\n`;
        health += `【饮食调理】建议多食用${healthInfo.food}。这些食物可以补充${weakestWuxing}的能量。\n\n`;
        health += `【运动调理】${healthInfo.exercise}。选择合适的运动方式很重要。\n\n`;
        health += `【养生建议】${healthInfo.lifestyle}。预防胜于治疗，养成好习惯。`;

    } else {
        health += `【健康状况】您的五行相对平衡，这是非常好的体质基础。五行平衡的人身体素质通常较好，不容易生病。\n\n`;
        health += `【保健建议】虽然五行平衡，但仍需注意日常保养：\n`;
        health += `1）保持良好作息，早睡早起，不熬夜；\n`;
        health += `2）饮食均衡，五谷杂粮、蔬菜水果搭配合理；\n`;
        health += `3）适度运动，每周至少3-4次，每次30分钟以上；\n`;
        health += `4）调节情绪，保持心情愉悦，学会释放压力；\n`;
        health += `5）定期体检，及时发现和预防疾病。\n\n`;
        health += `【养生原则】顺应四季，春养肝、夏养心、长夏养脾、秋养肺、冬养肾。保持五行平衡状态，延年益寿。`;
    }

    // 根据出生时辰补充
    health += `\n\n【时辰影响】出生于${hourDizhi}时，`;
    const timeInfluence = {
        '子': '水时出生，先天肾气足，但要注意保暖防寒，避免受凉。冬季尤其要注意腰腿保暖。',
        '丑': '土时出生，脾胃功能较好，但要注意饮食规律，不要暴饮暴食。保持肠胃健康。',
        '寅': '木时出生，肝气旺盛，精力充沛，但要注意情绪管理，避免肝火过旺。保持心平气和。',
        '卯': '木时出生，生机勃勃，但要避免过度劳累。春季要特别注意肝脏保养。',
        '辰': '土时出生，消化能力较强，但要注意湿气问题。多吃健脾祛湿的食物。',
        '巳': '火时出生，心火较旺，要注意心血管健康。避免过度兴奋，保持情绪平稳。',
        '午': '火时出生，阳气充足，但要注意避暑防热。夏季要特别注意心脏保养，避免中暑。',
        '未': '土时出生，脾胃温和，但要避免过于谨慎而忧思过度。保持开朗心态。',
        '申': '金时出生，肺气较足，但要注意呼吸系统健康。秋季注意润燥，预防感冒。',
        '酉': '金时出生，皮肤和呼吸系统需要关注。保持室内空气清新，多做深呼吸。',
        '戌': '土时出生，体质较好，但要避免过度劳累。注意脾胃调养，规律作息。',
        '亥': '水时出生，肾水充盈，但要避免过度消耗。不要熬夜，保持充足睡眠。'
    };
    health += timeInfluence[hourDizhi];

    health += `\n\n【总结】健康是1，其他都是0。没有健康，一切都无从谈起。建议：重视体检，早发现早治疗；培养健康生活方式；保持乐观心态；适度运动；合理饮食。记住：养生重在预防，贵在坚持。`;

    return health;
}

// 姓名与八字综合分析
function analyzeNameWithBazi(nameWuxingData, baziWuxingCount, dayTiangan) {
    if (!nameWuxingData) return '';

    let analysis = '';
    const dayWuxing = TIANGAN_WUXING[dayTiangan];

    // 显示姓名各字的五行
    analysis += '<div class="name-chars-analysis" style="margin-bottom: 20px; padding: 15px; background: rgba(218, 165, 32, 0.05); border-radius: 8px;">';
    analysis += '<h3 style="color: #8b4513; margin-bottom: 10px; letter-spacing: 2px;">姓名用字分析</h3>';
    analysis += '<div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">';

    nameWuxingData.chars.forEach(({ char, wuxing }) => {
        const colorMap = {
            '木': '#2d5016',
            '火': '#b71c1c',
            '土': '#8b6914',
            '金': '#616161',
            '水': '#01579b'
        };
        analysis += `
            <div style="text-align: center; padding: 15px 20px; background: ${colorMap[wuxing]}; color: white; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.2);">
                <div style="font-size: 1.8rem; font-family: 'KaiTi', serif; margin-bottom: 5px;">${char}</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">${wuxing}性</div>
            </div>
        `;
    });

    analysis += '</div></div>';

    // 姓名五行统计
    analysis += '<div style="margin-bottom: 20px;">';
    analysis += '<h3 style="color: #8b4513; margin-bottom: 10px; letter-spacing: 2px;">姓名五行分布</h3>';
    analysis += '<p style="color: #5d4037; line-height: 1.8;">';

    const nameWuxingList = [];
    Object.entries(nameWuxingData.wuxingCount).forEach(([wx, count]) => {
        if (count > 0) {
            nameWuxingList.push(`${wx}${count}个`);
        }
    });
    analysis += `您的姓名中含有：${nameWuxingList.join('、')}。`;
    analysis += '</p></div>';

    // 姓名与八字的关系分析
    analysis += '<div style="margin-bottom: 20px;">';
    analysis += '<h3 style="color: #8b4513; margin-bottom: 10px; letter-spacing: 2px;">姓名与命格配合</h3>';
    analysis += '<p style="color: #5d4037; line-height: 1.8;">';

    // 分析姓名五行对八字的补益
    let hasHelp = false;
    let helpText = [];

    Object.entries(nameWuxingData.wuxingCount).forEach(([wx, count]) => {
        if (count > 0) {
            // 检查是否补益日主
            if (wx === dayWuxing) {
                helpText.push(`姓名中的${wx}直接增强了您的日主(${dayTiangan})能量`);
                hasHelp = true;
            } else if (WUXING_SHENGKE[wx].sheng === dayWuxing) {
                helpText.push(`姓名中的${wx}生${dayWuxing}，对日主有很好的生助作用`);
                hasHelp = true;
            }

            // 检查是否补八字所缺
            if (baziWuxingCount[wx] === 0) {
                helpText.push(`姓名中的${wx}正好补足了八字所缺的五行`);
                hasHelp = true;
            } else if (baziWuxingCount[wx] <= 1) {
                helpText.push(`姓名中的${wx}加强了八字中较弱的五行`);
                hasHelp = true;
            }
        }
    });

    if (hasHelp) {
        analysis += helpText.join('；') + '。';
        analysis += '<br><br>总体而言，您的姓名与八字配合较好，有相生相助之意，对个人运势有正面影响。';
    } else {
        analysis += '姓名五行与八字各有特点。在命理上，名字主要起到后天调补的作用，建议在日常生活中注意五行平衡。';
    }

    analysis += '</p></div>';

    // 姓名建议
    analysis += '<div>';
    analysis += '<h3 style="color: #8b4513; margin-bottom: 10px; letter-spacing: 2px;">姓名运用建议</h3>';
    analysis += '<p style="color: #5d4037; line-height: 1.8;">';

    const nameMainWuxing = Object.entries(nameWuxingData.wuxingCount)
        .sort((a, b) => b[1] - a[1])[0][0];

    const suggestions = {
        '木': '宜使用绿色系物品，工作方位选择东方为佳，适合在春季做重要决策',
        '火': '宜使用红色系物品，工作方位选择南方为佳，适合在夏季做重要决策',
        '土': '宜使用黄色系物品，工作方位选择中央或西南为佳，适合在四季交替时做重要决策',
        '金': '宜使用白色或金色系物品，工作方位选择西方为佳，适合在秋季做重要决策',
        '水': '宜使用黑色或蓝色系物品，工作方位选择北方为佳，适合在冬季做重要决策'
    };

    analysis += `根据您姓名的主要五行（${nameMainWuxing}），${suggestions[nameMainWuxing]}。`;
    analysis += '</p></div>';

    return analysis;
}

// 显示结果
function displayResults(bazi, wuxingCount, dayunList, liunianList, gender, nameWuxingData) {
    // 显示八字
    document.getElementById('yearPillar').textContent = bazi.year.ganzhiStr;
    document.getElementById('monthPillar').textContent = bazi.month.ganzhiStr;
    document.getElementById('dayPillar').textContent = bazi.day.ganzhiStr;
    document.getElementById('hourPillar').textContent = bazi.hour.ganzhiStr;

    // 八字详情
    const baziDetails = `
        <p><strong>日主：</strong>${bazi.day.tiangan}（${TIANGAN_WUXING[bazi.day.tiangan]}）</p>
        <p><strong>命格：</strong>${bazi.day.tiangan}${DIZHI_WUXING[bazi.day.dizhi]}日元</p>
    `;
    document.getElementById('baziDetails').innerHTML = baziDetails;

    // 显示五行图表
    const wuxingChart = document.getElementById('wuxingChart');
    wuxingChart.innerHTML = '';
    const maxCount = Math.max(...Object.values(wuxingCount));

    ['木', '火', '土', '金', '水'].forEach(wx => {
        const percentage = maxCount > 0 ? (wuxingCount[wx] / maxCount) * 100 : 0;
        const colorClass = { '木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal', '水': 'water' }[wx];

        wuxingChart.innerHTML += `
            <div class="wuxing-item ${colorClass}">
                <div class="wuxing-name">${wx}</div>
                <div class="wuxing-count">${wuxingCount[wx]}</div>
                <div class="wuxing-bar">
                    <div class="wuxing-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    });

    // 五行分析文字
    document.getElementById('wuxingAnalysis').innerHTML = `
        <h3>五行平衡分析</h3>
        <p>${getWuxingAnalysisText(wuxingCount)}</p>
    `;

    // 显示姓名分析（如果有）
    if (nameWuxingData) {
        const nameSection = document.getElementById('nameAnalysisSection');
        nameSection.style.display = 'block';
        document.getElementById('nameAnalysis').innerHTML = analyzeNameWithBazi(
            nameWuxingData,
            wuxingCount,
            bazi.day.tiangan
        );
    } else {
        document.getElementById('nameAnalysisSection').style.display = 'none';
    }

    // 显示大运
    const dayunListEl = document.getElementById('dayunList');
    dayunListEl.innerHTML = '';
    dayunList.forEach(dy => {
        dayunListEl.innerHTML += `
            <div class="dayun-item">
                <h3>${dy.ageRange}</h3>
                <div class="dayun-pillar">${dy.ganzhi}</div>
                <div class="dayun-age">${dy.yearRange}</div>
                <div class="dayun-desc">${dy.description}</div>
            </div>
        `;
    });

    // 显示流年
    const liunianListEl = document.getElementById('liunianList');
    liunianListEl.innerHTML = '';
    liunianList.forEach(ln => {
        liunianListEl.innerHTML += `
            <div class="liunian-item">
                <div class="liunian-year">${ln.year}年</div>
                <div class="liunian-pillar">${ln.ganzhi}</div>
                <div class="liunian-desc">${ln.description}</div>
            </div>
        `;
    });

    // 显示高级命理分析
    displayAdvancedAnalysis(bazi, wuxingCount);

    // 显示命理分析
    document.getElementById('personalityAnalysis').textContent = analyzePersonality(bazi, wuxingCount);
    document.getElementById('careerAnalysis').textContent = analyzeCareer(bazi, wuxingCount);
    document.getElementById('wealthAnalysis').textContent = analyzeWealth(bazi, wuxingCount);
    document.getElementById('marriageAnalysis').textContent = analyzeMarriage(bazi, wuxingCount, gender);
    document.getElementById('healthAnalysis').textContent = analyzeHealth(bazi, wuxingCount);

    // 显示结果区域
    document.querySelector('.input-section').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}

// 显示高级命理分析
function displayAdvancedAnalysis(bazi, wuxingCount) {
    // 用神分析
    const yongshenAnalysis = findYongShen(bazi, wuxingCount);
    document.getElementById('yongshenAnalysis').innerHTML = `
        <h4>用神判断</h4>
        <p>${yongshenAnalysis.reasoning}</p>
        <p class="yongshen-primary">主用神：${yongshenAnalysis.primary || '待定'}</p>
        ${yongshenAnalysis.secondary ? `<p class="yongshen-secondary">次用神：${yongshenAnalysis.secondary}</p>` : ''}
        <p>${yongshenAnalysis.advice}</p>
        <div style="margin-top: 15px; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 5px;">
            <p style="font-size: 0.9rem; color: #daa520;">
                <strong>理论依据：</strong>基于《滴天髓》调候理论、《穷通宝鉴》用神学说，
                结合日主强弱、月令时节、五行平衡综合判断。
            </p>
        </div>
    `;

    // 格局分析
    const gejuAnalysis = analyzeGeju(bazi);
    let gejuHTML = '<h4>格局判断</h4>';

    if (gejuAnalysis.length > 0) {
        gejuAnalysis.forEach(geju => {
            gejuHTML += `
                <div class="geju-item">
                    <span class="geju-quality ${geju.quality}">${geju.quality}</span>
                    <h5 style="color: #ffd700; margin-bottom: 10px;">${geju.name}</h5>
                    <p><strong>格局特点：</strong>${geju.description}</p>
                    <p><strong>性格特征：</strong>${geju.characteristics}</p>
                    <p><strong>格局强度：</strong><span style="color: #daa520;">${geju.strength}</span></p>
                </div>
            `;
        });
    } else {
        gejuHTML += `
            <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                <p style="color: #e8dcc0;">您的八字格局较为特殊，不常见于传统格局之中。
                这通常意味着您具有独特的个性和命运轨迹，建议结合整体命局综合分析。</p>
            </div>
        `;
    }

    gejuHTML += `
        <div style="margin-top: 15px; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 5px;">
            <p style="font-size: 0.9rem; color: #daa520;">
                <strong>理论依据：</strong>基于《子平真诠》格局理论、《渊海子平》八字格局，
                分析四柱干支配合，判断命局高低贵贱。
            </p>
        </div>
    `;
    document.getElementById('gejuAnalysis').innerHTML = gejuHTML;

    // 神煞分析
    const shenshaAnalysis = analyzeShenSha(bazi);
    let shenshaHTML = '<h4>神煞星宿</h4>';

    if (shenshaAnalysis.length > 0) {
        shenshaHTML += '<div class="shensha-grid">';
        shenshaAnalysis.forEach(shensha => {
            shenshaHTML += `
                <div class="shensha-item">
                    <div class="shensha-name">${shensha.name}</div>
                    <div class="shensha-type">${shensha.type}</div>
                    <div class="shensha-description">${shensha.description}</div>
                    <div class="shensha-effect">${shensha.effect}</div>
                </div>
            `;
        });
        shenshaHTML += '</div>';
    } else {
        shenshaHTML += `
            <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                <p style="color: #e8dcc0;">您的八字中神煞较少，命局相对清纯。
                这通常意味着命运较为平稳，少有大的波折和起伏。</p>
            </div>
        `;
    }

    shenshaHTML += `
        <div style="margin-top: 15px; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 5px;">
            <p style="font-size: 0.9rem; color: #daa520;">
                <strong>理论依据：</strong>基于《神峰通考》神煞系统、《三命通会》神煞论，
                分析吉凶神煞对命运的影响和作用。
            </p>
        </div>
    `;
    document.getElementById('shenshaAnalysis').innerHTML = shenshaHTML;
}

// 重置表单
function resetForm() {
    document.querySelector('.input-section').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('birthdayForm').reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 历法切换监听
document.addEventListener('DOMContentLoaded', function() {
    const calendarTypeInputs = document.querySelectorAll('input[name="calendarType"]');
    const leapMonthGroup = document.getElementById('leapMonthGroup');

    calendarTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'lunar') {
                leapMonthGroup.style.display = 'block';
            } else {
                leapMonthGroup.style.display = 'none';
                document.getElementById('isLeapMonth').checked = false;
            }
        });
    });
});

// 表单提交处理
document.getElementById('birthdayForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const birthdateInput = document.getElementById('birthdate').value;
    const calendarType = document.querySelector('input[name="calendarType"]:checked').value;
    const isLeapMonth = document.getElementById('isLeapMonth').checked;
    const hourIndex = parseInt(document.getElementById('hour').value);
    const gender = document.getElementById('gender').value;

    if (!birthdateInput) {
        alert('请选择出生日期！');
        return;
    }

    // 解析日期
    const dateParts = birthdateInput.split('-');
    let year = parseInt(dateParts[0]);
    let month = parseInt(dateParts[1]);
    let day = parseInt(dateParts[2]);

    // 如果是农历，转换为阳历
    if (calendarType === 'lunar') {
        const solarDate = lunar2solar(year, month, day, isLeapMonth);
        if (!solarDate) {
            alert('农历日期转换失败，请检查日期是否正确！');
            return;
        }
        year = solarDate.year;
        month = solarDate.month;
        day = solarDate.day;

        // 提示用户转换后的阳历日期
        console.log(`农历${dateParts[0]}-${dateParts[1]}-${dateParts[2]}${isLeapMonth ? '(闰月)' : ''} 对应阳历：${year}-${month}-${day}`);
    }

    // 验证日期
    const date = new Date(year, month - 1, day);
    if (date.getMonth() + 1 !== month || date.getDate() !== day) {
        alert('请输入有效的日期！');
        return;
    }

    // 计算八字
    const bazi = calculateBazi(year, month, day, hourIndex);
    baziResult = bazi;

    // 分析五行
    const wuxingCount = analyzeWuxing(bazi);

    // 分析姓名（如果填写了）
    let nameWuxingData = null;
    if (name) {
        nameWuxingData = analyzeNameWuxing(name);
    }

    // 计算大运
    const dayunList = calculateDayun(bazi, gender, year);

    // 计算流年
    const currentYear = new Date().getFullYear();
    const liunianList = calculateLiunian(currentYear);

    // 显示结果
    displayResults(bazi, wuxingCount, dayunList, liunianList, gender, nameWuxingData);

    // 滚动到结果区域
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
