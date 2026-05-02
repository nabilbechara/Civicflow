import { CalendarDays, Landmark, Mail, MapPin, Phone, Users } from "lucide-react";
import { HomeHeroActions } from "@/components/home/home-hero-actions";
import { Topbar } from "@/components/layout/topbar";
import { NewsSlider } from "@/components/news/news-slider";

const historyMilestones = [
  {
    year: "1898",
    title: "First local council",
    copy: "The earliest elected council organized public records, market supervision, and basic street maintenance.",
  },
  {
    year: "1952",
    title: "Modern municipality charter",
    copy: "The municipality expanded its administrative role as residential neighborhoods, schools, and public utilities grew.",
  },
  {
    year: "2026",
    title: "Digital civic services",
    copy: "CivicFlow connects residents, employees, and municipal leadership through one transparent service platform.",
  },
];

const staff = [
  {
    name: "Maya Khoury",
    role: "Citizen Services Officer",
    email: "maya.khoury@municipality.gov.lb",
    phone: "+961 1 555 201",
    initials: "MK",
  },
  {
    name: "Karim Haddad",
    role: "Public Works Coordinator",
    email: "karim.haddad@municipality.gov.lb",
    phone: "+961 1 555 214",
    initials: "KH",
  },
  {
    name: "Rana Mansour",
    role: "Municipal Records Manager",
    email: "rana.mansour@municipality.gov.lb",
    phone: "+961 1 555 228",
    initials: "RM",
  },
];

export default function HomePage() {
  return (
    <main>
      <Topbar />

      <section className="bg-white">
        <div className="container-shell grid gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-14">
          <div>
            <div className="badge-soft mb-4">Municipal life, made clearer</div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Your municipality, its news, services, and people in one place.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              CivicFlow Lebanon gives residents a public window into municipal
              updates while keeping digital services, documents, and request
              tracking close at hand.
            </p>

            <HomeHeroActions />
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80"
              alt="Municipal buildings and public streets"
              className="h-[360px] w-full object-cover opacity-90 sm:h-[460px]"
            />
          </div>
        </div>
      </section>

      <NewsSlider />

      <section id="history" className="bg-white py-12 sm:py-14">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <span className="badge-soft">
                <Landmark className="mr-2 h-4 w-4" />
                Municipality history
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                How local government grew with the community
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                This section can be customized for each municipality with its
                founding story, early council records, major public projects,
                and the people who helped shape it.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {historyMilestones.map((milestone) => (
                <div
                  key={milestone.year}
                  className="theme-surface rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="text-sm font-semibold text-[#1f5f8b]">
                    {milestone.year}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">
                    {milestone.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {milestone.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="staff" className="container-shell py-12 sm:py-14">
        <div className="mb-8">
          <span className="badge-soft">
            <Users className="mr-2 h-4 w-4" />
            Municipal staff
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Meet the people residents contact most
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {staff.map((member) => (
            <article
              key={member.email}
              className="theme-surface rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-[#e8f2f8] text-lg font-semibold text-[#1f5f8b]">
                  {member.initials}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{member.role}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#1f5f8b]" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#1f5f8b]" />
                  <span>{member.phone}</span>
                </div>
              </div>

              <a
                href={`mailto:${member.email}`}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#1f5f8b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#174767]"
              >
                Contact me <Mail className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-[#174767] py-12 text-white sm:py-14">
        <div className="container-shell grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <div className="text-sm font-semibold uppercase text-blue-100">
              Visit or contact the municipality
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Need help with a service request?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 sm:text-base">
              Residents can contact staff directly, visit during opening hours,
              or log in to follow requests and upload required documents.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-blue-50">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5" />
              Main municipal building, Lebanon
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5" />
              Monday to Friday, 8:00 AM - 2:00 PM
            </div>
            <a
              href="mailto:info@municipality.gov.lb"
              className="inline-flex w-fit items-center gap-2 rounded-md bg-white px-5 py-3 font-semibold text-[#174767] transition hover:bg-blue-50"
            >
              Email the municipality <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
