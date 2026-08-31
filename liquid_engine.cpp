/* liquid_engine.cpp — Pandly 2.5D Liquid Glass Engine
 * Port of GLSL shaders + Dart logic to portable C++.
 * Compiled to WebAssembly via Emscripten.
 *
 * Style: Linus Torvalds. 8-space tabs, C99/C++ idiomático.
 */
#include "liquid_engine.h"

/* ============================================================
 * Inertial optics constants (can't use constexpr with non-trivial init)
 * ============================================================ */
const float InertialOptics::W_NATURAL   = 26.0f;
const float InertialOptics::ZETA        = 0.86f;
const float InertialOptics::MAX_SHIFT_MM = 1.5f;
const float InertialOptics::MM_TO_PX    = 5.6693f;

/* ============================================================
 * Small helpers
 * ============================================================ */
static inline float clampf(float v, float lo, float hi) {
    return v < lo ? lo : (v > hi ? hi : v);
}

static inline float fastPow(float x, float n) {
    return std::exp2(n * std::log2(std::max(x, EPS)));
}

static inline float smoothstepf(float edge0, float edge1, float x) {
    float t = clampf((x - edge0) / (edge1 - edge0), 0.0f, 1.0f);
    return t * t * (3.0f - 2.0f * t);
}

/* ============================================================
 * SHAPE SDF — ported from liquid_glass_common.glsl
 * ============================================================ */

float roundedRectangleSDF(vec2 p, vec2 c, vec2 h, float r) {
    vec2 q = vec2(std::fabs(p.x - c.x), std::fabs(p.y - c.y)) - h + r;
    float mx = std::max(q.x, 0.0f);
    float my = std::max(q.y, 0.0f);
    return std::min(std::max(q.x, q.y), 0.0f) + std::sqrt(mx*mx + my*my) - r;
}

float squircleSDF(vec2 p, vec2 c, vec2 h, float zone, float n) {
    vec2 q = vec2(std::fabs(p.x - c.x), std::fabs(p.y - c.y)) - h + zone;
    float mx = std::max(q.x, EPS);
    float my = std::max(q.y, EPS);
    float corner = fastPow(fastPow(mx, n) + fastPow(my, n), 1.0f / n) - zone;
    return std::min(std::max(q.x, q.y), 0.0f) + corner;
}

/* Continuous rounded rect — Apple capsule-style (from liquid_glass_common.glsl) */
static const float CRR_T0      = 0.728f;
static const float CRR_ATAIL   = 4.836f;
static const float CRR_NTAIL   = 3.869f;
static const float CRR_EXTFRAC = 0.4425f;

static float crrShoulder(float tt) {
    if (tt <= CRR_T0) return 1.0f;
    float u = clampf((tt - CRR_T0) / (1.0f - CRR_T0), 0.0f, 1.0f);
    float inner = std::max(1.0f - std::pow(u, CRR_ATAIL), 0.0f);
    return std::pow(inner, 1.0f / CRR_NTAIL);
}

static vec2 continuousRoundedRectReach(float rr, vec2 halfSize) {
    float eH = std::min(CRR_EXTFRAC * rr, halfSize.x - rr);
    float eV = std::min(CRR_EXTFRAC * rr, halfSize.y - rr);
    return {std::max(eH, 0.0f), std::max(eV, 0.0f)};
}

float continuousRoundedRectSDF(vec2 p, vec2 c, vec2 hsz, float rr, vec2 reach) {
    vec2 q = vec2(std::fabs(p.x - c.x), std::fabs(p.y - c.y)) - hsz + rr;
    float gV = reach.y * (crrShoulder(clampf(q.x / rr, 0.0f, 1.0f)) - 1.0f);
    float gH = reach.x * (crrShoulder(clampf(q.y / rr, 0.0f, 1.0f)) - 1.0f);
    float fLower = std::sqrt(std::max(q.x, 0.0f)*std::max(q.x, 0.0f)
                            + std::max(q.y - gV, 0.0f)*std::max(q.y - gV, 0.0f)) - rr;
    float fUpper = std::sqrt(std::max(q.x - gH, 0.0f)*std::max(q.x - gH, 0.0f)
                            + std::max(q.y, 0.0f)*std::max(q.y, 0.0f)) - rr;
    float seamW = std::max(rr * 0.15f, 1.0f);
    float t = smoothstepf(-seamW, seamW, q.x - q.y);
    float corner = fUpper + (fLower - fUpper) * t;
    return std::min(std::max(q.x, q.y), 0.0f) + corner;
}

/* ============================================================
 * 5-tap gradient evaluator (CPU-safe, no dFdx)
 * ============================================================ */
