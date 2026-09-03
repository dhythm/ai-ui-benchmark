export type EquipmentStatus = 'available' | 'on-loan' | 'maintenance';

export type Category =
  | 'ノートPC'
  | 'モニター'
  | 'カメラ'
  | 'プロジェクター'
  | 'モバイルWi-Fi'
  | '周辺機器';

export interface Equipment {
  id: string;
  name: string;
  model: string;
  category: Category;
  status: EquipmentStatus;
  location: string;
  borrower: string | null;
  returnDate: string | null;
  nextAvailable: string;
  spec: string;
  stock: string;
}

export const CATEGORIES: Category[] = [
  'ノートPC',
  'モニター',
  'カメラ',
  'プロジェクター',
  'モバイルWi-Fi',
  '周辺機器',
];

export const STATUS_LABEL: Record<EquipmentStatus, string> = {
  available: '利用可能',
  'on-loan': '貸出中',
  maintenance: 'メンテナンス中',
};

export const INITIAL_EQUIPMENT: Equipment[] = [
  { id: 'PC-001', name: 'MacBook Pro 14インチ (M4)', model: 'MBP14-M4 / 18GB / 512GB', category: 'ノートPC', status: 'available', location: '本社 3F・IT管理室', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: '貸出用に初期化済み・ACアダプタ付属', stock: 'あと2台あり' },
  { id: 'PC-002', name: 'MacBook Air 13インチ (M3)', model: 'MBA13-M3 / 16GB / 512GB', category: 'ノートPC', status: 'available', location: '本社 3F・IT管理室', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: '軽量・出張向け・ACアダプタ付属', stock: 'あと4台あり' },
  { id: 'PC-003', name: 'ThinkPad X1 Carbon Gen12', model: 'Win11 / Core Ultra 7 / 32GB', category: 'ノートPC', status: 'on-loan', location: '本社 3F・IT管理室', borrower: '営業部・佐藤', returnDate: '9/10 返却予定', nextAvailable: '9/11〜', spec: 'Windows検証用・ACアダプタ付属', stock: '残り0台' },
  { id: 'PC-004', name: 'Surface Laptop 7 (Copilot+ PC)', model: 'Snapdragon X Elite / 16GB', category: 'ノートPC', status: 'available', location: '大阪支社・受付', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: 'AI機能検証用・タッチ対応', stock: 'あと1台あり' },
  { id: 'PC-005', name: 'Chromebook Plus (研修用)', model: 'Acer CB514 / 8GB', category: 'ノートPC', status: 'maintenance', location: '本社 3F・IT管理室', borrower: null, returnDate: null, nextAvailable: '9/8〜', spec: 'OS更新作業中・9/8復旧見込み', stock: '—' },
  { id: 'MN-001', name: 'Dell 27インチ 4Kモニター U2723QE', model: 'USB-C給電対応・高さ調整可', category: 'モニター', status: 'available', location: '本社 5F・備品庫A', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: 'HDMI / DisplayPortケーブル付属', stock: 'あと5台あり' },
  { id: 'MN-002', name: 'LG ウルトラワイド 34インチ', model: '34WN750 / 21:9', category: 'モニター', status: 'on-loan', location: '本社 5F・備品庫A', borrower: '開発部・田中', returnDate: '9/20 返却予定', nextAvailable: '9/21〜', spec: '開発合宿用・HDMIケーブル付属', stock: '残り0台' },
  { id: 'MN-003', name: 'モバイルモニター 15.6インチ', model: 'EVICIV EVC-1506 / フルHD', category: 'モニター', status: 'available', location: '本社 1F・総務受付', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: '出張・外出先作業向け・ケース付', stock: 'あと6台あり' },
  { id: 'MN-004', name: 'EIZO 24インチ カラーマネジメント', model: 'CS2400S / デザイン用', category: 'モニター', status: 'available', location: '本社 4F・デザイン室', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: 'キャリブレーション済み・要返却時報告', stock: 'あと1台あり' },
  { id: 'CA-001', name: 'SONY α7 IV ミラーレス一眼セット', model: '28-70mmレンズ・三脚・予備電池付', category: 'カメラ', status: 'available', location: '本社 4F・広報室', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: '撮影講習受講者限定・SDカード別', stock: 'あと1セットあり' },
  { id: 'CA-002', name: 'SONY ZV-1 II (Vlog用コンデジ)', model: '広角20mm・ウインドジャマー付', category: 'カメラ', status: 'on-loan', location: '本社 4F・広報室', borrower: '広報部・鈴木', returnDate: '9/6 返却予定', nextAvailable: '9/7〜', spec: '採用動画撮影用', stock: '残り0台' },
  { id: 'CA-003', name: 'GoPro HERO 12 Black', model: '防水・手ブレ補正・自撮り棒付', category: 'カメラ', status: 'available', location: '本社 1F・総務受付', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: '現場・イベント記録向け', stock: 'あと3台あり' },
  { id: 'CA-004', name: 'DJI Osmo Pocket 3', model: 'ジンバルカメラ・延長ロッド付', category: 'カメラ', status: 'maintenance', location: '本社 4F・広報室', borrower: null, returnDate: null, nextAvailable: '9/12〜', spec: 'ジンバル点検中', stock: '—' },
  { id: 'PJ-001', name: 'EPSON ビジネスプロジェクター EB-2250U', model: '5000lm・フルHD・無線対応', category: 'プロジェクター', status: 'available', location: '本社 5F・備品庫A', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: '100インチスクリーン同時予約可', stock: 'あと2台あり' },
  { id: 'PJ-002', name: 'Anker Nebula Capsule 3 (小型)', model: '200ANSIルーメン・Android搭載', category: 'プロジェクター', status: 'on-loan', location: '本社 1F・総務受付', borrower: '人事部・高橋', returnDate: '9/5 返却予定', nextAvailable: '9/6〜', spec: '小会議・懇親会向け', stock: '残り0台' },
  { id: 'PJ-003', name: '100インチ自立式スクリーン', model: 'KEEPTIME・三脚式', category: 'プロジェクター', status: 'available', location: '本社 5F・備品庫A', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: 'PJ-001との同時予約推奨', stock: 'あと1台あり' },
  { id: 'WF-001', name: 'docomo 5G モバイルWi-Fi SH-52C', model: '月間無制限プラン・充電器付', category: 'モバイルWi-Fi', status: 'available', location: '本社 1F・総務受付', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: '国内出張向け・返却時データ使用量報告不要', stock: 'あと8台あり' },
  { id: 'WF-002', name: 'au 5G モバイルWi-Fi X11', model: '月間無制限プラン・充電器付', category: 'モバイルWi-Fi', status: 'available', location: '本社 1F・総務受付', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: '予備回線・長期貸出可(最大30日)', stock: 'あと5台あり' },
  { id: 'WF-003', name: '海外用ポケットWi-Fi (グローバル)', model: '周遊プラン・変換プラグ付', category: 'モバイルWi-Fi', status: 'on-loan', location: '本社 1F・総務受付', borrower: '営業部・伊藤', returnDate: '9/15 返却予定', nextAvailable: '9/16〜', spec: '出張申請番号の入力が必要', stock: '残り0台' },
  { id: 'WF-004', name: 'Starlink Mini (衛星回線セット)', model: '屋外現場用・三脚付', category: 'モバイルWi-Fi', status: 'available', location: '本社 5F・備品庫B', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: '山間部・工事現場向け・要事前講習', stock: 'あと1台あり' },
  { id: 'AC-001', name: 'Jabra Speak 510 会議用スピーカー', model: 'Bluetooth・USB両対応', category: '周辺機器', status: 'available', location: '本社 5F・備品庫B', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: '8名程度の会議向け', stock: 'あと4台あり' },
  { id: 'AC-002', name: 'Anker 7-in-1 USB-Cハブ', model: 'HDMI・PD100W・SD対応', category: '周辺機器', status: 'available', location: '本社 1F・総務受付', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: 'PC予約と同時申込可', stock: 'あと10台あり' },
  { id: 'AC-003', name: 'HHKB Professional HYBRID Type-S', model: '日本語配列・静音', category: '周辺機器', status: 'on-loan', location: '本社 5F・備品庫B', borrower: '開発部・山本', returnDate: '9/30 返却予定', nextAvailable: '10/1〜', spec: '長期貸出中', stock: '残り0台' },
  { id: 'AC-004', name: 'Logicool MX Master 3S + キーボードセット', model: 'KX800・静音マウス', category: '周辺機器', status: 'available', location: '本社 5F・備品庫B', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: '在宅勤務向け短期貸出可', stock: 'あと7台あり' },
  { id: 'AC-005', name: 'Anker 737 モバイルバッテリー 24000mAh', model: 'PD120W・ケーブル付属', category: '周辺機器', status: 'available', location: '本社 1F・総務受付', borrower: null, returnDate: null, nextAvailable: '即時利用可', spec: '出張・イベント向け', stock: 'あと9台あり' },
  { id: 'AC-006', name: 'Apple TV 4K + HDMIセット (会議室用)', model: '第3世代・リモコン付', category: '周辺機器', status: 'maintenance', location: '本社 5F・備品庫B', borrower: null, returnDate: null, nextAvailable: '9/9〜', spec: 'ファームウェア更新中', stock: '—' },
];

export function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function toISODate(date: Date): string {
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function plusDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISODate(d);
}
