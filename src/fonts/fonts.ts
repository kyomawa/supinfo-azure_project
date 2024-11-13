import localFont from "next/font/local";

// =============================================================================================================================================

export const satoshi = localFont({
  src: [
    {
      path: "./Satoshi/Satoshi-VariableItalic.ttf",
      weight: "100 900",
      style: "italic",
    },
    {
      path: "./Satoshi/Satoshi-Variable.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});

// =============================================================================================================================================
