/* liquid_engine.h — Pandly 2.5D Liquid Glass Engine
 * Compile to WebAssembly via Emscripten.
 *
 * Style: Linus Torvalds. 8-space tabs, C99/C++ idiomático,
 *        cero abstracciones infladas. Structs fat, functions flat.
 */
#ifndef LIQUID_ENGINE_H
#define LIQUID_ENGINE_H

#include <cstdint>
#include <cmath>
#include <cstring>
#include <algorithm>

/* ============================================================
 * Constants
 * ============================================================ */
static const float PI        = 3.14159265f;
static const float EPS       = 1e-6f;
static const float EPS_T     = 1e-3f;
static const float INV_PI    = 0.31830988f;

/* Superellipse exponent presets (from pandly_geometry.dart) */
static const float SE_ORGANIC  = 3.5f;
static const float SE_SQUIRCLE = 4.0f;
static const float SE_BUTTON   = 4.2f;
static const float SE_CARD     = 4.5f;
static const float SE_DOCK     = 4.6f;
static const float SE_MODAL    = 4.8f;

/* Bézier control-point formula from pandly_geometry.dart:
 * k = clamp((n - 2.0) / 4.0, 0.0, 1.0)
 * cpLength = r * (0.55 + 0.15 * k) */
static inline float superellipse_cp_length(float r, float exponent) {
    float k = std::min(1.0f, std::max(0.0f, (exponent - 2.0f) / 4.0f));
    return r * (0.55f + 0.15f * k);
}

/* ============================================================
 * Math types
 * ============================================================ */
struct vec2 {
    float x, y;
    vec2() : x(0), y(0) {}
    vec2(float a, float b) : x(a), y(b) {}
    vec2 operator+(vec2 o)  const { return {x+o.x, y+o.y}; }
    vec2 operator-(vec2 o)  const { return {x-o.x, y-o.y}; }
    vec2 operator*(float s) const { return {x*s, y*s}; }
    vec2 operator/(float s) const { return {x/s, y/s}; }
    vec2 operator-()        const { return {-x, -y}; }
    float dot(vec2 o)  const { return x*o.x + y*o.y; }
    float len()        const { return std::sqrt(x*x + y*y); }
    vec2  norm()       const { float l=len(); return l>EPS?*this/l:vec2(0,0); }
};

struct vec3 {
    float x, y, z;
    vec3() : x(0), y(0), z(0) {}
    vec3(float a) : x(a), y(a), z(a) {}
    vec3(float a, float b, float c) : x(a), y(b), z(c) {}
    vec3(vec2 v, float c) : x(v.x), y(v.y), z(c) {}
    vec3 operator+(vec3 o)  const { return {x+o.x, y+o.y, z+o.z}; }
    vec3 operator-(vec3 o)  const { return {x-o.x, y-o.y, z-o.z}; }
    vec3 operator*(float s) const { return {x*s, y*s, z*s}; }
    vec3 operator*(vec3 o)  const { return {x*o.x, y*o.y, z*o.z}; }
    vec3 operator/(float s) const { return {x/s, y/s, z/s}; }
    vec3 operator-()        const { return {-x, -y, -z}; }
    float dot(vec3 o) const { return x*o.x + y*o.y + z*o.z; }
    vec3  cross(vec3 o) const {
        return {y*o.z-z*o.y, z*o.x-x*o.z, x*o.y-y*o.x};
    }
    float len()  const { return std::sqrt(x*x + y*y + z*z); }
    vec3  norm() const { float l=len(); return l>EPS?*this/l:vec3(0,0,1); }
};

struct vec4 {
    float x, y, z, w;
    vec4() : x(0), y(0), z(0), w(0) {}
    vec4(float a, float b, float c, float d) : x(a), y(b), z(c), w(d) {}
    vec3 rgb() const { return {x,y,z}; }
};

/* ============================================================
 * GLSL-style refract()
 * ============================================================ */
