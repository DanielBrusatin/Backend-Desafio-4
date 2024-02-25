const socket = io()
const messageForm = document.getElementById('messageForm')
const chat = document.getElementById('chat')
const message = document.getElementById('message')
const email = document.getElementById('email')
let user

message.focus()

//Capturo el mensaje y lo envío al servidor
messageForm.addEventListener('submit', ev =>{
  ev.preventDefault()
  socket.emit('message', {user: user, message: message.value})
  messageForm.reset()
  message.focus()
})

//Recibo mensajes desde el servidor y los renderizo
socket.on('messages', messages => {
  while (chat.firstChild) {
    chat.removeChild(chat.firstChild)
  }
  messages.forEach(message => {
    const content = `
    <div><span style='font-weight: bold'>'${message.user.toUpperCase()}' dice:</span> ${message.message}</div>`
    chat.innerHTML += content
  })
})

//Sweet alert para ingresar el mail del usuario
Swal.fire({
  title: 'Ingrese su correo electronico',
  input: 'email',
}).then(result =>{
  user = result.value
  email.innerHTML = `Usuario: ${user}`
})