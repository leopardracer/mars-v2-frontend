import { getDefaultChainSettings } from 'constants/defaultSettings'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import useChainConfig from 'hooks/chain/useChainConfig'
import useLocalStorage from 'hooks/localStorage/useLocalStorage'

export default function useDisplayCurrency() {
  const chainConfig = useChainConfig()

  return useLocalStorage<string>(
    `${chainConfig.id}/${LocalStorageKeys.DISPLAY_CURRENCY}`,
    getDefaultChainSettings(chainConfig).displayCurrency,
  )
}
