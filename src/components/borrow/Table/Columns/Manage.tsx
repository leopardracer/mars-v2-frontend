import ActionButton from 'components/common/Button/ActionButton'
import DropDownButton from 'components/common/Button/DropDownButton'
import { HandCoins, Plus } from 'components/common/Icons'
import { useCallback, useMemo } from 'react'
import useStore from 'store'

export const MANAGE_META = {
  accessorKey: 'manage',
  enableSorting: false,
  header: '',
}

interface Props {
  data: BorrowMarketTableData
}

export default function Manage(props: Props) {
  const address = useStore((s) => s.address)

  const borrowHandler = useCallback(() => {
    if (!props.data.asset) return null
    useStore.setState({ borrowModal: { asset: props.data.asset, marketData: props.data } })
  }, [props.data])

  const repayHandler = useCallback(() => {
    if (!props.data.asset) return null
    useStore.setState({
      borrowModal: { asset: props.data.asset, marketData: props.data, isRepay: true },
    })
  }, [props.data])

  const isDeprecatedAsset = props.data.asset.isDeprecated

  const ITEMS: DropDownItem[] = useMemo(
    () => [
      {
        icon: <HandCoins />,
        text: 'Repay',
        onClick: repayHandler,
      },
      {
        icon: <Plus />,
        text: 'Borrow more',
        onClick: borrowHandler,
      },
    ],
    [borrowHandler, repayHandler],
  )

  if (!address) return null

  return (
    <div className='z-10 flex justify-end'>
      {isDeprecatedAsset ? (
        <ActionButton
          leftIcon={<HandCoins />}
          color='tertiary'
          onClick={() => repayHandler()}
          text='Repay'
          short
        />
      ) : (
        <DropDownButton items={ITEMS} text='Manage' color='tertiary' />
      )}
    </div>
  )
}
