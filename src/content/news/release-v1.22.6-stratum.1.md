---
title: 'Stratum 1.22.6-stratum.1 is out'
date: 2026-08-02
author: 'Trevor'
authorGithub: 'trevorftp'
image: '/news/screenshot1.png'
summary: 'The stable Stratum release for Vintage Story 1.22.6, with faster world generation, much wider mod compatibility, concurrency fixes, and cleaner server configuration.'
---

Stratum `1.22.6-stratum.1` is now available.

This release moves Stratum to Vintage Story 1.22.6 and brings the worldgen work from the recent indev builds into a stable release. The main goal this time was to keep Stratum's parallel chunk generation and contributor optimizations active on an unmodded server, while making the same code far less likely to break worldgen mods.

It also includes more worldgen concurrency work, fixes for several races found while pushing those stages harder, lighting fixes, a cleaner config layout, better update notices for staff, and a bootstrap fix for incomplete server caches.

<p>
  <a href="https://github.com/StratumServer/Stratum/releases/tag/v1.22.6-stratum.1" class="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
    Download 1.22.6-stratum.1
  </a>
</p>

## Before updating

Make a normal world backup and update clients to Vintage Story 1.22.6 before moving an existing server over.

Stratum's config is now on version 3. Existing version 1 and version 2 configs migrate automatically. Chat rate limits, role prefixes, nametags, theme settings, rules, links, and MOTD text are moved into the new layout while keeping their current values.

## The short version

Terrain and TerrainFeatures can now generate several columns at once after a much wider audit of the code they call. The work closes races in schematic placement, chunk database reads, map chunks, region caching, generator scratch state, and dispatcher claims. Structure placement keeps the serial behavior it needs, without forcing the rest of TerrainFeatures back to one column at a time.

The larger change is how this behaves around mods. Stratum now keeps vanilla generator fields, methods, constructors, and handler identities visible where its earlier worldgen changes had reshaped them. Each worker thread gets its own generator instance, so the stock path remains safe and fast without replacing vanilla fields with thread-local ones that reflection and Harmony patches cannot find.

When foreign handlers or patches make a parallel stage unsafe, Stratum returns only that part of generation to the vanilla layout and serial schedule. It reports the fallback in the log, and the rest of the optimized pipeline stays active.

## Worldgen performance and correctness

This release finishes the first large pass over Terrain and TerrainFeatures concurrency.

- Terrain and TerrainFeatures can process several columns at once where their generators are safe.
- `GenTerra` now keeps its per-column state isolated without losing its useful internal parallel work.
- The dispatcher cannot claim the same request twice, and it releases both claims if the neighbour gate throws.
- Schematic unpacking, remap data, block entities, chunk database reads, and shared dungeon state are protected from concurrent corruption.
- Region cache invalidation and neighbourhood residency now stay valid for the full worldgen claim.
- Structure placement is serialized to prevent overlapping ruins while the surrounding stage remains concurrent.
- Pond generation handles missing neighbour chunks without crashing.
- Darkened foliage and low-absorption lighting behavior were fixed.

These fixes keep the performance work in place. They do not remove the worker dispatcher, stage concurrency, pooled scratch data, faster placement paths, or the allocation reductions contributed across the project.

## Worldgen mod compatibility

Stratum's rule is that mods should not need a Stratum-specific build. The server has to adapt when it changes a vanilla path.

This release restores the vanilla shape of the worldgen code Stratum had changed most heavily. Cave and chunk random fields are plain fields again, the original `PathfinderTask` constructor is available to compiled mods, and vanilla handlers stay visible until the server knows an optimized split is safe. Mod handler removal, duplication, and registration order are kept intact.

The compatibility work covers terrain, rock strata, caves, block layers, deposits, structures, ponds, vegetation, creatures, dungeons, terrain post-processing, and schematic placement.

The new path was tested with **Terra Prety**, **Rivers**, and **Watersheds** loaded together. They generated successfully in the same world. That is a good result for three mods touching the most changed part of Stratum, though more combinations are always welcome.

## Server-owner changes

Configuration is less crowded in this release. Appearance settings now own the theme, role prefixes, and nametags. Server information owns the rules, Discord and website links, and MOTD. Chat keeps connection messages and rate limiting. Existing settings are migrated instead of reset.

The update checker now repeats its check on a configurable interval and tells online staff with the server-control privilege when a newer stable release is available. Server statistics also use the game's online-player list for the public player count, with admitted clients retained as diagnostic data.

Bootstrap now checks that a cached server extraction actually contains the required DLLs. An incomplete cache is extracted again, and setup stops with a clear error if the archive still does not contain what the build needs.

## Thanks

This release includes work from:

- [@Zaldaryon](https://github.com/Zaldaryon)
- [@tehtelev](https://github.com/tehtelev)
- [@trevorftp](https://github.com/trevorftp)

Thank you as well to everyone who tested the indev builds and tried real worldgen mod combinations. This work depended on those reports, especially the cases where a clean server worked and a familiar mod exposed a vanilla assumption Stratum had changed.

## Full changelog

### Vintage Story 1.22.6

- Updated the server base, launcher metadata, map-region version, and assembly version for Vintage Story 1.22.6.
- Prepared the first stable Stratum revision for the new game version.

### Worldgen concurrency

- Made `GenTerra` safe across concurrent columns and enabled the Terrain stage concurrency cap.
- Enabled concurrent TerrainFeatures generation after auditing every generator in the stage.
- Fixed oversubscription without removing `GenTerra`'s useful internal parallel work.
- Prevented duplicate dispatcher claims and fixed a claim leak when the neighbour gate throws.
- Protected schematic unpacking, schematic remap maps, chunk database reads, block entity collections, and shared dungeon state.
- Kept neighbourhood chunks resident while a stage claim is active.
- Fixed map-region cache invalidation during generation.
- Serialized structure placement to prevent overlapping ruins.
- Guarded pond searches against unavailable neighbour chunks.

### Mod compatibility

- Added one generator instance per worldgen worker thread.
- Restored vanilla fields, methods, accessibility, constructors, and handler identities where Stratum had changed them.
- Kept vanilla worldgen topology until the optimized Terrain split is known to be safe.
- Preserved mod handler removal, duplication, registration order, and Harmony-patched entry points.
- Returned an unsafe stage to vanilla serial scheduling when foreign code is detected.
- Serialized foreign structure-provider callbacks without disabling the whole TerrainFeatures stage.
- Added consistent fallback reporting to the server log.

### Lighting

- Fixed darkened foliage.
- Fixed low-absorption blocks failing to receive absorption.
- Improved the light absorption calculation.

### Config and server tools

- Added config version 3 with automatic migration from version 1 and version 2.
- Grouped theme, role-prefix, and nametag settings under Appearance.
- Grouped rules, links, and MOTD settings under ServerInfo.
- Preserved active chat rate limits while moving them into the new layout.
- Added periodic stable-release checks and in-game notices for server-control staff.
- Corrected public server-stat player counts.
- Rejected incomplete cached server archives during bootstrap.

**Full commit comparison:** [v1.22.5-stratum.1...v1.22.6-stratum.1](https://github.com/StratumServer/Stratum/compare/v1.22.5-stratum.1...v1.22.6-stratum.1)
