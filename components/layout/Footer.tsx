import { profile, socialLinks } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col gap-6 py-10 text-sm md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-semibold">{profile.name}</p>
          <p className="text-slate">{profile.role}</p>
        </div>
        <ul className="flex gap-6">
          {socialLinks.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                className="link-underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-slate">© 2026 {profile.name}</p>
      </div>
    </footer>
  );
}
