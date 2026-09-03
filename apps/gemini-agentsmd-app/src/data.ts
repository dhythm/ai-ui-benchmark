export type EquipmentCategory =
  | 'laptop'
  | 'monitor'
  | 'camera'
  | 'projector'
  | 'wifi'
  | 'peripheral';

export type EquipmentStatus = 'available' | 'in_use' | 'maintenance';

export interface Reservation {
  id: string;
  userName: string;
  department: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  purpose: string;
}

export interface Equipment {
  id: string;
  assetCode: string;
  name: string;
  category: EquipmentCategory;
  modelNumber: string;
  location: string;
  specs: string;
  status: EquipmentStatus;
  currentReservation?: Reservation;
}

export const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  laptop: 'ノートPC',
  monitor: 'モニター',
  camera: 'カメラ',
  projector: 'プロジェクター',
  wifi: 'モバイルWi-Fi',
  peripheral: 'その他周辺機器',
};

export const STATUS_LABELS: Record<EquipmentStatus, string> = {
  available: '利用可能',
  in_use: '貸出中',
  maintenance: '点検中',
};

export const INITIAL_EQUIPMENT_LIST: Equipment[] = [
  {
    id: 'eq-001',
    assetCode: 'PC-2024-001',
    name: 'MacBook Pro 14インチ (M3 Pro)',
    category: 'laptop',
    modelNumber: 'MRX33J/A',
    location: '5F 開発備品棚 A-1',
    specs: 'Apple M3 Pro / 18GB / 512GB SSD / スペースブラック',
    status: 'available',
  },
  {
    id: 'eq-002',
    assetCode: 'PC-2023-014',
    name: 'ThinkPad X1 Carbon Gen 11',
    category: 'laptop',
    modelNumber: '21HMCTO1WW',
    location: '5F 開発備品棚 A-2',
    specs: 'Core i7-1365U / 32GB / 1TB SSD / 14型 WUXGA',
    status: 'in_use',
    currentReservation: {
      id: 'res-101',
      userName: '佐藤 拓也',
      department: 'プロダクト開発部',
      startDate: '2026-09-02',
      endDate: '2026-09-08',
      purpose: '外出先でのクライアントデモ環境構築および動作確認',
    },
  },
  {
    id: 'eq-003',
    assetCode: 'PC-2022-008',
    name: 'Dell XPS 13 Plus',
    category: 'laptop',
    modelNumber: '9320',
    location: '5F 開発備品棚 A-3',
    specs: 'Core i5-1240P / 16GB / 512GB SSD',
    status: 'available',
  },
  {
    id: 'eq-004',
    assetCode: 'PC-2021-003',
    name: 'MacBook Air 13インチ (M1)',
    category: 'laptop',
    modelNumber: 'MGN63J/A',
    location: '5F 開発備品棚 A-4',
    specs: 'Apple M1 / 16GB / 256GB SSD / シルバー',
    status: 'maintenance',
  },
  {
    id: 'eq-005',
    assetCode: 'MON-2023-002',
    name: 'Dell UltraSharp 27インチ 4Kモニター',
    category: 'monitor',
    modelNumber: 'U2723QE',
    location: '4F フリーアドレス備品置場',
    specs: '4K(3840x2160) / IPS Black / USB-C給電(90W) / 有線LAN',
    status: 'available',
  },
  {
    id: 'eq-006',
    assetCode: 'MON-2023-005',
    name: 'LG UltraWide 34インチ曲面モニター',
    category: 'monitor',
    modelNumber: '34WN780-B',
    location: '4F フリーアドレス備品置場',
    specs: 'UWQHD(3440x1440) / エルゴノミクスアーム付属 / HDMI, DP',
    status: 'in_use',
    currentReservation: {
      id: 'res-102',
      userName: '高橋 優花',
      department: 'デザイン部',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      purpose: 'デザイン検証および複数デザインカンプ横断作業',
    },
  },
  {
    id: 'eq-007',
    assetCode: 'MON-2024-001',
    name: 'ASUS 15.6インチ モバイルモニター',
    category: 'monitor',
    modelNumber: 'MB16AHG',
    location: '5F 開発備品棚 B-1',
    specs: 'FHD(1920x1080) / 144Hz / 軽量690g / USB-C, Micro-HDMI',
    status: 'available',
  },
  {
    id: 'eq-008',
    assetCode: 'CAM-2023-001',
    name: 'Sony α7 IV ミラーレス一眼カメラ',
    category: 'camera',
    modelNumber: 'ILCE-7M4K',
    location: '3F 広報・総務キャビネット C-1',
    specs: '有効約3300万画素 / 28-70mm ズームレンズキット付属 / SDカード同梱',
    status: 'available',
  },
  {
    id: 'eq-009',
    assetCode: 'CAM-2022-003',
    name: 'Panasonic HC-VX992MS 4Kビデオカメラ',
    category: 'camera',
    modelNumber: 'HC-VX992MS-W',
    location: '3F 広報・総務キャビネット C-2',
    specs: '4K動画記録 / 内蔵64GB / 光学20倍ズーム / 三脚・予備バッテリー同梱',
    status: 'in_use',
    currentReservation: {
      id: 'res-103',
      userName: '中村 翔',
      department: '人事部',
      startDate: '2026-09-03',
      endDate: '2026-09-04',
      purpose: '新卒採用向け会社説明会および社員インタビューの動画撮影',
    },
  },
  {
    id: 'eq-010',
    assetCode: 'PRJ-2023-001',
    name: 'EPSON ビジネスプロジェクター 4000lm',
    category: 'projector',
    modelNumber: 'EB-982W',
    location: '6F 大会議室 備品庫 P-1',
    specs: 'WXGA / 4,200ルーメン / 16Wスピーカー / HDMI×2 / キャリングケース付',
    status: 'available',
  },
  {
    id: 'eq-011',
    assetCode: 'PRJ-2024-002',
    name: 'Anker Nebula Capsule 3 (モバイル)',
    category: 'projector',
    modelNumber: 'D2425',
    location: '6F 大会議室 備品庫 P-2',
    specs: 'フルHD / 200ANSIルーメン / バッテリー駆動(約2.5時間) / Google TV搭載',
    status: 'available',
  },
  {
    id: 'eq-012',
    assetCode: 'WIFI-2024-003',
    name: 'SoftBank 5G モバイルWi-Fiルーター #1',
    category: 'wifi',
    modelNumber: 'Pocket WiFi 5G A101ZT',
    location: '3F 総務窓口受取棚 W-1',
    specs: '下り最大2.4Gbps / データ通信容量無制限 / 最大30台接続',
    status: 'available',
  },
  {
    id: 'eq-013',
    assetCode: 'WIFI-2024-004',
    name: 'SoftBank 5G モバイルWi-Fiルーター #2',
    category: 'wifi',
    modelNumber: 'Pocket WiFi 5G A101ZT',
    location: '3F 総務窓口受取棚 W-2',
    specs: '下り最大2.4Gbps / データ通信容量無制限 / 最大30台接続',
    status: 'in_use',
    currentReservation: {
      id: 'res-104',
      userName: '渡辺 健',
      department: '営業第一部',
      startDate: '2026-09-03',
      endDate: '2026-09-06',
      purpose: '西日本支社出張およびクライアントオンサイト提案活動',
    },
  },
  {
    id: 'eq-014',
    assetCode: 'WIFI-2023-009',
    name: 'UQ WiMAX Speed Wi-Fi 5G X12',
    category: 'wifi',
    modelNumber: 'NAR03',
    location: '3F 総務窓口受取棚 W-3',
    specs: 'WiMAX+5G対応 / クレードル付属 / 高速通信',
    status: 'available',
  },
  {
    id: 'eq-015',
    assetCode: 'ACC-2023-004',
    name: 'Jabra Speak 710 ポータブルスピーカーフォン',
    category: 'peripheral',
    modelNumber: '7710-409',
    location: '6F 会議室備品棚 S-1',
    specs: 'Bluetooth/USB対応 / 360度集音マイク / 最大6名対応',
    status: 'available',
  },
  {
    id: 'eq-016',
    assetCode: 'ACC-2024-001',
    name: 'Logicool MX MASTER 3S & Keys Mini セット',
    category: 'peripheral',
    modelNumber: 'MX2300GR / KX700GR',
    location: '5F 開発備品棚 B-3',
    specs: '静音ワイヤレスマウス + テンキーレスキーボード / Logi Boltレシーバー付',
    status: 'in_use',
    currentReservation: {
      id: 'res-105',
      userName: '加藤 亮',
      department: 'システムインフラ部',
      startDate: '2026-09-02',
      endDate: '2026-09-04',
      purpose: '社内サーバー室保守点検用操作機器として使用',
    },
  },
  {
    id: 'eq-017',
    assetCode: 'ACC-2022-011',
    name: 'CalDigit TS4 Thunderbolt 4 ドック',
    category: 'peripheral',
    modelNumber: 'TS4-JP-AMZ',
    location: '5F 開発備品棚 B-2',
    specs: '18ポート拡張 / 98Wホスト給電 / 8K対応 / 2.5GbE',
    status: 'available',
  },
  {
    id: 'eq-018',
    assetCode: 'ACC-2021-005',
    name: 'Logicool Webカメラ BRIO 4K',
    category: 'peripheral',
    modelNumber: 'C1000eR',
    location: '3F 広報・総務キャビネット C-3',
    specs: '4K Ultra HD / HDR対応 / 視野角調整可能(65/78/90度)',
    status: 'maintenance',
  },
];
