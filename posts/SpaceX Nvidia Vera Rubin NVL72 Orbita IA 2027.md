---
title: "SpaceX y Nvidia llevarán Vera Rubin NVL72 a órbita en 2027"
description: "SpaceX y Nvidia llevarán Vera Rubin NVL72 optimizado al espacio. Lanzamiento a órbita en 2027 y escala en 2028: especificaciones, retos y por qué importa."
date: 2026-08-26
tags: [inteligencia artificial, spacex, nvidia, vera rubin, orbita, datacenter, tecnologia, elon musk]
keywords: ["Vera Rubin NVL72 en órbita", "SpaceX Nvidia datacenter espacial", "centro de datos de IA en el espacio", "Vera Rubin NVL72 especificaciones", "satélite de inteligencia artificial SpaceX", "Elon Musk IA orbital 2027", "NVIDIA Vera Rubin NVL72 space-optimized", "Falcon 9 capacidad de carga LEO", "StarMind SpaceX", "infraestructura de IA en el espacio"]
categories: [Tecnología, Inteligencia Artificial]
featured_image: /posts/images/vera-rubin-orbit-cohete-falcon9.jpg
alt: "Lanzamiento de un cohete Falcon 9 de SpaceX hacia la órbita terrestre"
---

# SpaceX y Nvidia llevarán Vera Rubin NVL72 a órbita en 2027

Elon Musk anunció esta semana que **SpaceX, en colaboración con Nvidia, ha diseñado un sistema Vera Rubin NVL72 optimizado para el espacio**, con un primer lanzamiento a la órbita terrestre previsto para el cuarto trimestre de 2027 y una "escala significativa" a partir de 2028. La noticia, publicada primero en su cuenta de X, redefine lo que hasta ahora parecía ciencia ficción: centros de datos de inteligencia artificial operando fuera del planeta.

Nvidia confirmó la alianza en un comunicado propio. Según la compañía, los satélites de centro de datos de SpaceX "se basarán en el sistema a escala de rack NVIDIA Vera Rubin NVL72 optimizado". La diferencia entre un rack terrestre y uno espacial aún no está detallada, pero el objetivo es claro: llevar cómputo de alto rendimiento allá donde la Tierra se queda corta.

![Lanzamiento de un cohete Falcon 9 de SpaceX, el vehículo que podría llevar los primeros racks a órbita](/posts/images/vera-rubin-orbit-cohete-falcon9.jpg)

## Qué es el Vera Rubin NVL72

El Vera Rubin NVL72 es el sistema de rack a escala completa de Nvidia para sus supercomputadoras de nueva generación. En su configuración estándar reúne:

- **72 GPUs Rubin** y **36 CPUs Vera** trabajando como una sola unidad lógica.
- Tarjetas **ConnectX-9 SuperNIC** y **BlueField-4 DPU** para interconexión y gestión.
- **18 bandejas de cómputo** más **9 bandejas de conmutación NVLink**, que mantienen unida a toda la bestia.

Cada unidad pesa cerca de **1.800 kg**, el equivalente a una camioneta pickup, y consume unos **120 kW** con refrigeración líquida. En tierra, eso ya exige una infraestructura eléctrica y térmica considerable. Llevarlo al espacio multiplica el reto por el estrés del lanzamiento y la ausencia de atmósfera.

## Un centro de datos que orbita la Tierra

SpaceX ha bautizado su diseño de satélite de centro de datos como **StarMind**. Según la documentación publicada por la compañía, cada satélite contará con un arreglo solar de **210 kW** y radiadores de líquido que "expulsan el calor al vacío del espacio", aprovechando la experiencia de SpaceX operando vehículos en órbita.

La propuesta tiene lógica física. En el espacio sobra el sol y falta el aire: la energía se capta con paneles y el calor se disipa radiando directamente al vacío, sin necesidad de torres de enfriamiento ni ríos cercanos. Para una carga de trabajo que devora electricidad y genera calor, el entorno orbital resuelve de golpe los dos cuellos de botella principales.

