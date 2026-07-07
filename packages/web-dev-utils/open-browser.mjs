import { execFile } from 'node:child_process';
import open from 'open';

const DEV_BROWSER = process.env.BROWSER;

/**
 * AppleScript: if Google Chrome is already running, focus an existing tab whose
 * URL matches (reusing that window) instead of spawning a new one; only open a
 * new tab when none matches. Errors out when Chrome isn't running so the caller
 * can fall back to `open` (the user's default browser).
 *
 * @param {string} url
 */
const chromeReuseScript = (url) => `
  tell application "System Events"
    if not (exists application process "Google Chrome") then error "chrome-not-running"
  end tell
  tell application "Google Chrome"
    activate
    repeat with theWindow in windows
      set tabIndex to 0
      repeat with theTab in tabs of theWindow
        set tabIndex to tabIndex + 1
        if (URL of theTab) starts with "${url}" then
          set active tab index of theWindow to tabIndex
          set index of theWindow to 1
          return
        end if
      end repeat
    end repeat
    open location "${url}"
  end tell
`;

/**
 * Open the dev-server URL, reusing an already-open browser window/tab when possible.
 *
 * Relies only on the `open` package (plus macOS' built-in `osascript`):
 * - macOS + default browser → reuse/focus the matching Google Chrome tab; on any
 *   failure (Chrome not running, AppleScript error) fall back to `open`.
 * - `BROWSER=<app>` → open in that app; `BROWSER=none` → don't open anything.
 * - everything else → `open`, which reuses the running browser instance.
 *
 * @param {string} url
 */
export const openBrowser = (url) => {
  if (DEV_BROWSER === 'none') return;

  if (process.platform === 'darwin' && !DEV_BROWSER) {
    execFile('osascript', ['-e', chromeReuseScript(url)], (error) => {
      if (error) void open(url).catch(() => {});
    });
    return;
  }

  void open(url, DEV_BROWSER ? { app: { name: DEV_BROWSER } } : undefined).catch(() => {});
};
