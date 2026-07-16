// ============================================================================
// TAMPERMONKEY USERSCRIPT
// ============================================================================
// ==UserScript==
// @name             Amazon CamelCamelCamel Price Charts
// @version          1.1.4
// @description      Add CamelCamelCamel price charts to Amazon product pages.
// @author           YourName
// @homepageURL      https://github.com/yourusername/your-repo-name
// @namespace        https://tampermonkey.net/
// @include          https://www.amazon.*/*
// @run-at           document-end
// @grant            GM_xmlhttpRequest
// @connect          charts.camelcamelcamel.com
// ==/UserScript==

window.addEventListener("load", () => {
    // Strictly targeting your original parent elements at the exact same time
    const asin = document.getElementById("ASIN")?.value || document.querySelector("[data-asin]")?.getAttribute("data-asin");
    const parent = document.querySelector("#unifiedPrice_feature_div, #MediaMatrix");

    if (!asin || !parent) return console.error("Price Charts: ASIN or parent element not found.");

    const hostParts = location.hostname.split(".");
    const tld = hostParts.pop();
    const country = tld === "com" ? "us" : tld;

    // Reverted strictly to your original HTML layout structure (with Keepa removed)
    parent.insertAdjacentHTML("beforeend", `
        <div id="amazon-price-charts">
            <div><a href="https://${country}.camelcamelcamel.com/product/${asin}" target="_blank"><img id="ccc-chart" width="500" height="400"></a></div>
        </div>
    `);

    // Fetch CamelCamelCamel chart via Userscript privileges to bypass CORP
    // Uses 'amazon-new-used.png' to ensure 3rd-party/FBA items render properly
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://charts.camelcamelcamel.com/${country}/${asin}/amazon-new-used.png?force=1&zero=0&w=500&h=400&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=en`,
        responseType: "blob",
        onload: res => {
            if (res.status === 200) {
                document.getElementById("ccc-chart").src = URL.createObjectURL(res.response);
            }
        },
        onerror: err => console.error("Error fetching CamelCamelCamel chart:", err)
    });
});
