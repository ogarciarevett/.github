# Pull request evidence

Every pull request needs evidence that its requested behavior works, plus one
proof for each other feature affected by its changed files. Without evidence
for the current head, do not merge. Reviewers assess the proof itself: a matching
heading alone cannot establish that a feature works.

After **every push**, upload fresh evidence in the PR body or a new comment:

````markdown
## Evidence (head abc1234)

Goal: require proof for the current PR revision.
Command: node --test test/evidence.test.cjs
Result: paste the actual output here.

Other affected features: list each one and its own proof, or explain why none apply.
````

Use the first seven characters of the PR's current head SHA. Logs, screenshots,
terminal tables, and HTTP responses are welcome. Keep secrets and personal data out.
The newest evidence marker in the body or issue comments, ordered by body edit/comment update
time and then position, must match the head and contain proof. Re-editing an older
submission makes it newer. A body edit also updates its ordering; unrelated PR activity does not. HTML comments
and empty sections are ignored as proof. Submit a fresh comment if an unrelated
body edit makes its old submission the newest one.

`PULL_REQUEST_TEMPLATE.md` supplies the default community template for repositories
without their own template. Existing repository templates must carry the same
Evidence section. GitHub's default community files apply regardless of destination repository visibility.
See [GitHub's default community file documentation](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file).

## Install the check

Save this as `.github/workflows/evidence.yml`, replacing `<commit-sha>` with a
reviewed full commit SHA from this repository:

```yaml
name: PR evidence
on:
  pull_request:
    types: [opened, synchronize, edited, reopened]
  issue_comment:
    types: [created, edited, deleted]
permissions: {}
jobs:
  evidence:
    permissions:
      pull-requests: read
      issues: read
      actions: write
    uses: ogarciarevett/.github/.github/workflows/evidence.yml@<commit-sha>
```

The validator reads the live PR and all issue comments through the GitHub API.
It executes no PR code and requires no secrets. The PR job has read-only access.
The comment job uses the default token's Actions write permission only to rerun
the current-head `evidence.yml` PR workflow. This refreshes its existing result,
including for fork PRs; it does not rerun project builds. Comment events start
working once the caller exists on the default branch. If a recheck cannot be
scheduled, edit the PR body or rerun the evidence workflow manually.

Require the `evidence / verify` check in branch protection after observing its
exact displayed name in the repository. Installing a workflow alone does not
prevent a merge. Where hosted Actions are blocked, reviewers must run the local
validator against the live PR and reject missing, stale, or incomplete evidence.

## Light local verification

Run `node --test test/evidence.test.cjs` for parser and API-mock checks.
Run `node scripts/check-pr.cjs OWNER/REPO NUMBER` with authenticated `gh` for the
same validator against a live PR. This reads only PR metadata and comments.
