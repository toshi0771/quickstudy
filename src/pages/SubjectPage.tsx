import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// University levels for the dropdown
const UNIVERSITY_LEVELS = [
  { id: 'todai-kyodai', label: '東大京大' },
  { id: 'kyutei', label: '旧帝大' },
  { id: 'chiho-kokuritu', label: '地方国立大' },
  { id: 'sokei', label: '早慶' },
  { id: 'march', label: 'MARCH' },
  { id: 'nikko-komasen', label: '日東駒専' }
]

// Subject definitions
const SUBJECTS = {
  english: {
    name: '英語',
    categories: ['文法', '読解', '単語']
  },
  math: {
    name: '数学',
    categories: ['数Ⅰ+A', '数Ⅱ+B', '数Ⅲ+C']
  },
  japanese: {
    name: '国語',
    categories: ['現代文', '古文', '漢文']
  },
  science: {
    name: '理科',
    categories: ['物理', '化学', '生物']
  },
  social: {
    name: '社会',
    categories: ['日本史', '世界史', '地理']
  }
}

// Study schedule data (3 years × 3 terms) - 年・学期を縦、項目を横に配置
const STUDY_SCHEDULE = {
  english: {
    文法: {
      '1年1学期': { topic: '基礎文法・五文型', important: true },
      '1年2学期': { topic: '時制・完了形', important: true },
      '1年3学期': { topic: '受動態・助動詞', important: false },
      '2年1学期': { topic: '不定詞・動名詞', important: true },
      '2年2学期': { topic: '分詞・関係詞', important: true },
      '2年3学期': { topic: '仮定法・倒置', important: true },
      '3年1学期': { topic: '文法総合演習', important: true },
      '3年2学期': { topic: '入試文法問題', important: true },
      '3年3学期': { topic: '最終確認・弱点補強', important: false }
    },
    読解: {
      '1年1学期': { topic: '英文構造把握', important: false },
      '1年2学期': { topic: '段落読解', important: true },
      '1年3学期': { topic: '長文読解基礎', important: true },
      '2年1学期': { topic: '説明文・論説文', important: true },
      '2年2学期': { topic: '物語文・小説', important: false },
      '2年3学期': { topic: '科学・社会系文章', important: true },
      '3年1学期': { topic: '入試長文演習', important: true },
      '3年2学期': { topic: '速読・精読技法', important: true },
      '3年3学期': { topic: '過去問演習', important: true }
    },
    単語: {
      '1年1学期': { topic: '基礎単語1000', important: true },
      '1年2学期': { topic: '基礎単語2000', important: true },
      '1年3学期': { topic: '応用単語3000', important: false },
      '2年1学期': { topic: '応用単語4000', important: true },
      '2年2学期': { topic: '発展単語5000', important: false },
      '2年3学期': { topic: '入試頻出単語', important: true },
      '3年1学期': { topic: '単語総復習', important: true },
      '3年2学期': { topic: '語法・慣用表現', important: true },
      '3年3学期': { topic: '最終確認', important: false }
    }
  },
  math: {
    '数Ⅰ+A': {
      '1年1学期': { topic: '数と式・集合と命題・2次関数・2次不等式', important: true },
      '1年2学期': { topic: '図形と計量・三角比・場合の数・確率', important: true },
      '1年3学期': { topic: '図形の性質・整数・データの分析・復習', important: false },
      '2年1学期': { topic: '数Ⅰ+A総合演習・応用問題', important: true },
      '2年2学期': { topic: 'より難度の高い入試問題演習', important: true },
      '2年3学期': { topic: '入試問題演習・発展学習', important: true },
      '3年1学期': { topic: '数Ⅰ+A過去問演習', important: true },
      '3年2学期': { topic: '入試演習・弱点補強', important: true },
      '3年3学期': { topic: '最終確認・総まとめ', important: true }
    },
    '数Ⅱ+B': {
      '1年1学期': { topic: '基礎準備', important: false },
      '1年2学期': { topic: '基礎準備・先取り学習', important: false },
      '1年3学期': { topic: '図形と方程式基礎・三角関数準備', important: false },
      '2年1学期': { topic: '図形と方程式・式と証明', important: true },
      '2年2学期': { topic: '三角関数・指数対数関数・微分法・積分法', important: true },
      '2年3学期': { topic: '数列・ベクトル・統計的推測', important: true },
      '3年1学期': { topic: '数Ⅱ+B総合演習', important: true },
      '3年2学期': { topic: '入試問題演習', important: true },
      '3年3学期': { topic: '過去問・最終確認', important: true }
    },
    '数Ⅲ+C': {
      '1年1学期': { topic: '基礎準備', important: false },
      '1年2学期': { topic: '基礎準備', important: false },
      '1年3学期': { topic: '基礎準備', important: false },
      '2年1学期': { topic: '関数・極限基礎', important: true },
      '2年2学期': { topic: '関数・極限・微分法', important: true },
      '2年3学期': { topic: '積分法', important: true },
      '3年1学期': { topic: '複素数平面・式と曲線', important: true },
      '3年2学期': { topic: '平面上のベクトル・空間ベクトル', important: true },
      '3年3学期': { topic: '数Ⅲ+C総合・入試演習', important: true }
    }
  },
  japanese: {
    現代文: {
      '1年1学期': { topic: '現代文読解基礎', important: true },
      '1年2学期': { topic: '論説文・評論文', important: true },
      '1年3学期': { topic: '小説・随筆', important: false },
      '2年1学期': { topic: '文章構成・論理', important: true },
      '2年2学期': { topic: '語彙・漢字', important: false },
      '2年3学期': { topic: '記述問題対策', important: true },
      '3年1学期': { topic: '入試演習', important: true },
      '3年2学期': { topic: '過去問演習', important: true },
      '3年3学期': { topic: '最終確認', important: false }
    },
    古文: {
      '1年1学期': { topic: '古典文法基礎・用言', important: true },
      '1年2学期': { topic: '助動詞・敬語・古文単語', important: true },
      '1年3学期': { topic: '作品読解・文学史', important: true },
      '2年1学期': { topic: '古文総合演習', important: true },
      '2年2学期': { topic: '入試古文演習', important: true },
      '2年3学期': { topic: '過去問演習', important: true },
      '3年1学期': { topic: '入試対策演習', important: true },
      '3年2学期': { topic: '弱点補強・実践演習', important: true },
      '3年3学期': { topic: '最終確認', important: false }
    },
    漢文: {
      '1年1学期': { topic: '基礎準備', important: false },
      '1年2学期': { topic: '基礎準備', important: false },
      '1年3学期': { topic: '漢文基礎・句法・漢詩・故事成語', important: true },
      '2年1学期': { topic: '重要句法・思想・歴史', important: true },
      '2年2学期': { topic: '文章読解・総合演習', important: true },
      '2年3学期': { topic: '入試演習準備', important: false },
      '3年1学期': { topic: '入試漢文演習', important: true },
      '3年2学期': { topic: '過去問演習', important: true },
      '3年3学期': { topic: '最終確認', important: false }
    }
  },
  science: {
    物理: {
      '1年1学期': { topic: '基礎準備', important: false },
      '1年2学期': { topic: '基礎準備', important: false },
      '1年3学期': { topic: '基礎準備', important: false },
      '2年1学期': { topic: '基礎準備', important: false },
      '2年2学期': { topic: '基礎準備', important: false },
      '2年3学期': { topic: '運動の表し方・運動の法則・仕事とエネルギー', important: true },
      '3年1学期': { topic: '円運動・単振動・波動・音波', important: true },
      '3年2学期': { topic: '電磁気学・原子・素粒子・入試演習', important: true },
      '3年3学期': { topic: '過去問・最終確認', important: true }
    },
    化学: {
      '1年1学期': { topic: '基礎準備', important: false },
      '1年2学期': { topic: '基礎準備', important: false },
      '1年3学期': { topic: '原子・分子・イオン・化学結合', important: true },
      '2年1学期': { topic: '物質量・化学反応式・酸・塩基・中和', important: true },
      '2年2学期': { topic: '酸化・還元・有機化学基礎', important: true },
      '2年3学期': { topic: '有機化学応用・無機化学', important: true },
      '3年1学期': { topic: '化学総合演習', important: true },
      '3年2学期': { topic: '入試演習・過去問演習', important: true },
      '3年3学期': { topic: '最終確認', important: false }
    },
    生物: {
      '1年1学期': { topic: '細胞と分子・代謝・呼吸', important: true },
      '1年2学期': { topic: '光合成・遺伝・DNA', important: true },
      '1年3学期': { topic: '生物の体内環境・反応と調節・生態・進化', important: true },
      '2年1学期': { topic: '生物総合演習', important: true },
      '2年2学期': { topic: '実験考察問題・入試演習', important: true },
      '2年3学期': { topic: '過去問演習', important: true },
      '3年1学期': { topic: '入試対策演習', important: true },
      '3年2学期': { topic: '弱点補強・実践演習', important: true },
      '3年3学期': { topic: '最終確認', important: false }
    }
  },
  social: {
    日本史: {
      '1年1学期': { topic: '基礎準備', important: false },
      '1年2学期': { topic: '基礎準備', important: false },
      '1年3学期': { topic: '基礎準備', important: false },
      '2年1学期': { topic: '基礎準備', important: false },
      '2年2学期': { topic: '基礎準備', important: false },
      '2年3学期': { topic: '原始・古代・中世・鎌倉・室町・近世・江戸時代', important: true },
      '3年1学期': { topic: '近代・明治・大正・昭和戦前・戦後・現代', important: true },
      '3年2学期': { topic: '文化史・外交史・テーマ史・入試演習', important: true },
      '3年3学期': { topic: '過去問・最終確認', important: true }
    },
    世界史: {
      '1年1学期': { topic: '基礎準備', important: false },
      '1年2学期': { topic: '基礎準備', important: false },
      '1年3学期': { topic: '古代文明・中世ヨーロッパ・近世ヨーロッパ', important: true },
      '2年1学期': { topic: '近代革命・産業革命', important: true },
      '2年2学期': { topic: '帝国主義・第一次大戦・戦間期・第二次大戦', important: true },
      '2年3学期': { topic: '冷戦・現代世界・テーマ史', important: true },
      '3年1学期': { topic: '世界史総合演習', important: true },
      '3年2学期': { topic: '入試演習・過去問演習', important: true },
      '3年3学期': { topic: '最終確認', important: false }
    },
    地理: {
      '1年1学期': { topic: '地形・気候・人口', important: true },
      '1年2学期': { topic: '都市・村落・農業・工業', important: true },
      '1年3学期': { topic: '交通・貿易・総合地理', important: true },
      '2年1学期': { topic: '地域地理総合演習', important: true },
      '2年2学期': { topic: '統計・地図問題・入試演習', important: true },
      '2年3学期': { topic: '過去問演習', important: true },
      '3年1学期': { topic: '入試対策演習', important: true },
      '3年2学期': { topic: '弱点補強・実践演習', important: true },
      '3年3学期': { topic: '最終確認', important: false }
    }
  }
}

