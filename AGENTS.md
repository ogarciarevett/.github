# Repository instructions

Read [CODING_STANDARDS.md](CODING_STANDARDS.md) before changing shared contributor
guidance. [README.md](README.md) explains how consuming repositories adopt it.

This repository's task is non-executable guidance: the default PR template,
README and these policy pointers. Do not install, restore, modify or rerun the
legacy evidence workflow, checker, scripts or permissions as part of this work.
Repository-local instructions in a consuming project must adopt the policy
explicitly; this file does not install tools or activate automation elsewhere.

Related or dependent PRs use the official `gh stack` workflow and merge together
with `gh stack merge`. Record stack links, base relationships and exact heads.

For coordinator queue selection, lead claims and start/completion reporting,
follow [Coordinator work queue](CODING_STANDARDS.md#coordinator-work-queue).
This pointer provides policy only; no coordinator runtime is installed here.
