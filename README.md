# Group III → AI Immersion Coolant — Crash Course

An interactive, Brilliant-style crash course (fundamentals → expert) on turning **domestic Group III base oil** into a **single-phase dielectric immersion coolant** for AI data centers.

It walks from the AI thermal wall and the PFAS supply collapse, through dielectric and thermal-transport physics and the full Open Compute Project (OCP) fluid conditions, to a 10 000-sample **Monte Carlo compliance** analysis that puts joint compliance at **99.70 %** across six OCP specifications — and the refinery business case behind it.

**29 lessons · 6 chapters**

- **A · The AI heat wall** — 700 W chips, >50 kW racks, single-phase vs two-phase, the 3M PFAS exit
- **B · Dielectric fundamentals** — breakdown voltage, Arrhenius resistivity & aging, Dk / tan δ, the full OCP fluid conditions
- **C · Thermal transport** — the junction-to-fluid resistance network, convection as the design lever, the 88 °C ceiling
- **D · The Group III molecule** — base-oil groups, meeting the sulfur / thermal / oxidation-degradation conditions
- **E · Monte Carlo compliance** — joint probability vs nominal pass, distribution choices, AND-vs-marginals, 99.70 % result
- **F · Economics & roadmap** — 83 % cost cut, forex savings, no new capex, the 18-month qualification pilot

Each lesson carries worked examples, "from the spec / literature" notes, "🛡️ you can now answer" defense callouts, and multiple-choice knowledge checks.

## Run it

Just open `index.html` in any browser — no build step, no dependencies. `course.js` holds all lesson content; `index.html` (and identical `course.html`) is the renderer.

## Source

Every number is tied to the ADIPEC 2026 manuscript *"Refinery Product Diversification into AI-Era Specialty Markets: Validating Domestic Group III Base Oil as a Single-Phase Immersion Coolant Through Monte Carlo Compliance Analysis"* (B. Chiramel) and its Monte Carlo validation framework (`compute_results.py`, N = 10 000, seed 42).

Independent research — not affiliated with or endorsed by HPCL.
