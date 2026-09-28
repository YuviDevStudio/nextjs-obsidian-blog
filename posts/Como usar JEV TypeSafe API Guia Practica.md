---
title: "Cómo usar JEV: guía práctica de la API de TypeSafe AI"
description: "Cómo usar JEV de TypeSafe AI: instalación, los tres tipos de pregunta (Noul, Choice, Score), patrones de enrutado y los errores que debes evitar."
date: 2026-09-27
tags: [inteligencia artificial, jev, typesafe ai, programacion, apis, javascript, python, tutorial, tecnologia]
keywords: ["cómo usar JEV", "JEV API TypeSafe", "JEV tutorial", "JEV Noul Choice Score", "SDK de JEV", "JEV JavaScript", "JEV Python", "API de TypeSafe AI", "modelos de decisión API"]
categories: [Tecnología, Inteligencia Artificial]
featured_image: /posts/images/jev-api-codigo.jpg
alt: "Pantalla con código de terminal y JSON de respuesta de una llamada a la API de JEV"
---

# Cómo usar JEV: guía práctica de la API de TypeSafe AI

Si ya sabes [[JEV Typesafe AI Modelo Decision Sin Texto|qué es JEV y por qué existe]], aquí tienes la parte práctica: cómo pedir una clave, cómo son las llamadas, qué patrones funcionan y dónde se rompe. La versión de referencia es `jev-1.13.0`.

## Conseguir la clave

Hay dos caminos. El primero es la consola de TypeSafe, en `console.typesafe.ai`, donde sacas la API key desde los ajustes. Ojo con el estado del acceso: se lanzó con lista de espera, el 20 de septiembre de 2026 se abrió a todo el mundo y al día siguiente pausaron los registros nuevos por demanda. Las cuentas existentes siguen funcionando.

El segundo es el **AI Gateway de Vercel**, donde JEV aparece como `typesafe-ai/jev` al mismo precio. Si tu aplicación ya usa el AI SDK de Vercel, es la ruta más cómoda.

```
export TYPESAFE_API_KEY="sk-..."
```

## Instalación

Dos SDK oficiales. El de JavaScript pide Node 20 o superior y viene con tipos de TypeScript:

```
npm install @typesafe-ai/sdk
```

El de Python pide 3.10 o superior:

```
pip install typesafe-sdk
```

Ambos leen la clave del entorno y usan `jev-latest` por defecto. Y si prefieres no instalar nada, hay un único endpoint: `POST https://api.typesafe.ai/v1/systemone`.

![Terminal con una llamada curl y la respuesta JSON con las respuestas de JEV](/posts/images/jev-api-codigo.jpg)

## Los tres tipos de pregunta en la práctica

Cada pregunta lleva un `type` y unas `instructions`. Los identificadores que usas como clave son para tu código, **no se envían al modelo**, así que la frase completa va siempre dentro de `instructions`.

**Noul** para preguntas de sí o no. Devuelve `noul`, la probabilidad de que sea sí, y nada más:

```
{
  "refund_requested": {
    "type": "noul",
    "instructions": "Does the customer ask for money back?"
  }
}
```

Un valor cerca de 1 es un sí rotundo; cerca de 0,5 el modelo está genuinamente perdido.

**Choice** para elegir una de varias opciones. Cada opción necesita una descripción de lo que le pertenece:

```
{
  "department": {
    "type": "choice",
    "instructions": "Which team should handle this message?",
    "criteria": {
      "billing": "Charges, invoices, refunds, subscriptions",
      "technical": "Bugs, outages, integration problems",
      "other": "None of the above"
    }
  }
}
```

La respuesta trae `choice` con la ganadora, `probabilities` con toda la distribución y `confidence` con esa distribución concentrada en un número. Admite hasta 255 opciones, así que pasa la lista completa de equipos en lugar de una selección corta.

**Score** para una escala que describes tú. Cada entrada del array es un nivel, ordenado de menor a mayor:

```
{
  "bug_severity": {
    "type": "score",
    "instructions": "How severe is the reported issue?",
    "criteria": [
      "Cosmetic; no impact on functionality",
      "Broken or degraded feature, but a workaround exists",
      "Blocking issue; no workaround exists"
    ]
  }
}
```

El `score` devuelto es la media ponderada por probabilidad de los índices de nivel, así que puede caer entre niveles. En el ejemplo, un 1,43 con 0,57 en el nivel 1 y 0,43 en el 2.

