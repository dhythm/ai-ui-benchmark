import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { EquipmentPage } from './EquipmentPage'

describe('EquipmentPage', () => {
  it('備品名と利用状況を一覧表示する', () => {
    render(<EquipmentPage />)

    expect(
      screen.getByRole('heading', { name: '共有備品デスク' }),
    ).toBeInTheDocument()
    expect(screen.getByText('ThinkPad X1 Carbon Gen 12')).toBeInTheDocument()
    expect(screen.getByText('Dell 27インチ USB-C モニター')).toBeInTheDocument()
    expect(screen.getByText('田中 美咲')).toBeInTheDocument()
  })

  it('備品名の検索で一覧を絞り込む', async () => {
    const user = userEvent.setup()
    render(<EquipmentPage />)

    await user.type(
      screen.getByRole('searchbox', { name: '備品名または管理番号' }),
      'プロジェクター',
    )

    expect(screen.getByText('EPSON EB-2265U')).toBeInTheDocument()
    expect(screen.queryByText('ThinkPad X1 Carbon Gen 12')).not.toBeInTheDocument()
    expect(screen.getByText('30件中 4件')).toBeInTheDocument()
  })

  it('カテゴリで絞り込む', async () => {
    const user = userEvent.setup()
    render(<EquipmentPage />)

    await user.click(screen.getByRole('button', { name: /ノートPC/ }))

    expect(screen.getByText('MacBook Air 13インチ')).toBeInTheDocument()
    expect(
      screen.queryByText('Dell 27インチ USB-C モニター'),
    ).not.toBeInTheDocument()
  })

  it('利用状況で絞り込む', async () => {
    const user = userEvent.setup()
    render(<EquipmentPage />)

    const statusGroup = screen.getByRole('group', { name: '利用状況' })
    await user.click(within(statusGroup).getByRole('button', { name: /空き/ }))

    expect(screen.getByText('ThinkPad X1 Carbon Gen 12')).toBeInTheDocument()
    expect(screen.queryByText('ThinkPad T14 Gen 5')).not.toBeInTheDocument()
  })

  it('条件に一致しない場合は案内を出す', async () => {
    const user = userEvent.setup()
    render(<EquipmentPage />)

    await user.type(
      screen.getByRole('searchbox', { name: '備品名または管理番号' }),
      '存在しない備品',
    )

    expect(
      screen.getByText('該当する備品はありません。検索語や絞り込みを見直してください。'),
    ).toBeInTheDocument()
  })

  it('空き備品を予約すると利用状況が予約済になる', async () => {
    const user = userEvent.setup()
    render(<EquipmentPage />)

    await user.click(
      screen.getByRole('button', {
        name: 'ThinkPad X1 Carbon Gen 12 を予約する',
      }),
    )

    fireEvent.change(screen.getByLabelText('利用開始日'), {
      target: { value: '2026-09-03' },
    })
    fireEvent.change(screen.getByLabelText('返却予定日'), {
      target: { value: '2026-09-05' },
    })
    await user.type(screen.getByLabelText('用途'), '客先での資料投影')
    await user.click(screen.getByRole('button', { name: 'この備品を予約する' }))

    expect(
      screen.getByText(/ThinkPad X1 Carbon Gen 12 の予約を受け付けました/),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: 'ThinkPad X1 Carbon Gen 12 を予約する',
      }),
    ).not.toBeInTheDocument()

    const row = screen.getByRole('listitem', {
      name: /ThinkPad X1 Carbon Gen 12/,
    })
    expect(within(row).getByText('予約済')).toBeInTheDocument()
    expect(within(row).getByText('山田 太郎')).toBeInTheDocument()
  })

  it('返却予定日が利用開始日より前だとエラーを出す', async () => {
    const user = userEvent.setup()
    render(<EquipmentPage />)

    await user.click(
      screen.getByRole('button', {
        name: 'ThinkPad X1 Carbon Gen 12 を予約する',
      }),
    )

    fireEvent.change(screen.getByLabelText('利用開始日'), {
      target: { value: '2026-09-08' },
    })
    fireEvent.change(screen.getByLabelText('返却予定日'), {
      target: { value: '2026-09-04' },
    })
    await user.click(screen.getByRole('button', { name: 'この備品を予約する' }))

    expect(
      screen.getByText('返却予定日は利用開始日以降を指定してください。'),
    ).toBeInTheDocument()
  })
})
