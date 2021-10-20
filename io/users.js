const users = [];

const addUser = ({ id, name, room }) => {
    const nameTrimAndLowerCase = name.trim().toLowerCase();
    const roomTrimAndLowerCase = room.trim().toLowerCase();

    const isExisting = users.find((user) => user.room === room && user.name === name);

    if (isExisting) return { error: "L'utilisateur existe déjà!" };

    const user = { id, name, room };
    users.push(user);

    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
