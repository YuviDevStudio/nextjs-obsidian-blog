---
title: "Ox Alpha: el modelo anónimo y gratis de OpenRouter con contexto de 1 millón de tokens"
description: "Ox Alpha (stealth/ox-alpha) es un modelo de razonamiento gratuito en OpenRouter: 1M de contexto, multimodal y razonamiento obligatorio. Te explicamos qué es, quién podría estar detrás y cómo usarlo gratis vía OpenCode."
date: 2026-08-22
tags: [inteligencia artificial, ox alpha, openrouter, opencode, modelos de lenguaje, stealth model, programacion, agentes ia, gratis]
keywords: ["Ox Alpha", "Ox Alpha OpenRouter", "stealth/ox-alpha", "Ox Alpha gratis", "Ox Alpha OpenCode", "modelo anónimo OpenRouter", "Ox Alpha contexto 1M", "Ox Alpha análisis", "OpenRouter modelos gratis 2026", "Ox Alpha Zhipu GLM"]
categories: [Tecnología, Inteligencia Artificial]
featured_image: /posts/images/ox-alpha-portada.jpg
alt: "Representación abstracta de inteligencia artificial, el modelo anónimo Ox Alpha de OpenRouter"
---

# Ox Alpha: el modelo anónimo y gratis de OpenRouter con contexto de 1 millón de tokens

El 20 de agosto de 2026 apareció en OpenRouter un modelo que nadie se atreve a reclamar: **Ox Alpha**. No hay una gran empresa dando una rueda de prensa, no hay un fundador celebrando en X y no hay una ficha técnica firmada por ningún laboratorio. Lo único cierto es que, durante su fase de *preview*, **Ox Alpha es completamente gratis**: cero costo en entrada y en salida, con una ventana de contexto de **1.048.576 tokens** y entrada multimodal que acepta texto, imágenes y vídeo.

En pocas horas, agentes de programación como Claude Code y Hermes Agent ya habían enviado miles de millones de tokens a través de él. Y lo más relevante para quien lee esto: **ahora mismo Ox Alpha también es gratis a través de OpenCode**, el agente de programación de código abierto, con retención de datos en cero y un límite tan generoso que su propio equipo lo describe como uso "casi ilimitado". Vamos a desglosarlo.

![Código fuente en una pantalla, representando la capacidad de programación de Ox Alpha](/posts/images/ox-alpha-codigo.jpg)

## Qué es Ox Alpha y por qué da tanto que hablar

Ox Alpha se publica bajo el identificador `stealth/ox-alpha`. OpenRouter lo describe como *"un modelo de razonamiento diseñado para programación, trabajo agéntico sostenido y cargas de producción"*. La palabra clave aquí es **stealth**: es un modelo lanzado de forma anónima a través de una plataforma de enrutamiento para que el laboratorio que hay detrás recoja feedback del mundo real antes de revelar su identidad.

OpenRouter es claro al respecto: **solo enruta las peticiones**. No es su desarrollador, ni su dueño, ni su proveedor. El modelo lo opera un tercero que ha preferido quedarse en el anonimato durante esta fase de prueba. Ese juego ya lo habían jugado antes: Optimus Alpha en 2025, y los *alphas* Hunter, Healer y Owl —estos últimos terminaron revelándose como modelos de Xiaomi MiMo—.

## La ficha técnica confirmada de Ox Alpha

Todo lo que sigue está verificado en la ficha oficial de OpenRouter al 22 de agosto de 2026. Lo que no está confirmado lo marcamos explícitamente.

| Característica | Valor confirmado |
| :--- | :--- |
| Identificador | `stealth/ox-alpha` |
| Ventana de contexto | 1.048.576 tokens |
| Salida máxima | 131.072 tokens |
| Modalidades | Texto + imagen + vídeo → texto |
| Precio (entrada / salida) | 0 / 0 dólares por millón de tokens |
| Razonamiento | Obligatorio, esfuerzo por defecto "max" |
| Herramientas | Function calling, JSON estricto, `tool_choice` |
| Moderación | No aplicada (`is_moderated: false`) |
| Latencia / throughput | ~1 s y 70 tps reportados por OpenRouter |
| Uptime reportado | 99,99 % – 100 % |
| Conocimiento (cutoff) | No declarado |
| Proveedor | Anónimo (un solo host upstream) |

El detalle que más confunde a quien lo prueba por primera vez es el **razonamiento inapagable**. A diferencia de otros modelos donde puedes desactivar el *thinking*, Ox Alpha ejecuta su razonamiento antes de responder y ese proceso consume parte del presupuesto de tokens que le asignes. Si le das un `max_tokens` muy bajo (por ejemplo 300), el razonamiento se come el presupuesto y la respuesta llega **vacía**, aunque el sistema reporte `finish_reason: stop`. La regla de oro: configura `max_tokens` en 4000 o más.

## ¿Quién está detrás de Ox Alpha?

