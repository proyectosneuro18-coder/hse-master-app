-- Contenido real de "Las 9 Reglas que Salvan Vidas" (estándar IOGP, ya referenciado en
-- FICHA-MODELO.md y en progreso.html/app-principal.html). Reemplaza los datos de ejemplo que
-- hoy muestra la app interna. Cada módulo trae 1 lección: una situación real de campo + una
-- pregunta de opción múltiple + la explicación de por qué esa es la respuesta correcta —
-- mismo formato "micro-módulo de 3 min + trivia" que ya documenta el esquema (0001_init.sql).
-- Copy en el lenguaje del avatar (FICHA-AVATAR.md): directo, de campo, sin jerga corporativa.

insert into public.modules (slug, title, summary, order_index) values
  ('aislamiento-energia', 'Aislamiento de energía', 'Bloquea y etiqueta antes de tocar cualquier equipo.', 1),
  ('espacios-confinados', 'Espacios confinados', 'Nunca entres sin permiso, pruebas de aire y vigía.', 2),
  ('trabajo-caliente', 'Trabajo en caliente', 'Suelda, corta o esmerila solo con el área verificada.', 3),
  ('linea-de-fuego', 'Línea de fuego', 'Ubícate fuera del camino de lo que se mueve o cae.', 4),
  ('izaje-mecanico', 'Izaje mecánico seguro', 'Nunca te pares ni pases bajo una carga suspendida.', 5),
  ('controles-seguridad', 'No saltarse los controles', 'Un control de seguridad no es un obstáculo, es tu respaldo.', 6),
  ('permiso-trabajo', 'Permiso de trabajo', 'Si la tarea lo requiere, el permiso va firmado y vigente.', 7),
  ('trabajo-altura', 'Trabajo en altura', 'Protección contra caídas siempre que haya riesgo de caer.', 8),
  ('conduccion-segura', 'Conducción segura', 'El cinturón, el límite de velocidad y cero celular al volante.', 9)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  order_index = excluded.order_index;

-- Permite volver a correr esta migración sin duplicar lecciones (mismo patrón defensivo que
-- 0001_init.sql) — borra solo las lecciones de ESTOS 9 módulos, nunca el progreso del worker
-- (attempts referencia lesson_id con on delete cascade, así que si ya hay intentos reales
-- guardados, esto los borraría también: revisar antes de re-correr en producción con datos reales).
delete from public.lessons where module_id in (
  select id from public.modules where slug in (
    'aislamiento-energia','espacios-confinados','trabajo-caliente','linea-de-fuego',
    'izaje-mecanico','controles-seguridad','permiso-trabajo','trabajo-altura','conduccion-segura'
  )
);

