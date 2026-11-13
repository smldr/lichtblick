// SPDX-FileCopyrightText: Copyright (C) 2026 Lichtblick Catppuccin contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { SvgIcon, SvgIconProps, useTheme } from "@mui/material";

import logo from "./logo.png";

/** Square app icon, used in the app bar. Same props as the upstream LichtblickLogo. */
export function CatppuccinLogo(props: SvgIconProps): React.JSX.Element {
  return (
    <SvgIcon viewBox="0 0 256 256" {...props}>
      <title>Lichtblick Catppuccin</title>
      {/* eslint-disable-next-line @lichtblick/suite/link-target -- SVG image, not a link */}
      <image href={logo} width="256" height="256" />
    </SvgIcon>
  );
}

/**
 * Icon plus "Lichtblick / Catppuccin" wordmark, used on the welcome screen and in
 * Settings. Keeps the upstream LichtblickLogoText aspect ratio so existing sizing works.
 * The second line takes the component's color (the accent when color="primary").
 */
export function CatppuccinLogoText(props: SvgIconProps): React.JSX.Element {
  const theme = useTheme();
  return (
    <SvgIcon viewBox="0 0 909 204" {...props}>
      <title>Lichtblick Catppuccin</title>
      {/* eslint-disable-next-line @lichtblick/suite/link-target -- SVG image, not a link */}
      <image href={logo} width="204" height="204" />
      <g fontFamily={theme.typography.fontFamily} fontWeight={600}>
        <text x="240" y="104" fontSize="104" fill={theme.palette.text.primary}>
          Lichtblick
        </text>
        <text x="244" y="186" fontSize="68" fill="currentColor">
          Catppuccin
        </text>
      </g>
    </SvgIcon>
  );
}
