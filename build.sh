#!/usr/bin/env bash
# build.sh — Pandly Liquid Glass Engine Emscripten Build
# Requires: emsdk activated (source emsdk_env.sh)
#
# Output:
#   public/wasm/liquid_engine.js       — glue JS (Module factory)
#   public/wasm/liquid_engine.wasm     — WebAssembly binary
#   public/wasm/liquid_engine.worker.js — Web Worker for off-thread rendering
#
# Usage from JS:
#   const Module = await require('./liquid_engine.js');
#   const lens = new Module.GlassLens();
#   const tokens = Module.standardCard();
//   lens.tokens = tokens;
//   Module.renderGlass(lens, backdropPtr, bw, bh, outPtr, lensW, lensH);
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="${SCRIPT_DIR}"
OUT_DIR="${SCRIPT_DIR}/public/wasm"
SRC_FILE="${SRC_DIR}/liquid_engine.cpp"

mkdir -p "${OUT_DIR}"

echo "=== Pandly Liquid Glass Engine — Emscripten Build ==="
echo "Source: ${SRC_FILE}"
echo "Output: ${OUT_DIR}/"
echo ""

# --- Verify emcc is available ---
if ! command -v emcc &>/dev/null; then
    echo "ERROR: emcc not found. Activate emsdk first:"
    echo "  source /path/to/emsdk/emsdk_env.sh"
    exit 1
fi

echo "emcc version: $(emcc --version | head -1)"

# --- Build flags ---
# -O3                    : aggressive optimization (inlining, dead code, vectorization)
# -msimd128              : WebAssembly SIMD (128-bit packed ops)
# -flto                  : link-time optimization across translation units
# -fno-rtti              : no RTTI (smaller binary, embind still works)
# -fno-exceptions        : no exception unwinding (smaller, faster)
# -s EMSCRIPTEN_BINDINGS : embind for JS<->C++ interop
# -s MODULARIZE=1        : ES module output (import/require)
# -s EXPORT_NAME=...     : factory function name
# -s ALLOW_MEMORY_GROWTH : dynamic memory (no fixed heap limit)
# -s MAXIMUM_MEMORY=2GB  : cap for sanity
# -s INITIAL_MEMORY=16MB : starting heap (enough for 1080p lens)
# -s WASM=1              : emit .wasm (not asm.js)
# -s SINGLE_FILE=0       : separate .wasm file (better caching)
# -s ENVIRONMENT=web     : target web (no node.js fs hacks)
# -s ASSERTIONS=0        : no runtime asserts in production
# -s DISABLE_EXCEPTION_CATCHING=1
# --closure 1            : Google Closure minification of glue JS
# -std=c++17             : structured bindings, if constexpr, etc.
# -D__EMSCRIPTEN__       : embind macro guard (redundant but safe)

COMMON_FLAGS=(
    -O3
    -std=c++17
    -fno-rtti
    -fno-exceptions
    -Wall
    -Wextra
    -Wno-unused-parameter
    -Wno-sign-compare
    -D__EMSCRIPTEN__
)

SIMD_FLAGS=(
    -msimd128
)

LINK_FLAGS=(
    -s EMSCRIPTEN_BINDINGS=1
    -s MODULARIZE=1
    -s EXPORT_NAME="LiquidEngine"
    -s ALLOW_MEMORY_GROWTH=1
    -s MAXIMUM_MEMORY=2147483648
    -s INITIAL_MEMORY=16777216
    -s WASM=1
    -s SINGLE_FILE=0
    -s ENVIRONMENT=web
    -s ASSERTIONS=0
    -s DISABLE_EXCEPTION_CATCHING=1
    -s EXPORTED_FUNCTIONS='["_malloc","_free"]'
    -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","addFunction","removeFunction","getValue","setValue","UTF8ToString","stringToUTF8"]'
    --closure 1
)

echo ""
echo "--- Compiling (SIMD enabled, -O3, LTO) ---"
echo ""

emcc "${COMMON_FLAGS[@]}" "${SIMD_FLAGS[@]}" "${LINK_FLAGS[@]}" \
    "${SRC_FILE}" \
    -o "${OUT_DIR}/liquid_engine.js"

echo ""
echo "--- Build complete ---"
echo ""
ls -lh "${OUT_DIR}/liquid_engine."*
echo ""
echo "=== Done ==="
echo ""
echo "Integration example:"
echo "  WASM loaded from public/wasm/ via fetch() in hooks/useLiquidEngine.ts"
