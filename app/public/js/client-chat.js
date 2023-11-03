// request server connection from client
const socket = io();
//chat
document.querySelector('#form-message').onsubmit = (e) => {
    e.preventDefault();
    const textMessage = document.querySelector('#input-message').value;
    acknowledgements = (error) => {
        if (error) {
            alert("Invallid message!!!");
            return;
        }
        console.log("Send successfully")
    }
    socket.emit("send message from client to server", textMessage, acknowledgements);
}

socket.on("send message from server to client", message => {
    console.log(message);
    const { createAt, textMessage, username } = message;
    const messageElement =
        `<div class="message-item">
            <div class="message__row1">
                <p class="message__name">${username}</p>
                <p class="message__date">${createAt}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">
                    ${textMessage}
                </p>
            </div>
        </div>`
    document.querySelector('.app__messages').innerHTML += messageElement
    document.querySelector('#input-message').value = '';
})

//share location
document.querySelector('#btn-share-location').onclick = () => {
    if (!navigator.geolocation) {
        return alert('Error from server')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("share location from client to server", {
            latitude,
            longitude
        })
    })
}

socket.on("share location from server to client", message => {
    console.log(message);
    const { createAt, textMessage, username } = message;
    const messageElement =
        `<div class="message-item">
            <div class="message__row1">
                <p class="message__name">${username}</p>
                <p class="message__date">${createAt}</p>
            </div>
            <div class="message__row2">
                <a href=${textMessage} class="message__content">
                    ${username}'s position
                </a>
            </div>
        </div>`
    document.querySelector('.app__messages').innerHTML += messageElement
    document.querySelector('#input-message').value = '';
})
const queryString = location.search;
const params = Qs.parse(queryString, { ignoreQueryPrefix: true });
const { room, username } = params
socket.emit("join room from client to server", { room, username });
document.querySelector('.app__title').innerHTML = `Room ${room}`
// video
const peer = new Peer();
let myVideoStream;
let myId;
var videoGrid = document.getElementById('videoDiv')
var myvideo = document.createElement('video');
myvideo.muted = true;
const peerConnections = {};

document.querySelector('#btn-call-video').onclick = () => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        console.log(stream);
        myVideoStream = stream;
        addVideo(myvideo, stream);
    }).catch(error => {
        alert(error.message)
    })
}

function addVideo(video, stream) {
    video.srcObject = stream;
    console.log(video)

    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video);
}

//get user list
socket.on("send user list from server to client", (userList) => {
    console.log(userList);
    let contentHtml = "";
    userList.map(user => {
        contentHtml += `
            <li class="app__item-user">
                ${user.username}
            </li>
        `
    })
    document.querySelector('.app__list-user--content').innerHTML = contentHtml;
})