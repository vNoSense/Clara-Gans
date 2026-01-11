const basePath = window.location.pathname.includes("/ArtPreview/") ? ".." : ".";

const fixPaths = (root) => {
    root.querySelectorAll("[src]").forEach(el => {
        const src = el.getAttribute("src");
        if (src && src.startsWith("/")) el.setAttribute("src", `${basePath}${src}`);
    });
    root.querySelectorAll("a[href^='/']").forEach(a => {
        const href = a.getAttribute("href");
        if (href) a.setAttribute("href", `${basePath}${href}`);
    });
};

fetch(`${basePath}/components/header.html`)
    .then(res => res.text())
    .then(data => {
        const header = document.getElementById("header");
        if (header) {
            header.innerHTML = data;
            fixPaths(header);
        }
    });

fetch(`${basePath}/components/footer.html`)
    .then(res => res.text())
    .then(data => {
        const footer = document.getElementById("footer");
        if (footer) {
            footer.innerHTML = data;
            fixPaths(footer);
        }
    });
