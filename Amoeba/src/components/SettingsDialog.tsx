import * as React from "react"
import Draggable from "react-draggable"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Paper, { PaperProps } from "@mui/material/Paper"

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  )
}

export default function SettingsDialog({
  children,
  menuName = "Placeholder",
  closeHandler,
  open = false,
}: {
  children?: React.ReactElement
  menuName?: string
  closeHandler?: any
  open?: boolean
}) {
  //const [open, setOpen] = React.useState(false)

  //const handleClickOpen = () => {
  //setOpen(true)
  //}

  //const handleClose = () => {
  //setOpen(false)
  //}

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={closeHandler}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {menuName}
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeHandler}>
            Close Menu
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
