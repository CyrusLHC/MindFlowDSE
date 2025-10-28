import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useLanguage } from '../lib/language-context';
import { useUser } from '../lib/user-context';
import { ImageWithFallback } from './figma/ImageWithFallback';

const subjects = [
  { id: 'chinese', zh: '中文', en: 'Chinese', icon: '📖', color: 'from-red-400 to-pink-400' },
  { id: 'english', zh: '英文', en: 'English', icon: '🔤', color: 'from-blue-400 to-cyan-400' },
  { id: 'math', zh: '數學', en: 'Math', icon: '🔢', color: 'from-purple-400 to-pink-400' },
  { id: 'science', zh: '常識', en: 'General Studies', icon: '🌍', color: 'from-green-400 to-emerald-400' },
  { id: 'history', zh: '歷史', en: 'History', icon: '📜', color: 'from-yellow-400 to-orange-400' },
  { id: 'physics', zh: '物理', en: 'Physics', icon: '⚛️', color: 'from-indigo-400 to-blue-400' },
  { id: 'biology', zh: '生物', en: 'Biology', icon: '🧬', color: 'from-teal-400 to-green-400' },
  { id: 'chemistry', zh: '化學', en: 'Chemistry', icon: '🧪', color: 'from-pink-400 to-purple-400' },
  { id: 'economics', zh: '經濟', en: 'Economics', icon: '💰', color: 'from-emerald-400 to-teal-400' },
  { id: 'computer', zh: '電腦', en: 'Computer Science', icon: '💻', color: 'from-gray-400 to-slate-400' },
];

