# Contributor guidance standards

- Apply checks only to languages and maintained files present in the consuming
  repository. Rust uses cargo fmt and clippy with warnings denied; Python uses
  Black for formatting and Ruff for lint; TypeScript/JavaScript uses Biome for
  formatting and lint. Preserve existing type checks and service-free unit tests.
- Pin tools and commit the consuming repository's configuration/lock. Keep its
  existing minimum runtime and language targets. Never run two formatters on the
  same files or require private runtime artifacts just to check source.
- Local pre-push and CI use the same applicable, non-writing checks. A nonzero
  formatter/linter/type result stops downstream build or publication. Prove new
  executable gates with temporary negative fixtures and synthetic continuation,
  never a real publish. This shared text-only change needs diff/link review.
- Separate a necessary baseline formatting repair into a bounded mechanical
  commit; do not hide product changes inside it.
- Related or dependent PRs must use official `gh stack`, record their stack/base
  relationships and exact reviewed heads, and merge together with `gh stack
  merge`. Reviewers return CHANGES for unlinked related/dependent feature PRs.
  A standalone PR states why no dependent PR belongs to its change.
- Evidence describes actual commands, results, affected behavior and limits at
  the current full head. Separate local proof from hosted CI and live acceptance;
  a heading or template is not proof. Unrun checks remain unknown.
- External contributors disclose the tool, exposed model (or unknown), scope and
  human review responsibility. The owner and explicitly authorized agents leave
  the attribution line blank. This exception does not waive tests, review,
  contribution rights, branch protections or secret handling.
- Keep secrets, account identities, private prompts and internal coordination
  data out of shared guidance and evidence. This policy grants no permission to
  deploy, publish, spend, change credentials or broaden CI permissions.
- Legacy evidence automation is outside this policy: do not restore, modify or
  rerun its workflow, checker or scripts. No executable enforcement is added here.

## Coordinator work queue

- At every loop, read GitHub fresh for open issues in the approved repositories
  with the configured owner label, `ready-for-agent` and P0 or P1 priority. Order
  P0 first, then P1; skip issues whose spec body has a live `Agent:` claim. Memory
  and checkpoints are context, not the authoritative work queue.
- Every P0 spec has exactly one authorized `implement-spec` lead. That lead
  follows the ticket frontier until the whole spec is closed. When it finishes,
  start the next eligible lead in the same coordinator turn, if one is available.
- On start, the lead writes `Agent: <name>` in the spec body. Replace that claim
  when the lead finishes so a stale live claim cannot hide eligible work.
- A coordinator task that creates a spec is complete only after an authorized
  owner agent has actually started it; an issue link or an assignment alone is
  insufficient.
- When a lead starts, send the Chief one line: `STARTED: #<n> <agent>`. Report
  subsequent states with `MERGED`, `FAIL`, `BLOCKED`, `DECISION`, `DONE` or `READY`
  as applicable. Routing configuration stays private; never publish internal run
  identifiers, credentials or local coordination paths.

These are operating instructions, not implemented runtime automation. They do
not create sessions, start workers, activate hooks or grant authority beyond the
existing task authorization.
