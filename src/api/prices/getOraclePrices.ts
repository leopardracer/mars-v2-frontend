import { cacheFn, oraclePriceCache } from 'api/cache'
import { getOracleQueryClient } from 'api/cosmwasm-client'
import { BN_ZERO } from 'constants/math'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import { BNCoin } from 'types/classes/BNCoin'
import { PriceResponse } from 'types/generated/mars-oracle-osmosis/MarsOracleOsmosis.types'
import { byDenom } from 'utils/array'
import { BN } from 'utils/helpers'
import iterateContractQuery from 'utils/iterateContractQuery'

function getAssetPrice(asset: Asset, priceResult: PriceResponse): BNCoin {
  const price = BN(priceResult?.price ?? BN_ZERO)
  const decimalDiff = asset.decimals - PRICE_ORACLE_DECIMALS
  return BNCoin.fromDenomAndBigNumber(asset.denom, price.shiftedBy(decimalDiff))
}

export default async function getOraclePrices(
  chainConfig: ChainConfig,
  assets: Asset[],
): Promise<BNCoin[]> {
  const oracleQueryClient = await getOracleQueryClient(chainConfig)
  try {
    if (!assets.length) return []

    const priceResults = await cacheFn(
      () => iterateContractQuery(oracleQueryClient.prices),
      oraclePriceCache,
      `${chainConfig.id}/oraclePrices`,
      60,
    )

    return assets.map((asset) => {
      const priceResponse = priceResults.find(byDenom(asset.denom)) as PriceResponse
      return getAssetPrice(asset, priceResponse)
    })
  } catch (error) {
    console.error(error)
    try {
      return Promise.all(
        assets.map(async (asset) => {
          const priceResponse = await oracleQueryClient.price({ denom: asset.denom })
          return getAssetPrice(asset, priceResponse)
        }),
      )
    } catch (ex) {
      throw ex
    }
  }
}
