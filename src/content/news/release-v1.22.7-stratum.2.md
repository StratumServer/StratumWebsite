---
title: 'Stratum 1.22.7-stratum.2 is out'
date: 2026-09-06
author: 'Trevor'
authorGithub: 'trevorftp'
image: '/news/screenshot4.png'
summary: 'Always-on griefing fixes, working boat controls, a repaired kit editor, and more performance work across terrain, caves, lighting, and server animations.'
---

Stratum `1.22.7-stratum.2` is now available.

This release closes several griefing exploits, gets boats and rafts responding to controls again, and fixes the kit editor. There is also another round of performance work in terrain generation, cave carving, lighting, and server animations.

For public server owners, the security fixes are the main reason to update. They apply even when Stratum's optional anticheat is disabled.

<p>
  <a href="https://github.com/StratumServer/Stratum/releases/tag/v1.22.7-stratum.2" class="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
    Download 1.22.7-stratum.2
  </a>
</p>

## Griefing fixes

Recent attacks on multiplayer servers exposed ways for a client to interfere with other players and bypass normal block-breaking checks. This update closes those paths at the server's packet handlers.

Players can no longer change another player's view distance. Invalid block action modes are rejected instead of falling through into a block break that skips the normal logging and abuse checks.

Following up with these also tightened several related interactions:

- Breaking block decorations now checks reach.
- Entity interaction distance includes height and dimension, while measuring reach against the target's hitbox.
- Excessive block-use progress values are rejected before they can make the server process a huge number of repeated steps.
- Only the player controlling a mount can submit its movement updates. A passenger cannot take control through movement packets.
- Rejected movement packets no longer change an entity's position before validation finishes.

These are ordinary server correctness checks, so you don't have to worry about enabling them.

## Boats and rafts respond again

Boats and rafts could stop responding to controls because the server's deferred shape loading left required shape data unavailable during entity initialization.

Entities that need server poses now request their shape before that first setup step. The same handling covers behaviors that start requiring poses later. This restores the information used by seats, attachment points, and selection boxes while keeping other entity shapes loaded on demand.

## The kit editor works, with a choice of what to save

Every `/kitedit` action could fail with an incomplete-command registration error before reaching Stratum's handler. That registration is fixed, along with argument validation and usage messages.

There is also a new per-kit snapshot scope. The default `all` scope captures the hotbar and character inventory, including worn equipment. The `hotbar` scope captures the hotbar and offhand without copying worn armor or clothing.

For an existing kit, use:

```text
/kitedit setscope starter_kit hotbar
/kitedit create starter_kit
```

The scope applies the next time you run `create`. Changing it does not remove items from a saved kit by itself. For a new kit, create it first, set its scope, then run `create` again to replace the captured items.

## Less repeated work during world generation

Terrain generation now shares a dedicated pool of workers for its inner column work and spends less time scanning landforms that contribute nothing to a column. Nested generation also restores the correct instance's buffers, and the vanilla fallback is protected from concurrent calls overwriting shared state. Mods that replace the vanilla terrain generator keep that fallback.

Cave carving batches block changes per affected subchunk and reuses its temporary buffers. The accompanying fixes preserve lava when a block layer is initialized and synchronize scheduled light updates between generation stages. The `/dev gencaves` command uses its own generator state and locked writes when changing chunks that are already loaded.

Terrain post-processing now reads from local chunk snapshots instead of repeatedly unpacking block palettes during its scan. It also checks missing chunk data and unusual column heights before indexing those snapshots.

Bulk lighting writes gained vectorized paths, and the existing AVX2 and AVX-512 block and light decoding paths do less branching.

The contributor benchmarks used 31,417 chunk columns and six generation threads. These are reductions in the profiled methods' execution time across that workload, not total pregen time:

| Work measured | Before | After | Reduction |
| --- | --- | --- | --- |
| [Cave carving](https://github.com/StratumServer/Stratum/pull/285) | 60.20 s | 55.83 s | 7.3% |
| [Terrain post-processing](https://github.com/StratumServer/Stratum/pull/289) | 5.49 s | 3.45 s | 37.2% |
| [Bulk lighting writes](https://github.com/StratumServer/Stratum/pull/296) | 6.02 s | 3.45 s | 42.7% |

Each row is the average of three runs reported in its PR. Results will vary with hardware and world settings.

## Server animations update when needed

The server previously rebuilt pose matrices every tick for entities that require server poses, even when nothing read them. It now marks them stale and refreshes them when a pose getter is called. Boats, ropes, and other systems using those getters still receive current poses.

This is enabled by default through `Performance.EntityTicking.LazyServerPoses`. A mod that reads server pose matrices directly instead of using the getters may need this setting changed to `false`.

The contributor's equivalence check compared 1,842 attachment-point reads over 6,000 frames and found no matrix differences. A separate one-player server comparison measured about 20% less player entity tick time on that machine. The [PR has the test details](https://github.com/StratumServer/Stratum/pull/291).

## Updating

The new exploit checks apply automatically, existing kits retain the default `all` scope, and lazy server poses are enabled by default.

Developer tooling also received kit-command regression checks and a corrected Linux smoke-test working directory so mod dependencies resolve from the server directory.

Thanks to [tehtelev](https://github.com/tehtelev), [Michael Andrzejewski](https://github.com/Michael-Andrzejewski), and [Zaldaryon](https://github.com/Zaldaryon) for their contributions, and to the server owners who reported the griefing attacks and gameplay problems.

## Full changelog

This list includes direct commits as well as pull requests. Follow-up commits are grouped under the PR that contains them.

- [GenTerra.stratumGenerate optimizations](https://github.com/StratumServer/Stratum/pull/279) by [@tehtelev](https://github.com/tehtelev).
- [Caves delayed writes](https://github.com/StratumServer/Stratum/pull/285) by [@tehtelev](https://github.com/tehtelev).
- [Fix GenTerra nested buffer restore not checking frame ownership](https://github.com/StratumServer/Stratum/pull/288) by [@tehtelev](https://github.com/tehtelev).
- [Fixed: Boats and rafts not responding to controls on servers](https://github.com/StratumServer/Stratum/commit/8919dae38b3949b47d868b43ca939cc986eba6d6) by [@trevorftp](https://github.com/trevorftp).
- [Skip server-side pose matrices until something reads them](https://github.com/StratumServer/Stratum/pull/291) by [@Michael-Andrzejewski](https://github.com/Michael-Andrzejewski).
- [Fix /kitedit registration error, add snapshot scope, and document kit commands](https://github.com/StratumServer/Stratum/pull/294) by [@Zaldaryon](https://github.com/Zaldaryon).
- [Snapshots for GenTerraPostProcess](https://github.com/StratumServer/Stratum/pull/289) by [@tehtelev](https://github.com/tehtelev).
- [Fixed: Prevent view distance griefing and invalid block break modes](https://github.com/StratumServer/Stratum/commit/5c3aab779836713c40fa8b1f3c7e88039216729a) by [@trevorftp](https://github.com/trevorftp).
- [Fixed: Close block interaction and mount movement exploits](https://github.com/StratumServer/Stratum/commit/34cc73edbf2a33e4f99dd58dfe48a52961fe8ef4) by [@trevorftp](https://github.com/trevorftp).
- [Vectorizing SetLightBulkUnsafe](https://github.com/StratumServer/Stratum/pull/296) by [@tehtelev](https://github.com/tehtelev).

**Full commit comparison:** [v1.22.7-stratum.1.1...v1.22.7-stratum.2](https://github.com/StratumServer/Stratum/compare/v1.22.7-stratum.1.1...v1.22.7-stratum.2)