static vec2 squircleCornerParams(float r, float smoothing, float maxCorner) {
    float zone = std::min(r * (1.0f + 0.528f * smoothing), maxCorner);
    float base = 1.0f - 0.29289322f * (r / std::max(zone, EPS));
    float n = -1.0f / std::log2(clampf(base, 0.5f, 1.0f - EPS));
    return {zone, n};
}

ShapeData evaluateSDF_5tap(vec2 fragPx, vec2 centerPx, vec2 halfSizePx,
                            float cornerRadius, float cornerStyle) {
    float maxCorner = std::min(halfSizePx.x, halfSizePx.y);
    float r = std::min(cornerRadius, maxCorner);
    float h = 1.0f;

    float fC, fXp, fXm, fYp, fYm;

    if (cornerStyle > 1.5f && r > 0.5f) {
        vec2 reach = continuousRoundedRectReach(r, halfSizePx);
        fC  = continuousRoundedRectSDF(fragPx,                    centerPx, halfSizePx, r, reach);
        fXp = continuousRoundedRectSDF(fragPx + vec2(h, 0.0f),    centerPx, halfSizePx, r, reach);
        fXm = continuousRoundedRectSDF(fragPx - vec2(h, 0.0f),    centerPx, halfSizePx, r, reach);
        fYp = continuousRoundedRectSDF(fragPx + vec2(0.0f, h),    centerPx, halfSizePx, r, reach);
        fYm = continuousRoundedRectSDF(fragPx - vec2(0.0f, h),    centerPx, halfSizePx, r, reach);
    } else if (cornerStyle > 0.5f && r > 0.5f) {
        vec2 zn = squircleCornerParams(r, 1.0f, maxCorner);
        fC  = squircleSDF(fragPx,                    centerPx, halfSizePx, zn.x, zn.y);
        fXp = squircleSDF(fragPx + vec2(h, 0.0f),    centerPx, halfSizePx, zn.x, zn.y);
        fXm = squircleSDF(fragPx - vec2(h, 0.0f),    centerPx, halfSizePx, zn.x, zn.y);
        fYp = squircleSDF(fragPx + vec2(0.0f, h),    centerPx, halfSizePx, zn.x, zn.y);
        fYm = squircleSDF(fragPx - vec2(0.0f, h),    centerPx, halfSizePx, zn.x, zn.y);
    } else {
        fC  = roundedRectangleSDF(fragPx,                    centerPx, halfSizePx, r);
        fXp = roundedRectangleSDF(fragPx + vec2(h, 0.0f),    centerPx, halfSizePx, r);
        fXm = roundedRectangleSDF(fragPx - vec2(h, 0.0f),    centerPx, halfSizePx, r);
        fYp = roundedRectangleSDF(fragPx + vec2(0.0f, h),    centerPx, halfSizePx, r);
        fYm = roundedRectangleSDF(fragPx - vec2(0.0f, h),    centerPx, halfSizePx, r);
    }

    vec2 grad = {(fXp - fXm) * 0.5f, (fYp - fYm) * 0.5f};
    float gL = std::max(grad.len(), EPS);

    ShapeData d;
    d.sdf       = fC;
    d.grad      = grad;
    d.normal    = grad / gL;
    d.orthoDist = fC / gL;
    return d;
}

/* ============================================================
 * REFRACTION — ported from liquid_glass_common.glsl
 * ============================================================ */

vec2 computeRefractedPosition(vec2 fragPx, vec2 normal2D, float sdf,
                               float thickness, float refractiveIndex,
                               float strength, float zoneT) {
    float h = clampf(-sdf / std::max(thickness, EPS), 0.0f, 1.0f);
    float bulge = std::sqrt(std::max(1.0f - h * h, 0.0f));
    vec3 normal3D = vec3(normal2D * bulge, h).norm();

    vec3 I = vec3(0, 0, -1);
    float eta = 1.0f / std::max(refractiveIndex, 1.0f);

    vec3 refr = refract3(I, normal3D, eta);

    float depth = thickness * strength * 5.0f * zoneT;
    return fragPx + vec2(refr.x, refr.y) * depth;
}

static vec2 computeInsetAnchor(vec2 fragPx, vec2 normal, float sdf, float insetPx) {
    return fragPx - normal * (sdf + insetPx);
}

static vec2 refractFromAnchorPx(vec2 frag, vec2 anchor, float df,
                                 float mag, float flip, float t) {
    vec2 v = frag - anchor;
    float s = std::max(df, EPS);
    vec2 refr = anchor + v / s;
    float k = smoothstepf(1.0f - flip, 1.0f, t);
    vec2 flipped = anchor - (refr - anchor);
    return refr + (flipped - refr) * k;
}

static float computeDistortionFactor(float distortion, float t) {
    float d = clampf(distortion, 0.0f, 1.0f) * 100.0f;
    return 1.0f + d * std::pow(t, d);
}

