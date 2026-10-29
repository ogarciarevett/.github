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
