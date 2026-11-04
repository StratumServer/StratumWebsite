---
title: 'Stratum 1.22.7-stratum.3-indev.1 is out'
date: 2026-11-04
author: 'Trevor'
authorGithub: 'trevorftp'
image: '/news/welcome.png'
summary: 'An indev update focused on inventory synchronization, falling entity optimizations, network send queue bounds, and server-side stability under load.'
---

Stratum `1.22.7-stratum.3-indev.1` is now available.

This is an **indev build** containing performance work, network queue limits, and several stability fixes reported on busy servers. It includes a fix for invisible inventories, single-pass asset packet compression, and falling entity optimizations.

As with any indev build, make a backup of your world and test the build before deploying it to an active server.

<p>
  <a href="https://github.com/StratumServer/Stratum/releases/tag/v1.22.7-stratum.3-indev.1" class="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
    Download 1.22.7-stratum.3-indev.1
  </a>
</p>

## Highlights

### Inventory and entity fixes

This build fixes a synchronization issue that caused player inventories to appear invisible under specific slot update orders.

A rendering issue where entity models could turn entirely black due to incomplete texture packet handling is also resolved. In addition, when restarting the server, worldgen handlers from the previous server run are released properly.

### Performance and falling entities

Dropped items resting on the ground now merge into larger piles to prevent loose entity proliferation in busy areas.

Falling blocks such as sand and gravel no longer instantiate heavy entities when resolving falls far from any player. Near players, the server now caps concurrent live falling entities to protect tick times during cave-ins and collapses.

Intersection calculations in `GetBlockIntersectionBoxes` now skip empty decor selection boxes while keeping chunk-face decors intact.

### Networking and queue management

Initial client handshakes now compress the server asset packet once instead of compressing it again for every connecting client.

Per-connection network send queues now enforce bounds, and the server flushes pending packets cleanly during shutdown. Player character slot broadcasts are capped and rotated during dirty-slot flushes to prevent network congestion.

## Thanks

Thank you to everyone testing indev builds and reporting issues from production servers. Special thanks to [@tehtelev](https://github.com/tehtelev), [@leroysquad](https://github.com/leroysquad), [@HanosThePlacid](https://github.com/HanosThePlacid), [@rigeborod](https://github.com/rigeborod), and [@Zaldaryon](https://github.com/Zaldaryon) for their contributions to this release.

## Full changelog

- Fixed invisible inventory synchronization issues.
- Fixed black entity model rendering caused by incomplete packet handling.
- Released previous server worldgen handlers on server restart.
- Reset the chunk-load watchdog based on worker thread progress.
- Merged resting ground items into larger stacks to reduce entity count.
- Resolved block falls without instantiating entities when no player is in range.
- Capped active falling entities near players.
- Optimized `GetBlockIntersectionBoxes` decor collision checks.
- Compressed server asset packets once per build instead of per connecting client.
- Bounded per-connection network send queues and flushed them on shutdown.
- Capped and rotated character inventory broadcasts during dirty-slot flushes.
- Stopped disposing shared SQLite chunk commands on each read.
- Added queue support for the pre-generation command.

**Full commit comparison:** [v1.22.7-stratum.2-indev.2...v1.22.7-stratum.3-indev.1](https://github.com/StratumServer/Stratum/compare/v1.22.7-stratum.2-indev.2...v1.22.7-stratum.3-indev.1)
