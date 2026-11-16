export const metadata = {
  title: 'Acerca de',
  description:
    'Acerca de JotaEDRA: quién es Jorge Da Rocha, por qué existe este blog en español y de qué trata: código, vida sana, tecnología en tendencia e inteligencia artificial.',
  alternates: {
    canonical: '/acerca-de',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Acerca de JotaEDRA | Jorge Da Rocha',
    description:
      'Código, vida sana, tecnología en tendencia e IA. La historia y la misión de JotaEDRA, el blog en español de Jorge Da Rocha.',
    url: 'https://jotaedra.com/acerca-de',
    type: 'profile',
  },
};

const toc = [
  { id: 'quien-soy', label: 'Quién soy' },
  { id: 'por-que-jotaedra', label: 'Por qué existe JotaEDRA' },
  { id: 'el-codigo', label: 'El código como vocación' },
  { id: 'vida-sana', label: 'Vida sana' },
  { id: 'tecnologia', label: 'La tecnología que viene' },
  { id: 'ia-para-todo', label: 'IA para todo' },
  { id: 'contacto', label: 'Contacto' },
];

const pilares = [
  {
    title: 'Código',
    desc: 'Programar es construir algo que antes no existía. Es la forma más directa que conozco de dejar huella.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l-3 3 3 3m8-6l3 3-3 3m-2-8l-2 12" />
    ),
  },
  {
    title: 'Vida sana',
    desc: 'Sueño, alimentación, movimiento y cabeza fría. Sin salud no hay ni código ni curiosidad que duren.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    ),
  },
  {
    title: 'Tecnología en tendencia',
    desc: 'Lo que está pasando ahora mismo, aunque todavía no sea mainstream. Contarlo antes de que se normalice.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    ),
  },
  {
    title: 'IA para todo',
    desc: 'La inteligencia artificial ya no es una herramienta más: es la capa sobre la que se construye todo lo demás.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    ),
  },
];

const valores = [
  { title: 'Directo y honesto', desc: 'Si algo no funciona, lo digo. Si no lo sé, lo digo también.' },
  { title: 'Sin jerga de relleno', desc: 'Traduzco la news para que se entienda sin carrera ni contexto.' },
  { title: 'Fuentes primero', desc: 'Nada de titulares reciclados. Cada dato importante tiene detrás su origen.' },
  { title: 'Se corrige', desc: 'Si me equivoco, se corrige y se avisa. La memoria también es una virtud.' },
];

function SectionHeading({ id, children }) {
  return (
    <h2
      id={id}
      className="flex items-center gap-3 text-xl md:text-2xl font-bold font-display text-slate-800 dark:text-slate-100 leading-snug scroll-mt-28"
    >
      <span
        aria-hidden="true"
        className="inline-block w-1.5 h-7 rounded-full bg-indigo-600 dark:bg-sky-500"
      />
      <span>{children}</span>
    </h2>
  );
}

