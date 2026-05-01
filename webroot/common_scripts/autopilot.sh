#!/system/bin/sh

# CONFIGURATION
CHECK_INTERVAL=900
GITHUB="https://raw.githubusercontent.com/MeowDump/Integrity-Box/main/keybox"
BOX_BRAIN="/data/adb/Box-Brain"
MODPATH="/data/adb/modules/playintegrityfix"

# LOGGING
mkdir -p "$BOX_BRAIN/Integrity-Box-Logs" 2>/dev/null
LOG_FILE="$BOX_BRAIN/Integrity-Box-Logs/autorun.log"

log() {
    echo "[$(date '+%H:%M:%S')] $1" >> "$LOG_FILE"
    if type writelog >/dev/null 2>&1; then
        writelog "$1" 2>/dev/null
    fi
}

log "••••••• AUTORUN START PID: $$ •••••••"

# SOURCE MODULE FUNCTIONS
if [ -f "$MODPATH/common_func.sh" ]; then
    . "$MODPATH/common_func.sh"
else
    log "FATAL: common_func.sh missing"
    exit 1
fi

# CHECK AUTOPILOT ENABLED
if [ ! -f "$BOX_BRAIN/autopilot" ]; then
    log "autopilot disabled, exit"
    exit 0
fi

LOCK_DIR="$BOX_BRAIN/autorun.lockdir"

# Try to create lock directory
if mkdir "$LOCK_DIR" 2>/dev/null; then
    # Success
    echo $$ > "$LOCK_DIR/pid"
    log "Lock acquired"
else
    # Failed, check if stale
    if [ -f "$LOCK_DIR/pid" ]; then
        old_pid=$(cat "$LOCK_DIR/pid" 2>/dev/null)
        if [ -n "$old_pid" ]; then
            # Check if process exists and is our script
            if [ -d "/proc/$old_pid" ]; then
                # Check cmdline
                if [ -r "/proc/$old_pid/cmdline" ]; then
                    if grep -q "autorun" "/proc/$old_pid/cmdline" 2>/dev/null; then
                        # Check heartbeat
                        last_beat=$(cat "$BOX_BRAIN/daemon_heartbeat" 2>/dev/null || echo "0")
                        now=$(date +%s)
                        diff=$((now - last_beat))
                        if [ "$diff" -lt 180 ]; then
                            log "Already running (PID $old_pid, ${diff}s ago)"
                            exit 0
                        else
                            log "Killing stale $old_pid"
                            kill -9 "$old_pid" 2>/dev/null
                            sleep 1
                            # Try to claim lock
                            rm -rf "$LOCK_DIR" 2>/dev/null
                            mkdir "$LOCK_DIR" 2>/dev/null || { log "Cannot claim lock"; exit 1; }
                            echo $$ > "$LOCK_DIR/pid"
                        fi
                    else
                        # Different process, steal lock
                        rm -rf "$LOCK_DIR" 2>/dev/null
                        mkdir "$LOCK_DIR" 2>/dev/null || { log "Cannot claim lock"; exit 1; }
                        echo $$ > "$LOCK_DIR/pid"
                        log "Stole lock from foreign process"
                    fi
                else
                    # Can't read cmdline, assume stale
                    rm -rf "$LOCK_DIR" 2>/dev/null
                    mkdir "$LOCK_DIR" 2>/dev/null || { log "Cannot claim lock"; exit 1; }
                    echo $$ > "$LOCK_DIR/pid"
                fi
            else
                # Process dead, clean up
                rm -rf "$LOCK_DIR" 2>/dev/null
                mkdir "$LOCK_DIR" 2>/dev/null || { log "Cannot claim lock"; exit 1; }
                echo $$ > "$LOCK_DIR/pid"
                log "Reclaimed lock from dead process"
            fi
        else
            # No PID file, claim it
            rm -rf "$LOCK_DIR" 2>/dev/null
            mkdir "$LOCK_DIR" 2>/dev/null || { log "Cannot claim lock"; exit 1; }
            echo $$ > "$LOCK_DIR/pid"
        fi
    else
        # No PID file, claim it
        rm -rf "$LOCK_DIR" 2>/dev/null
        mkdir "$LOCK_DIR" 2>/dev/null || { log "Cannot claim lock"; exit 1; }
        echo $$ > "$LOCK_DIR/pid"
    fi
