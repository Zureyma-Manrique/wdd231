document.addEventListener('DOMContentLoaded', () => {
    const summaryDiv = document.getElementById('summary');
    const urlParams = new URLSearchParams(window.location.search);

    let summaryHtml = '<ul>';
    urlParams.forEach((value, key) => {
        if (key !== 'description') { // Exclude description as it's not required
            summaryHtml += `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</li>`;
        }
    });
    summaryHtml += '</ul>';

    if (summaryDiv) {
        summaryDiv.innerHTML = summaryHtml;
    }

    // Footer Info
    const currentYearSpan = document.getElementById('current-year');
    const lastModifiedSpan = document.getElementById('last-modified');

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }
});
