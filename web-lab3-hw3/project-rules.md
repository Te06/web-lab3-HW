# UIT S3T - LAB 3 HOMEWORK 3 RULES (PUBG VN ARENA)

1. STACK: React 19 + Vite + ES2024.
2. NO LEGACY APIS: Ban class extends React.Component, ReactDOM.render, defaultProps.
3. ZERO DIV-SOUP: Dùng thẻ semantic (<main>, <section>, <article>, <ul>, <li>).
4. A11Y FORMS: Inputs phải có label htmlFor (dùng useId).
5. STATE HYGIENE: Derived state tính trực tiếp khi render. Không dùng useEffect để đồng bộ state lọc/sắp xếp.
6. EFFECT CLEANUP: Mọi setInterval, setTimeout, event listener phải có cleanup. Đặc biệt xử lý sự kiện visibilitychange cho timer chống trôi.