vec2 computeShapeRefraction(vec2 fragPx, vec2 normal, float sdf,
                             float insetPx, float distortionFactor,
                             float magnification, float flip, float zoneT) {
    vec2 anchor = computeInsetAnchor(fragPx, normal, sdf, insetPx);
    return refractFromAnchorPx(fragPx, anchor, distortionFactor,
                                magnification, flip, zoneT);
}

vec2 applyLensMagnification(vec2 fragPx, vec2 lensCenter, float mag) {
    float m = std::max(mag, 0.001f);
    return lensCenter + (fragPx - lensCenter) / m;
}

/* ============================================================
 * BORDER — ported from liquid_glass_border.glsl
 * ============================================================ */

static const vec3 BORDER_LUMA(0.2126f, 0.7152f, 0.0722f);

static vec3 getHighlightColor(vec3 bgColor, float targetBrightness) {
    float luminance = bgColor.dot(BORDER_LUMA);
    vec3 satBg = bgColor / std::max(luminance, 0.001f);
    satBg = bgColor + (satBg - bgColor) * 0.8f;
    float colorfulness = (bgColor - vec3(luminance)).len();
    float colorMix = clampf(colorfulness + 0.5f, 0.5f, 1.0f);
    vec3 highlight = vec3(targetBrightness) + (satBg - vec3(targetBrightness)) * colorMix;
    return vec3(clampf(highlight.x, 0.0f, 1.0f),
                clampf(highlight.y, 0.0f, 1.0f),
                clampf(highlight.z, 0.0f, 1.0f));
}

static float getLensHeight(float sd, float thickness) {
    if (sd >= 0.0f || thickness <= 0.0f) return 0.0f;
    if (sd < -thickness) return thickness;
    float x = thickness + sd;
    return std::sqrt(std::max(0.0f, thickness * thickness - x * x));
}

vec4 getClassicBorder(
    vec2 uvNorm, vec2 centerNorm, float sd, vec2 grad,
    float bw, float bs, vec4 tint,
    vec4 lightCol, vec4 shadowCol, float li,
    float ba, float ld, float oneSide, int lightMode, float doubleSide)
{
    if (bw <= 0.0f || ba <= 0.0f) return vec4(0, 0, 0, 0);
    float halfW = bw * 0.5f;
    if (sd > halfW) return vec4(0, 0, 0, 0);
    float mask = 1.0f - smoothstepf(halfW, halfW + std::max(bs, 1e-3f), std::fabs(sd));
    if (mask <= 0.001f) return vec4(0, 0, 0, 0);

    vec2 normal;
    if (lightMode == 0)
        normal = grad.norm();
    else
        normal = (uvNorm - centerNorm).norm();

    float ang = std::atan2(normal.y, normal.x);
    ang -= ld * PI / 180.0f;
    ang = std::fmod(ang, 2.0f * PI);
    if (ang < 0) ang += 2.0f * PI;
    float tAngle = ang / (2.0f * PI);

    vec4 c0, c1;
    if (tint.w > 0.0f) {
        c0 = tint; c1 = tint;
    } else {
        c0 = lightCol; c1 = shadowCol;
    }

    vec4 col;
    if (tAngle <= 0.25f)
        col = c0 + (c1 - c0) * (tAngle / 0.25f);
    else if (tAngle <= 0.50f)
        col = c1 + (c0 - c1) * ((tAngle - 0.25f) / 0.25f);
    else if (tAngle <= 0.75f)
        col = c0 + (c1 - c0) * ((tAngle - 0.50f) / 0.25f);
    else
        col = c1 + (c0 - c1) * ((tAngle - 0.75f) / 0.25f);

    float lightRad = ld * PI / 180.0f;
    vec2 lightDirV(std::cos(lightRad), std::sin(lightRad));

    if (oneSide > 0.0f) {
        float spec = std::max(normal.dot(lightDirV), 0.0f);
        spec = std::pow(spec, 8.0f);
        col.x += lightCol.x * spec * li * (0.8f * oneSide);
        col.y += lightCol.y * spec * li * (0.8f * oneSide);
        col.z += lightCol.z * spec * li * (0.8f * oneSide);
    }

    if (doubleSide > 0.0f) {
        float sf = std::max(normal.dot(lightDirV), 0.0f);
        sf = std::pow(sf, 8.0f);
        float sb = std::max(normal.dot(-lightDirV), 0.0f);
        sb = std::pow(sb, 8.0f);
        float s = (sf + sb) * li * 0.8f * doubleSide;
        col.x += lightCol.x * s;
        col.y += lightCol.y * s;
        col.z += lightCol.z * s;
    }

    col.x *= li; col.y *= li; col.z *= li;
    float a = col.w * ba * mask;
    return vec4(col.x * a, col.y * a, col.z * a, a);
}

