import { Activity, BarChart3, ExternalLink, MousePointerClick, ShieldCheck } from "lucide-react";
import { getAnalyticsStatus } from "../../lib/analytics";

const trackedEvents = [
  { name: "page_view", description: "Each public page visit, excluding admin traffic." },
  { name: "select_room", description: "Room selected from the co-living listing." },
  { name: "click_airbnb_top", description: "Airbnb button clicked in the header." },
  { name: "click_airbnb_room", description: "Airbnb link clicked from a room page." },
  { name: "click_email_room", description: "Room enquiry email link clicked." },
  { name: "click_whatsapp_room", description: "Room WhatsApp link clicked." },
  { name: "click_check_availability", description: "Check Availability CTA clicked on amenities." },
  { name: "click_airbnb_amenities", description: "View on Airbnb CTA clicked on amenities." },
  { name: "click_instagram_footer", description: "Instagram footer link clicked." },
  { name: "click_email_footer", description: "Email footer link clicked." },
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
              ? "The site will load Google Analytics on public pages."
              : "Add VITE_GA_MEASUREMENT_ID to .env and rebuild to activate tracking."}
          </p>
        </div>

        <div className="bg-surface-container border border-divider-subtle rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
            <BarChart3 size={24} />
          </div>
          <div className="label-caps mb-3">Measurement ID</div>
          <div className="text-2xl font-bold text-primary">{maskMeasurementId(analytics.measurementId)}</div>
          <p className="text-sm text-text-secondary mt-4 leading-relaxed">
            This ID is embedded in the public build, as expected for Google Analytics.
          </p>
        </div>

        <div className="bg-surface-container border border-divider-subtle rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
            <Activity size={24} />
          </div>
          <div className="label-caps mb-3">Admin Traffic</div>
          <div className="text-2xl font-bold text-primary">Excluded</div>
          <p className="text-sm text-text-secondary mt-4 leading-relaxed">
            The /admin area does not send page views, keeping internal visits out of public reports.
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
            <p className="text-sm text-text-secondary">Events sent to GA reports and conversions.</p>
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
