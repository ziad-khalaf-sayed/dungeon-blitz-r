import { strict as assert } from 'assert';
import * as path from 'path';
import { GlobalState } from '../core/GlobalState';
import { LevelConfig } from '../core/LevelConfig';
import { LevelHandler } from '../handlers/LevelHandler';
import { MissionHandler } from '../handlers/MissionHandler';
import { BitBuffer } from '../network/protocol/bitBuffer';
import { BitReader } from '../network/protocol/bitReader';

type SentPacket = {
    id: number;
    payload: Buffer;
};

type FakeClient = {
    token: number;
    userId: number | null;
    playerSpawned: boolean;
    currentLevel: string;
    levelInstanceId: string;
    currentRoomId: number;
    character: {
        name: string;
        level: number;
        CurrentLevel: { name: string; x: number; y: number };
        PreviousLevel: { name: string; x: number; y: number };
        missions: Record<string, { state: number; currCount?: number }>;
        questTrackerState: number;
    };
    characters: any[];
    sentPackets: SentPacket[];
    send: (id: number, payload: Buffer) => void;
    sendBitBuffer: (id: number, bb: BitBuffer) => void;
};

function ensureLevelConfigLoaded(): void {
    if (!LevelConfig.has('GoblinRiverDungeon')) {
        LevelConfig.load(path.resolve(__dirname, '../data'));
    }
}

function createClient(token: number, name: string): FakeClient {
    const sentPackets: SentPacket[] = [];
    const character = {
        name,
        level: 10,
        CurrentLevel: { name: 'GoblinRiverDungeon', x: 0, y: 0 },
        PreviousLevel: { name: 'NewbieRoad', x: 1421, y: 826 },
        missions: {},
        questTrackerState: 0
    };

    return {
        token,
        userId: token,
        playerSpawned: true,
        currentLevel: 'GoblinRiverDungeon',
        levelInstanceId: 'goblin-shared',
        currentRoomId: 1,
        character,
        characters: [character],
        sentPackets,
        send(id: number, payload: Buffer) {
            sentPackets.push({ id, payload: Buffer.from(payload) });
        },
        sendBitBuffer(id: number, bb: BitBuffer) {
            sentPackets.push({ id, payload: bb.toBuffer() });
        }
    };
}

function createQuestProgressPacket(progress: number): Buffer {
    const bb = new BitBuffer(false);
    bb.writeMethod4(progress);
    return bb.toBuffer();
}

function createLevelCompletePacket(progress: number = 100, remainingKills: number = 0, requiredKills: number = 1): Buffer {
    const bb = new BitBuffer(false);
    bb.writeMethod9(progress);
    bb.writeMethod9(0);
    bb.writeMethod9(0);
    bb.writeMethod9(0);
    bb.writeMethod9(0);
    bb.writeMethod9(0);
    bb.writeMethod9(remainingKills);
    bb.writeMethod9(requiredKills);
    bb.writeMethod9(3);
    return bb.toBuffer();
}

function parseQuestProgress(payload: Buffer): number {
    const br = new BitReader(payload);
    return br.readMethod4();
}

function setPartyLeader(leader: FakeClient, ...members: FakeClient[]): void {
    const partyId = 77;
    const names = [leader, ...members].map((client) => client.character.name);
    GlobalState.partyGroups.set(partyId, {
        id: partyId,
        leader: leader.character.name,
        members: names,
        locked: false
    });
    for (const client of [leader, ...members]) {
        GlobalState.partyByMember.set(client.character.name.toLowerCase(), partyId);
    }
}

async function testGoblinRiverQuestProgressStaysIncompleteBeforeHostilesExist(): Promise<void> {
    const solo = createClient(800, 'Solo');

    GlobalState.sessionsByToken.set(solo.token, solo as never);

    await LevelHandler.handleQuestProgressUpdate(solo as never, createQuestProgressPacket(100));

    assert.equal(solo.character.questTrackerState, 0, 'dungeon progress should stay incomplete before any shared hostile authority exists');
    assert.deepEqual(
        solo.sentPackets.filter((packet) => packet.id === 0xB7).map((packet) => parseQuestProgress(packet.payload)),
        [0],
        'the server should correct the client back to 0% until shared dungeon hostiles exist'
    );

    await MissionHandler.handleSetLevelComplete(solo as never, createLevelCompletePacket());

    assert.equal(
        solo.sentPackets.some((packet) => packet.id === 0x87),
        false,
        'the dungeon should not complete before shared dungeon authority and progress are established'
    );
}

