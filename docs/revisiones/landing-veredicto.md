# VEREDICTO revisor-visual — landing
Fecha: 2026-10-15 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Screenshot entregado solo muestra header+hero; las 9 secciones restantes aparecen vacías porque TODO .reveal nace en opacity:0 en CSS sin fallback — depende 100% de que un scroll real dispare el IntersectionObserver (ni la propia captura de evidencia lo logró). 2) El hero (lo primero que ve el usuario) no tiene class="reveal": aparece sin la animación de entrada que sí tienen las demás secciones. 3) "Entrar (con tu prueba)" en el header no hace nada y está en la posición convencional de login, sin aclarar qué pasa al tocarlo. 4) Contraste del azul destacado "3 minutos al día" ~3.19:1, al límite del piso de texto grande. 5) "Dashboard" en inglés crudo en el stack de oferta, debería decir "panel".
