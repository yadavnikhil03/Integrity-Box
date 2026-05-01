#!/system/bin/sh
F="/data/adb/tricky_store/keybox.xml"
T="/data/adb/tricky_store/keybox.xml.tmp"
L="/data/adb/Box-Brain/Integrity-Box-Logs/remove.log"
X="morning,evening,night,fight"

log() {
    echo "- $1" >> "$L"
}

delete_if_exist() {
    path="$1"
    if [ -e "$path" ]; then
        rm -rf "$path"
        log "Deleted: $path"
    fi
}

mkdir -p "$(dirname "$L")"
touch "$L"
{
    echo ""
    echo "••••••• Cleanup Started •••••••"

    if [ ! -f "$F" ]; then
        log "File not found: $F"
        echo "••••••• Cleanup Aborted •••••••"
        exit 0
    fi

    log "Removing leftover files"

Z="$(cat "$F")"

Y=""
FIRST=1
IFS=','

for LINE in $(echo "$Z"); do
    for WORD in $X; do
        LINE="${LINE//$WORD/}"
    done
    if [ "$FIRST" -eq 1 ]; then
        Y="$LINE"
        FIRST=0
    else
        Y="$Y
$LINE"
    fi
done

IFS="$OLD_IFS"

printf "%s\n" "$Y" > "$T"
mv "$T" "$F"

    log "Deleting known leftover files from my modules..."
    delete_if_exist /data/adb/integrity_box_verify
	delete_if_exist /data/adb/modules_update/playintegrityfix/verify.sh
	delete_if_exist /data/adb/Integrity-Box-Logs
	delete_if_exist /data/adb/service.d/shamiko.sh
	delete_if_exist /data/adb/modules_update/playintegrityfix/hash
	delete_if_exist /data/adb/modules_update/playintegrityfix/credits.md
	delete_if_exist /data/adb/modules_update/playintegrityfix/CHANGELOG.md
	delete_if_exist /data/adb/Box-Brain/Integrity-Box-Logs/description.sh
	delete_if_exist /data/adb/modules/playintegrityfix/tmp.pro
	delete_if_exist /data/adb/modules/playintegrityfix/custom.pif.json
	delete_if_exist /data/adb/modules/playintegrityfix/custom.pif.json.bak
	delete_if_exist /data/adb/modules/playintegrityfix/autopif4
	delete_if_exist /data/adb/modules/playintegrityfix/pif.prop
	delete_if_exist /data/adb/modules/playintegrityfix/PIXEL_LATEST_HTML
	delete_if_exist /data/adb/modules/playintegrityfix/PIXEL_OTA_HTML
	delete_if_exist /data/adb/modules/playintegrityfix/PIXEL_VERSIONS_HTML
	delete_if_exist /data/adb/modules/playintegrityfix/PIXEL_ZIP_METADATA
	delete_if_exist /data/adb/modules/playintegrityfix/osm0sis
	delete_if_exist /data/adb/modules/playintegrityfix/CHANGELOG.md
	delete_if_exist /data/adb/pif.prop
	delete_if_exist /data/adb/pif.json
	delete_if_exist /data/local/tmp/keybox_scan.log
	delete_if_exist /data/local/tmp/keybox_runner.log
	delete_if_exist /data/adb/modules/playintegrity # remove old module id to avoid conflict
    echo "••••••• Cleanup Ended •••••••"
    echo " "
} >> "$L" 2>&1

exit 0