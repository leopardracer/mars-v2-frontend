import { useCallback } from 'react'

import ConditionalWrapper from '../../../../hocs/ConditionalWrapper'
import useCurrentAccount from '../../../../hooks/accounts/useCurrentAccount'
import useStore from '../../../../store'
import ActionButton from '../../../common/Button/ActionButton'
import { Plus } from '../../../common/Icons'
import Text from '../../../common/Text'
import { Tooltip } from '../../../common/Tooltip'

export const BORROW_BUTTON_META = {
  accessorKey: 'borrow',
  enableSorting: false,
  header: '',
}

interface Props {
  data: LendingMarketTableData
}
export default function BorrowButton(props: Props) {
  const account = useCurrentAccount()
  const address = useStore((s) => s.address)
  const hasNoDeposits = !account?.deposits?.length && !account?.lends?.length

  const borrowHandler = useCallback(() => {
    if (!props.data.asset) return null
    useStore.setState({ borrowModal: { asset: props.data.asset, marketData: props.data } })
  }, [props.data])

  return (
    <div className='flex justify-end'>
      <ConditionalWrapper
        condition={hasNoDeposits && !!address}
        wrapper={(children) => (
          <Tooltip
            type='warning'
            content={
              <Text size='sm'>{`You don’t have any collateral.
             Please first deposit into your Credit Account before borrowing.`}</Text>
            }
            contentClassName='max-w-[200px]'
            className='ml-auto'
          >
            {children}
          </Tooltip>
        )}
      >
        <ActionButton
          leftIcon={<Plus />}
          disabled={hasNoDeposits}
          color='tertiary'
          onClick={(e) => {
            borrowHandler()
            e.stopPropagation()
          }}
          text='Borrow'
          short
        />
      </ConditionalWrapper>
    </div>
  )
}
