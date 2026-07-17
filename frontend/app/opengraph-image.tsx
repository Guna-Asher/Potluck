import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same visual language as icon.tsx (emerald-600 mark on a dark ground) —
// what a submission link unfurls to in Slack/Discord/X during judging.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "#171717",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: 20,
              background: "#059669",
              color: "white",
              fontSize: 48,
              fontWeight: 700,
            }}
          >
            P
          </div>
          <div style={{ display: "flex", color: "white", fontSize: 72, fontWeight: 600, letterSpacing: -1.5 }}>
            Potluck
          </div>
        </div>
        <div style={{ display: "flex", color: "#a3a3a3", fontSize: 32 }}>
          Stop being the friend group&rsquo;s bank.
        </div>
      </div>
    ),
    { ...size }
  );
}