export default function AcercaDePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Acerca de JotaEDRA',
    url: 'https://jotaedra.com/acerca-de',
    inLanguage: 'es-ES',
    mainEntity: {
      '@type': 'Person',
      name: 'Jorge Da Rocha',
      url: 'https://jotaedra.com/acerca-de',
      email: 'admin@jotaedra.com',
      description:
        'Desarrollador y creador de JotaEDRA. Escribe sobre código, vida sana, tecnología en tendencia e inteligencia artificial.',
      worksFor: {
        '@type': 'Organization',
        name: 'Yuvi Dev Studio',
      },
    },
  };

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Migas de pan" className="mb-5 text-xs md:text-sm text-slate-500 dark:text-slate-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <a href="/" className="hover:text-indigo-600 dark:hover:text-sky-400 hover:underline underline-offset-2">
              Inicio
            </a>
          </li>
          <li aria-hidden="true" className="text-slate-300 dark:text-slate-600">/</li>
          <li aria-current="page" className="font-semibold text-slate-700 dark:text-slate-200">
            Acerca de
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="bg-white border border-slate-200 dark:bg-slate-900/10 dark:border-slate-800/45 rounded-2xl shadow-sm p-6 md:p-10 mb-8 overflow-hidden relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600 dark:from-sky-400 dark:via-indigo-400 dark:to-sky-400"
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div
            aria-hidden="true"
            className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-sky-500 dark:to-indigo-500 shadow-md flex items-center justify-center"
          >
            <span
              className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight"
              style={{ color: '#ffffff' }}
            >
              JD
            </span>
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              Hola, soy Jorge Da Rocha
            </h1>
            <p className="mt-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-sky-400">
              Desarrollador y creador de JotaEDRA
            </p>
          </div>
        </div>

        <p className="mt-6 text-slate-600 dark:text-slate-300 text-[16px] md:text-[17px] leading-relaxed max-w-3xl">
          Me obsesiona el código, la vida sana y las tecnologías que están marcando tendencia. Y,
          sobre todo, con cómo la inteligencia artificial se ha convertido en la capa sobre la
          que construimos todo lo demás. Este es el espacio donde escribo sobre las cuatro cosas,
          sin humo y sin adornos.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:admin@jotaedra.com"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold no-underline shadow-sm transition-colors hover:brightness-110"
            style={{ color: '#ffffff', backgroundColor: '#4f46e5' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Escríbeme
          </a>
          <a
            href="#quien-soy"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400 hover:border-indigo-300 dark:hover:border-sky-500/30 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all"
          >
            Conóceme
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>

      {/* Pilares */}
      <section aria-labelledby="pilares" className="mb-8">
        <h2
          id="pilares"
          className="sr-only"
        >
          Los cuatro pilares de JotaEDRA
        </h2>
        <ul className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {pilares.map((p) => (
            <li
              key={p.title}
              className="group bg-white border border-slate-200 dark:bg-slate-900/10 dark:border-slate-800/45 rounded-2xl shadow-sm p-5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-sky-500/30"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-sky-500/10 text-indigo-600 dark:text-sky-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {p.icon}
                </svg>
              </span>
              <h3 className="mt-3 text-base font-bold font-display text-slate-800 dark:text-slate-100">
                {p.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {p.desc}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        {/* Sidebar TOC */}
        <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-24 order-first lg:order-none">
          <nav
            aria-label="Índice de la página"
            className="bg-white border border-slate-200 dark:bg-slate-900/10 dark:border-slate-800/45 p-5 rounded-2xl shadow-sm"
          >
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
              En esta página
            </h2>
            <ol className="space-y-1">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block px-2 py-1.5 rounded-lg text-[13.5px] leading-snug text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-indigo-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        {/* Main content */}
        <article className="w-full lg:flex-grow lg:max-w-[780px] bg-white border border-slate-200 dark:bg-slate-900/10 dark:border-slate-800/45 rounded-2xl shadow-sm p-6 md:p-10">
          <div className="space-y-10 text-slate-600 dark:text-slate-300 text-[16px] md:text-[17px] leading-relaxed">
            <section aria-labelledby="quien-soy" className="scroll-mt-28">
              <SectionHeading id="quien-soy">Quién soy</SectionHeading>
              <p className="mt-4">
                Soy <strong className="font-semibold text-slate-800 dark:text-slate-100">Jorge Da Rocha</strong>,
                desarrollador y fundador de{' '}
                <strong className="font-semibold text-slate-800 dark:text-slate-100">Yuvi Dev Studio</strong>,
                el proyecto detrás de JotaEDRA. Mi día se parece bastante a lo que te imaginas: un
                editor de código, un terminal abierto y demasiado café en la taza.
              </p>
              <p className="mt-4">
                No llegué a la programación por una carrera ni por un plan. Llegué porque siempre
                tuve curiosidad por cómo funcionan las cosas por dentro, y porque resolver un
                problema técnico hace algo que casi nada más consigue: encender una luz de verdad
                cuando algo no funciona. Esa sensación de haber construido algo que antes no
                existía es, probablemente, lo que me enganchó.
              </p>
              <p className="mt-4">
                Con el tiempo fui asumiendo que la tecnología no es solo una herramienta: es una forma
                de organizar el mundo. Y si vas a pasar años en ese mundo, conviene entenderlo bien
                y, sobre todo, escribir sobre él con honestidad.
              </p>
            </section>

            <section aria-labelledby="por-que-jotaedra" className="scroll-mt-28">
              <SectionHeading id="por-que-jotaedra">Por qué existe JotaEDRA</SectionHeading>
              <p className="mt-4">
                JotaEDRA nació de una frustración bastante simple: la conversación sobre
                inteligencia artificial, tecnología y salud se está haciendo, cada vez más, en
                inglés. Y el español, que es un idioma perfecto para explicar estas cosas, se
                queda fuera de la conversación.
              </p>
              <p className="mt-4">
                No se trata de traducir un titular. Se trata de explicarlo: qué es realmente, qué
                cambia para alguien normal y qué es ruido de marketing. Si alguien llega desde otro
                idioma, se merece leer en el suyo y con el mismo nivel de profundidad.
              </p>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {valores.map((v) => (
                  <div
                    key={v.title}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30"
                  >
                    <p className="font-bold font-display text-slate-800 dark:text-slate-100 text-[15px]">
                      {v.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="el-codigo" className="scroll-mt-28">
              <SectionHeading id="el-codigo">El código como vocación</SectionHeading>
              <p className="mt-4">
                Programar es una de las pocas disciplinas donde la práctica es la única vía. No
                hay atajo. Puedes leer diez artículos sobre arquitectura y seguir escribiendo el
                mismo código mediocre; o puedes construir algo, equivocarte, entender por qué y
                hacerlo mejor la próxima vez.
              </p>
              <p className="mt-4">
                Me interesan especialmente los proyectos donde el código se encuentra con problemas
                reales: rendimiento, mantenibilidad, experiencia de usuario. El software que se
                escribe rápido y se rompe más rápido no es una solución, es un aplazamiento del
                problema. Escribir software que dentro de seis meses sigue funcionando es, para mí,
                la métrica que importa.
              </p>
              <p className="mt-4">
                También me mueve la curiosidad pura: entender cómo funciona una base de datos, un
                protocolo de red, un modelo de lenguaje. Ese tipo de conocimiento casi nunca se
                paga bien, pero es lo que hace que el resto de tu trabajo tenga sentido.
              </p>
            </section>

            <section aria-labelledby="vida-sana" className="scroll-mt-28">
              <SectionHeading id="vida-sana">Vida sana</SectionHeading>
              <p className="mt-4">
                La otra mitad de mi vida, y la que más se descuida. Programar mucho tiempo seguido
                es una forma elegante de deteriorarse: la espalda, la vista, el sueño y la
                concentración se van dejando sin que te des cuenta.
              </p>
              <p className="mt-4">
                Por eso escribo también de salud. Dormir bien, moverse a diario, comer con criterio
                y saber cuándo soltar el teclado. No es wellness de superficie: es la
                infraestructura mínima para que todo lo demás funcione.
              </p>
              <p className="mt-4">
                Y lo digo con una honestidad que no pretendo disimular: no soy médico ni
                entrenador. Escribo de lo que me funciona, lo leo, lo pruebo y lo comparto. Si
                algo requiere criterio clínico, lo digo y te mando a quien sí lo tiene.
              </p>
            </section>

            <section aria-labelledby="tecnologia" className="scroll-mt-28">
              <SectionHeading id="tecnologia">La tecnología que viene</SectionHeading>
              <p className="mt-4">
                Escribo sobre lo que está pasando ahora, aunque todavía no se haya instalado en la
                vida de la gente. Agentes autónomos, IA en el borde, interfaces de voz, nuevos
                lenguajes y herramientas que aparecen cada semana.
              </p>
              <p className="mt-4">
                El criterio es sencillo: me interesa lo que cambia de verdad cómo trabajamos o
                vivimos, no lo que solo suena importante en una keynote. Si una tecnología está
                de moda pero no resuelve un problema concreto, lo digo así. Y si algo ya está
                sobrevalorado, también.
              </p>
            </section>

            <section aria-labelledby="ia-para-todo" className="scroll-mt-28">
              <SectionHeading id="ia-para-todo">IA para todo</SectionHeading>
              <p className="mt-4">
                Mi posición es que la inteligencia artificial no es una más de las herramientas que
                usamos: es la capa transversal sobre la que se está reescribiendo casi todo lo
                demás. Programación, diseño, atención al cliente, investigación, documentación,
                diagnóstico, decisiones de negocio y también las decisiones difíciles que antes
                eran humanas.
              </p>
              <p className="mt-4">
                Por eso uso IA en todo lo que hago, incluidos estos artículos, y lo digo
                explícitamente. No porque sea una moda, sino por transparencia: si un texto va
                asistido por modelos de lenguaje, quiero que lo sepas. Donde no uso IA, tampoco
                quiero que lo pienses.
              </p>
              <p className="mt-4">
                Y lo que más me interesa de este momento no es lo que la IA puede hacer, sino lo que
                cambia en las personas cuando delegamos en ella: cómo afecta al criterio, a la
                creatividad, a la capacidad de pensar por uno mismo. Esa es la conversación que
                creo que nos falta.
              </p>
            </section>

            <section aria-labelledby="contacto" className="scroll-mt-28">
              <SectionHeading id="contacto">Contacto</SectionHeading>
              <p className="mt-4">
                Si has leído algo aquí y te ha servido, o si has echado algo en falta, siempre puedes
                escribirme. Leo y respondo todo.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:admin@jotaedra.com"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold no-underline border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400 hover:border-indigo-300 dark:hover:border-sky-500/30 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  admin@jotaedra.com
                </a>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
