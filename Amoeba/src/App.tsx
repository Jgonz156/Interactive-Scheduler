import { useEffect } from "react"
import Graph from "graphology"
import { SigmaContainer, useLoadGraph } from "@react-sigma/core"
import "@react-sigma/core/lib/react-sigma.min.css"
import React from "react"
import { Box, Button, TextField } from "@mui/material"
import MenuDial from "./components/MenuDial"

export const LoadGraph = ({ name = "Bob", nodeAmount = 1 }) => {
  const loadGraph = useLoadGraph()

  useEffect(() => {
    const graph = new Graph()
    for (let i = 0; i < nodeAmount; i++) {
      graph.addNode(String(i), {
        x: i,
        y: i,
        size: 15,
        label: `Node Number #${i}`,
        color: "#FA4F40",
      })
    }

    loadGraph(graph)
  }, [loadGraph, name, nodeAmount])

  return null
}

export const DisplayGraphApp = () => {
  const [nodeName, setNodeName] = React.useState<string>("Bob")
  const [nodeAmount, setNodeAmount] = React.useState<number>(1)
  return (
    <Box>
      <Button
        variant="contained"
        onClick={() =>
          nodeName === "Bob" ? setNodeName("Yob") : setNodeName("Bob")
        }
      >
        Name
      </Button>
      <TextField
        id="outlined-basic"
        label="Insert Number of Nodes Here"
        variant="outlined"
        onChange={(e) => setNodeAmount(Number(e.target.value))}
      />
      <Box sx={{ display: "flex" }}>
        <SigmaContainer style={{ height: "100vh", width: "100vw" }}>
          <LoadGraph name={nodeName} nodeAmount={nodeAmount} />
        </SigmaContainer>
        <MenuDial
          sx={{
            position: "relative",
            zIndex: 1,
            marginTop: "-100vh",
            height: "100vh",
          }}
        />
      </Box>
    </Box>
  )
}

export default DisplayGraphApp
