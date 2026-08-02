---
title: 'Stratum 1.22.6-stratum.1-indev.2 is out'
date: 2026-08-02
author: 'Trevor'
authorGithub: 'trevorftp'
image: '/news/mainmenu6.png'
summary: 'A larger indev update focused on worldgen mod compatibility, while keeping Stratum’s parallel generation and contributor optimizations intact.'
---

Stratum `1.22.6-stratum.1-indev.2` is now available.

This is a larger **indev build** focused on one of the roughest parts of running a performance fork: worldgen mods. Stratum changes how chunk generation is scheduled so the server can generate more than one column at a time, but mods quite reasonably expect the fields, handlers, and execution order they see on a normal Vintage Story server.

This update closes a large part of that gap without throwing away the performance work that made Stratum useful in the first place.

As always with an indev build, make a backup and test it before using it on an important world.

<p>
  <a href="https://github.com/StratumServer/Stratum/releases/tag/v1.22.6-stratum.1-indev.2" class="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
    Download 1.22.6-stratum.1-indev.2
  </a>
</p>

## The short version

Stratum's clean, unmodded path still uses its parallel worldgen stages, worker threads, pooled buffers, faster generation code, and the optimizations contributed across the project.

The difference is what happens when a mod enters that path. Vanilla generator fields and methods are visible again with their original names and shapes. Vanilla handlers remain visible while mods register and patch worldgen. When Stratum finds foreign handlers or Harmony patches on an unsafe stage, it keeps the vanilla handler layout and returns only that part of generation to serial scheduling.

Mods should not need a Stratum-specific version or a special compatibility option. The server adapts at runtime and keeps the optimized path when it is safe.

## Worldgen compatibility

Several vanilla generators previously stored their state in thread-local fields or registered wrapper handlers. That protected Stratum's concurrent generation, but it also changed details that mods can observe through reflection, Harmony, or the worldgen event lists.

The new worker-instance system gives each worldgen thread its own generator instead. This keeps state isolated while restoring the vanilla fields and methods mods expect to find.

The compatibility work covers the major Terrain and TerrainFeatures generators, including terrain, rock strata, caves, block layers, deposits, structures, ponds, vegetation, creatures, dungeons, terrain post-processing, and schematic placement.

There are also narrower fixes for cases that do not fit the worker model:

- Cave and chunk random fields are plain vanilla-shaped fields again.
- Block-layer random state is ready during setup, even when a mod prefix replaces the normal generation method.
- Vanilla worldgen handler identities stay visible until Stratum knows the optimized split is safe.
- Removed, duplicated, or reordered handlers are respected instead of silently being restored in a different order.
- Structure-provider callbacks keep vanilla's serial execution assumption without disabling the entire TerrainFeatures stage.
- The original `PathfinderTask` constructor is available again for already-compiled mods.

Most importantly, these are compatibility paths around the existing work. The stock Stratum path still keeps the contributor optimizations, including parallel generation, worker scheduling, pooled scratch data, faster block placement, and reduced allocation pressure.

## Testing

The new path has been tested with **Terra Prety**, **Rivers**, and **Watersheds** loaded together. All three generated successfully in the same world.

That is a useful test because these mods touch some of the most heavily changed parts of terrain generation. It is not a promise that every worldgen mod is fixed, so reports from other combinations are still very welcome. If a fallback activates, Stratum now reports what it disabled and why in the server log.

## Bootstrap cleanup

This build also fixes an irritating bootstrap failure where an incomplete cached server extraction could be mistaken for a usable one. The bootstrap scripts now check for the required server DLLs before reusing the cache, extract it again when files are missing, and stop with a clear error if the archive itself is incomplete.

The same checks are present in both the PowerShell and shell bootstrap scripts.

## Thanks

Thank you to everyone who reported worldgen failures, shared mod combinations, and helped narrow these problems down. A lot of this work also depends on the generation and scheduling improvements already contributed to Stratum. Keeping that work active while making the server friendlier to mods was the point of this update.

## Full changelog

### Worldgen

- Added one generator instance per worldgen worker thread.
- Restored vanilla generator fields, method signatures, accessibility, and handler identities where Stratum had changed them.
- Kept the optimized Terrain split for clean Stratum servers.
- Added a vanilla-topology fallback when foreign handlers or Harmony patches are detected.
- Returned Terrain to serial scheduling when the vanilla shared generator instances must remain active.
- Preserved mod handler removal, duplication, and registration order.
- Made cave, rock-strata, block-layer, terrain, structure, pond, vegetation, creature, deposit, dungeon, and post-processing state safe for concurrent generation.
- Serialized structure-provider callbacks without capping the full TerrainFeatures stage.
- Preserved existing generation pools, nested parallel work, faster placement paths, and allocation reductions.

### Compatibility

- Restored plain `caveRand` and `chunkRand` fields for reflection and Harmony users.
- Restored the original public `PathfinderTask` constructor for compiled mods.
- Expanded foreign-code detection to include Harmony patches deeper inside worldgen generator types.
- Added consistent log reporting when Stratum falls back to vanilla scheduling.

### Bootstrap

- Validated required server DLLs before reusing a cached extraction.
- Re-extracted incomplete server caches automatically.
- Failed clearly when a required DLL was still missing after extraction.
- Corrected Git whitespace handling for unified patch context.

**Full commit comparison:** [v1.22.6-stratum.1-indev.1...v1.22.6-stratum.1-indev.2](https://github.com/StratumServer/Stratum/compare/v1.22.6-stratum.1-indev.1...v1.22.6-stratum.1-indev.2)
