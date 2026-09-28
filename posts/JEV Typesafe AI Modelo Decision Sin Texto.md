---
title: "Qué es JEV, el modelo de TypeSafe AI que decide sin escribir"
description: "JEV es el primer modelo System One de TypeSafe AI: devuelve decisiones tipadas con probabilidad en 100 ms en lugar de generar texto. Claves, precio y límites."
date: 2026-09-27
tags: [inteligencia artificial, jev, typesafe ai, modelos de lenguaje, programacion, apis, agentes, tecnologia]
keywords: ["qué es JEV", "JEV TypeSafe AI", "JEV modelo System One", "JEV IA", "TypeSafe AI", "JEV precio", "JEV vs ChatGPT", "modelos de decisión IA", "JEV Noul Choice Score"]
categories: [Tecnología, Inteligencia Artificial]
featured_image: /posts/images/jev-portada.jpg
alt: "Ilustración abstracta de una red neuronal con rutas de decisión iluminadas en azul"
---

# Qué es JEV, el modelo de TypeSafe AI que decide sin escribir

Un modelo que no escribe. Suena raro hasta que entiendes qué problema resuelve.

**JEV** es el primer modelo público de **TypeSafe AI**, un laboratorio de San Francisco que salió del modo sigiloso el 15 de septiembre de 2026 con una ronda de financiación de 40 millones de dólares liderada por DCVC. El equipo lo lidera **Diogo Almeida**, uno de los creadores de RLHF e InstructGPT en OpenAI. Y la apuesta es tan específica que casi parece una provocación: un modelo entrenado para **no generar texto**.

Le mandas un estado (sus datos) y una lista de preguntas tipadas. Te devuelve una respuesta por pregunta, con su probabilidad. Nada de párrafos, nada de código, nada de resúmenes. Y lo hace en unos 100 milisegundos por **0,042 dólares por millón de tokens de entrada**, con la salida gratis.

Si quieres el paso a paso con código, está en [[Como usar JEV TypeSafe API Guia Practica|la guía práctica de la API de JEV]]. Aquí va primero qué es y por qué existe.## Un `if` que sí entiende el significado

La forma más rápida de entender JEV es pensarlo como una sentencia `if` inteligente.

El código normal ramifica sobre valores que puede calcular: `if (order.total > 100)`. Se rompe en cuanto la condición es un **juicio**. ¿Este mensaje de soporte está enfadado? ¿Este correo trata de facturación? ¿Cuál de estos doce botones continúa el pago?

Hasta ahora tenías tres opciones y ninguna era cómoda. Reglas y expresiones regulares: rápidas y baratas, pero frágiles en cuanto importa el significado. Clasificadores: rápidos, pero necesitan ejemplos etiquetados, un entrenamiento y un modelo por tarea. Y un LLM generalista, que entiende texto sin entrenar por tarea, pero sigue siendo generativo, incluso cuando le obligas a devolver JSON.

JEV apunta al hueco del medio. Acepta texto no estructurado y preguntas que tú defines en tiempo de ejecución, como un LLM. Pero devuelve una **distribución de probabilidad restringida** a las opciones que le diste, como un clasificador.

La diferencia está en cómo se produce la respuesta. Un LLM genera token a token, y la generación puede fallar o cortarse antes de tiempo. JEV no genera una cadena: **muestrea todas las respuestas en paralelo**, evaluando cada pregunta de forma independiente contra el mismo estado.

Ahí está el origen de la velocidad y del precio. TypeSafe habla de 70 a 500 milisegundos de latencia de extremo a extremo, frente a los 3 a 329 segundos de los LLM de frontera en el mismo tipo de pregunta. Y un 0% de errores de salida estructurada, por construcción y no por suerte.

![Panel de análisis con datos y probabilidades, la representación de las decisiones tipadas que devuelve JEV](/posts/images/jev-decisiones.jpg)

Ojo con ese 0%. Cubre la **forma** de la respuesta, no si es correcta. JEV no puede devolver una categoría inventada, pero sí la categoría equivocada. Son dos problemas distintos, y conviene no confundirlos.

## En qué se diferencia de ChatGPT, Cursor y Claude Code

ChatGPT, Cursor, Codex o Claude Code ponen un modelo generativo en el centro. Les das una petición abierta y producen algo nuevo. JEV no acepta objetivos abiertos, no invoca herramientas, no edita archivos y no ejecuta ningún bucle.

| Herramienta | Qué le das | Qué devuelve | Su papel |
| :--- | :--- | :--- | :--- |
| ChatGPT | Un prompt o conversación | Una respuesta generada | Asistente general |
| Cursor | Tarea, repositorio y herramientas | Ediciones, comandos, tests | Editor y agente |
| Claude Code | Una instrucción y herramientas locales | Tool calls, ediciones, terminal | Agente de terminal |
| **JEV** | Estado y preguntas con respuestas tipadas | Opciones, puntuaciones y probabilidades | Primitiva de decisión |

La diferencia clave es **dónde se sitúa la IA**. En ChatGPT, la IA es la interfaz. En JEV es un componente pequeño dentro de una aplicación normal, colocado donde el código necesita un juicio y no sabe redactar la condición.

Eso abre usos que hasta ahora eran raros: un agente que pregunta a JEV si un comando de terminal es destructivo antes de ejecutarlo, un router que decide qué modelo recibe cada tarea, una app de soporte que decide si un mensaje necesita una base de datos, un modelo o una persona.

El agente sigue escribiendo el código. JEV decide el camino.

## Los tres tipos de pregunta