fi

# CLEANUP FUNCTION
cleanup() {
    log "Stopping daemon"
    rm -rf "$LOCK_DIR" "$BOX_BRAIN/.executing" 2>/dev/null
    exit 0
}

# SIGNAL TRAPS
trap cleanup 15 2 1 0 2>/dev/null || true

# WAKELOCK
wakelock_acquire() {
    # Try Android wakelock
    if [ -w "/sys/power/wake_lock" ]; then
        printf "integrity_autorun" > /sys/power/wake_lock 2>/dev/null
    fi
    # Some devices use different paths
    if [ -w "/proc/sys/kernel/wakelock" ]; then
        printf "integrity_autorun" > /proc/sys/kernel/wakelock 2>/dev/null
    fi
}

wakelock_release() {
    if [ -w "/sys/power/wake_unlock" ]; then
        printf "integrity_autorun" > /sys/power/wake_unlock 2>/dev/null
    fi
    if [ -w "/proc/sys/kernel/wakelock" ]; then
        printf "integrity_autorun" > /proc/sys/kernel/wakelock 2>/dev/null
    fi
}

# HELPER FUNCTIONS
get_local_highest() {
    highest=""
    # Check all emergency files
    for f in "$BOX_BRAIN"/emergency_[A-Z]*; do
        [ -f "$f" ] || continue
        name=$(basename "$f")
        letter=${name#emergency_}
        # String comparison for alphabet order
        case "$letter" in
            A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|AA|AB|AC|AD|AE|AF|AG|AH|AI|AJ|AK|AL|AM|AN|AO|AP|AQ|AR|AS|AT|AU|AV|AW|AX|AY|AZ|BA|BB|BC|BD|BE|BF|BG|BH|BI|BJ|BK|BL|BM|BN|BO|BP|BQ|BR|BS|BT|BU|BV|BW|BX|BY|BZ)
                if [ -z "$highest" ] || [ "$letter" != "$(printf '%s\n%s\n' "$highest" "$letter" | sort | tail -1)" ]; then
                    highest="$letter"
                fi
                ;;
        esac
    done
    printf '%s' "$highest"
}

get_script() {
    if [ -f "$BOX_BRAIN/run_action" ] && [ -f "$MODPATH/action.sh" ]; then
        printf '%s' "$MODPATH/action.sh"
    elif [ -f "$MODPATH/webroot/common_scripts/key.sh" ]; then
        printf '%s' "$MODPATH/webroot/common_scripts/key.sh"
    else
        printf ''
    fi
}

check_github() {
    letter="$1"
    detect_downloader
    
    if [ "$DL_MODE" = "curl" ]; then
        code=$(curl -s -I --max-time 15 -o /dev/null -w "%{http_code}" "$GITHUB/emergency_$letter" 2>/dev/null)
        [ "$code" = "200" ]
    elif [ "$DL_MODE" = "wget" ]; then
        wget -q --spider --timeout=15 --tries=1 "$GITHUB/emergency_$letter" 2>/dev/null
    else
        false
    fi
}

