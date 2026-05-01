> Release Date: 01/05/2026

#### THIS UPDATE IS MANDATORY 

## Critical Fixes

- Resolved critical boot failures affecting recovery and fastboot modes on specific device configurations
- Eliminated bootloop conditions caused by race conditions during module initialization
- Fixed unintended soft reboot when triggering action buttons on Samsung stock firmware
- Fixed ZN Reset behavior to treat non-root apps as denylist entries on Magisk environments
- Patched memory leak in background service that caused system instability after prolonged uptime
- Fixed null pointer exception in prop validation routine leading to occasional crashes

## Compatibility & Stability

- Fixed compatibility issues with One UI 6.1 and MIUI 15 overlay systems
- Corrected missing flag declaration in target script execution path
- Corrected variable reference in TAG CHECK logging output
- Removed duplicate resetprop calls causing race condition conflicts
- Fixed status UI lag issues during rapid state transitions
- Added explicit user consent flow to decide whether to spoof props by default on first run
- Improved handling of devices with dynamic partition layouts
- Added fallback mechanisms for devices lacking standard prop interfaces

## Optimization

- Implemented SELinux state management 
- Added conditional file creation to prevent overwriting existing files
- All placeholder files now use existence checks before creation
- Added button to spoof/unspoof system and vendor security patch levels independently
- Spoofed system and vendor security patch to 01 MAY 2026
- Reduced module footprint by compressing static assets
- Optimized prop injection timing to occur earlier in the boot sequence
- Implemented lazy loading for non-critical UI components

## Package Management

- Package script now preserves existing installations during module updates
- Blacklisted more unnecessary packages
- Updated local fingerprints database
- Updated HMA config, blacklisted 100+ packages introduced in April security patch on Gore ROMs
- Updated checksum verification for downloads
- Improved cleanup routine for orphaned package entries

## UI/UX Improvements

- Upgraded Patch UI with enhanced visuals and responsive layout adjustments
- Dropped Zygisk implementation and Android indicator from dashboard to streamline interface
- Removed 10 redundant WebUI buttons for cleaner navigation and reduced cognitive load
- Migrated Utility Box integration for extended functionality access
- Added icons for WebUI and action button shortcuts
- Added loading states for asynchronous operations to prevent user confusion

## System Optimizations

- Improved script execution efficiency by parallelizing independent tasks
- Enhanced error handling and logging with structured output formats
- Optimized module startup sequence to reduce boot time overhead
- Refined prop injection timing to avoid conflicts with system services
- Reduced CPU usage during idle monitoring phases
- Minor fixes and improvements under the hood

#### Good luck, Remember me in your prayers 🤲🏻
