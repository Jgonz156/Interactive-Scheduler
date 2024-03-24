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

  const menus = [
    {
      icon: <ChecklistIcon />,
      name: "Scheduler Priority",
      openHandler: () => {
        setOpenScheduler(true)
      },
      menu: (
        <SchedulerSettings
          closeHandler={() => {
            setOpenScheduler(false)
          }}
          open={openScheduler}
        />
      ),
    },
    {
      icon: <TimelineIcon />,
      name: "Threads",
      openHandler: () => {
        setOpenThreads(true)
      },
      menu: (
        <ThreadsSettings
          closeHandler={() => {
            setOpenThreads(false)
          }}
          open={openThreads}
        />
      ),
    },
    {
      icon: <DeveloperBoardIcon />,
      name: "Cores",
      openHandler: () => {
        setOpenCores(true)
      },
      menu: (
        <CoresSettings
          closeHandler={() => {
            setOpenCores(false)
          }}
          open={openCores}
        />
      ),
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
      menu: (
        <SimulationSettings
          closeHandler={() => {
            setOpenSimulation(false)
          }}
          open={openSimulation}
        />
      ),
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
        {menus.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.openHandler}
          />
        ))}
      </SpeedDial>
      {menus.map((action) => action.menu)}
    </Box>
  )
}
