<template>
  <h2 class="scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-center">
    Recent transactions
  </h2>
  <Table v-if="recentTransactions.length">
    <TableCaption>A list of your recent transactions.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="text-center">Hash</TableHead>
        <TableHead class="text-center">From</TableHead>
        <TableHead class="text-center">To</TableHead>
        <TableHead class="text-center">Value</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody v-auto-animate>
      <TableRow v-for="tnx in recentTransactions">
        <TableCell class="text-center">{{ sliceTransaction(tnx.hash) }}</TableCell>
        <TableCell class="text-center">{{ sliceTransaction(tnx.from) }}</TableCell>
        <TableCell class="text-center">{{ sliceTransactionTo(tnx.to) }}</TableCell>
        <TableCell class="text-center">{{ tnx.value }} ETH </TableCell>
      </TableRow>
    </TableBody>
  </Table>

  <h3 v-if="!recentTransactions.length" class="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
    You have no recent transactions
  </h3>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Transaction } from '@/components/transaction.type';
import { sliceTransaction } from '@/helpers/sliceTransaction';
import { useWalletStore } from '@/store/wallet.store';
import { Web3 } from 'web3';

const recentTransactions = reactive<Transaction[]>([]);
const ethereum = (window as any).ethereum;
const web3 = new Web3(ethereum);
let latestBlockNumber = ref<number>(0);
const wallet = useWalletStore();
let subscription: any;

let accountAddress = computed(() => wallet.getAccountAddress);

watch(accountAddress, () => {
  recentTransactions.splice(0, recentTransactions.length);
  getRecentTransaction();

  subscription?.unsubscribe();
  subscribeForNewBlocks();
})


async function getRecentTransaction(): Promise<void> {
  try {
    // clear array from outdated data
    const temporalyRecentTransactions: Transaction[] = [];
    // get data from 50 recent blocks
    for (let i = 0; i < 50; i++) {
      if (latestBlockNumber.value < i) return
      const blockNumber = latestBlockNumber.value - i;
      const block = await web3.eth.getBlock(blockNumber, true);

      if (block && block.transactions) {
        block.transactions.forEach((transaction) => {
          if (typeof (transaction) === 'string') return
          // take only transactions where to & from address = current address
          if (transaction.to && transaction.to.toLowerCase() === accountAddress.value.toLowerCase() ||
            transaction.from && transaction.from.toLowerCase() === accountAddress.value.toLowerCase()) {
            
            const transactionValue = transaction.value ?? 0;
            temporalyRecentTransactions.push({
              hash: transaction.hash,
              from: transaction.from,
              to: transaction.to,
              value: Number(web3.utils.fromWei(transactionValue, 'ether')),
            });
          }
        });
      }
    }
    
    // clear old data from array and updating with new
    recentTransactions.splice(0, recentTransactions.length);
    recentTransactions.push(...temporalyRecentTransactions)
  } catch (error) {
    console.error('Error:', error);
  }
}

watch(latestBlockNumber, getRecentTransaction);

function sliceTransactionTo(tnx: string | null | undefined): string {
  return tnx ? sliceTransaction(tnx) : '';
}

async function subscribeForNewBlocks(){
  
  latestBlockNumber.value = Number(await web3.eth.getBlockNumber());
  subscription = await web3.eth.subscribe('newHeads');

  // note that in version 4.x the way you get notified for `data` and `error` has changed
  subscription.on('data', async (blockhead:any) => {
    latestBlockNumber.value = Number(blockhead.number)
  });
  subscription.on('error', (error:string) =>
    console.log('Error when subscribing to New block header: ', error),
  );
  
}

onMounted(async () => {
  if(accountAddress.value){
    subscribeForNewBlocks();
  }
})

onUnmounted(() => {
  subscription.unsubscribe();
})

</script>