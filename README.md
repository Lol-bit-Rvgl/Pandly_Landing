# Pandly — Liquid Social Space

> Plataforma social y de entretenimiento interactivo de última generación: Watch Parties sincronizadas, salas de roleplay dinámicas, lounges de voz con audio espacial y 523 Living Stickers táctiles.

Este repositorio contiene la **Landing Page oficial e interactiva de Pandly**, construida sobre una arquitectura híbrida que combina un motor óptico de vidrio líquido en **C++17 compilado a WebAssembly** con la reactividad y rendimiento de **Next.js 15 (React 19)**.

---

## 1. Visión General

Pandly reimagina la interacción digital para comunidades, fandoms y grupos de amigos. La landing page no solo presenta las funcionalidades del ecosistema, sino que actúa como una demostración técnica viva de micro-interacciones a 120 FPS, refracción óptica 2.5D en tiempo real y dinámicas de muelle continuo.

### Características Principales del Producto
- **Roleplay Rooms & Espacios Vivos**: Escenarios interactivos con avatares 2.5D reactivos.
- **Salas de Cine Compartidas (Watch Parties)**: Reproducción sincronizada al milisegundo y chat en vivo.
- **Voice Lounges con Audio Espacial**: Salas de voz espontáneas con sonido direccional envolvente.
- **Círculos y Comunidades**: Hubs temáticos (#AnimeCinema, #RoleplayUniverse, #GamerSquad).
- **523 Living Stickers & Reacciones Táctiles**: Emociones elásticas con masa, rebote e inercia física real.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Engine Central** | C++17 / Clang | Kernel óptico (`liquid_engine.cpp`), SDFs analíticas, solvers de muelle. |
| **Runtime Binario** | WebAssembly (Emscripten) | Ejecución en el navegador con vectorización SIMD128 y optimización `-O3`. |
| **Framework Web** | Next.js 15.5+ (App Router) | Renderizado estático (SSG), rutas de API y empaquetado optimizado. |
| **Capa React** | React 19 / TypeScript 5.8 | Interfaces declarativas, tipado estricto (`tsc --noEmit`). |
| **Físicas & Motion** | Custom Spring Integrators | Físicas de segundo orden no amortiguadas para dock y reacciones. |
| **Estilos & Tipografía** | CSS Variables + Canvas 2D | Fuentes locales (`DynaPuff`, `LilitaOne`, `CherryBombOne`) y aceleración GPU. |

---

## 3. Pipeline Óptico Liquid Glass 2.5D

El motor óptico procesa cada lente y superficie de vidrio interactiva a través de una cadena analítica:

```
[Entrada: Posición de Cursor & Tiempo]
                │
                ▼
1. Shape SDF & Gradiente 5-Tap:
   N = normal(SDF(p))
                │
                ▼
2. Vector de Refracción (Ley de Snell):
   R = kr · N_xy · f(edge) · f(interaction)
                │
                ▼
3. Muestreo de Fondo & Dispersión Cromática:
   C_refracted = Texture(Backdrop, UV + R) + Aberration(λ)
                │
                ▼
4. Reflexión Especular de Fresnel (Schlick):
   F = F0 + (1 - F0) · (1 - N · V)⁵
                │
                ▼
5. Difusión Gaussiana & Resplandor Especular:
   C_glass = Blur(C_refracted, σ) + ColorBleed + F · Specular(N, L, V)
                │
                ▼
6. Contraste Adaptativo Accesible (WCAG AA ≥ 4.5:1):
   C_final = ContrastFloor(C_glass, ForegroundLuma)
```

---

## 4. Sistema de Físicas y Dinámicas de Resorte

El sistema utiliza integradores simplécticos de segundo orden para resolver ecuaciones de movimiento continuo sin saltos discretos:

- **Liquid Navigation Dock (Preset P3 `dockMorph`)**:
  - Parámetros: $\text{mass} = 1.25$, $\text{stiffness} = 260.0$, $\zeta = 0.92$.
  - Genera el deslizamiento orgánico y concéntrico del *Liquid Cutout* hacia el botón activo.
- **Inercia Óptica del Cursor (ODE de Segundo Orden)**:
  - Parámetros: $\omega_n = 26.0\text{ rad/s}$, $\zeta = 0.86$.
  - Ecuación: $\ddot{x} + 2\zeta\omega_n\dot{x} + \omega_n^2 x = 0$.
  - Suaviza el foco de luz y la dispersión especular siguiendo el vector de velocidad del puntero.
- **Micro-Reacciones Elásticas (Preset S05 `reaction`)**:
  - Parámetros: $\text{mass} = 0.45$, $\text{stiffness} = 420.0$, $\text{damping} = 22.0$, $v_0 = 6.5$.
  - Dispara el rebote característico de los Living Stickers al interactuar.

---

## 5. Instalación y Puesta en Marcha

### Requisitos Previos
- **Node.js**: $\ge 20.0.0$
- **npm**: $\ge 10.0.0$
- *(Opcional)* **Emscripten SDK (`emsdk`)**: Requerido únicamente si se recompila `liquid_engine.cpp` a WebAssembly.

### Pasos de Instalación

1. **Clonar el repositorio y entrar al directorio**:
   ```bash
   cd Pandly
   ```

2. **Instalar dependencias de Node.js**:
   ```bash
   npm install
   ```

3. **Sincronizar assets estáticos (fuentes, imágenes, mockups y Rive)**:
   ```bash
   bash setup-assets.sh
   ```

4. *(Opcional)* **Recompilar el motor C++/WASM**:
   ```bash
   # Requiere emsdk activado previamente: source /path/to/emsdk/emsdk_env.sh
   bash build.sh
   ```

5. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

6. **Compilación y ejecución en producción**:
   ```bash
   npm run build
   npm run start
   ```

---

## 6. Variables de Entorno

Copia el archivo de ejemplo para configurar tu entorno local:

```bash
cp .env.example .env.local
```

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_DOMAIN` | Dominio canónico para metadatos OpenGraph y SEO. | `pandly.mockup.local` |

---

## 7. Estructura del Proyecto

```
Pandly/
├── app/
│   ├── api/visits/route.ts   # Endpoint de conteo de visitas persistente
│   ├── GlassCanvas.tsx       # Canvas de fondo conectado al motor de vidrio
│   ├── globals.css           # Estilos base y tokens tipográficos
│   ├── layout.tsx            # Metadata global, fuentes locales y viewport
│   └── page.tsx              # Página principal (Ecosistema Pandly)
├── components/
│   ├── FeedShowcase.tsx      # Showcase interactivo de los 4 formatos de post
│   ├── HeroSpace.tsx         # Hero con simulación de partículas y refracción
│   ├── LiquidDock.tsx        # Dock flotante con Liquid Cutout concéntrico y resortes
│   ├── PhysicsInspector.tsx  # Easter Egg HUD de telemetría técnica (FPS, N, R, F)
│   └── ReactionPicker.tsx    # Barra flotante de 5 columnas con Living Stickers
├── hooks/
│   └── useLiquidEngine.ts    # Hook central: registro de lentes, WASM loader y física
├── public/
│   ├── assets/               # Fuentes, logotipos, mockups y animaciones
│   └── wasm/                 # Binarios WebAssembly y glue scripts
├── liquid_engine.cpp         # Kernel óptico C++ (SDF, refracción, Fresnel)
├── liquid_engine.h           # Cabecera C++ y bindings Embind
├── build.sh                  # Script de compilación Emscripten (SIMD, -O3)
├── setup-assets.sh           # Script de extracción y sincronización de assets
└── next.config.mjs           # Configuración de Next.js (WASM, COOP/COEP headers)
```

---

## 8. Licencia

Código fuente y assets pertenecientes al proyecto Pandly, Inc. Todos los derechos reservados.
