import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "SignalCV · Resume Tailoring Automation Engine"

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg,#101216,#0B0C0F)",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 40,
              border: "6px solid rgba(244,245,248,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F4F5F8",
              fontSize: 64,
              fontWeight: 800,
            }}
          >
            SCV
          </div>
          <div
            style={{
              color: "#F4F5F8",
              textAlign: "center",
              maxWidth: 900,
            }}
          >
            <div style={{ fontSize: 60, fontWeight: 800 }}>
              SignalCV
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 28,
                opacity: 0.92,
              }}
            >
              Resume tailoring automation with ATS scoring, cover letters, and recruiter DMs.
            </div>
            <div
              style={{
                marginTop: 16,
                fontSize: 22,
                opacity: 0.7,
              }}
            >
              signalcv.testamplify.com
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
