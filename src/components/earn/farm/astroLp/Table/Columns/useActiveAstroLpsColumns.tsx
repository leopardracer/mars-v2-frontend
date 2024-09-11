import { ColumnDef, Row } from '@tanstack/react-table'
import { useMemo } from 'react'

import AstroLpApy, { APY_META } from 'components/earn/farm/astroLp/Table/Columns/AstroLpApy'
import AstroLpManage, {
  MANAGE_META,
} from 'components/earn/farm/astroLp/Table/Columns/AstroLpManage'
import AstroLpPositionValue, {
  POSITION_VALUE_META,
} from 'components/earn/farm/astroLp/Table/Columns/AstroLpPositionValue'
import DepositCap, {
  DEPOSIT_CAP_META,
  depositCapSortingFn,
} from 'components/earn/farm/common/Table/Columns/DepositCap'
import MaxLTV, { LTV_MAX_META } from 'components/earn/farm/common/Table/Columns/MaxLTV'
import Name, { NAME_META } from 'components/earn/farm/common/Table/Columns/Name'
import TVL, { TVL_META } from 'components/earn/farm/common/Table/Columns/TVL'

export default function useActiveAstroLpsColumns(assets: Asset[]) {
  return useMemo<ColumnDef<DepositedAstroLp>[]>(() => {
    return [
      {
        ...NAME_META,
        cell: ({ row }) => <Name vault={row.original as DepositedAstroLp} />,
      },
      {
        ...POSITION_VALUE_META,
        cell: ({ row }: { row: Row<DepositedAstroLp> }) => (
          <AstroLpPositionValue vault={row.original as DepositedAstroLp} />
        ),
      },
      {
        ...APY_META,
        cell: ({ row }) => <AstroLpApy astroLp={row.original as AstroLp} assets={assets} />,
      },
      {
        ...TVL_META,
        cell: ({ row }) => (
          <TVL
            denom={(row.original as DepositedAstroLp).cap?.denom}
            amount={(row.original as DepositedAstroLp).cap?.used}
          />
        ),
      },
      {
        ...DEPOSIT_CAP_META,
        cell: ({ row }) => {
          if (row.original.cap === null) return null
          return <DepositCap vault={row.original as DepositedAstroLp} />
        },
        sortingFn: depositCapSortingFn,
      },
      {
        ...LTV_MAX_META,
        cell: ({ row }) => <MaxLTV vault={row.original as DepositedAstroLp} />,
      },
      {
        ...MANAGE_META,
        cell: ({ row }) => (
          <AstroLpManage astroLp={row.original} isExpanded={row.getIsExpanded()} />
        ),
      },
    ]
  }, [assets])
}
