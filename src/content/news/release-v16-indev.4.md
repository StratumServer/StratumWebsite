---
title: "Stratum Indev Release (v16-indev.4)"
date: 2026-07-16
author: "Trevor"
authorGithub: "trevorftp"
image: "/news/welcome.png"
summary: "A new indev build is up for the testing! Hot off the press."
---

## What's Changed
* Pool container content-stacks lists instead of allocating per call by @Zaldaryon in https://github.com/StratumServer/Stratum/pull/154
* Exclude mod-domain entities from tick throttling by @Zaldaryon in https://github.com/StratumServer/Stratum/pull/156
* Fixed issue with windows timer overshooting with `Sleep()` by @trevorftp in https://github.com/StratumServer/Stratum/pull/155
* Add scheduled chat announcements by @Zaldaryon in https://github.com/StratumServer/Stratum/pull/157
* Fix physics worker thread kept alive by @trevorftp in https://github.com/StratumServer/Stratum/pull/158
* Load sidecar configs even on a fresh stratum.json by @Zaldaryon in https://github.com/StratumServer/Stratum/pull/159
* Improved multithreaded performance of the chunk generator  by @tehtelev in https://github.com/StratumServer/Stratum/pull/161
* Skip HashSet rebuild in prospecting pick ore-bearing check by @Zaldaryon in https://github.com/StratumServer/Stratum/pull/160
* Log mod-owned Harmony patches at startup by @Zaldaryon in https://github.com/StratumServer/Stratum/pull/162
* Minor changes to StratumPregenManager by @tehtelev in https://github.com/StratumServer/Stratum/pull/163
* Restore BlockPatch.cs.patch dropped in dfe165b by @Zaldaryon in https://github.com/StratumServer/Stratum/pull/164
* Refactored and rewrote how Stratum installs by @trevorftp in https://github.com/StratumServer/Stratum/pull/165
* Optimization of the microblock storage structure in memory by @tehtelev in https://github.com/StratumServer/Stratum/pull/166


**Full Changelog**: https://github.com/StratumServer/Stratum/compare/v1.22.3-stratum.16-indev.3...v1.22.3-stratum.16-indev.4