Toda la API son tres primitivas, y eso no es una limitación que se esquive: es el diseño.

**Noul** es una pregunta de sí o no, y devuelve un número entre 0 y 1 con la probabilidad de que sea sí. **Choice** es elegir una opción de un conjunto que tú defines, y devuelve la opción ganadora, la distribución completa de probabilidades y un valor de `confidence`. Admite hasta 255 opciones. **Score** es una posición en una escala que describes tú, y devuelve la media ponderada por probabilidad de los niveles, la distribución y la confianza. Admite entre 2 y 10 niveles.

![Tres tarjetas de opciones con casillas y una escala, los tres tipos de pregunta de JEV](/posts/images/jev-tipos-pregunta.jpg)

La diferencia entre Noul y Score importa más de lo que parece. Un Noul en 0,5 no significa "a medias": significa que el modelo no sabe distinguir. Y el `score` de un Score es una **media ponderada** sobre los índices de los niveles, así que puede caer entre ellos. Un 1,43 quiere decir "repartido entre el nivel 1 y el 2, inclinándose por el 1". Por eso hay que leer las `probabilities` al lado: `confidence` es lo que te dice si ese 1,0 es todo peso en el nivel 1 o mitad y mitad entre el 0 y el 2.

## El nombre dice toda la tesis

**System One** viene de *Pensar rápido, pensar despacio*, de Daniel Kahneman. Sistema 1 es el juicio rápido e intuitivo; Sistema 2, el razonamiento lento. En el marco de TypeSafe, JEV es el primero y los modelos de razonamiento son el segundo.

**JEV** viene de William Stanley Jevons, el economista detrás de la paradoja de Jevons. Los motores de vapor más eficientes no redujeron el consumo de carbón: lo dispararon, porque la energía más barata encuentra usos nuevos. La misma apuesta para la inteligencia. Si una decisión cuesta una fracción de céntimo, acabarás tomándola en sitios donde nunca habrías llamado a un LLM.

## Cómo lo entrenaron

ChatGPT usa RLHF, que premia las respuestas que los humanos prefieren. JEV se entrenó con **RLCD** (Reinforcement Learning for Calibrated Decisions), que optimiza para que las probabilidades **coincidan con los resultados**.

La diferencia no es académica. Si JEV dice 90% con frecuencia, debería acertar alrededor del 90% de las veces. Un LLM generalista te da una probabilidad, pero nadie garantiza que esté calibrada. Eso convierte `confidence` en una señal fiable, que es donde está el valor real del modelo.

![Centro de datos con servidores, la infraestructura detrás del modelo JEV de TypeSafe AI](/posts/images/jev-precios.jpg)

## Los números, con la letra pequeña

TypeSafe mide su modelo con cuatro flujos de trabajo propios. En su tabla, JEV saca 67,8%, prácticamente al nivel de GPT-5.6 Terra (67,9%) y Claude Sonnet 5 (67,8%), por detrás de Opus 5 (73,1%), a una fracción del coste y la latencia.

Tres matices obligatorios. El primero: **esa columna no es precisión**. No hay verdad de referencia. TypeSafe construye las etiquetas promediando GPT-6 Astra y Claude Fable 5.1 en razonamiento alto, y luego puntúa a todos contra ese consenso. Mide acuerdo con dos modelos de frontera, no acierto real, y la propia empresa admite que eso sesga la comparación hacia OpenAI y Anthropic.

El segundo: **la evaluación es propia**. TypeSafe diseñó los flujos, construyó el arnés y lo ejecutó. Para el contexto del resto de la carrera, tienes nuestra [[ChatGPT 5.6 y IA Competidores|comparativa de modelos de 2026]].

El tercero: el titular de "193,6 veces más rápido y 444,6 veces más barato" sale de esas mismas evaluaciones, y TypeSafe dice que sus flujos están en el extremo alto de resultados reales. Léelo como un techo.

El precio se cobra **solo por tokens de entrada**: 0,042 dólares por millón, con la salida gratuita. TypeSafe admite que no puede demostrar que el precio no esté subsidiado, aunque dice esperar que baje.

## Dónde encaja y dónde no

JEV tiene sentido en **clasificación masiva y enrutado**: etiquetar filas, ordenar tickets, decidir qué modelo recibe una petición, filtrar pasajes de RAG antes de que los vea algo caro, moderar, puntuar la salida de otro LLM.

No tiene sentido si necesitas que escriba, si quieres una justificación legible para un auditor, si necesitas aritmética o matemáticas de fechas, o si el espacio de respuestas está realmente abierto. Y hay una limitación estructural: **no sabe nada del mundo más allá del estado que le pases**. Lo que arma el estado decide lo que JEV tiene permitido saber.

## La conclusión honesta

JEV no es un LLM más barato. Es otra primitiva: una llamada a función que resulta ser inteligente, devuelve un tipo y te dice cuánto fiarte.

Si funciona, la consecuencia es incómoda. Hoy casi todas las llamadas a IA están dentro de un chatbot visible, y una persona abre ChatGPT unas pocas veces al día. El software puede tomar miles de decisiones diminutas en segundo plano, dentro de una cola de soporte o un pipeline de eventos, sin interfaz de IA a la vista.

Falta por ver si los grandes proveedores siguen ese camino o si esto se queda en un experimento interesante de un laboratorio con mucho dinero. Lo que ya se puede afirmar es la tesis: gran parte del margen de mejora no está en el modelo, sino en la decisión.

Si ya te ha quedado claro el qué, el siguiente paso es [[Como usar JEV TypeSafe API Guia Practica|cómo usar JEV desde la API]].
