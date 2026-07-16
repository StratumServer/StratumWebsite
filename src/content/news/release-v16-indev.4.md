---

title: "Stratum v16-indev.4 is out"
date: 2026-07-16
author: "Trevor"
authorGithub: "trevorftp"
image: "/news/welcome.png"
summary: "A new indev build is available with install changes, performance work, compatibility fixes, and some much appreciated contributor work."

---
Stratum `v16-indev.4` is now available.

This is still an **indev build**, so please treat it like one: test it first, keep backups, and do not throw it onto an important server without knowing how to roll back. That said, this is a pretty meaningful update. It includes install/release cleanup, more performance work, a handful of compatibility fixes, and some nice quality-of-life additions for server owners.

<p>
  <a href="https://github.com/StratumServer/Stratum/releases/tag/v1.22.3-stratum.16-indev.4" class="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
    Download v16-indev.4
  </a>
</p>

## Thanks

A big thank you to everyone who worked on this release:

* [@Zaldaryon](https://github.com/Zaldaryon)
* [@tehtelev](https://github.com/tehtelev)
* [@trevorftp](https://github.com/trevorftp)

This release has a lot of small but important work in it, and it is genuinely nice seeing Stratum become less of a one-person pile of patches and more of an actual project people are helping shape.

## For server owners

The biggest thing to know is that Stratum's install/release flow has been reworked.

Release zips now contain the Stratum launcher and patched managed files, instead of packaging a full official Vintage Story server folder. The bootstrap scripts now resolve official archives through Anego's manifest and verify checksums as part of setup.

There are also a few fixes that should make real servers behave better:

* Sidecar configs now load correctly even when starting from a fresh `stratum.json`.
* Mod-owned Harmony patches can now be logged at startup, which should make compatibility issues easier to track down.
* Entity tick throttling now excludes configured mod domains, with `vsvillage` excluded by default.
* Scheduled chat announcements were added, giving servers a simple built-in way to rotate messages.

## Performance work

There is more optimization work in this build too.

Some of it is small allocation cleanup, some of it is worldgen-related, and some of it is focused on keeping server behavior smoother under heavier loads.

Notable pieces include:

* Improved multithreaded performance for chunk generation.
* Reduced allocations in container stack lookups.
* A faster prospecting pick ore-bearing check by avoiding unnecessary `HashSet` rebuilding.
* Microblock storage memory optimization.
* Fixes around Windows tick timing and fallback sleep behavior.

That kind of work is not always flashy, but it adds up. Stratum is very much still in the phase where a lot of wins come from removing the weird little costs Vanilla servers pay thousands of times.

## Developer and debugging notes

This release also adds better visibility around Harmony patching from other mods.

That does not block or police mods. It just gives server owners and contributors a clearer view of which mods are patching what, especially when a compatibility issue only shows up after Stratum changes the shape of a vanilla method.

For an indev project that touches a lot of game internals, this kind of boring diagnostic work matters a lot.

## Full changelog

### What's changed

* Pool container content-stacks lists instead of allocating per call by [@Zaldaryon](https://github.com/Zaldaryon) in [#154](https://github.com/StratumServer/Stratum/pull/154)
* Exclude mod-domain entities from tick throttling by [@Zaldaryon](https://github.com/Zaldaryon) in [#156](https://github.com/StratumServer/Stratum/pull/156)
* Fixed issue with Windows timer overshooting with `Sleep()` by [@trevorftp](https://github.com/trevorftp) in [#155](https://github.com/StratumServer/Stratum/pull/155)
* Add scheduled chat announcements by [@Zaldaryon](https://github.com/Zaldaryon) in [#157](https://github.com/StratumServer/Stratum/pull/157)
* Fix physics worker thread kept alive by [@trevorftp](https://github.com/trevorftp) in [#158](https://github.com/StratumServer/Stratum/pull/158)
* Load sidecar configs even on a fresh `stratum.json` by [@Zaldaryon](https://github.com/Zaldaryon) in [#159](https://github.com/StratumServer/Stratum/pull/159)
* Improved multithreaded performance of the chunk generator by [@tehtelev](https://github.com/tehtelev) in [#161](https://github.com/StratumServer/Stratum/pull/161)
* Skip HashSet rebuild in prospecting pick ore-bearing check by [@Zaldaryon](https://github.com/Zaldaryon) in [#160](https://github.com/StratumServer/Stratum/pull/160)
* Log mod-owned Harmony patches at startup by [@Zaldaryon](https://github.com/Zaldaryon) in [#162](https://github.com/StratumServer/Stratum/pull/162)
* Minor changes to `StratumPregenManager` by [@tehtelev](https://github.com/tehtelev) in [#163](https://github.com/StratumServer/Stratum/pull/163)
* Restore `BlockPatch.cs.patch` dropped in `dfe165b` by [@Zaldaryon](https://github.com/Zaldaryon) in [#164](https://github.com/StratumServer/Stratum/pull/164)
* Refactored and rewrote how Stratum installs by [@trevorftp](https://github.com/trevorftp) in [#165](https://github.com/StratumServer/Stratum/pull/165)
* Optimization of the microblock storage structure in memory by [@tehtelev](https://github.com/tehtelev) in [#166](https://github.com/StratumServer/Stratum/pull/166)

**Full changelog:** [v1.22.3-stratum.16-indev.3...v1.22.3-stratum.16-indev.4](https://github.com/StratumServer/Stratum/compare/v1.22.3-stratum.16-indev.3...v1.22.3-stratum.16-indev.4)
