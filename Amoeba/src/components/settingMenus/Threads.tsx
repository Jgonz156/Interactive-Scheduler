import { Typography } from "@mui/material"
import SettingsDialog from "../SettingsDialog"

export default function ThreadsSettings({ closeHandler, open = false }) {
  return (
    <>
      <SettingsDialog
        menuName="Thread and Batch Job Settings"
        closeHandler={closeHandler}
        open={open}
      >
        <Typography>Im the Thread settings</Typography>
      </SettingsDialog>
    </>
  )
}
