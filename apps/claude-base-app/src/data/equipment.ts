import type { Equipment } from '../types/equipment'
import { addDays, toDateString } from '../lib/reservation'

/** ログイン中の社員（モック） */
export const CURRENT_USER = '営業部 / 田中 太郎'

export const TODAY = toDateString(new Date())
const d = (offset: number) => addDays(TODAY, offset)

export const EQUIPMENT: Equipment[] = [
  // ノートPC
  { id: 'nb-0001', assetNo: 'NB-0001', name: 'MacBook Pro 14インチ', model: 'M4 Pro / 24GB / 512GB', category: 'laptop', status: 'available', location: '本社 3F 情シス倉庫', note: '動画編集・開発向け' },
  { id: 'nb-0002', assetNo: 'NB-0002', name: 'MacBook Pro 14インチ', model: 'M4 Pro / 24GB / 512GB', category: 'laptop', status: 'in-use', location: '本社 3F 情シス倉庫', holder: '開発部 / 佐藤 健', dueDate: d(2) },
  { id: 'nb-0003', assetNo: 'NB-0003', name: 'MacBook Air 13インチ', model: 'M4 / 16GB / 256GB', category: 'laptop', status: 'available', location: '本社 3F 情シス倉庫' },
  { id: 'nb-0004', assetNo: 'NB-0004', name: 'ThinkPad X1 Carbon', model: 'Gen 12 / 16GB / 512GB', category: 'laptop', status: 'reserved', location: '本社 3F 情シス倉庫', holder: '人事部 / 鈴木 美咲', dueDate: d(1) },
  { id: 'nb-0005', assetNo: 'NB-0005', name: 'ThinkPad X1 Carbon', model: 'Gen 12 / 16GB / 512GB', category: 'laptop', status: 'available', location: '本社 3F 情シス倉庫' },
  { id: 'nb-0006', assetNo: 'NB-0006', name: 'Surface Laptop 7', model: '13.8インチ / 16GB / 256GB', category: 'laptop', status: 'maintenance', location: '本社 3F 情シス倉庫', note: 'バッテリー交換中（9月中旬 復帰予定）' },
  { id: 'nb-0007', assetNo: 'NB-0007', name: 'Let\'s note FV4', model: '14インチ / 16GB / 512GB', category: 'laptop', status: 'in-use', location: '大阪支社 2F', holder: '営業部 / 高橋 大輔', dueDate: d(-1) },
  // モニター
  { id: 'mn-0001', assetNo: 'MN-0001', name: 'Dell 27インチ 4K モニター', model: 'U2723QE', category: 'monitor', status: 'available', location: '本社 5F 会議室前' },
  { id: 'mn-0002', assetNo: 'MN-0002', name: 'Dell 27インチ 4K モニター', model: 'U2723QE', category: 'monitor', status: 'available', location: '本社 5F 会議室前' },
  { id: 'mn-0003', assetNo: 'MN-0003', name: 'LG 34インチ ウルトラワイド', model: '34WQ75C-B', category: 'monitor', status: 'in-use', location: '本社 5F 会議室前', holder: 'デザイン部 / 伊藤 彩', dueDate: d(5) },
  { id: 'mn-0004', assetNo: 'MN-0004', name: 'ASUS 15.6インチ モバイルモニター', model: 'ZenScreen MB16AC', category: 'monitor', status: 'available', location: '本社 3F 情シス倉庫', note: 'USB-C 1本で給電・表示' },
  { id: 'mn-0005', assetNo: 'MN-0005', name: 'ASUS 15.6インチ モバイルモニター', model: 'ZenScreen MB16AC', category: 'monitor', status: 'reserved', location: '本社 3F 情シス倉庫', holder: '営業部 / 渡辺 直人', dueDate: d(3) },
  // カメラ
  { id: 'cm-0001', assetNo: 'CM-0001', name: 'Sony α7 IV ミラーレス一眼', model: 'ILCE-7M4 + 24-70mm F2.8', category: 'camera', status: 'available', location: '本社 4F 広報部', note: 'SDカード 128GB 2枚付属' },
  { id: 'cm-0002', assetNo: 'CM-0002', name: 'Canon EOS R6 Mark II', model: 'RF24-105mm キット', category: 'camera', status: 'in-use', location: '本社 4F 広報部', holder: '広報部 / 山本 花', dueDate: d(4) },
  { id: 'cm-0003', assetNo: 'CM-0003', name: 'GoPro HERO13 Black', model: 'アクセサリーセット付', category: 'camera', status: 'available', location: '本社 4F 広報部' },
  { id: 'cm-0004', assetNo: 'CM-0004', name: 'Logicool ウェブカメラ 4K', model: 'BRIO 4K', category: 'camera', status: 'available', location: '本社 3F 情シス倉庫' },
  { id: 'cm-0005', assetNo: 'CM-0005', name: 'Logicool ウェブカメラ 4K', model: 'BRIO 4K', category: 'camera', status: 'maintenance', location: '本社 3F 情シス倉庫', note: 'オートフォーカス不良で修理中' },
  // プロジェクター
  { id: 'pj-0001', assetNo: 'PJ-0001', name: 'EPSON ビジネスプロジェクター', model: 'EB-L200F（4,000lm）', category: 'projector', status: 'available', location: '本社 5F 会議室前' },
  { id: 'pj-0002', assetNo: 'PJ-0002', name: 'EPSON ビジネスプロジェクター', model: 'EB-L200F（4,000lm）', category: 'projector', status: 'reserved', location: '本社 5F 会議室前', holder: '経営企画部 / 中村 修', dueDate: d(2) },
  { id: 'pj-0003', assetNo: 'PJ-0003', name: 'Anker モバイルプロジェクター', model: 'Nebula Capsule 3', category: 'projector', status: 'available', location: '本社 3F 情シス倉庫', note: 'バッテリー内蔵・小型' },
  { id: 'pj-0004', assetNo: 'PJ-0004', name: 'BenQ 短焦点プロジェクター', model: 'TH671ST', category: 'projector', status: 'in-use', location: '大阪支社 2F', holder: '大阪営業所 / 小林 恵', dueDate: d(1) },
  // モバイルWi-Fi
  { id: 'wf-0001', assetNo: 'WF-0001', name: 'モバイルWi-Fi（docomo）', model: 'Wi-Fi STATION SH-54C / 5G', category: 'mobile-wifi', status: 'available', location: '本社 1F 総務受付' },
  { id: 'wf-0002', assetNo: 'WF-0002', name: 'モバイルWi-Fi（docomo）', model: 'Wi-Fi STATION SH-54C / 5G', category: 'mobile-wifi', status: 'available', location: '本社 1F 総務受付' },
  { id: 'wf-0003', assetNo: 'WF-0003', name: 'モバイルWi-Fi（docomo）', model: 'Wi-Fi STATION SH-54C / 5G', category: 'mobile-wifi', status: 'in-use', location: '本社 1F 総務受付', holder: '営業部 / 加藤 剛', dueDate: d(0) },
  { id: 'wf-0004', assetNo: 'WF-0004', name: 'モバイルWi-Fi（au）', model: 'Speed Wi-Fi 5G X12', category: 'mobile-wifi', status: 'reserved', location: '本社 1F 総務受付', holder: '営業部 / 吉田 由紀', dueDate: d(1) },
  { id: 'wf-0005', assetNo: 'WF-0005', name: 'モバイルWi-Fi（au）', model: 'Speed Wi-Fi 5G X12', category: 'mobile-wifi', status: 'available', location: '大阪支社 2F' },
  // その他周辺機器
  { id: 'pr-0001', assetNo: 'PR-0001', name: 'USB-C ドッキングステーション', model: 'CalDigit TS4', category: 'peripheral', status: 'available', location: '本社 3F 情シス倉庫' },
  { id: 'pr-0002', assetNo: 'PR-0002', name: 'ワイヤレスプレゼンター', model: 'Logicool Spotlight', category: 'peripheral', status: 'available', location: '本社 5F 会議室前' },
  { id: 'pr-0003', assetNo: 'PR-0003', name: 'スピーカーフォン', model: 'Jabra Speak2 75', category: 'peripheral', status: 'in-use', location: '本社 5F 会議室前', holder: '開発部 / 松本 亮', dueDate: d(1) },
  { id: 'pr-0004', assetNo: 'PR-0004', name: 'スピーカーフォン', model: 'Jabra Speak2 75', category: 'peripheral', status: 'available', location: '本社 5F 会議室前' },
  { id: 'pr-0005', assetNo: 'PR-0005', name: 'ペンタブレット', model: 'Wacom Intuos Pro M', category: 'peripheral', status: 'available', location: '本社 4F デザイン部' },
  { id: 'pr-0006', assetNo: 'PR-0006', name: 'HDMI キャプチャーボード', model: 'Elgato HD60 X', category: 'peripheral', status: 'maintenance', location: '本社 4F 広報部', note: '付属ケーブル紛失のため手配中' },
]