static inline vec3 refract3(vec3 I, vec3 N, float eta) {
    float ndi = I.dot(N);
    float k = 1.0f - eta * eta * (1.0f - ndi * ndi);
    if (k < 0.0f) return vec3(0, 0, 0);
    return I * eta - N * (eta * ndi + std::sqrt(k));
}

/* ============================================================
 * Shape SDF data
 * ============================================================ */
struct ShapeData {
    float sdf;
    vec2  grad;
    vec2  normal;
    float orthoDist;
};

/* ============================================================
 * Glass appearance tokens (from rolu_glass_tokens.dart)
 * ============================================================ */
struct GlassTokens {
    float distortion;
    float distortionWidth;
    float chromaticAberration;
    float magnification;
    float borderWidth;
    float borderSoftness;
    float lightIntensity;
    float lightDirectionDeg;
    float ambientIntensity;
    float saturation;
    float refractiveIndex;
    float lightSpread;
    float borderSaturation;
    float borderSolidity;
    float cornerStyle;
    float cornerRadius;
    float depthScale;
    int   refractionMode;
    int   refractionType;
    int   lightMode;
    int   borderMode;

    GlassTokens() :
        distortion(0.08f), distortionWidth(26.0f),
        chromaticAberration(0.002f), magnification(1.0f),
        borderWidth(3.0f), borderSoftness(2.0f),
        lightIntensity(0.85f), lightDirectionDeg(135.0f),
        ambientIntensity(0.15f), saturation(1.0f),
        refractiveIndex(1.5f), lightSpread(0.5f),
        borderSaturation(1.0f), borderSolidity(0.0f),
        cornerStyle(1.0f), cornerRadius(20.0f), depthScale(1.0f),
        refractionMode(0), refractionType(1),
        lightMode(0), borderMode(1) {}
};

struct GlassPresets {
    static GlassTokens standardCard() {
        GlassTokens t;
        t.distortion = 0.08f;
        t.distortionWidth = 26.0f;
        t.chromaticAberration = 0.002f;
        t.borderWidth = 3.0f;
        t.lightIntensity = 0.85f;
        t.cornerStyle = 1.0f;
        t.cornerRadius = 20.0f;
        return t;
    }
    static GlassTokens interactiveButton() {
        GlassTokens t;
        t.distortion = 0.12f;
        t.distortionWidth = 18.0f;
        t.chromaticAberration = 0.003f;
        t.borderWidth = 2.5f;
        t.lightIntensity = 0.9f;
        t.cornerStyle = 1.0f;
        t.cornerRadius = 16.0f;
        return t;
    }
    static GlassTokens adaptiveDock() {
        GlassTokens t;
        t.distortion = 0.06f;
        t.distortionWidth = 30.0f;
        t.chromaticAberration = 0.001f;
        t.borderWidth = 4.0f;
        t.lightIntensity = 0.8f;
        t.cornerStyle = 2.0f;
        t.cornerRadius = 28.0f;
        return t;
    }
};

/* ============================================================
 * Spring physics (from pandly_motion.dart)
 * ============================================================ */
struct SpringParams {
    float mass;
    float stiffness;
    float damping;
    SpringParams() : mass(1.0f), stiffness(320.0f), damping(22.0f) {}
    SpringParams(float m, float s, float d) : mass(m), stiffness(s), damping(d) {}
};

struct SpringPreset {
    static SpringParams dockMorph() {
        float wn = std::sqrt(260.0f * 1.25f);
        return {1.25f, 260.0f, 2.0f * 0.92f * wn};
    }
    static SpringParams lensTravel() {
        float wn = std::sqrt(320.0f * 1.0f);
        return {1.0f, 320.0f, 2.0f * 0.81f * wn};
    }
    static SpringParams reaction() {
        return {0.82f, 410.0f, 28.0f};
    }
    static SpringParams pressFeedback() {
        float wn = std::sqrt(500.0f * 1.0f);
        return {1.0f, 500.0f, 2.0f * 1.0f * wn};
    }
    static SpringParams jelly() {
        float wn = std::sqrt(260.0f * 1.0f);
        return {1.0f, 260.0f, 2.0f * 0.76f * wn};
    }
};