vec4 getOpticalBorder(
    vec2 uvNorm, vec2 centerNorm, float sd, vec2 grad,
    float bw, float bs, vec4 tint,
    vec4 lightCol, vec4 shadowCol, float li,
    float ba, float ld, float oneSide, int lightMode,
    vec3 ambient, float ai, float doubleSide,
    float sat, float solidity, float spread)
{
    if (bw <= 0.0f || ba <= 0.0f) return vec4(0, 0, 0, 0);

    float rimWidth = std::max(bw, 1.0f);
    float k = 0.89f;
    float x = sd / rimWidth;
    float rimFactor = 1.0f / (1.0f + k * x * x);

    float innerFade = 1.0f - smoothstepf(bw * 1.5f, bw * 3.0f, std::max(-sd, 0.0f));
    rimFactor *= innerFade;
    float outerFade = 1.0f - smoothstepf(0.0f, std::max(bs, 1.0f), std::max(sd, 0.0f));
    rimFactor *= outerFade;
    if (rimFactor <= 0.001f) return vec4(0, 0, 0, 0);

    vec2 normal;
    if (lightMode == 0)
        normal = grad.norm();
    else
        normal = (uvNorm - centerNorm).norm();

    float lightRad = ld * PI / 180.0f;
    vec2 lightDirV(std::cos(lightRad), std::sin(lightRad));

    float thickness = bw;
    float height = getLensHeight(sd, thickness);
    float normalizedH = thickness > 0.0f ? height / thickness : 0.0f;
    float shapeMask = clampf((1.0f - normalizedH) * 1.111f, 0.0f, 1.0f);
    float thicknessFactor = clampf((thickness - 2.0f) * 0.5f, 0.0f, 1.0f);

    vec3 highlightCol(1.0f);
    if (ambient.dot(ambient) > 1e-5f)
        highlightCol = getHighlightColor(ambient, 1.0f);
    highlightCol = highlightCol * lightCol.rgb();

    if (tint.w > 0.0f)
        highlightCol = highlightCol + (tint.rgb() - highlightCol) * clampf(tint.w, 0.0f, 1.0f);

    if (sat != 1.0f) {
        float rimLuma = highlightCol.dot(BORDER_LUMA);
        highlightCol = vec3(rimLuma) + (highlightCol - vec3(rimLuma)) * sat;
    }

    float sp = clampf(spread, 0.0f, 1.0f);
    float spreadExp = 2.5f + (0.5f - 2.5f) * sp;
    float lobeCut = (0.5f - std::min(sp, 0.5f)) * 1.7f;

    float mainLight = std::max(normal.dot(lightDirV), 0.0f);
    float oppositeLight = std::max(normal.dot(-lightDirV), 0.0f);
    mainLight = clampf((mainLight - lobeCut) / (1.0f - lobeCut), 0.0f, 1.0f);
    oppositeLight = clampf((oppositeLight - lobeCut) / (1.0f - lobeCut), 0.0f, 1.0f);
    float totalInfluence = mainLight + oppositeLight * 0.8f;

    float directional = std::pow(totalInfluence, spreadExp) * li * 3.0f;
    float ambientL = ai * 0.1f;
    float lightStrength = directional + ambientL;

    if (oneSide > 0.0f) {
        float spec1 = std::max(normal.dot(lightDirV), 0.0f);
        spec1 = std::pow(spec1, 8.0f);
        lightStrength += spec1 * li * (0.8f * oneSide);
    }
    if (doubleSide > 0.0f) {
        float sf = std::max(normal.dot(lightDirV), 0.0f);
        sf = std::pow(sf, 8.0f);
        float sb = std::max(normal.dot(-lightDirV), 0.0f);
        sb = std::pow(sb, 8.0f);
        lightStrength += (sf + sb) * li * (0.8f * doubleSide);
    }

    float cappedLight = clampf(lightStrength, 0.0f, 1.0f);
    float effectiveLight = cappedLight + (lightStrength - cappedLight) * clampf(solidity, 0.0f, 1.0f);
    float spatialMask = rimFactor * thicknessFactor * shapeMask;
    float a = clampf(ba * effectiveLight * spatialMask, 0.0f, 1.0f);
    return vec4(highlightCol.x * a, highlightCol.y * a, highlightCol.z * a, a);
}

/* ============================================================
 * Compositing (from liquid_glass_border.glsl)
 * ============================================================ */
static vec4 overlayPremulClassic(vec4 base, vec4 over) {
    float outA = over.w + base.w * (1.0f - over.w);
    vec3 outRGB = over.rgb() + base.rgb() * (1.0f - over.w);
    return vec4(outRGB.x, outRGB.y, outRGB.z, outA);
}

