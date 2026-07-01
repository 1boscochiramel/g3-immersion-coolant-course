/* course.js — "Group III → AI Immersion Coolant" expert crash course.
   Fundamentals -> expert. Defines the global LESSONS array consumed by course.html.
   Every number is tied to the ADIPEC 2026 manuscript + its Monte Carlo validation
   framework (compute_results.py, N=10000, seed=42). B. Chiramel.

   Block conventions used inside body HTML:
     <div class="eqn">...</div>        equation
     <div class="example">...</div>    worked example (green)
     <div class="litnote">...</div>    from the spec / literature (blue)
     <div class="defends">...</div>    "you can now answer" — procurement / reviewer callout (amber)
   Optional per-lesson: check {q, opts:[{t,ok}], reveal}
*/
const LESSONS = [
// ===================== PART A — THE AI HEAT WALL =====================
{ch:"A · The AI heat wall", title:"Why AI compute broke air cooling",
 body:`<p>A modern GPU accelerator dissipates up to <b>700 W per chip</b>, and a high-density rack now routinely exceeds <b>50 kW</b>. Air simply cannot carry that heat away — its density and heat capacity are too low, and the fan power and acoustic limits are reached long before the thermal one.</p>
 <p>The heat has to go somewhere. Once air runs out of headroom, the only lever left is a fluid that touches the silicon far more intimately — a liquid you can submerge the whole board in.</p>
 <div class="example"><b>Scale intuition.</b> 50 kW in one rack is roughly the heat of <b>thirty domestic electric kettles running continuously</b>, concentrated in the volume of a filing cabinet. Air moving through that cabinet would need impossible velocities to keep the junctions safe.</div>`},

{ch:"A · The AI heat wall", title:"Single-phase immersion cooling",
 body:`<p>The industry converged on <b>single-phase immersion cooling</b>: the entire server board is submerged in a <b>dielectric hydrocarbon fluid</b> that stays liquid the whole time (no boiling), circulates by natural or gentle forced convection, and hands its heat to a coolant loop through a heat exchanger.</p>
 <p>"Single-phase" is the key phrase — unlike two-phase (boiling) fluids, nothing evaporates, so there is no vapour management, no fluorochemical, and no high-pressure containment. The fluid's whole job is to be a good <i>insulator</i> and a good <i>heat carrier</i> at the same time.</p>
 <div class="litnote">📚 <b>From the market.</b> The qualified immersion-fluid market is dominated by imported synthetic dielectrics priced from <b>USD 50/L to USD 400/L</b> (3M Fluorinert FC-77 sits at the top). That price is the opening this work targets.</div>`,
 check:{q:"Why must an immersion coolant be a dielectric (electrical insulator)?",
  opts:[{t:"Because you submerge live, powered circuit boards directly in it",ok:true},{t:"Because insulators conduct heat better than conductors",ok:false}],
  reveal:"You submerge <b>energised boards</b> in the fluid. If it conducted electricity it would short the circuits. It must carry heat while blocking current — the central tension of the whole design."}},

{ch:"A · The AI heat wall", title:"Two-phase vs single-phase & the PFAS exit",
 body:`<p>There are two immersion architectures. <b>Two-phase</b> uses an engineered <b>fluorochemical</b> (3M Novec, Fluorinert) that <i>boils</i> on the chip and condenses above it — high heat flux, but it needs a sealed, pressure-managed tank and a persistent fluorochemical. <b>Single-phase</b> uses a non-boiling <b>dielectric hydrocarbon</b> circulated by pumps — simpler, open-bath, serviceable.</p>
 <div class="eqn" style="font-size:13.5px;text-align:left;line-height:1.8">
 Two-phase (fluorochemical): boils · sealed tank · GWP 57–9000+ · USD 130–200+/L<br>
 Single-phase (hydrocarbon): non-boiling · open bath · GWP ≈ 0 · USD 5–15/L</div>
 <p>Two things settled it. Single-phase already holds <b>70–80 % market share</b> (simpler architecture, lower capex, 15+ yr fluid life). And the incumbent two-phase supply is <b>collapsing</b>: 3M announced a full <b>PFAS manufacturing exit</b> (Dec 2022), with production ceasing by <b>end-2025</b> — removing the primary source of two-phase fluids just as demand explodes.</p>
 <div class="litnote">📚 <b>Why "forever chemicals" are exiting.</b> Fluorochemicals carry GWP of 57–9000+ and persist 0.8–3200 years; the EPA set a 4-ppt PFOA/PFOS drinking-water limit (2024) and the EU proposed restricting ~10 000 PFAS under REACH. 3M's exit followed a USD 10.3 bn water-contamination settlement. Group III is near-zero-GWP and non-fluorinated — on the right side of that regulatory trajectory.</div>
 <div class="defends">🛡️ You can now answer: <i>"Why not just use the proven two-phase fluorochemicals?"</i> — Their sole supplier is exiting by end-2025, they are 10–40× more expensive, and they are being regulated out as PFAS. Single-phase hydrocarbon is where the market and the rules are both heading.</div>`,
 check:{q:"What is knocking out the incumbent two-phase (fluorochemical) coolants?",
  opts:[{t:"3M's PFAS exit by end-2025 plus tightening PFAS regulation",ok:true},{t:"They cannot cool high-TDP chips at all",ok:false}],
  reveal:"The <b>supply and regulatory collapse</b>: 3M ceases PFAS production by end-2025 and PFAS limits are tightening worldwide. The physics still works — it is the fluorochemical itself that is being retired."}},

{ch:"A · The AI heat wall", title:"The refiner's question",
 body:`<p>Two market trends are colliding. The <b>lubricant market is maturing</b> — longer oil-drain intervals and EV penetration are flattening Group III base-oil demand growth. Meanwhile <b>AI data-center cooling</b> is a fast-growing, high-margin specialty-fluid market.</p>
 <p>The strategic insight: the <b>same molecule</b> that goes into premium engine oil — a high-VI, low-aromatic, low-volatility hydrocarbon — is <i>exactly</i> what the immersion-fluid specification asks for. So the real question is not "can a refiner make a dielectric fluid?" (yes — it is the same base oil) but:</p>
 <div class="eqn">What is the <i>probability</i> the existing product clears <b>every</b> spec a hyperscale customer will set?</div>
 <div class="defends">🛡️ You can now answer: <i>"Why would an oil refiner be in the coolant business?"</i> — Because the immersion spec is a re-prioritised Group III lubricant spec on the same molecule; this is a formulation pivot into an adjacent high-margin market, not a new product.</div>`},

// ===================== PART B — DIELECTRIC FUNDAMENTALS =====================
{ch:"B · Dielectric fundamentals", title:"Breakdown voltage (BDV)",
 body:`<p>The first electrical spec is <b>dielectric strength</b> — how much voltage the fluid withstands across a small gap before it flashes over. It is measured as <b>breakdown voltage (BDV)</b> in a standard test cell (IEC 60156 / ASTM D877).</p>
 <div class="eqn"><i>E</i><sub>breakdown</sub> = <span class="frac"><span><i>V</i><sub>BDV</sub></span><span><i>d</i><sub>gap</sub></span></span></div>
 <p>The OCP floor is <b>BDV ≥ 45 kV</b>. The Group III formulation sits at <b>55.0 ± 3.0 kV</b> — a comfortable margin. Contamination and dissolved water are BDV's enemies, which is why moisture control and cleanliness are part of qualification.</p>
 <div class="litnote">📚 <b>Why Group III is strong here.</b> BDV is degraded by polar species and aromatics. Group III is deeply hydrotreated — <b>very low aromatics, &gt;90 % saturates</b> — so it is intrinsically a high-BDV fluid without additives.</div>`},

{ch:"B · Dielectric fundamentals", title:"Volume resistivity & Arrhenius aging",
 body:`<p>Resistivity ρ measures how strongly the fluid resists leakage current — you want it <b>enormous</b> (≥ 10¹¹ Ω·cm even after aging). Fresh Group III is ~<b>1.5 × 10¹⁵ Ω·cm</b> at 25 °C. But resistivity <i>falls</i> as the fluid heats, following an Arrhenius law:</p>
 <div class="eqn">ρ<sub>90</sub> = ρ<sub>25</sub> · exp<span style="font-size:1.3em">[</span><span class="frac"><span><i>E</i><sub>a</sub></span><span><i>k</i><sub>B</sub></span></span><span style="font-size:1.3em">(</span><span class="frac"><span>1</span><span><i>T</i><sub>90</sub></span></span> − <span class="frac"><span>1</span><span><i>T</i><sub>25</sub></span></span><span style="font-size:1.3em">)]</span></div>
 <p>with activation energy <i>E</i><sub>a</sub> ≈ <b>0.69 eV</b>. Because <i>T</i><sub>90</sub> &gt; <i>T</i><sub>25</sub>, the bracket is negative and ρ drops at operating temperature. On top of that, a <b>10× degradation factor</b> is applied to represent five-year aging — and it <i>still</i> clears 10¹¹ Ω·cm.</p>
 <div class="defends">🛡️ You can now answer: <i>"Sure it insulates when fresh and cold — what about hot and aged?"</i> — Resistivity is evaluated at 90 °C via Arrhenius (Eₐ = 0.69 eV) with a 10× aging penalty, and marginal compliance is still 100 %.</div>`,
 check:{q:"As the fluid heats from 25 °C to 90 °C, its volume resistivity…",
  opts:[{t:"Falls — carriers get more thermal energy (Arrhenius)",ok:true},{t:"Rises — hot fluid insulates better",ok:false}],
  reveal:"Falls. That is exactly why the spec is written at the <b>90 °C aged</b> condition, not the flattering fresh/cold one. Group III passes even there."}},

{ch:"B · Dielectric fundamentals", title:"Dk and loss tangent (tan δ)",
 body:`<p>Two more electrical specs govern how the fluid interacts with high-speed signals passing through the submerged boards:</p>
 <p>• <b>Dielectric constant</b> <i>Dk</i> (relative permittivity) — how much the fluid stores charge. Lower is better for signal integrity; OCP caps it at <b>Dk ≤ 2.30</b>. Group III sits at <b>2.15</b>.<br>
 • <b>Loss tangent</b> tan δ — the fraction of AC energy dissipated as heat in the fluid each cycle. OCP caps it at <b>≤ 0.05</b>; Group III is ~<b>1.5 × 10⁻⁴</b>, orders of magnitude under the limit.</p>
 <div class="eqn">tan δ = <span class="frac"><span>energy lost per cycle</span><span>energy stored per cycle</span></span></div>
 <div class="litnote">📚 <b>Why non-polar wins.</b> Both Dk and tan δ are driven by molecular polarity. A saturated, non-polar hydrocarbon has almost nothing to polarise, so a good base oil is naturally low-Dk and ultra-low-loss.</div>`},

{ch:"B · Dielectric fundamentals", title:"The six OCP specifications",
 body:`<p>Everything the fluid must satisfy reduces to <b>six Open Compute Project (OCP) specifications</b> — four electrical, one thermal, one lifetime:</p>
 <div class="eqn" style="font-size:14.5px;text-align:left;line-height:1.9">
 1. Breakdown voltage &nbsp;<b>BDV ≥ 45 kV</b><br>
 2. Volume resistivity (90 °C, aged) &nbsp;<b>ρ ≥ 10¹¹ Ω·cm</b><br>
 3. Dielectric constant &nbsp;<b>Dk ≤ 2.30</b><br>
 4. Loss tangent &nbsp;<b>tan δ ≤ 0.05</b><br>
 5. Junction temperature &nbsp;<b>T<sub>j</sub> ≤ 88 °C</b><br>
 6. Service life &nbsp;<b>≥ 5 years</b></div>
 <p>Specs 1–4 are dielectric, spec 5 is heat transport, spec 6 is durability. The whole paper is about the probability of hitting <b>all six at once</b>.</p>
 <div class="defends">🛡️ Anchor lesson — memorise these six. Every result, chart and compliance number in the course maps back to this list.</div>`},

{ch:"B · Dielectric fundamentals", title:"The full OCP fluid conditions",
 body:`<p>The six compliance specs are the pass/fail gates. But the underlying <b>OCP single-phase immersion base specification</b> is a broader thermophysical envelope. Measured Group III against it:</p>
 <div class="eqn" style="font-size:12.5px;text-align:left;line-height:1.85">
 Thermal conductivity &nbsp; 0.12–0.14 vs <b>&gt;0.14 W/m·K</b> &nbsp; ⚠ marginal<br>
 Specific heat &nbsp; 1.9–2.1 vs <b>&gt;1.8 kJ/kg·K</b> &nbsp; ✓ excellent<br>
 Kinematic viscosity @40 °C &nbsp; grade-set vs <b>&lt;20.5 cSt</b> &nbsp; ✓ achievable<br>
 Dynamic viscosity &nbsp; 15–20 vs <b>&lt;15 cP</b> &nbsp; ⚠ optimise<br>
 Flash point &nbsp; 210–240 vs <b>&gt;150 °C</b> &nbsp; ✓ huge margin<br>
 Dielectric strength &nbsp; &gt;35 kV/2.5 mm vs <b>&gt;6 kV/mm</b> &nbsp; ✓ exceeds<br>
 Volume resistivity &nbsp; &gt;10¹² vs <b>&gt;2 GΩ·m</b> &nbsp; ✓ exceeds<br>
 Pour point &nbsp; −15 to −25 vs <b>&lt;−20 °C</b> &nbsp; ✓ acceptable</div>
 <p>The pattern matters: the fluid <i>already clears almost every line comfortably</i>. Only two are genuine engineering work — <b>thermal conductivity</b> (marginal) and <b>dynamic viscosity</b> (needs a grade/temperature choice). Everything else is a free consequence of the molecule.</p>
 <div class="defends">🛡️ You can now answer: <i>"Which OCP conditions is Group III actually short on?"</i> — Only bulk thermal conductivity and dynamic viscosity; sulfur, flash point, dielectric strength, resistivity, specific heat and pour point all pass with margin.</div>`},

// ===================== PART C — THERMAL TRANSPORT =====================
{ch:"C · Thermal transport", title:"From junction to fluid: the R-network",
 body:`<p>Cooling is a heat-flow problem. The chip junction sits at the top of a <b>thermal resistance network</b>; each layer between silicon and fluid adds a resistance in series, and the temperature rise is heat flow × total resistance:</p>
 <div class="eqn"><i>T</i><sub>j</sub> = <i>T</i><sub>bulk</sub> + <i>Q</i> · <i>R</i><sub>total</sub> &nbsp;,&nbsp; <i>R</i><sub>total</sub> = <i>R</i><sub>jc</sub> + <i>R</i><sub>cs</sub> + <i>R</i><sub>conv</sub></div>
 <p><i>R</i><sub>jc</sub> = junction-to-case, <i>R</i><sub>cs</sub> = case-to-fluid (interface), <i>R</i><sub>conv</sub> = the convective resistance from surface to bulk fluid. Lower total R → cooler junction.</p>
 <div class="example"><b>Worked.</b> With <i>Q</i> ≈ 700 W and <i>T</i><sub>bulk</sub> ≈ 40 °C landing <i>T</i><sub>j</sub> ≈ 59.3 °C, the whole stack is only <i>R</i><sub>total</sub> ≈ (59.3 − 40)/700 ≈ <b>0.028 °C/W</b>. The design's job is to keep that number small.</div>`},

{ch:"C · Thermal transport", title:"Convection is the design lever",
 body:`<p>Of the three resistances, <i>R</i><sub>jc</sub> and <i>R</i><sub>cs</sub> are largely fixed by the chip package. The one the <b>fluid and tank design control</b> is the convective resistance:</p>
 <div class="eqn"><i>R</i><sub>conv</sub> = <span class="frac"><span>1</span><span><i>h A</i></span></span> &nbsp;,&nbsp; Nu = <span class="frac"><span><i>h L</i></span><span><i>k</i></span></span> = <i>f</i>(Ra or Re, Pr)</div>
 <p>Raise the heat-transfer coefficient <i>h</i> (better fluid properties, forced flow) or the wetted area <i>A</i>, and <i>R</i><sub>conv</sub> drops. The manuscript's <b>optimized convection design</b> is precisely this lever — it is why the junction lands at 59 °C with headroom rather than near the limit.</p>
 <div class="defends">🛡️ You can now answer: <i>"What actually keeps the chip cool — the oil is a mediocre conductor?"</i> — The base oil's bulk k is modest, but immersion wets the whole board and convection (h·A) dominates R_conv; the design optimises that term.</div>`},

{ch:"C · Thermal transport", title:"The 88 °C junction ceiling",
 body:`<p>The thermal spec is a hard <b>shutdown limit: T<sub>j</sub> ≤ 88 °C</b> — cross it and the OCP-compliant system throttles or powers down to protect the silicon. Across 10 000 Monte Carlo samples the design delivers:</p>
 <div class="eqn"><i>T</i><sub>j</sub> = 59.3 ± 4.9 °C &nbsp;(vs 88 °C ceiling)</div>
 <p>That is nearly <b>6 standard deviations</b> of margin — every sampled configuration passes, with room for transient spikes. Marginal compliance for the thermal spec is <b>100.00 %</b>.</p>`,
 check:{q:"The junction sits at 59.3 ± 4.9 °C against an 88 °C ceiling. How safe is that?",
  opts:[{t:"~6σ of headroom — effectively always passes",ok:true},{t:"Marginal — one bad sample and it trips",ok:false}],
  reveal:"~6σ. (88 − 59.3)/4.9 ≈ 5.9 standard deviations. In 10 000 samples <b>none</b> breach 88 °C — thermal marginal compliance is 100 %."}},

// ===================== PART D — THE GROUP III MOLECULE =====================
{ch:"D · The Group III molecule", title:"Base-oil groups I–V",
 body:`<p>The API classifies base oils into five groups by how deeply refined they are. What matters here is <b>Group III</b>: severely hydrocracked/hydrotreated mineral oil with</p>
 <div class="eqn" style="font-size:14.5px;text-align:left;line-height:1.8">• saturates &gt; 90 % &nbsp; • sulphur &lt; 0.03 % &nbsp; • Viscosity Index ≥ 120</div>
 <p>Those same three refinery targets — high saturation, low sulphur/aromatics, high VI — are what make it a premium <i>lubricant</i>. They are <b>also</b> what make it a superb <i>dielectric</i>. The refinery already produces exactly the right molecule.</p>
 <div class="litnote">📚 <b>The structural coincidence.</b> The OCP base spec reads like a tighter, re-prioritised Group III lubricant spec — low aromatics, high VI, low volatility, low pour point. The dielectric properties (BDV, ρ, Dk, tan δ) come free with that molecular structure.</div>`},

{ch:"D · The Group III molecule", title:"Why the same molecule is a great dielectric",
 body:`<p>Trace the properties back to structure and the coincidence stops being a coincidence:</p>
 <p>• <b>Low aromatics / high saturation</b> → few polarisable π-electrons → high resistivity, high BDV, low tan δ.<br>
 • <b>Low volatility</b> (high flash point) → safe in an open-bath hot tank, low evaporative loss.<br>
 • <b>High VI</b> → viscosity stays in the convection-friendly window across the operating range.<br>
 • <b>Low pour point</b> → still pumpable on cold-start.</p>
 <div class="defends">🛡️ You can now answer: <i>"Is it luck that a lubricant base oil also insulates?"</i> — No: both properties derive from the same deeply-hydrotreated, non-polar, saturated structure. Lubricant excellence and dielectric excellence are two readouts of one molecule.</div>`},

{ch:"D · The Group III molecule", title:"Meeting the sulfur & purity condition",
 body:`<p>A dielectric coolant is ruined by exactly the species that a lubricant is also cleaned of: <b>sulfur, polar molecules, and aromatics</b>. They cut resistivity and BDV and corrode copper. So the condition and the fix are already built into how Group III is made.</p>
 <p>Group III comes from <b>severe hydrocracking + hydroisomerization</b> (&gt;343 °C, &gt;1000 psi), which strips heteroatoms and saturates the rings. The result:</p>
 <div class="eqn" style="font-size:14px">sulfur &lt; 10 ppm &nbsp;·&nbsp; saturates &gt; 95 % &nbsp;·&nbsp; branched isoparaffins C₁₈–C₄₀</div>
 <p><b>The plan:</b> the sulfur/purity condition needs <i>no new chemistry</i> — it is met at the hydrocracker, and sulfur/saturates are already lubricant QC parameters. The one added step is <b>additive removal</b>: commercial base oils carry 0.1–30 % additives (ZDDP raises conductivity, metallic detergents leave ash, some attack elastomers), so we take a <b>non-additized technical grade</b>, purified by activated-carbon filtration / vacuum distillation / clay treatment / molecular sieve.</p>
 <div class="defends">🛡️ You can now answer: <i>"How do you guarantee the low-sulfur, ash-free purity a coolant needs?"</i> — It is inherent to the deep-hydrotreat route (&lt;10 ppm S, &gt;95 % saturates); we then use a non-additized grade so no conductive/ash-forming additives are present.</div>`,
 check:{q:"Why is Group III naturally very low in sulfur?",
  opts:[{t:"Severe hydrocracking/hydroisomerization strips heteroatoms",ok:true},{t:"Sulfur is added back as an antioxidant",ok:false}],
  reveal:"The <b>severe hydrocracking</b> route (&gt;343 °C, &gt;1000 psi) removes sulfur to &lt;10 ppm and saturates the oil — the same processing that makes it a premium lubricant makes it a clean dielectric."}},

{ch:"D · The Group III molecule", title:"Meeting the thermal condition",
 body:`<p>Thermal is the one line where the neat fluid is only <b>marginal</b>: bulk thermal conductivity 0.12–0.14 W/m·K sits right at the OCP &gt;0.14 target. But two things rescue it — one intrinsic, one by design.</p>
 <p><b>Intrinsic advantage:</b> specific heat 1.9–2.1 kJ/kg·K is <b>~2× that of the fluorocarbons</b> it replaces, so per unit volume it banks far more heat. <b>The plan to close the conductivity gap:</b></p>
 <div class="eqn" style="font-size:13.5px;text-align:left;line-height:1.8">
 1. Grade selection — lighter grades (2–4 cSt) drop dynamic viscosity under 15 cP → better convection<br>
 2. Warm operating point — viscosity falls with temperature, lifting flow & <i>h</i><br>
 3. Nanofluid path — disperse SiC / Al₂O₃ to raise <i>effective</i> k (research-stage)</div>
 <p><b>The design wins anyway:</b> because cooling is convection-dominated (R<sub>conv</sub> = 1/hA), the optimized convection design lands the junction at <b>59.3 ± 4.9 °C vs the 88 °C ceiling</b> — 100 % thermal compliance — even with modest bulk k. The heat-transfer coefficient, not the fluid's raw conductivity, is what carries the load.</p>
 <div class="defends">🛡️ You can now answer: <i>"Its thermal conductivity is only marginal — how does it cool a 700 W chip?"</i> — Via ~2× specific heat, viscosity-optimised convection (h·A), and an optional nanofluid boost; the junction still lands ~29 °C under the shutdown limit.</div>`,
 check:{q:"On which OCP thermophysical line is neat Group III genuinely marginal?",
  opts:[{t:"Bulk thermal conductivity (0.12–0.14 vs >0.14 W/m·K)",ok:true},{t:"Specific heat capacity",ok:false}],
  reveal:"Thermal conductivity. Specific heat is actually ~2× the fluorocarbons. The conductivity gap is closed by grade/temperature/convection design (and optionally nanoparticles)."}},

{ch:"D · The Group III molecule", title:"Meeting oxidation & thermal degradation",
 body:`<p>The hardest condition to prove is <b>long-term stability</b>: a hydrocarbon sitting hot against copper and dissolved oxygen for years can oxidise — forming acids and sludge and losing dielectric quality. Degradation kinetics under continuous <b>35–90 °C</b> operation is the least-studied part of the whole problem. The plan is three layers:</p>
 <div class="eqn" style="font-size:13px;text-align:left;line-height:1.8">
 1. <b>Intrinsic resistance</b> — &gt;95 % saturated structure has few labile C=C sites; oxidation stability (RPVOT / TOST) is already a lube QC test in scope<br>
 2. <b>Dielectric-safe additive package</b> — ashless antioxidant + metal deactivator, screened so they do <i>not</i> raise conductivity (unlike ZDDP)<br>
 3. <b>Measured proof</b> — Stage 2: 6-month accelerated aging at 90 °C &amp; 110 °C</div>
 <p>Layer 3 is decisive: it <b>replaces the post-hoc-calibrated Weibull</b> lifetime with real degradation data and directly substantiates the ≥ 5-year service-life spec. Until then, the ≥ 5 yr result is a disclosed planning-scenario, not a measurement.</p>
 <div class="defends">🛡️ You can now answer: <i>"How do you know it survives five years of hot oxidation?"</i> — Intrinsic saturate stability + RPVOT/TOST screening + a dielectric-safe antioxidant package, <i>proven</i> by the Stage-2 accelerated-aging test that replaces the calibrated lifetime model.</div>`,
 check:{q:"How is the multi-year oxidation life ultimately proven (not just estimated)?",
  opts:[{t:"Stage-2 accelerated aging at 90 °C & 110 °C replaces the calibrated Weibull",ok:true},{t:"The post-hoc Weibull calibration is treated as the final proof",ok:false}],
  reveal:"By <b>measured accelerated aging</b> (Stage 2, 90/110 °C). The paper is explicit that the calibrated Weibull is a planning-scenario placeholder to be replaced by this data."}},

{ch:"D · The Group III molecule", title:"Neat base oil vs formulated product",
 body:`<p>Honesty check: this work validates the <b>single base oil</b>, not a finished commercial fluid. Real market immersion fluids are <i>formulated</i> — they carry an <b>antioxidant</b> package and a <b>metal deactivator</b> to survive years against hot copper.</p>
 <p>Two qualification tasks live here: confirming <b>oxidation stability</b> (already in the lubricant test scope — RPVOT/TOST) and running <b>material-compatibility soak tests</b> against PCB laminate, solder mask and polymer connectors.</p>
 <div class="defends">🛡️ You can now answer: <i>"Real coolants have additive packages — you only tested the base oil."</i> — Correct, and disclosed. The Monte Carlo framework is general enough to wrap an additive package once a refiner–customer pair is in pilot; base-oil compliance is the floor, not the finished product.</div>`,
 check:{q:"What does this study deliberately NOT include?",
  opts:[{t:"The antioxidant / metal-deactivator additive package of a finished fluid",ok:true},{t:"The dielectric breakdown measurement",ok:false}],
  reveal:"The <b>additive package</b>. It validates neat Group III base oil against the specs — the floor case — and states plainly that a formulated product is the next layer."}},

// ===================== PART E — MONTE CARLO COMPLIANCE =====================
{ch:"E · Monte Carlo compliance", title:"Nominal pass vs joint probability",
 body:`<p>Here is the intellectual heart of the paper. A conventional datasheet answers: <i>"does the fluid pass each spec at nominal conditions?"</i> — "BDV: 55 kV typical." But that is <b>not</b> what a hyperscale procurement team needs to know.</p>
 <p>They buy across batch-to-batch and field variation, and they need <b>every</b> spec met <b>simultaneously</b>. So the right question is:</p>
 <div class="eqn">P<sub>joint</sub> = P( all six specs pass at once | realistic input uncertainty )</div>
 <p>That single number — a joint compliance probability — is the procurement-grade metric. It reframes the pitch from "we make a base oil" to "we have an audit-grade qualification dossier."</p>`},

{ch:"E · Monte Carlo compliance", title:"Monte Carlo in one idea",
 body:`<p>You cannot get a joint probability from single nominal values — you need the <b>spread</b>. Monte Carlo does it by brute force: draw <b>N = 10 000</b> random parameter sets (seed = 42, so it is reproducible), push each through the physics, and count how many pass all six specs.</p>
 <div class="eqn">P<sub>joint</sub> ≈ <span class="frac"><span># samples passing all 6 specs</span><span>10 000</span></span></div>
 <p>Each sample propagates uncertainty through <b>three coupled sub-models</b> — thermal, electrical, and lifetime — so correlations between failure modes are captured naturally.</p>
 <div class="litnote">📚 <b>Why 10 000 and a fixed seed.</b> 10 000 samples resolve a ~99.7 % pass rate to a fraction of a percent; the fixed seed means anyone re-running <code>compute_results.py</code> gets the identical number — the basis of the audit trail.</div>`},

{ch:"E · Monte Carlo compliance", title:"Choosing the input distributions",
 body:`<p>The realism lives in <i>how</i> each input is sampled. The framework's choices:</p>
 <div class="eqn" style="font-size:13.5px;text-align:left;line-height:1.9">
 <i>Q</i> (chip power) ~ <b>N(700, 16.8) W</b> &nbsp;— H100-class<br>
 <i>T</i><sub>bulk</sub> ~ <b>N(40, 2.7) °C</b><br>
 BDV ~ <b>N(55, 3) kV</b><br>
 ρ<sub>25</sub> ~ <b>lognormal, median 1.5×10¹⁵ Ω·cm</b><br>
 Dk ~ <b>N(2.15, 0.05)</b> &nbsp; · &nbsp; tan δ ~ <b>lognormal, median 1.5×10⁻⁴</b><br>
 life ~ <b>Weibull(shape 8.8, scale 7.0 yr)</b></div>
 <p><b>Normal</b> for symmetric measurement scatter; <b>lognormal</b> for strictly-positive, right-skewed quantities like resistivity; <b>Weibull</b> for time-to-failure. Matching the distribution to the physics is what makes the output credible.</p>
 <div class="defends">🛡️ You can now answer: <i>"Why lognormal for resistivity but normal for BDV?"</i> — Resistivity is positive and spans orders of magnitude (lognormal); BDV scatter is roughly symmetric about a mean (normal); lifetime is a wear-out process (Weibull).</div>`},

{ch:"E · Monte Carlo compliance", title:"Joint compliance: AND vs product",
 body:`<p>Two ways to combine the six specs into one number:</p>
 <p><b>(1) AND across samples</b> — for each of the 10 000 samples, did it pass <i>all six</i>? Fraction that did = the honest joint probability, because it preserves any correlation between failures.<br>
 <b>(2) Product of marginals</b> — multiply the six individual pass rates, assuming failures are independent.</p>
 <div class="eqn">P<sub>joint</sub> ≈ 0.9996 × 1.000 × 0.9990 × 1.000 × 1.000 × 0.9984 ≈ <b>0.9970</b></div>
 <p>Both methods give <b>99.70 %</b> here (agree to 0.01 %) because failures are rare and scattered across different samples. The paper reports method (1) as the headline — the methodologically correct choice.</p>`,
 check:{q:"Why report 'AND across samples' rather than the product of marginals?",
  opts:[{t:"It stays correct even if failure modes are correlated",ok:true},{t:"It always gives a higher, better-looking number",ok:false}],
  reveal:"Correlation-safe. The product assumes independent failures; AND-across-samples makes no such assumption, so it is the honest value. Here they happen to agree to 0.01 %."}},

{ch:"E · Monte Carlo compliance", title:"Reading the result: 99.70 % vs 85 %",
 body:`<p>The headline: joint compliance = <b>99.70 %</b>, against an industry qualification threshold of <b>85 %</b>. The marginal (per-spec) compliances that build it:</p>
 <div class="eqn" style="font-size:13.5px;text-align:left;line-height:1.85">
 Breakdown voltage &nbsp; <b>99.96 %</b><br>
 Volume resistivity (90 °C aged) &nbsp; <b>100.00 %</b><br>
 Dielectric constant &nbsp; <b>99.90 %</b><br>
 Loss tangent &nbsp; <b>100.00 %</b><br>
 Junction temperature &nbsp; <b>100.00 %</b><br>
 Service life (≥ 5 yr) &nbsp; <b>99.84 %</b></div>
 <div class="example"><b>Sanity check.</b> BDV: N(55,3) against a 45 kV floor is (55−45)/3 ≈ 3.3σ away → ~0.04 % fail → 99.96 % pass. The Monte Carlo reproduces the hand calculation exactly.</div>
 <div class="defends">🛡️ You can now answer: <i>"Is 99.7 % actually good?"</i> — It clears the 85 % procurement bar by a wide margin, and no single spec drags below ~99.8 %, so there is no hidden weak link.</div>`},

{ch:"E · Monte Carlo compliance", title:"Service life & honest calibration",
 body:`<p>The lifetime number needs a caveat stated out loud. Service life is drawn from a <b>Weibull(shape 8.8, scale 7.0 yr)</b>, then <b>post-hoc linearly calibrated</b> so the distribution hits literature-derived targets: <b>P5 = 5.8 yr, P50 = 6.6 yr</b>. Marginal compliance for "≥ 5 yr" is <b>99.84 %</b>.</p>
 <p>The paper is explicit that this is <b>not a first-principles lifetime prediction</b> — it is a planning-scenario distribution consistent with accelerated-aging data from comparable hydrocarbon dielectrics. It is fine for compliance-probability estimation; it must not be read as a predictive model. Stage 2 of the roadmap replaces it with measured data.</p>
 <div class="defends">🛡️ You can now answer: <i>"Your lifetime curve looks too clean — where's it from?"</i> — It is a disclosed post-hoc calibration to literature targets, not a fit to our own aging data. We flag it rather than bury it, and the roadmap has a funded step to replace it.</div>`,
 check:{q:"The service-life distribution is…",
  opts:[{t:"A disclosed post-hoc calibration to literature targets, not a first-principles prediction",ok:true},{t:"A direct fit to the authors' own 5-year field data",ok:false}],
  reveal:"A <b>disclosed calibration</b>. The paper states plainly it is a planning-scenario distribution to be replaced by measured accelerated-aging data in Stage 2 — honesty as a credibility asset."}},

// ===================== PART F — ECONOMICS, ROADMAP & DEFENSE =====================
{ch:"F · Economics & roadmap", title:"The cost case",
 body:`<p>Technical pass is necessary but not sufficient — the pivot has to pay. Per-litre economics:</p>
 <div class="eqn">USD 8.5/L (domestic Group III) &nbsp;vs&nbsp; USD 50/L (Shell S5 X import) &nbsp;⇒&nbsp; <b>83 % cheaper</b></div>
 <p>Over a six-year (2025–2030) Indian deployment trajectory, the planning scenario projects cumulative foreign-exchange savings of <b>USD 18 million (₹1494 Crore</b> at 83 INR/USD). Scaled to India's stated late-2020s AI-infrastructure ambitions (~10×), that is <b>USD 180 M</b> of forex saved — and simultaneously USD 180 M of new specialty-margin revenue from existing capacity.</p>
 <div class="litnote">📚 <b>Robustness.</b> The 83 % cost-reduction figure holds under ±20 % uncertainty in the imported reference price; the absolute forex number scales linearly with deployment volume.</div>`},

{ch:"F · Economics & roadmap", title:"No new refinery capex",
 body:`<p>The commercial punchline: this needs <b>no hydrocracker, no new unit</b>. Group III capacity already exists; the gap is qualification, not production. The pivot is <b>additive qualification</b>, not from-scratch development:</p>
 <div class="eqn" style="font-size:13.5px;text-align:left;line-height:1.8">
 Already in scope: VI, pour point, volatility, oxidation stability, sulphur/saturates<br>
 <b>New to add to QC:</b> BDV (IEC 60156), ρ@90 °C aged, Dk & tan δ, material soak tests</div>
 <p>The only capex is QC instrumentation — a BDV tester, a four-electrode resistivity cell, an LCR meter — roughly <b>USD 50–150 k</b>. Rounding error against any meaningful production volume.</p>
 <div class="defends">🛡️ You can now answer: <i>"What's the investment to enter this market?"</i> — ~USD 50–150 k of QC instrumentation and a qualification study. Not a refinery project — a formulation-and-documentation pivot on molecules you already make.</div>`,
 check:{q:"What is the main capital requirement to enter the immersion-coolant market?",
  opts:[{t:"~USD 50–150 k of QC test instrumentation",ok:true},{t:"A new hydrocracking unit costing hundreds of millions",ok:false}],
  reveal:"Just <b>QC instrumentation</b> (BDV tester, resistivity cell, LCR meter). The molecule and its production already exist — the gap is measurement, documentation, and a customer conversation."}},

{ch:"F · Economics & roadmap", title:"The 18-month qualification pilot",
 body:`<p>The paper doesn't hand-wave the path to market — it specifies a three-stage pilot:</p>
 <div class="eqn" style="font-size:13.5px;text-align:left;line-height:1.9">
 <b>Stage 1</b> (months 1–3, ~USD 50 k) — bench dielectric & thermal characterisation; verify the MC input distributions<br>
 <b>Stage 2</b> (months 4–9, ~USD 200 k) — 6-month accelerated aging at 90 °C & 110 °C; replace the calibrated Weibull with measured data<br>
 <b>Stage 3</b> (months 10–18, ~USD 500 k) — instrumented pilot in one immersion tank at a partner data center</div>
 <p>Each stage retires a specific risk in the Monte Carlo — Stage 1 the input assumptions, Stage 2 the lifetime calibration, Stage 3 the real-world OPEX.</p>`},

{ch:"F · Economics & roadmap", title:"Audit-grade credibility",
 body:`<p>What makes this a <b>dossier</b> rather than a slide deck: every number is tied to executable code behind a validation harness. The build runs <code>compute_results.py</code> → writes <code>results.json</code> → a validator compares it against a frozen <code>claims.json</code> and <b>fails the build</b> if any claim and computed result disagree.</p>
 <div class="litnote">📚 <b>Honesty as a feature.</b> An earlier release advertised joint compliance as 97.6 % — a <i>target</i>, not a computed result. The harness caught it; the audited value is <b>99.70 %</b>, and the discrepancy is documented in the changelog rather than hidden.</div>
 <div class="defends">🛡️ You can now answer: <i>"How do we know the numbers weren't massaged?"</i> — Every figure regenerates from open code; a validator refuses to build if claims drift from results. That reproducibility is the asset hyperscaler procurement teams increasingly demand.</div>`},

{ch:"F · Economics & roadmap", title:"Defending the dossier",
 body:`<p>You can now defend the whole argument end-to-end:</p>
 <p>• <b>Market</b> — AI heat broke air cooling; single-phase immersion won; imports cost USD 50–400/L.<br>
 • <b>Molecule</b> — Group III's saturated, non-polar, high-VI structure is simultaneously a premium lubricant and a natural dielectric.<br>
 • <b>Method</b> — 10 000-sample Monte Carlo over three coupled sub-models yields a <b>99.70 %</b> joint compliance vs an 85 % bar.<br>
 • <b>Money</b> — 83 % cheaper, ~USD 18 M forex saved, no new refinery capex.<br>
 • <b>Honesty</b> — post-hoc lifetime calibration and scenario-input forex are disclosed, not buried; a validation harness locks every number to code.</p>
 <div class="example"><b>You've finished the course.</b> You can now take the pitch from "we make a base oil" to "we have an audit-grade qualification dossier for an emerging specialty market" — and answer the hard questions on market, molecule, method, and money.</div>
 <div class="defends">🛡️ The one-line thesis: <i>existing domestic Group III capacity can serve the AI immersion-cooling market as a formulation pivot, and the probability it clears a hyperscaler's full spec is 99.70 %.</i></div>`}
];
