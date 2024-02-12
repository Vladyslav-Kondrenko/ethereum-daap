<template>
    <Button @click="connectWallet" class="flex gap-1 items-center">
      <img src="@/assets/metamask.svg" alt="Metamask icon">
      <span>
        {{ buttonText }}
      </span>
</Button>
</template>

<script setup lang="ts">
import Button from './ui/button/Button.vue';
import { useWalletStore } from '@/store/wallet.store';
import { onMounted,computed, ref } from 'vue';
import { sliceTransaction } from '@/helpers/sliceTransaction';
import Web3 from 'web3'
import { getAddressBalance } from '@/composable/getAddressBalance'
import { createToast } from '@/composable/createToast'

const wallet = useWalletStore();
let accountAddress = computed(() => wallet.getAccountAddress);
let connected = computed(() => wallet.getIsMetaMaskConnected);
let installed = computed(() => wallet.getIsMetaMaskInstalled);
const ethereum = (window as any).ethereum;
const web3 = new Web3(ethereum);

onMounted(async ()=> {
  await initialise();

  if(isMetaMaskInstalled.value){
    ethereum.on('accountsChanged', async () => {
      console.log('accountsChanged')
        initialise();
    })
      // We recommend reloading the page, unless you must do otherwise. (c) Metamask // https://docs.metamask.io/wallet/how-to/detect-network/
    ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  }
})

const buttonText = computed( () => {
  return accountAddress.value ? sliceTransaction(accountAddress.value) : 'Connect Metamask';
} )

let isMetaMaskInstalled = computed( () => {
  return Boolean(ethereum && ethereum.isMetaMask);
})

async function isMetaMaskConnected() {
  const accounts = await ethereum.request({method: 'eth_accounts'});
  return accounts && accounts.length > 0;
}

async function initialise() {
  wallet.setIsMetaMaskInstalled(isMetaMaskInstalled.value);
  if(!installed.value){
    createToast('Metamask not installed', 'Please, install Metamask and try again', 'error')
    return;
  } 
  wallet.setIsMetaMaskConnected(await isMetaMaskConnected());

  if(connected.value){
    const accounts = await ethereum.request({method: 'eth_requestAccounts'})
    wallet.setAccountAddress(accounts[0]);
    wallet.setAccountBalance(await getAddressBalance(accounts[0]));
  } else{
    wallet.setAccountAddress('');
    wallet.setAccountBalance(0)
  }
}



async function connectWallet() {
  if(!installed.value){
    createToast('Metamask not installed', 'Please, install Metamask and try again', 'error')
    return;
  }
  try {
      const adressesLinks: string[] = await web3.eth.requestAccounts();
      wallet.setAccountAddress(adressesLinks[0]);
      createToast('Wallet connected', 'Your wallet was connected successfully', 'success')
    } catch (error: any) {
      createToast('Error', error.message, 'error')
    }
}


</script>


<!-- web3.eth.sendTransaction(transactionObject [, callback]) -->

<!-- Тестовое задание для Front-End Разработчика с использованием Web3:
Задача 1: Интеграция Web3 и отображение информации о балансе
Создайте простое веб-приложение с использованием Vue  и интегрируйте библиотеку Web3.js. Подключитесь к локальному узлу Ethereum и отобразите на странице баланс текущего аккаунта.
Задача 2: Отправка транзакции с использованием Web3
Добавьте форму, позволяющую пользователю отправить транзакцию. Включите поля для ввода адреса получателя, суммы Ether и добавьте кнопку "Отправить". Используйте Web3.js для отправки транзакции с введенными данными.
Задача 3: Отображение списка транзакций
Реализуйте функциональность отображения списка последних транзакций текущего аккаунта. Используйте Web3.js для получения истории транзакций и отобразите их на странице.
Общие требования:
  Используйте современные инструменты и фреймворки для разработки.
  Обеспечьте адаптивность интерфейса для различных устройств.
  Добавьте обработку ошибок и уведомления пользователю.
  Проект должен быть выгружен на публичный репозиторий (GitHub, GitLab и т.д.) с инструкциями по установке и запуску.
  При написании кода учитывайте лучшие практики и стандарты кодирования.
Оценка:
Проект будет оцениваться по четырем критериям: функциональность, чистота кода, пользовательский опыт и документация. -->
