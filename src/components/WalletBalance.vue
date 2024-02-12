<template>
  <div class="bg-primary text-primary-foreground  px-4 py-2.5 rounded-md flex items-center space-x-2">
    <img src="@/assets/ethereum.svg" alt="ETH logo">
    <span class="text-sm font-medium">{{ accountBalance }} ETH</span>
  </div>
</template>

<script setup lang="ts">
import { useAccountBalance } from '@/composable/useAccountBalance';
const { accountBalance } = useAccountBalance();

</script>

<style l></style>