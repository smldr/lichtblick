#!/usr/bin/env bash
# Generates every app icon from assets/logo.png (a square PNG, at least 1024x1024).
# Requires macOS (sips, iconutil) and ImageMagick (magick).
#
#   bash assets/generate-icons.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/assets/logo.png"
DESKTOP="$ROOT/packages/suite-desktop/resources/icon"
WEB="$ROOT/packages/suite-web/public"

if [[ ! -f "$SRC" ]]; then
  echo "Missing $SRC: add a square PNG of at least 1024x1024 first." >&2
  exit 1
fi

width=$(sips -g pixelWidth "$SRC" | awk '/pixelWidth/ {print $2}')
height=$(sips -g pixelHeight "$SRC" | awk '/pixelHeight/ {print $2}')
if [[ "$width" != "$height" || "$width" -lt 1024 ]]; then
  echo "assets/logo.png must be square and at least 1024x1024 (got ${width}x${height})." >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Desktop: 1024 PNG (Linux), .icns (macOS), .ico (Windows).
sips -z 1024 1024 "$SRC" --out "$DESKTOP/icon.png" >/dev/null

ICONSET="$TMP/icon.iconset"
mkdir "$ICONSET"
for size in 16 32 128 256 512; do
  sips -z $size $size "$SRC" --out "$ICONSET/icon_${size}x${size}.png" >/dev/null
  double=$((size * 2))
  sips -z $double $double "$SRC" --out "$ICONSET/icon_${size}x${size}@2x.png" >/dev/null
done
iconutil -c icns "$ICONSET" -o "$DESKTOP/icon.icns"

# Web: favicons and the Apple touch icon.
sips -z 16 16 "$SRC" --out "$WEB/favicon-16x16.png" >/dev/null
sips -z 32 32 "$SRC" --out "$WEB/favicon-32x32.png" >/dev/null
sips -z 180 180 "$SRC" --out "$WEB/apple-touch-icon.png" >/dev/null
magick "$SRC" -define icon:auto-resize=256,64,48,32,16 "$WEB/favicon.ico"

# README icon (webp, per Catppuccin guidelines).
magick "$SRC" -resize 512x512 -quality 90 "$ROOT/assets/logo.webp"

echo "Icons generated from assets/logo.png."
