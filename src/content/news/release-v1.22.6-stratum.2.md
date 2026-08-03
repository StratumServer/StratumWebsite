---
title: 'Stratum 1.22.6-stratum.2 is out'
date: 2026-08-03
author: 'Trevor'
authorGithub: 'trevorftp'
image: '/news/screenshot2.png'
summary: 'A focused Stratum update that restores support beams, catches the open-source server forks up to 1.22.5, and keeps stronger interaction protections where upstream does not cover them.'
---

Stratum `1.22.6-stratum.2` is now available.

This is a focused follow-up to the larger 1.22.6 release. It fixes support beam placement, updates Stratum's open-source Vintage Story sources to the latest public 1.22.5 revisions, and reconciles several security checks that Anego added upstream with the protections Stratum already carried.

The important part is that this is a source update, not a rollback. The worldgen compatibility work, concurrent generation, contributor optimizations, and the rest of the previous release remain in place.

<p>
  <a href="https://github.com/StratumServer/Stratum/releases/tag/v1.22.6-stratum.2" class="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
    Download 1.22.6-stratum.2
  </a>
</p>

## Before updating

Make a normal world backup before updating an existing server.

Support beams placed while the affected 1.22.6 Stratum build was running may already contain the wrong material data. The server cannot reliably infer which block was originally intended, so a visibly broken beam may need to be removed and placed again after updating.

## The short version

Vintage Story 1.22.6 changed how the server validates support beam placement. Stratum was still building that part of the server from the public 1.22.5 Survival source, where the client supplied a block ID as part of the placement packet. A 1.22.6 client no longer sends that value, so the old server path could read it as air and save an invalid beam.

Stratum now follows the 1.22.6 behavior. The server reads the beam from the player's real active slot, confirms the held item did not change before placement completes, and checks build access at both beam endpoints. The old packet field remains present for compatibility with existing clients and mods, but the server no longer trusts or uses it.

This update also moves the public API, Essentials, and Survival forks from their older 1.22.2 revisions to Anego's latest public 1.22.5 commits. Every Stratum patch was checked against those exact sources and the patches affected by upstream changes were rebased.

## Support beams

The support beam fix covers the full placement path rather than hiding the bad block ID after it reaches the world.

- The server derives the beam block from the player's active hotbar slot.
- The selected block and face must still be valid when placement begins.
- The held beam must match when placement finishes.
- Both the start and end positions must pass claim access checks.
- Unfinished placement state is discarded when a player disconnects.
- Stable-beam lookup now returns the nearest beam it found instead of only returning its distance.

Keeping the old packet member means this remains compatible with the existing 1.22 protocol shape. The security decision is entirely server-side, where it belongs.

## Following upstream security work

Anego added a shared access check to several interaction paths in the newer public sources. It covers player distance, claim access, and invalid interaction state for containers, traders, and writing surfaces. The teleporter path also gained its own creative-mode validation and audit logging.

Stratum had added some of the same checks while working from the older source revisions. Maintaining two versions of the same rule would make future updates harder and create opportunities for the checks to disagree, so this release removes the duplicated Stratum range and claim code and uses Anego's implementation instead.

Stratum still keeps the protections that go further than upstream:

- Container mutations require an inventory session that the server actually opened.
- Trader packets remain bound to the active dialogue and inventory session.
- Writing surface save and cancel packets remain bound to the player who started editing.
- Teleporter changes remain bound to a nearby server-opened configuration session, real source and target teleporters, privileges, claims, and bounded names.

Rejected inventory mutations still receive a rollback packet so the client does not remain visually out of sync with the server.

## Source and mod compatibility

The public Anego repositories currently stop at Vintage Story 1.22.5 even though the shipped game is 1.22.6. Stratum now uses those newest available sources and keeps only the small 1.22.6 behavior backports it actually needs.

The API interaction-range patch was removed entirely because the same API is now present upstream. Other overlapping security work was reduced to the extra Stratum session checks. This keeps the patched surface smaller and makes it less likely that a mod encounters two competing implementations of vanilla behavior.

No worldgen optimization or compatibility fallback was removed as part of this update.

## Thanks

Thank you to the players who reported the support beam problem and included enough detail to narrow it down to the 1.22.6 protocol change. Reports from existing worlds remain especially useful because saved data can expose version differences that a fresh test world does not.

## Full changelog

### Support beams

- Restored support beam placement with Vintage Story 1.22.6 clients.
- Derived the placed beam from the server-side active slot instead of a client block ID.
- Validated the held item when placement finishes.
- Checked claim access at both beam endpoints.
- Cleared unfinished placement state when a player disconnects.
- Fixed nearest stable beam selection.
- Kept the existing packet field for client and mod compatibility while ignoring it on the server.

### Upstream source update

- Updated the public API, Essentials, and Survival source pins to Anego's 1.22.5 revisions.
- Rebased all affected Stratum patches against the newer sources.
- Removed the API interaction-range patch now supplied upstream.
- Kept Stratum's reported game version at 1.22.6.

### Interaction security

- Adopted Anego's shared range, claim, and interaction validation.
- Removed duplicate Stratum checks where upstream now owns the same rule.
- Retained server-opened sessions for containers, traders, writing surfaces, and teleporters.
- Kept inventory rollback responses for rejected mutations.

**Full commit comparison:** [v1.22.6-stratum.1...v1.22.6-stratum.2](https://github.com/StratumServer/Stratum/compare/v1.22.6-stratum.1...v1.22.6-stratum.2)
