#!/system/bin/sh

SCRIPT="/data/adb/modules/playintegrityfix/webroot/common_scripts/scan_keybox.sh"

# Run detached
sh "$SCRIPT" > /data/adb/Box-Brain/Integrity-Box-Logs/keybox_runner.log 2>&1 &
