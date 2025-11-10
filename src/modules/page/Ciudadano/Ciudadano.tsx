import React, { useEffect, useRef, useState } from "react";
import TreeRegisterForm from "./TreeRegisterForm";

export default function Ciudadano() {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Tu página HTML con el mapa + header + botón
  const startPage = new URL("./index.html", import.meta.url).toString();

  // Escucha eventos para abrir/cerrar el modal
  useEffect(() => {
    // 1) Si el HTML NO estuviera en iframe (mismo window), usamos CustomEvent
    const onOpenCustom = () => setOpen(true);
    const onCloseCustom = () => setOpen(false);
    window.addEventListener("trees:open-register", onOpenCustom as EventListener);
    window.addEventListener("trees:close-register", onCloseCustom as EventListener);

    // 2) Si el HTML está en un iframe, usamos postMessage
    const onMessage = (ev: MessageEvent) => {
      const d = ev?.data;
      if (!d) return;

      // abrir/cerrar
      if (d === "OPEN_REGISTER" || d?.cmd === "open-register" || d?.type === "OPEN_TREE_FORM") {
        setOpen(true);
      }
      if (d === "CLOSE_REGISTER" || d?.cmd === "close-register") {
        setOpen(false);
      }

      // refresco solicitado desde el hijo
      if (d === "REFRESH_TREES" || d?.cmd === "trees:refresh" || d?.type === "TREES_REFRESH") {
        window.dispatchEvent(new CustomEvent("trees:refresh"));
      }
    };
    window.addEventListener("message", onMessage);

    // ESC para cerrar
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);

    return () => {
      window.removeEventListener("trees:open-register", onOpenCustom as EventListener);
      window.removeEventListener("trees:close-register", onCloseCustom as EventListener);
      window.removeEventListener("message", onMessage);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Bloquear scroll de fondo cuando está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Helper para mandar mensajes al iframe
  const postToIframe = (payload: any) => {
    const win = iframeRef.current?.contentWindow;
    if (win) win.postMessage(payload, "*");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Mapa (HTML) a pantalla completa */}
      <iframe
        ref={iframeRef}
        title="Mapa Ciudadano"
        src={startPage}
        className="absolute inset-0 w-full h-full border-0 z-0"
      />

      {/* Modal del registro de árbol */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">
            <TreeRegisterForm
              onClose={() => {
                setOpen(false);
                // avisa al iframe (por si quiere reaccionar)
                postToIframe({ cmd: "close-register" });
              }}
              onCreated={(feature) => {
                // 1) Dibuja al instante en el mapa del iframe (si script.js lo soporta)
                postToIframe({ type: "TREES_ADD_TEMP", feature });

                // 2) Refresca la capa persistente en ambos lados
                window.dispatchEvent(new CustomEvent("trees:refresh"));
                postToIframe({ type: "TREES_REFRESH" });

                // 3) Cierra modal
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