Nadie lo sabe con certeza, y esa es la única respuesta oficial. La ficha dice que lo desarrolla y opera un tercero anónimo. La comunidad, sin embargo, ya está haciendo ingeniería inversa. Las pistas forenses recogidas el 22 de agosto apuntan a **Zhipu / Z.ai y su familia GLM-5.3**: coincidencia en trazas de pila, un código de error (1214) y un emparejamiento del tokenizador de 30/30 con GLM. No es una confirmación oficial, pero es la teoría más sólida hasta ahora. Otras conjeturas apuntan a Xiaomi, Tencent o MiniMax —recordemos que los últimos *stealth models* salieron todos de laboratorios chinos—.

![Red neuronal abstracta, representando el razonamiento de Ox Alpha](/posts/images/ox-alpha-razonamiento.jpg)

## Rendimiento: lo que dicen los números

No existen benchmarks auditados en la ficha oficial. Lo más cercano es una prueba independiente del desarrollador Ben Davis, que situó a Ox Alpha en un **80 % en DeepSWE**, por delante de Fable (65 %) y GPT-5.6 Sol (52 %). Son datos de una sola fuente, no de un panel oficial, así que hay que leerlos con cautela.

Sí tenemos tráfico real verificable. Según el panel de OpenRouter, los mayores emisores de tokens hacia Ox Alpha son Claude Code (~9,3B de tokens), Hermes Agent (~9,0B), Oh-My-Pi, DeepSeek Harness y Z Code. Es decir: agentes de producción ya lo están usando en serio, no solo curiosos.

## Cómo probar Ox Alpha gratis (OpenRouter y OpenCode)

Tienes dos rutas, ambas gratuitas durante el *preview*.

**Opción 1: OpenRouter.** Crea una cuenta gratuita, busca `stealth/ox-alpha` y úsalo desde el *playground* o vía API. La API es compatible con OpenAI: cambias la base a `https://openrouter.ai/api/v1` y pones el modelo `stealth/ox-alpha`. Recuerda el `max_tokens` alto.

**Opción 2: OpenCode (gratis y con retención de datos en cero).** Ahora mismo Ox Alpha es gratis a través de **OpenCode**, el agente de programación de código abierto que corre en tu terminal. El equipo de OpenCode anunció que el modelo es gratis por la presente semana, con **retención de datos cero**, límites de tasa generosos y una capacidad declarada de hasta 100 billones de tokens al día. OpenCode Go, la versión gestionada, extendió la misma oferta: uso casi ilimitado y gratuito que no descuenta de tu cuota normal. Si ya trabajas en la terminal con un agente de IA, esta es hoy la forma más barata y privada de poner trabajo real de repositorio sobre Ox Alpha.

![Centro de datos, la infraestructura detrás de los modelos stealth como Ox Alpha](/posts/images/ox-alpha-datacenter.jpg)

## Lo bueno, lo malo y la letra pequeña

**A favor:**
- Coste cero real en entrada y salida durante el *preview*.
- Contexto de 1M de tokens: cabe un *codebase* mediano entero en una sola consulta.
- Rápido para ser gratis (1 s de latencia, 70 tps reportados).
- Entrada multimodal (texto, imagen, vídeo) y herramientas agénticas completas.
- Gratis y con retención de datos en cero vía OpenCode.

**En contra:**
- Proveedor anónimo sin garantía de continuidad: el *preview* puede cerrarse sin aviso.
- El proveedor **retiene prompts y respuestas** (dice no usarlos para entrenar, pero los guarda).
- Razonamiento obligatorio en "max" que puede romper integraciones con topes bajos de tokens.
- Sin moderación ni *cutoff* de conocimiento declarado.

## Cuándo tiene sentido usarlo (y cuándo no)

Tiene sentido usarlo para experimentar, para *batch* y prototipos con datos no sensibles, para evaluar tu propio conjunto de pruebas de código y para aprovechar ese millón de tokens de contexto en tareas de razonamiento largas. La vía OpenCode lo hace especialmente atractivo para quien ya programa con agentes.

No compensa todavía para producción seria con datos de clientes, código propietario confidencial o información personal: un tercero anónimo guarda tus conversaciones. Y, como toda oferta gratuita de *preview*, presupuesta que el precio puede cambiar de un día a otro.

## La lección que se queda

Ox Alpha es, hoy, la forma más barata de probar un modelo de razonamiento con contexto de un millón de tokens: gratis en ambas direcciones, rápido y con herramientas agénticas completas, accesible tanto desde OpenRouter como —gratis y sin retención de datos— desde **OpenCode**. Se comporta bien en español y entrega JSON estricto válido en segundos cuando le das presupuesto suficiente.

Pero mantén los pies en la tierra: el razonamiento inapagable en "max" romperá integraciones con pocos tokens, el proveedor guarda tus conversaciones y nadie sabe quién está detrás ni cuánto durará la ventana. Para experimentar y prototipar, adelante. Para producción crítica, todavía no. Aprovecha el acceso gratis mientras dure, pero no le entregues las llaves de nada confidencial.
