$(()=>{
    $('.sidenav').sidenav();
    
    // Declara as variaveis para iniciar
    let myUsername;
    let ready = false;
    let divChat = $("#divChat");
    let divRegistro = $("#divRegistro");
    let progress = $(".progress");
    let btnLogout = $('.btnLogout');
    
    // Solicita a conexao com o servidor
    let servidorSocket = prompt('Digite o ip e porta do servidor socket:', 'localhost:3000');
    
    // Inicializa o socket
    let socket = io.connect(`http://${servidorSocket}`);
    
    if(isLogado()){
        myUsername = isLogado();
        divChat.show();
        btnLogout.show()
    } else{
        divRegistro.show();
    }
    
    // Registro
    let formRegister = $("#registerOnChat");
    formRegister.submit(event =>{
        event.preventDefault();
        myUsername = $("#usernameRegister").val();
        
        socket.emit("username-definido", myUsername);
        login(myUsername);
        
        exibeLoading(2000);
        setTimeout(() => {
            $("#divRegistro").hide();
            $("#divChat").show();
        }, 2000);
    })
    
    // Fazer logout
    btnLogout.click(()=>{
        exibeLoading(2000);
        logout();
        setTimeout(()=>{
            divChat.hide();
            divRegistro.show();
            btnLogout.hide();
        }, 2000)
    })
    // Eventos do socket
    socket.on("usuarios-atualizados", function(updateUsuario) {
        if(myUsername !== updateUsuario.usuario){
            M.toast({html: `${updateUsuario.usuario} ${updateUsuario.evento}.`})
        }
    });
    
    /*
    * Exibe loading 
    */
    function exibeLoading(time){
        $(".progress").show();
        setTimeout(() => {
            $(".progress").hide();
        }, time);
    }
    
    
    // Auth metodos
    function isLogado(){
        if(localStorage.getItem('logado')){
            return localStorage.getItem('username');
        } else{
            return false;
        }
    }
    
    function login(username){
        localStorage.setItem('logado', 'true');
        localStorage.setItem('username', username);
        btnLogout.show();
    }
    
    function logout(){
        localStorage.clear();
    }
    
});