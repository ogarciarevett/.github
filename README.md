# Shared pull request guidance

Use the default PR template to explain the change, show actual evidence for its
current head and make its rollback risk clear. These files provide contributor
and reviewer guidance; they install no tools and activate no automation.

## Applicable quality checks

Each consuming repository pins and configures its own tools, retains its minimum
runtime and selects only the languages and maintained paths it actually has.

| Language | Non-writing gate contract |
| --- | --- |
| Rust | `cargo fmt --all -- --check` and clippy with `-D warnings` |
| Python | Black `--check` for formatting; Ruff `check` for lint |
| TypeScript / JavaScript | Biome `check --error-on-warnings` for formatting and lint |

Keep existing strict type checks and service-free unit tests. Local pre-push and
CI use the same applicable checks; failure stops before downstream build or
publication. A new executable gate needs a temporary negative fixture proving
that failure blocks a synthetic continuation. Separate any necessary baseline
format repair from gate logic and verify that it is mechanical.

## Linked changes and review

Related or dependent PRs use official `gh stack`, record stack links, base
relationships and exact reviewed heads, and merge together via `gh stack merge`.
Reviewers return CHANGES for unlinked related/dependent feature PRs. A standalone
PR explains why it has no dependent PR in the change.

After a push, update the body or add a fresh evidence comment for the current
head. Record actual commands, results, affected features and limitations. Local
checks, hosted CI and live-service acceptance are separate claims; unrun checks
remain unknown. No template heading can establish that behavior works.

External contributors disclose the tool, exposed model (or unknown), scope and
human review responsibility. The owner and explicitly authorized agents leave
the attribution line blank. Existing review, contribution rights, tests and
secret-handling duties still apply; no personal data or private prompts belong
in an attribution or evidence section.

## Adoption and scope

`PULL_REQUEST_TEMPLATE.md` supplies GitHub's default community template where a
repository inherits it; a repository's own template takes precedence. Consuming
repositories must explicitly adopt the applicable tool checks and their own
AGENTS/CODING policy. Files here do not enforce checks in another repository.

See [repository instructions](AGENTS.md) and
[guidance standards](CODING_STANDARDS.md), including its portable
[coordinator work queue](CODING_STANDARDS.md#coordinator-work-queue) policy.
This change is text-only. The legacy
evidence workflow, checker, scripts and permissions remain unchanged and are
not an installation or rerun path for this policy. Do not restore that automation
or the archived cross-AI template.
