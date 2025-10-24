# Portafolio Profesional

Sitio web minimalista y moderno para mostrar tu currículum, certificaciones y un formulario de contacto. Construido con HTML, CSS y JavaScript puro.

## Estructura
- `index.html`: Página principal con secciones de Currículum, Certificaciones y Contacto.
- `styles.css`: Estilos modernos, tema oscuro por defecto y toggle a claro.
- `script.js`: Lógica de galería (subida/preview), modal, formulario de contacto y más.
- `assets/`: Archivos estáticos (tu `cv.pdf` y certificaciones si deseas alojarlas).
  - `assets/certificados/`: Carpeta opcional si decides alojar imágenes/PDF localmente en vez de usar el almacenamiento del navegador.

## Personalización rápida
- Cambia "Tu Nombre" y "Especialidad" en `index.html` (header).
- Reemplaza enlaces de redes sociales en el footer (`index.html`).
- Coloca tu CV como `assets/cv.pdf` para que se muestre y pueda descargarse.
- Si quieres un avatar, reemplaza el emoji en `index.html` o coloca una imagen y ajusta estilos.

## Certificaciones
- Puedes subir imágenes (PNG/JPG/JPEG) o PDFs. Se guardan en el navegador (localStorage) para privacidad y simplicidad.
- Usa los botones: Ver, Renombrar y Eliminar en cada tarjeta.
- Exporta/Importa tus certificaciones como JSON para llevarlas a otro dispositivo.

Si prefieres alojar archivos en el repositorio en lugar de `localStorage`:
1. Coloca los archivos en `assets/certificados/`.
2. En `script.js`, podrías extender la galería para leer un `manifest.json` estático con rutas (no incluido por defecto).

## Formulario de contacto
Hay dos opciones:

1) Formspree (recomendado)
- Crea una cuenta en https://formspree.io/ y genera un endpoint (p. ej., `https://formspree.io/f/xxxxxxx`).
- Abre `script.js` y reemplaza `const FORM_ENDPOINT = ''` por tu endpoint.
- ¡Listo! Los envíos irán a tu correo según tu configuración de Formspree.

2) mailto (alternativa)
- En `script.js`, en la función `setupMailto()`, reemplaza `tu_correo@ejemplo.com` por tu correo real.
- El botón "Enviar con tu cliente de correo" abrirá tu app de correo con los datos precargados.

Nota de privacidad: El uso de `mailto:` depende de la configuración del cliente de correo del visitante.

## Tema claro/oscuro
- Botón en la esquina del header. Preferencia guardada en `localStorage`.

## Despliegue
- GitHub Pages: Sube este directorio a un repo y habilita Pages (branch `main`, carpeta root). La URL se mostrará en tu repo.
- Netlify: Arrastra y suelta la carpeta en la UI de Netlify o conecta tu repo. No requiere build.
- Vercel: Importa el repo como proyecto Estático.

## Desarrollo local
- Abre `index.html` en tu navegador.
- Si el visor de PDF no aparece, ábrelo en nueva pestaña con el enlace de fallback.

## Accesibilidad
- Modal accesible con `Esc` y click fuera.
- Etiquetas de formulario y mensajes de estado con `aria-live`.

## Licencia
Uso personal. 
