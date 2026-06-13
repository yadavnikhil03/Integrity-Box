> Release Date: 13/06/2026

## THIS UPDATE IS MANDATORY
#### Good luck, Remember me in your prayers 🤲🏻

####  [🏆 Click here to support my work](https://meowdump.github.io/)

### Miscellaneous 
- Added per-app spoofing for granular device fingerprint control

- Fixed ADB offline bug

- Integrated debug logging toggle for verbose module diagnostics

- Fixed zygote crash during module initialization on certain ROMs

- Improved compatibility with Android 17 Beta 4 runtime changes

- Updated cleanup script with broader artifact removal

- Refined fade transition timings across all WebUI screens

- Replaced legacy status indicators with updated dashboard readouts

- Removed unused legacy code paths and deprecated functions

- Removed standalone cleanup interface (functionality merged into core)

- Updated local fingerprint WebUI with refreshed layout

- Replaced legacy fingerprint picker with new selector

- Updated Hide My Apps configuration template

- Added Hide Custom ROM backend toggle

- Added Hide SUS Files backend toggle

- Added Beta/Nightly channel support for over-the-air updates

- Fixed ROM spoofing disabler not persisting after reboot

- Added volume key navigation for flag selection

### prop.sh (backend)
- The following ROMs will now be spoofed via BeastMode: LineageOS, Evolution X, crDroid, ArrowOS, MistOS, Axion, Infinity, PixelOS, RisingOS, Lunaris, Halcyon, HavocOS, AlphaDroid, Avium, Bliss, Calyx, DerpFest, GrapheneOS, LMO Droid, Lumine, MatrixX, Sakura, Statix, SuperiorOS, Clover, Witaqua, YAAP, and Mica.

### post-fs-data.sh :

- Bumped the security patch to 01 June 2026

- Added `persist.sys.pihooks.enabled_features` to the GMS toggle logic.

- Switched all GMS prop calls from `set_resetprop` to plain `setprop` in both the enable and disable blocks.

- Removed `shamiko` boot script entirely. the whole Shamiko boot script block is gone, along with its entry in the permissions loop.

### service.sh :

- `PIF` variable now points to `/data/adb/modules/playintegrityfix` and `PROP` is built from it instead of the hardcoded full path.

- Removed `autopif.log` (`LOG3`) declaration 

- `sys.usb.adb.disabled` and `service.adb.root` props are gone. The inline resetprop logic for them got stripped out entirely, and the remaining USB/ADB props lost their quotes around the prop names.

- `sed` patterns in the spoof blocks got fixed `${PROP1}`, `${PROP2}`, `${PROP3}` instead of the broken `$LINE` and bare `$PROP2` / `$PROP3` that were in the old code.

### action.sh

- `P` variable switched from `custom.pif.prop` to `pixel.txt`. That's the main config file reference now.

-`PATCH_DATE` bumped from `2026-05-01` to `2026-06-01`.

- Simplified `log_step "CREATED"` message from `Dumped PIF config to $OUTJSON` to `PIF.json to $OUTJSON`.

- Flipped execution order. Fingerprint spoofing now runs before migration instead of after.

- `sh "$UPDATE"` lost its `|| { sleep 10; exit 1; }` error handler. If the update script fails now, the main script keeps going instead of bailing out.

- `osm0sis.sh` call lost the `>/dev/null 2>&1` redirect. Output now goes to stdout instead of being swallowed.

- Root cleanup `find` pattern changed `*_action_log_2025*` to `*_action_log_2026*`. Now matches 2026 logs alongside the install logs.

- `echo` before the `RUN STEPS` comment block got moved earlier, right after the update script call instead of before the mode flags section.

### migrate.sh

- Script name and all references flipped from `custom.pif.prop` to `pixel.txt`. The help text, default file detection, and output path all point to `pixel.txt` now.

- Default `SECURITY_PATCH` bumped from `2026-05-01` to `2026-06-01`.

- `spoofProvider` default flipped from `0` to `1` when Google Wallet is NOT installed.