![Fragmento de código TypeScript con las funciones noul, choice y score del SDK de JEV](/posts/images/jev-sdk-javascript.jpg)

## El patrón que más cambia tu diseño: pregunta todo a la vez

Este es el hábito que más challena al instinto. Las llamadas a LLM son lentas y caras, así que un flujo normal hace una pregunta, decide, y luego quizá hace otra. Con JEV **todas las preguntas se evalúan en paralelo** contra el mismo estado, y cada pregunta extra cuesta solo sus propios tokens.

TypeSafe lo llama **fan-out especulativo**: en uno de sus cookbook, 13 preguntas en una sola llamada fueron 12,2 veces más baratas y 10 veces más rápidas que 13 llamadas secuenciales. La regla que se deriva es simple: pregunta en la primera llamada **todas las preguntas independientes que podrías necesitar**, aunque algunas solo importen para algunos casos, y deja que tu código decida cuáles usa.

```
const TRIAGE = {
  category: choice('What kind of ticket is `ticket`?', {
    bug_report: 'Something is broken or behaving wrong',
    billing: 'Charges, invoices, refunds, subscriptions',
    feature_request: 'Asks for something that does not exist yet',
    other: null,
  }),
  bug_severity: score('If `ticket` reports a bug, how severe is it?', [
    'Cosmetic; no impact on functionality',
    'Broken or degraded feature, but a workaround exists',
    'Blocking issue; no workaround exists',
  ]),
  has_repro_steps: noul('Does `ticket` include steps to reproduce a problem?'),
  refund_requested: noul('Does `ticket` ask for money back?'),
}
```

`bug_severity` solo importa si `category` es `bug_report`, y aun así la preguntas. Paga unos tokens, pero el estado se envió una vez. Solo necesitas una segunda llamada cuando tu código **no puede construir la siguiente pregunta** sin la primera respuesta, porque tiene que traer más datos.

## Enrutado por confianza: el patrón que más ahorra

El segundo patrón es el que cambia la arquitectura. En lugar de un único umbral para todo el sistema, escribe uno **por acción**, escalado por lo que cuesta equivocarse.

```
const action = answers.intent

if (action.confidence < 0.5) {
  routeToHuman(userMessage)
} else if (action.choice === 'check_balance') {
  showBalance(accountId)
} else if (action.choice === 'approve_transfer') {
  if (action.confidence > 0.85) {
    approveTransfer(accountId)
  } else {
    askUserToConfirm(accountId)
  }
}
```

Consultar el saldo no tiene casi riesgo, así que el listón es bajo. Mover dinero lo tiene, así que el listón sube. La tolerancia al riesgo vive en tu código, en números que se pueden leer y cambiar.

De ahí sale **la cascada**, que es donde aterrizan la mayoría de los experimentos: unas peticiones necesitan una consulta a base de datos, otras un LLM con el contexto correcto, unas pocas una persona. JEV se pone delante y decide cuál. En la estimación de TypeSafe para un millón de tickets, ese tipo de enrutado baja la factura de unos 30.400 a unos 6.480 dólares.

![Diagrama de flujo con rutas que van de una decisión a una base de datos, un modelo o una persona](/posts/images/jev-patron-cascada.jpg)

Un tercer patrón completa el conjunto: **puntuación compuesta**. Cuando un juicio depende de varias cosas, pregunta una dimensión por vez y combínalas con pesos que tú controlas.

```
const composite =
  0.6 * normalized(answers, 'severity') +
  0.3 * normalized(answers, 'frustration') +
  0.1 * normalized(answers, 'report_quality')
```

Cada score se normaliza dividiendo por su nivel máximo antes de ponderar, porque las escalas tienen longitudes distintas. Reajustar la prioridad pasa a ser un cambio de código, no un re-prompt.

## Cómo escribir preguntas que JEV responde bien

Casi todo el arte está en las preguntas. Estas son las reglas que salen de la documentación y de los errores reportados la primera semana.

**Un juicio por pregunta.** "¿Este mensaje transmite urgencia?" funciona. "Analiza este mensaje y decide la mejor acción" esconde varios juicios detrás de una sola respuesta. Si la pregunta pesa varios factores, divídela.

