import { Typography } from "@mui/material"
import SettingsDialog from "../SettingsDialog"

export default function SimulationSettings({ closeHandler, open = false }) {
  return (
    <>
      <SettingsDialog
        menuName="Simulation Speed Settings"
        closeHandler={closeHandler}
        open={open}
      >
        <Typography>Im the sim settings</Typography>
      </SettingsDialog>
    </>
  )
}