- `ADVSETTINGS` gained two new entries: `verboseLogs` and `spoofApps`. Both default to `0` and `1` respectively. Every profile block now explicitly sets these alongside the existing settings.

- File extension check in the `keep_advanced` fallback switched from `*.prop` to `*.txt`.

- New block at the top preserves `Released On:` and `Estimated Expiry:` comment lines from the input file, then appends them back at the bottom of the output.

- `spoofApps=1` and `verboseLogs=0` hardcoded into every profile mode including Pixelify, Legacy, and the default fallback. 

### osm0sis.sh

- Root check and Termux environment check stripped out. No more `if [ "$USER" != "root" ]` or `*termux*` exit at the top.

- `item()` function removed entirely.

- Nuked `echo "$PRODUCT_LIST" | wc -w`, no more device count output.

- `wget` redirects changed from `2>&1` to `>/dev/null 2>&1`. All network fetches are now fully silent.

- All`cat` output outputs gets swallowed now.

- `mv -fv` and `cp -fv` redirects added `>/dev/null 2>&1` to silence them.

- `export_json_from_prop` call now redirects to `>/dev/null 2>&1` too.

- All file references flipped from `custom.pif.prop` to `pixel.txt` and `pif.prop` to `pif.txt`. The `grep_config` case statement updated from `*.prop` to `*.txt`.

- `PROP_FILE` in `export_json_from_prop` now points to `pixel.txt` instead of `custom.pif.prop`.

- `ADVSETTINGS` gained `verboseLogs` and `spoofApps`.

- `tee pif.prop` changed to `tee pif.txt >/dev/null`. Still pipes through tee but output hidden.

- `SECURITY_PATCH` in the dumped config bumped from `2026-05-01` to `2026-06-01`.

### common_func.sh

- `recommended_settings()` used to create seven flag files: `migrate_force`, `run_migrate`, `nodebug`, `encrypt`, `build`, `twrp`, and `tag`. Now it only creates two: `migrate_force` and `run_migrate`. The other five flags are no longer auto-generated.

- Updated Integrity Box ASCII banner

### customize.sh

- `enable_recommended_settings()` reduced from nine flag files to four. Removed `nodebug`, `encrypt`, `build`, `twrp`, and `tag` from auto-creation. These are now created using consent.sh

- `install_module()` execution order changed. `prepare_directories` and `handle_module_props` now run before `setup_environment` and `hizru`. Added `butter_chicken()` call before `release_source`. Ts fixes grep error on fresh installation 

- `butter_chicken()` introduced. Executes `consent.sh` from `MODPATH`. It's gonna ask u whether u want to enable recommended settings or not. You've to make choice through volume button.

- All `custom.pif.prop` references migrated to `pixel.txt`. Fingerprint fallback copy logic, source paths, and destination paths updated accordingly.

- `prepare_directories()` target directory corrected from `/data/adb/modules/playintegrity` to `/data/adb/modules/playintegrityfix`. Aligns with current module ID.

- Default security patch date updated from `2026-05-01` to `2026-06-01` in the TrickyStore patch file template.

- `detect_lineage_official()` and `get_key()` removed. Interactive ROM spoofing prompt during installation eliminated. Stock ROM `safemode` flag creation dropped as a consequence.

- ROM detection block simplified. `else` branch removed, no longer auto-creates `safemode` flag on stock ROMs.

- `rm -rf $MEOW/system` added to zygiskless cleanup. Previously only cleaned from `MODPATH`, now also wipes from active module directory.

- Banner ASCII art replaced.

### [WebUI] : IntegrityBox Main Dashboard

- Dashboard status items reorganized and renamed

- "Config" status added

- "Expiry" status added

- "Spoofed" status added (per-app spoofing count)

- "Android" and "Zygote" status items removed

- "Spoofing" status added (GMS spoofing state)

- "Spoof" status added (pixel spoof state)

- "Denylist" status added

- "Button group "Miscellaneous" changed: "Beast Mode" renamed to "Utility Box"

- "Spoofing Menu" group removed entirely

