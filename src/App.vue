
<template>
  <div class="min-h-screen flex flex-col mx-auto">
    <div class="container px-1 md:px-5">
      <MainHeader/>

     <TransactionForm/>

     <RecentTransactions/>
     
     <Toaster />
    </div>
    <div class="container mt-auto">
      <MainFooter/>
    </div>
  </div>
</template>

<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue';
import Toaster from '@/components/ui/toast/Toaster.vue'
import TransactionForm from "@/components/TransactionForm.vue";
import RecentTransactions from "@/components/RecentTransactions.vue";
import MainFooter from "@/components/MainFooter.vue";
</script>

<style scoped>
</style>
