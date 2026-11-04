# Name tracing PDF library

Unmodified jsPDF 4.2.0 browser UMD distribution from the existing package-lock.json dependency, `node_modules/jspdf/dist/jspdf.umd.min.js`. Upstream: https://github.com/parallax/jsPDF/tree/v4.2.0 . MIT license and original copyright are preserved in the script header and adjacent LICENSE.txt. No new dependency or remote service.

420068 bytes; SHA256 `db83fc811c81a9c9c218f1787ba52fc9b4d0d0fbe51184ce3a4a4f8a7ba9a091`.
SRI SHA384 `QgylrxI5Yl5GgBcwJUoY+eXWrJ8Hdd2yCLHPCD/q90kMXcaRulJnwQ0U94saGFR1`.

Reproduce with the existing locked dependencies: `node scripts/sync-name-tracing-pdf-vendor.mjs`. The command rejects an unexpected version/hash. Do not edit the distributed library or silently change its identity.

This isolated tool requests the script only during PDF preparation. Failed or timed-out requests can be retried without a cached rejected module import. It uses the existing `script-src 'self'` permission and validates SRI; no CSP, Worker, runtime or shared configuration changes. The tool calls only the existing PNG-to-PDF path, not HTML capture or remote loading helpers.
