let socket = io();
let userName;

let chatBox = document.getElementById("chatBox");
chatBox.addEventListener("keyup", handleSendMessage);

let btnSend = document.getElementById("btnSend");
btnSend.addEventListener("click", handleSendMessage);

Swal.fire({
    title: "Write your email :)",
    input: 'email',
    // inputValidator: (value) => !value && "Please write your email address",
    allowOutsideClick: false,
    icon: "success",
    background: "#767e87",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#B5DC86"
}).then((res) => {
    userName = res.value;
    document.getElementById("username").innerHTML = "Connected as: " + userName;
    socket.emit("auth", userName);
    chatBox.focus();
});


function handleSendMessage(e) {
    if (e.key === "Enter" || e.type === "click") {
        // e.preventDefautl();
        let message = chatBox.value;
        if (message.trim()) {
            socket.emit("newMessage", {
                user: userName,
                message: message
            });
            chatBox.value = "";
            scrollToBottom();
        }
    }
}

function scrollToBottom() {
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

socket.on("allMessages", (message) => {
    document.getElementById("chatMessages").innerHTML = message
        .map((msg) => `<br><b>${msg.user}</b>: ${msg.message}`)
        .join("");
    scrollToBottom();
});
