// Before click
const heading = document.getElementById('heading');
const inputtext = document.getElementById('inputtext');
const nameInput = document.getElementById('nameInput');

// After click
const messagesHeading = document.getElementById('messages');
const messageParagraph = document.getElementById('messageParagraph');
let message_dict;
fetchMessages().then(data => {
    message_dict = data;
}).catch(error => {
    console.error('JSON read Error:', error);
    message_dict = { // For local testing
        "827eaabb74575219c42595c8f9ab7dd5ef88934196cac9ed99ab807230aaac97": "Input your Grab's slack handle to view the goodbye messages.",
        "0aa751fdcd16ae43566956897f95e0ff75d3b4021d15e6bba97e350980b37ff0": "Hey, though we didn't work much together but thanks for your time catching up with me. You're always the go-to person for any Digibank stuffs and you'll be the future leader of Digibank in the near future!",
    }
});

// Buttons
// const stopShaking = document.getElementById('stopShaking');
const revealButton = document.getElementById('revealButton');
const backButton = document.getElementById('backButton');

// Functions
async function fetchMessages() {
    const response = await fetch('data/messages.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json()
}
function clean(rawInput) {
    return rawInput.trim().replace(" ", ".").toLowerCase();
}
async function hashString(inputString) {
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
function capitalName(name) {
    return name
        .split('.')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
async function checkName() {
    const name = clean(nameInput.value);
    const hashedValue = await hashString(name);

    if (!(name !== "" && message_dict[hashedValue])) {
        alert("Slack handle not found!\nAllowed formats: shiwei.tey or Shiwei Tey");
        nameInput.value = "";
        nameInput.focus();
        return false;
    }
    revealButton.click();
    return true;
}
async function displayMessages() {
    const name = clean(nameInput.value);
    const hashedValue = await hashString(name);
    let message = '';
    // const defaultMessages = [
    //     message_dict['paragraph1'],
    //     message_dict['paragraph2'],
    //     message_dict['paragraph3']
    // ];

    // if (name !== 'shiwei.tey') {
    //     defaultMessages.forEach(paragraph => {
    //         message += `<p class='message'>${paragraph}</p>`;
    //     });
    // } else {
    //     message += `<p class='message'>Thanks for reading this!</p>`;
    // }

    message += `<p class='typing-effect'>Good bye ${capitalName(name)}!</p>`;
    message += `<p class='message'>${message_dict[hashedValue]}</p>`;
    messageParagraph.innerHTML = message;
}

// Events
// stopShaking.addEventListener('click', function () {
//     inputtext.classList.remove('shake');
//     this.textContent = "I'll shake!";
//     this.classList.add('clicked');
// });

revealButton.addEventListener('click', async function () {
    // Reveal
    backButton.classList.remove('hidden');
    messagesHeading.classList.remove('hidden');
    try {
        await displayMessages();
    } catch (error) {
        console.error('An error occurred:', error);
    }
    var images = document.getElementsByClassName('bgImage');
    for (var i = 0; i < images.length; i++) {
        images[i].classList.remove('hidden');
        images[i].style.opacity = '0.3';
        images[i].style.transform = "scaleY(1)";
    }
    // Hide
    inputtext.innerHTML = 'Point the pictures ' + '<i class="fas fa-hand-point-right"></i>';
    inputtext.style.marginTop = "5px";
    inputtext.style.marginBottom = "5px";
    // container.style.pointerEvents = 'none';
    // inputtext.classList.remove('shake')
    // stopShaking.classList.add('hidden');
    // Changes
    heading.textContent = 'Missing you guys!';
    document.body.style.backgroundColor = '#fff';
});

backButton.addEventListener('click', function () {
    window.location.reload();
});

window.onload = function () {
    console.log('v3')
    // inputtext.classList.add('shake');
    var images = document.querySelectorAll('.background-grid img');
    images.forEach((img) => {
        var rotation = Math.floor(Math.random() * 91) - 45;
        img.style.transform = `rotate(${rotation}deg)`;  // Initial rotation
        img.addEventListener("mouseover", () => img.style.transform = `scale(1.3)`); // Remove rotation and add scale 2x upon hover
        img.addEventListener("mouseout", () => img.style.transform = `rotate(${rotation}deg)`);  // Reset to rotation when not hovering
    });
};

document.getElementById('nameInput').addEventListener('change', () => {checkName();});