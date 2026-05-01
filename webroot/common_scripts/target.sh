#!/system/bin/sh
MODPATH="/data/adb/modules/playintegrityfix"
. $MODPATH/common_func.sh

TARGET_DIR="/data/adb/tricky_store"
TARGET="$TARGET_DIR/target.txt"
SKIP_FILE="/data/adb/Box-Brain/skip"
BACKUP="$TARGET.bak"
TMP="${TARGET}.new.$$"
success=0
made_backup=0
orig_selinux="$(getenforce 2>/dev/null || echo Permissive)"

mkdir -p "$TARGET_DIR" 2>/dev/null
if [ ! -f "$SKIP_FILE" ] && [ "$orig_selinux" = "Enforcing" ]; then
    setenforce 0
fi

[ -f "$TARGET" ] && mv -f "$TARGET" "$BACKUP" && made_backup=1 && log_step "BACKUP" "$BACKUP"

teeBroken="false"
TEE_STATUS="$TARGET_DIR/tee_status"
[ -f "$TEE_STATUS" ] && [ "$(grep -E '^teeBroken=' "$TEE_STATUS" | cut -d '=' -f2)" = "true" ] && teeBroken="true"

for pkg in com.android.vending com.google.android.gms com.google.android.gsf; do
    echo "$pkg" >> "$TMP"
done

cmd package list packages -3 2>/dev/null | cut -d ":" -f2 | while read -r pkg; do
    [ -z "$pkg" ] && continue
    grep -Fxq "$pkg" "$TMP" || echo "$pkg" >> "$TMP"
done

sed -i 's/^[[:space:]]*//;s/[[:space:]]*$//' "$TMP"
sort -u "$TMP" -o "$TMP"

BLACKLIST="/data/adb/Box-Brain/blacklist.txt"
if [ -s "$BLACKLIST" ]; then
    sed -i 's/^[[:space:]]*//;s/[[:space:]]*$//' "$BLACKLIST"
    grep -Fvxf "$BLACKLIST" "$TMP" > "${TMP}.filtered" || true
    mv -f "${TMP}.filtered" "$TMP"
    log_step "CLEANED" "Blacklisted Apps removed"
else
    log_step "SKIPPED" "Blacklist not configured"
fi

[ "$teeBroken" = "true" ] && sed -i 's/$/!/' "$TMP" && log_step "SUPPORT" "TEE Broken detected"

mv -f "$TMP" "$TARGET" && success=1 && log_step "UPDATED" "Target Packages updated"

if [ ! -f "$SKIP_FILE" ] && [ "$orig_selinux" = "Enforcing" ]; then
    setenforce 1
fi
exit 0
