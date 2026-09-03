import React, { useState, useMemo } from 'react';
import './App.css';
import {
  type Equipment,
  type EquipmentCategory,
  type EquipmentStatus,
  CATEGORY_LABELS,
  STATUS_LABELS,
  INITIAL_EQUIPMENT_LIST,
} from './data';

type ViewMode = 'table' | 'grid';

export default function App() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(INITIAL_EQUIPMENT_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Modals state
  const [reservingItem, setReservingItem] = useState<Equipment | null>(null);
  const [detailItem, setDetailItem] = useState<Equipment | null>(null);

  // Reservation form state
  const [reserveUserName, setReserveUserName] = useState('山田 太郎');
  const [reserveDepartment, setReserveDepartment] = useState('技術開発本部');
  const [reserveStartDate, setReserveStartDate] = useState('2026-09-04');
  const [reserveEndDate, setReserveEndDate] = useState('2026-09-07');
  const [reservePurpose, setReservePurpose] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // KPIs
  const stats = useMemo(() => {
    const total = equipmentList.length;
    const available = equipmentList.filter((e) => e.status === 'available').length;
    const inUse = equipmentList.filter((e) => e.status === 'in_use').length;
    const maintenance = equipmentList.filter((e) => e.status === 'maintenance').length;
    return { total, available, inUse, maintenance };
  }, [equipmentList]);

  // Filtered list
  const filteredList = useMemo(() => {
    return equipmentList.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      // Search query (name, assetCode, modelNumber, location, specs)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.assetCode.toLowerCase().includes(q);
        const matchModel = item.modelNumber.toLowerCase().includes(q);
        const matchLocation = item.location.toLowerCase().includes(q);
        const matchSpecs = item.specs.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchModel && !matchLocation && !matchSpecs) {
          return false;
        }
      }
      return true;
    });
  }, [equipmentList, selectedCategory, selectedStatus, searchQuery]);

  // Handle open reserve modal
  const handleOpenReserve = (item: Equipment) => {
    setReservingItem(item);
    setReservePurpose('');
  };

  // Handle submit reservation
  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservingItem) return;

    const updated = equipmentList.map((item) => {
      if (item.id === reservingItem.id) {
        return {
          ...item,
          status: 'in_use' as EquipmentStatus,
          currentReservation: {
            id: `res-${Date.now()}`,
            userName: reserveUserName.trim() || '山田 太郎',
            department: reserveDepartment.trim() || '技術開発本部',
            startDate: reserveStartDate,
            endDate: reserveEndDate,
            purpose: reservePurpose.trim() || '業務利用',
          },
        };
      }
      return item;
    });

    setEquipmentList(updated);
    showToast(`「${reservingItem.name}」の予約を完了しました（利用期間: ${reserveStartDate} 〜 ${reserveEndDate}）`);
    setReservingItem(null);
  };

  // Handle cancel reservation (quick release for demo)
  const handleReturnEquipment = (item: Equipment) => {
    const updated = equipmentList.map((eq) => {
      if (eq.id === item.id) {
        return {
          ...eq,
          status: 'available' as EquipmentStatus,
          currentReservation: undefined,
        };
      }
      return eq;
    });
    setEquipmentList(updated);
    if (detailItem?.id === item.id) {
      setDetailItem(null);
    }
    showToast(`「${item.name}」の返却処理を完了し、利用可能に変更しました`);
  };

  const categories = Object.keys(CATEGORY_LABELS) as EquipmentCategory[];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <div>
              <h1 className="brand-title">社内共有備品ポータル</h1>
              <p className="brand-subtitle">Asset Management & Reservation System</p>
            </div>
          </div>

          <div className="header-user">
            <div className="user-avatar">山</div>
            <span>山田 太郎 (技術開発本部)</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Toast Feedback */}
        {toastMessage && (
          <div className="toast-notification" role="status">
            <div className="toast-content">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              className="toast-close"
              aria-label="閉じる"
              onClick={() => setToastMessage(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Status KPI summary cards */}
        <section className="stats-grid" aria-label="利用状況集計">
          <button
            type="button"
            className={`stat-card ${selectedStatus === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('all')}
          >
            <div className="stat-header">
              <span className="stat-label">全備品</span>
              <span className="stat-indicator all"></span>
            </div>
            <div className="stat-value">{stats.total}</div>
          </button>

          <button
            type="button"
            className={`stat-card ${selectedStatus === 'available' ? 'active' : ''}`}
            onClick={() => setSelectedStatus(selectedStatus === 'available' ? 'all' : 'available')}
          >
            <div className="stat-header">
              <span className="stat-label">利用可能</span>
              <span className="stat-indicator available"></span>
            </div>
            <div className="stat-value">{stats.available}</div>
          </button>

          <button
            type="button"
            className={`stat-card ${selectedStatus === 'in_use' ? 'active' : ''}`}
            onClick={() => setSelectedStatus(selectedStatus === 'in_use' ? 'all' : 'in_use')}
          >
            <div className="stat-header">
              <span className="stat-label">貸出中</span>
              <span className="stat-indicator in_use"></span>
            </div>
            <div className="stat-value">{stats.inUse}</div>
          </button>

          <button
            type="button"
            className={`stat-card ${selectedStatus === 'maintenance' ? 'active' : ''}`}
            onClick={() => setSelectedStatus(selectedStatus === 'maintenance' ? 'all' : 'maintenance')}
          >
            <div className="stat-header">
              <span className="stat-label">点検中</span>
              <span className="stat-indicator maintenance"></span>
            </div>
            <div className="stat-value">{stats.maintenance}</div>
          </button>
        </section>

        {/* Search & Filter Toolbar */}
        <section className="filter-panel" aria-label="検索と絞り込み">
          <div className="search-row">
            <div className="search-box">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="search"
                className="search-input"
                placeholder="備品名・管理番号・型番・保管場所で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  aria-label="検索ワードをクリア"
                  onClick={() => setSearchQuery('')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            <div className="view-mode-group" role="radiogroup" aria-label="表示形式切替">
              <button
                type="button"
                className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                aria-pressed={viewMode === 'table'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                テーブル
              </button>
              <button
                type="button"
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                カード
              </button>
            </div>
          </div>

          <div className="category-filter-row" role="tablist" aria-label="カテゴリ絞り込み">
            <button
              type="button"
              className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              すべて
            </button>
            {categories.map((catKey) => (
              <button
                key={catKey}
                type="button"
                className={`category-chip ${selectedCategory === catKey ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === catKey ? 'all' : catKey)}
              >
                {CATEGORY_LABELS[catKey]}
              </button>
            ))}
          </div>
        </section>

        {/* Results metadata bar */}
        <div className="results-meta-bar">
          <div>
            該当備品: <strong>{filteredList.length}</strong> 件
            {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery.trim() !== '') && (
              <span> (絞り込み適用中)</span>
            )}
          </div>
          {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery.trim() !== '') && (
            <button
              type="button"
              className="reset-filter-btn"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
            >
              条件をクリア
            </button>
          )}
        </div>

        {/* Results Content */}
        {filteredList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 className="empty-title">一致する備品が見つかりませんでした</h3>
            <p className="empty-desc">検索キーワードやカテゴリ・利用状況の選択を変更してお試しください。</p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="table-container">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>管理番号</th>
                  <th>カテゴリ</th>
                  <th>備品名・仕様</th>
                  <th>保管場所</th>
                  <th>利用状況</th>
                  <th>現在の利用者・期間</th>
                  <th style={{ textAlign: 'right' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => {
                  const isAvail = item.status === 'available';
                  return (
                    <tr key={item.id}>
                      <td className="cell-asset-code">{item.assetCode}</td>
                      <td>
                        <span className="category-tag">{CATEGORY_LABELS[item.category]}</span>
                      </td>
                      <td>
                        <div className="cell-name-container">
                          <span className="cell-name-text">{item.name}</span>
                          <span className="cell-spec-text">{item.specs}</span>
                        </div>
                      </td>
                      <td className="cell-location">{item.location}</td>
                      <td>
                        <span className={`status-badge ${item.status}`}>
                          {STATUS_LABELS[item.status]}
                        </span>
                      </td>
                      <td>
                        {item.currentReservation ? (
                          <div className="cell-rental-info">
                            <span>{item.currentReservation.userName} ({item.currentReservation.department})</span>
                            <span className="rental-period">
                              {item.currentReservation.startDate} 〜 {item.currentReservation.endDate}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>-</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setDetailItem(item)}
                          >
                            詳細
                          </button>
                          {isAvail ? (
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => handleOpenReserve(item)}
                            >
                              予約する
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-primary"
                              disabled
                            >
                              予約不可
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Card Grid View */
          <div className="equipment-grid">
            {filteredList.map((item) => {
              const isAvail = item.status === 'available';
              return (
                <div key={item.id} className="equipment-card">
                  <div className="card-header">
                    <div className="card-tags">
                      <span className="category-tag">{CATEGORY_LABELS[item.category]}</span>
                      <span className="card-asset-code">{item.assetCode}</span>
                    </div>
                    <span className={`status-badge ${item.status}`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                  </div>

                  <div className="card-body">
                    <h3 className="card-title">{item.name}</h3>
                    <p className="card-specs">{item.specs}</p>

                    <div className="card-meta-list">
                      <div className="card-meta-item">
                        <span className="meta-label">保管場所</span>
                        <span className="meta-val">{item.location}</span>
                      </div>
                      <div className="card-meta-item">
                        <span className="meta-label">型番</span>
                        <span className="meta-val">{item.modelNumber}</span>
                      </div>
                      {item.currentReservation && (
                        <div className="card-meta-item">
                          <span className="meta-label">利用者</span>
                          <span className="meta-val">
                            {item.currentReservation.userName} ({item.currentReservation.endDate}まで)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => setDetailItem(item)}
                    >
                      詳細
                    </button>
                    {isAvail ? (
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ flex: 1 }}
                        onClick={() => handleOpenReserve(item)}
                      >
                        予約する
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ flex: 1 }}
                        disabled
                      >
                        予約不可
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Reservation Modal */}
      {reservingItem && (
        <div
          className="modal-backdrop"
          onClick={() => setReservingItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">備品予約の申込み</h2>
              <button
                type="button"
                className="modal-close-btn"
                aria-label="モーダルを閉じる"
                onClick={() => setReservingItem(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReservation}>
              <div className="modal-body">
                {/* Target Equipment Summary */}
                <div className="modal-item-summary">
                  <div className="summary-asset-row">
                    <span className="category-tag">{CATEGORY_LABELS[reservingItem.category]}</span>
                    <span className="cell-asset-code">{reservingItem.assetCode}</span>
                  </div>
                  <div className="summary-title">{reservingItem.name}</div>
                  <div className="summary-detail">保管場所: {reservingItem.location}</div>
                </div>

                <div className="modal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="reserveUserName" className="form-label">予約者氏名</label>
                      <input
                        id="reserveUserName"
                        type="text"
                        required
                        className="form-input"
                        value={reserveUserName}
                        onChange={(e) => setReserveUserName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="reserveDepartment" className="form-label">所属部署</label>
                      <input
                        id="reserveDepartment"
                        type="text"
                        required
                        className="form-input"
                        value={reserveDepartment}
                        onChange={(e) => setReserveDepartment(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="reserveStartDate" className="form-label">利用開始日</label>
                      <input
                        id="reserveStartDate"
                        type="date"
                        required
                        className="form-input"
                        value={reserveStartDate}
                        onChange={(e) => setReserveStartDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="reserveEndDate" className="form-label">利用終了日</label>
                      <input
                        id="reserveEndDate"
                        type="date"
                        required
                        className="form-input"
                        value={reserveEndDate}
                        onChange={(e) => setReserveEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reservePurpose" className="form-label">利用目的</label>
                    <textarea
                      id="reservePurpose"
                      required
                      placeholder="例: クライアント先でのプレゼン利用のため"
                      className="form-textarea"
                      value={reservePurpose}
                      onChange={(e) => setReservePurpose(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setReservingItem(null)}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  予約を確定する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Equipment Detail Modal */}
      {detailItem && (
        <div
          className="modal-backdrop"
          onClick={() => setDetailItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">備品詳細情報</h2>
              <button
                type="button"
                className="modal-close-btn"
                aria-label="モーダルを閉じる"
                onClick={() => setDetailItem(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="category-tag">{CATEGORY_LABELS[detailItem.category]}</span>
                <span className={`status-badge ${detailItem.status}`}>
                  {STATUS_LABELS[detailItem.status]}
                </span>
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {detailItem.name}
              </h3>

              <table className="detail-table">
                <tbody>
                  <tr>
                    <th>管理番号</th>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{detailItem.assetCode}</td>
                  </tr>
                  <tr>
                    <th>型番</th>
                    <td>{detailItem.modelNumber}</td>
                  </tr>
                  <tr>
                    <th>保管場所</th>
                    <td>{detailItem.location}</td>
                  </tr>
                  <tr>
                    <th>スペック・仕様</th>
                    <td>{detailItem.specs}</td>
                  </tr>
                </tbody>
              </table>

              {detailItem.currentReservation && (
                <div className="reservation-box">
                  <div className="reservation-box-title">現在の貸出情報</div>
                  <table className="detail-table" style={{ background: 'transparent' }}>
                    <tbody>
                      <tr>
                        <th>使用者</th>
                        <td>{detailItem.currentReservation.userName} ({detailItem.currentReservation.department})</td>
                      </tr>
                      <tr>
                        <th>利用期間</th>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {detailItem.currentReservation.startDate} 〜 {detailItem.currentReservation.endDate}
                        </td>
                      </tr>
                      <tr>
                        <th>利用目的</th>
                        <td>{detailItem.currentReservation.purpose}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.375rem 0.625rem' }}
                      onClick={() => handleReturnEquipment(detailItem)}
                    >
                      返却処理（デモ用）
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setDetailItem(null)}
              >
                閉じる
              </button>
              {detailItem.status === 'available' && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const target = detailItem;
                    setDetailItem(null);
                    handleOpenReserve(target);
                  }}
                >
                  予約へ進む
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