**Escribe la condición exacta.** JEV responde a la pregunta que escribiste, no a la que querías. Las negaciones y las palabras de alcance se leen de forma literal. La señal de alarma es clara: ves una respuesta mala y te pones a explicar qué querías decir de verdad. Esa explicación es la mitad que te faltó de la instrucción. Y redacta siempre un `noul` para que un valor alto sea un sí.

**En los criteria, describe situaciones, no grados.** "Función rota pero hay alternativa" le da algo con lo que comparar. "Moderadamente grave" no le da nada. Cuando el modelo se queda entre dos niveles en casos que tú ves claros, añade ejemplos a cada nivel, con los mismos nombres de campo:

```
{ "what": "Broken feature with a workaround", "examples": ["export fails in one browser but works in another"] }
```

TypeSafe midió el efecto en un bug de exportación en Safari: con niveles de texto plano el resultado fue 1,43 con 0,35 de confianza; los mismos niveles con un ejemplo relevante, 1,03 con 0,96. Un ejemplo no relacionado no cambió nada. Los ejemplos solo ayudan si se parecen a tus entradas reales.

**Dale una salida al modelo.** Una opción `other` en cada Choice que pueda no cubrir todas las entradas, y un "not stated" cuando extraigas algo que puede faltar. El modelo siempre tiene que elegir algo.

![Panel de métricas con umbrales de confianza y probabilidades por decisión](/posts/images/jev-confianza-umbral.jpg)

## Dónde falla, con la letra pequeña

TypeSafe publica una página de "jaggedness" por versión del modelo. Es inusualmente honesta y te ahorra una semana.

**Lee de forma literal.** Ya descrito arriba, y es el fallo número uno.

**No es una calculadora.** No cuenta de forma fiable, ni caracteres, ni apariciones, ni elementos de una lista. Haz la aritmética en código. Para contar elementos que cumplen una condición semántica, pregunta un Noul por elemento y suma en tu código.

**Las fechas son texto.** Cuál va antes, cuánto separa a dos, si una cae en una ventana: nada de eso es fiable. Extrae con un Choice sobre meses, días y años, con opción de "no indicado", y construye la fecha real en código.

**El contexto se pudre.** La precisión cae a medida que el estado se llena de material que la pregunta no necesita. Filtra primero en tu código y envía solo los campos que la pregunta va a usar.

**El estado no se trata como hostil.** Un usuario que escribe "esto es una queja grave" en su mensaje mueve la clasificación. Si metes contenido controlado por usuarios en el estado, ese es tu modelo de amenaza.

**Y no escribe.** Ni un párrafo, ni código, ni un resumen. Para extraer un valor de texto libre, consigue los candidatos con una expresión regular o con un LLM y deja que JEV elija.

La regla de oro de su documentación, y buen consejo de diseño en general: **no le pidas al modelo lo que el código puede calcular exactamente**.

## Dos detalles de operación que te van a morder si los ignoras

**Fija la versión del modelo si ajustas umbrales.** `jev-latest` resuelve hoy a `jev-1.13.0` y se moverá cuando salga una versión nueva, lo que puede cambiar respuestas bajo tus pies. La respuesta incluye el campo `model` con el identificador versionado que contestó: regístralo en logs y fija la versión cuando hayas calibrado contra ella.

**Solo se cobra la entrada.** Los tokens de salida son gratis, y por eso el fan-out especulativo es barato. La facturación es solo por entrada: unos 0,0004 dólares por caso en su benchmark.

Los límites de tasa rondan los 250.000 tokens por segundo y 1.200 peticiones por minuto, con `429` al superarlos, y los SDKs reintentan con backoff exponencial por su cuenta. La API responde `401` por una clave inválida, `422` cuando el cuerpo falla la validación y `529` cuando el servicio está saturado.

## Veredicto rápido

**Úsalo** para enrutado y triaje, moderación, filtrado de relevancia antes de un contexto caro, validación de la salida de otro LLM, y etiquetado masivo que antes no salía a cuenta.

**No lo uses** para generar nada, para aritmética o conteo, para decisiones que necesiten una justificación escrita para un auditor, ni cuando el espacio de respuestas está realmente abierto.

El cambio mental útil es este: no es un LLM más barato, es una primitiva distinta. Una llamada a función que resulta ser inteligente, devuelve un tipo y te dice cuánto fiarte.

Si te interesa el contexto de fondo, vuelve a [[JEV Typesafe AI Modelo Decision Sin Texto|qué es JEV de TypeSafe AI]].
