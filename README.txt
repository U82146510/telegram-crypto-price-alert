# Crypto Telegram Bot

A Node.js Telegram bot that monitors cryptocurrency pairs and alerts users when the price crosses specified high and low targets.

## Features
- Monitor cryptocurrency prices in real-time.
- Set custom high and low price targets.
- Receive instant alerts when prices cross set thresholds.
- Start and stop monitoring as needed.

## Installation

1. Clone the repository:
git clone https://github.com/U82146510/telegram-crypto-price-alert cd telegram-trade-warrning

2. Install dependencies:
npm install

3. Create a `.env` file and add your Telegram bot token:
telegram_token=your_telegram_bot_token

4. Start the bot:
npm start  
or
node index.ts


## Commands
Menu: /start -start monitoring. stop -stop monitoring. high -display the highest prices. low -display the lowest prices.

min:btcusdt:5000 -set the lowest price for BTC/USDT. max:btcusdt:15000 -set the highest price for BTC/USDT.

## Usage
- Send `/start` in Telegram to begin monitoring.
- Use `min:btcusdt:5000` to set the lowest price target.
- Use `max:btcusdt:15000` to set the highest price target.
- The bot will notify you when the price moves beyond the set thresholds.

## Dependencies
- [Node.js](https://nodejs.org/)
- [Telegraf](https://www.npmjs.com/package/telegraf) (Telegram bot framework)
- [WebSocket](https://www.npmjs.com/package/ws) (for real-time crypto price updates)

## License
This project is licensed under the MIT License.

## Author
[U82146510]