- "Device Spoofing", "ROM Spoofing", "Play Integrity" buttons moved out of "Spoofing Menu" group

- "Play Integrity" button renamed to "Spoofing Menu" (data-type `piffork` kept)

- "Prop Spoofing" button renamed to "Prop Spoofer" (data-type `propspoofer` kept)

- "Toolkit" group expanded: "Hide Sus Files" moved from "Spoofing Menu" into "Toolkit"

- "Extra" group: "Advanced Mode" included "Zygiskless Mode" 

- Removed "Cache" UI

- "Tricky Store & TEE Simulator" group: buttons reordered

- Removed inline `onclick` handlers from all buttons (moved to `script.js`)

- Removed commented-out legacy buttons (Spoof Lineage Props, Inject HMA, Hide PIF Detection, Hide PIF Hook Detection, Enable Whitelist, Reset ZygiskNext, Spoof SeLinux, Set AOSP Keybox, Kill GMS)

- Removed `data-script` attributes from several buttons (now handled via `data-type` only)

- `data-script` attribute removed from "Spoofing" button

- `data-script` attribute removed from "Cache" button

- `data-script` attribute removed from "Assistant" button

### [JS] : IntegrityBox Main Dashboard (script.js)

- `messageMap` entry changed: `"beast"` renamed to `"utility"`

- `messageMap` entry added: `"pixel"` with start message "Spoof your device to app"

- `readExpiry()` function added for parsing keybox expiry dates from pixel.txt

- `updateDashboard()` status items reorganized and reduced from 11 to 8 entries

- Removed `status-android` (Android version detection with case statement)

- Removed `status-zygisk` (Zygisk module detection)

- Removed `status-gms` (GMS property detection with complex shell logic)

- Removed `status-whitelist` (Denylist/whitelist mode detection)

- Added `status-apps` (app spoof count from apps.txt)

- Added `status-expiry` (keybox expiry days remaining with color coding)

- `status-pixel` command changed from `custom.pif.prop` to `pixel.txt`

- `status-autopilot` command expanded: now checks for `autopilot` flag file existence, returns "DISABLED" if missing

- `status-LineageProp` command expanded: now checks for `safemode` flag file, returns "OTA" if present

- `status-selinux` class mapping changed: "Enforcing" now maps to `"play"`, fallback maps to `"aqua"`

- `status-apps` added with `"aqua"` class

- `status-autopilot` display logic rewritten: "DISABLED" shows as "Disabled", "XTREME" as "Xtreme", else "Keybox"; all use `"aqua"` class

- `status-LineageProp` display logic rewritten: "OTA" shows as "OTA", "FOUND" as "90% Spoofed", else "Spoofed"; all use `"play"` class

- Default status class changed from `"neutral"` to `"aqua"`

- `pathMap` entry changed: `"beast"` renamed to `"utility"` pointing to `"./Utility/index.html"`

- `pathMap` entry added: `"pixel"` pointing to `"./Pixel/index.html"`

- `attachButtonListeners()` type array updated: replaced `"beast"` with `"utility"`, added `"pixel"`

### [CSS] : IntegrityBox Main Dashboard (style.css)

- `.dashboard::after` radial gradient changed from `transparent 70%` to `transparent 60%`

- `.dashboard::after` animation duration changed from `4s` to `3s`

- `.dashboard::after` `dashboardGlow` keyframe timing changed from `50%` to `40%`

- `.btn::before` radial gradient changed from `transparent 70%` to `transparent 80%`

- `.status-indicator.aqua` color changed from `#5BB5FF` to `#43CDF9`

- `#modal-title` `titleGlow` animation duration changed from `2s` to `4s`

### [WEBUI] : Integrity Status 

- Explained "Integrity Verdicts" status 

- `CONFIG.fingerprintPath` changed from `custom.pif.prop` to `pixel.txt`. The WebUI now reads from the new config file.

- `infoTexts.fingerprint` modal text updated. `Config: <code>custom.pif.prop</code>` changed to `Config: <code>pixel.txt</code>`.

