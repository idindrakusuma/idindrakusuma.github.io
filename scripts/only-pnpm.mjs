/**
 * Refuses any install that is not pnpm.
 *
 * `packageManager` in package.json has declared pnpm for as long as this repo has
 * existed, and it stopped nobody — the committed lockfile was npm's, and the docs
 * said `npm install`. A declaration that nothing enforces is a comment.
 *
 * Wired as `preinstall`, so it runs before a single dependency is fetched. That
 * is also why it imports nothing: at this point node_modules may not exist.
 *
 * Package managers announce themselves in npm_config_user_agent, e.g.
 *   pnpm/10.27.0 npm/? node/v20.19.4 darwin arm64
 *   npm/10.8.2 node/v20.19.4 darwin arm64 workspaces/false
 */
const agent = process.env.npm_config_user_agent ?? '';
const name = agent.split('/')[0];

if (name !== 'pnpm') {
  const detected = name ? `You ran: ${name}` : 'Could not tell which one you ran.';
  process.stderr.write(
    `\n  This repo uses pnpm (see "packageManager" in package.json).\n` +
      `  ${detected}\n\n` +
      `  Try:  corepack enable && pnpm install\n\n`,
  );
  process.exit(1);
}