insert into public.lessons (module_id, title, order_index, content)
select m.id, v.title, 1, v.content::jsonb
from (values
  ('aislamiento-energia', 'El equipo que "ya estaba apagado"',
   '{"intro":"Un compañero te pide revisar una banda transportadora que acaban de detener. El botón de apagado está presionado y no se oye el motor.","pregunta":"¿Qué haces antes de meter la mano cerca de la banda?","opciones":["Bloqueo la fuente de energía, coloco mi candado y verifico que no arranque","Reviso rápido, si no suena es porque está apagada","Le aviso al compañero que tenga cuidado mientras reviso"],"respuesta_correcta":0,"explicacion":"Que un equipo esté detenido NO significa que esté sin energía. El bloqueo y etiquetado (LOTO) es el único paso que garantiza que nadie más lo pueda energizar mientras trabajas — por eso tu candado va primero, siempre."}'),
  ('espacios-confinados', 'El tanque que parece vacío',
   '{"intro":"Te piden entrar a un tanque de almacenamiento para limpiarlo. Por fuera se ve vacío y ventilado.","pregunta":"¿Qué es lo primero que exige la regla antes de entrar?","opciones":["Entrar con cuidado, respirando por la boca","Abrir la tapa un rato para que se ventile y entrar después","Tener el permiso de espacio confinado, la prueba de atmósfera hecha y un vigía afuera"],"respuesta_correcta":2,"explicacion":"Un espacio puede verse vacío y aun así tener gases invisibles sin oxígeno suficiente. La prueba de atmósfera, el permiso firmado y un vigía que te vea desde afuera son innegociables — nunca se entra \"a ojo\"."}'),
  ('trabajo-caliente', 'La chispa cerca del tambor',
   '{"intro":"Necesitas esmerilar una pieza metálica. A pocos metros hay unos tambores con trapos y solvente.","pregunta":"¿Qué haces antes de encender el esmeril?","opciones":["Esmerilo rápido, son solo unos minutos","Retiro o cubro los materiales inflamables y verifico el permiso de trabajo en caliente","Le aviso a alguien que esté pendiente del fuego"],"respuesta_correcta":1,"explicacion":"Una sola chispa puede iniciar un incendio si hay vapores o materiales inflamables cerca. El trabajo en caliente exige despejar el área y tener el permiso vigente — la chispa no avisa antes de saltar."}'),
  ('linea-de-fuego', 'La grúa girando sobre tu cabeza',
   '{"intro":"Estás caminando por el patio y ves una grúa moviendo una carga pesada justo sobre la zona por donde ibas a pasar.","pregunta":"¿Qué haces?","opciones":["Paso rápido antes de que llegue la carga","Sigo caminando pegado a la pared, lejos de la carga","Me detengo, salgo del radio de giro y espero a que termine la maniobra"],"respuesta_correcta":2,"explicacion":"La línea de fuego es cualquier punto donde algo en movimiento, cayendo o liberando energía te puede golpear. Ante una carga suspendida, la única posición segura es FUERA de su radio — nunca \"cerca pero con cuidado\"."}'),
  ('izaje-mecanico', 'El atajo bajo la carga',
   '{"intro":"Una carga va suspendida sobre tu cabeza y el camino más corto hacia tu puesto pasa justo por debajo.","pregunta":"¿Qué haces?","opciones":["Rodeo y nunca paso por debajo de una carga suspendida","Paso rápido, la carga se ve bien asegurada","Paso solo si el operador de la grúa me hace una seña"],"respuesta_correcta":0,"explicacion":"Ninguna carga suspendida es 100% segura: cadenas, eslingas o ganchos pueden fallar sin aviso. Pasar por debajo, aunque sea un atajo de 10 segundos, nunca vale el riesgo — siempre se rodea."}'),
  ('controles-seguridad', 'La alarma que molesta',
   '{"intro":"Un sensor de gas sigue sonando una alarma aunque el área parece normal, y te está retrasando el trabajo.","pregunta":"¿Qué haces?","opciones":["Apago o desactivo el sensor para seguir trabajando","Sigo trabajando, seguro es una falla del sensor","Detengo la tarea y reporto la alarma antes de continuar"],"respuesta_correcta":2,"explicacion":"Los controles de seguridad (alarmas, sensores, barreras) existen justo para los momentos en que algo no se ve a simple vista. Desactivar uno porque \"molesta\" quita la única alerta que tenías — siempre se reporta, nunca se anula."}'),
  ('permiso-trabajo', 'La tarea "de 5 minutos"',
   '{"intro":"Un supervisor te pide hacer un ajuste rápido a un equipo que normalmente requiere permiso de trabajo escrito — dice que es cosa de 5 minutos.","pregunta":"¿Qué haces?","opciones":["Lo hago rápido, totalmente son solo 5 minutos","Pido el permiso de trabajo correspondiente antes de empezar, sin importar cuánto dure la tarea","Empiezo y consigo el permiso después, mientras termino"],"respuesta_correcta":1,"explicacion":"El riesgo de una tarea no depende de cuánto dure, sino de qué tan peligrosa es. El permiso de trabajo existe para verificar las condiciones ANTES del peligro, no después — \"rápido\" no es lo mismo que \"seguro\"."}'),
  ('trabajo-altura', 'La escalera sin arnés',
   '{"intro":"Tienes que revisar algo a 3 metros de altura. Solo vas a estar ahí \"un momentico\" y tu arnés está guardado lejos.","pregunta":"¿Qué haces?","opciones":["Subo rápido sin arnés, es poco tiempo","Subo con cuidado y me sostengo bien con las manos","Voy por el equipo de protección contra caídas antes de subir"],"respuesta_correcta":2,"explicacion":"La mayoría de las caídas graves pasan en tareas \"cortas\" donde alguien decidió saltarse la protección por ahorrar tiempo. Si hay riesgo real de caída, el equipo de protección va puesto SIEMPRE, sin importar cuántos minutos dure la tarea."}'),
  ('conduccion-segura', 'La llamada en la carretera',
   '{"intro":"Vas manejando la camioneta de la empresa hacia el pozo y te entra una llamada urgente del supervisor.","pregunta":"¿Qué haces?","opciones":["Contesto con el altavoz mientras sigo manejando","Me detengo en un lugar seguro antes de contestar","Contesto rápido, es un camino que conozco bien"],"respuesta_correcta":1,"explicacion":"Usar el celular al volante, aunque sea con altavoz, te distrae lo suficiente para no reaccionar a tiempo. La regla es simple: si necesitas usar el teléfono, el vehículo se detiene primero — ninguna llamada vale un accidente de tránsito."}')
) as v(slug, title, content)
join public.modules m on m.slug = v.slug;