struct SpringState {
    float position;
    float velocity;
    float target;
    SpringState() : position(0), velocity(0), target(0) {}
    SpringState(float p, float v, float t) : position(p), velocity(v), target(t) {}
};

/* ============================================================
 * Inertial optics controller (from inertial_optics_controller.dart)
 * ============================================================ */
struct InertialOptics {
    static const float W_NATURAL;
    static const float ZETA;
    static const float MAX_SHIFT_MM;
    static const float MM_TO_PX;

    vec2 position;
    vec2 velocity;
    vec2 target;
    float posEps;
    float velEps;
    bool  settled;

    InertialOptics() : settled(true) {
        posEps = 1.5f * 5.6693f * 0.002f;
        velEps = 1.5f * 5.6693f * 0.02f;
    }

    void update(float dt, vec2 accelTarget) {
        if (settled) return;
        target = accelTarget;
        float c = 2.0f * ZETA * W_NATURAL;
        float k = W_NATURAL * W_NATURAL;
        vec2 error = {target.x - position.x, target.y - position.y};
        vec2 accel = {error.x * k - velocity.x * c,
                      error.y * k - velocity.y * c};
        velocity.x += accel.x * dt;
        velocity.y += accel.y * dt;
        position.x += velocity.x * dt;
        position.y += velocity.y * dt;
        if (std::fabs(position.x - target.x) < posEps &&
            std::fabs(position.y - target.y) < posEps &&
            std::fabs(velocity.x) < velEps &&
            std::fabs(velocity.y) < velEps) {
            position = target;
            velocity = {0, 0};
            settled = true;
        }
    }

    void nudge(vec2 v) {
        velocity = velocity + v;
        settled = false;
    }
};

/* ============================================================
 * GlassLens — the renderable unit
 * ============================================================ */
struct GlassLens {
    float x, y;
    float width, height;
    GlassTokens tokens;
    vec2  pointer;
    float time;
    float highlightShiftX;
    float highlightShiftY;

    GlassLens() : x(0), y(0), width(200), height(200),
                  time(0), highlightShiftX(0), highlightShiftY(0) {}
};

/* ============================================================
 * Engine API
 * ============================================================ */
float roundedRectangleSDF(vec2 p, vec2 c, vec2 h, float r);
float squircleSDF(vec2 p, vec2 c, vec2 h, float zone, float n);
float continuousRoundedRectSDF(vec2 p, vec2 c, vec2 h, float rr, vec2 reach);
ShapeData evaluateSDF_5tap(vec2 fragPx, vec2 centerPx, vec2 halfSizePx,
                            float cornerRadius, float cornerStyle);
vec2  computeRefractedPosition(vec2 fragPx, vec2 normal2D, float sdf,
                                float thickness, float refractiveIndex,
                                float strength, float zoneT);
vec2  computeShapeRefraction(vec2 fragPx, vec2 normal, float sdf,
                              float insetPx, float distortionFactor,
                              float magnification, float flip, float zoneT);
vec2  applyLensMagnification(vec2 fragPx, vec2 lensCenter, float mag);
vec3  stickerBevelNormal(vec2 uv, vec2 texelSize, float bevelStrength);
vec3  stickerPhong(vec3 N, vec3 L, vec3 V, float power, float strength);
vec3  fbmGrain(vec2 uv, float noiseScale, float time);
SpringState springStep(SpringParams p, SpringState s, float dt);
void liquid_glass_render(
    const GlassLens& lens,
    const uint8_t* backdrop, int backdropW, int backdropH,
    uint8_t* out, int lensW, int lensH);

/* ============================================================
 * Emscripten embind
 * ============================================================ */