![La Tierra vista desde el espacio, el escenario donde orbitarían los satélites de centro de datos](/posts/images/vera-rubin-orbit-tierra.jpg)

## ¿Por qué llevar la IA al espacio?

La demanda de cómputo para entrenar y ejecutar modelos grandes crece más rápido de lo que crecen las redes eléctricas terrestres. Los centros de datos convencionales compiten por energía, suelo y agua de refrigeración, y se topan con límites regulatorios y comunitarios. Una flota de racks en órbita esquiva esas restricciones: se escala lanzando más satélites, no negociando permisos.

También encaja con el ecosistema de Musk. X alimenta a **Grok**, el modelo de IA de su empresa xAI, y contar con infraestructura orbital dedicada abre la puerta a cómputo masivo sin depender del precio ni de la disponibilidad de la red eléctrica regional. No es tanto latencia para el usuario final, sino capacidad bruta para entrenamiento y experimentación a gran escala.

![Sala de centro de datos convencional en la Tierra, el contraste frente a la infraestructura orbital](/posts/images/vera-rubin-orbit-datacenter.jpg)

## Los retos reales y una dosis de escepticismo

Ni Nvidia ni SpaceX han explicado qué significa exactamente "optimizado para el espacio". Se asume que incluye **endurecimiento contra radiación** y refuerzos para soportar las vibraciones y la aceleración del lanzamiento. También falta saber qué cohete usará SpaceX y si el número de servidores por satélite cambiará.

El transporte, al menos sobre el papel, es viable. El **Falcon 9** lleva hasta 22.800 kg a la órbita terrestre baja, y su cofía mide 13,1 m de alto por 5,2 m de diámetro. Los racks MGX de Nvidia miden unos 2,3 m de alto, así que varias unidades caben en una sola misión. SpaceX ya supera los 100 lanzamientos anuales, de modo que el volumen de envío no parece el cuello de botella principal.

El verdadero interrogante es el historial. Las empresas de Musk innovan de verdad, pero él tiene fama de anunciar plazos ambiciosos que llegan tarde o no llegan. Una investigación reciente del *New York Times* concluyó que cumplió el 19 % de 602 promesas públicas y entregó con retraso o no entregó el 35 %. El espacio es hostil, y un rack de 1.800 kg no perdona un error de diseño.

![Estación espacial internacional, una referencia real de hardware operando en órbita](/posts/images/vera-rubin-orbit-estacion-iss.jpg)

## Cronología y qué esperar

El calendario declarado es ajustado pero concreto:

1. **Cuarto trimestre de 2027:** primer sistema Vera Rubin NVL72 optimizado rumbo a la órbita.
2. **2028:** despliegue a "escala significativa", según la propia afirmación de Musk.

Mientras tanto, conviene seguir el comunicado de Nvidia y la página técnica de StarMind como fuentes primarias. La comunidad de IA ya analiza cómo esto podría cambiar la economía del entrenamiento de modelos; para contexto sobre el estado actual de los grandes modelos, vale leer nuestro análisis de [[Grok 4.6 xAI Nuevo Modelo Agosto 2026 Analisis|Grok 4.6]] y la comparativa de [[ChatGPT 5.6 y IA Competidores|ChatGPT 5.6]].

## Conclusión

Llevar un Vera Rubin NVL72 a la órbita deja de ser una ocurrencia para convertirse en un plan con socios de peso, hardware real y una ventana de lanzamiento definida. Los obstáculos técnicos son serios, y el historial de promesas espaciales de Musk invita a la prudencia. Aun así, la dirección es coherente: si la inteligencia artificial necesita más energía y más enfriamiento de los que la Tierra puede regalarle, el espacio empieza a parecer el siguiente data center lógico.

*Créditos de imágenes: lanzamiento Falcon 9, 45th Space Wing / DVIDS (dominio público); Tierra y Estación Espacial Internacional, NASA (dominio público); sala de centro de datos, UNC (CC BY-SA 4.0).*
