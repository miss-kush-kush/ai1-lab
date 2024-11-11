
// Elements
const locateUserBtn = document.getElementById('locateUserBtn');
const displayMapBtn = document.getElementById('displayMapBtn');
const imageSection = document.getElementById('imageSection');
const scrambledImages = document.getElementById('scrambledImages');
const puzzleGrid = document.getElementById('puzzleGrid');

// Variables
let map;
let isMapLoaded = false;
let imagePieces = [];

// Initialize map view
function initMap() {
    map = L.map('mapDisplay').setView([53.431, 14.555], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        crossOrigin: 'anonymous',
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// Border color array
const cellBorders = [
    'red', 'blue', 'green', 'orange', 
    'purple', 'teal', 'pink', 'brown', 
    'cyan', 'magenta', 'lime', 'yellow', 
    'black', 'gray', 'indigo', 'violet'
];

// Create puzzle grid
function setupPuzzleBoard() {
    puzzleGrid.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('puzzle-cell');
        cell.dataset.index = i;
        cell.style.border = `2px solid ${cellBorders[i % cellBorders.length]}`;
        enableDragDrop(cell);
        puzzleGrid.appendChild(cell);
    }
}

// Drag and drop handlers
function enableDragDrop(cell) {
    cell.addEventListener('dragover', event => event.preventDefault());

    cell.addEventListener('drop', event => {
        event.preventDefault();
        const index = event.dataTransfer.getData('text/plain');
        const imgData = imagePieces[index];

        if (cell.children.length === 0 && imagePieces[index] !== null) {
            const imgElement = new Image();
            imgElement.src = imgData;
            imgElement.style.width = "100%";
            imgElement.style.height = "100%";
            imgElement.dataset.index = index;
            cell.appendChild(imgElement);

            const scrambledImg = scrambledImages.querySelector(`img[data-index="${index}"]`);
            if (scrambledImg) scrambledImages.removeChild(scrambledImg);

            imagePieces[index] = null;
            checkPuzzleCompletion();
        }
    });
}

// Initialize puzzle on load
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupPuzzleBoard();
});

// Get user's location
locateUserBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayPosition, handleError);
    } else {
        alert("Geolocation not supported by your browser.");
    }
});

// Display position on map
function displayPosition(position) {
    const { latitude, longitude } = position.coords;
    if (!isMapLoaded) {
        map.setView([latitude, longitude], 13);
        L.marker([latitude, longitude]).addTo(map).bindPopup("Your location").openPopup();
        isMapLoaded = true;
    }
}

// Geolocation error handling
function handleError(error) {
    alert(error.message || "Unknown error.");
}

// Get map image
displayMapBtn.addEventListener('click', () => {
    if (map && isMapLoaded) {
        leafletImage(map, function(err, canvas) {
            if (err) {
                console.error("Error generating map image:", err);
                return;
            }
            imageSection.innerHTML = '';
            const img = new Image();
            img.src = canvas.toDataURL();
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";
            imageSection.appendChild(img);
            createImageParts(img);
        });
    } else {
        alert("Map still loading. Try again shortly.");
    }
});

// Create scrambled image parts
function createImageParts(img) {
    img.onload = () => {
        const imgWidth = img.width;
        const imgHeight = img.height;
        const partWidth = imgWidth / 4;
        const partHeight = imgHeight / 4;

        scrambledImages.innerHTML = '';
        imagePieces = [];

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const canvas = document.createElement('canvas');
                canvas.width = partWidth;
                canvas.height = partHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, col * partWidth, row * partHeight, partWidth, partHeight, 0, 0, partWidth, partHeight);

                const dataUrl = canvas.toDataURL();
                imagePieces.push(dataUrl);

                const imgPart = new Image();
                imgPart.src = dataUrl;
                imgPart.draggable = true;
                imgPart.dataset.index = imagePieces.length - 1;
                imgPart.addEventListener('dragstart', dragStart);
                scrambledImages.appendChild(imgPart);
            }
        }
        scrambleImages();
    };
}

// Drag start event
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.index);
}

// Scramble images in scrambled section
function scrambleImages() {
    const imgArray = Array.from(scrambledImages.children);
    imgArray.sort(() => Math.random() - 0.5);
    scrambledImages.innerHTML = '';
    imgArray.forEach(img => scrambledImages.appendChild(img));
}

// Check if the puzzle is completed
function checkPuzzleCompletion() {
    let correctPieces = 0;

    // Loop through all the puzzle cells to check if each piece is in the correct position
    for (let i = 0; i < puzzleGrid.children.length; i++) {
        const cell = puzzleGrid.children[i];
        if (cell.children.length > 0) {
            const img = cell.children[0];
            if (parseInt(img.dataset.index) === i) {
                correctPieces++;
            }
        }
    }

    // If all cells are filled correctly, show notification and log success message
    if (correctPieces === puzzleGrid.children.length) {
        console.log("Puzzle completed successfully!");
        showBrowserNotification();
    }
}

// Function to display browser notification
function showBrowserNotification() {
    if (Notification.permission === "granted") {
        new Notification("Congratulations!", {
            body: "You have successfully completed the puzzle!",
        });
    } else if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Congratulations!", {
                    body: "You have successfully completed the puzzle!",
                });
            }
        });
    }
}

