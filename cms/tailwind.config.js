export default {
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#6ddbb4",
        "brand-primary-light": "#e2edda",
        "brand-primary-medium": "6ddbb4",
        "brand-primary-dark": "#31b285",

        "additional-primary": "#fff1e3",
        "additional-primary-light": "faf4f0",
        "additional-primary-medium": "fff1e3",
        "additional-primary-dark": "#ccae91",
        "additional-secondary": "#070727",
        "additional-secondary-light": "0c0c46",
        "additional-secondary-medium": "070727",
        "additional-secondary-dark": "010029",

        "white": "white",
        "grey-0": "#c7c7f2",
        "grey-25": "#9595bf",
        "grey-50": "#51518c",
        "grey-75": "#222259",
        "grey-100": "#070727",
      },
      spacing: {
        0: "0px",
        1: "4px",
        2: "8px",
        3: "16px",
        4: "24px",
        5: "32px"
      }
    },
  },
  plugins: [],
}

