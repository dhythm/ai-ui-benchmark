export type EquipmentStatus = "available" | "rented" | "reserved" | "maintenance";

export type EquipmentCategory =
  | "ノートPC"
  | "モニター"
  | "カメラ"
  | "プロジェクター"
  | "モバイルWi-Fi"
  | "周辺機器";

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  location: string;
  spec: string;
  borrower?: string;
  returnDate?: string;
  nextAvailable?: string;
  note?: string;
}

export const CATEGORIES: EquipmentCategory[] = [
  "ノートPC",
  "モニター",
  "カメラ",
  "プロジェクター",
  "モバイルWi-Fi",
  "周辺機器",
];

export const STATUS_META: Record<
  EquipmentStatus,
  { label: string; short: string }
> = {
  available: { label: "利用可能", short: "利用可" },
  rented: { label: "貸出中", short: "貸出中" },
  reserved: { label: "予約中", short: "予約中" },
  maintenance: { label: "点検中", short: "点検中" },
};

export const INITIAL_EQUIPMENT: Equipment[] = [
  { id: "EQ-001", name: "MacBook Pro 14インチ (M4)", category: "ノートPC", status: "available", location: "東京本社・3F 備品庫A", spec: "M4 / メモリ18GB / SSD 512GB", nextAvailable: "即日" },
  { id: "EQ-002", name: "MacBook Air 13インチ (M3)", category: "ノートPC", status: "rented", location: "東京本社・3F 備品庫A", spec: "M3 / メモリ16GB / SSD 512GB", borrower: "営業部・佐藤", returnDate: "9/10", nextAvailable: "9/11〜" },
  { id: "EQ-003", name: "ThinkPad X1 Carbon Gen13", category: "ノートPC", status: "available", location: "東京本社・3F 備品庫A", spec: "Core Ultra 7 / メモリ32GB / SSD 1TB", nextAvailable: "即日" },
  { id: "EQ-004", name: "Surface Laptop 7 (15インチ)", category: "ノートPC", status: "reserved", location: "東京本社・3F 備品庫A", spec: "Snapdragon X Elite / メモリ16GB", borrower: "企画部・中村", returnDate: "9/8〜9/12 予約", nextAvailable: "9/13〜" },
  { id: "EQ-005", name: "dynabook G9 (軽量モバイル)", category: "ノートPC", status: "available", location: "大阪支社・備品庫", spec: "Core i7 / 875g / バッテリー24h", nextAvailable: "即日" },
  { id: "EQ-006", name: "Dell 27インチ 4Kモニター U2723QE", category: "モニター", status: "available", location: "東京本社・3F 備品庫B", spec: "27型 4K / USB-C 90W給電 / HDMI付属", nextAvailable: "即日" },
  { id: "EQ-007", name: "LG 34インチ ウルトラワイド", category: "モニター", status: "rented", location: "東京本社・3F 備品庫B", spec: "34型 UWQHD / 曲面 / スピーカー内蔵", borrower: "開発部・高橋", returnDate: "9/19", nextAvailable: "9/22〜" },
  { id: "EQ-008", name: "EIZO 24インチ モニター EV2495", category: "モニター", status: "available", location: "大阪支社・備品庫", spec: "24型 フルHD / USB-Cドック / 縦置き可", nextAvailable: "即日" },
  { id: "EQ-009", name: "モバイルモニター 15.6インチ", category: "モニター", status: "available", location: "東京本社・3F 備品庫B", spec: "15.6型 フルHD / 780g / ケース一体型", nextAvailable: "即日", note: "出張用に人気" },
  { id: "EQ-010", name: "SONY α7 IV ミラーレス一眼", category: "カメラ", status: "rented", location: "東京本社・2F 広報庫", spec: "フルサイズ / 標準ズーム付 / 予備バッテリー付", borrower: "広報部・伊藤", returnDate: "9/6", nextAvailable: "9/8〜" },
  { id: "EQ-011", name: "SONY ZV-E10 Vlogカメラ", category: "カメラ", status: "available", location: "東京本社・2F 広報庫", spec: "APS-C / 三脚グリップ付 / マイク付", nextAvailable: "即日" },
  { id: "EQ-012", name: "GoPro HERO 13", category: "カメラ", status: "available", location: "東京本社・2F 広報庫", spec: "防水10m / 自撮り棒・マウント一式", nextAvailable: "即日" },
  { id: "EQ-013", name: "DJI Osmo Pocket 3", category: "カメラ", status: "reserved", location: "東京本社・2F 広報庫", spec: "ジンバル一体型 / 4K120p / 延長ロッド付", borrower: "人事部・小林", returnDate: "9/9〜9/10 予約", nextAvailable: "9/11〜" },
  { id: "EQ-014", name: "EPSON プロジェクター EB-2250U", category: "プロジェクター", status: "available", location: "東京本社・3F 備品庫B", spec: "5000lm / フルHD / HDMI・無線対応", nextAvailable: "即日" },
  { id: "EQ-015", name: "Anker Nebula モバイルプロジェクター", category: "プロジェクター", status: "available", location: "東京本社・3F 備品庫B", spec: "800lm / バッテリー内蔵 / スクリーン付", nextAvailable: "即日", note: "小会議・出先用" },
  { id: "EQ-016", name: "SONY 4Kプロジェクター VPL-XW5000", category: "プロジェクター", status: "maintenance", location: "東京本社・3F 備品庫B", spec: "4K / 2000lm / 点検のため9/12まで利用不可", nextAvailable: "9/13〜" },
  { id: "EQ-017", name: "docomo 5G モバイルWi-Fi SH-52C", category: "モバイルWi-Fi", status: "available", location: "東京本社・1F 受付庫", spec: "5G / 同時接続15台 / 充電器付", nextAvailable: "即日" },
  { id: "EQ-018", name: "au 5G モバイルWi-Fi X12", category: "モバイルWi-Fi", status: "rented", location: "東京本社・1F 受付庫", spec: "5G / 同時接続16台 / 海外出張可", borrower: "営業部・加藤", returnDate: "9/15", nextAvailable: "9/16〜" },
  { id: "EQ-019", name: "Rakuten モバイルWi-Fi (予備機)", category: "モバイルWi-Fi", status: "available", location: "大阪支社・備品庫", spec: "4G / 同時接続10台 / 長期貸出可", nextAvailable: "即日" },
  { id: "EQ-020", name: "Jabra Speak 510 会議スピーカー", category: "周辺機器", status: "available", location: "東京本社・3F 備品庫C", spec: "Bluetooth / 全指向性マイク / ケース付", nextAvailable: "即日" },
  { id: "EQ-021", name: "Logicool MX Keys + MX Master セット", category: "周辺機器", status: "rented", location: "東京本社・3F 備品庫C", spec: "ワイヤレス / Unifying・BT対応", borrower: "開発部・山田", returnDate: "9/30", nextAvailable: "10/1〜" },
  { id: "EQ-022", name: "Anker 7-in-1 USB-Cハブ", category: "周辺機器", status: "available", location: "東京本社・1F 受付庫", spec: "HDMI 4K / PD100W / SD・USB-A×2", nextAvailable: "即日" },
  { id: "EQ-023", name: "SONY ワイヤレスヘッドセット WH-1000XM5", category: "周辺機器", status: "reserved", location: "東京本社・3F 備品庫C", spec: "ノイキャン / オンライン会議用マイク付", borrower: "総務部・鈴木", returnDate: "9/7〜9/8 予約", nextAvailable: "9/9〜" },
  { id: "EQ-024", name: "HDMIキャプチャー + 配信セット", category: "周辺機器", status: "maintenance", location: "東京本社・2F 広報庫", spec: "4K対応 / ケーブル・三脚一式 / 点検中", nextAvailable: "未定" },
];