- `DOM.fpSdk` assignment simplified. Old code checked `fp.DEVICE_INITIAL_SDK_INT || fp['*.api_level']`. New code only checks `fp.DEVICE_INITIAL_SDK_INT`. The `*.api_level` fallback removed.

### [WebUI] : Control Centre 

- Complete redesign from 2-column card grid to single-column toggle-list layout with iOS-style switches

- Visual theme upgraded to glassmorphism with radial-gradient background, backdrop blur, and glow animations

- Accent color changed from `#1592FF` to `#4da3ff`
- Background changed from flat `#1f2233` to `radial-gradient(circle at 30% 20%, #1c2045 0%, #0e1020 100%)`

- Font changed from Inter to system/SF Pro Display stack

- Card-based interaction replaced with proper toggle switches per row

- Added "Auto Run" toggle that controls whether action items auto-execute scripts

- Action items now run `action.sh` via shell when toggled on with Auto Run enabled

- Added loading spinner state on rows during action execution

- Added "Refresh States" button to re-check all flag files

- Popup system replaced with multi-fallback toast (window.toast > kernelsu.toast > ksu.toast > custom animated popup)

- Header icon changed from custom SVG shield to Material Icons `settings`

- Added card entry animation on mount

- Enhanced hover/active states with translateY lift, box-shadow, and border color transitions

- Status dot now glows green when active

### [WebUI] : Profile Menu

- Layout changed from single-column list to 2-column grid for profile cards

- Profile cards redesigned as centered icon+name tiles instead of left-aligned rows with subtitles

- `Pixelify` profile accent color changed from `#30D158` green to `#5AC8FA` light blue

- Title changed from "Play Integrity Box" to "Play Integrity Profile"

- Removed segmented hint bar

- Added info modal with detailed profile and action descriptions

- "Get Play Store" button restyled as `btn-success` (green) instead of `btn-primary` (blue)

- Added "Which profile should i use?" info button spanning full width

- Notes section expanded from 3 to 6 bullet points

- Profile card subtitles removed from grid view (now only in info modal)

- Card hover effects enhanced with translateY lift and accent glow

- Active state checkmark repositioned from right-center to top-right corner

- Item icon size increased from 22px to 35px with larger container

- `sh()` function simplified, removed async wrapper, direct `ksu.exec` call

- Profile info modal added with backdrop blur and scale animation

- Mobile responsive adjustments for smaller screens

### [WebUI] : IntegrityBox Toolkit

- Complete redesign from multi-column module layout to single-card toggle-list layout

- Visual theme upgraded to glassmorphism with radial-gradient background, backdrop blur, and glow animations

- Accent color changed from `#1592FF` to `#4da3ff`

- Background changed from animated multi-layer radial gradient to static `radial-gradient(circle at 30% 20%, #1c2045 0%, #0e1020 100%)`

- Card container added with entry animation and glow pulse effect

- Layout changed from `auto-fit` grid modules to fixed-width card with sections

- Added "OTA" toggle with Stable/Beta channel switching via `updateJson` in module.prop

- Added "Developer Mode" toggle controlling `verboseLogs` in pixel.txt

- Added "Lite Mode" toggle controlling `spoofApps` in pixel.txt and `autopilot` flag

- Processing modes redesigned from pill buttons to 2-column grid cards with icons

- Output toggles redesigned from list rows to grid cards

- Added info tooltip for processing modes

- Added status dots and iOS-style toggle switches

- Added multi-fallback toast popup system

- Shell execution rewritten with `run()` helper using callback pattern instead of direct `ksu.exec`

- Added `read()`/`write()` helpers for pixel.txt property management

- `setMode()` now sets both top and depth simultaneously

- Initialization now async with 250ms delay for mode detection

- Removed "Export Valid Keybox" and "Generate PIF.json" as list items, converted to grid cards

### [WebUI] : Beast Mode 

- Complete redesign from "Utility Box" to "Beast Mode" single-card layout

- Title changed from "Utility Box" to "Beast Mode" with bolt icon

