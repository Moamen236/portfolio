import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "#f2f3f5",
          color: "#121722",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 14, marginBottom: "auto" }}>
          {["Code", "Container", "Server", "Production"].map((w, i) => (
            <div key={w} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#5a6372" }}>
              <div style={{ border: "2px solid #c3c9d3", borderRadius: 10, padding: "8px 18px", background: "#fff" }}>{w}</div>
              {i < 3 ? <div style={{ width: 36, height: 2, background: "#2b44e0" }} /> : null}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>{profile.name}</div>
        <div style={{ fontSize: 40, marginTop: 20, color: "#2b44e0" }}>{profile.role}</div>
        <div style={{ fontSize: 28, marginTop: 18, color: "#5a6372", maxWidth: 900 }}>
          Web applications, enterprise platforms and APIs — from architecture to production.
        </div>
      </div>
    ),
    size
  );
}
