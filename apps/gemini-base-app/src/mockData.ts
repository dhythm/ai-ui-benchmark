export type CategoryType =
  | 'all'
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
  startDate: string;
  endDate: string;
  purpose: string;
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  category: CategoryType;
  categoryLabel: string;
  status: EquipmentStatus;
  location: string;
  modelNumber: string;
  specs: string;
  accessories: string[];
  imageUrl?: string;
  currentReservation?: Reservation;
}

export const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'all', label: 'すべてのカテゴリ' },
  { id: 'laptop', label: 'ノートPC' },
  { id: 'monitor', label: 'モニター' },
  { id: 'camera', label: 'カメラ' },
  { id: 'projector', label: 'プロジェクター' },
  { id: 'wifi', label: 'モバイルWi-Fi' },
  { id: 'peripheral', label: 'その他の周辺機器' },
];

export const STATUSES: { id: EquipmentStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'すべての利用状況' },
  { id: 'available', label: '利用可能（今すぐ予約可）' },
  { id: 'in_use', label: '利用中' },
  { id: 'maintenance', label: 'メンテナンス・点検中' },
];

export const INITIAL_EQUIPMENTS: Equipment[] = [
  {
    id: 'eq-001',
    code: 'PC-M3-01',
    name: 'MacBook Pro 16インチ (M3 Max / 64GB)',
    category: 'laptop',
    categoryLabel: 'ノートPC',
    status: 'available',
    location: '本社 5F ITサポートラック A-01',
    modelNumber: 'Apple MacBook Pro 16-inch (2023)',
    specs: 'Apple M3 Max / 64GB RAM / 1TB SSD / Liquid Retina XDR',
    accessories: ['140W USB-C電源アダプタ', 'MagSafeケーブル', '専用スリーブ'],
  },
  {
    id: 'eq-002',
    code: 'PC-WIN-02',
    name: 'ThinkPad X1 Carbon Gen 11',
    category: 'laptop',
    categoryLabel: 'ノートPC',
    status: 'in_use',
    location: '本社 5F ITサポートラック A-02',
    modelNumber: 'Lenovo 21HM-CTO1WW',
    specs: 'Core i7-1365U / 32GB RAM / 512GB SSD / 1.12kg軽量設計',
    accessories: ['65W ACアダプタ', 'Type-Cハブ'],
    currentReservation: {
      id: 'res-101',
      userName: '田中 健太郎',
      department: 'DXソリューション推進部',
      startDate: '2026-09-02',
      endDate: '2026-09-05',
      purpose: 'クライアント先でのシステム移行検証作業のため',
    },
  },
  {
    id: 'eq-003',
    code: 'PC-WIN-03',
    name: 'Dell XPS 15 (GeForce RTX4060搭載)',
    category: 'laptop',
    categoryLabel: 'ノートPC',
    status: 'available',
    location: '本社 5F ITサポートラック A-03',
    modelNumber: 'Dell XPS 15 9530',
    specs: 'Core i7-13700H / 32GB RAM / 1TB SSD / 3.5K OLEDタッチパネル',
    accessories: ['130W USB-C電源アダプタ', 'USB-C to HDMI/USB-Aアダプタ'],
  },
  {
    id: 'eq-004',
    code: 'MON-4K-01',
    name: 'DELL 27インチ 4K USB-Cハブモニター',
    category: 'monitor',
    categoryLabel: 'モニター',
    status: 'available',
    location: '本社 4F 執務室 貸出備品ブース B-01',
    modelNumber: 'Dell UltraSharp U2723QE',
    specs: 'IPS Blackパネル / 4K (3840×2160) / 90W給電対応Type-C / RJ45有線LAN',
    accessories: ['USB-Cケーブル', '電源ケーブル', 'HDMIケーブル'],
  },
  {
    id: 'eq-005',
    code: 'MON-4K-02',
    name: 'EIZO FlexScan 31.5型 4Kモニター',
    category: 'monitor',
    categoryLabel: 'モニター',
    status: 'in_use',
    location: '本社 4F 執務室 貸出備品ブース B-02',
    modelNumber: 'EIZO EV3285-WT',
    specs: '31.5インチ / 4K UHD / ノングレア / 自動調光機能(Auto EcoView)',
    accessories: ['電源ケーブル', 'DisplayPortケーブル', 'HDMIケーブル'],
    currentReservation: {
      id: 'res-102',
      userName: '佐藤 美咲',
      department: 'ブランドデザイン部',
      startDate: '2026-09-01',
      endDate: '2026-09-04',
      purpose: '新製品発表イベント向けキービジュアル制作・色校正作業',
    },
  },
  {
    id: 'eq-006',
    code: 'MON-MOB-01',
    name: 'ASUS ZenScreen 15.6型 モバイルモニター',
    category: 'monitor',
    categoryLabel: 'モニター',
    status: 'available',
    location: '本社 4F 執務室 貸出備品ブース B-03',
    modelNumber: 'ASUS MB16ACE',
    specs: '15.6インチ FHD (1920x1080) / 重量約710g / USB Type-C 1本接続',
    accessories: ['専用スマートケース/スタンド', 'USB-Cケーブル'],
  },
  {
    id: 'eq-007',
    code: 'CAM-4K-01',
    name: 'Sony α7 IV ミラーレス一眼カメラ ズームレンズキット',
    category: 'camera',
    categoryLabel: 'カメラ',
    status: 'available',
    location: '本社 3F 広報・PR室 ロッカー C-01',
    modelNumber: 'ILCE-7M4K (FE 28-70mm F3.5-5.6 OSS同梱)',
    specs: '有効約3300万画素 / 4K60p動画 / リアルタイム瞳AF / 予備バッテリー2個',
    accessories: ['標準ズームレンズ', '純正バッテリー×2', '急速チャージャー', '64GB SDカード (V60)', '専用防滴ハードケース'],
  },
  {
    id: 'eq-008',
    code: 'CAM-WEB-01',
    name: 'Meeting Owl 3 (360度Webカメラ・マイク・スピーカー)',
    category: 'camera',
    categoryLabel: 'カメラ',
    status: 'in_use',
    location: '本社 3F 第2会議室 常備キャビネット',
    modelNumber: 'Owl Labs MTW300',
    specs: '360度パノラマ映像 / 半径5.5m音声集音 / 自動フォーカス追尾AI',
    accessories: ['AC電源アダプター', 'USB-Cケーブル (2m)', 'USB延長ケーブル'],
    currentReservation: {
      id: 'res-103',
      userName: '高橋 雄大',
      department: '営業推進統括部',
      startDate: '2026-09-03',
      endDate: '2026-09-03',
      purpose: '全社ハイブリッド月次定例会議の配信運営',
    },
  },
  {
    id: 'eq-009',
    code: 'CAM-WEB-02',
    name: 'Logicool BRIO 4K Ultra HD ウェブカメラ',
    category: 'camera',
    categoryLabel: 'カメラ',
    status: 'maintenance',
    location: '本社 5F ITサポート 修理受付棚',
    modelNumber: 'Logitech V-U0040',
    specs: '4K/30fps, 1080p/60fps / HDR対応 / 視野角調整可能(65/78/90度)',
    accessories: ['USB-C to USB-Aケーブル', 'プライバシーシェード', 'ポーチ'],
  },
  {
    id: 'eq-010',
    code: 'PRJ-LAS-01',
    name: 'EPSON 超単焦点レーザープロジェクター (4000lm)',
    category: 'projector',
    categoryLabel: 'プロジェクター',
    status: 'available',
    location: '本社 2F カンファレンス備品庫 P-01',
    modelNumber: 'EPSON EB-750F',
    specs: 'FullHDレーザー光源 / 明るさ4000ルーメン / 投影距離約40cmで100インチ',
    accessories: ['リモコン', 'HDMIケーブル (5m)', '電源コード', 'キャリングキャスターバッグ'],
  },
  {
    id: 'eq-011',
    code: 'PRJ-MOB-01',
    name: 'Anker Nebula Capsule 3 Laser (モバイルプロジェクター)',
    category: 'projector',
    categoryLabel: 'プロジェクター',
    status: 'available',
    location: '本社 2F カンファレンス備品庫 P-02',
    modelNumber: 'Anker D2426N11',
    specs: 'Google TV搭載 / フルHDレーザー / バッテリー内蔵約2.5h / 重量950g',
    accessories: ['専用三脚', 'AC充電器', 'リモコン', 'トラベル保護ケース'],
  },
  {
    id: 'eq-012',
    code: 'WIFI-5G-01',
    name: 'docomo 5Gモバイルルーター (無制限プラン)',
    category: 'wifi',
    categoryLabel: 'モバイルWi-Fi',
    status: 'available',
    location: '本社 5F 総務カウンター 保管庫 W-01',
    modelNumber: 'SHARP Wi-Fi STATION SH-52B',
    specs: '5G対応Sub6 / 下り最大4.2Gbps / Wi-Fi 6対応 / 国内無制限通信',
    accessories: ['Type-C充電器', 'LAN変換アダプタ', '設定手順マニュアル'],
  },
  {
    id: 'eq-013',
    code: 'WIFI-5G-02',
    name: 'UQ WiMAX Speed Wi-Fi 5G X12',
    category: 'wifi',
    categoryLabel: 'モバイルWi-Fi',
    status: 'in_use',
    location: '本社 5F 総務カウンター 保管庫 W-02',
    modelNumber: 'NEC NAR03',
    specs: '下り最大3.9Gbps / 5G SA対応 / 連続通信約9時間',
    accessories: ['充電アダプタ', 'ケース'],
    currentReservation: {
      id: 'res-104',
      userName: '渡辺 誠',
      department: '新規事業開発室',
      startDate: '2026-09-02',
      endDate: '2026-09-06',
      purpose: '地方自治体向けスマートシティ実証実験出張に伴う通信環境確保',
    },
  },
  {
    id: 'eq-014',
    code: 'PER-SPK-01',
    name: 'Jabra Speak 710 会議用スピーカーフォン (2台連結セット)',
    category: 'peripheral',
    categoryLabel: 'その他の周辺機器',
    status: 'available',
    location: '本社 4F サポートラック D-01',
    modelNumber: 'Jabra Speak 710 MS Duo',
    specs: '最大12名対応 (2台リンク時) / Bluetooth & USB接続 / 15時間バッテリー',
    accessories: ['Jabra Link 370 USBアダプタ×2', 'ネオプレンポーチ×2'],
  },
  {
    id: 'eq-015',
    code: 'PER-DCK-01',
    name: 'CalDigit TS4 Thunderbolt 4 ドッキングステーション',
    category: 'peripheral',
    categoryLabel: 'その他の周辺機器',
    status: 'available',
    location: '本社 4F サポートラック D-02',
    modelNumber: 'CalDigit TS4-JP-SG',
    specs: 'Thunderbolt 4 / 18ポート拡張 / 98Wホスト充電 / 2.5GbE有線LAN',
    accessories: ['230W電源アダプタ', 'Thunderbolt 4純正ケーブル (0.8m)'],
  },
  {
    id: 'eq-016',
    code: 'PER-MIC-01',
    name: 'Shure MV7 ポッドキャスト・配信向けダイナミックマイク',
    category: 'peripheral',
    categoryLabel: 'その他の周辺機器',
    status: 'maintenance',
    location: '本社 5F ITサポート 修理受付棚',
    modelNumber: 'Shure MV7-K-J',
    specs: 'USB/XLR両対応 / 音声自動分離テクノロジー / タッチパネル操作',
    accessories: ['卓上マイクスタンド', 'Micro-B to USB-Cケーブル', 'Micro-B to USB-Aケーブル'],
  },
];
