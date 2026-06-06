function applyDevServerEnv(env = process.env) {
    env.MULTIPLAYER_MODE = 'false';
    env.STATIC_PORT = env.STATIC_PORT || '8000';
    env.ENABLE_POLICY_SERVER = env.ENABLE_POLICY_SERVER || 'false';
    env.DEBUG_ENABLED = env.DEBUG_ENABLED || 'true';
    env.DEBUG_PROGRESS = env.DEBUG_PROGRESS || 'true';
    env.DEBUG_PACKETS = env.DEBUG_PACKETS || 'false';
    env.REWARD_ROLL_DEBUG = env.REWARD_ROLL_DEBUG || 'false';
    env.DUNGEON_RUN_DEBUG = env.DUNGEON_RUN_DEBUG || '1';
    env.DEBUG_PAYLOAD_PREVIEW_BYTES = env.DEBUG_PAYLOAD_PREVIEW_BYTES || '64';
}

function startDevServer() {
    require('../scripts/cleanup-dev-instance');
    applyDevServerEnv();

    require('ts-node/register');
    require('../main.ts');
}

if (require.main === module) {
    startDevServer();
}

module.exports = {
    applyDevServerEnv,
    startDevServer
};