const questions: { [key: string]: Array<{ q: { zh: string; en: string }; options: Array<{ zh: string; en: string }>; correct: number; image?: string }> } = {
  chinese: [
    { q: { zh: '「快樂」的反義詞是？', en: 'What is the antonym of "happy"?' }, options: [{ zh: '傷心', en: 'sad' }, { zh: '興奮', en: 'excited' }, { zh: '平靜', en: 'calm' }, { zh: '緊張', en: 'nervous' }], correct: 0 },
    { q: { zh: '以下哪個是形容詞？', en: 'Which of the following is an adjective?' }, options: [{ zh: '跑步', en: 'run' }, { zh: '美麗', en: 'beautiful' }, { zh: '桌子', en: 'table' }, { zh: '快速地', en: 'quickly' }], correct: 1 },
    { q: { zh: '「書」的量詞是？', en: 'What is the measure word for "book"?' }, options: [{ zh: '本', en: 'běn' }, { zh: '隻', en: 'zhī' }, { zh: '條', en: 'tiáo' }, { zh: '個', en: 'gè' }], correct: 0 },
    { q: { zh: '哪個字是動詞？', en: 'Which is a verb?' }, options: [{ zh: '美麗', en: 'beautiful' }, { zh: '跑步', en: 'run' }, { zh: '書', en: 'book' }, { zh: '快速', en: 'fast' }], correct: 1 },
    { q: { zh: '「學習」的同義詞是？', en: 'Synonym of "learn"?' }, options: [{ zh: '玩耍', en: 'play' }, { zh: '睡覺', en: 'sleep' }, { zh: '讀書', en: 'study' }, { zh: '吃飯', en: 'eat' }], correct: 2 },
    { q: { zh: '「大」的反義詞是？', en: 'Antonym of "big"?' }, options: [{ zh: '高', en: 'tall' }, { zh: '小', en: 'small' }, { zh: '寬', en: 'wide' }, { zh: '長', en: 'long' }], correct: 1 },
    { q: { zh: '哪個是名詞？', en: 'Which is a noun?' }, options: [{ zh: '跑', en: 'run' }, { zh: '快', en: 'fast' }, { zh: '書', en: 'book' }, { zh: '好', en: 'good' }], correct: 2 },
    { q: { zh: '成語「一石二鳥」是什麼意思？', en: 'What does "一石二鳥" mean?' }, options: [{ zh: '很重', en: 'very heavy' }, { zh: '一舉兩得', en: 'achieve two at once' }, { zh: '很難', en: 'very difficult' }, { zh: '很快', en: 'very fast' }], correct: 1 },
    { q: { zh: '「他」是什麼詞？', en: 'What type of word is "he"?' }, options: [{ zh: '動詞', en: 'verb' }, { zh: '形容詞', en: 'adjective' }, { zh: '代詞', en: 'pronoun' }, { zh: '名詞', en: 'noun' }], correct: 2 },
    { q: { zh: '哪個句子是正確的？', en: 'Which sentence is correct?' }, options: [{ zh: '我很喜歡你', en: 'I like you very much' }, { zh: '我喜歡很你', en: 'I like very you' }, { zh: '很我喜歡你', en: 'Very I like you' }, { zh: '喜歡我很你', en: 'Like I very you' }], correct: 0 },
  ],
  english: [
    { q: { zh: 'What is the past tense of "go"?', en: 'What is the past tense of "go"?' }, options: [{ zh: 'goed', en: 'goed' }, { zh: 'went', en: 'went' }, { zh: 'gone', en: 'gone' }, { zh: 'goes', en: 'goes' }], correct: 1 },
    { q: { zh: 'Which word is a noun?', en: 'Which word is a noun?' }, options: [{ zh: 'quickly', en: 'quickly' }, { zh: 'happiness', en: 'happiness' }, { zh: 'run', en: 'run' }, { zh: 'beautiful', en: 'beautiful' }], correct: 1 },
    { q: { zh: 'Choose: ___ apple', en: 'Choose: ___ apple' }, options: [{ zh: 'a', en: 'a' }, { zh: 'an', en: 'an' }, { zh: 'the', en: 'the' }, { zh: 'no article', en: 'no article' }], correct: 1, image: 'https://images.unsplash.com/photo-1713959925337-3a79df64fccd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
    { q: { zh: 'What is the plural of "child"?', en: 'What is the plural of "child"?' }, options: [{ zh: 'childs', en: 'childs' }, { zh: 'children', en: 'children' }, { zh: 'childrens', en: 'childrens' }, { zh: 'child', en: 'child' }], correct: 1 },
    { q: { zh: 'Which is correct: "He ___ happy."?', en: 'Which is correct: "He ___ happy."?' }, options: [{ zh: 'am', en: 'am' }, { zh: 'is', en: 'is' }, { zh: 'are', en: 'are' }, { zh: 'be', en: 'be' }], correct: 1 },
    { q: { zh: 'Choose the adjective:', en: 'Choose the adjective:' }, options: [{ zh: 'run', en: 'run' }, { zh: 'quickly', en: 'quickly' }, { zh: 'beautiful', en: 'beautiful' }, { zh: 'happiness', en: 'happiness' }], correct: 2 },
    { q: { zh: 'Past tense of "eat"?', en: 'Past tense of "eat"?' }, options: [{ zh: 'eated', en: 'eated' }, { zh: 'ate', en: 'ate' }, { zh: 'eaten', en: 'eaten' }, { zh: 'eats', en: 'eats' }], correct: 1 },
    { q: { zh: '"They ___ studying." Which is correct?', en: '"They ___ studying." Which is correct?' }, options: [{ zh: 'is', en: 'is' }, { zh: 'am', en: 'am' }, { zh: 'are', en: 'are' }, { zh: 'be', en: 'be' }], correct: 2 },
    { q: { zh: 'Which is a verb?', en: 'Which is a verb?' }, options: [{ zh: 'book', en: 'book' }, { zh: 'run', en: 'run' }, { zh: 'happy', en: 'happy' }, { zh: 'quickly', en: 'quickly' }], correct: 1 },
    { q: { zh: 'Choose: "___ umbrella"', en: 'Choose: "___ umbrella"' }, options: [{ zh: 'a', en: 'a' }, { zh: 'an', en: 'an' }, { zh: 'the', en: 'the' }, { zh: 'no article', en: 'no article' }], correct: 1 },
  ],
  math: [
    { q: { zh: '12 × 8 = ?', en: '12 × 8 = ?' }, options: [{ zh: '84', en: '84' }, { zh: '96', en: '96' }, { zh: '104', en: '104' }, { zh: '88', en: '88' }], correct: 1 },
    { q: { zh: '如果 x + 5 = 12，x = ?', en: 'If x + 5 = 12, x = ?' }, options: [{ zh: '5', en: '5' }, { zh: '7', en: '7' }, { zh: '17', en: '17' }, { zh: '6', en: '6' }], correct: 1 },
    { q: { zh: '一個圓的面積公式是？', en: 'Area of a circle?' }, options: [{ zh: '2πr', en: '2πr' }, { zh: 'πr²', en: 'πr²' }, { zh: 'πd', en: 'πd' }, { zh: 'r²', en: 'r²' }], correct: 1 },
    { q: { zh: '25 + 17 = ?', en: '25 + 17 = ?' }, options: [{ zh: '42', en: '42' }, { zh: '32', en: '32' }, { zh: '52', en: '52' }, { zh: '41', en: '41' }], correct: 0 },
    { q: { zh: '100 - 37 = ?', en: '100 - 37 = ?' }, options: [{ zh: '73', en: '73' }, { zh: '63', en: '63' }, { zh: '67', en: '67' }, { zh: '53', en: '53' }], correct: 1 },
    { q: { zh: '15 × 6 = ?', en: '15 × 6 = ?' }, options: [{ zh: '80', en: '80' }, { zh: '90', en: '90' }, { zh: '100', en: '100' }, { zh: '85', en: '85' }], correct: 1 },
    { q: { zh: '144 ÷ 12 = ?', en: '144 ÷ 12 = ?' }, options: [{ zh: '10', en: '10' }, { zh: '11', en: '11' }, { zh: '12', en: '12' }, { zh: '13', en: '13' }], correct: 2 },
    { q: { zh: '2³ = ?', en: '2³ = ?' }, options: [{ zh: '6', en: '6' }, { zh: '8', en: '8' }, { zh: '9', en: '9' }, { zh: '4', en: '4' }], correct: 1 },
    { q: { zh: '√64 = ?', en: '√64 = ?' }, options: [{ zh: '6', en: '6' }, { zh: '7', en: '7' }, { zh: '8', en: '8' }, { zh: '9', en: '9' }], correct: 2 },
    { q: { zh: '20% of 200 = ?', en: '20% of 200 = ?' }, options: [{ zh: '20', en: '20' }, { zh: '40', en: '40' }, { zh: '60', en: '60' }, { zh: '80', en: '80' }], correct: 1 },
  ],
  science: [
    { q: { zh: '地球有幾個大洲？', en: 'How many continents are there?' }, options: [{ zh: '5個', en: '5' }, { zh: '6個', en: '6' }, { zh: '7個', en: '7' }, { zh: '8個', en: '8' }], correct: 2 },
    { q: { zh: '水的化學式是？', en: 'Chemical formula for water?' }, options: [{ zh: 'H₂O', en: 'H₂O' }, { zh: 'CO₂', en: 'CO₂' }, { zh: 'O₂', en: 'O₂' }, { zh: 'H₂', en: 'H₂' }], correct: 0 },
    { q: { zh: '太陽是一顆？', en: 'The sun is a?' }, options: [{ zh: '行星', en: 'planet' }, { zh: '恆星', en: 'star' }, { zh: '衛星', en: 'satellite' }, { zh: '彗星', en: 'comet' }], correct: 1 },
    { q: { zh: '植物進行光合作用需要？', en: 'Photosynthesis needs?' }, options: [{ zh: '陽光', en: 'sunlight' }, { zh: '黑暗', en: 'darkness' }, { zh: '寒冷', en: 'cold' }, { zh: '鹽分', en: 'salt' }], correct: 0 },
    { q: { zh: '人體最大的器官是？', en: 'Largest human organ?' }, options: [{ zh: '心臟', en: 'heart' }, { zh: '肺', en: 'lung' }, { zh: '皮膚', en: 'skin' }, { zh: '肝臟', en: 'liver' }], correct: 2 },
    { q: { zh: '聲音在什麼介質中傳播最快？', en: 'Sound travels fastest in?' }, options: [{ zh: '空氣', en: 'air' }, { zh: '水', en: 'water' }, { zh: '固體', en: 'solid' }, { zh: '真空', en: 'vacuum' }], correct: 2 },
    { q: { zh: '月球繞地球一周需要多少天？', en: 'Moon orbits Earth in?' }, options: [{ zh: '7天', en: '7 days' }, { zh: '14天', en: '14 days' }, { zh: '28天', en: '28 days' }, { zh: '365天', en: '365 days' }], correct: 2 },
    { q: { zh: '哪種動物是哺乳動物？', en: 'Which is a mammal?' }, options: [{ zh: '鯊魚', en: 'shark' }, { zh: '海豚', en: 'dolphin' }, { zh: '鱷魚', en: 'crocodile' }, { zh: '蛇', en: 'snake' }], correct: 1 },
    { q: { zh: '地球自轉一周需要多少時間？', en: 'Earth rotates in?' }, options: [{ zh: '12小時', en: '12 hours' }, { zh: '24小時', en: '24 hours' }, { zh: '30小時', en: '30 hours' }, { zh: '48小時', en: '48 hours' }], correct: 1 },
    { q: { zh: '彩虹有幾種顏色？', en: 'Rainbow has how many colors?' }, options: [{ zh: '5種', en: '5' }, { zh: '6種', en: '6' }, { zh: '7種', en: '7' }, { zh: '8種', en: '8' }], correct: 2 },
  ],
  history: [
    { q: { zh: '中國的萬里長城建於哪個朝代？', en: 'Great Wall built in which dynasty?' }, options: [{ zh: '唐朝', en: 'Tang' }, { zh: '明朝', en: 'Ming' }, { zh: '秦朝', en: 'Qin' }, { zh: '宋朝', en: 'Song' }], correct: 2 },
    { q: { zh: '第二次世界大戰在哪一年結束？', en: 'WWII ended in?' }, options: [{ zh: '1943', en: '1943' }, { zh: '1944', en: '1944' }, { zh: '1945', en: '1945' }, { zh: '1946', en: '1946' }], correct: 2 },
    { q: { zh: '誰發明了電燈泡？', en: 'Who invented the light bulb?' }, options: [{ zh: '牛頓', en: 'Newton' }, { zh: '愛迪生', en: 'Edison' }, { zh: '愛因斯坦', en: 'Einstein' }, { zh: '伽利略', en: 'Galileo' }], correct: 1 },
    { q: { zh: '埃及的金字塔是用來做什麼的？', en: 'Egyptian pyramids were for?' }, options: [{ zh: '居住', en: 'living' }, { zh: '陵墓', en: 'tombs' }, { zh: '學校', en: 'schools' }, { zh: '市場', en: 'markets' }], correct: 1 },
    { q: { zh: '哥倫布在哪一年發現美洲？', en: 'Columbus discovered America in?' }, options: [{ zh: '1492', en: '1492' }, { zh: '1500', en: '1500' }, { zh: '1600', en: '1600' }, { zh: '1700', en: '1700' }], correct: 0 },
    { q: { zh: '中國四大發明不包括？', en: 'Not in China\'s 4 inventions?' }, options: [{ zh: '指南針', en: 'compass' }, { zh: '火藥', en: 'gunpowder' }, { zh: '印刷術', en: 'printing' }, { zh: '電燈', en: 'light bulb' }], correct: 3 },
    { q: { zh: '羅馬帝國的首都是？', en: 'Capital of Roman Empire?' }, options: [{ zh: '雅典', en: 'Athens' }, { zh: '羅馬', en: 'Rome' }, { zh: '巴黎', en: 'Paris' }, { zh: '倫敦', en: 'London' }], correct: 1 },
    { q: { zh: '誰是美國第一任總統？', en: 'First US President?' }, options: [{ zh: '林肯', en: 'Lincoln' }, { zh: '華盛頓', en: 'Washington' }, { zh: '傑斐遜', en: 'Jefferson' }, { zh: '羅斯福', en: 'Roosevelt' }], correct: 1 },
    { q: { zh: '工業革命最早發生在哪個國家？', en: 'Industrial Revolution started in?' }, options: [{ zh: '美國', en: 'USA' }, { zh: '法國', en: 'France' }, { zh: '英國', en: 'Britain' }, { zh: '德國', en: 'Germany' }], correct: 2 },
    { q: { zh: '絲綢之路連接了哪兩個地區？', en: 'Silk Road connected?' }, options: [{ zh: '中國和歐洲', en: 'China & Europe' }, { zh: '中國和日本', en: 'China & Japan' }, { zh: '印度和美國', en: 'India & USA' }, { zh: '非洲和美洲', en: 'Africa & America' }], correct: 0 },
  ],
  physics: [
    { q: { zh: '光速約為多少？', en: 'Speed of light is about?' }, options: [{ zh: '300,000 km/s', en: '300,000 km/s' }, { zh: '30,000 km/s', en: '30,000 km/s' }, { zh: '3,000 km/s', en: '3,000 km/s' }, { zh: '300 km/s', en: '300 km/s' }], correct: 0 },
    { q: { zh: '牛頓第一定律是？', en: 'Newton\'s first law?' }, options: [{ zh: 'F = ma', en: 'F = ma' }, { zh: '慣性定律', en: 'Inertia' }, { zh: '作用力與反作用力', en: 'Action-Reaction' }, { zh: '萬有引力', en: 'Gravity' }], correct: 1 },
    { q: { zh: '能量的單位是？', en: 'Unit of energy?' }, options: [{ zh: '牛頓', en: 'Newton' }, { zh: '焦耳', en: 'Joule' }, { zh: '瓦特', en: 'Watt' }, { zh: '伏特', en: 'Volt' }], correct: 1 },
    { q: { zh: '地球的重力加速度約為？', en: 'Earth\'s gravity is about?' }, options: [{ zh: '5 m/s²', en: '5 m/s²' }, { zh: '10 m/s²', en: '10 m/s²' }, { zh: '15 m/s²', en: '15 m/s²' }, { zh: '20 m/s²', en: '20 m/s²' }], correct: 1 },
    { q: { zh: '彩虹形成的原理是？', en: 'Rainbow forms by?' }, options: [{ zh: '反射', en: 'reflection' }, { zh: '折射', en: 'refraction' }, { zh: '散射', en: 'scattering' }, { zh: '吸收', en: 'absorption' }], correct: 1 },
    { q: { zh: '電流的單位是？', en: 'Unit of electric current?' }, options: [{ zh: '安培', en: 'Ampere' }, { zh: '伏特', en: 'Volt' }, { zh: '歐姆', en: 'Ohm' }, { zh: '瓦特', en: 'Watt' }], correct: 0 },
    { q: { zh: '聲音無法在什麼中傳播？', en: 'Sound cannot travel in?' }, options: [{ zh: '空氣', en: 'air' }, { zh: '水', en: 'water' }, { zh: '真空', en: 'vacuum' }, { zh: '固體', en: 'solid' }], correct: 2 },
    { q: { zh: '槓桿原理是誰發現的？', en: 'Who discovered lever principle?' }, options: [{ zh: '牛頓', en: 'Newton' }, { zh: '阿基米德', en: 'Archimedes' }, { zh: '伽利略', en: 'Galileo' }, { zh: '愛因斯坦', en: 'Einstein' }], correct: 1 },
    { q: { zh: '溫度的國際單位是？', en: 'International unit of temperature?' }, options: [{ zh: '攝氏度', en: 'Celsius' }, { zh: '華氏度', en: 'Fahrenheit' }, { zh: '開爾文', en: 'Kelvin' }, { zh: '蘭金度', en: 'Rankine' }], correct: 2 },
    { q: { zh: '磁鐵的兩極是？', en: 'Magnet has two?' }, options: [{ zh: '正負極', en: 'positive-negative' }, { zh: '南北極', en: 'north-south' }, { zh: '陰陽極', en: 'yin-yang' }, { zh: '左右極', en: 'left-right' }], correct: 1 },
  ],
  biology: [
    { q: { zh: '人��有多少塊骨頭？', en: 'How many bones in human body?' }, options: [{ zh: '106', en: '106' }, { zh: '206', en: '206' }, { zh: '306', en: '306' }, { zh: '406', en: '406' }], correct: 1, image: 'https://images.unsplash.com/photo-1631557674886-42edec9aacaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
    { q: { zh: 'DNA的全稱是？', en: 'DNA stands for?' }, options: [{ zh: '去氧核糖核酸', en: 'Deoxyribonucleic acid' }, { zh: '核糖核酸', en: 'Ribonucleic acid' }, { zh: '蛋白質', en: 'Protein' }, { zh: '氨基酸', en: 'Amino acid' }], correct: 0 },
    { q: { zh: '植物的葉綠素主要用於？', en: 'Chlorophyll is for?' }, options: [{ zh: '呼吸', en: 'respiration' }, { zh: '光合作用', en: 'photosynthesis' }, { zh: '生長', en: 'growth' }, { zh: '繁殖', en: 'reproduction' }], correct: 1 },
    { q: { zh: '人類有多少條染色體？', en: 'Humans have how many chromosomes?' }, options: [{ zh: '23對', en: '23 pairs' }, { zh: '24對', en: '24 pairs' }, { zh: '25對', en: '25 pairs' }, { zh: '26對', en: '26 pairs' }], correct: 0 },
    { q: { zh: '哪個器官負責過濾血液？', en: 'Which organ filters blood?' }, options: [{ zh: '心臟', en: 'heart' }, { zh: '肝臟', en: 'liver' }, { zh: '腎臟', en: 'kidney' }, { zh: '脾臟', en: 'spleen' }], correct: 2 },
    { q: { zh: '紅血球的主要功能是？', en: 'Red blood cells mainly?' }, options: [{ zh: '運送氧氣', en: 'carry oxygen' }, { zh: '抵抗疾病', en: 'fight disease' }, { zh: '凝血', en: 'clotting' }, { zh: '消化', en: 'digestion' }], correct: 0 },
    { q: { zh: '細胞的能量工廠是？', en: 'Cell\'s powerhouse is?' }, options: [{ zh: '細胞核', en: 'nucleus' }, { zh: '線粒體', en: 'mitochondria' }, { zh: '核糖體', en: 'ribosome' }, { zh: '內質網', en: 'ER' }], correct: 1 },
    { q: { zh: '人體最小的骨頭在哪裡？', en: 'Smallest bone is in?' }, options: [{ zh: '手指', en: 'finger' }, { zh: '腳趾', en: 'toe' }, { zh: '耳朵', en: 'ear' }, { zh: '鼻子', en: 'nose' }], correct: 2 },
    { q: { zh: '植物通過什麼吸收水分？', en: 'Plants absorb water through?' }, options: [{ zh: '葉子', en: 'leaves' }, { zh: '莖', en: 'stem' }, { zh: '根', en: 'roots' }, { zh: '花', en: 'flowers' }], correct: 2 },
    { q: { zh: '蝴蝶的生命週期有幾個階段？', en: 'Butterfly life cycle has?' }, options: [{ zh: '2個階段', en: '2 stages' }, { zh: '3個階段', en: '3 stages' }, { zh: '4個階段', en: '4 stages' }, { zh: '5個階段', en: '5 stages' }], correct: 2 },
  ],
  chemistry: [
    { q: { zh: '氧氣的化學符號是？', en: 'Chemical symbol for oxygen?' }, options: [{ zh: 'O', en: 'O' }, { zh: 'O₂', en: 'O₂' }, { zh: 'H', en: 'H' }, { zh: 'C', en: 'C' }], correct: 0, image: 'https://images.unsplash.com/photo-1614934273038-8829c68de36c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
    { q: { zh: 'pH值7代表什麼？', en: 'pH 7 means?' }, options: [{ zh: '酸性', en: 'acidic' }, { zh: '鹼性', en: 'basic' }, { zh: '中性', en: 'neutral' }, { zh: '強酸', en: 'strong acid' }], correct: 2 },
    { q: { zh: '食鹽的化學式是？', en: 'Chemical formula for salt?' }, options: [{ zh: 'NaCl', en: 'NaCl' }, { zh: 'KCl', en: 'KCl' }, { zh: 'CaCl₂', en: 'CaCl₂' }, { zh: 'MgCl₂', en: 'MgCl₂' }], correct: 0 },
    { q: { zh: '二氧化碳的化學式是？', en: 'Formula for carbon dioxide?' }, options: [{ zh: 'CO', en: 'CO' }, { zh: 'CO₂', en: 'CO₂' }, { zh: 'C₂O', en: 'C₂O' }, { zh: 'O₂C', en: 'O₂C' }], correct: 1 },
    { q: { zh: '元素週期表第一個元素是？', en: 'First element in periodic table?' }, options: [{ zh: '氧', en: 'Oxygen' }, { zh: '氫', en: 'Hydrogen' }, { zh: '碳', en: 'Carbon' }, { zh: '氮', en: 'Nitrogen' }], correct: 1 },
    { q: { zh: '金的化學符號是？', en: 'Chemical symbol for gold?' }, options: [{ zh: 'Go', en: 'Go' }, { zh: 'Gd', en: 'Gd' }, { zh: 'Au', en: 'Au' }, { zh: 'Ag', en: 'Ag' }], correct: 2 },
    { q: { zh: '水在100°C時會？', en: 'Water at 100°C will?' }, options: [{ zh: '凝固', en: 'freeze' }, { zh: '沸騰', en: 'boil' }, { zh: '蒸發', en: 'evaporate' }, { zh: '升華', en: 'sublimate' }], correct: 1 },
    { q: { zh: '鐵的化學符號是？', en: 'Chemical symbol for iron?' }, options: [{ zh: 'I', en: 'I' }, { zh: 'Fe', en: 'Fe' }, { zh: 'Ir', en: 'Ir' }, { zh: 'In', en: 'In' }], correct: 1 },
    { q: { zh: '原子的中心是？', en: 'Center of atom is?' }, options: [{ zh: '電子', en: 'electron' }, { zh: '質子', en: 'proton' }, { zh: '中子', en: 'neutron' }, { zh: '原子核', en: 'nucleus' }], correct: 3 },
    { q: { zh: '哪個不是酸？', en: 'Which is not an acid?' }, options: [{ zh: '鹽酸', en: 'HCl' }, { zh: '硫酸', en: 'H₂SO₄' }, { zh: '氫氧化鈉', en: 'NaOH' }, { zh: '硝酸', en: 'HNO₃' }], correct: 2 },
  ],
  economics: [
    { q: { zh: '供給和需求的關係是？', en: 'Supply and demand relationship?' }, options: [{ zh: '正相關', en: 'positive' }, { zh: '負相關', en: 'negative' }, { zh: '無關', en: 'no relation' }, { zh: '反比', en: 'inverse' }], correct: 3 },
    { q: { zh: 'GDP代表什麼？', en: 'GDP stands for?' }, options: [{ zh: '國內生產總值', en: 'Gross Domestic Product' }, { zh: '國民生產總值', en: 'GNP' }, { zh: '人均收入', en: 'Per capita income' }, { zh: '國家收入', en: 'National income' }], correct: 0 },
    { q: { zh: '通貨膨脹意味著？', en: 'Inflation means?' }, options: [{ zh: '物價下降', en: 'prices fall' }, { zh: '物價上升', en: 'prices rise' }, { zh: '物價不變', en: 'prices stable' }, { zh: '貨幣升值', en: 'currency appreciates' }], correct: 1 },
    { q: { zh: '中央銀行的主要職責是？', en: 'Central bank mainly?' }, options: [{ zh: '貸款給個人', en: 'lend to individuals' }, { zh: '控制貨幣供應', en: 'control money supply' }, { zh: '經營企業', en: 'run businesses' }, { zh: '收稅', en: 'collect taxes' }], correct: 1 },
    { q: { zh: '機會成本是指？', en: 'Opportunity cost means?' }, options: [{ zh: '最低成本', en: 'minimum cost' }, { zh: '放棄的最佳選擇', en: 'best foregone alternative' }, { zh: '實際成本', en: 'actual cost' }, { zh: '未來成本', en: 'future cost' }], correct: 1 },
    { q: { zh: '壟斷市場的特點是？', en: 'Monopoly market has?' }, options: [{ zh: '多個賣家', en: 'many sellers' }, { zh: '一個賣家', en: 'one seller' }, { zh: '完全競爭', en: 'perfect competition' }, { zh: '無數買家', en: 'infinite buyers' }], correct: 1 },
    { q: { zh: '需求彈性大意味著？', en: 'High demand elasticity means?' }, options: [{ zh: '價格變化影響小', en: 'price change small effect' }, { zh: '價格變化影響大', en: 'price change big effect' }, { zh: '需求不變', en: 'demand constant' }, { zh: '供給不變', en: 'supply constant' }], correct: 1 },
    { q: { zh: '經濟衰退的定義是？', en: 'Recession is defined as?' }, options: [{ zh: 'GDP連續兩季度下降', en: 'GDP falls 2 quarters' }, { zh: 'GDP上升', en: 'GDP rises' }, { zh: '失業率下降', en: 'unemployment falls' }, { zh: '物價上漲', en: 'prices rise' }], correct: 0 },
    { q: { zh: '比較優勢理論由誰提出？', en: 'Comparative advantage by?' }, options: [{ zh: '亞當·斯密', en: 'Adam Smith' }, { zh: '大衛·李嘉圖', en: 'David Ricardo' }, { zh: '凱恩斯', en: 'Keynes' }, { zh: '馬克思', en: 'Marx' }], correct: 1 },
    { q: { zh: '財政政策的工具不包括？', en: 'Fiscal policy excludes?' }, options: [{ zh: '政府支出', en: 'gov spending' }, { zh: '稅收', en: 'taxation' }, { zh: '利率', en: 'interest rate' }, { zh: '預算', en: 'budget' }], correct: 2 },
  ],
  computer: [
    { q: { zh: 'CPU代表什麼？', en: 'CPU stands for?' }, options: [{ zh: '中央處理器', en: 'Central Processing Unit' }, { zh: '電腦程序單元', en: 'Computer Program Unit' }, { zh: '中央電源單元', en: 'Central Power Unit' }, { zh: '計算處理器', en: 'Calculating Processor' }], correct: 0 },
    { q: { zh: '二進制只用哪兩個數字？', en: 'Binary uses which two digits?' }, options: [{ zh: '0和1', en: '0 and 1' }, { zh: '1和2', en: '1 and 2' }, { zh: '0和2', en: '0 and 2' }, { zh: '1和10', en: '1 and 10' }], correct: 0 },
    { q: { zh: 'RAM是什麼類型的記憶體？', en: 'RAM is what type of memory?' }, options: [{ zh: '永久', en: 'permanent' }, { zh: '臨��', en: 'temporary' }, { zh: '唯讀', en: 'read-only' }, { zh: '外部', en: 'external' }], correct: 1 },
    { q: { zh: '哪個不是程式語言？', en: 'Which is not a programming language?' }, options: [{ zh: 'Python', en: 'Python' }, { zh: 'Java', en: 'Java' }, { zh: 'HTML', en: 'HTML' }, { zh: 'Photoshop', en: 'Photoshop' }], correct: 3 },
    { q: { zh: 'WWW代表什麼？', en: 'WWW stands for?' }, options: [{ zh: 'World Wide Web', en: 'World Wide Web' }, { zh: 'World Web Wide', en: 'World Web Wide' }, { zh: 'Web World Wide', en: 'Web World Wide' }, { zh: 'Wide World Web', en: 'Wide World Web' }], correct: 0 },
    { q: { zh: '1 KB等於多少位元組？', en: '1 KB equals how many bytes?' }, options: [{ zh: '100', en: '100' }, { zh: '1000', en: '1000' }, { zh: '1024', en: '1024' }, { zh: '1048', en: '1048' }], correct: 2 },
    { q: { zh: '哪個是輸入設備？', en: 'Which is an input device?' }, options: [{ zh: '顯示器', en: 'monitor' }, { zh: '打印機', en: 'printer' }, { zh: '鍵盤', en: 'keyboard' }, { zh: '揚聲器', en: 'speaker' }], correct: 2 },
    { q: { zh: '操作系統的例子不包括？', en: 'OS example excludes?' }, options: [{ zh: 'Windows', en: 'Windows' }, { zh: 'macOS', en: 'macOS' }, { zh: 'Linux', en: 'Linux' }, { zh: 'Chrome', en: 'Chrome' }], correct: 3 },
    { q: { zh: 'IP地址用於？', en: 'IP address is for?' }, options: [{ zh: '識別網絡設備', en: 'identify network devices' }, { zh: '加密數據', en: 'encrypt data' }, { zh: '存儲文件', en: 'store files' }, { zh: '顯示圖像', en: 'display images' }], correct: 0 },
    { q: { zh: '哪個是雲存儲服務？', en: 'Which is cloud storage?' }, options: [{ zh: 'USB', en: 'USB' }, { zh: 'DVD', en: 'DVD' }, { zh: 'Google Drive', en: 'Google Drive' }, { zh: 'RAM', en: 'RAM' }], correct: 2 },
  ],
};

export function DailyTasks() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [completedSubjects, setCompletedSubjects] = useState<string[]>([]);
  const { t } = useLanguage();
  const { addPoints } = useUser();

  const startSubject = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
  };

  const handleAnswer = (answerIdx: number) => {
    setSelectedAnswer(answerIdx);
    const isCorrect = questions[selectedSubject!][currentQuestion].correct === answerIdx;
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < 4) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        if (!completedSubjects.includes(selectedSubject!)) {
          const points = (correctCount + (isCorrect ? 1 : 0)) * 10;
          addPoints(points);
          setCompletedSubjects([...completedSubjects, selectedSubject!]);
        }
      }
    }, 1500);
  };

  const goBack = () => {
    setSelectedSubject(null);
    setShowResult(false);
  };

  if (selectedSubject && !showResult) {
    const questionData = questions[selectedSubject][currentQuestion];
    
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <Button variant="ghost" onClick={goBack}>{t('← 返回', '← Back')}</Button>
          <div className="flex items-center gap-2">
            <span>{currentQuestion + 1}/5</span>
            <Progress value={(currentQuestion + 1) * 20} className="w-20" />
          </div>
        </motion.div>

        <motion.div
          key={currentQuestion}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-lg"
        >
          {questionData.image && (
            <div className="mb-6">
              <ImageWithFallback 
                src={questionData.image} 
                alt="Question" 
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
          )}
          
          <h3 className="mb-8 text-center">{t(questionData.q.zh, questionData.q.en)}</h3>
          <div className="space-y-4">
            {questionData.options.map((option, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectedAnswer === null && handleAnswer(idx)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedAnswer === null
                    ? 'border-gray-200 hover:border-purple-400 hover:bg-purple-50'
                    : selectedAnswer === idx
                    ? idx === questionData.correct
                      ? 'border-green-400 bg-green-50'
                      : 'border-red-400 bg-red-50'
                    : idx === questionData.correct
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === idx
                      ? idx === questionData.correct
                        ? 'border-green-400 bg-green-400 text-white'
                        : 'border-red-400 bg-red-400 text-white'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === idx && (
                      idx === questionData.correct ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />
                    )}
                  </div>
                  <span>{t(option.zh, option.en)}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    const finalCorrect = correctCount;
    const points = finalCorrect * 10;
    
    return (
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Trophy className="h-24 w-24 text-yellow-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="mb-4">{t('完成！', 'Complete!')}</h2>
          <p className="text-gray-600 mb-4">
            {t(`答對 ${finalCorrect}/5 題`, `Correct: ${finalCorrect}/5`)}
          </p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 mb-6"
          >
            <p className="text-gray-600 mb-2">{t('獲得積分', 'Points Earned')}</p>
            <p className="text-purple-600">+{points} ✨</p>
          </motion.div>
          <Button
            onClick={goBack}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400"
          >
            {t('繼續挑戰', 'Continue')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <h2>{t('每日任務', 'Daily Tasks')}</h2>
        <p className="text-gray-600">{t('完成科目挑戰賺取積分', 'Complete subjects to earn points')}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {subjects.map((subject, idx) => (
          <motion.button
            key={subject.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startSubject(subject.id)}
            className={`bg-gradient-to-br ${subject.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all relative overflow-hidden`}
          >
            {completedSubjects.includes(subject.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 bg-white rounded-full p-1"
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
              </motion.div>
            )}
            <div className="text-4xl mb-2">{subject.icon}</div>
            <div>{t(subject.zh, subject.en)}</div>
            <div className="text-xs opacity-80 mt-1">{t('5題 | 50積分', '5 Qs | 50 pts')}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
