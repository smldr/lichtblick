// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { useLayoutEffect } from "react";
import { useMedia } from "react-use";

import { useCatppuccinSettings } from "@lichtblick/suite-base/components/Catppuccin/useCatppuccinSettings";
import ThemeProvider from "@lichtblick/suite-base/theme/ThemeProvider";
import { setCatppuccinSelection } from "@lichtblick/theme";

export function ColorSchemeThemeProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const { flavor, systemDarkFlavor, accent } = useCatppuccinSettings();
  const systemIsDark = useMedia("(prefers-color-scheme: dark)");

  const isDark = flavor === "system" ? systemIsDark : flavor !== "latte";
  const darkFlavor = flavor === "system" || flavor === "latte" ? systemDarkFlavor : flavor;

  // Publish the choice so panels rendered in their own React roots match the app.
  useLayoutEffect(() => {
    setCatppuccinSelection({ darkFlavor, accent });
  }, [darkFlavor, accent]);

  return <ThemeProvider isDark={isDark}>{children}</ThemeProvider>;
}
