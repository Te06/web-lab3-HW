# UIT S3T - LAB 3 HOMEWORK 1 RULES (DRUM KIT)

1. STACK: React 19 + Vite + ES2024.
2. NO LEGACY APIS: Ban class extends React.Component, ReactDOM.render, defaultProps, keyCode.
3. ZERO DIV-SOUP: Thẻ bọc ngoài phải là <main>, <section>, <article>.
4. A11Y FORMS: Mọi nút bấm (Pads) phải có aria-label và aria-pressed.
5. STATE HYGIENE: Cập nhật state bất biến (immutable), không dùng useEffect để đồng bộ state dư thừa.
6. EFFECT CLEANUP: Mọi event listener (window keydown/keyup) hoặc Web Audio Context trong useEffect BẮT BUỘC phải có hàm cleanup.