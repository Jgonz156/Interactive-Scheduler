/*
 */
export type Thread = { cost: number; priority: Priority; state: SchedulerState }

/*
A Thread's priority is understood to mean how important it is for it to be completed. Like
a ranking, it is often used to weigh its worth against working on another thread. However, 
measuring the importance of a thread is not a simple as picking the thread of greatest 
priority. While this is surely a simple approach, more can be gained from breaking down a
threads "priority" into pieces that explain why it has a higher ranking.

Urgency is used to describe how necessary it is that a thread is completed sooner rather
later. An example is a vital kernel thread preforming a memory operation that is necessary to
prevent a hang up in the operation of the system.

Importance is used to describe how vital a thread is for maintaining operation. Put another 
way, it is for measuring how much this thread is relied on by others. An example is a
thread that runs upkeep on a server that services many clients.

Resource Allocation is used to describe how much of the systems resources may be required to
compute the thread. An example is a thread that requires many intensive memory reads.
*/
export type Priority = Partial<{
  urgency: number
  importance: number
  resourceAllocation: number
}>

export type Scheduler = {
  batch: Set<Thread>
  running?: Thread
  ready: RunnableQueue
  waiting: WaitQueue
}

export type RunnableQueue = {}

export type WaitQueue = {}

export enum SchedulerState {
  Running,
  Waiting,
  Runnable,
}
