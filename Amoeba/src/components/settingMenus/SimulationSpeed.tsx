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
import {
  SimulationSpeed,
  PlayPause,
  AmoebaSettingsContext,
} from "../AmoebaSettingsContext"

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

  const handleSimulationSpeed = (_e: Event, v: number | number[]) => {
    if (typeof v === "number") {
      dispatch({
        field: "simulation",
        value: {
          ...settings.simulation,
          simulationSpeed:
            v === 0
              ? SimulationSpeed.Slow
              : v === 33
              ? SimulationSpeed.Normal
              : v === 66
              ? SimulationSpeed.Fast
              : v === 100
              ? SimulationSpeed.Realtime
              : SimulationSpeed.Normal,
          simulationSpeedSliderVal: v,
        },
      })
    }
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
            aria-label="Playing and Pausing App Buttons"
          >
            <ToggleButton value={PlayPause.Pause} aria-label="Pause">
              <PauseIcon />
            </ToggleButton>
            <ToggleButton value={PlayPause.Play} aria-label="Play">
              <PlayArrowIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <Slider
            value={settings.simulation.simulationSpeedSliderVal}
            valueLabelFormat={(v: number) => {
              switch (v) {
                case 0:
                  return "0.5x Speed"
                case 33:
                  return "1x Speed"
                case 66:
                  return "2x Speed"
                case 100:
                  return "1000x Speed"
              }
            }}
            onChange={handleSimulationSpeed}
            step={null}
            valueLabelDisplay="auto"
            marks={[
              { value: 0, label: "Slow" },
              { value: 33, label: "Normal" },
              { value: 66, label: "Fast" },
              { value: 100, label: "Realtime" },
            ]}
          />
        </>
      </SettingsDialog>
    </>
  )
}
