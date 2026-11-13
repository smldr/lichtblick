// SPDX-FileCopyrightText: Copyright (C) 2026 Lichtblick Catppuccin contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import CheckIcon from "@mui/icons-material/Check";
import ComputerIcon from "@mui/icons-material/Computer";
import {
  ButtonBase,
  FormLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { MouseEvent, useCallback } from "react";
import { makeStyles } from "tss-react/mui";

import Stack from "@lichtblick/suite-base/components/Stack";
import {
  accentDisplayName,
  CATPPUCCIN_ACCENTS,
  CATPPUCCIN_DARK_FLAVORS,
  CATPPUCCIN_FLAVORS,
  CatppuccinAccent,
  CatppuccinFlavor,
  ctpColor,
  flavorDisplayName,
  isCatppuccinDarkFlavor,
  useCatppuccinSelection,
} from "@lichtblick/theme";

import { FlavorChoice, useCatppuccinSettings } from "./useCatppuccinSettings";

const useStyles = makeStyles()((theme) => ({
  toggleButton: {
    display: "flex !important",
    flexDirection: "column",
    gap: theme.spacing(0.75),
    lineHeight: "1 !important",
    textTransform: "none",
  },
  flavorSwatch: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    border: `1px solid ${theme.palette.divider}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  flavorSwatchDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
  accentGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  accentSwatch: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    outlineOffset: 2,
    "&.Mui-focusVisible": {
      outline: `2px solid ${theme.palette.text.primary}`,
    },
  },
}));

/** The flavor whose colors are on screen right now. */
function useActiveFlavor(): CatppuccinFlavor {
  const theme = useTheme();
  const { darkFlavor } = useCatppuccinSelection();
  return theme.palette.mode === "dark" ? darkFlavor : "latte";
}

function FlavorSwatch({
  flavor,
  accent,
}: {
  flavor: CatppuccinFlavor;
  accent: CatppuccinAccent;
}): React.JSX.Element {
  const { classes } = useStyles();
  return (
    <span className={classes.flavorSwatch} style={{ backgroundColor: ctpColor(flavor, "base") }}>
      <span
        className={classes.flavorSwatchDot}
        style={{ backgroundColor: ctpColor(flavor, accent) }}
      />
    </span>
  );
}

export function CatppuccinFlavorSettings(): React.JSX.Element {
  const { classes } = useStyles();
  const { flavor, setFlavor, systemDarkFlavor, setSystemDarkFlavor, accent } =
    useCatppuccinSettings();

  const handleChange = useCallback(
    (_event: MouseEvent<HTMLElement>, value?: FlavorChoice) => {
      if (value != undefined) {
        setFlavor(value);
      }
    },
    [setFlavor],
  );

  return (
    <Stack gap={1}>
      <FormLabel>Flavor:</FormLabel>
      <ToggleButtonGroup
        color="primary"
        size="small"
        fullWidth
        exclusive
        value={flavor}
        onChange={handleChange}
      >
        {CATPPUCCIN_FLAVORS.map((value) => (
          <ToggleButton key={value} className={classes.toggleButton} value={value}>
            <FlavorSwatch flavor={value} accent={accent} />
            {flavorDisplayName(value)}
          </ToggleButton>
        ))}
        <ToggleButton className={classes.toggleButton} value="system">
          <ComputerIcon /> System
        </ToggleButton>
      </ToggleButtonGroup>
      {flavor === "system" && (
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.secondary">
            Light: Latte. Dark:
          </Typography>
          <Select
            size="small"
            value={systemDarkFlavor}
            onChange={(event) => {
              if (isCatppuccinDarkFlavor(event.target.value)) {
                setSystemDarkFlavor(event.target.value);
              }
            }}
          >
            {CATPPUCCIN_DARK_FLAVORS.map((value) => (
              <MenuItem key={value} value={value}>
                {flavorDisplayName(value)}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      )}
    </Stack>
  );
}

export function CatppuccinAccentSettings(): React.JSX.Element {
  const { classes } = useStyles();
  const { accent, setAccent } = useCatppuccinSettings();
  const activeFlavor = useActiveFlavor();
  const onAccent = ctpColor(activeFlavor, "base");

  return (
    <Stack gap={1}>
      <FormLabel>Accent: {accentDisplayName(accent)}</FormLabel>
      <div className={classes.accentGrid} role="radiogroup" aria-label="Accent color">
        {CATPPUCCIN_ACCENTS.map((value) => {
          const selected = value === accent;
          return (
            <Tooltip key={value} title={accentDisplayName(value)}>
              <ButtonBase
                className={classes.accentSwatch}
                role="radio"
                aria-checked={selected}
                aria-label={accentDisplayName(value)}
                style={{ backgroundColor: ctpColor(activeFlavor, value), color: onAccent }}
                onClick={() => {
                  setAccent(value);
                }}
              >
                {selected && <CheckIcon fontSize="small" />}
              </ButtonBase>
            </Tooltip>
          );
        })}
      </div>
    </Stack>
  );
}