#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
EMSCRIPTEN_BINDINGS(liquid_engine) {
    emscripten::class_<GlassTokens>("GlassTokens")
        .constructor<>()
        .property("distortion", &GlassTokens::distortion)
        .property("distortionWidth", &GlassTokens::distortionWidth)
        .property("chromaticAberration", &GlassTokens::chromaticAberration)
        .property("magnification", &GlassTokens::magnification)
        .property("borderWidth", &GlassTokens::borderWidth)
        .property("borderSoftness", &GlassTokens::borderSoftness)
        .property("lightIntensity", &GlassTokens::lightIntensity)
        .property("lightDirectionDeg", &GlassTokens::lightDirectionDeg)
        .property("ambientIntensity", &GlassTokens::ambientIntensity)
        .property("saturation", &GlassTokens::saturation)
        .property("refractiveIndex", &GlassTokens::refractiveIndex)
        .property("lightSpread", &GlassTokens::lightSpread)
        .property("borderSaturation", &GlassTokens::borderSaturation)
        .property("borderSolidity", &GlassTokens::borderSolidity)
        .property("cornerStyle", &GlassTokens::cornerStyle)
        .property("cornerRadius", &GlassTokens::cornerRadius)
        .property("depthScale", &GlassTokens::depthScale)
        .property("refractionMode", &GlassTokens::refractionMode)
        .property("refractionType", &GlassTokens::refractionType)
        .property("lightMode", &GlassTokens::lightMode)
        .property("borderMode", &GlassTokens::borderMode);

    emscripten::class_<GlassLens>("GlassLens")
        .constructor<>()
        .property("x", &GlassLens::x)
        .property("y", &GlassLens::y)
        .property("width", &GlassLens::width)
        .property("height", &GlassLens::height)
        .property("pointer", &GlassLens::pointer)
        .property("time", &GlassLens::time)
        .property("tokens", &GlassLens::tokens);

    emscripten::class_<SpringState>("SpringState")
        .constructor<>()
        .constructor<float, float, float>()
        .property("position", &SpringState::position)
        .property("velocity", &SpringState::velocity)
        .property("target", &SpringState::target);

    emscripten::class_<SpringParams>("SpringParams")
        .constructor<>()
        .constructor<float, float, float>()
        .property("mass", &SpringParams::mass)
        .property("stiffness", &SpringParams::stiffness)
        .property("damping", &SpringParams::damping);

    emscripten::class_<vec2>("Vec2")
        .constructor<>()
        .constructor<float, float>()
        .property("x", &vec2::x)
        .property("y", &vec2::y);

    emscripten::class_<vec3>("Vec3")
        .constructor<>()
        .constructor<float, float, float>()
        .property("x", &vec3::x)
        .property("y", &vec3::y)
        .property("z", &vec3::z);

    emscripten::function("superellipseCpLength", &superellipse_cp_length);
    emscripten::function("springStep", emscripten::select_overload<SpringState(*)(SpringParams, SpringState, float)>(&springStep));
    emscripten::function("renderGlass", emscripten::select_overload<void(*)(const GlassLens&, const uint8_t*, int, int, uint8_t*, int, int)>(&liquid_glass_render));
    emscripten::function("standardCard", &GlassPresets::standardCard);
    emscripten::function("interactiveButton", &GlassPresets::interactiveButton);
    emscripten::function("adaptiveDock", &GlassPresets::adaptiveDock);
    emscripten::function("dockMorphSpring", &SpringPreset::dockMorph);
    emscripten::function("lensTravelSpring", &SpringPreset::lensTravel);
    emscripten::function("reactionSpring", &SpringPreset::reaction);
    emscripten::function("pressFeedbackSpring", &SpringPreset::pressFeedback);
    emscripten::function("jellySpring", &SpringPreset::jelly);
}
#endif /* __EMSCRIPTEN__ */

#endif /* LIQUID_ENGINE_H */
