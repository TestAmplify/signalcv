{
  "meta": {
    "name": "SignalCV-LinearAI-Inspired",
    "source": {
      "reference": "https://linear.app/ai",
      "notes": "This is an inspired token set based on publicly visible brand colors + observed layout patterns. Exact typography sizes/weights, radii, and shadows should be confirmed via browser DevTools."
    },
    "modeSupport": ["dark", "light"],
    "version": "1.0.0"
  },
  "colors": {
    "brand": {
      "primary": "#F4F5F8",
      "inverse": "#222326",
      "accent": {
        "name": "Linear-Blue-Backgrounds",
        "value": "TODO_DEVTOOLS_EXACT"
      }
    },
    "dark": {
      "bg": {
        "canvas": "#0B0C0F",
        "surface": "#101216",
        "surfaceElevated": "#141821",
        "overlay": "rgba(0,0,0,0.55)"
      },
      "border": {
        "subtle": "rgba(255,255,255,0.08)",
        "default": "rgba(255,255,255,0.12)",
        "strong": "rgba(255,255,255,0.18)"
      },
      "text": {
        "primary": "#F4F5F8",
        "secondary": "rgba(244,245,248,0.72)",
        "muted": "rgba(244,245,248,0.55)",
        "disabled": "rgba(244,245,248,0.38)",
        "inverse": "#222326"
      },
      "icon": {
        "default": "rgba(244,245,248,0.72)",
        "muted": "rgba(244,245,248,0.55)"
      }
    },
    "light": {
      "bg": {
        "canvas": "#FFFFFF",
        "surface": "#F7F8FA",
        "surfaceElevated": "#FFFFFF",
        "overlay": "rgba(0,0,0,0.18)"
      },
      "border": {
        "subtle": "rgba(34,35,38,0.08)",
        "default": "rgba(34,35,38,0.12)",
        "strong": "rgba(34,35,38,0.18)"
      },
      "text": {
        "primary": "#222326",
        "secondary": "rgba(34,35,38,0.72)",
        "muted": "rgba(34,35,38,0.55)",
        "disabled": "rgba(34,35,38,0.38)",
        "inverse": "#F4F5F8"
      },
      "icon": {
        "default": "rgba(34,35,38,0.72)",
        "muted": "rgba(34,35,38,0.55)"
      }
    },
    "semantic": {
      "success": {
        "bg": "rgba(52, 211, 153, 0.12)",
        "fg": "#34D399",
        "border": "rgba(52, 211, 153, 0.25)"
      },
      "warning": {
        "bg": "rgba(251, 191, 36, 0.12)",
        "fg": "#FBBF24",
        "border": "rgba(251, 191, 36, 0.25)"
      },
      "danger": {
        "bg": "rgba(248, 113, 113, 0.12)",
        "fg": "#F87171",
        "border": "rgba(248, 113, 113, 0.25)"
      },
      "info": {
        "bg": "rgba(99, 102, 241, 0.12)",
        "fg": "#6366F1",
        "border": "rgba(99, 102, 241, 0.25)"
      }
    },
    "gradients": {
      "hero": "TODO_DEVTOOLS_EXACT",
      "subtleLine": "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.10), rgba(255,255,255,0))"
    }
  },
  "typography": {
    "fontFamily": {
      "sans": "TODO_DEVTOOLS_EXACT (likely a modern grotesk/sans stack)",
      "mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace"
    },
    "scale": {
      "xs": { "size": 12, "lineHeight": 16 },
      "sm": { "size": 14, "lineHeight": 20 },
      "md": { "size": 16, "lineHeight": 24 },
      "lg": { "size": 18, "lineHeight": 28 },
      "xl": { "size": 22, "lineHeight": 32 },
      "2xl": { "size": 28, "lineHeight": 36 },
      "3xl": { "size": 36, "lineHeight": 44 },
      "4xl": { "size": 48, "lineHeight": 56 }
    },
    "weight": {
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "letterSpacing": {
      "tight": -0.02,
      "normal": 0,
      "wide": 0.02
    }
  },
  "layout": {
    "container": {
      "maxWidth": 1120,
      "paddingX": { "mobile": 16, "desktop": 24 }
    },
    "grid": {
      "columns": 12,
      "gutter": 24
    }
  },
  "spacing": {
    "0": 0,
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "5": 20,
    "6": 24,
    "8": 32,
    "10": 40,
    "12": 48,
    "16": 64,
    "20": 80
  },
  "radius": {
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 20,
    "pill": 999
  },
  "shadow": {
    "none": "none",
    "sm": "0 1px 0 rgba(0,0,0,0.25)",
    "md": "0 8px 24px rgba(0,0,0,0.35)",
    "glass": "0 12px 40px rgba(0,0,0,0.45)"
  },
  "motion": {
    "duration": {
      "fast": 120,
      "normal": 180,
      "slow": 260
    },
    "easing": {
      "standard": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      "enter": "cubic-bezier(0.16, 1, 0.3, 1)",
      "exit": "cubic-bezier(0.7, 0, 0.84, 0)"
    }
  },
  "components": {
    "button": {
      "height": 40,
      "radius": 12,
      "paddingX": 14,
      "font": { "size": 14, "weight": 600 },
      "variants": {
        "primary": {
          "bg": "rgba(244,245,248,0.92)",
          "fg": "#111318",
          "border": "rgba(244,245,248,0.18)",
          "hoverBg": "rgba(244,245,248,1)"
        },
        "secondary": {
          "bg": "rgba(255,255,255,0.06)",
          "fg": "rgba(244,245,248,0.92)",
          "border": "rgba(255,255,255,0.10)",
          "hoverBg": "rgba(255,255,255,0.10)"
        },
        "ghost": {
          "bg": "transparent",
          "fg": "rgba(244,245,248,0.85)",
          "border": "transparent",
          "hoverBg": "rgba(255,255,255,0.06)"
        }
      }
    },
    "input": {
      "height": 44,
      "radius": 12,
      "paddingX": 12,
      "bg": "rgba(255,255,255,0.04)",
      "border": "rgba(255,255,255,0.10)",
      "focusRing": "rgba(244,245,248,0.16)",
      "placeholder": "rgba(244,245,248,0.45)"
    },
    "textarea": {
      "minHeight": 140,
      "radius": 12,
      "padding": 12,
      "bg": "rgba(255,255,255,0.04)",
      "border": "rgba(255,255,255,0.10)",
      "focusRing": "rgba(244,245,248,0.16)"
    },
    "card": {
      "radius": 16,
      "bg": "rgba(255,255,255,0.04)",
      "border": "rgba(255,255,255,0.10)",
      "shadow": "none",
      "padding": 16
    },
    "tabs": {
      "trackBg": "rgba(255,255,255,0.04)",
      "trackBorder": "rgba(255,255,255,0.10)",
      "tabRadius": 12,
      "tabPaddingX": 12,
      "tabPaddingY": 10,
      "activeBg": "rgba(255,255,255,0.08)",
      "activeBorder": "rgba(255,255,255,0.12)"
    },
    "badge": {
      "radius": 999,
      "paddingX": 10,
      "paddingY": 6,
      "font": { "size": 12, "weight": 600 },
      "variants": {
        "default": { "bg": "rgba(255,255,255,0.06)", "fg": "rgba(244,245,248,0.80)" },
        "success": { "bg": "rgba(52, 211, 153, 0.12)", "fg": "#34D399" },
        "warning": { "bg": "rgba(251, 191, 36, 0.12)", "fg": "#FBBF24" },
        "danger": { "bg": "rgba(248, 113, 113, 0.12)", "fg": "#F87171" }
      }
    },
    "divider": {
      "color": "rgba(255,255,255,0.08)"
    }
  },
  "usageNotes": {
    "devtoolsFillInstructions": [
      "Open linear.app/ai in Chrome",
      "Inspect a headline (H1) and record: font-family, font-size, font-weight, letter-spacing, line-height",
      "Inspect body text and buttons similarly",
      "Inspect background/surface colors and borders from computed styles",
      "Replace TODO_DEVTOOLS_EXACT tokens with the exact values"
    ],
    "legal": "Do not use Linear trademarks, logos, or proprietary assets; this token set is an inspired style baseline."
  }
}
