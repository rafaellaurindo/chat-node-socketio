const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    
    socket.on('username-definido', (username) => { 
        socket.username = username;
        io.emit('usuarios-atualizados', { usuario: username, evento: 'entrou'});
    });
    
    socket.on('nova-mensagem', (mensagem) => {
        io.emit('mensagem', { texto: mensagem.texto, de: socket.username, data: new Date() })
    });

    socket.on('disconectado', () => {
        io.emit('usuarios-atualizados', { usuario: socket.username, evento: 'saiu'});
    });
    
});

const porta = process.env.PORT || 3000;

app.get('/', (req, res)=>res.send('Server is running!'));

http.listen(porta, () => {
    console.log('Servidor está rodando em http://localhost:' + porta);
});
