<img width="1140" height="807" alt="image" src="https://github.com/user-attachments/assets/686c0cbe-5f99-409a-b12f-19f225d0e5e7" />---
title: 'Stratum 1.22.7-stratum.3 is out'
date: 2026-11-21
author: 'Zaldaryon'
authorGithub: 'Zaldaryon'
image: '/news/welcome.png'
summary: 'Privacy and reach fixes, group administration, class change requests, a pregen queue, falling block and dropped item limits, and a long list of network and worldgen fixes.'
---

Stratum `1.22.7-stratum.3` is now available.

This is the stable release that follows `1.22.7-stratum.2`. It closes two ways a client could read other players' private data, adds staff tools for groups and class changes, and limits the work a big cave-in or a pile of dropped items can put on one tick. It also includes the changes from the `2-indev.2` and `3-indev.1` builds, so you do not need to read those posts first.

<p>
  <a href="https://github.com/StratumServer/Stratum/releases/tag/v1.22.7-stratum.3" class="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
    Download 1.22.7-stratum.3
  </a>
</p>

## Privacy and reach fixes

Player inventories used to go out in packets that every client in range received. A worn bag's contents, another player's held stack, and the contents of block containers were all included, whether or not the receiving client had any reason to see them. A modified client could read another player's private storage without opening anything. Each affected packet is now split into a public snapshot and a full one, so a client only receives what it has a reason to see.

Vanished players leaked in several places that the `/vanish` filter did not cover. Position and animation updates, priority spawns, entity and player data broadcasts, mounts, reconnect state, `/near`, and spectator map pins now follow the same visibility rule. A mount that carries a vanished player is hidden, and a mount with ordinary passengers stays visible. The owner of a hidden or filtered inventory still receives their own full inventory when they join.

Interaction reach is now enforced even when the vanilla `AntiAbuse` setting is off. Exceptions thrown by a mod's collectible behavior during block breaking or item damage are contained, so a broken tool no longer disconnects the player who used it.

