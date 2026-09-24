export const metadata = {
  title: 'Política de Privacidad',
  description:
    'Política de privacidad de JotaEDRA (jotaedra.com): qué datos personales tratamos, con qué finalidad y base jurídica, conforme al RGPD y la LOPDGDD.',
  alternates: {
    canonical: '/politica-de-privacidad',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Política de Privacidad | JotaEDRA',
    description:
      'Cómo trata JotaEDRA tus datos personales conforme al RGPD y la LOPDGDD. Responsable, derechos, cookies, conservación y contacto.',
    url: 'https://jotaedra.com/politica-de-privacidad',
    type: 'article',
  },
};

const LAST_UPDATED = '18 de septiembre de 2026';

const toc = [
  { id: 'responsable', num: '1', label: 'Responsable del tratamiento y contacto' },
  { id: 'principios', num: '2', label: 'Principios generales del tratamiento' },
  { id: 'hosting', num: '3', label: 'Alojamiento (hosting)' },
  { id: 'logs', num: '4', label: 'Archivos de registro del servidor' },
  { id: 'cookies', num: '5', label: 'Cookies y tecnologías de seguimiento' },
  { id: 'derechos', num: '6', label: 'Derechos de los interesados' },
  { id: 'reclamacion', num: '7', label: 'Derecho de reclamación' },
  { id: 'conservacion', num: '8', label: 'Conservación de los datos' },
  { id: 'cambios', num: '9', label: 'Cambios en esta política' },
];

const rights = [
  { title: 'Acceso', desc: 'Información gratuita sobre tus datos, origen, destinatarios y finalidad.' },
  { title: 'Rectificación', desc: 'Corrección de datos inexactos o incompletos.' },
  { title: 'Supresión', desc: 'Eliminación de tus datos cuando proceda (“derecho al olvido”).' },
  { title: 'Limitación', desc: 'Restricción del tratamiento en los supuestos legales.' },
  { title: 'Portabilidad', desc: 'Recibir tus datos en formato estructurado y transmitirlos.' },
  { title: 'Oposición', desc: 'Oponerte al tratamiento por motivos relacionados con tu situación.' },
];

function SectionHeading({ num, id, children }) {
  return (
    <h2
      id={id}
      className="flex items-start gap-3 text-xl md:text-2xl font-bold font-display text-slate-800 dark:text-slate-100 leading-snug border-b border-slate-100 dark:border-slate-800 pb-3 scroll-mt-28"
    >
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex shrink-0 items-center justify-center w-8 h-8 rounded-lg text-sm font-extrabold bg-indigo-600 text-white dark:bg-sky-500 dark:text-slate-950"
      >
        {num}
      </span>
      <span>{children}</span>
    </h2>
  );
}

export default function PoliticaDePrivacidadPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Política de Privacidad de JotaEDRA',
    url: 'https://jotaedra.com/politica-de-privacidad',
    inLanguage: 'es-ES',
    dateModified: '2026-09-18',
    about: {
      '@type': 'WebSite',
      name: 'JotaEDRA',
      url: 'https://jotaedra.com',
    },
  };

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            Política de Privacidad
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="bg-white border border-slate-200 dark:bg-slate-900/10 dark:border-slate-800/45 rounded-2xl shadow-sm p-6 md:p-10 mb-8 overflow-hidden relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600 dark:from-sky-400 dark:via-indigo-400 dark:to-sky-400"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Política de privacidad de JotaEDRA
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-300 text-[16px] md:text-[17px] leading-relaxed max-w-3xl">
          Esta política de privacidad se aplica al uso de JotaEDRA{' '}
          <a
            href="https://jotaedra.com"
            className="text-indigo-600 dark:text-sky-400 font-semibold hover:underline decoration-2 underline-offset-2"
          >
            (jotaedra.com)
          </a>
          . Te informa sobre qué datos personales tratamos, con qué finalidad y sobre qué base
          jurídica, conforme al RGPD (Reglamento UE 2016/679) y la LOPDGDD. Esta política se
          actualizó por última vez en la fecha indicada al final del documento.
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
            admin@jotaedra.com
          </a>
          <a
            href="#derechos"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-sky-400 hover:border-indigo-300 dark:hover:border-sky-500/30 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all"
          >
            Ver tus derechos
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        {/* Sidebar TOC */}
        <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-24 order-first lg:order-none">
          <nav
            aria-label="Índice de la política"
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
                    className="group flex items-baseline gap-2.5 px-2 py-1.5 rounded-lg text-[13.5px] leading-snug text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-indigo-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <span className="shrink-0 text-[11px] font-extrabold text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-sky-400 w-4">
                      {item.num}
                    </span>
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
            <section aria-labelledby="responsable" className="scroll-mt-28">
              <SectionHeading num="1" id="responsable">
                Responsable del tratamiento y contacto
              </SectionHeading>
              <ol className="mt-4 list-decimal pl-6 space-y-3 marker:font-bold marker:text-slate-700 dark:marker:text-slate-200">
                <li>
                  El responsable del tratamiento a los efectos del Reglamento General de Protección
                  de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y
                  garantía de los derechos digitales (LOPDGDD) es{' '}
                  <strong className="font-semibold text-slate-800 dark:text-slate-100">
                    Yuvi Dev Studio
                  </strong>
                  , con correo electrónico de contacto{' '}
                  <a
                    href="mailto:admin@jotaedra.com"
                    className="text-indigo-600 dark:text-sky-400 font-semibold hover:underline decoration-2 underline-offset-2"
                  >
                    admin@jotaedra.com
                  </a>
                  , para el sitio web jotaedra.com.
                </li>
                <li>
                  Si tienes cualquier duda sobre esta política de privacidad o sobre el tratamiento
                  de tus datos, puedes dirigirte en cualquier momento a la dirección de contacto
                  indicada.
                </li>
              </ol>
            </section>

            <section aria-labelledby="principios" className="scroll-mt-28">
              <SectionHeading num="2" id="principios">
                Principios generales del tratamiento
              </SectionHeading>
              <ol className="mt-4 list-decimal pl-6 space-y-3 marker:font-bold marker:text-slate-700 dark:marker:text-slate-200">
                <li>
                  Tratamos los datos personales de nuestros usuarios únicamente en la medida en que
                  sea necesario para ofrecer un sitio web funcional, así como nuestros contenidos y
                  servicios.
                </li>
                <li>
                  El tratamiento de datos personales de nuestros usuarios se realiza, con carácter
                  general, únicamente previo consentimiento del usuario o sobre otra base jurídica
                  legalmente admitida conforme al artículo 6 del RGPD.
                </li>
              </ol>
            </section>

            <section aria-labelledby="hosting" className="scroll-mt-28">
              <SectionHeading num="3" id="hosting">
                Alojamiento (hosting)
              </SectionHeading>
              <ol className="mt-4 list-decimal pl-6 space-y-3 marker:font-bold marker:text-slate-700 dark:marker:text-slate-200">
                <li>
                  Este sitio web está alojado en los servidores de{' '}
                  <strong className="font-semibold text-slate-800 dark:text-slate-100">
                    Cloudflare
                  </strong>
                  . Los datos personales recogidos en este sitio se almacenan en los servidores de
                  dicho proveedor.
                </li>
                <li>
                  Con el proveedor de hosting existe un contrato de encargado del tratamiento
                  conforme al artículo 28 del RGPD.
                </li>
              </ol>
            </section>

            <section aria-labelledby="logs" className="scroll-mt-28">
              <SectionHeading num="4" id="logs">
                Archivos de registro del servidor
              </SectionHeading>
              <ol className="mt-4 list-decimal pl-6 space-y-3 marker:font-bold marker:text-slate-700 dark:marker:text-slate-200">
                <li>
                  El proveedor de jotaedra.com recoge y almacena automáticamente información en los
                  llamados archivos de registro del servidor, que tu navegador nos transmite
                  automáticamente.
                </li>
                <li>
                  Estos son: tipo de navegador, sistema operativo utilizado, URL de referencia,
                  nombre de host del equipo de acceso, hora de la solicitud al servidor y dirección
                  IP. No se realiza una combinación de estos datos con otras fuentes de datos.
                </li>
              </ol>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  'Tipo de navegador',
                  'Sistema operativo',
                  'URL de referencia',
                  'Host del equipo',
                  'Hora de la solicitud',
                  'Dirección IP',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    <span aria-hidden="true" className="text-indigo-500 dark:text-sky-400 font-bold">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="cookies" className="scroll-mt-28">
              <SectionHeading num="5" id="cookies">
                Cookies y tecnologías de seguimiento
              </SectionHeading>
              <ol className="mt-4 list-decimal pl-6 space-y-3 marker:font-bold marker:text-slate-700 dark:marker:text-slate-200">
                <li>
                  Nuestro sitio web utiliza cookies. Las cookies técnicamente necesarias se instalan
                  sin necesidad de consentimiento previo, conforme al artículo 22 de la LSSI-CE.
                </li>
                <li>
                  Para el resto de cookies, por ejemplo con fines de análisis o marketing,
                  solicitamos previamente tu consentimiento mediante un banner de cookies conforme
                  al artículo 6.1.a RGPD. Puedes modificar tu elección en cualquier momento desde
                  la configuración de cookies.
                </li>
              </ol>
              <div
                role="note"
                className="mt-4 border-l-4 border-indigo-500/80 dark:border-sky-500/80 pl-4 py-3 italic bg-slate-50/60 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 rounded-r-xl text-[15px]"
              >
                Este sitio utiliza Google Analytics y Google AdSense, que pueden emplear cookies
                propias o de terceros con fines de medición y publicidad. Puedes retirar tu
                consentimiento en cualquier momento desde tu navegador o la configuración de
                cookies.
              </div>
            </section>

            <section aria-labelledby="derechos" className="scroll-mt-28">
              <SectionHeading num="6" id="derechos">
                Derechos de los interesados
              </SectionHeading>
              <ol className="mt-4 list-decimal pl-6 space-y-3 marker:font-bold marker:text-slate-700 dark:marker:text-slate-200">
                <li>
                  Dentro del marco de la normativa vigente, tienes derecho en todo momento a obtener
                  información gratuita sobre tus datos personales almacenados, su origen, sus
                  destinatarios y la finalidad del tratamiento.
                </li>
                <li>
                  Además, tienes derecho a la rectificación, supresión, limitación del tratamiento y
                  portabilidad de estos datos, así como derecho de oposición al tratamiento.
                </li>
              </ol>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {rights.map((r) => (
                  <div
                    key={r.title}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30"
                  >
                    <p className="font-bold font-display text-slate-800 dark:text-slate-100 text-[15px]">
                      {r.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[15px]">
                Para ejercerlos, escríbenos a{' '}
                <a
                  href="mailto:admin@jotaedra.com"
                  className="text-indigo-600 dark:text-sky-400 font-semibold hover:underline decoration-2 underline-offset-2"
                >
                  admin@jotaedra.com
                </a>
                . Responderemos en los plazos establecidos por la normativa.
              </p>
            </section>

            <section aria-labelledby="reclamacion" className="scroll-mt-28">
              <SectionHeading num="7" id="reclamacion">
                Derecho de reclamación ante la autoridad de control
              </SectionHeading>
              <ol className="mt-4 list-decimal pl-6 space-y-3 marker:font-bold marker:text-slate-700 dark:marker:text-slate-200">
                <li>
                  En caso de infracción del RGPD, tienes derecho como interesado a presentar una
                  reclamación ante una autoridad de control, en particular en el Estado miembro de
                  tu residencia habitual, tu lugar de trabajo o el lugar de la supuesta infracción.
                </li>
                <li>
                  En España, la autoridad de control competente es la Agencia Española de Protección
                  de Datos (AEPD), con sede en Madrid:{' '}
                  <a
                    href="https://www.aepd.es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-sky-400 font-semibold hover:underline decoration-2 underline-offset-2"
                  >
                    www.aepd.es
                  </a>
                  .
                </li>
              </ol>
            </section>

            <section aria-labelledby="conservacion" className="scroll-mt-28">
              <SectionHeading num="8" id="conservacion">
                Conservación de los datos
              </SectionHeading>
              <ol className="mt-4 list-decimal pl-6 space-y-3 marker:font-bold marker:text-slate-700 dark:marker:text-slate-200">
                <li>
                  Conservamos tus datos personales únicamente durante el tiempo necesario para
                  cumplir la finalidad para la que fueron recogidos, salvo que exista una obligación
                  legal de conservación más prolongada.
                </li>
                <li>
                  Transcurridos dichos plazos, tus datos se suprimen o se anonimizan de forma
                  segura.
                </li>
              </ol>
            </section>

            <section aria-labelledby="cambios" className="scroll-mt-28">
              <SectionHeading num="9" id="cambios">
                Cambios en esta política de privacidad
              </SectionHeading>
              <ol className="mt-4 list-decimal pl-6 space-y-3 marker:font-bold marker:text-slate-700 dark:marker:text-slate-200">
                <li>
                  Nos reservamos el derecho a adaptar esta política de privacidad para que cumpla
                  siempre con los requisitos legales vigentes o para reflejar cambios en nuestros
                  servicios.
                </li>
                <li>
                  En tu próxima visita a jotaedra.com se aplicará la nueva política de privacidad.
                  La fecha de la última actualización aparece al final de esta página.
                </li>
              </ol>
            </section>

            {/* Contact CTA */}
            <div className="rounded-2xl p-6 md:p-7 bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-sky-500 dark:to-indigo-500 shadow-md">
              <h2 className="text-lg md:text-xl font-bold font-display" style={{ color: '#ffffff' }}>
                ¿Tienes dudas sobre esta política de privacidad?
              </h2>
              <p className="mt-2 text-sm md:text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Escríbenos y te responderemos lo antes posible.
              </p>
              <a
                href="mailto:admin@jotaedra.com"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold no-underline shadow-sm transition-colors hover:brightness-95"
                style={{ color: '#3730a3', backgroundColor: '#ffffff' }}
              >
                Escríbenos a admin@jotaedra.com
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
