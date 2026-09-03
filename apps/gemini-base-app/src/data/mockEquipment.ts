import type { Equipment, EquipmentCategory } from '../types/equipment';

export const CATEGORY_LABELS: Record<EquipmentCategory, { label: string; iconName: string; color: string }> = {
  pc: { label: 'ノートPC', iconName: 'Laptop', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  monitor: { label: 'モニター', iconName: 'Monitor', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  camera: { label: 'カメラ', iconName: 'Camera', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  projector: { label: 'プロジェクター', iconName: 'Projector', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  wifi: { label: 'モバイルWi-Fi', iconName: 'Wifi', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  accessory: { label: '周辺機器', iconName: 'Cpu', color: 'bg-slate-100 text-slate-700 border-slate-200' }
};

export const INITIAL_EQUIPMENT_LIST: Equipment[] = [
  {
    id: 'eq-001',
    code: 'PC-2024-001',
    name: 'MacBook Pro 16" (M3 Max / 36GB / 1TB)',
    category: 'pc',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    location: '本社4F IT備品室 A-1',
    description: '高性能ビデオ編集・AI開発・デモプレゼンに最適なハイスペックMacBook Proです。常時最新のmacOSがインストールされています。',
    specs: [
      { label: 'CPU/GPU', value: 'Apple M3 Max (14コアCPU/30コアGPU)' },
      { label: 'メモリ', value: '36GB Unified Memory' },
      { label: 'ストレージ', value: '1TB NVMe SSD' },
      { label: '重量', value: '2.14kg' }
    ],
    reservations: [
      {
        id: 'res-101',
        userName: '佐々木 健太',
        department: 'デザイン部',
        purpose: 'クライアントプレゼン用動画レンダリング',
        startDate: '2026-09-05 10:00',
        endDate: '2026-09-05 18:00'
      }
    ],
    isFavorite: true,
    tags: ['Mac', '高スペック', '4K出力可', '動画編集'],
    lastMaintenanceDate: '2026-08-15'
  },
  {
    id: 'eq-002',
    code: 'PC-2024-002',
    name: 'ThinkPad X1 Carbon Gen 11 (Core i7 / 32GB)',
    category: 'pc',
    status: 'in_use',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    location: '本社4F IT備品室 A-2',
    description: '軽量1.12kgのビジネスフラッグシップノートPC。出張や社外商談、在宅勤務時の開発用としても人気があります。',
    specs: [
      { label: 'OS', value: 'Windows 11 Pro' },
      { label: 'CPU', value: 'Intel Core i7-1365U' },
      { label: 'メモリ', value: '32GB LPDDR5' },
      { label: '重量', value: '1.12kg' }
    ],
    currentBorrower: {
      name: '佐藤 拓也',
      department: '営業第一部',
      until: '2026-09-04 17:00',
      purpose: '関西エリア出張・客先プレゼン'
    },
    reservations: [],
    isFavorite: false,
    tags: ['Windows', '超軽量', '出張向け', 'LTE対応'],
    lastMaintenanceDate: '2026-08-01'
  },
  {
    id: 'eq-003',
    code: 'MON-2023-010',
    name: 'Dell UltraSharp U2723QE 27" 4K Type-C モニター',
    category: 'monitor',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    location: '本社3F 共有ワークスペース Hub-B',
    description: 'USB-Cケーブル1本で90W給電と画面出力・ハブ機能が完備された27インチ4K IPS Black液晶モニターです。',
    specs: [
      { label: '解像度', value: '4K UHD (3840 x 2160)' },
      { label: 'パネル', value: 'IPS Black (コントラスト比 2000:1)' },
      { label: '端子', value: 'USB-C (90W給電), HDMI 2.1, DP 1.4' },
      { label: '付属', value: '専用キャリングケース付' }
    ],
    reservations: [],
    isFavorite: true,
    tags: ['4K', 'USB-C給電', 'ハブ機能', 'ピボット可能'],
    lastMaintenanceDate: '2026-07-20'
  },
  {
    id: 'eq-004',
    code: 'CAM-2024-001',
    name: 'Sony α7 IV ミラーレス一眼カメラ 4K配信キット',
    category: 'camera',
    status: 'reserved',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    location: '本社5F スタジオ機材庫 C-1',
    description: '高品位な社内オンラインイベント・ウェビナー配信、動画撮影に最適なフルサイズ一眼セット。キャプチャーボードと三脚が付属します。',
    specs: [
      { label: 'センサー', value: '3300万画素 フルサイズ' },
      { label: '動画性能', value: '4K 60p / 10-bit 4:2:2' },
      { label: '付属レンズ', value: 'FE 24-70mm F2.8 GM II' },
      { label: '同梱物', value: 'HDMIキャプチャー, 三脚, マイク' }
    ],
    reservations: [
      {
        id: 'res-102',
        userName: '高橋 涼子',
        department: '広報・マーケティング部',
        purpose: '新製品発表オンラインセミナーライブ配信',
        startDate: '2026-09-04 13:00',
        endDate: '2026-09-04 18:30'
      }
    ],
    isFavorite: true,
    tags: ['4K配信', 'ミラーレス一眼', '高画質', '配信キット'],
    lastMaintenanceDate: '2026-08-25'
  },
  {
    id: 'eq-005',
    code: 'PRJ-2023-005',
    name: 'EPSON EB-FH52 高輝度4000lm フルHDプロジェクター',
    category: 'projector',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
    location: '本社2F 大会議室 前備品庫',
    description: '4000ルーメンの明るさで明るい部屋でも鮮明に投写可能。無線LAN内蔵でスマホやPCからのワイヤレス投写に対応。',
    specs: [
      { label: '明るさ', value: '4000lm (ルーメン)' },
      { label: '解像度', value: 'Full HD (1920 x 1080)' },
      { label: '接続', value: 'HDMI x2, USB, ワイヤレスDirect' },
      { label: 'スピーカー', value: '16W 内蔵' }
    ],
    reservations: [],
    isFavorite: false,
    tags: ['高輝度', 'ワイヤレス投写', '大型会議室用'],
    lastMaintenanceDate: '2026-06-10'
  },
  {
    id: 'eq-006',
    code: 'WIFI-2024-003',
    name: 'Speed Wi-Fi 5G X12 モバイルルーター (無制限プラン)',
    category: 'wifi',
    status: 'in_use',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    location: '本社4F IT備品室 B-1',
    description: '5G高速通信に対応した社内検証用モバイルルーター。下り最大3.9Gbpsの高速・安定通信で屋外やイベント会場でも快適利用。',
    specs: [
      { label: '通信規格', value: '5G / 4G LTE' },
      { label: '最大速度', value: '受信最大 3.9Gbps' },
      { label: '連続使用', value: '約9時間' },
      { label: '接続台数', value: '最大16台' }
    ],
    currentBorrower: {
      name: '中村 裕介',
      department: 'DX推進部',
      until: '2026-09-06 12:00',
      purpose: '野外イベント現場実証実験'
    },
    reservations: [],
    isFavorite: false,
    tags: ['5G', '通信無制限', '屋外イベント', '即即利用可'],
    lastMaintenanceDate: '2026-08-10'
  },
  {
    id: 'eq-007',
    code: 'ACC-2024-012',
    name: 'Jabra Speak 750 MS 会議用スピーカーフォン',
    category: 'accessory',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    location: '本社3F 小会議室ラック',
    description: 'フルデュプレックスオーディオ搭載で、双方の会話が途切れないWeb会議用高性能マイクスピーカー。最大6〜12名対応。',
    specs: [
      { label: 'マイク', value: '無指向性 (360度集音)' },
      { label: '接続', value: 'Bluetooth 4.2 / USB-A ドングル' },
      { label: 'バッテリー', value: '最大11時間' },
      { label: '認定', value: 'Microsoft Teams 認定' }
    ],
    reservations: [
      {
        id: 'res-103',
        userName: '渡辺 恵美',
        department: '人事部',
        purpose: '採用一次面接オンライン集団面接',
        startDate: '2026-09-04 09:30',
        endDate: '2026-09-04 12:00'
      }
    ],
    isFavorite: true,
    tags: ['Teams認定', 'ノイズキャンセリング', '360度集音', 'Bluetooth'],
    lastMaintenanceDate: '2026-08-01'
  },
  {
    id: 'eq-008',
    code: 'PRJ-2024-001',
    name: 'Anker Nebula Capsule 3 Laser モバイルプロジェクター',
    category: 'projector',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&auto=format&fit=crop&q=80',
    location: '本社4F IT備品室 A-4',
    description: '500ml缶サイズの超小型レーザープロジェクター。バッテリー内蔵で電源のない場所でも即座に大画面投写が可能。',
    specs: [
      { label: '光源', value: 'レーザー (フルHD 1080p)' },
      { label: '明るさ', value: '300 ANSI ルーメン' },
      { label: 'OS', value: 'Google TV 搭載' },
      { label: 'バッテリー', value: '約2.5時間再生' }
    ],
    reservations: [],
    isFavorite: false,
    tags: ['超小型', 'バッテリー内蔵', '出張プレゼン', 'オートフォーカス'],
    lastMaintenanceDate: '2026-07-15'
  },
  {
    id: 'eq-009',
    code: 'MON-2024-003',
    name: 'ASUS ZenScreen MB16AH 15.6インチ モバイルモニター',
    category: 'monitor',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&auto=format&fit=crop&q=80',
    location: '本社4F IT備品室 A-3',
    description: '薄さ9mm、重さ730gの軽量モバイルモニター。外出先やコワーキングスペースでのデュアルディスプレイ環境構築に。',
    specs: [
      { label: 'サイズ/解像度', value: '15.6インチ Full HD (1920x1080)' },
      { label: '入力端子', value: 'USB Type-C, Micro HDMI' },
      { label: '重量', value: '730g' },
      { label: 'ケース', value: '折りたたみスリーブケース兼用' }
    ],
    reservations: [],
    isFavorite: false,
    tags: ['モバイル', '薄型超軽量', 'USB-C1本駆動'],
    lastMaintenanceDate: '2026-08-18'
  },
  {
    id: 'eq-010',
    code: 'CAM-2023-008',
    name: 'Logitech Brio 4K Ultra HD Webカメラ',
    category: 'camera',
    status: 'in_use',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    location: '本社3F 会議室サテライト',
    description: 'HDR・5倍ズーム対応の最高峰Webカメラ。光量が少ない会議室でも顔映りを鮮明かつ明るく自動補正します。',
    specs: [
      { label: '画質', value: '4K/30fps, 1080p/60fps' },
      { label: '画角', value: '90° / 78° / 65° 調整可能' },
      { label: 'マイク', value: 'デュアル全指向性マイク' },
      { label: '機能', value: 'HDR & RightLight 3' }
    ],
    currentBorrower: {
      name: '小林 直樹',
      department: '海外事業部',
      until: '2026-09-04 18:00',
      purpose: '米国拠点との役員合同Web会議'
    },
    reservations: [],
    isFavorite: false,
    tags: ['4K Webカメラ', 'HDR画質補正', '暗所対応'],
    lastMaintenanceDate: '2026-05-30'
  },
  {
    id: 'eq-011',
    code: 'ACC-2024-005',
    name: 'Anker 577 Thunderbolt 4 ドッキングステーション (13-in-1)',
    category: 'accessory',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1616440342232-017770ad46c6?w=600&auto=format&fit=crop&q=80',
    location: '本社4F デスク島 12番',
    description: '最大85WノートPC給電、デュアル4K画面出力、高速SDカードスロット、10Gbps USBポートを拡張できる万能ドック。',
    specs: [
      { label: 'ポート数', value: '13ポート (Thunderbolt 4 x2, HDMI x2等)' },
      { label: '給電', value: 'パススルー最大85W' },
      { label: '画面出力', value: 'シングル8K / デュアル4K@60Hz' },
      { label: '伝送速度', value: '最大40Gbps' }
    ],
    reservations: [],
    isFavorite: false,
    tags: ['Thunderbolt4', '85W急速給電', 'マルチディスプレイ'],
    lastMaintenanceDate: '2026-07-01'
  },
  {
    id: 'eq-012',
    code: 'PC-2024-005',
    name: 'Microsoft Surface Laptop 5 (Core i7 / 16GB / 512GB)',
    category: 'pc',
    status: 'maintenance',
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
    location: '本社4F IT修理・メンテナンス棚',
    description: 'スタイリッシュな13.5インチタッチスクリーン液晶搭載PC。現在OSアップグレードおよびバッテリー点検作業中。',
    specs: [
      { label: 'ディスプレイ', value: '13.5インチ PixelSense (タッチ対応)' },
      { label: 'CPU', value: 'Intel Core i7-1255U' },
      { label: 'メモリ/SSD', value: '16GB / 512GB' },
      { label: '状況', value: 'バッテリー交換・点検中 (9/6復旧予定)' }
    ],
    reservations: [],
    isFavorite: false,
    tags: ['Surface', 'タッチ操作', '点検中'],
    lastMaintenanceDate: '2026-09-02'
  },
  {
    id: 'eq-013',
    code: 'WIFI-2024-001',
    name: 'グローバル Wi-Fi 5G (世界130ヶ国対応 ルーター)',
    category: 'wifi',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80',
    location: '本社4F 金庫室海外渡航用ケース',
    description: '海外出張・海外カンファレンス参加者専用のグローバル対応Wi-Fiルーター。事前渡航申請が必要です。',
    specs: [
      { label: '対応国', value: '世界130ヶ国以上 (クラウドSIM)' },
      { label: '通信容量', value: '1日3GB制限 (高速通信)' },
      { label: 'バッテリー', value: '最大15時間連続動作' },
      { label: '付属品', value: 'マルチ変換プラグ, 専用ポーチ' }
    ],
    reservations: [
      {
        id: 'res-104',
        userName: '山本 智也',
        department: '新規事業開発部',
        purpose: 'サンフランシスコTechCrunch展示会出張',
        startDate: '2026-09-10 08:00',
        endDate: '2026-09-17 22:00'
      }
    ],
    isFavorite: false,
    tags: ['海外出張用', 'クラウドSIM', 'マルチ変換プラグ付'],
    lastMaintenanceDate: '2026-08-20'
  },
  {
    id: 'eq-014',
    code: 'ACC-2024-020',
    name: 'Logicool Spotlight プレゼンテーション リモート',
    category: 'accessory',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=600&auto=format&fit=crop&q=80',
    location: '本社4F IT備品室 A-5',
    description: '画面上の特定エリアをハイライト・ズーム表示できる最新プレゼンター。役員プレゼンや大型セミナーで威力を発揮します。',
    specs: [
      { label: '接続', value: 'Bluetooth & 2.4GHz USBレシーバー' },
      { label: '操作範囲', value: '最大30m' },
      { label: '充電', value: 'USB-C (1分充電で3時間使用可能)' },
      { label: '対応OS', value: 'Windows / macOS / Keynote / PowerPoint' }
    ],
    reservations: [],
    isFavorite: false,
    tags: ['プレゼンター', 'ハイライト機能', 'タイマーバイブ搭載'],
    lastMaintenanceDate: '2026-07-10'
  }
];

export const CURRENT_USER = {
  id: 'usr-001',
  name: '山田 太郎',
  department: 'プロダクト開発部',
  email: 't.yamada@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};
