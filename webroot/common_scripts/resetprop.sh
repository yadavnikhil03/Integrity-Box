#!/system/bin/sh
PKG="com.reveny.nativecheck"

su -c 'getprop | grep -E "pphooks|pihook|pixelprops|gms|pi" | sed -E "s/^\[(.*)\]:.*/\1/" | while IFS= read -r prop; do resetprop -p -d "$prop"; done'

# Check if package exists
if pm list packages | grep -q "$PKG"; then
    echo "Package $PKG found. Force stopping..."
    am force-stop "$PKG"
else
    echo "$PKG not installed."
fi
