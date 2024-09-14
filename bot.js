require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// استبدل بالتوكن الخاص بك
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// معرف القناة الخاصة
const channelId = process.env.CHANNEL_ID;

// استقبال الرسائل
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // إذا كانت الرسالة تحتوي على ملف
    if (msg.document || msg.photo) {
        let fileId;

        // إذا كان الملف هو PDF
        if (msg.document) {
            fileId = msg.document.file_id;
        } else if (msg.photo) {
            // إذا كانت الصورة، نأخذ أعلى جودة
            fileId = msg.photo[msg.photo.length - 1].file_id;
        }

        // إرسال الملف إلى القناة
        bot.forwardMessage(channelId, chatId, msg.message_id)
            .then(() => {
                bot.sendMessage(chatId, 'تم إرسال الملف إلى القناة بنجاح.');
            })
            .catch((error) => {
                console.error('Error forwarding message:', error);
                bot.sendMessage(chatId, 'حدث خطأ أثناء إرسال الملف. يرجى المحاولة لاحقًا.');
            });
    } else {
        bot.sendMessage(chatId, 'يرجى إرسال ملف PDF أو صورة.');
    }
});
