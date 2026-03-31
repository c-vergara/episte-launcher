/**
 * Background Service Worker
 * Requerido para extensiones Manifest V3 funcionales.
 * Este script corre de fondo y maneja eventos globales de la instalación.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log("episte-launcher extension successfully installed.");
});
