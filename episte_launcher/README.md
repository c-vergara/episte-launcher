# Episte Launcher (EL)

Episte Launcher es una extensión ligera de Google Chrome (Manifest V3) diseñada para acelerar y optimizar el flujo de trabajo de desarrolladores y analistas que interactúan constantemente con identificadores de entidades en la plataforma **LOVE** (Living OVerview of Evidence) y **Epistemonikos**.

El objetivo central de la extensión es proveer una interfaz ultrarrápida (accesible vía teclado) que, mediante simples atajos, toma un ID y redirige directamente a la URL específica del recurso (ya sea una taxonomía, una referencia o un hilo de discusión). Todo el diseño prima la velocidad: cero clics del mouse (si así lo requiere el usuario) y apertura de nuevas pestañas inmediatas.

---

## Interfaz y Flujo de Uso

1. **Activación de la UI:** La aplicación se abre haciendo clic en el ícono de la extensión o, preferiblemente, utilizando el atajo global de teclado configurado por defecto como `Ctrl+Shift+Space`.
2. **Vista de Selección de Modo (Dropdown):** Tras la activación, un popup muestra una lista generada dinámicamente de "Modos" (Ej: "Go to EET term", "See reference in LOVE"). Cada modo tiene atajos vinculados (ej: las teclas `R`, `E`, `T`, etc., o números `1`, `2`, `3`...).
3. **Vista de Input:** Al seleccionar un modo (presionando su tecla correspondiente o haciendo clic), la interfaz cambia sutilmente a un campo de ingreso de texto (`<input>`), el cual recibe foco de forma automática.
4. **Redirección:** El usuario pega el "ID" de la entidad y presiona `Enter`. La extensión reemplaza internamente la plantilla URL (`{ID}`) por código real y usa la API de Chrome (`chrome.tabs.create`) para abrir esa ubicación en un nuevo Tab instantáneamente.

<br/>

## Arquitectura de Configuración Dinámica (`launcher_config.js`)

Para favorecer la mantenibilidad de la aplicación y la inyección a futuro en LLMs como contexto, Episte Launcher disocia su estructura visual (UI) de los datos lógicos mediante un **ES Module** local llamado `launcher_config.js`.

### ¿Por qué `launcher_config.js` es importante?
En este archivo reside la **única fuente de verdad** (Single Source of Truth) para las operaciones soportadas:
- Modificar el nombre de un modo.
- Alterar su tecla maestra de acceso.
- Actualizar o añadir nuevas URLs que deben abrirse.
- Agregar un modo **completamente nuevo** en el proyecto sin tocar una sola línea de código en la UI visual (CSS/HTML) ni lógica de eventos (DOM/JS).

### Especificación del Objeto de Configuración
La aplicación exporta una contante arreglo `MODES`:

```javascript
export const MODES = [
  {
    id: "taxonomy",
    keys: ["e"], // El atajo numérico se añade al vuelo dinámicamente según el índice del arreglo
    title: "Go to EET term",
    url: "https://app.iloveevidence.com/taxonomy/{ID}"
  },
  // ...
]
```

#### Descripción de propiedades:
* **`id`**: Identificador interno amigable del modo a nivel DOM.
* **`keys`**: Un arreglo de strings (minúsculas) que funcionarán como "shortcut strokes". IMPORTANTE: No necesitas añadir los atajos numéricos como `"1"`, `"2"`. **`popup.js` genera esto automáticamente** iterando sobre la ubicación de cada registro en el arreglo inicial de `MODES` (es decir, el objeto en la posición 0 obtendrá y renderizará la tecla "1").
* **`title`**: String presentado visualmente y formateado en `<span class="mode-label">`.
* **`url`**: El endpoint de destino. Obligatoriamente debe contener el substring literal `{ID}` para que la expresión regular simple de Javascript efectúe el reemplazo por el string procesado desde el portapapeles.

<br/>

## Contexto Técnico y Futuro

* **Contexto AI**: Este archivo `.md` es idóneo para inyectarlo en ventanas de contexto de AI Generators para mantener el entendimiento al día del dominio lógico. 
* **Extension API**: La app hace uso superficial de `chrome.tabs`. Eventuales aumentos de complejidad podrían interactuar con `chrome.storage` (si deseamos un historial de los últimos 5 accesos) o `navigator.clipboard.readText()` en modos avanzados.

---
*Desarrollado según mejores prácticas WebExtensions/Manifest V3.*