The build also pins the transitive `System.Drawing.Common` package to 4.7.2 to address [GHSA-rxg9-xrhp-64gj](https://github.com/advisories/GHSA-rxg9-xrhp-64gj).

## Tools for staff

Staff can now manage player groups with `/group admin`. A group can have a kind that decides how it behaves: whether a player can hold only one group of that kind, how many members it takes, and whether sharing it turns friendly fire off. Staff can lock a member into a group with an optional expiry, freeze a roster for the length of an event, set an ally or enemy relation between two groups, and give a group a tag that shows in chat and on nametags. Every default reproduces vanilla behavior, so nothing changes until a server defines a kind or a staff member sets something. The [groups page](/docs/moderation/groups) has the commands.

Players can change class from the game. `/class change <class> [reason]` switches straight away while the player has self-service changes left, and files a request once they run out. Staff with the `stratum.classrequests` privilege review requests with `/classrequests list`, `info`, `approve` and `deny`, and staff who join later are told how many are waiting. See [Class changes](/docs/moderation/class-changes).

Other additions for staff:

- `/friendlyfire` turns damage between members of the same group on or off at runtime. It is on by default, as in vanilla.
- A role can carry more than one name prefix. The tags stack in front of the name, ordered by `Priority`.
- `/stratum pregen queue` holds up to 32 pregeneration jobs that run one after another, with `queue list` and `queue clear`. The queue lives in memory and does not survive a restart.
- The `revive`, `restart`, and `clearitems` privileges are now registered with the other command privileges, so they can be granted by role.
- Two performance features and two packet guards have switches: `Performance.Physics.EntityTrackingHysteresisEnabled`, `Performance.Physics.ClientListReuseEnabled`, `Hardening.EntityPacketRangeGuard` and `Hardening.BlockEntityPacketRangeGuard`. The entity guard rejects packets from mods that legitimately act far from the player, so turn it off if a mod needs that.

## Cave-ins and dropped items

Vanilla spawns one entity for each falling block, so a large collapse can put thousands of entities into a single tick. With a player in range, Stratum now queues falls and keeps at most 1000 falling entities alive at a time. With no player in range, a fall resolves without an entity at all. A lower limit keeps the tick flat and makes a big collapse take longer. The contributor measured a heap of about 13,600 sand blocks: a limit of 1000 gave about 4.4 ms mean tick time and took more than four minutes, while vanilla took about 22 ms and about 134 seconds.

Resting dropped items of the same type now merge into larger stacks after they settle. A stack a player just dropped waits for the vanilla pickup window first. Merging goes through the vanilla stack rules, the merged stack keeps the longer despawn time, and stacks in different land claims never mix.

Both systems are on by default. Their settings are in [Performance tuning](/docs/configuration/performance-tuning), including a blacklist for item codes that must never merge.

## Network and joining

The server assets packet is now compressed once instead of once for every joining client. Cached startup packets are rebuilt when the world config changes, so players who join after `/wc` or a mod's config edit no longer get the old values until a restart. On the position packet path, a UDP packet length is written in one pass, a queued position for a client and entity is replaced by the newest one, and a UDP packet whose client is already gone is dropped.

Dirty block publishing is capped at 512 positions per pass on the gameplay thread. Character inventory broadcasts are capped and rotated during a dirty-slot flush. The shared SQLite chunk command is no longer disposed on every read, and the player occlusion raytrace now scales with the number of online players.

There is also an opt-in send queue for each connection. It retries short writes, flushes on shutdown, and disconnects a connection whose unsent data passes a cap. It is off by default because the 1000-bot run and play session needed to turn it on are not published yet. Try it on a test server before you rely on it.

## World generation, entities and inventories

Several worldgen results now match vanilla again. Cave carving keeps the delayed writes and also carves the vanilla dome, clears the rock before it places lava, and records hot springs only after the liquid check. Rivulets draw from the vanilla height bound, so the same seed picks the same sources. Tall grass is seeded from the handler that owns the column. The climate cache no longer shares entries between callers. A peek that stops at the Terrain stage runs both halves of it. Story structures can no longer spawn below bedrock or above the world height, which crashed the chunk generator on worlds with a reduced height.

Palette decoding for chunk data picks a faster path based on palette size, using in-register lookups instead of a gather for small palettes. Each worldgen stage is now timed separately, and the chunk-load watchdog resets when a worker makes progress.

Entities and inventories got these fixes:

- Entities no longer render dark when they stand on slabs, stairs, and other partially solid blocks.
- Creatures 24 blocks or more from a player no longer move in slow motion. Their physics runs every step again, and only their behaviors run on the distance stride.
- Slots emptied by a death drop are sent on the next flush.
- Microblock edits get their own grids, so two edits cannot interfere.
- A tamed elk's running animation stops when it stops moving.
- Body temperature timing returns to the vanilla values when its throttle is turned off.
- Throttled entities age for the time the throttle skipped.
- A physics activation for an entity that already despawned is skipped.
- Unchanged empty chests no longer rescan for perishables.
- Empty decor selection boxes are skipped in block intersection checks.
- The previous server's worldgen handlers are released at each boot.

## Updating

Existing settings carry over, and new settings take their defaults the first time the server loads its config. Two defaults change how a server behaves. Falling blocks near players are capped at 1000 live entities, and dropped items merge. If you prefer vanilla behavior, set `FallingBlocks.Enabled` or `ItemClump.Enabled` to `false` and restart. The send queue stays off until you turn on `Network.SendQueueEnabled`.

Developer tooling changed too. The repository now has the Atlas scenario suite, run with `make scenarios`, plus an SDK pin and an editor config. The scenario host no longer keeps every previous server in memory, which had grown it by a few hundred MB per test class.

Thanks to [tehtelev](https://github.com/tehtelev), [leroysquad](https://github.com/leroysquad), [Pixnop](https://github.com/Pixnop), [HanosThePlacid](https://github.com/HanosThePlacid), [rigeborod](https://github.com/rigeborod), and [Zaldaryon](https://github.com/Zaldaryon) for their contributions, and to everyone who tested the indev builds and reported problems from production servers.

## Full changelog

This list includes direct commits as well as pull requests. Follow-up commits are grouped under the PR that contains them.

- [Fixed: Enforce interaction reach with AntiAbuse disabled](https://github.com/StratumServer/Stratum/commit/f1062452834365226c8d4ce2ff98398418cf461a) by [@trevorftp](https://github.com/trevorftp)
- [Warn on an unpatched build; stop the smoke test hiding the Cecil resolver](https://github.com/StratumServer/Stratum/pull/299) by [@Zaldaryon](https://github.com/Zaldaryon)
- [Stack a role's name prefixes, ordered by Priority](https://github.com/StratumServer/Stratum/pull/298) by [@Zaldaryon](https://github.com/Zaldaryon)
- [Group friendly fire: /friendlyfire toggle (part of #277)](https://github.com/StratumServer/Stratum/pull/300) by [@Zaldaryon](https://github.com/Zaldaryon)
- [Repository hygiene: SDK pin, editorconfig, owners, license detection, docs index](https://github.com/StratumServer/Stratum/pull/308) by [@Pixnop](https://github.com/Pixnop)
- [Add the Atlas scenario suite (tests/StratumScenarios)](https://github.com/StratumServer/Stratum/pull/309) by [@Pixnop](https://github.com/Pixnop)
- [Fixed: Prevent inventories from being sent to every client](https://github.com/StratumServer/Stratum/pull/306) by [@trevorftp](https://github.com/trevorftp)
- [Fix vanished player privacy leaks](https://github.com/StratumServer/Stratum/pull/313) by [@Zaldaryon](https://github.com/Zaldaryon)
- [Fix storyloc structure spawning](https://github.com/StratumServer/Stratum/pull/305) by [@tehtelev](https://github.com/tehtelev)
- [More precise selection of AVX instructions based on palette size](https://github.com/StratumServer/Stratum/pull/337) by [@tehtelev](https://github.com/tehtelev)
- [Feat/335 group admin](https://github.com/StratumServer/Stratum/pull/340) by [@HanosThePlacid](https://github.com/HanosThePlacid)
- [Fix/307 Make two perf features and two packet guards configurable](https://github.com/StratumServer/Stratum/pull/339) by [@HanosThePlacid](https://github.com/HanosThePlacid)
- [Add in-game class change requests with staff approval (#278)](https://github.com/StratumServer/Stratum/pull/341) by [@HanosThePlacid](https://github.com/HanosThePlacid)
- [Bump Atlas to 0.15.1 and use its player command and chat APIs](https://github.com/StratumServer/Stratum/pull/343) by [@Pixnop](https://github.com/Pixnop)
- [Drop UDP packets with no client instead of killing the server](https://github.com/StratumServer/Stratum/pull/347) by [@leroysquad](https://github.com/leroysquad)
- [Skip empty entity tick-state removals](https://github.com/StratumServer/Stratum/pull/344) by [@leroysquad](https://github.com/leroysquad)
- [Stop mutating shared state in the AllOnlinePlayers cache](https://github.com/StratumServer/Stratum/pull/352) by [@Pixnop](https://github.com/Pixnop)
- [Queue a private position copy per random tick again](https://github.com/StratumServer/Stratum/pull/353) by [@Pixnop](https://github.com/Pixnop)
- [Add a reading contract to StratumEntityBehaviorTimings](https://github.com/StratumServer/Stratum/pull/365) by [@Pixnop](https://github.com/Pixnop)
- [Move the scenarios to Atlas 0.16.1 and read what the client holds](https://github.com/StratumServer/Stratum/pull/370) by [@Pixnop](https://github.com/Pixnop)
- [Safeguard block breaking and item damage against collectible behavior exceptions (#282)](https://github.com/StratumServer/Stratum/pull/336) by [@Zaldaryon](https://github.com/Zaldaryon)
- [Bound the per-connection send queue and flush it on shutdown](https://github.com/StratumServer/Stratum/pull/345) by [@leroysquad](https://github.com/leroysquad)
- [Stop disposing the shared SQLite chunk command on every read](https://github.com/StratumServer/Stratum/pull/349) by [@leroysquad](https://github.com/leroysquad)
- [Queue for the pre-generation command](https://github.com/StratumServer/Stratum/pull/381) by [@tehtelev](https://github.com/tehtelev)
- [Compress the server assets packet once](https://github.com/StratumServer/Stratum/pull/395) by [@leroysquad](https://github.com/leroysquad)
- [Cap character-inventory broadcasts during a dirty-slot flush](https://github.com/StratumServer/Stratum/pull/398) by [@leroysquad](https://github.com/leroysquad)
- [Cap dirty-block publishing on the gameplay thread](https://github.com/StratumServer/Stratum/pull/346) by [@leroysquad](https://github.com/leroysquad)
- [Stop UDP fallback sends from allocating a packet per position](https://github.com/StratumServer/Stratum/pull/397) by [@leroysquad](https://github.com/leroysquad)
- [Optimize GetBlockIntersectionBoxes: avoid empty decor selection boxes, keep chunk-face decors](https://github.com/StratumServer/Stratum/pull/377) by [@tehtelev](https://github.com/tehtelev)
- [Draw rivulets from the vanilla height bound](https://github.com/StratumServer/Stratum/pull/404) by [@leroysquad](https://github.com/leroysquad)
- [Restore vanilla cave carving around the delayed writes](https://github.com/StratumServer/Stratum/pull/406) by [@leroysquad](https://github.com/leroysquad)
- [Flush slots emptied by a death drop](https://github.com/StratumServer/Stratum/pull/408) by [@leroysquad](https://github.com/leroysquad)
- [Give each microblock edit its own grids](https://github.com/StratumServer/Stratum/pull/409) by [@leroysquad](https://github.com/leroysquad)
- [Skip a physics activation for an entity that already despawned](https://github.com/StratumServer/Stratum/pull/410) by [@leroysquad](https://github.com/leroysquad)
- [Restore vanilla body temperature timing when the throttle is off](https://github.com/StratumServer/Stratum/pull/413) by [@leroysquad](https://github.com/leroysquad)
- [Register the revive, restart, and clearitems privileges](https://github.com/StratumServer/Stratum/pull/414) by [@leroysquad](https://github.com/leroysquad)
- [Time each worldgen stage separately](https://github.com/StratumServer/Stratum/pull/400) by [@leroysquad](https://github.com/leroysquad)
- [Stop the climate cache from aliasing and sharing its entries](https://github.com/StratumServer/Stratum/pull/407) by [@leroysquad](https://github.com/leroysquad)
- [Age throttled entities for the time the throttle skipped](https://github.com/StratumServer/Stratum/pull/411) by [@leroysquad](https://github.com/leroysquad)
- [Merge byType values before resolving nested keys](https://github.com/StratumServer/Stratum/pull/412) by [@leroysquad](https://github.com/leroysquad)
- [Rotate character broadcasts and still send their slot packets](https://github.com/StratumServer/Stratum/pull/427) by [@leroysquad](https://github.com/leroysquad)
- [Leave a foreign bulk position packet intact](https://github.com/StratumServer/Stratum/pull/428) by [@leroysquad](https://github.com/leroysquad)
- [Keep one unsent position per client and entity](https://github.com/StratumServer/Stratum/pull/432) by [@leroysquad](https://github.com/leroysquad)
- [Skip an unchanged chest perish scan](https://github.com/StratumServer/Stratum/pull/434) by [@leroysquad](https://github.com/leroysquad)
- [Write a UDP packet length in one pass](https://github.com/StratumServer/Stratum/pull/437) by [@leroysquad](https://github.com/leroysquad)
- [Keep break bookkeeping when wear fails after the block is gone](https://github.com/StratumServer/Stratum/pull/415) by [@leroysquad](https://github.com/leroysquad)
- [Seed tall grass from the handler that owns the column](https://github.com/StratumServer/Stratum/pull/405) by [@leroysquad](https://github.com/leroysquad)
- [Never lower a chunk request untilPass](https://github.com/StratumServer/Stratum/pull/416) by [@leroysquad](https://github.com/leroysquad)
- [Reset the chunk-load watchdog on worker progress](https://github.com/StratumServer/Stratum/pull/417) by [@leroysquad](https://github.com/leroysquad)
- [Recognize sprint gait during idle animation cleanup](https://github.com/StratumServer/Stratum/pull/450) by [@rigeborod](https://github.com/rigeborod)
- [Fix black entity](https://github.com/StratumServer/Stratum/pull/449) by [@tehtelev](https://github.com/tehtelev)
- [perf: merge resting dropped items into larger piles](https://github.com/StratumServer/Stratum/pull/442) by [@Zaldaryon](https://github.com/Zaldaryon)
- [perf: resolve falls without an entity when no player is in range](https://github.com/StratumServer/Stratum/pull/444) by [@Zaldaryon](https://github.com/Zaldaryon)
- [feat: own one world rectangle and gate entities and columns at the edge](https://github.com/StratumServer/Stratum/pull/436) by [@leroysquad](https://github.com/leroysquad)
- [perf: cap live falling entities near players](https://github.com/StratumServer/Stratum/pull/445) by [@Zaldaryon](https://github.com/Zaldaryon)
- [fix: release the previous server's worldgen handlers at each boot](https://github.com/StratumServer/Stratum/pull/452) by [@HanosThePlacid](https://github.com/HanosThePlacid)
- [fix: keep far-entity physics on every tick](https://github.com/StratumServer/Stratum/pull/433) by [@leroysquad](https://github.com/leroysquad)
- [Include the late terrain stage in a Terrain peek](https://github.com/StratumServer/Stratum/pull/403) by [@leroysquad](https://github.com/leroysquad)
- [Scale the player occlusion raytrace with the online count](https://github.com/StratumServer/Stratum/pull/396) by [@leroysquad](https://github.com/leroysquad)
- [Fix for invisible inventory](https://github.com/StratumServer/Stratum/pull/456) by [@tehtelev](https://github.com/tehtelev)
- [fix: rebuild cached join packets when the world config changes](https://github.com/StratumServer/Stratum/pull/458) by [@HanosThePlacid](https://github.com/HanosThePlacid)
- [Fix serial Terrain fallback and Stratum warnings](https://github.com/StratumServer/Stratum/pull/475) by [@Zaldaryon](https://github.com/Zaldaryon)

**Full commit comparison:** [v1.22.7-stratum.2...v1.22.7-stratum.3](https://github.com/StratumServer/Stratum/compare/v1.22.7-stratum.2...v1.22.7-stratum.3)
