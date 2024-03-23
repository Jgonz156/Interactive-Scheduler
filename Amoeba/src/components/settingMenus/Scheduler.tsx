import { Typography } from "@mui/material"
import SettingsDialog from "../SettingsDialog"

export default function SchedulerSettings({
  closeHandler,
  open = false,
}: {
  closeHandler: any
  open: boolean
}) {
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
