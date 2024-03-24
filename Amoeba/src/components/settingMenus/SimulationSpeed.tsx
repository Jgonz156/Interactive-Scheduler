import {
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import SettingsDialog from "../SettingsDialog"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"
import React from "react"
import { PlayPause, AmoebaSettingsContext } from "../AmoebaSettingsContext"

export default function SimulationSettings({
  closeHandler,
  open = false,
}: {
  closeHandler: any
  open: boolean
}) {
  const { settings, dispatch } = React.useContext(AmoebaSettingsContext)

  const handlePlayPause = (
    _e: React.MouseEvent<HTMLElement, MouseEvent>,
    p: PlayPause
  ) => {
    p === PlayPause.Play
      ? dispatch({
          field: "simulation",
          value: { ...settings.simulation, playPause: PlayPause.Pause },
        })
      : dispatch({
          field: "simulation",
          value: { ...settings.simulation, playPause: PlayPause.Play },
        })
  }
  return (
    <>
      <SettingsDialog
        menuName="Simulation Speed Settings"
        closeHandler={closeHandler}
        open={open}
      >
        <>
          <Typography>Im the sim settings</Typography>
          <ToggleButtonGroup
            value={settings.simulation.playPause}
            exclusive
            onChange={handlePlayPause}
            aria-label="text alignment"
          >
            <ToggleButton value={PlayPause.Pause} aria-label="Pause">
              <PauseIcon />
            </ToggleButton>
            <ToggleButton value={PlayPause.Play} aria-label="Play">
              <PlayArrowIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <Slider
            defaultValue={50}
            valueLabelFormat={(v) =>
              `${v === 0 ? 0.5 : v === 50 ? 1 : v === 100 ? 2 : 1}x Speed`
            }
            step={null}
            valueLabelDisplay="auto"
            marks={[
              { value: 0, label: "Slow" },
              { value: 50, label: "Normal" },
              { value: 100, label: "Fast" },
            ]}
          />
        </>
      </SettingsDialog>
    </>
  )
}