- Script execution changed from instant-run buttons to toggle-select grid with "Let's Go!" main execution button

- Script grid redesigned from 4-column instant-action buttons to 2-column selectable cards with checkmark badge on selection

- Script selection state persists to `beastmode_prefs_scripts` file

- Scripts changed: replaced Spoof Lineage Props, Hide Lineage Props, Hide PIF Props, Update HMA Config, Update Targets, Kill GMS Process, Reset ZygiskNext, Spoof Silenux Status with Update Spoofing, Update Keybox, Update HMA, Spoof Lineage, Delete Lineage, Hide ROM Props, Update Targets, Hide SUS Files

- Execution flow changed from individual instant runs to sequential queue with per-script completion popup and progress counter

- Banking Mode state persistence changed from `settings get global sys_oem_unlock_allowed` read-back to flag file at `/data/adb/Box-Brain/banking_mode`

- Banking Mode toggle uses `touch`/`rm -f` on flag file instead of settings-only approach

- "Remove Dex2OAT Flags" moved from secondary action button to standalone section under "Hide LSPosed"

- Log file path changed from `utility.log` to `beastmode.log`

- Shell execution rewritten with `run()` callback helper with 15-second timeout and `sh()` synchronous helper

- Added `popup()` multi-fallback toast system (window.toast > kernelsu.toast > ksu.toast → custom DOM)

- Added `savePrefs()` / `loadPrefs()` for script selection persistence

- Added `renderScripts()` dynamic grid generation

- Added `executeScripts()` queue runner with 800ms delay between scripts

- Loader text updates dynamically with `setProgress()` showing "Running X of Y tasks"

- Loading overlay changed from CSS toggle class to opacity transition with display toggle

- Removed info modal system

- Removed `resetZygiskNext()` function

- Removed `showInfo()` / `closeModal()` functions

- Material Icons changed from "Material Icons Round" to standard "Material Icons"

- Card layout changed from full-width stacked cards to single centered 420px card with internal sections

- Header changed from icon + title + subtitle block to compact title row with gradient icon

- Section labels added as uppercase text labels instead of card-based section titles

- Status indicators removed from header, replaced by inline badge next to Banking Mode title

- Log panel animation changed from `slideUp` to direct display toggle

### [WebUI] : Key Simulator

- Title changed from "Keybox Selector" to "Key Simulator"

- Header layout changed from flex `space-between` to centered `title-section` block

- Action buttons moved from header row to centered `action-row` below title

- Bulk controls (keybox select, mode select, add/remove buttons) split into separate centered `action-row` containers

- Search input moved to dedicated centered `search-row` with max-width 500px

- Table columns reduced from 3 to 2 (removed "Keybox / Mode" column)

- App row layout changed from side-by-side icon+name+controls to stacked vertical layout

- Icon, segment buttons, and mode select now grouped in `app-row-top` flex row

- Package name moved below controls as `app-row-name` with 48px left padding

- Package name click target changed from `.pkg` cell to `.app-row-name` span

- Keybox option renamed from "AOSP" to "Personal" (value changed from `aosp` to `keybox2`)

- CSS class renamed from `pkg-aosp` to `pkg-keybox2` with color `#ffb347` unchanged

- Constant renamed from `KEY_AOSP` to `KEY_KEYBOX2`

- Segment button data attribute changed from `data-k="aosp"` to `data-k="keybox2"`

- App icon size increased from 32px to 38px

- App icon border radius increased from 8px to 10px

- Table row and cell padding increased from 10px to 14px

- `th:first-child` width set to 40px for checkbox column

- Removed `td.pkg` left padding override and `pkg-text` class

- Removed `pkg-wrap` flex container

- Removed `#previewButtons` container from controls

- `createRow()` HTML structure completely rewritten for stacked layout

- `applyPkgColor()` target selector changed from `.pkg[data-pkg]` to `.app-row-name[data-pkg]`

- `refreshRowBindings()` secName mapping updated for `keybox2` instead of `aosp`

## Thanks for reading ;)
