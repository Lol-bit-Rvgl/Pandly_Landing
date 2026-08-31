#!/usr/bin/env bash
# setup-assets.sh — Copy fonts, logo, emoji samples, and Rive files
# from the Pandly_Frontend Flutter repo into the Next.js public/ tree.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/Pandly_Frontend" && pwd)"
PUBLIC_DIR="$(cd "$(dirname "$0")" && pwd)/public"

echo "=== Pandly Asset Setup ==="
echo "Source: ${REPO_DIR}"
echo "Target: ${PUBLIC_DIR}"
echo ""

mkdir -p "${PUBLIC_DIR}/assets/fonts"
mkdir -p "${PUBLIC_DIR}/assets/logo"
mkdir -p "${PUBLIC_DIR}/assets/emoji"
mkdir -p "${PUBLIC_DIR}/assets/rive"
mkdir -p "${PUBLIC_DIR}/assets/images"

# ---- Fonts ----
echo "[1/4] Copying fonts..."
cp -v "${REPO_DIR}/assets/fonts/CherryBombOne-Regular.ttf" "${PUBLIC_DIR}/assets/fonts/"
cp -v "${REPO_DIR}/assets/fonts/DynaPuff-Variable.ttf"    "${PUBLIC_DIR}/assets/fonts/"
cp -v "${REPO_DIR}/assets/fonts/LilitaOne-Regular.ttf"    "${PUBLIC_DIR}/assets/fonts/"

# ---- Logo ----
echo ""
echo "[2/4] Copying logo..."
cp -v "${REPO_DIR}/assets/Logo/PANDLY_LOGO_PERFECT_FOR_PRODUCTION.png" "${PUBLIC_DIR}/assets/logo/"
cp -v "${REPO_DIR}/assets/images/Panda_Head.png"                       "${PUBLIC_DIR}/assets/images/"

# ---- Emoji samples (first 50 of 523 for landing page) ----
echo ""
echo "[3/4] Copying emoji samples (first 50)..."
count=0
for f in "${REPO_DIR}"/assets/emoji/Emoji_*.json; do
    [ -f "$f" ] || continue
    cp "$f" "${PUBLIC_DIR}/assets/emoji/"
    count=$((count + 1))
    if [ "$count" -ge 50 ]; then
        break
    fi
done
echo "  Copied ${count} emoji JSON files."

# ---- Rive files ----
echo ""
echo "[4/4] Copying Rive files..."
cp -v "${REPO_DIR}/assets/rive/SPACE_ANIMATION.riv" "${PUBLIC_DIR}/assets/rive/"
cp -v "${REPO_DIR}/gradient_orb.riv"                 "${PUBLIC_DIR}/assets/rive/" 2>/dev/null || true

echo ""
echo "=== Done ==="
echo ""
echo "Public assets tree:"
find "${PUBLIC_DIR}/assets" -type f | head -30
echo "..."
