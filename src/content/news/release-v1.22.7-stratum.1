---
title: 'Stratum 1.22.7-stratum.1 is out'
date: 2026-08-22
author: 'Trevor'
authorGithub: 'trevorftp'
image: '/news/screenshot3.png'
summary: 'Stratum moves to Vintage Story 1.22.7 with live kits and role editing, new combat and mob controls, ARM64 builds, and a pile of world, lighting, and performance fixes.'
---

Stratum `1.22.7-stratum.1` is now available.

This release grew quite a bit. Along with the move to Vintage Story 1.22.7, there are new tools for running events and public servers, better control over combat and mobs, a proper kit editor, live role changes, stronger anticheat responses, Linux ARM64 builds, and plenty of fixes behind the scenes.

There is a lot here, so grab a drink and let's get into it.

<p>
  <a href="https://github.com/StratumServer/Stratum/releases/tag/v1.22.7-stratum.1" class="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
    Download 1.22.7-stratum.1
  </a>
</p>

## Before updating

Make a normal world backup before updating an existing server. This release is built for Vintage Story 1.22.7, so update the game files used by the server as well.

Several of the new systems are configurable or opt-in. Existing servers will not suddenly start punishing combat loggers or applying the new repeat-offender anticheat actions without being configured to do so. It is still worth reviewing the generated Stratum config after the first start, especially if you run custom roles or unusual combat rules.

## The short version

- Server owners can create kits in game, edit roles without restarting, schedule restarts, clear dropped items, control chat channels, tune mob spawning, and give players extra lives.
- New combat options cover cooperative PvE protection and configurable combat logging penalties.
- `/wilderness` can find a safe, unclaimed place for you to start your adventure!
- Vanished staff can hide from other vanished staff and no longer leak their location through map pins.
- Repeat anticheat offenders can move through configurable punishments instead of every violation ending the same way.
- Worldgen, lighting, microblocks, pregen, chunk data, and background task scheduling all received fixes or performance work.
- Stratum now follows Vintage Story 1.22.7 and ships a Linux ARM64 build.

## More tools for running a server

The new kit system lets staff build a kit from their own inventory and save it without writing item stacks by hand. Kits can be listed, previewed, given to players, limited by role, placed on cooldown, restricted to one use per life, or handed out after respawn. They live in their own `stratum-kits.json` file, so they are easy to back up or move between servers.

Roles can now be changed while the server is running. That includes editing permissions and applying the updated role without a restart, which should make it much less painful to fix a staff permission during an event.

There are several smaller additions that should also save some console juggling:

- `/restart` supports scheduled warnings and can be cancelled before the timer finishes.
- `/clearitems` cleans dropped items from the world, warns players first, and can also be cancelled.
- `/chattoggle` can turn global or group chat on and off at runtime, with a configurable staff bypass.
- Mob spawning can be toggled by category, scaled, and cleaned up while the server is running.
- The lives system can show, add, set, or remove bonus lives for players and groups, then use those lives during respawn.

## Combat rules that fit the server

Two different combat systems landed in this release because not every server wants the same rules.

Cooperative combat protection gives players a short configurable window where another player cannot damage a creature they are already fighting. It only affects creature combat, not PvP, and it can be changed or reloaded while the server is running.

Combat logging is separate and opt-in. A tagged player who leaves during PvP can be killed immediately, killed when they rejoin, or only logged for staff review. The tag duration, penalty, warnings, and staff notifications are configurable, and staff have commands to inspect or manage active tags.

The anticheat also gained an optional punishment ladder for repeat offenders. Servers can move through actions such as dropping or wiping inventory, freezing, jailing, and timed bans instead of treating every repeat violation as the same event. The state is saved across restarts and the existing anticheat commands now show the useful punishment information.

None of those heavier responses are forced on existing servers. They are there for owners who want them.

## A better way into the wilderness

`/wilderness` finds a random, safe, unclaimed location and moves the player there after an optional warmup. Moving or taking damage can cancel the teleport, and the search runs asynchronously so a large search area does not hold up the server tick.

The first implementation also received follow-up fixes for claim-region checks and the minimum search radius after terrain height is resolved. In other words, it should not quietly choose a claimed spot or pull the player back toward spawn just because the surface was higher or lower than expected.

## Vanish stays vanished

Vanish had two information leaks that were easy to miss during normal use. Other vanished staff could still see a hidden staff member, and player map pins could reveal someone who was otherwise invisible.

Both are addressed now. Staff can use the new `hideothers` vanish option when they need to be hidden from other vanished users too, and vanished players are filtered from the map tracking path as well as normal entity tracking.

## Mod and vanilla compatibility

Stratum's faster terrain generator is useful until a mod intentionally patches the vanilla generator. The server now detects that case and sends generation through the vanilla path when `GenTerra.generate` has been replaced or Harmony-patched. Unmodified servers keep the optimized path, while worldgen mods get the method they expected to change.

Several other compatibility fixes are included:

