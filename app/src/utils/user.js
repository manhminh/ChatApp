let userList = [
    {
        id: "1",
        username: "Manh",
        room: "01"
    },
    {
        id: "2",
        username: "Minh",
        room: "02"
    },
    {
        id: "3",
        username: "Hieu",
        room: "03"
    }
]

const getUserList = (room) => {
    return userList = userList.filter((user) => {
        return user.room === room
    });
}

const addUser = (user) => {
    return userList = [...userList, user];
}

const removeUser = (id) => {
    return userList = userList.filter((user) => user.id !== id)
}

const getUserById = (id) => {
    return userList.find((user) => user.id === id)
}

module.exports = {
    getUserList, addUser, removeUser, getUserById
}