async function testGoblinRiverQuestProgressFollowsHostileOwnerAuthority(): Promise<void> {
    const authority = createClient(801, 'Leader');
    const joiner = createClient(802, 'Member');

    GlobalState.sessionsByToken.set(authority.token, authority as never);
    GlobalState.sessionsByToken.set(joiner.token, joiner as never);
    setPartyLeader(authority, joiner);
    GlobalState.levelEntities.set('GoblinRiverDungeon#goblin-shared', new Map<number, any>([
        [
            5001,
            {
                id: 5001,
                name: 'GoblinClub',
                isPlayer: false,
                team: 2,
                entState: 0,
                hp: 100,
                clientSpawned: true,
                ownerToken: authority.token,
                ownerPartyId: 77,
                roomId: 1
            }
        ],
        [
            5002,
            {
                id: 5002,
                name: 'GoblinDagger',
                isPlayer: false,
                team: 2,
                entState: 6,
                hp: 0,
                dead: true,
                clientSpawned: true,
                ownerToken: authority.token,
                ownerPartyId: 77,
                roomId: 1
            }
        ]
    ]));

    await LevelHandler.handleQuestProgressUpdate(joiner as never, createQuestProgressPacket(100));

    assert.equal(joiner.character.questTrackerState, 50, 'joiner progress should be recomputed from the server hostile state');
    assert.equal(authority.character.questTrackerState, 50, 'leader progress should follow the same shared server-computed state');
    assert.deepEqual(
        joiner.sentPackets.filter((packet) => packet.id === 0xB7).map((packet) => parseQuestProgress(packet.payload)),
        [50],
        'joiner should be corrected to the shared server-computed progress'
    );
}

async function testGoblinRiverLevelCompleteWaitsForSharedProgressCompletion(): Promise<void> {
    const authority = createClient(811, 'Leader');
    const joiner = createClient(812, 'Member');

    GlobalState.sessionsByToken.set(authority.token, authority as never);
    GlobalState.sessionsByToken.set(joiner.token, joiner as never);
    setPartyLeader(authority, joiner);
    GlobalState.levelEntities.set('GoblinRiverDungeon#goblin-shared', new Map<number, any>([
        [
            5101,
            {
                id: 5101,
                name: 'GoblinArmorAxe',
                isPlayer: false,
                team: 2,
                entState: 0,
                hp: 100,
                clientSpawned: true,
                ownerToken: authority.token,
                ownerPartyId: 77,
                roomId: 1
            }
        ]
    ]));

    await MissionHandler.handleSetLevelComplete(joiner as never, createLevelCompletePacket());

    assert.equal(
        joiner.sentPackets.some((packet) => packet.id === 0x87),
        false,
        'joiner should not complete the dungeon while server-computed progress is incomplete'
    );

    await LevelHandler.handleQuestProgressUpdate(joiner as never, createQuestProgressPacket(100));
    assert.equal(joiner.character.questTrackerState, 0, 'joiner false completion should still be ignored before the server sees the hostile die');

    const hostile = GlobalState.levelEntities.get('GoblinRiverDungeon#goblin-shared')?.get(5101);
    assert.ok(hostile, 'canonical hostile should exist');
    hostile.hp = 0;
    hostile.dead = true;
    hostile.entState = 6;

    LevelHandler.refreshSharedDungeonQuestProgress('GoblinRiverDungeon#goblin-shared');
    await MissionHandler.handleSetLevelComplete(authority as never, createLevelCompletePacket());

    assert.equal(
        authority.sentPackets.some((packet) => packet.id === 0x87),
        true,
        'leader should complete the dungeon once server-computed shared progress reaches 100%'
    );
    assert.deepEqual(
        joiner.sentPackets.filter((packet) => packet.id === 0xB7).map((packet) => parseQuestProgress(packet.payload)).slice(-1),
        [100],
        'joiner should receive the shared server-computed 100% progress before completion'
    );
}

async function main(): Promise<void> {
    ensureLevelConfigLoaded();

    const levelEntities = new Map(GlobalState.levelEntities);
    const sessionsByToken = new Map(GlobalState.sessionsByToken);
    const levelQuestProgress = new Map(GlobalState.levelQuestProgress);
    const partyByMember = new Map(GlobalState.partyByMember);
    const partyGroups = new Map(GlobalState.partyGroups);
    GlobalState.levelEntities.clear();
    GlobalState.sessionsByToken.clear();
    GlobalState.levelQuestProgress.clear();
    GlobalState.partyByMember.clear();
    GlobalState.partyGroups.clear();

    try {
        await testGoblinRiverQuestProgressStaysIncompleteBeforeHostilesExist();

        GlobalState.levelEntities.clear();
        GlobalState.sessionsByToken.clear();
        GlobalState.levelQuestProgress.clear();
        GlobalState.partyByMember.clear();
        GlobalState.partyGroups.clear();
        await testGoblinRiverQuestProgressFollowsHostileOwnerAuthority();

        GlobalState.levelEntities.clear();
        GlobalState.sessionsByToken.clear();
        GlobalState.levelQuestProgress.clear();
        GlobalState.partyByMember.clear();
        GlobalState.partyGroups.clear();
        await testGoblinRiverLevelCompleteWaitsForSharedProgressCompletion();
    } finally {
        GlobalState.levelEntities = levelEntities;
        GlobalState.sessionsByToken = sessionsByToken;
        GlobalState.levelQuestProgress = levelQuestProgress;
        GlobalState.partyByMember = partyByMember;
        GlobalState.partyGroups = partyGroups;
    }

    console.log('shared_dungeon_progress_regression: ok');
}

void main().catch((error) => {
    console.error('shared_dungeon_progress_regression: failed');
    console.error(error);
    process.exitCode = 1;
});
