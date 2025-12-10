# Altered Monorepo Architecture — Expert Manual

A precision-tight guide for structuring, sharing, building, and publishing packages in a PNPM-powered monorepo.  
All conclusions below reflect the final refined decisions.

---

## 1. Directory Layout

```
packages/
    public/
        data/
            shapes/ # @altered/data/shapes (types, validators, constants)
        harness/ # @altered/harness (api client)
    internal/
        data/
            store/ # @altered-internal/data/store (db)
            access/ # @altered-internal/data/access (data access layer)
        harness/ # @altered-internal/harness (api server)
        utils/ # @altered-internal/utils
        ... (additional modules, internal by default)
```

**Principles**

- Public packages live directly under `packages/public/`.
- Private/internal packages live in `packages/internal/`.

---

## 2. `pnpm-workspace.yaml`

```yaml
packages:
    - "apps/*"
    - "packages/public/*"
    - "packages/internal/*"
```

⸻

3. Public ↔ Internal Dependency Strategy

```
Rules
	1.	Public packages must never depend on internal packages.
→ Avoid leaking hidden code into npm artifacts.
	2.	Internal packages may depend on public packages.
→ Internal code can build on exported, stable primitives.
	3.	Internal-only logic remains only in packages/internal.
```

```
This guarantees:
	•	Clean publish boundaries
	•	Zero accidental internal exposure
	•	Predictable import graph (no cycles)
```

⸻

4. Sharing Code Between Public & Internal Packages

Use case: overlapping types, runtime validators, shared constants

Use a single-source-of-truth public package: @altered/data/shapes.

```
shapes provides:
	•	Zod validators
	•	Runtime-safe data definitions
	•	TS types
	•	Cross-package primitives (IDs, enums, guards)
```

Flow:

```
@altered/data/shapes
        ↓ imports
@altered/data/store → @altered/data/access → @altered/harness → internal/*
```

Everything downstream consumes the shared module.
No circular imports since data primitives sit at the root of the tree.

⸻

5. Type Generation & Build Strategy

```
Development
	•	Do NOT build types during development (unless we reconsider, would it help?)
	•	Let TS project references + editor tooling read .ts directly.
	•	You keep instant type feedback.
```

Publishing

Each public package should run a build pipeline:

tsdown (tsup is now deprecated) / tsc --emitDeclarationOnly (should we use a bundler or is tsc sufficient?)

```
The output directory will include:
	•	.js
	•	.d.ts
	•	any schema outputs if needed
```

The internal packages (marked "private": true) skip publishing.

package.json pattern for hybrid dev/build

Inside each public package:

```
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsdown --dts",
    "dev": "tsdown --watch"
  }
}
```

Editor imports actual source; published users import built artifacts.
No path changes required.

⸻

6. Naming Conventions (Finalized)

```
Public packages
	•	@altered/data/shapes
	•	@altered/harness

Internal packages
	•	All internal prefixed by @altered-internal/*
	•	All are "private": true

Rationale:
	•	“shapes” conveys type + validator primitives
	•	“store” = storage backend surface
	•	“access” = function-level domain access
	•	“harness” = external-facing API client
	•	“altered-internal” = clear upgrade/fix/extension space
```

⸻

7. Publishing Strategy

```
Use Changesets with fixed versioning
	•	All public packages advance together (typical scheme used by Next.js, tRPC, ORPC).
	•	Internal packages are "private" and excluded.

Why fixed versioning?
	•	Strong compatibility guarantees across the ecosystem
	•	Predictable upgrade paths
	•	No version drift between dependent internal libraries
	•	Resolves the “one package updated → all updated” pattern used by major frameworks

Why not one big package?
	•	Boundaries enforce clarity and composability
	•	Smaller install footprints
	•	Stable upgrade paths
	•	Sharper dependency trees
	•	Industry-standard for modular ecosystems (Next.js, React toolchains)
```

⸻

```
8. Final Build & Release Pipeline
	1.	Lint + Typecheck (root)
	2.	Build all packages (tsdown / tsc references)
	3.	Changesets version application (in GitHub Actions only?)
	4.	Publish public packages to NPM
	5.	Skip all private: true packages
	6.	Include prepublish build for safety

Minimal root scripts (example - could vary with Turborepo):

{
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm -r --parallel dev",
    // Lint, typecheck, etc.
    "release": "changeset version && pnpm build && changeset publish"
  }
}
```

⸻

```
9. Mental Model Summary
	•	Public defines primitives
	•	Internal extends behavior
	•	Editor uses source; npm consumers use built artifacts (is it optimal?)
	•	Changesets keep versions synchronized
	•	Fixed versioning removes internal semantic drift

⸻

10. TL;DR Core Rules
	•	Public packages cannot depend on internal.
	•	Internal can depend on public.
	•	Shared types → @altered/data/shapes.
	•	Build only on publish.
	•	Fixed versioning → yes.

⸻
```
