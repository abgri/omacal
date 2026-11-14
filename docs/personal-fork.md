# OmaCal Brian: personal fork boundaries

This build is independent of the official OmaCal install. It deliberately does
not migrate, read, revoke, or overwrite the official app's authentication.

| Resource | Personal fork |
| --- | --- |
| Bundle / window name | OmaCal Brian |
| Bundle identifier | com.brianacklen.omacal |
| macOS state | ~/Library/Application Support/com.brianacklen.omacal |
| Google OAuth configuration | ~/.config/omacal-brian/config.toml |
| Keychain service | omacal-brian |
| Startup registration name | omacal-brian (explicit, not Cargo package name) |
| Linux runtime / state directory suffix | omacal-brian |
| Agent skill directory suffix | omacal-brian |

The Google config accepts `client_id` and `client_secret` from a Desktop OAuth
client owned by the user. Keep that file owner-readable and out of Git. Optional
build variables are `OMACAL_BRIAN_CLIENT_ID` and `OMACAL_BRIAN_CLIENT_SECRET`;
the publisher's original environment variable names are intentionally ignored.
Sign in anew in the custom app. Do not copy tokens from the official Keychain
service. CalDAV credentials also use the separate service.

## Updates

Daily upstream version checks remain read-only. The stock updater plugin and
manifest configuration are absent. The backend self-install gate is false on
every platform, including when called directly. A maintainer must review and
merge an upstream release, run the suites, build, and explicitly install the
custom build. Never replace it using the official Update action.

## Installation and rollback

Keep `/Applications/OmaCal.app` unchanged. Install the verified custom bundle
under a different filename, `OmaCal Brian.app`. Do not change Gatekeeper or strip
quarantine to get it to run. Stop for any required user security approval.

Before choosing startup behavior, avoid two live reminder schedulers: only one
app should be configured to launch automatically, and the official app's prior
choice must be recorded before an authorized change. The fork has independent
settings and needs its own explicit startup choice. Do not automatically copy
the official database, settings, login entry, or browser state.

Rollback means quitting the custom app and reopening the unchanged official
app. The custom data and Keychain entry remain separate and recoverable; do not
delete or revoke them during rollback. Changing the official app is not required.

The optional agent skill lives under `omacal-brian` and explicitly names the
custom executable, including its full bundle path. It must never fall back to
the official `omacal` command. No shell PATH or integration change is automatic.

## Approved contrast treatment

Rosé Pine Dawn preview approved with 13.2% timed-event tint, a quiet 1px inset
perimeter at 27.5% calendar color, and text mixed toward the theme's neutral ink
(27% calendar color). Grid rules are modestly stronger. Month bars use a 22%
calendar tint and the same subdued perimeter/text direction.

Green/teal calendar hues (90–185 degrees, excluding nearly neutral colors) use
neutral text and a 32% neutral perimeter, a subdued mixed-color spine, and 17%
timed fill. This provides shape/luminance cues without needing to distinguish
hues. Lavender and blue keep their approved treatment unchanged. RSVP dashed,
striped, struck-through, and pending cues remain separate.

This is a personalized visual preference, not a diagnosis or a claim of formal
accessibility conformance. The static demonstration uses synthetic events only.

## Maintenance checklist

- Review upstream releases and security advisories; never blindly install stock
  releases into this fork.
- Merge upstream changes into a review branch, retaining the isolation boundary.
- Run Rust tests/clippy, Svelte/TypeScript checks, and Chromium/WebKit UI tests.
- Validate local Google sign-in/sync, reminder behavior, startup, and contrast
  before promoting a build; keep a previous custom bundle for rollback.
- Keep OAuth configuration and tokens local, outside source and build artifacts.
- Do not migrate the official token or database into this fork.

## Local validation and build

From the repository root, with the official Rust toolchain on the command-local
PATH and dependencies installed in `ui`:

```sh
PATH="$HOME/.cargo/bin:$PATH" cargo test --workspace --no-fail-fast
PATH="$HOME/.cargo/bin:$PATH" cargo clippy --workspace --all-targets -- -D warnings
npm --prefix ui run check
PATH="$HOME/.cargo/bin:$PATH" ui/node_modules/.bin/tauri build --bundles app
```

Run the Tauri command from the repository root, not `ui` or `src-tauri`.
The resulting bundle stays under `target/release/bundle/macos/OmaCal Brian.app`
until separately installed. A local build without an Apple Developer identity
is not a notarized distributable; it must not be represented as one. Never set
OAuth embedding variables for the personal build; use the separate local config.
