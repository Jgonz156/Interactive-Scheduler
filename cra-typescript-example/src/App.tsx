import React, { useEffect, useRef } from "react"
import { DataSet } from "vis-data/esnext"
import { Network } from "vis-network/esnext"
import "vis-network/styles/vis-network.css"
import "./App.css"
import VisNetwork from "./vis-net"
import PriorityQueueVisualizer from "./priorityQ-vis"
import { PriorityQueue } from "./scheduler-core/treap"

function App() {
  // Create a PriorityQueue instance
  const queue = new PriorityQueue<number>()

  // Enqueue some items
  queue.enqueue(1, 3) // root
  queue.enqueue(2, 2) // left child of root
  queue.enqueue(3, 2) // right child of root
  queue.enqueue(4, 1) // left child of node 2
  queue.enqueue(5, 1) // right child of node 2
  queue.enqueue(6, 1) // left child of node 3
  queue.enqueue(7, 1) // right child of node 3
  console.log(queue.root)

  return (
    <div className="App">
      <VisNetwork />
      <PriorityQueueVisualizer queue={queue} />
    </div>
  )
}

export default App
