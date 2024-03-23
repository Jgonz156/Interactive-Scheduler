import { Typography } from "@mui/material"
import SettingsDialog from "../SettingsDialog"

export default function SchedulerSettings({ closeHandler, open = false }) {
  return (
    <>
      <SettingsDialog
        menuName="Scheduler Settings"
        closeHandler={closeHandler}
        open={open}
      >
        <Typography>Im the scheduler settings</Typography>
      </SettingsDialog>
    </>
  )
}