- The `Roles` and `DefaultRoleCode` values remain in `serverconfig.json` for vanilla compatibility.
- Stale boat selection-box indices are rejected instead of throwing while entering, leaving, or interacting with boats.
- Chiseled and other microblock hybrids can be broken normally without the block guard treating the action as an exploit.
- The first real block guard violation is logged again instead of disappearing before the counter starts.
- Linux packages restore the OpenTK graphics and Ogg/Vorbis references needed by mods that load those assemblies.

## Worlds, chunks, and lighting

Lighting received both correctness and performance work. Sunlight crossing a chunk boundary now uses the neighboring chunk's real Z coordinate instead of accidentally reusing its X coordinate. That matters most around slabs, stairs, chisels, and other partially solid blocks sitting on a chunk seam.

Lighting reads and writes are also batched more carefully, with a follow-up fix to avoid creating a large garbage collection problem in the chunk illuminator. Rock strata generation received similar batching work, and the structure generator now releases thread-local schematic state after its postpass instead of holding those caches for the lifetime of a worker thread.

Pregen now queues chunks in small 3x3 batches instead of feeding a large area into generation at once. Block entity positional listeners are staggered at startup as well, avoiding a crowd of listeners all waking up on the same tick.

There are also faster initial chunk fills, faster microblock processing, AVX-assisted chunk data operations where the CPU supports them, and a handful of smaller chunk layer cleanups. The background ready-task scheduler was tightened up to remove short-lived allocations and fix queue races found during that work.

## Linux ARM64 and release packaging

Linux ARM64 is now a supported release target. The package uses the official game archive with the matching ARM64 native libraries layered in, with the native files pinned and checksum-verified during packaging.

This should make Stratum much easier to run on ARM servers and boards without asking owners to assemble their own mixed package. The existing Windows and Linux x64 releases are still available as usual.

## Thanks

This release includes work from several contributors across commands, worldgen, lighting, chunk processing, compatibility, and testing. Thank you to Zaldaryon, tehtelev, LoveTheLordYourGod, everyone who tested the indev builds, and the server owners who kept filing useful reports instead of settling for "it broke."

That last part genuinely helps. A location, a log, and a repeatable set of steps can turn a strange server problem into a fix everyone gets.

## Full changelog

### New server features

- Added live kit creation and editing, including role limits, cooldowns, respawn kits, one-per-life kits, previews, and direct kit giving.
- Added runtime role permission editing and role reapplication without a restart.
- Added `/restart` with scheduled warnings and cancellation.
- Added `/clearitems` with warnings, cancellation, and safer cleanup handling.
- Added runtime global and group chat toggles with a configurable staff bypass.
- Added `/wilderness` with safe asynchronous location searches, warmups, cancellation, claim checks, and configurable access.
- Added player lives management with player and group targets plus respawn integration.
- Added runtime mob category toggles, spawn scaling, and loaded-creature cleanup.

### Combat, staff, and anticheat

- Added cooperative PvE combat protection without changing PvP behavior.
- Added configurable PvP combat logging tags, staff alerts, status commands, and several penalty modes.
- Added an opt-in repeat-offender anticheat punishment ladder with persistent state.
- Added inventory drop or wipe, freeze, jail, and timed-ban punishment actions.
- Added the option for vanished staff to hide from other vanished staff.
- Hid vanished player pins from map tracking.
- Removed duplicate combat log system instances.

### Compatibility and fixes

- Updated Stratum to Vintage Story 1.22.7.
- Detected patched terrain generators and restored the vanilla generation path for affected mods.
- Preserved vanilla role fields in `serverconfig.json`.
- Guarded stale boat selection-box indices across boat interactions and inventories.
- Allowed valid microblock hybrid breaks through the block guard.
- Restored first-violation block guard reporting.
- Corrected wilderness claim-region and minimum-radius checks.
- Fixed cooperative combat initialization after configuration is populated.
- Restored Linux OpenTK, Ogg, and Vorbis references used by some mods.

### World and performance work

- Fixed sunlight propagation coordinates across chunk boundaries.
- Batched lighting and rock-strata chunk reads and writes.
- Fixed excess chunk illuminator garbage collection introduced during the batching work.
- Released structure-generation thread-local caches after post-processing.
- Queued pregen work in 3x3 chunk batches.
- Staggered block entity positional listener startup.
- Improved initial chunk filling and microblock processing.
- Added AVX-assisted chunk data operations with compatible fallbacks.
- Reduced allocations and fixed correctness races in ready-task scheduling.
- Cleaned up smaller chunk data layer paths found during the same work.

### Platforms and builds

- Added a checksum-pinned Linux ARM64 release.
- Kept the existing Windows x64 and Linux x64 packages.
- Reduced decompiler warning noise in release builds so real build warnings are easier to spot.

**Full commit comparison:** [v1.22.6-stratum.2...v1.22.7-stratum.1](https://github.com/StratumServer/Stratum/compare/v1.22.6-stratum.2...v1.22.7-stratum.1)
