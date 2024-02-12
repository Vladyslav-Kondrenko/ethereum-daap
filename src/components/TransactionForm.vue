<template>
  <h2 class="scroll-m-20  pb-4 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-center">
    Send ETH
  </h2>
  <form class="w-4/5 mx-auto max-w-lg flex flex-col mb-8 md:w-2/3" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="destination_address">
      <FormItem v-auto-animate>
        <FormLabel>Destination address or ETH Namespace</FormLabel>
        <FormControl>
          <Input type="text" placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    
    <FormField v-slot="{ componentField }" name="amount">
      <FormItem v-auto-animate class="mb-4">
        <FormLabel>Amount in ETH</FormLabel>
        <FormControl>
          <Input type="number" step=".00001" placeholder="0.001" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          Your account balance is {{ accountBalance }} ETH. <button class="underline hover:no-underline" @click.prevent="setAmountAsMax">Send max</button>
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    
    <Button class="w-1/3 mx-auto" type="submit">
      Submit
    </Button>
  </Form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import * as zod from 'zod'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useWalletStore } from '@/store/wallet.store'
import Web3 from 'web3'
import { createToast } from '@/composable/createToast'
import { useAccountBalance } from '@/composable/useAccountBalance';
import { getAddressBalance } from '@/composable/getAddressBalance'

const { accountBalance } = useAccountBalance();
const ethereum = (window as any).ethereum;
const web3 = new Web3(ethereum)
const wallet = useWalletStore();

const formSchema = toTypedSchema(zod.object({
  destination_address: zod.string().refine((value) => {
    // Check for 42 characters OR end with '.eth'
    return value.length === 42 || value.endsWith('.eth');
  }, {
    message: 'Destination address must be 42 characters long or end with .eth'
  }),
  amount: zod.number().refine((value) => {
    return value > 0;
  }, {
    message: 'Amount must be a number greater than 0'
  }).refine((value) => {
    return value <= accountBalance.value;
  }, {
    message: 'Amount must be less than or equal to your Account Balance'
  }),
}));

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  sendTransaction(values.destination_address, values.amount)
})

async function sendTransaction(address:string, amount:number) {
  if(address.endsWith('.eth')){
    address = await getAddressByEns(address);
  }
  const account = wallet.getAccountAddress;
  try {
    const transactionObject = {
      from: account,
      to: address,
      value: web3.utils.toWei(amount, 'ether'),
      gas: 21000,
    };
    
    form.resetForm(); 
    createToast('Transaction is pending', 'Waiting transaction confirmation...', 'default');
    await web3.eth.sendTransaction(transactionObject);
    createToast('Transaction succeeded', 'Transaction sended successfuly. ', 'success');
    const updatedBalance = await getAddressBalance(account);
    wallet.setAccountBalance(updatedBalance);
  } catch (error: any) {
    console.log(error.message);
    createToast('Metamask error', error.message, 'error');
  }
}

async function getAddressByEns(ens: string): Promise<string> {
  const address = await web3.eth.ens.getAddress(ens);
  if (typeof address === 'string') {
    return address;
  } else {
    return address.toString();
  }
}

const setAmountAsMax = async () => {
  const gasPrice = await web3.eth.getGasPrice();
  const fee = gasPrice * web3.utils.toBigInt(63000); // 63 = 21000*3, where 21000 is the minimum amount of gas
  const feeInEther = +web3.utils.fromWei(fee, 'ether');

  let maxAmount = accountBalance.value - feeInEther;
  maxAmount = +Number(maxAmount > 0 ? maxAmount : 0).toFixed(5);
  form.setFieldValue('amount', maxAmount);
}

</script>