static vec4 overlayPremulOptical(vec4 base, vec4 over) {
    float baseA = base.w;
    float strength = clampf(over.w, 0.0f, 1.0f);
    if (baseA <= 1e-4f || strength <= 1e-4f) return base;
    vec3 baseColor = base.rgb() / std::max(baseA, 1e-4f);
    vec3 rimColor = over.rgb() / std::max(over.w, 1e-4f);
    vec3 mixed = baseColor + (rimColor - baseColor) * strength;
    return vec4(mixed.x * baseA, mixed.y * baseA, mixed.z * baseA, baseA);
}

static vec4 overlayPremul(vec4 base, vec4 over, int borderMode) {
    return borderMode >= 1 ? overlayPremulOptical(base, over) : overlayPremulClassic(base, over);
}

/* ============================================================
 * STICKER MATERIAL — ported from pandly_sticker_material.frag
 * ============================================================ */

static float hash21proper(vec2 p) {
    float h = std::sin(p.x * 127.1f + p.y * 311.7f) * 43758.5453f;
    return h - std::floor(h);
}

static float valueNoise(vec2 p) {
    float ix = std::floor(p.x), iy = std::floor(p.y);
    float fx = p.x - ix, fy = p.y - iy;
    fx = fx * fx * (3.0f - 2.0f * fx);
    fy = fy * fy * (3.0f - 2.0f * fy);
    float a = hash21proper(vec2(ix,      iy));
    float b = hash21proper(vec2(ix + 1,  iy));
    float c = hash21proper(vec2(ix,      iy + 1));
    float d = hash21proper(vec2(ix + 1,  iy + 1));
    float ab = a + (b - a) * fx;
    float cd = c + (d - c) * fx;
    return ab + (cd - ab) * fy;
}

static float fbm4(vec2 p) {
    float sum = 0.0f;
    float amp = 0.5f;
    for (int i = 0; i < 4; i++) {
        sum += valueNoise(p) * amp;
        p = vec2(p.x * 2.03f + 17.1f, p.y * 2.03f + 9.2f);
        amp *= 0.5f;
    }
    return sum;
}

vec3 stickerBevelNormal(vec2 uv, vec2 texelSize, float bevelStrength) {
    float dx = texelSize.x * bevelStrength;
    float dy = texelSize.y * bevelStrength;
    return vec3(-dx, -dy, 1.0f).norm();
}

vec3 stickerPhong(vec3 N, vec3 L, vec3 V, float power, float strength) {
    float diff = std::max(N.dot(L), 0.0f);
    vec3 R = L - N * (2.0f * N.dot(L));
    float spec = std::pow(std::max(R.dot(V), 0.0f), power) * strength;
    return vec3(diff + spec);
}

vec3 fbmGrain(vec2 uv, float noiseScale, float time) {
    vec2 offset(time * 0.013f, time * -0.009f);
    float grain = fbm4(uv * noiseScale + offset) - 0.5f;
    return vec3(grain);
}

/* ============================================================
 * SPRING PHYSICS — second-order ODE
 * ============================================================ */
SpringState springStep(SpringParams p, SpringState s, float dt) {
    float k = p.stiffness;
    float c = p.damping;
    float m = std::max(p.mass, 0.01f);

    /* Semi-implicit Euler (symplectic) */
    float accel = (k * (s.target - s.position) - c * s.velocity) / m;
    float newVel = s.velocity + accel * dt;
    float newPos = s.position + newVel * dt;

    return SpringState(newPos, newVel, s.target);
}

/* ============================================================
 * TEXTURE SAMPLING HELPERS
 * ============================================================ */
static vec4 sampleBilinear(const uint8_t* buf, int bufW, int bufH,
                            float px, float py) {
    int x0 = clampf((int)std::floor(px), 0, bufW - 1);
    int y0 = clampf((int)std::floor(py), 0, bufH - 1);
    int x1 = std::min(x0 + 1, bufW - 1);
    int y1 = std::min(y0 + 1, bufH - 1);
    float fx = px - std::floor(px);
    float fy = py - std::floor(py);

    auto g = [&](int x, int y) -> vec4 {
        int off = (y * bufW + x) * 4;
        return vec4(buf[off]/255.f, buf[off+1]/255.f, buf[off+2]/255.f, buf[off+3]/255.f);
    };

    vec4 c00 = g(x0, y0), c10 = g(x1, y0);
    vec4 c01 = g(x0, y1), c11 = g(x1, y1);

    vec4 top = c00 + (c10 - c00) * fx;
    vec4 bot = c01 + (c11 - c01) * fx;
    return top + (bot - top) * fy;
}

