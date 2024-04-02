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
    message_dict = {
        "paragraph1": "---<br>First off, I want to express my deepest and sincere gratitude to each and every one of you. The excitement was indescribable when I received a job offer from Grab after numerous rounds (>5) of interviews. Accepting this opporunity has been one of the proudest moments in my life. The continuous support and friendship I've experienced here have been amazing, made me enjoying every moment of my time at Grab.",
        "paragraph2": "I appreciate the exciting opportunities given during my time here. I was first welcomed with the warmth of broken pipelines, Azure migration, AWS migration and OVO ingestions along with many orphaned datasets ownership. Within a few short months, my hiring manager moved on, followed shortly by my new manager and colleagues. This left me as the only remaining GFG ADW member. However, my current manager, an expert in the data field was able to turn these challenges into opportunities, guiding me and the team to rebuild the entire ADW platform into what we have today. A special thanks goes to the Caspian team for their unwavering support during this period of transition and platform setup.",
        "paragraph3": "I want to let you all know how much I'm going to miss working with you. Our time together wasn't just about work, it was an exciting journey. Leaving behind the friendships and connections we've built makes this decision incredibly tough. Each and every one of you has made this experience truly memorable for me. While I am excited about the new chapter awaiting me, it is bittersweet to say goodbye to a place that has meant so much to me. Please know that I leave with a heavy heart, but with pride in all we've achieved together.<br><br>Shiwei",
        "827eaabb74575219c42595c8f9ab7dd5ef88934196cac9ed99ab807230aaac97": "Input your Grab's slack handle to view the goodbye messages.",
        "0aa751fdcd16ae43566956897f95e0ff75d3b4021d15e6bba97e350980b37ff0":"x", // Test
    }
});

// Buttons
const stopShaking = document.getElementById('stopShaking');
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
    const defaultMessages = [
        message_dict['paragraph1'],
        message_dict['paragraph2'],
        message_dict['paragraph3']
    ];

    message += `<p class='typing-effect'>Goodbye ${capitalName(name)}!</p>`;
    message += `<p class='message'>${message_dict[hashedValue]}</p>`;

    if (name !== 'shiwei.tey') {
        defaultMessages.forEach(paragraph => {
            message += `<p class='message'>${paragraph}</p>`;
        });
    } else {
        message += `<p class='message'>Thanks for reading this!</p>`;
    }

    messageParagraph.innerHTML = message;
}

// Events
stopShaking.addEventListener('click', function () {
    inputtext.classList.remove('shake');
    this.textContent = "I'll shake for you!";
    this.classList.add('shake', 'clicked');
});

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
    inputtext.classList.remove('shake')
    stopShaking.classList.add('hidden');
    // Changes
    heading.textContent = 'Missing you guys in Grab!';
    document.body.style.backgroundColor = '#C7F6C7';
});

backButton.addEventListener('click', function () {
    window.location.reload();
});

window.onload = function () {
    console.log('v3')
    inputtext.classList.add('shake');
    var images = document.querySelectorAll('.background-grid img');
    images.forEach((img) => {
        var rotation = Math.floor(Math.random() * 91) - 45;
        img.style.transform = `rotate(${rotation}deg)`;  // Initial rotation
        img.addEventListener("mouseover", () => img.style.transform = `scale(2)`); // Remove rotation and add scale 2x upon hover
        img.addEventListener("mouseout", () => img.style.transform = `rotate(${rotation}deg)`);  // Reset to rotation when not hovering
    });
};

document.getElementById('nameInput').addEventListener('change', () => {checkName();});