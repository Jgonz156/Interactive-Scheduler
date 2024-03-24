import { useEffect, useState } from "react"
import Graph from "graphology"
import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
  useSigma,
  ZoomControl,
} from "@react-sigma/core"
import "@react-sigma/core/lib/react-sigma.min.css"
import React from "react"
import { Box } from "@mui/material"
import MenuDial from "./components/MenuDial"
import {
  AmoebaSettingsContext,
  AmoebaSettingsProvider,
} from "./components/AmoebaSettingsContext"
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2"

function LoadGraph() {
  const settings = React.useContext(AmoebaSettingsContext).settings
  const loadGraph = useLoadGraph()

  useEffect(() => {
    const graph = new Graph()
    for (let i = 0; i < 1; i++) {
      graph.addNode("Runnable" + i, {
        x: -100,
        y: 0,
        size: 20,
        label: "Runnable",
        color: "#FA4F40",
      })
      graph.addNode("Running" + i, {
        x: 100,
        y: 0,
        size: 20,
        label: "Running",
        color: "#FA4F40",
      })
      graph.addNode("Waiting" + i, {
        x: 0,
        y: -100,
        size: 20,
        label: "Waiting",
        color: "#FA4F40",
      })
      graph.addDirectedEdge("Runnable" + i, "Running" + i, {
        label: "Dispatch",
      })
      graph.addDirectedEdge("Running" + i, "Runnable" + i, { label: "Yield" })
      graph.addDirectedEdge("Running" + i, "Waiting" + i, { label: "Wait" })
      graph.addDirectedEdge("Waiting" + i, "Runnable" + i, { label: "Event" })
    }
    for (let i = 0; i < settings.threads.threadCount; i++) {
      graph.addNode(String(i), {
        x: i - 100,
        y: i + 100,
        size: 15,
        label: `Node Number #${i}`,
        color: "#FA4F40",
      })
    }

    loadGraph(graph)
  }, [loadGraph, settings])

  return null
}

export default function DisplayGraphApp() {
  const GraphEvents: React.FC = () => {
    const registerEvents = useRegisterEvents()
    const sigma = useSigma()
    const [draggedNode, setDraggedNode] = useState<string | null>(null)

    useEffect(() => {
      // Register the events
      registerEvents({
        downNode: (e) => {
          setDraggedNode(e.node)
          sigma.getGraph().setNodeAttribute(e.node, "highlighted", true)
        },
        mouseup: (_e) => {
          if (draggedNode) {
            setDraggedNode(null)
            sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted")
          }
        },
        mousedown: (_e) => {
          // Disable the autoscale at the first down interaction
          if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox())
        },
        mousemove: (e) => {
          if (draggedNode) {
            // Get new position of node
            const pos = sigma.viewportToGraph(e)
            sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x)
            sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y)

            // Prevent sigma to move camera:
            e.preventSigmaDefault()
            e.original.preventDefault()
            e.original.stopPropagation()
          }
        },
        touchup: (_e) => {
          if (draggedNode) {
            setDraggedNode(null)
            sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted")
          }
        },
        touchdown: (_e) => {
          // Disable the autoscale at the first down interaction
          if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox())
        },
        //touchmove: (e) => {
        //  if (draggedNode) {
        //    // Get new position of node
        //    const pos = sigma.viewportToGraph(e)
        //    sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x)
        //    sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y)
        //  }
        //},
      })
    }, [registerEvents, sigma, draggedNode])

    return null
  }

  return (
    <Box>
      <AmoebaSettingsProvider>
        <Box sx={{ display: "flex" }}>
          <SigmaContainer
            style={{ height: "100vh", width: "100vw", zIndex: 0 }}
          >
            <LoadGraph />
            <GraphEvents />
            <ControlsContainer position={"bottom-left"}>
              <ZoomControl />
              <FullScreenControl />
              <LayoutForceAtlas2Control
                settings={{ settings: { slowDown: 10 } }}
              />
            </ControlsContainer>
            <ControlsContainer position={"top-right"}>
              <SearchControl style={{ width: "200px" }} />
            </ControlsContainer>
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
