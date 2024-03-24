import { TextField, Typography } from "@mui/material"
import SettingsDialog from "../SettingsDialog"
import React from "react"
import { AmoebaSettingsContext } from "../AmoebaSettingsContext"

export default function ThreadsSettings({
  closeHandler,
  open = false,
}: {
  closeHandler: any
  open: boolean
}) {
  const { settings, dispatch } = React.useContext(AmoebaSettingsContext)
  return (
    <>
      <SettingsDialog
        menuName="Thread and Batch Job Settings"
        closeHandler={closeHandler}
        open={open}
      >
        <>
          <Typography>Im the Thread settings</Typography>
          <TextField
            id="outlined-basic"
            label="Insert Number of Nodes Here"
            variant="outlined"
            onChange={(e) =>
              dispatch({
                field: "threads",
                value: { ...settings, threadCount: Number(e.target.value) },
              })
            }
          />
        </>
      </SettingsDialog>
    </>
  )
}
