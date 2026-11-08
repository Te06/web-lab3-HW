# UIT S3T - LAB 3 HOMEWORK 2 RULES (88-KEY PIANO)

1. STACK: React 19 + Vite + ES2024.
2. NO LEGACY APIS: Ban class extends React.Component, ReactDOM.render, defaultProps.
3. ZERO DIV-SOUP: Bọc ngoài bằng <main>, <section>.
4. A11Y: Mọi phím đàn (Piano Keys) phải là <button>, có aria-pressed và aria-label.
5. PERFORMANCE: Sử dụng React.memo để cô lập render, bấm 1 phím không render lại 88 phím.
6. EFFECT CLEANUP: Mọi Web Audio Context, sự kiện bàn phím, và bộ đếm thời gian phát nhạc phải được dọn dẹp (cancelAnimationFrame, clearTimeout, abort).