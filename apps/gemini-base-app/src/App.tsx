import { useState, useMemo } from 'react';
import './App.css';
import {
  type Equipment,
  type CategoryType,
  type EquipmentStatus,
  CATEGORIES,
  INITIAL_EQUIPMENTS,
} from './mockData';

export function App() {
  const [equipments, setEquipments] = useState<Equipment[]>(INITIAL_EQUIPMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Reservation Modal state
  const [targetEquipment, setTargetEquipment] = useState<Equipment | null>(null);
  const [userName, setUserName] = useState('山田 太郎');
  const [department, setDepartment] = useState('デジタル推進第1部');
  const [startDate, setStartDate] = useState('2026-09-04');
  const [endDate, setEndDate] = useState('2026-09-07');
  const [purpose, setPurpose] = useState('');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stats calculation
  const stats = useMemo(() => {
    const total = equipments.length;
    const available = equipments.filter((e) => e.status === 'available').length;
    const inUse = equipments.filter((e) => e.status === 'in_use').length;
    const maintenance = equipments.filter((e) => e.status === 'maintenance').length;
    return { total, available, inUse, maintenance };
  }, [equipments]);

  // Filtering
  const filteredEquipments = useMemo(() => {
    return equipments.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      // Search query (name, code, specs, modelNumber)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCode = item.code.toLowerCase().includes(query);
        const matchesSpecs = item.specs.toLowerCase().includes(query);
        const matchesModel = item.modelNumber.toLowerCase().includes(query);
        const matchesLocation = item.location.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesSpecs && !matchesModel && !matchesLocation) {
          return false;
        }
      }
      return true;
    });
  }, [equipments, selectedCategory, selectedStatus, searchQuery]);

  const handleOpenReservation = (equipment: Equipment) => {
    setTargetEquipment(equipment);
    setPurpose('');
  };

  const handleCloseModal = () => {
    setTargetEquipment(null);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEquipment) return;

    const newReservation = {
      id: `res-${Date.now()}`,
      userName,
      department,
      startDate,
      endDate,
      purpose: purpose.trim() || '業務利用',
    };

    setEquipments((prev) =>
      prev.map((item) =>
        item.id === targetEquipment.id
          ? {
              ...item,
              status: 'in_use' as EquipmentStatus,
              currentReservation: newReservation,
            }
          : item
      )
    );

    setToastMessage(`「${targetEquipment.name}」の予約を完了しました。社内メール宛に詳細を送信しました。`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);

    handleCloseModal();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  const getStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case 'available':
        return <span className="status-badge available">利用可能</span>;
      case 'in_use':
        return <span className="status-badge in_use">利用中</span>;
      case 'maintenance':
        return <span className="status-badge maintenance">点検・調整中</span>;
    }
  };

  return (
    <div className="app-container">
      {/* Global Toast */}
      {toastMessage && (
        <div className="toast-notification" role="status" aria-live="polite">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#22C55E"/>
          </svg>
          <div style={{ fontSize: '13px', lineHeight: '1.4' }}>{toastMessage}</div>
          <button className="toast-close" onClick={() => setToastMessage(null)} aria-label="通知を閉じる">
            ✕
          </button>
        </div>
      )}

      {/* Corporate Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-section">
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <div>
              <span className="brand-title">社内備品マネージャー</span>
              <span className="brand-badge" style={{ marginLeft: '8px' }}>社内ポータル</span>
            </div>
          </div>

          <div className="header-user-info">
            <div className="user-badge">
              <div className="user-avatar">山</div>
              <div>
                <strong>山田 太郎</strong>
                <span className="user-dept"> (デジタル推進第1部)</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* Page Title & Overview */}
        <div className="page-intro">
          <div className="page-title-row">
            <div>
              <h1 className="page-title">備品一覧・予約申請</h1>
              <p className="page-subtitle">
                社内で共有管理されているノートPC、モニター、カメラ、周辺機器等の空き状況確認および貸出予約が行えます。
              </p>
            </div>
          </div>

          {/* Quick Filter KPI Stats */}
          <div className="stats-container">
            <div
              className={`stat-card ${selectedStatus === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('all')}
              role="button"
              tabIndex={0}
            >
              <div>
                <div className="stat-title">全登録備品数</div>
                <div className="stat-value">{stats.total}</div>
              </div>
              <div className="stat-indicator total" />
            </div>

            <div
              className={`stat-card ${selectedStatus === 'available' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('available')}
              role="button"
              tabIndex={0}
            >
              <div>
                <div className="stat-title">今すぐ利用可能</div>
                <div className="stat-value" style={{ color: '#16a34a' }}>
                  {stats.available}
                </div>
              </div>
              <div className="stat-indicator available" />
            </div>

            <div
              className={`stat-card ${selectedStatus === 'in_use' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('in_use')}
              role="button"
              tabIndex={0}
            >
              <div>
                <div className="stat-title">現在貸出中</div>
                <div className="stat-value" style={{ color: '#b45309' }}>
                  {stats.inUse}
                </div>
              </div>
              <div className="stat-indicator in_use" />
            </div>

            <div
              className={`stat-card ${selectedStatus === 'maintenance' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('maintenance')}
              role="button"
              tabIndex={0}
            >
              <div>
                <div className="stat-title">点検・メンテ中</div>
                <div className="stat-value" style={{ color: '#64748b' }}>
                  {stats.maintenance}
                </div>
              </div>
              <div className="stat-indicator maintenance" />
            </div>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <section className="filter-bar" aria-label="検索と絞り込み">
          <div className="search-input-row">
            <div className="search-wrapper">
              <svg
                className="search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="備品名、管理番号、スペック、設置場所で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="検索クリア"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="quick-filter-selects">
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as EquipmentStatus | 'all')}
                aria-label="利用状況絞り込み"
              >
                <option value="all">利用状況: すべて</option>
                <option value="available">利用可能のみ</option>
                <option value="in_use">利用中のみ</option>
                <option value="maintenance">点検・調整中</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="category-pills-row">
            <span className="category-label-text">カテゴリ:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Results Toolbar */}
        <div className="results-toolbar">
          <div className="results-count">
            該当備品: <strong>{filteredEquipments.length}</strong> 件
            {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery) && (
              <span style={{ marginLeft: '12px', fontSize: '13px', color: '#64748b' }}>
                （条件絞り込み中）
              </span>
            )}
          </div>

          <div className="toolbar-actions">
            <div className="view-toggle" role="group" aria-label="表示形式切り替え">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="カード形式で表示"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                カード表示
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="リスト形式で表示"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                一覧表示
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredEquipments.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">該当する備品が見つかりませんでした</h3>
            <p className="empty-state-text">検索語句を変更するか、絞り込み条件を解除してお試しください。</p>
            <button type="button" className="btn-reset" onClick={handleResetFilters}>
              条件をリセットする
            </button>
          </div>
        )}

        {/* Grid View Mode */}
        {viewMode === 'grid' && filteredEquipments.length > 0 && (
          <div className="equipment-grid">
            {filteredEquipments.map((item) => (
              <div key={item.id} className="equipment-card">
                <div className="card-header">
                  <span className="card-code">{item.code}</span>
                  {getStatusBadge(item.status)}
                </div>

                <div className="card-body">
                  <div className="card-category">{item.categoryLabel}</div>
                  <h3 className="card-name">{item.name}</h3>

                  <div className="card-specs">
                    <strong>主要スペック:</strong> {item.specs}
                  </div>

                  <div className="card-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>保管場所: {item.location}</span>
                  </div>

                  {item.status === 'in_use' && item.currentReservation && (
                    <div className="current-reservation-info">
                      <div>
                        <strong>利用中:</strong> {item.currentReservation.userName}（{item.currentReservation.department}）
                      </div>
                      <div>
                        <strong>返却予定:</strong> {item.currentReservation.endDate} まで
                      </div>
                      <div style={{ marginTop: '4px', fontSize: '11px', color: '#78350f' }}>
                        用途: {item.currentReservation.purpose}
                      </div>
                    </div>
                  )}

                  {item.status === 'maintenance' && (
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        fontSize: '12px',
                        color: '#64748b',
                      }}
                    >
                      現在定期保守・点検中のため予約受付を停止しています。
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  {item.status === 'available' ? (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => handleOpenReservation(item)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      この備品を予約する
                    </button>
                  ) : item.status === 'in_use' ? (
                    <button type="button" className="btn-disabled" disabled>
                      貸出中 (返却待ち)
                    </button>
                  ) : (
                    <button type="button" className="btn-disabled" disabled>
                      点検中につき利用不可
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View Mode */}
        {viewMode === 'table' && filteredEquipments.length > 0 && (
          <div className="table-container">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>管理番号 / 備品名</th>
                  <th>カテゴリ</th>
                  <th>現在のステータス</th>
                  <th>保管・配備場所</th>
                  <th>利用予定・返却予定</th>
                  <th style={{ textAlign: 'right' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipments.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="table-equipment-code">{item.code}</div>
                      <div className="table-equipment-name">{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.specs}</div>
                    </td>
                    <td>
                      <span className="brand-badge">{item.categoryLabel}</span>
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td style={{ fontSize: '13px', color: '#475569' }}>{item.location}</td>
                    <td>
                      {item.status === 'available' && (
                        <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: 500 }}>
                          即時予約可能
                        </span>
                      )}
                      {item.status === 'in_use' && item.currentReservation && (
                        <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                          <div>{item.currentReservation.userName}</div>
                          <div style={{ color: '#b45309', fontWeight: 600 }}>
                            〜 {item.currentReservation.endDate} 予定
                          </div>
                        </div>
                      )}
                      {item.status === 'maintenance' && (
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>保守対応中</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {item.status === 'available' ? (
                        <button
                          type="button"
                          className="btn-primary compact"
                          onClick={() => handleOpenReservation(item)}
                        >
                          予約する
                        </button>
                      ) : (
                        <button type="button" className="btn-disabled compact" disabled>
                          不可
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Reservation Modal Dialog */}
      {targetEquipment && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="modal-title" className="modal-title">備品予約の申請</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseModal}
                aria-label="閉じる"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReservation}>
              <div className="modal-body">
                {/* Equipment summary in modal */}
                <div className="modal-equipment-summary">
                  <div className="summary-label">対象備品 / 管理番号: {targetEquipment.code}</div>
                  <div className="summary-name">{targetEquipment.name}</div>
                  <div className="summary-specs">
                    {targetEquipment.specs} | 保管: {targetEquipment.location}
                  </div>
                  {targetEquipment.accessories && targetEquipment.accessories.length > 0 && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#475569' }}>
                      <strong>同梱品:</strong> {targetEquipment.accessories.join('、')}
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="user-name-input">
                      予約者氏名 <span className="badge-required">必須</span>
                    </label>
                    <input
                      id="user-name-input"
                      type="text"
                      className="form-input"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="dept-input">
                      所属部署 <span className="badge-required">必須</span>
                    </label>
                    <input
                      id="dept-input"
                      type="text"
                      className="form-input"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="start-date-input">
                      利用開始日 <span className="badge-required">必須</span>
                    </label>
                    <input
                      id="start-date-input"
                      type="date"
                      className="form-input"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="end-date-input">
                      利用終了予定日 <span className="badge-required">必須</span>
                    </label>
                    <input
                      id="end-date-input"
                      type="date"
                      className="form-input"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="purpose-input">
                    利用目的・用途 <span className="badge-required">必須</span>
                  </label>
                  <textarea
                    id="purpose-input"
                    className="form-textarea"
                    rows={3}
                    placeholder="例: クライアント向け提案発表会でのプレゼンテーション上映のため"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  />
                </div>

                <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                  ※ 予約完了後、備品の受け取りは指定保管場所にてお願いいたします。返却時は付属品の欠品がないか確認の上、元の棚へお戻しください。
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  キャンセル
                </button>
                <button type="submit" className="btn-submit">
                  予約を確定する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
