const io = require("socket.io")(process.env.PORT || 4444,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

setInterval(async () => {
    /*const sockets = await io.in("room1").fetchSockets();
    const allSockets = []
    sockets.forEach(socket => {
        allSockets.push(socket.id)
    })
    console.log(allSockets)*/
},1000)
io.on('connection', async (socket) => {
    setInterval(() => {
        socket.emit('keepalive', 'stay alive');
    }, 1000);
    socket.on('joinRoom', async (data) => {
        console.log(socket.id,data.room)
        const {room} = data;
        socket.join(room);
        const allSockets = await getAllUsersInRoom(room)
        io.to(socket.id).emit('playerSet',allSockets.findIndex(findSocketId => {
            return findSocketId === socket.id
        }) + 1)
        socket.on('mouseMove', data => {
            socket.broadcast.in(room).emit('mouseMove', data)
        })
        socket.on('clickTile', data => {
            socket.broadcast.in(room).emit('clickTile', data)
        })
        socket.on('updates', data => {
            socket.broadcast.in(room).emit('updates', data)
        })
    })
    socket.on("disconnect", (reason) => {
        //socket.leave('room1')
    });
})

async function getAllUsersInRoom(room) {
    const sockets = await io.in(room).fetchSockets();
    const allSockets = [];
    sockets.forEach(socket => {
        allSockets.push(socket.id)
    });
    return allSockets;
}
