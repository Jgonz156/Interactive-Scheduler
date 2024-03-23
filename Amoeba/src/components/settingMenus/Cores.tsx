import { Typography } from "@mui/material"
import SettingsDialog from "../SettingsDialog"

export default function CoresSettings({ closeHandler, open = false }) {
  return (
    <>
      <SettingsDialog
        menuName="Compute Core Settings"
        closeHandler={closeHandler}
        open={open}
      >
        <Typography>Im the Core settings</Typography>
      </SettingsDialog>
    </>
  )
}
