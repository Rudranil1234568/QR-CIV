
const dragDropArea = document.getElementById('dragDropArea');
const logoInput = document.getElementById('logoInput');

dragDropArea.addEventListener('click', () => logoInput.click());

logoInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logo = document.getElementById('qr-logo');
            logo.src = e.target.result;
            logo.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

dragDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragDropArea.classList.add('dragover');
});

dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.classList.remove('dragover');
});

dragDropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dragDropArea.classList.remove('dragover');
    const file = event.dataTransfer.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logo = document.getElementById('qr-logo');
            logo.src = e.target.result;
            logo.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});
function generateQRCode() {
    const url = document.getElementById("urlInput").value;
    const fileName = document.getElementById("fileNameInput").value;
    
    if (!url || !fileName) {
        alert("Both URL and File Name fields are mandatory!");
        return;
    }
    
    const canvas = document.getElementById("qrCanvas");
    const ctx = canvas.getContext("2d");
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    
    const qrImg = new Image();
    qrImg.crossOrigin = "Anonymous";
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
    
    qrImg.onload = function () {
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(qrImg, 0, 0, size, size);
        
        const logoInput = document.getElementById("logoInput");
        if (logoInput.files && logoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const logo = new Image();
                logo.src = e.target.result;
                logo.onload = function () {
                    const logoSize = size * 0.2;
                    ctx.drawImage(logo, (size - logoSize) / 2, (size - logoSize) / 2, logoSize, logoSize);
                };
            };
            reader.readAsDataURL(logoInput.files[0]);
        }
        
        document.getElementById("qrText").innerHTML = `${url}<br>${fileName}`;
        document.getElementById("downloadBtn").style.display = "block";
    };
}

function downloadQR() {
    const canvas = document.getElementById("qrCanvas");
    const fileName = document.getElementById("fileNameInput").value || "QRCode";
    const url = document.getElementById("urlInput").value;
    
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width + 60;
    newCanvas.height = canvas.height + 70;
    const ctx = newCanvas.getContext("2d");
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
    ctx.drawImage(canvas, 30, 10);
    
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${url}`, newCanvas.width / 2, canvas.height + 30);
    ctx.fillText(` ${fileName}`, newCanvas.width / 2, canvas.height + 50);
    
    const link = document.createElement("a");
    link.href = newCanvas.toDataURL("image/png");
    link.download = `${fileName}.png`;
    link.click();
}