import { Activity, BarChart3, ExternalLink, MousePointerClick, ShieldCheck } from "lucide-react";
import { getAnalyticsStatus } from "../../lib/analytics";

const trackedEvents = [
  { name: "page_view", description: "Cada página pública visitada, sem contar o admin." },
  { name: "select_room", description: "Clique em quarto na listagem de co-living." },
  { name: "click_airbnb_top", description: "Clique no botão Airbnb do topo." },
  { name: "click_airbnb_room", description: "Clique no Airbnb dentro de uma página de quarto." },
  { name: "click_email_room", description: "Clique no email de enquiry de um quarto." },
  { name: "click_whatsapp_room", description: "Clique no WhatsApp de um quarto." },
  { name: "click_check_availability", description: "Clique em Check Availability no CTA de amenities." },
  { name: "click_airbnb_amenities", description: "Clique em View on Airbnb no CTA de amenities." },
  { name: "click_instagram_footer", description: "Clique no Instagram do rodapé." },
  { name: "click_email_footer", description: "Clique no email do rodapé." },
];

function maskMeasurementId(value: string) {
  if (!value) return "Not configured";
  if (value.length <= 7) return value;
  return `${value.slice(0, 5)}...${value.slice(-3)}`;
}

export default function AdminAnalytics() {
  const analytics = getAnalyticsStatus();

  return (
    <div className="p-14 max-w-[1440px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="font-display text-5xl font-black italic text-primary mb-3">Analytics</h1>
          <div className="text-text-secondary">
            Admin <span className="mx-2 opacity-40">›</span>
            <span className="text-primary font-semibold">Google Analytics</span>
          </div>
        </div>

        <a
          href="https://analytics.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-primary text-on-primary px-8 py-4 label-caps text-xs font-bold rounded-lg hover:bg-white transition-colors"
        >
          Open Google Analytics
          <ExternalLink size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container border border-divider-subtle rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
            <ShieldCheck size={24} />
          </div>
          <div className="label-caps mb-3">Tracking Status</div>
          <div className={`text-2xl font-bold ${analytics.configured ? "text-primary" : "text-text-muted"}`}>
            {analytics.configured ? "Active" : "Waiting for ID"}
          </div>
          <p className="text-sm text-text-secondary mt-4 leading-relaxed">
            {analytics.configured
              ? "O site vai carregar o Google Analytics nas páginas públicas."
              : "Adicione VITE_GA_MEASUREMENT_ID no .env e rode o build para ativar."}
          </p>
        </div>

        <div className="bg-surface-container border border-divider-subtle rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
            <BarChart3 size={24} />
          </div>
          <div className="label-caps mb-3">Measurement ID</div>
          <div className="text-2xl font-bold text-primary">{maskMeasurementId(analytics.measurementId)}</div>
          <p className="text-sm text-text-secondary mt-4 leading-relaxed">
            Este ID fica embutido no build público, como esperado no Google Analytics.
          </p>
        </div>

        <div className="bg-surface-container border border-divider-subtle rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
            <Activity size={24} />
          </div>
          <div className="label-caps mb-3">Admin Traffic</div>
          <div className="text-2xl font-bold text-primary">Excluded</div>
          <p className="text-sm text-text-secondary mt-4 leading-relaxed">
            A área /admin não envia page views para não misturar visitas internas com visitantes reais.
          </p>
        </div>
      </div>

      <section className="bg-surface-container border border-divider-subtle rounded-2xl p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <MousePointerClick size={24} />
          </div>
          <div>
            <h2 className="font-display text-3xl font-black italic text-primary">Tracked Events</h2>
            <p className="text-sm text-text-secondary">Eventos enviados para relatórios e conversões no GA.</p>
          </div>
        </div>

        <div className="divide-y divide-divider-subtle">
          {trackedEvents.map((event) => (
            <div key={event.name} className="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <code className="text-primary bg-background-dark border border-divider-subtle rounded-lg px-4 py-2 text-sm">
                {event.name}
              </code>
              <p className="text-sm text-text-secondary md:text-right">{event.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
