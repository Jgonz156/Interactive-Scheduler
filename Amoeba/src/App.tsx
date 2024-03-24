import { useEffect } from "react"
import Graph from "graphology"
import { SigmaContainer, useLoadGraph } from "@react-sigma/core"
import "@react-sigma/core/lib/react-sigma.min.css"
import React from "react"
import { Box } from "@mui/material"
import MenuDial from "./components/MenuDial"
import {
  AmoebaSettingsContext,
  AmoebaSettingsProvider,
} from "./components/AmoebaSettingsContext"

export const LoadGraph = () => {
  const settings = React.useContext(AmoebaSettingsContext).settings
  const loadGraph = useLoadGraph()

  useEffect(() => {
    const graph = new Graph()
    for (let i = 0; i < settings.threads.threadCount; i++) {
      graph.addNode(String(i), {
        x: i,
        y: i,
        size: 15,
        label: `Node Number #${i}`,
        color: "#FA4F40",
      })
    }

    loadGraph(graph)
  }, [loadGraph, settings])

  return null
}

export const DisplayGraphApp = () => {
  //const [nodeName, setNodeName] = React.useState<string>("Bob")
  //const [nodeAmount, setNodeAmount] = React.useState<number>(1)
  return (
    <Box>
      <AmoebaSettingsProvider>
        <Box sx={{ display: "flex" }}>
          <SigmaContainer
            style={{ height: "100vh", width: "100vw", zIndex: 0 }}
          >
            <LoadGraph />
          </SigmaContainer>
          <MenuDial
            sx={{
              position: "relative",
              zIndex: 1,
              height: "100vh",
            }}
          />
        </Box>
      </AmoebaSettingsProvider>
    </Box>
  )
}

export default DisplayGraphApp
