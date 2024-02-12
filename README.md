# ETH - APP

ETH-App Vue3 - простое веб-приложение, созданное на Vue.js с использованием библиотеки Web3.js для интеграции с локальным узлом Ethereum. Позволяет отображать баланс текущего аккаунта, отправлять транзакции с указанием адреса получателя и суммы Ether, а также просматривать список выполненных транзакций.

## Основные инструменты

- **Vite:** Быстрый современный инструментарий для разработки веб-приложений. [Документация](https://vitejs.dev/)
  
- **Vue.js 3:** Прогрессивный JavaScript-фреймворк для создания интерфейсов пользователя. [Документация](https://v3.vuejs.org/)

- **Shadcn-vue:** Набор компонентов Vue.js с теневыми стилями. [Документация](https://www.shadcn-vue.com/)

- **Web3.js:** Библиотека JavaScript для взаимодействия с Ethereum блокчейном. [Документация](https://web3js.readthedocs.io/)


## Установка

```bash
npm install && npm run dev
```

## Поднятие и подключение локального узла Ethereum

Для тестирования и разработки приложения с использованием локального узла Ethereum вы можете использовать программное обеспечение, такое как Ganache.

1. **Установите Ganache:** Посетите [официальный сайт Ganache](https://www.trufflesuite.com/ganache) и скачайте соответствующую версию для вашей операционной системы. Установите программу на ваш компьютер.

2. **Запустите локальный узел:** После установки запустите Ganache и создайте новый рабочий проект. Это создаст локальный блокчейн, на котором вы сможете разрабатывать и тестировать ваши смарт-контракты.

3. **Подключение к приложению:** После запуска локального узла Ganache, убедитесь, что ваше приложение настроено на подключение к этому узлу. Обычно это делается путем указания соответствующего адреса RPC и порта в вашем приложении.

4. **Используйте аккаунты Ganache:** Ganache предоставляет вам несколько тестовых аккаунтов с предустановленными эфирами, которые вы можете использовать для разработки и тестирования вашего приложения.

## Использование локального узла через Metamask

Metamask позволяет вам подключаться к различным блокчейнам, включая локальные узлы Ethereum. Вот как это сделать:

1. **Установите Metamask:** Если у вас еще нет Metamask, вы можете установить его, посетив [официальный сайт Metamask](https://metamask.io/) и следуя инструкциям.

2. **Настройте сеть:** Откройте Metamask в вашем браузере и перейдите в раздел "Настройка сети". Добавьте новую сеть, указав адрес RPC вашего локального узла Ethereum (обычно это `http://localhost:8545`), а также другие необходимые параметры.
   - **Сеть:** GANACHE LOCALHOST
   - **Новый URL RPC:** HTTP://127.0.0.1:7545
   - **ID цепочки (Chain ID):** 1337
   - **Символ валюты:** ETH

3. **Импортируйте кошельки и мнемоник из Ganache:** В Ganache перейдите на вкладку "Ключи". Здесь вы найдете приватные ключи и мнемоник, используемые для генерации кошельков в вашем локальном узле. Вы можете импортировать эти ключи и мнемоник в Metamask, чтобы иметь доступ к тем же аккаунтам, что и в Ganache.

4. **Подключитесь к сети:** После настройки сети и импортирования кошельков переключитесь на созданную сеть в Metamask. Теперь Metamask будет использовать ваш локальный узел Ethereum для ваших транзакций и действий в сети.

5. **Используйте приложение:** Теперь ваше приложение, связанное с локальным узлом Ethereum, будет взаимодействовать с Metamask, и вы сможете проводить транзакции и выполнять другие действия через Metamask.


