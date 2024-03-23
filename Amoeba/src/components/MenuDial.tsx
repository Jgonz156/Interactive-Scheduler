import React from "react"
import {
  Backdrop,
  SpeedDial,
  SpeedDialAction,
  SxProps,
  Box,
} from "@mui/material"
import SettingsIcon from "@mui/icons-material/Settings"
import ChecklistIcon from "@mui/icons-material/Checklist"
import TimelineIcon from "@mui/icons-material/Timeline"
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard"
import SpeedIcon from "@mui/icons-material/Speed"
import SimulationSettings from "./settingMenus/SimulationSpeed"
import CoresSettings from "./settingMenus/Cores"
import SchedulerSettings from "./settingMenus/Scheduler"
import ThreadsSettings from "./settingMenus/Threads"

export default function MenuDial({ sx }: { sx: SxProps }) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [openSimulation, setOpenSimulation] = React.useState(false)
  const [openCores, setOpenCores] = React.useState(false)
  const [openThreads, setOpenThreads] = React.useState(false)
  const [openScheduler, setOpenScheduler] = React.useState(false)

  const actions = [
    {
      icon: <ChecklistIcon />,
      name: "Scheduler Priority",
      closeHandler: () => {
        setOpenScheduler(false)
      },
      openHandler: () => {
        setOpenScheduler(true)
      },
    },
    {
      icon: <TimelineIcon />,
      name: "Threads",
      closeHandler: () => {
        setOpenThreads(false)
      },
      openHandler: () => {
        setOpenThreads(true)
      },
    },
    {
      icon: <DeveloperBoardIcon />,
      name: "Cores",
      closeHandler: () => {
        setOpenCores(false)
      },
      openHandler: () => {
        setOpenCores(true)
      },
    },
    {
      icon: <SpeedIcon />,
      name: "Simulation",
      closeHandler: () => {
        setOpenSimulation(false)
      },
      openHandler: () => {
        setOpenSimulation(true)
      },
    },
  ]

  return (
    <Box
      sx={{
        transform: "translateZ(0px)",
        flexGrow: 1,
        pointerEvents: "none",
        ...sx,
      }}
    >
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SettingsIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.openHandler}
          />
        ))}
      </SpeedDial>
      <SchedulerSettings
        closeHandler={actions[0].closeHandler}
        open={openScheduler}
      />
      <ThreadsSettings
        closeHandler={actions[1].closeHandler}
        open={openThreads}
      />
      <CoresSettings closeHandler={actions[2].closeHandler} open={openCores} />
      <SimulationSettings
        closeHandler={actions[3].closeHandler}
        open={openSimulation}
      />
    </Box>
  )
}
