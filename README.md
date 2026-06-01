# 🏡 Proyecto Habitacional Ubaté — Landing Page

Landing page profesional para el proyecto habitacional en Ubaté, Cundinamarca.
Desarrollada con **Vite + Vanilla JS**, **Three.js** (globo 3D) y **GSAP** (animaciones).

---

## 🚀 Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo
npm run dev
# → Abre http://localhost:3000

# 3. Build para producción
npm run build
# → Genera la carpeta /dist lista para deploy

# 4. Preview del build
npm run preview
```

---

## 📁 Estructura del proyecto

```
ubate-project/
├── index.html              # HTML principal
├── vite.config.js          # Configuración de Vite
├── package.json
├── public/                 # Archivos estáticos (favicon, etc.)
└── src/
    ├── main.js             # Punto de entrada — inicializa todos los módulos
    ├── css/
    │   ├── base.css        # Variables, reset, utilidades globales
    │   ├── hero.css        # Estilos del hero y globo
    │   ├── cards.css       # Tarjetas de productos
    │   ├── tips.css        # Carrusel de consejos
    │   ├── stepper.css     # Formulario de 4 pasos
    │   ├── legal.css       # Modal legal
    │   └── floating.css    # Botones flotantes y sticky bar
    └── js/
        ├── globe.js        # Animación Three.js — globo 3D → zoom a Ubaté
        ├── tips.js         # Carrusel infinito de consejos
        ├── stepper.js      # Lógica de 4 pasos + calculadora de subsidio
        ├── sticky.js       # Barra sticky perseguidora
        ├── modal.js        # Modal de textos legales
        └── reveal.js       # Animaciones scroll reveal
```

---

## ⚙️ Configuración pendiente

| Archivo        | Qué cambiar                                        |
|----------------|----------------------------------------------------|
| `index.html`   | `action="https://formspree.io/f/tu-codigo-aqui"`   |
| `index.html`   | `href="https://t.me/ubate_vivienda_bot"` (bot real)|
| `js/modal.js`  | Correo `info@jadecol.com` y datos de contacto      |

---

## 🌍 Deploy

### Netlify (recomendado)
```bash
npm run build
# Arrastra la carpeta /dist a netlify.com/drop
```

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Hosting tradicional (FTP)
```bash
npm run build
# Sube el contenido de /dist a public_html/
```

---

## 📦 Dependencias principales

| Paquete   | Versión  | Uso                          |
|-----------|----------|------------------------------|
| `three`   | ^0.x     | Globo 3D animado en el hero  |
| `gsap`    | ^3.x     | Animaciones de entrada       |
| `vite`    | ^5.x     | Bundler y servidor dev       |

---

## 📱 Características

- ✅ Globo 3D Three.js — zoom desde el espacio hasta Ubaté
- ✅ Animaciones GSAP sincronizadas con el zoom
- ✅ Carrusel infinito de consejos (pausa y reanuda correctamente)
- ✅ Stepper de 4 pasos: Perfil → Arriendo → Calculadora → Datos
- ✅ Calculadora de subsidio VIS basada en SMMLV 2025
- ✅ Score de arriendo para financiación alternativa
- ✅ Barra sticky perseguidora con mensaje motivador
- ✅ Botones flotantes WhatsApp y Telegram
- ✅ Modal legal completo (Ley 1581 de 2012)
- ✅ Scroll reveal en todas las secciones
- ✅ Totalmente responsive — móvil y desktop

---

Desarrollado por **Jadecol** · 2025
