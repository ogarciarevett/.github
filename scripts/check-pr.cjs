const {execFileSync} = require('node:child_process');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const [repository, numberText] = process.argv.slice(2);
if (!/^[\w.-]+\/[\w.-]+$/.test(repository || '') || !/^[1-9]\d*$/.test(numberText || '')) {
  throw new Error('Usage: node scripts/check-pr.cjs OWNER/REPO NUMBER');
}
const [owner, repo] = repository.split('/');
const number = Number(numberText);
const get = path => JSON.parse(execFileSync('gh', ['api', path], {encoding: 'utf8'}));
const pr = get(`repos/${repository}/pulls/${number}`);
const workflow = readFileSync(join(__dirname, '../.github/workflows/evidence.yml'), 'utf8');
const script = workflow.split('          script: |\n')[1].split('  refresh:')[0].replace(/^            /gm, '');
const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
new AsyncFunction('github', 'context', 'core', script)({
  graphql: async query => JSON.parse(execFileSync('gh', ['api', 'graphql', '-f', `query=${query}`,
    '-f', `owner=${owner}`, '-f', `repo=${repo}`, '-F', `number=${number}`], {encoding: 'utf8'})).data,
  rest: {pulls: {get: async () => ({data: pr})}, issues: {listComments: 'comments'}},
  paginate: async () => {
    const pages = JSON.parse(execFileSync('gh', ['api', '--paginate', '--slurp',
      `repos/${repository}/issues/${number}/comments?per_page=100`], {encoding: 'utf8'}));
    return pages.flat();
  },
}, {repo: {owner, repo}, payload: {pull_request: pr}}, {info: console.log})
  .catch(error => { console.error(error.message); process.exitCode = 1; });
