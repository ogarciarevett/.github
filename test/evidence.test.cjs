const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const workflow = readFileSync(join(__dirname, '../.github/workflows/evidence.yml'), 'utf8');
const scripts = workflow.split('          script: |\n').slice(1)
  .map(text => text.split('  refresh:')[0].replace(/^            /gm, ''));
const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
const verify = new AsyncFunction('github', 'context', 'core', scripts[0]);
const refresh = new AsyncFunction('github', 'context', 'core', 'setTimeout', scripts[1]);
const head = 'abcdef01234567890123456789012345678901234';
const time = '2026-10-25T01:00:00Z';
const evidence = '## Evidence (head abcdef0)\n\nCommand: curl localhost/health\nHTTP 200 OK';
function check(body, comments = [], payloadHead = head) {
  const pr = {body, head: {sha: head}, updated_at: time};
  return verify({rest: {pulls: {get: async () => ({data: pr})}, issues: {listComments: null}},
    paginate: async () => comments}, {repo: {owner: 'owner', repo: 'repo'},
    payload: {pull_request: {number: 1, head: {sha: payloadHead}}}}, {info() {}});
}
test('missing evidence fails', async () => assert.rejects(check('A change'), /Post Evidence/));
test('body proof passes', async () => check(evidence));
test('bare comment heading passes', async () => check('', [{body: evidence.replace('## ', ''), updated_at: time, id: 1}]));
test('stale evidence fails', async () => assert.rejects(check(evidence.replace('abcdef0', '1234567')), /Post Evidence/));
test('newest stale comment overrides matching body', async () => assert.rejects(check(evidence,
  [{body: evidence.replace('abcdef0', '1234567'), updated_at: time, id: 1}]), /Post Evidence/));
test('updated source timestamp takes priority', async () => check(evidence,
  [{body: evidence.replace('abcdef0', '1234567'), updated_at: '2026-10-24T01:00:00Z', id: 1}]));
test('last marker within one source wins', async () => assert.rejects(check(evidence + '\n\n' + evidence.replace('abcdef0', '1234567')), /Post Evidence/));
test('empty and template-only sections fail', async () => {
  await assert.rejects(check('Evidence (head abcdef0)'), /Post Evidence/);
  await assert.rejects(check('Evidence (head abcdef0)\n<!-- add proof -->'), /Post Evidence/);
  await assert.rejects(check('Evidence (head abcdef0)\n\n## Other\nUnrelated text'), /Post Evidence/);
});
test('commented-out evidence fails', async () => assert.rejects(check(`<!-- ${evidence} -->`), /Post Evidence/));
test('old run cannot pass for changed PR head', async () => assert.rejects(check(evidence, [], 'f'.repeat(40)), /old head/));
test('CRLF evidence passes', async () => check(evidence.replaceAll('\n', '\r\n')));
test('all comments are paginated', async () => {
  assert.match(scripts[0], /github\.paginate/);
  await check('', Array.from({length: 105}, (_, i) => ({id: i + 1, updated_at: time,
    body: i === 104 ? evidence : 'discussion'})));
});
async function recheck(runs, state = 'open') {
  const calls = [];
  const github = {rest: {
    pulls: {get: async () => ({data: {head: {sha: head}, state}})},
    actions: {listWorkflowRuns: async args => {calls.push(args); return {data: {workflow_runs: runs}};},
      reRunWorkflow: async args => calls.push(args)},
  }};
  await refresh(github, {repo: {owner: 'owner', repo: 'repo'}, payload: {issue: {number: 1}}},
    {info() {}}, resolve => resolve());
  return calls;
}
test('comment reruns only evidence workflow for matching PR and head', async () => {
  const calls = await recheck([{id: 99, status: 'completed', pull_requests: [{number: 1}]}]);
  assert.equal(calls[0].workflow_id, 'evidence.yml');
  assert.equal(calls[0].head_sha, head);
  assert.equal(calls[0].event, 'pull_request');
  assert.equal(calls[1].run_id, 99);
});
test('no completed matching run fails closed', async () => {
  await assert.rejects(recheck([{id: 99, status: 'completed', pull_requests: [{number: 2}]}]), /No completed/);
  await assert.rejects(recheck([{id: 99, status: 'in_progress', pull_requests: [{number: 1}]}]), /No completed/);
});
test('closed PR does not rerun', async () => assert.deepEqual(await recheck([], 'closed'), []));