// 完全な参考書データ（理科・社会も含む）
const REFERENCE_BOOKS = {
  'todai-kyodai': {
    english: [
      { category: '文法', books: ['全解説頻出英文法・語法問題1000', 'Next Stage英文法・語法問題', '英文法ファイナル問題集'] },
      { category: '読解', books: ['やっておきたい英長文700', 'ポラリス英語長文3', '東大の英語27カ年'] },
      { category: '単語', books: ['鉄緑会東大英単語熟語', 'DUO 3.0', 'リンガメタリカ'] }
    ],
    math: [
      { category: '数Ⅰ+A', books: ['青チャート数学I+A', '1対1対応の演習', '新数学スタンダード演習'] },
      { category: '数Ⅱ+B', books: ['青チャート数学II+B', '1対1対応の演習', '新数学スタンダード演習'] },
      { category: '数Ⅲ+C', books: ['青チャート数学III', '1対1対応の演習', '新数学スタンダード演習'] }
    ],
    japanese: [
      { category: '現代文', books: ['現代文読解力の開発講座', 'アクセス現代文', '得点奪取現代文'] },
      { category: '古文', books: ['古文上達基礎編', 'マドンナ古文単語230', '最強の古文'] },
      { category: '漢文', books: ['漢文道場', 'ヤマのヤマ漢文', '得点奪取漢文'] }
    ],
    science: [
      { category: '物理', books: ['新・物理入門', '物理重要問題集', '難問題の系統とその解き方'] },
      { category: '化学', books: ['化学の新研究', '化学重要問題集', '新理系の化学問題100選'] },
      { category: '生物', books: ['大森徹の最強講義117講', '生物重要問題集', '大森徹の生物 遺伝問題の解法'] }
    ],
    social: [
      { category: '日本史', books: ['詳説日本史研究', '日本史B一問一答', '東大の日本史27カ年'] },
      { category: '世界史', books: ['詳説世界史研究', '世界史B一問一答', '東大の世界史27カ年'] },
      { category: '地理', books: ['新詳地理B', '地理B一問一答', '村瀬のゼロからわかる地理B'] }
    ]
  },
  'kyutei': {
    english: [
      { category: '文法', books: ['Next Stage英文法・語法問題', 'Vintage英文法・語法', 'スクランブル英文法・語法'] },
      { category: '読解', books: ['やっておきたい英長文500', 'ポラリス英語長文2', 'レベル別長文問題集5'] },
      { category: '単語', books: ['システム英単語', 'ターゲット1900', '速読英単語必修編'] }
    ],
    math: [
      { category: '数Ⅰ+A', books: ['黄チャート数学I+A', '基礎問題精講', '標準問題精講'] },
      { category: '数Ⅱ+B', books: ['黄チャート数学II+B', '基礎問題精講', '標準問題精講'] },
      { category: '数Ⅲ+C', books: ['黄チャート数学III', '基礎問題精講', '標準問題精講'] }
    ],
    japanese: [
      { category: '現代文', books: ['田村のやさしく語る現代文', '現代文キーワード読解', '入試現代文へのアクセス'] },
      { category: '古文', books: ['富井の古典文法をはじめからていねいに', '古文単語ゴロゴ', 'ステップアップノート30古典文法'] },
      { category: '漢文', books: ['漢文早覚え速答法', '基礎からのジャンプアップノート漢文', '漢文句法ドリルと演習'] }
    ],
    science: [
      { category: '物理', books: ['物理のエッセンス', '良問の風物理頻出・標準入試問題集', '名問の森物理'] },
      { category: '化学', books: ['化学基礎問題精講', '化学標準問題精講', 'セミナー化学基礎+化学'] },
      { category: '生物', books: ['田部の生物基礎をはじめからていねいに', '生物基礎問題精講', 'セミナー生物基礎+生物'] }
    ],
    social: [
      { category: '日本史', books: ['石川晶康 日本史B講義の実況中継', '日本史B標準問題精講', 'スピードマスター日本史問題集'] },
      { category: '世界史', books: ['青木裕司 世界史B講義の実況中継', '世界史B標準問題精講', 'スピードマスター世界史問題集'] },
      { category: '地理', books: ['瀬川聡 地理B講義の実況中継', '地理B標準問題精講', '村瀬のゼロからわかる地理B'] }
    ]
  },
  'chiho-kokuritu': {
    english: [
      { category: '文法', books: ['スクランブル英文法・語法', 'アップグレード英文法・語法問題', 'エバーグリーン'] },
      { category: '読解', books: ['やっておきたい英長文300', 'レベル別長文問題集4', 'イチから鍛える英語長文500'] },
      { category: '数A', books: ['白チャート数学A', '基礎問題精講数学A', 'チェック&リピート数学A'] },
      { category: '数B', books: ['白チャート数学B', '基礎問題精講数学B', 'チェック&リピート数学B'] },
      { category: '数C', books: ['白チャート数学C', '基礎問題精講数学C', 'チェック&リピート数学C'] },
      { category: '数Ⅰ+A', books: ['白チャート数学I+A', '基礎問題精講', '4STEP数学'] },
      { category: '数Ⅱ+B', books: ['白チャート数学II+B', '基礎問題精講', '4STEP数学'] },
      { category: '数Ⅲ+C', books: ['白チャート数学III', '基礎問題精講', '4STEP数学'] }
    ],
    japanese: [
      { category: '現代文', books: ['船口のゼロから読み解く最強の現代文', '現代文のトレーニング私大編', 'アクセス現代文'] },
      { category: '古文', books: ['望月光古典文法講義の実況中継', '古文単語315', 'ステップアップノート30古典文法'] },
      { category: '漢文', books: ['漢文早覚え速答法', '三羽邦美の漢文教室', '基礎からのジャンプアップノート漢文'] }
    ],
    science: [
      { category: '物理', books: ['物理基礎問題精講', '物理のエッセンス', 'リードα物理基礎・物理'] },
      { category: '化学', books: ['はじめからていねいに化学基礎', '化学基礎問題精講', 'リードα化学基礎・化学'] },
      { category: '生物', books: ['田部の生物基礎をはじめからていねいに', '生物基礎問題精講', 'リードα生物基礎・生物'] }
    ],
    social: [
      { category: '日本史', books: ['金谷の日本史「なぜ」と「流れ」がわかる本', '日本史基礎問題精講', '一問一答日本史B'] },
      { category: '世界史', books: ['青木裕司の世界史B「なぜ」と「流れ」がわかる本', '世界史基礎問題精講', '一問一答世界史B'] },
      { category: '地理', books: ['山岡の地理B教室', '地理B基礎問題精講', '一問一答地理B'] }
    ]
  },
  'sokei': {
    english: [
      { category: '文法', books: ['Next Stage英文法・語法問題', 'Vintage英文法・語法', 'アップグレード英文法・語法問題'] },
      { category: '読解', books: ['やっておきたい英長文500', 'ポラリス英語長文2', '関正生の英語長文ポラリス2'] },
      { category: '数A', books: ['黄チャート数学A', '基礎問題精講数学A', 'スピードマスター数学A'] },
      { category: '数B', books: ['黄チャート数学B', '基礎問題精講数学B', 'スピードマスター数学B'] },
      { category: '数C', books: ['黄チャート数学C', '基礎問題精講数学C', 'スピードマスター数学C'] },
      { category: '数Ⅰ+A', books: ['黄チャート数学I+A', '基礎問題精講', '標準問題精講'] },
      { category: '数Ⅱ+B', books: ['黄チャート数学II+B', '基礎問題精講', '標準問題精講'] },
      { category: '数Ⅲ+C', books: ['黄チャート数学III', '基礎問題精講', '標準問題精講'] }
    ],
    japanese: [
      { category: '現代文', books: ['現代文読解力の開発講座', '現代文キーワード読解', 'アクセス現代文'] },
      { category: '古文', books: ['富井の古典文法をはじめからていねいに', 'マドンナ古文単語230', '古文上達基礎編'] },
      { category: '漢文', books: ['漢文早覚え速答法', 'ヤマのヤマ漢文', '基礎からのジャンプアップノート漢文'] }
    ],
    science: [
      { category: '物理', books: ['物理のエッセンス', '良問の風物理頻出・標準入試問題集', '重要問題集物理'] },
      { category: '化学', books: ['化学基礎問題精講', '化学標準問題精講', '重要問題集化学'] },
      { category: '生物', books: ['田部の生物基礎をはじめからていねいに', '生物基礎問題精講', '重要問題集生物'] }
    ],
    social: [
      { category: '日本史', books: ['石川晶康 日本史B講義の実況中継', '日本史標準問題精講', '日本史B重要問題集'] },
      { category: '世界史', books: ['青木裕司 世界史B講義の実況中継', '世界史標準問題精講', '世界史B重要問題集'] },
      { category: '地理', books: ['瀬川聡 地理B講義の実況中継', '地理標準問題精講', '地理B重要問題集'] }
    ]
  },
  'march': {
    english: [
      { category: '文法', books: ['スクランブル英文法・語法', 'アップグレード英文法・語法問題', 'Vintage英文法・語法'] },
      { category: '読解', books: ['やっておきたい英長文300', 'レベル別長文問題集4', 'イチから鍛える英語長文500'] },
      { category: '数A', books: ['白チャート数学A', '基礎問題精講数学A', 'スピードマスター数学A'] },
      { category: '数B', books: ['白チャート数学B', '基礎問題精講数学B', 'スピードマスター数学B'] },
      { category: '数C', books: ['白チャート数学C', '基礎問題精講数学C', 'スピードマスター数学C'] },
      { category: '数Ⅰ+A', books: ['白チャート数学I+A', '基礎問題精講', 'チェック&リピート数学'] },
      { category: '数Ⅱ+B', books: ['白チャート数学II+B', '基礎問題精講', 'チェック&リピート数学'] },
      { category: '数Ⅲ+C', books: ['白チャート数学III', '基礎問題精講', 'チェック&リピート数学'] }
    ],
    japanese: [
      { category: '現代文', books: ['船口のゼロから読み解く最強の現代文', '現代文のトレーニング私大編', '田村のやさしく語る現代文'] },
      { category: '古文', books: ['望月光古典文法講義の実況中継', '古文単語315', 'ステップアップノート30古典文法'] },
      { category: '漢文', books: ['漢文早覚え速答法', '三羽邦美の漢文教室', '基礎からのジャンプアップノート漢文'] }
    ],
    science: [
      { category: '物理', books: ['物理基礎問題精講', 'リードα物理基礎・物理', 'セミナー物理基礎+物理'] },
      { category: '化学', books: ['はじめからていねいに化学基礎', 'リードα化学基礎・化学', 'セミナー化学基礎+化学'] },
      { category: '生物', books: ['田部の生物基礎をはじめからていねいに', 'リードα生物基礎・生物', 'セミナー生物基礎+生物'] }
    ],
    social: [
      { category: '日本史', books: ['金谷の日本史「なぜ」と「流れ」がわかる本', '日本史基礎問題精講', 'センター試験日本史Bの点数が面白いほどとれる本'] },
      { category: '世界史', books: ['青木裕司の世界史B「なぜ」と「流れ」がわかる本', '世界史基礎問題精講', 'センター試験世界史Bの点数が面白いほどとれる本'] },
      { category: '地理', books: ['山岡の地理B教室', '地理基礎問題精講', 'センター試験地理Bの点数が面白いほどとれる本'] }
    ]
  },
  'nikko-komasen': {
    english: [
      { category: '文法', books: ['フォレスト英文法', 'アップグレード英文法・語法問題', 'エバーグリーン'] },
      { category: '読解', books: ['レベル別長文問題集3', 'イチから鍛える英語長文300', 'やっておきたい英長文300'] },
      { category: '数A', books: ['やさしい高校数学A', '初めから始める数学A', '基礎問題精講数学A'] },
      { category: '数B', books: ['やさしい高校数学B', '初めから始める数学B', '基礎問題精講数学B'] },
      { category: '数C', books: ['やさしい高校数学C', '初めから始める数学C', '基礎問題精講数学C'] },
      { category: '数Ⅰ+A', books: ['やさしい高校数学', '初めから始める数学', '基礎問題精講'] },
      { category: '数Ⅱ+B', books: ['やさしい高校数学', '初めから始める数学', '基礎問題精講'] },
      { category: '数Ⅲ+C', books: ['やさしい高校数学', '初めから始める数学', '基礎問題精講'] }
    ],
    japanese: [
      { category: '現代文', books: ['船口のゼロから読み解く最強の現代文', 'ことばはちからダ！', '田村のやさしく語る現代文'] },
      { category: '古文', books: ['望月光古典文法講義の実況中継', '古文単語315', 'マドンナ古文'] },
      { category: '漢文', books: ['漢文早覚え速答法', '三羽邦美の漢文教室', 'ステップアップノート10漢文'] }
    ],
    science: [
      { category: '物理', books: ['橋元の物理基礎をはじめからていねいに', '物理基礎問題精講', 'やさしい高校物理'] },
      { category: '化学', books: ['はじめからていねいに化学基礎', '化学基礎問題精講', 'やさしい高校化学'] },
      { category: '生物', books: ['田部の生物基礎をはじめからていねいに', '生物基礎問題精講', 'やさしい高校生物'] }
    ],
    social: [
      { category: '日本史', books: ['金谷の日本史「なぜ」と「流れ」がわかる本', '日本史基礎問題精講', 'はじめからていねいに日本史B'] },
      { category: '世界史', books: ['青木裕司の世界史B「なぜ」と「流れ」がわかる本', '世界史基礎問題精講', 'はじめからていねいに世界史B'] },
      { category: '地理', books: ['山岡の地理B教室', '地理基礎問題精講', 'はじめからていねいに地理B'] }
    ]
  }
}

function SubjectPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const [selectedLevel, setSelectedLevel] = useState('')
  const [showReferences, setShowReferences] = useState(false)

  const subject = SUBJECTS[subjectId as keyof typeof SUBJECTS]
  const scheduleData = STUDY_SCHEDULE[subjectId as keyof typeof STUDY_SCHEDULE]

  if (!subject || !scheduleData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">科目が見つかりません</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    )
  }

  // Generate terms for 3 years × 3 terms
  const generateTerms = () => {
    const terms = []
    for (let year = 1; year <= 3; year++) {
      for (let term = 1; term <= 3; term++) {
        terms.push(`${year}年${term}学期`)
      }
    }
    return terms
  }

  const terms = generateTerms()

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level)
    setShowReferences(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            トップページに戻る
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {subject.name} 学習スケジュール
          </h1>
          <p className="text-lg text-gray-600">
            3年間の体系的な学習プランで効率的に学習を進めましょう
          </p>
        </div>

        {/* Subject Schedule Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="bg-blue-600 text-white py-4 px-6">
            <h2 className="text-2xl font-bold">{subject.name} 3年間学習計画</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border-r">学期</th>
                  {subject.categories.map((category) => (
                    <th key={category} className="px-4 py-3 text-center font-medium text-gray-700 border-r last:border-r-0 min-w-48">
                      {category}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {terms.map((term) => (
                  <tr key={term} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium text-gray-900 border-r bg-gray-50">
                      {term}
                    </td>
                    {subject.categories.map((category) => {
                      const cellData = scheduleData[category]?.[term]
                      return (
                        <td key={category} className="px-4 py-4 border-r last:border-r-0 text-center">
                          <div className="text-sm font-medium text-gray-900">
                            {cellData?.topic || ''}
                            {cellData?.important && (
                              <span className="ml-1 text-red-500 text-lg">★</span>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* University Level Selection */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            大学レベル別推奨参考書・問題集
          </h2>
          
          <div className="mb-8">
            <label htmlFor="university-level" className="block text-lg font-medium text-gray-700 mb-4">
              目標大学レベルを選択してください
            </label>
            <select
              id="university-level"
              value={selectedLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="w-full max-w-md mx-auto block px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            >
              <option value="">大学レベルを選択</option>
              {UNIVERSITY_LEVELS.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reference Books Display */}
          {showReferences && selectedLevel && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
                {UNIVERSITY_LEVELS.find(level => level.id === selectedLevel)?.label} レベル推奨参考書
              </h3>
              
              <div className="border rounded-lg overflow-hidden">
                <h4 className="bg-gray-100 text-lg font-semibold py-3 px-6">
                  {subject.name}
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        {subject.categories.map((category) => (
                          <th key={category} className="px-6 py-3 text-left font-medium text-gray-700 border-r last:border-r-0">
                            {category}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {subject.categories.map((category) => {
                          const books = REFERENCE_BOOKS[selectedLevel as keyof typeof REFERENCE_BOOKS]?.[subjectId as keyof typeof REFERENCE_BOOKS['todai-kyodai']]?.find(item => item.category === category)?.books || []
                          
                          return (
                            <td key={category} className="px-6 py-4 border-r last:border-r-0 align-top">
                              <ul className="space-y-2">
                                {books.map((book, index) => (
                                  <li key={index} className="text-sm text-gray-700 border-b pb-1 last:border-b-0">
                                    {book}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          )
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-500 text-lg">★</span>
            <span className="text-gray-700 font-medium">印は入試に特に重要な単元です</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubjectPage