// SPDX-FileCopyrightText: Copyright (C) 2026 Lichtblick Catppuccin contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { AppSetting } from "@lichtblick/suite-base/AppSetting";
import { useAppConfigurationValue } from "@lichtblick/suite-base/hooks/useAppConfigurationValue";
import {
  CatppuccinAccent,
  CatppuccinDarkFlavor,
  CatppuccinFlavor,
  DEFAULT_ACCENT,
  DEFAULT_DARK_FLAVOR,
  isCatppuccinAccent,
  isCatppuccinDarkFlavor,
  isCatppuccinFlavor,
} from "@lichtblick/theme";

/** A fixed flavor, or "system" to use Latte or a dark flavor following the OS. */
export type FlavorChoice = CatppuccinFlavor | "system";

export type CatppuccinSettings = {
  flavor: FlavorChoice;
  systemDarkFlavor: CatppuccinDarkFlavor;
  accent: CatppuccinAccent;
  setFlavor: (value: FlavorChoice) => void;
  setSystemDarkFlavor: (value: CatppuccinDarkFlavor) => void;
  setAccent: (value: CatppuccinAccent) => void;
};

/**
 * Reads and writes the Catppuccin settings. When no flavor has been chosen yet,
 * the upstream light/dark/system setting is carried over (dark becomes Mocha).
 */
export function useCatppuccinSettings(): CatppuccinSettings {
  const [legacyColorScheme] = useAppConfigurationValue<string>(AppSetting.COLOR_SCHEME);
  const [storedFlavor, setStoredFlavor] = useAppConfigurationValue<string>(
    AppSetting.CATPPUCCIN_FLAVOR,
  );
  const [storedSystemDark, setStoredSystemDark] = useAppConfigurationValue<string>(
    AppSetting.CATPPUCCIN_SYSTEM_DARK_FLAVOR,
  );
  const [storedAccent, setStoredAccent] = useAppConfigurationValue<string>(
    AppSetting.CATPPUCCIN_ACCENT,
  );

  let flavor: FlavorChoice;
  if (storedFlavor === "system" || isCatppuccinFlavor(storedFlavor)) {
    flavor = storedFlavor;
  } else if (legacyColorScheme === "dark") {
    flavor = DEFAULT_DARK_FLAVOR;
  } else if (legacyColorScheme === "light") {
    flavor = "latte";
  } else {
    flavor = "system";
  }

  return {
    flavor,
    systemDarkFlavor: isCatppuccinDarkFlavor(storedSystemDark)
      ? storedSystemDark
      : DEFAULT_DARK_FLAVOR,
    accent: isCatppuccinAccent(storedAccent) ? storedAccent : DEFAULT_ACCENT,
    setFlavor: (value) => void setStoredFlavor(value),
    setSystemDarkFlavor: (value) => void setStoredSystemDark(value),
    setAccent: (value) => void setStoredAccent(value),
  };
}
