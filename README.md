# Descomprimir ZIP y RAR

Abre archivos ZIP y RAR en el navegador, mira lo que traen y descarga solo lo que necesitas.

Herramienta gratuita y de código abierto de [SonhoLab](https://sonholab.com). Corre **100 % en el navegador**: los archivos no se suben a ningún servidor.

> Licencia: **MIT** · Autor: Leandro Manuel Perez Montañana · Idiomas de la interfaz: español, inglés, francés, portugués (BR), alemán, hindi, indonesio y ruso.

## Qué hace

Cuando llega un .zip o un .rar y solo quieres ver qué hay adentro, esta herramienta lo abre en tu navegador y te muestra la lista completa, con sus subcarpetas. Desde ahí descargas un archivo suelto o todo junto. No hace falta instalar nada ni subir el comprimido a ningún servidor.

**Cuándo te sirve:**

- Te llega por correo un ZIP con las facturas del mes y solo necesitas dos: las descargas sueltas sin extraer el resto.
- Estás en la computadora del trabajo, donde no puedes instalar WinRAR, y aun así tienes que abrir un .rar que te mandaron.
- El profesor comparte el material del curso en un .rar y tú solo quieres el PDF de la clase de hoy, no las cuarenta imágenes.

## Cómo se usa

1. **Carga el comprimido.** Arrastra tu archivo .zip o .rar al recuadro, o haz clic para elegirlo desde tu equipo. Se abre en el momento, sin cola de espera.
2. **Revisa el contenido.** Verás la lista de todo lo que trae adentro, respetando las subcarpetas tal como están. Abre cada carpeta para ver qué hay en ella.
3. **Descarga lo que necesites.** Baja un archivo suelto con un clic, o pide todo el contenido reempaquetado en un zip nuevo si prefieres guardarlo completo.

## Qué necesita para funcionar

### Para instalarla y compilarla

- [Node.js](https://nodejs.org) 18 o superior (probado con Node 22) y npm.
- Conexión a internet **solo** durante `npm install`. Una vez compilada, la herramienta no pide nada a internet.

### Complementos específicos de esta herramienta

- **PDF.js** (lector de PDF de Mozilla): viene como dependencia de npm; su *worker* se empaqueta solo con Vite.
- **UnRAR en WebAssembly** (`node-unrar-js`): dependencia de npm, se empaqueta solo con Vite.

### En el navegador de quien la usa

- Web Workers y Canvas (cualquier navegador actual).

## Instalación

```bash
git clone https://github.com/nanoizax/herramienta-descomprimir-archivos.git
cd herramienta-descomprimir-archivos
npm install
npm run dev         # servidor de desarrollo en http://localhost:5173
```

Para publicarla:

```bash
npm run build       # genera la carpeta dist/
npm run preview     # probar la versión compilada
```

Esta herramienta **no tiene servidor propio**: todo ocurre en el navegador de quien la usa. Basta con publicar la carpeta `dist/` en cualquier hosting estático (GitHub Pages, Netlify, Cloudflare Pages, Nginx, Apache...).

## Cómo está organizado

```
src/pages/tools/   La página de la herramienta (interfaz y lógica de pantalla)
src/lib/tools/     La lógica de la herramienta, separada de la interfaz
src/components/    Piezas compartidas (zona de arrastre de archivos, botón)
src/locales/       Textos en 8 idiomas (esta herramienta solamente)
src/i18n.ts        Configuración de idiomas
```

## Cómo meterla en tu propia plataforma

1. **Como página aparte:** publica `dist/` en una ruta de tu sitio, por ejemplo `/herramientas/descomprimir-archivos/`. Si la sirves en una subcarpeta, define `base` en `vite.config.ts`.
2. **Dentro de tu aplicación React:** copia `src/pages/tools/*Page.tsx`, `src/lib/tools/` y `src/components/` a tu proyecto, instala las mismas dependencias de `package.json` y renderiza la página donde quieras.
3. **Con tu diseño:** el marco de la página (título, ayuda, preguntas frecuentes) está en `src/components/tools/ToolPageLayout.tsx` y es intencionalmente simple. Cámbialo por tu cabecera, tu pie y tus estilos; solo necesita pintar `children`.
4. **Con tu analítica:** `src/lib/hitCounter.ts` no hace nada. Si quieres medir el uso, conéctalo ahí a tu propia herramienta.

## Privacidad

Todo el procesamiento ocurre en el navegador. Esta copia no incluye analítica, cookies, contadores ni llamadas a ningún servidor propio. Los archivos del usuario no salen de su equipo.

## Preguntas frecuentes

**¿Descomprimir ZIP y RAR aquí es gratis?**  
Sí, es gratis y no hay que registrarse. No pedimos correo, no hay una versión de pago escondida y no agregamos marcas de agua ni archivos extra al resultado. Puedes abrir todos los comprimidos que quieras.

**¿A dónde van mis archivos cuando los abro?**  
A ningún lado. El ZIP o el RAR se abre dentro de tu navegador, en tu propio dispositivo, y su contenido nunca viaja a un servidor nuestro. Al cerrar la pestaña no queda copia ni registro de nada.

**¿Necesito instalar WinRAR o algún programa?**  
No. Funciona con el navegador que ya tienes, en Windows, Mac, Linux, Android o iPhone. Sirve justo para esos casos en los que estás en una computadora ajena y no puedes o no quieres instalar programas.

**¿Hay límite de tamaño o de cantidad de archivos?**  
No ponemos límites de cantidad ni cola de espera. El techo real lo pone la memoria de tu dispositivo: un comprimido de varios gigabytes puede tardar o trabarse en un teléfono viejo, y va cómodo en una computadora de escritorio.

**¿Puedo abrir un ZIP o RAR protegido con contraseña?**  
Todavía no. Si el comprimido pide contraseña, la herramienta no logra extraer su contenido. Para esos casos sigue haciendo falta un programa de escritorio como 7-Zip o WinRAR; estamos trabajando en agregarlo.

## Licencia

Este proyecto se publica bajo la licencia **MIT**. El texto completo está en [LICENSE](LICENSE).

Las dependencias tienen sus propias licencias, listadas en [THIRD-PARTY.md](THIRD-PARTY.md).

## Más herramientas gratuitas

Esta es una de las herramientas gratuitas de SonhoLab. Encuentra el resto, cada una con su repositorio, en https://sonholab.com/es/herramientas.

---

Hecho por Leandro Manuel Perez Montañana.
