import { computed } from 'vue';
import { useWalletStore } from '@/store/wallet.store';

export function useAccountBalance() {
  const wallet = useWalletStore();

  const accountBalance = computed(() => Number((wallet.getAccountBalance).toFixed(4)));

  return {
    accountBalance
  };
}