import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      container: {
        screens: {
          sm: "600px",
          md: "728px",
          lg: "984px",
          xl: "1170px",
          "2xl": "1170px",
        },
      },
      colors: {
        gbgc: {
          DEFAULT: "#137492",
          dark: "#11172a",
        },
        gfgc: {
          DEFAULT: "#E2E8ED",
          dark: "#1e293b",
        },
        bgc: {
          DEFAULT: "#FFFFFF",
          dark: "#11172a",
        },
        fgc: {
          DEFAULT: "#eef2f6",
          dark: "#1e293b",
        },
        text: {
          DEFAULT: "#121212",
          dark: "#E2E8ED",
        },
        border: {
          DEFAULT: "#dddddd",
          dark: "#384457",
        },
        borderFocus: {
          DEFAULT: "#cccccc",
          dark: "#596a86",
        },
        shadow: {
          DEFAULT: "",
          dark: "#384457",
        },

        bgc1: {
          DEFAULT: "#E2E8ED",
        },
        bgc2: {
          DEFAULT: "#137492",
        },
        dark: {
          DEFAULT: "#8C8C8C",
        },
        textSecondary: {
          DEFAULT: "#595c59",
        },
        textActive: {
          DEFAULT: "#000041",
        },
        primary: {
          DEFAULT: "#137492",
        }, // dark - border color (opacity: 10%, stroke width: 0.75)
        disable: {
          DEFAULT: "#e5e8f3",
          dark: "#475569",
        },
        bgHeader: {
          DEFAULT: "#2d3040",
          dark: "#1E293B",
        },
        menubg: {
          DEFAULT: "#3E4C76",
        },
      },
      maxWidth: {
        "3xl": "50%",
      },
      padding: {
        "18": "72px",
      },
      gap: {
        "18": "72px",
      },
      fontSize: {
        "42": "42px",
        "32": "32px",
      },

      backgroundImage: (theme: any) => ({
        "gradient-primary": `linear-gradient(105deg, ${theme(
          "colors.blue.700/15%"
        )}, ${theme("colors.blue.700/0%")})`,
        "gradient-secondary": `linear-gradient(105deg, ${theme(
          "colors.blue.700/85%"
        )}, ${theme("colors.blue.700/0%")})`,
      }),
      /* backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            }, */
    },
  },
  plugins: [],
};
export default config;
