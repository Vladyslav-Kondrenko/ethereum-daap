<template>
  <div class="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md mb-4 justify-center md:justify-end">
    <WalletBalance :balance="10"/>
    <ConnectWallet/>
</div>
</template>

<script setup lang="ts">
import WalletBalance from '@/components/WalletBalance.vue';
import ConnectWallet from '@/components/ConnectWallet.vue';

</script>