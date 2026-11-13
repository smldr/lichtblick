// SPDX-FileCopyrightText: Copyright (C) 2026 Lichtblick Catppuccin contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { useSyncExternalStore } from "react";

import {
  CatppuccinAccent,
  CatppuccinDarkFlavor,
  DEFAULT_ACCENT,
  DEFAULT_DARK_FLAVOR,
} from "./palette";

/**
 * The Catppuccin choices currently active in the app.
 *
 * Lichtblick renders some panels in their own React roots, and those only learn
 * whether the app is light or dark. This store lets them pick up the same dark
 * flavor and accent as the main window. Light mode is always Latte.
 */
export type CatppuccinSelection = {
  darkFlavor: CatppuccinDarkFlavor;
  accent: CatppuccinAccent;
};

let current: CatppuccinSelection = { darkFlavor: DEFAULT_DARK_FLAVOR, accent: DEFAULT_ACCENT };
const listeners = new Set<() => void>();

export function getCatppuccinSelection(): CatppuccinSelection {
  return current;
}

export function setCatppuccinSelection(next: CatppuccinSelection): void {
  if (next.darkFlavor === current.darkFlavor && next.accent === current.accent) {
    return;
  }
  current = next;
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeCatppuccinSelection(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCatppuccinSelection(): CatppuccinSelection {
  return useSyncExternalStore(subscribeCatppuccinSelection, getCatppuccinSelection);
}