get_remote_highest() {
    highest=""
    
    # Single letters first
    for letter in A B C D E F G H I J K L M N O P Q R S T U V W X Y Z; do
        if check_github "$letter"; then
            highest="$letter"
        fi
    done
    
    # Extended only if Z found
    if [ "$highest" = "Z" ]; then
        for letter in AA AB AC AD AE AF AG AH AI AJ AK AL AM AN AO AP AQ AR AS AT AU AV AW AX AY AZ; do
            if check_github "$letter"; then
                highest="$letter"
            fi
        done
    fi
    
    if [ "$highest" = "AZ" ]; then
        for letter in BA BB BC BD BE BF BG BH BI BJ BK BL BM BN BO BP BQ BR BS BT BU BV BW BX BY BZ; do
            if check_github "$letter"; then
                highest="$letter"
            fi
        done
    fi
    
    printf '%s' "$highest"
}

execute() {
    letter="$1"
    
    # Check already executing
    if [ -f "$BOX_BRAIN/.executing" ]; then
        log "Skip: already executing"
        return 1
    fi
    
    touch "$BOX_BRAIN/.executing"
    
    script=$(get_script)
    if [ -z "$script" ]; then
        log "ERROR: no script found"
        rm -f "$BOX_BRAIN/.executing"
        return 1
    fi
    
    log "EXECUTE: emergency_$letter -> $script"
    
    # Make executable
    [ -x "$script" ] || chmod +x "$script" 2>/dev/null
    
    # Execute with wakelock
    wakelock_acquire
    
    # Use timeout if available, otherwise run directly
    if type timeout >/dev/null 2>&1; then
        timeout 120 "$script" >> "$LOG_FILE" 2>&1
        code=$?
    else
        # Fallback: run in background and kill after 120s
        "$script" >> "$LOG_FILE" 2>&1 &
        pid=$!
        (
            sleep 120
            kill "$pid" 2>/dev/null
        ) &
        wait "$pid" 2>/dev/null
        code=$?
    fi
    
    wakelock_release
    
    log "EXIT: $code"
    
    if [ "$code" -eq 0 ]; then
        touch "$BOX_BRAIN/emergency_$letter"
        log "MARKED: $letter done"
    fi
    
    rm -f "$BOX_BRAIN/.executing"
    return "$code"
}

# MAIN LOOP
log "Entering loop (interval: ${CHECK_INTERVAL}s)"

iteration=0
while true; do
    iteration=$((iteration + 1))
    now=$(date +%s)
    
    # Update heartbeat
    printf '%s' "$now" > "$BOX_BRAIN/daemon_heartbeat"
    
    # Verify we still own the lock
    if [ -f "$LOCK_DIR/pid" ]; then
        owner=$(cat "$LOCK_DIR/pid" 2>/dev/null)
        if [ "$owner" != "$$" ]; then
            log "Lost lock (owner: $owner), exit"
            exit 1
        fi
    else
        log "Lock lost, exit"
        exit 1
    fi
    
    log "--- Cycle #$iteration ---"
    
    # Network check and execute
    if wait_for_network 15; then
        local_max=$(get_local_highest)
        remote_max=$(get_remote_highest)
        
        log "Local: ${local_max:-none}, Remote: ${remote_max:-none}"
        
        if [ -n "$remote_max" ]; then
            if [ "$remote_max" = "$local_max" ]; then
                log "Remote = Local, no action"
            elif [ -f "$BOX_BRAIN/emergency_$remote_max" ]; then
                log "Remote $remote_max already done"
            else
                execute "$remote_max"
            fi
        else
            log "No remote emergency"
        fi
    else
        log "Network unavailable"
    fi
    
    # Sleep with periodic heartbeat updates
    # Split sleep into chunks for responsiveness
    remaining=$CHECK_INTERVAL
    while [ "$remaining" -gt 0 ]; do
        chunk=60
        [ "$remaining" -lt "$chunk" ] && chunk=$remaining
        
        sleep "$chunk"
        remaining=$((remaining - chunk))
        
        # Update heartbeat
        date +%s > "$BOX_BRAIN/daemon_heartbeat"
        
        # Check autopilot still enabled
        if [ ! -f "$BOX_BRAIN/autopilot" ]; then
            log "Autopilot disabled, stop"
            cleanup
        fi
    done
done
