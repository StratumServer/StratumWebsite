---
title: 'Stratum 1.22.5-stratum.1 is out'
date: 2026-07-26
author: 'Trevor'
authorGithub: 'trevorftp'
image: '/news/welcome.png'
summary: 'The first stable Stratum release for Vintage Story 1.22.5, with a new chunk-generation pipeline, networking fixes, lighting work, and everything tested through the v16 indev builds.'
---

Stratum `1.22.5-stratum.1` is now available.

This is the first stable release since `1.22.3-stratum.15`. It moves Stratum to Vintage Story 1.22.5 and rolls in the work tested across the v16 indev builds. A lot changed between those two releases, especially around chunk generation, lighting, networking, entity ticking, and how the launcher sets up a server.

<p>
  <a href="https://github.com/StratumServer/Stratum/releases/tag/v1.22.5-stratum.1" class="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
    Download 1.22.5-stratum.1
  </a>
</p>

## Before updating

Make a normal world backup before moving an existing server from 1.22.3 to 1.22.5. Clients will also need the matching Vintage Story version.

The launcher setup has changed since v15. New releases contain the Stratum launcher and patched managed files, then retrieve the matching official server files during setup. Existing generated configs are kept, and missing config files are created at startup.

## The short version

The largest change is the chunk-generation pipeline. Generation work now goes through a dispatcher and worker system with bounded parallel stages, near-player prioritization, better pause handling, and new timing data. Later generation stages can work on several columns at once where it is safe, while modded or Harmony-patched handlers can fall back to the safer path.

Networking also had a fairly large cleanup. TCP writes now go through one ordered send queue, deferred join packets keep their order, and several races around UDP fallback and pooled position packets were fixed. This replaces the experimental send path that caused join failures and inconsistent client state during early indev testing.

There is also a substantial lighting update, lower allocation pressure in several hot paths, more control over distant entity ticking, better join-spike handling, and a collection of fixes found while testing the 1.22.4 and 1.22.5 ports.

## Thanks

This release includes work from:

