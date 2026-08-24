---
title: 'Stratum 1.22.7-stratum.1.1 is out'
date: 2026-08-24
author: 'Trevor'
authorGithub: 'trevorftp'
image: '/news/serverlist.png'
summary: 'A focused Stratum patch that adds public server registration with signed requests and persistent server tokens.'
---

Stratum `1.22.7-stratum.1.1` is now available.

This is a small follow-up to the main 1.22.7 release. It updates Stratum's master server registration so public servers can be claimed from the Vintage Story server list as the new signed registration system rolls out.

There are no gameplay changes in this patch. Everything from `1.22.7-stratum.1` remains in place.

<p>
  <a href="https://github.com/StratumServer/Stratum/releases/tag/v1.22.7-stratum.1.1" class="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15">
    Download 1.22.7-stratum.1.1
  </a>
</p>

## Before updating

Make a normal world backup before updating an existing server.

No manual token setup is required. After a successful registration, the master server returns a server token and Stratum saves it in `serverconfig.json`. Existing configurations continue to work, and servers that are not publicly advertised are unaffected.

## Signed server registration

Public server registration now includes a signed proof that belongs to the server making the request. Stratum creates a P-256 server identity, signs the exact registration payload sent to the master server, and publishes the matching public key through the server query protocol.

The master server still creates the server token. Stratum stores the returned token and sends it with later registrations so the same listing can be updated across restarts.

Registration errors no longer print the request body to the server log, which keeps the saved token out of error output.

To claim your server head over to https://servers.vintagestory.at/my-servers and press 'Claim Existing Server' this is where you will paste in your `ServerToken` that lives in `serverconfig.json`. Do not share this token with ANYBODY else.

## Lightweight server-list queries

Server-list probes are answered before a normal player connection is created. A query receives the prepared response containing the server version and registration public key, then leaves without entering the login path.

This also means a server-list check does not wake a server that is waiting in standby.

## Full changelog

### Server registration

- Published the registration public key through server query.
- Saved the returned `ServerToken` in `serverconfig.json` for later registrations.
- Kept registration payloads out of error logs.

### Networking

- Answered server-list queries before creating a player connection.
- Prevented server-list probes from waking standby servers.

**Full commit comparison:** [v1.22.7-stratum.1...v1.22.7-stratum.1.1](https://github.com/StratumServer/Stratum/compare/v1.22.7-stratum.1...v1.22.7-stratum.1.1)
