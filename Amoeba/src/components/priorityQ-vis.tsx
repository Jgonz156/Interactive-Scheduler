import React, { useEffect, useRef } from "react"
import { /*DataInterfaceNodes, DataSet,*/ Network } from "vis-network"
import { PriorityQueue, Orb } from "../scheduler-core/treap"

//type visNode = { id: number; label: string }
//type visEdge = { from: number; to: number }

interface PriorityQueueVisualizerProps {
  queue: PriorityQueue<number>
}

const PriorityQueueVisualizer: React.FC<PriorityQueueVisualizerProps> = ({
  queue,
}) => {
  let nodes: [{ id: number; label: string }] = [
    { id: 0, label: "Hello World!" },
  ]
  let edges: [{ from: number; to: number }] = [{ from: 0, to: 0 }]

  function traverse(orb: Orb<number> | null, parentId: number | null = null) {
    if (orb === null) {
      return
    }

    nodes.push({ id: orb.key, label: String(orb.key) })

    if (parentId !== null) {
      edges.push({ from: parentId, to: orb.key })
    }

    traverse(orb.left, orb.key)
    traverse(orb.right, orb.key)
  }

  traverse(queue.root)
  const networkContainer = useRef(null)
  console.log(nodes, edges)

  useEffect(() => {
    const options = {
      /*
      nodes: {
        color: "#ff0000",
        shape: "dot",
        size: 30,
        font: {
          color: "#ffffff",
          size: 14, // size in px
        },
      },
      edges: {
        color: "#00ff00",
        width: 2,
      },
      */
    }
    if (networkContainer.current) {
      new Network(networkContainer.current, { nodes, edges }, options)
    }
  }, [queue])

  return (
    <div
      ref={networkContainer}
      style={{ width: "1600px", height: "800px" }}
    ></div>
  )
}

export default PriorityQueueVisualizer