- [@Zaldaryon](https://github.com/Zaldaryon)
- [@tehtelev](https://github.com/tehtelev)
- [@Pixnop](https://github.com/Pixnop)
- [@xeljel](https://github.com/xeljel)
- [@trevorftp](https://github.com/trevorftp)

There are 142 commits between v15 and this release. Thank you to everyone who wrote code, reviewed changes, ran indev builds, sent timings, or reported something that did not look right.

## Full changelog

### Vintage Story 1.22.5

- Updated the patched server base from Vintage Story 1.22.3 through 1.22.4 to 1.22.5.
- Re-extracted the core patches against the newer server sources.
- Bootstrap now fails when a patch is rejected instead of continuing with a partly patched build.
- Updated the decompile target, version metadata, release workflow, and launcher setup for the new game version.

### Chunk generation

- Replaced the old generation scheduling path with a dispatcher and worker system.
- Added per-stage concurrency limits instead of treating every generation pass the same.
- Prioritized chunk columns wanted by nearby players before the general FIFO queue.
- Stopped repeatedly scanning the generation queue when no work can be dispatched.
- Split the Terrain pass internally without changing the public `EnumWorldGenPass` values used by mods.
- Added per-stage generation timings to show where world generation is actually spending time.
- Separated worldgen pause requests from worker acknowledgement tracking.
- Added stricter error handling to the chunk read pool instead of quietly returning null data.
- Fixed same-request double claims and boundary scans that could dispatch a column twice.
- Added safeguards around cross-column access in TerrainFeatures and Vegetation generators.
- Allowed PreDone and TerrainLate to process several columns at once after their generators were made safe for it.
- Added compatibility fallbacks for modded and Harmony-patched generation handlers.
- Fixed a mechanical-network freeze exposed by concurrent chunk loading.
- Increased the default pre-generation limits and improved how pregen work is distributed.
- Fixed radius pre-generation producing a square and added total generation time to its output.
- Fixed a fresh-bootstrap race affecting embedded patched files.

### Lighting

- Reworked the lighting system and reduced the amount of state kept per light cell.
- Replaced pooled block positions with the lighter `FastBlockPos` path.
- Added directional light absorption.
- Completed sunlight recalculation for enclosed spaces.
- Added side checks for chiseled blocks.
- Reused nearby-light arrays instead of allocating them repeatedly.
- Fixed the `MultiSourceBFS` path and removed unused lighting code.

### Networking and joins

- Replaced concurrent TCP writes with a single ordered send queue.
- Preserved packet order while join packets are deferred.
- Limited join processing per tick so a large wave of players does not land in one server tick.
- Fixed the prepared-byte flush bypass that could deadlock a joining client.
- Fixed client crashes and incomplete joins caused by the earlier experimental network flush path.
- Fixed UDP fallback for clients that skip the login token query.
- Fixed a race in pooled UDP position packets.
- Fixed the single-player and dummy-network pooling path.
- Pooled bulk entity-position packet arrays.
- Built the server assets packet synchronously during startup so joins cannot race its creation.
- Added TCP position-fallback counts to `/stratum performance`.
- Fixed packet skipping that could interfere with normal block entity and inventory interactions.
- Added an adaptive chunk-send radius controller for servers under load.

### Entity, physics, and tick work

- Reduced repeated per-tick lookups and allocations in entity tracking, spawning, physics client lists, and online-player lists.
- Added hysteresis to entity tracking so entities near a distance boundary do not constantly enter and leave tracking.
- Throttled position packets for distant entities and stopped stationary force-updates where possible.
- Limited physics activation queue draining per tick.
- Made extra physics workers background threads so they do not keep the process alive during shutdown.
- Added per-behavior timing attribution for player entities.
- Added configurable stride scheduling for `CollectEntities`.
- Excluded configured mod domains from distant entity tick throttling.
- Spread random block ticks across several passes to remove the recurring spike from doing them all together.
- Deduplicated chunk-unload candidates and cleaned up the unload scan.
- Added configurable recurring cleanup for old dropped-item entities.
- Reused container stack lists, mechanical-network lists, climate objects, and other hot-path buffers.
- Reduced memory used by microblock storage.
- Avoided rebuilding the prospecting pick's ore `HashSet` for every check.
- Enabled Server GC for dedicated builds.
- Improved the Windows timer path and fixed fallback waiting that could overshoot or spin a CPU core.

### Anticheat and server tools

- Added combat cheat checks and improved server-side block and entity reach validation.
- Expanded anticheat reporting so staff can review useful player summaries instead of raw debug-style output.
- Changed automatic anticheat kicking to opt-in. Violations are still reported when kicking is disabled.
- Added scheduled chat announcements.
- Added server statistics reporting and corrected the player-count reporting interval.
- Added optional startup logging for Harmony patches owned by mods.
- Added more performance counters for physics, networking, player behaviors, and generation stages.

### Launcher, config, and release setup

- Reworked how Stratum installs and updates its managed files.
- Replaced the old embedded overlay path with the patched-file overlay.
- Removed the bundled default `stratum.json`; current configs are generated at startup.
- Restored bootstrap preflight checks and moved the Anego manifest between tools through a file instead of a command-line argument.
- Improved patch extraction output so contributors can see which file is being handled.
- Added clearer build and setup notes for new contributors.
- Fixed sidecar configs being skipped when `stratum.json` was first created.
- Fixed initialized config lists growing with duplicate default entries after every restart.
- Updated release detection to understand minor Stratum revisions and ignore prerelease builds when checking for stable updates.

### Fixes

- Fixed stale inventory contents appearing after `/tp`, `/home`, `/spawn`, death, and other teleports.
- Fixed first-time players hitting an `EntityPlayer.SetName` null reference during join.
- Fixed class clothing and other player data arriving late or in the wrong join order.
- Fixed server assets, inventory state, and prepared packets racing player initialization.
- Fixed packet-order issues that could leave block entities, containers, fruit presses, and mod inventories in an incomplete interaction state.
- Fixed physics and network worker lifecycle problems found during indev testing.
- Fixed several corrupt patch headers and restored patches accidentally dropped during re-extraction.
- Fixed worldgen crashes and unsafe neighbor access uncovered by parallel generation.
- Improved compression, Ascii85 encoding, registry lookups, block-code parsing, tree generation, rock strata generation, and weighted map lookups.

**Full commit comparison:** [v1.22.3-stratum.15...v1.22.5-stratum.1](https://github.com/StratumServer/Stratum/compare/v1.22.3-stratum.15...v1.22.5-stratum.1)
