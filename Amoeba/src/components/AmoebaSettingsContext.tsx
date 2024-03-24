import React from "react"

export enum PlayPause {
  Play,
  Pause,
}

export enum SimulationSpeed {
  Slow = 0.0005,
  Normal = 0.001,
  Fast = 0.005,
  Realtime = 1,
}

const initialSettingsState = {
  simulation: {
    playPause: PlayPause.Play,
    simulationSpeed: SimulationSpeed.Normal,
  },
  cores: { pCoreCount: 1, eCoreCount: 0 },
  threads: { threadCount: 10, threadCost: 10000 },
  scheduler: {},
}

type SettingsState = typeof initialSettingsState
type SettingsUpdateAction = { field: keyof SettingsState; value: any }

const reducer = (state: SettingsState, action: SettingsUpdateAction) => {
  return { ...state, [action.field]: action.value }
}

type SettingsContextType = {
  settings: SettingsState
  dispatch: React.Dispatch<SettingsUpdateAction>
}

const initialContext: SettingsContextType = {
  settings: initialSettingsState,
  dispatch: () => {},
}

export const AmoebaSettingsContext = React.createContext(initialContext)

export function AmoebaSettingsProvider({ children }: { children: any }) {
  const [settings, dispatch] = React.useReducer(reducer, initialSettingsState)

  return (
    <AmoebaSettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </AmoebaSettingsContext.Provider>
  )
}
