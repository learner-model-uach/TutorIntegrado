import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: {
      color: "text_info",
    },
  },
  theme: {
    tokens: {
      colors: {
        indigo: {
          50: { value: "#f1f4f9" },
          100: { value: "#e2e9f3" },
          200: { value: "#c6d3e6" },
          300: { value: "#a9bdda" },
          400: { value: "#8da7ce" },
          500: { value: "#7091c2" },
          600: { value: "#547bb5" },
          700: { value: "#2c5282" },
          800: { value: "#2a4365" },
          900: { value: "#2b4264" },
          950: { value: "#1b202b" },
        },
        charcoal: { value: "#2c3648" },
        tangerine: {
          300: { value: "#F9B362" },
          400: { value: "#f49e43" },
          500: { value: "#f28b30" },
          600: { value: "#DB8446" },
          700: { value: "rgb(173, 101, 57)" },
        },
        stealblue: {
          200: { value: "#90ccf5" },
          300: { value: "#6ea8d9" },
          400: { value: "#559BDD" },
          500: { value: "#3182ce" },
          600: { value: "#2062a9" },
          950: { value: "#1A365D" },
        },
        platinum: {
          600: { value: "#4A5568" },
          700: { value: "#2D3748" },
        },
        slate: {
          100: { value: "#edf2f7" },
        },
        teal: {
          100: { value: "#e1f8f5" },
          950: { value: "#13b8a6" },
          600: { value: "#0D978B" },
          900: { value: "#0c2221" },
        },
      },
    },
    semanticTokens: {
      colors: {
        // Colores de texto
        fg: {
          DEFAULT: {
            value: { base: "{colors.gray.800}", _dark: "{colors.gray.100}" },
          },
          muted: {
            value: { base: "{colors.gray.600}", _dark: "{colors.gray.400}" },
          },
        },
        // Colores de fondo
        bg: {
          DEFAULT: {
            // base = modo claro, _dark = modo oscuro
            value: { base: "{colors.indigo.900}", _dark: "{colors.indigo.950}" },
          },
          secondary: {
            value: { base: "{white}", _dark: "{colors.charcoal}" },
          },
        },
        // Colores de borde
        border: {
          DEFAULT: {
            value: { base: "{colors.indigo.200}", _dark: "{colors.gray.500}" },
          },
        },
        speechBubble1: {
          value: { base: "{colors.tangerine.300}", _dark: "{colors.tangerine.400}" },
        },
        speechBubble2: {
          value: { base: "{colors.stealblue.200}", _dark: "{colors.stealblue.300}" },
        },
        loginButton: {
          value: { base: "{colors.stealblue.500}", _dark: "{colors.indigo.700}" },
        },
        heading: {
          value: { base: "{colors.indigo.900}", _dark: "{colors.indigo.100}" },
        },
        boxinfo: {
          value: { base: "{colors.indigo.100}", _dark: "{colors.indigo.700}" },
        },
        //sidebarlink
        sidebarselect_active: {
          value: { base: "{colors.indigo.700}", _dark: "{colors.platinum.700}" },
        },
        sidebarselect_hover: {
          value: { base: "{colors.indigo.700}", _dark: "{colors.platinum.600}" },
        },
        //Card Selection
        cardselection_bg: {
          value: { base: "{colors.indigo.700}", _dark: "{colors.indigo.950}" },
        },
        cardselection_hover: {
          value: { base: "{colors.indigo.900}", _dark: "{colors.gray.900}" },
        },
        progress_text: {
          value: { base: "{colors.gray.900}", _dark: "{colors.gray.50}" },
        },
        progress_user: {
          value: { base: "{colors.green.500}", _dark: "{colors.green.400}" },
        },
        progress_group: {
          value: { base: "{colors.gray.500}", _dark: "{colors.gray.600}" },
        },
        table_header: {
          value: { base: "{colors.indigo.700}", _dark: "{colors.indigo.950}" },
        },
        progressbar_user: {
          value: { base: "{colors.green.500}", _dark: "{colors.green.500}" },
        },
        progressbar_group: {
          value: { base: "{colors.gray.400}", _dark: "{colors.gray.500}" },
        },
        table_header_subtopic: {
          value: { base: "{colors.platinum.600}", _dark: "{colors.platinum.700}" },
        },
        table_row_odd_wp: {
          value: { base: "{colors.slate.100}", _dark: "{colors.indigo.900}" },
        },
        text_info: {
          value: { base: "{colors.indigo.900}", _dark: "{colors.indigo.200}" },
        },
        text_exercises: {
          value: { base: "{colors.charcoal}", _dark: "{colors.gray.50}" },
        },
        icon_table: {
          value: { base: "{colors.teal.600}", _dark: "{colors.teal.500}" },
        },
        accordion_step: {
          value: { base: "#dbeafe", _dark: "#14204A" },
        },
        accordion_step_text: {
          value: { base: "#173da6", _dark: "#A3CFFF" },
        },
        accordion_success: {
          value: { base: "#DCFCE7", _dark: "#042713" },
        },
        accordion_success_text: {
          value: { base: "#116932", _dark: "#86EFAC" },
        },
        alternative_button: {
          value: { base: "{colors.stealblue.400}", _dark: "{colors.indigo.900}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
