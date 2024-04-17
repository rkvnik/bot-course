const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js');

const token = '5101140638:AAHhAI8xqjGDV6Ev5DTUjwi2K_JfHfhwN5k'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `I'm going to guess a number from 0 to 9 and you have to guess that number`)
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `take a guess`, gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'guess the number game'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const name = msg.chat.first_name;
        const chatId = msg.chat.id;
        if (text === '/start') {
            return bot.sendMessage(chatId, `Welcome dear friend. My name Kristina, I'm Nikolai's assistant, how can I help?`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Hello ${name}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, `I don't understand you, please try again`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (+data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Congratulations, you win  ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `You lose, try again ${chats[chatId]}`, againOptions)
        }
    })
}

start()