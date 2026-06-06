import { strict as assert } from 'assert';

const { applyDevServerEnv } = require('../tools/runDevServer.js') as {
    applyDevServerEnv: (env: Record<string, string | undefined>) => void;
};

function testDevServerUsesFastLocalPolicyDefaults(): void {
    const env: Record<string, string | undefined> = {};

    applyDevServerEnv(env);

    assert.equal(env.MULTIPLAYER_MODE, 'false');
    assert.equal(env.STATIC_PORT, '8000');
    assert.equal(env.ENABLE_POLICY_SERVER, 'false');
    assert.equal(env.DEBUG_ENABLED, 'true');
    assert.equal(env.DEBUG_PROGRESS, 'true');
    assert.equal(env.DEBUG_PACKETS, 'false');
    assert.equal(env.REWARD_ROLL_DEBUG, 'false');
    assert.equal(env.DUNGEON_RUN_DEBUG, '1');
    assert.equal(env.DEBUG_PAYLOAD_PREVIEW_BYTES, '64');
}

function testExplicitDevOverridesArePreserved(): void {
    const env: Record<string, string | undefined> = {
        ENABLE_POLICY_SERVER: 'false',
        DEBUG_ENABLED: 'false',
        DEBUG_PROGRESS: 'true',
        DEBUG_PACKETS: 'true',
        REWARD_ROLL_DEBUG: 'false',
        DUNGEON_RUN_DEBUG: '0',
        DEBUG_PAYLOAD_PREVIEW_BYTES: '512'
    };

    applyDevServerEnv(env);

    assert.equal(env.MULTIPLAYER_MODE, 'false');
    assert.equal(env.ENABLE_POLICY_SERVER, 'false');
    assert.equal(env.DEBUG_ENABLED, 'false');
    assert.equal(env.DEBUG_PROGRESS, 'true');
    assert.equal(env.DEBUG_PACKETS, 'true');
    assert.equal(env.REWARD_ROLL_DEBUG, 'false');
    assert.equal(env.DUNGEON_RUN_DEBUG, '0');
    assert.equal(env.DEBUG_PAYLOAD_PREVIEW_BYTES, '512');
}

function main(): void {
    testDevServerUsesFastLocalPolicyDefaults();
    testExplicitDevOverridesArePreserved();
    console.log('run_dev_server_env_regression: ok');
}

main();