/* Chromatic aberration — from liquid_glass.frag */
static vec3 applyChromaticAberration(const uint8_t* buf, int bufW, int bufH,
                                      vec2 uv, float shift) {
    vec3 c = sampleBilinear(buf, bufW, bufH, uv.x * bufW, uv.y * bufH).rgb();
    if (shift < 0.001f) return c;
    float luma = c.dot(vec3(0.2126f, 0.7152f, 0.0722f));
    vec2 offset(shift * luma, shift * luma);
    float r = sampleBilinear(buf, bufW, bufH,
                              (uv.x + offset.x) * bufW, (uv.y + offset.y) * bufH).x;
    float g = c.y;
    float b = sampleBilinear(buf, bufW, bufH,
                              (uv.x - offset.x) * bufW, (uv.y - offset.y) * bufH).z;
    return vec3(r, g, b);
}

/* Saturation — from liquid_glass.frag */
static vec3 applySaturation(vec3 c, float sat) {
    float lum = c.dot(vec3(0.299f, 0.587f, 0.114f));
    return vec3(lum) + (c - vec3(lum)) * sat;
}

/* Gaussian-weighted box blur (sigma-driven) */
static vec3 boxBlur(const uint8_t* buf, int bufW, int bufH,
                     vec2 center, float sigma) {
    if (sigma < 0.5f) {
        return sampleBilinear(buf, bufW, bufH, center.x, center.y).rgb();
    }
    int radius = (int)(sigma * 2.0f);
    if (radius > 8) radius = 8;
    vec3 sum(0.0f);
    float wsum = 0.0f;
    float invSigma2 = 1.0f / (2.0f * sigma * sigma);
    for (int dy = -radius; dy <= radius; dy++) {
        for (int dx = -radius; dx <= radius; dx++) {
            float d2 = (float)(dx*dx + dy*dy);
            float w = std::exp(-d2 * invSigma2);
            vec4 s = sampleBilinear(buf, bufW, bufH,
                                     center.x + (float)dx, center.y + (float)dy);
            sum = sum + s.rgb() * w;
            wsum += w;
        }
    }
    return sum * (1.0f / wsum);
}

/* ============================================================
 * DARK EDGE & EDGE HIGHLIGHT
 * ============================================================ */
static float edgeHighlight(float sdf, float edgeBand) {
    float t = clampf(-sdf / std::max(edgeBand, EPS), 0.0f, 1.0f);
    return t * t * (3.0f - 2.0f * t);
}

static float darkEdge(float sdf, float edgeBand) {
    float t = clampf(-sdf / std::max(edgeBand, EPS), 0.0f, 1.0f);
    float inner = 1.0f - t;
    return inner * inner * inner;
}

/* ============================================================
 * CONTRAST ADAPTATION
 * WCAG AA minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text.
 * Contrast floor ensures the glass layer never drops below readable luminance.
 * ============================================================ */
static vec3 contrastAdapt(vec3 glass, vec3 foreground,
                            float accessibility, float environment) {
    float lumaG = glass.dot(vec3(0.299f, 0.587f, 0.114f));
    float lumaF = foreground.dot(vec3(0.299f, 0.587f, 0.114f));
    float boost = 1.0f + accessibility * 0.3f;
    float adapt = 1.0f + environment * (lumaG - 0.5f) * 0.2f;
    vec3 adapted = glass * (boost * adapt);

    /* WCAG AA contrast floor: ensure minimum 4.5:1 contrast against foreground */
    const float MIN_CONTRAST_RATIO = 4.5f;
    float lumaA = adapted.dot(vec3(0.299f, 0.587f, 0.114f));
    float ratio = (std::max(lumaA, lumaF) + 0.05f) / (std::min(lumaA, lumaF) + 0.05f);
    if (ratio < MIN_CONTRAST_RATIO && lumaA < lumaF) {
        float targetLuma = MIN_CONTRAST_RATIO * (lumaF + 0.05f) - 0.05f;
        float scale = (lumaA > 0.001f) ? targetLuma / lumaA : 1.0f;
        adapted = vec3(clampf(adapted.x * scale, 0.0f, 1.0f),
                       clampf(adapted.y * scale, 0.0f, 1.0f),
                       clampf(adapted.z * scale, 0.0f, 1.0f));
    }

    return vec3(clampf(adapted.x, 0.0f, 1.0f),
                clampf(adapted.y, 0.0f, 1.0f),
                clampf(adapted.z, 0.0f, 1.0f));
}

