import * as core from "./core"
let testBatch: Set<core.Thread> = new Set()

const randomPriority: () => core.Priority = () => {
  let result = {}
  switch (Math.floor(Math.random() * 3)) {
    case 0:
      result = { urgency: Math.floor(Math.random() * 12 + 1) }
      break
    case 1:
      result = { importance: Math.floor(Math.random() * 12 + 1) }
      break
    case 2:
      result = { resourceAllocation: Math.floor(Math.random() * 12 + 1) }
  }
  return result
}
for (let i = 0; i < 15; i++) {
  const newThread: core.Thread = {
    cost: Math.floor(Math.random() * 10000 + 1),
    priority: randomPriority(),
    state: core.SchedulerState.Waiting,
  }
  testBatch.add(newThread)
}
