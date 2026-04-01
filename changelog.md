> Release Date: 01/04/2026

### Changelog

#### Core Refactor
- Added support for Android 17 beta 3
- Performed structural rewrite of main JS execution layer with emphasis on modularization and deferred initialization patterns
- Refactored HMA template to align with updated rendering and event-binding flow

#### Interaction Layer
- Implemented bidirectional gesture handling with right-edge priority detection
- Introduced floating back button with dynamic positional binding relative to gesture origin

#### Environment Validation
- Integrated Zygisk state validation via checkZygisk()
  - Performs filesystem probe on /data/adb/modules/playintegrityfix/zygisk
  - Triggers global UI disable cascade on failure state
  - Emits fallback mode notification: "zygiskless mode has been enabled"

#### Compatibility Logic (A10 Downgrade Path)
- Added conditional SDK spoofing override:
  - When spoofVendingSdk == 1:
    - Enforces selective key persistence (spoofBuild, spoofProps)
    - Nullifies remaining configuration flags
    - Dispatches user feedback toast: "A10 mode enabled, others disabled"

#### Runtime & DOM Lifecycle Improvements
- Eliminated redundant "kill" action binding (retained authoritative restart handler)
- Introduced inlineMessageMap as a safeguard against undefined reference access
- Deferred DOM querying via attachButtonListeners() post-DOM readiness
- Enforced singleton iframe pattern using id="active-iframe" guard

#### Configuration Abstraction
- Added checkGestureConfig() for runtime flag resolution and behavioral branching
- Refactored openIframe() into async execution model with precondition validation

#### UI Composition Engine
- Introduced createIframeUI() as centralized UI factory:
  - Supports gesture-side aware layout rendering (left/right)
  - Dynamically repositions back button (top-left/top-right)
  - Applies adaptive glow gradient based on directional context

#### Gesture Engine Fixes
- Corrected right-side swipe detection by normalizing delta calculations using isRight flag inversion logic

#### UI/UX Overhaul
- Re-architected control centre with updated layout hierarchy
- Redesigned report UI for improved structural consistency
- Integrated Pixelify compatibility layer within bug reporting pipeline

#### System Updates
- Synced with April security patch baseline

#### Additional 
- Added target manipulation module ("target F*kr")
- Implemented keybox loader subsystem
- Alot of things i don't remember xD

## Remember me in your prayers 🤲🏻