/* ============================================================
 * MAIN PIPELINE — liquid_glass_render()
 *
 * Pipeline:
 *   N = normal(SDF(p))
 *   R = k_r * N_xy * f(edge) * f(interaction)
 *   C_refracted = Texture(B, uv + R)
 *   C_diffused  = Blur(C_refracted, sigma)
 *   F = F_0 + (1-F_0) * pow(1-dot(N,V), 5)
 *   S = Specular(N, L, V, roughness)
 *   E = EdgeHighlight(SDF)
 *   D = DarkEdge(SDF)
 *   C_glass = Transmission(C_diffused) + ColorBleed + F*S + E - D
 *   C_final = ContrastAdapt(C_glass, foreground, accessibility, environment)
 * ============================================================ */
void liquid_glass_render(
    const GlassLens& lens,
    const uint8_t* backdrop, int backdropW, int backdropH,
    uint8_t* out, int lensW, int lensH)
{
    const GlassTokens& tok = lens.tokens;

    float invResY = 1.0f / (float)lensH;
    vec2 lensHalfSize((float)lensW * 0.5f, (float)lensH * 0.5f);
    vec2 lensCenter   = vec2(lens.x, lens.y) + lensHalfSize;
    vec2 lensTopLeft(lens.x, lens.y);

    /* Light position: pointer + inertial shift */
    vec2 lightPos(lens.pointer.x + lens.highlightShiftX,
                  lens.pointer.y + lens.highlightShiftY);

    /* Fresnel F0 from IOR: ((n-1)/(n+1))^2 */
    float ior = std::max(tok.refractiveIndex, 1.0f);
    float f0 = std::pow((ior - 1.0f) / (ior + 1.0f), 2.0f);
    float roughness = 0.35f;

    for (int py = 0; py < lensH; py++) {
        for (int px = 0; px < lensW; px++) {
            vec2 fragPx((float)px, (float)py);
            vec2 fragGlobal = fragPx + lensTopLeft;

            /* SDF evaluation */
            ShapeData shape = evaluateSDF_5tap(
                fragGlobal, lensCenter, lensHalfSize,
                tok.cornerRadius, tok.cornerStyle);

            /* Shape mask (1px AA band centered on edge) */
            float shapeMask = 1.0f - smoothstepf(-0.5f, 0.5f, shape.orthoDist);

            if (shapeMask <= 0.001f) {
                int off = (py * lensW + px) * 4;
                out[off] = out[off+1] = out[off+2] = out[off+3] = 0;
                continue;
            }

            /* Distortion zone */
            float distAbs = std::fabs(shape.orthoDist);
            float zoneLimit = tok.distortionWidth;
            float zoneT = 1.0f - clampf(distAbs / std::max(zoneLimit, EPS), 0.0f, 1.0f);

            /* Magnification */
            vec2 magPx = applyLensMagnification(fragGlobal, lensCenter, tok.magnification);

            /* ---- N = normal(SDF(p)) ---- */
            float nz = std::sqrt(std::max(1.0f - shape.normal.dot(shape.normal), 0.0f));
            vec3 N(shape.normal.x, shape.normal.y, nz);
            N = N.norm();
            if (N.len() < 0.5f) N = vec3(0, 0, 1);

            /* ---- R = k_r * N_xy * f(edge) * f(interaction) ---- */
            float k_r = tok.distortion * zoneT;
            float fEdge = edgeHighlight(shape.sdf, zoneLimit);
            float fInteraction = 1.0f;
            vec2 R = vec2(N.x, N.y) * (k_r * fEdge * fInteraction);

            /* ---- C_refracted = Texture(B, uv + R) ---- */
            vec2 refrPx;
            if (tok.refractionType == 1) {
                /* Optical (Snell's law) */
                vec2 optNormal = shape.normal;
                if (tok.refractionMode == 1) {
                    vec2 radial = magPx - lensCenter;
                    float rl = radial.len();
                    if (rl > EPS) optNormal = radial / rl;
                }
                refrPx = computeRefractedPosition(
                    magPx, optNormal, shape.sdf,
                    tok.distortionWidth, tok.refractiveIndex,
                    tok.distortion, zoneT);
            } else if (tok.refractionMode == 0) {
                float df = computeDistortionFactor(tok.distortion, zoneT);
                refrPx = computeShapeRefraction(
                    magPx, shape.normal, shape.sdf,
                    tok.distortionWidth, df,
                    tok.magnification, 0.0f, zoneT);
            } else {
                float df = computeDistortionFactor(tok.distortion, zoneT);
                refrPx = refractFromAnchorPx(
                    magPx, lensCenter, df,
                    tok.magnification, 0.0f, zoneT);
            }

            /* Map refracted pixel to backdrop UV [0,1] */
            vec2 sampleUV(
                clampf((refrPx.x - lensTopLeft.x) / (float)backdropW, 0.001f, 0.999f),
                clampf((refrPx.y - lensTopLeft.y) / (float)backdropH, 0.001f, 0.999f));

            vec3 C_refracted = applyChromaticAberration(
                backdrop, backdropW, backdropH, sampleUV,
                tok.chromaticAberration * zoneT);
            C_refracted = applySaturation(C_refracted, tok.saturation);

            /* ---- C_diffused = Blur(C_refracted, sigma) ---- */
            vec2 blurCenter(sampleUV.x * (float)backdropW, sampleUV.y * (float)backdropH);
            float sigma = tok.distortion * 2.0f * zoneT;
            vec3 C_diffused = boxBlur(backdrop, backdropW, backdropH, blurCenter, sigma);

            /* ---- F = F_0 + (1-F_0) * pow(1-dot(N,V), 5) ---- */
            vec3 V(0, 0, 1);
            float ndv = std::max(N.dot(V), 0.0f);
            float fresnel = f0 + (1.0f - f0) * std::pow(1.0f - ndv, 5.0f);

            /* ---- S = Specular(N, L, V, roughness) ---- */
            vec3 L = vec3(lightPos.x - fragGlobal.x, lightPos.y - fragGlobal.y, 0.0f).norm();
            vec3 H = (L + V).norm();
            float ndh = std::max(N.dot(H), 0.0f);
            float specPower = 2.0f / (roughness * roughness) - 2.0f;
            if (specPower < 1.0f) specPower = 1.0f;
            float S = std::pow(ndh, specPower);

            /* ---- E = EdgeHighlight(SDF) ---- */
            float E = edgeHighlight(shape.sdf, tok.borderWidth);

            /* ---- D = DarkEdge(SDF) ---- */
            float D = darkEdge(shape.sdf, tok.borderWidth);

            /* ---- Transmission ---- */
            float transmission = clampf(shapeMask, 0.0f, 1.0f);

            /* ---- ColorBleed ---- */
            vec3 colorBleed = C_refracted * (0.05f * zoneT);

            /* ---- C_glass = Transmission(C_diffused) + ColorBleed + F*S + E - D ---- */
            vec3 C_glass = C_diffused * transmission
                         + colorBleed
                         + vec3(fresnel * S * 0.6f)
                         + vec3(E * 0.12f)
                         - vec3(D * 0.08f);

            /* ---- C_final = ContrastAdapt(C_glass, fg, access, env) ---- */
            vec3 fg = sampleBilinear(backdrop, backdropW, backdropH,
                                      fragGlobal.x, fragGlobal.y).rgb();
            vec3 C_final = contrastAdapt(C_glass, fg, 0.0f, tok.ambientIntensity);

            /* Border compositing */
            if (tok.borderWidth > 0.0f) {
                vec2 uvNorm((float)px * invResY, (float)py * invResY);
                vec2 centerNorm = lensCenter * invResY;
                vec4 tint(0, 0, 0, 0);
                vec4 lightCol(1, 1, 1, 1);
                vec4 shadowCol(0.3f, 0.3f, 0.35f, 1);

                vec4 borderPremul;
                if (tok.borderMode >= 1) {
                    borderPremul = getOpticalBorder(
                        uvNorm, centerNorm, shape.orthoDist, shape.grad,
                        tok.borderWidth, tok.borderSoftness, tint,
                        lightCol, shadowCol, tok.lightIntensity,
                        1.0f, tok.lightDirectionDeg, 0.3f, tok.lightMode,
                        fg, tok.ambientIntensity, 0.2f,
                        tok.borderSaturation, tok.borderSolidity, tok.lightSpread);
                } else {
                    borderPremul = getClassicBorder(
                        uvNorm, centerNorm, shape.orthoDist, shape.grad,
                        tok.borderWidth, tok.borderSoftness, tint,
                        lightCol, shadowCol, tok.lightIntensity,
                        1.0f, tok.lightDirectionDeg, 0.3f, tok.lightMode, 0.2f);
                }

                vec4 base(C_final.x * shapeMask, C_final.y * shapeMask,
                          C_final.z * shapeMask, shapeMask);
                vec4 composited = overlayPremul(base, borderPremul, tok.borderMode);
                float invA = 1.0f / std::max(composited.w, 0.001f);
                C_final = composited.rgb() * invA * shapeMask;
            }

            /* Write output pixel (premultiplied alpha) */
            int off = (py * lensW + px) * 4;
            out[off]   = (uint8_t)clampf(C_final.x * 255.0f * shapeMask, 0.0f, 255.0f);
            out[off+1] = (uint8_t)clampf(C_final.y * 255.0f * shapeMask, 0.0f, 255.0f);
            out[off+2] = (uint8_t)clampf(C_final.z * 255.0f * shapeMask, 0.0f, 255.0f);
            out[off+3] = (uint8_t)clampf(shapeMask * 255.0f, 0.0f, 255.0f);
        }
    }
}
