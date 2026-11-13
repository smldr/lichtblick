// SPDX-FileCopyrightText: Copyright (C) 2026 Lichtblick Catppuccin contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { flavors } from "@catppuccin/palette";
import type { PaletteOptions } from "@mui/material/styles";

/** The four Catppuccin flavors. Latte is light, the others are dark. */
export const CATPPUCCIN_FLAVORS = ["latte", "frappe", "macchiato", "mocha"] as const;
export type CatppuccinFlavor = (typeof CATPPUCCIN_FLAVORS)[number];

export const CATPPUCCIN_DARK_FLAVORS = ["frappe", "macchiato", "mocha"] as const;
export type CatppuccinDarkFlavor = (typeof CATPPUCCIN_DARK_FLAVORS)[number];

/** The 14 Catppuccin accent colors, in the official palette order. */
export const CATPPUCCIN_ACCENTS = [
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
] as const;
export type CatppuccinAccent = (typeof CATPPUCCIN_ACCENTS)[number];

export const DEFAULT_DARK_FLAVOR: CatppuccinDarkFlavor = "mocha";
export const DEFAULT_ACCENT: CatppuccinAccent = "mauve";

export function isCatppuccinFlavor(value: unknown): value is CatppuccinFlavor {
  return CATPPUCCIN_FLAVORS.includes(value as CatppuccinFlavor);
}

export function isCatppuccinDarkFlavor(value: unknown): value is CatppuccinDarkFlavor {
  return CATPPUCCIN_DARK_FLAVORS.includes(value as CatppuccinDarkFlavor);
}

export function isCatppuccinAccent(value: unknown): value is CatppuccinAccent {
  return CATPPUCCIN_ACCENTS.includes(value as CatppuccinAccent);
}

/** Display names, with the official accented spelling. */
export function flavorDisplayName(flavor: CatppuccinFlavor): string {
  return flavors[flavor].name;
}

export function accentDisplayName(accent: CatppuccinAccent): string {
  return flavors.mocha.colors[accent].name;
}

/** Hex value of any named color in a flavor, e.g. ctpColor("mocha", "base"). */
export function ctpColor(
  flavor: CatppuccinFlavor,
  color: keyof (typeof flavors)["mocha"]["colors"],
): string {
  return flavors[flavor].colors[color].hex;
}

/** rgba() string for a palette color at the given opacity. */
function withOpacity(color: { rgb: { r: number; g: number; b: number } }, opacity: number): string {
  const { r, g, b } = color.rgb;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Builds a MUI palette for a flavor and accent.
 *
 * Color roles follow the Catppuccin style guide (General Usage):
 * - Background pane: Base. Secondary panes: Mantle / Crust. Surfaces: Surface 0-2.
 * - Body text: Text. Labels / secondary text: Subtext 0-1. Subtle: Overlay 1.
 * - On accent: Base. Links: Blue. Success: Green. Warnings: Yellow. Errors: Red.
 * - Selection background: Overlay 2 at 20-30% opacity.
 */
export function catppuccinPalette(
  flavor: CatppuccinFlavor,
  accent: CatppuccinAccent,
): PaletteOptions {
  const { dark, colors: c } = flavors[flavor];
  const onAccent = c.base.hex;

  const grey: PaletteOptions["grey"] = dark
    ? {
        50: c.crust.hex,
        100: c.mantle.hex,
        200: c.base.hex,
        300: c.surface0.hex,
        400: c.surface0.hex,
        500: c.surface1.hex,
        600: c.surface1.hex,
        700: c.surface2.hex,
        800: c.surface2.hex,
        900: c.overlay0.hex,
        A100: c.surface0.hex,
        A200: c.overlay0.hex,
        A400: c.subtext0.hex,
        A700: c.subtext1.hex,
      }
    : {
        50: c.base.hex,
        100: c.mantle.hex,
        200: c.crust.hex,
        300: c.surface0.hex,
        400: c.surface1.hex,
        500: c.overlay0.hex,
        600: c.overlay2.hex,
        700: c.subtext0.hex,
        800: c.subtext1.hex,
        900: c.text.hex,
        A100: c.surface1.hex,
        A200: c.overlay1.hex,
        A400: c.subtext0.hex,
        A700: c.text.hex,
      };

  return {
    name: dark ? "dark" : "light",
    mode: dark ? "dark" : "light",
    tonalOffset: dark ? 0.15 : 0.22,
    appBar: {
      main: c.crust.hex,
      primary: c.surface1.hex,
      text: c.text.hex,
    },
    primary: { main: c[accent].hex, contrastText: onAccent },
    secondary: { main: c.subtext0.hex, contrastText: onAccent },
    error: { main: c.red.hex, contrastText: onAccent },
    warning: { main: c.yellow.hex, contrastText: onAccent },
    success: { main: c.green.hex, contrastText: onAccent },
    info: { main: c.blue.hex, contrastText: onAccent },
    text: {
      primary: c.text.hex,
      secondary: c.subtext0.hex,
      disabled: c.overlay1.hex,
    },
    divider: c.surface1.hex,
    background: {
      default: c.base.hex,
      paper: c.mantle.hex,
      menu: c.surface0.hex,
    },
    action: {
      active: c.overlay2.hex,
      hover: withOpacity(c.overlay2, 0.12),
      selected: withOpacity(c.overlay2, 0.25),
      disabled: c.overlay0.hex,
      disabledBackground: withOpacity(c.overlay0, 0.2),
      focus: withOpacity(c.overlay2, 0.3),
    },
    grey,
  };
}
