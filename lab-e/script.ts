const styles: Record<string, string> = {
    "Style 1": "css/style1.css",
    "Style 2": "css/style2.css",
    "Style 3": "css/style3.css"
};

let currentStyle = "Style 1"; 

function changeStyle(styleName: string): void {
    const head = document.head;
    const existingLink = document.querySelector('link[rel="stylesheet"]');

    if (existingLink) {
        head.removeChild(existingLink); 
    }

    const link = document.createElement('link');
    link.rel = "stylesheet";
    link.href = styles[styleName];
    head.appendChild(link); 

    localStorage.setItem('selectedStyle', styleName);
    currentStyle = styleName;
}

function createStyleLinks(): void {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const existingLinks = footer.querySelectorAll("a[data-style]");
    
    Object.keys(styles).forEach(styleName => {
        if (![...existingLinks].some(link => link.getAttribute("data-style") === styleName)) {
            const newParagraph = document.createElement("p");
            const newLink = document.createElement("a");

            newLink.href = "#";
            newLink.textContent = `Switch to ${styleName}`;
            newLink.setAttribute("data-style", styleName);

            newLink.addEventListener("click", (event) => {
                event.preventDefault();
                changeStyle(styleName);
            });

            newParagraph.appendChild(newLink);
            footer.appendChild(newParagraph);
        }
    });
}

function restoreStyle(): void {
    const savedStyle = localStorage.getItem('selectedStyle');
    const styleToApply = savedStyle && styles[savedStyle] ? savedStyle : Object.keys(styles)[0];
    changeStyle(styleToApply);
}

document.addEventListener('DOMContentLoaded', () => {
    restoreStyle(); 
    createStyleLinks(); 
});
