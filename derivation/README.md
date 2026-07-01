# Derivation scripts — Group III base stock → OCP-compliant coolant

These reproduce the numbers used in **Chapter G** of the course.

- **`derive_g3_to_ocp.py`** — the forward derivation. Starts from a representative
  Group III lube base-stock spec sheet, maps it onto the OCP immersion-fluid
  envelope (8/10 lines pass untouched), closes the two gaps numerically
  (viscosity via Walther/ASTM D341 grade selection + warm operation; thermal
  conductivity via the convective junction-temperature route and an optional
  Maxwell nanofluid), and ends with the six-spec Monte Carlo compliance (99.70%).

- **`additive_ledger.py`** — the process/additive ledger. Names every process
  (vacuum dehydration, fine filtration) and additive (ashless antioxidant,
  metal deactivator, optional pour-point depressant, optional Al₂O₃ nanofluid)
  with dose and numerical before→after impact, including the nanoparticle
  trade-off (Maxwell for k, Maxwell–Garnett for Dk).

## Running

```bash
python derivation/additive_ledger.py      # self-contained
python derivation/derive_g3_to_ocp.py     # needs the MC framework (see note)
```

`derive_g3_to_ocp.py` imports the six-spec compliance from the companion Monte
Carlo framework (`monte_carlo_simulation.py`, Zenodo/​GitHub release
*g3-immersion-coolant-mc-validation*). Edit the `REPO` path near the bottom of
the script to point at your local copy of that framework's `src/` directory.
`additive_ledger.py` has no external dependency beyond the Python standard
library.

## Models used

| Quantity | Correlation |
|---|---|
| Viscosity vs temperature | Walther / ASTM D341 |
| Nanofluid thermal conductivity | Maxwell |
| Nanofluid permittivity (Dk) | Maxwell–Garnett |
| Aged resistivity at 90 °C | Arrhenius (Eₐ = 0.69 eV) + 10× aging |

Some deltas (water→BDV, RPVOT induction, copper-strip rating) are representative
engineering values, clearly labelled in the script output.
