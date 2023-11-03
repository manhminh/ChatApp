const formatTime = require('date-format');

const createMessage = (textMessage, username) => {
    return message = {
        textMessage,
        username,
        createAt: formatTime("dd/MM/yyyy - hh:mm:ss", new Date())
    }
}

module.exports = { createMessage }