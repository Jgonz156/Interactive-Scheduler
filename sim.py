import simpy
import random
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import time
from simpy.core import BoundClass
from simpy.resources import base
from pyrsistent import v

P_CORE_ENERGY_FACTOR = 3.0
E_CORE_ENERGY_FACTOR = 1.0
P_CORE_PREFORMANCE_FACTOR = 1.85
E_CORE_PREFORMANCE_FACTOR = 1.0

class StorePut(base.Put):
    def __init__(self, store, item):
        self.item = item
        """The item to put into the store."""
        super(StorePut, self).__init__(store)


class StoreGet(base.Get):
    pass

class PersistentStore(base.BaseResource):

    def __init__(self, env, capacity=float('inf')):
        if capacity <= 0:
            raise ValueError('"capacity" must be > 0.')

        super(PersistentStore, self).__init__(env, capacity)

        self.items = v()
        """Persistent vector of the items available in the store."""

    put = BoundClass(StorePut)

    get = BoundClass(StoreGet)

    def _do_put(self, event):
        if len(self.items) < self._capacity:
            self.items = self.items.append(event.item)
            event.succeed()

    def _do_get(self, event):
        if len(self.items) > 0:
            item, rest = self.items[0], self.items[1:]
            self.items = rest
            event.succeed(item)

class Core:
    def __init__(self, env , persitent = False):
        self.env = env
        if persitent:
            self.task_queue = PersistentStore(env)
        else: 
            self.task_queue = simpy.Store(env)
        self.completed_tasks = []
        self.performance = 1.0 # default performance factor

    def run(self):
        while True:
            start_queue_cost = time.time()
            task = yield self.task_queue.get()
            end_queue_cost = time.time()
            yield self.env.timeout(end_queue_cost - start_queue_cost)
            task.start_time = self.env.now
            yield self.env.timeout(task.duration / self.performance) 
            task.end_time = self.env.now 
            self.completed_tasks.append(task)

    def total_energy_used(self):
        return sum(task.duration * self.energy_factor for task in self.completed_tasks)

class PerformanceCore(Core):
    def __init__(self, env, persitent = False):
        super().__init__(env, persitent)
        self.performance = P_CORE_PREFORMANCE_FACTOR  
        self.energy_factor = P_CORE_ENERGY_FACTOR  
        self.core_type = 'performance'

class EfficiencyCore(Core):
    def __init__(self, env, persitent = False):
        super().__init__(env, persitent)
        self.performance = E_CORE_PREFORMANCE_FACTOR
        self.energy_factor = E_CORE_ENERGY_FACTOR
        self.core_type = 'efficiency'
       

class Task:
    def __init__(self, task_id, arrival_time, duration, affinity):
        self.id = task_id
        self.arrival_time = arrival_time
        self.duration = duration
        self.affinity = affinity
        self.start_time = None
        self.end_time = None
        self.cost = None

    def total_time_used(self):
        return self.end_time - self.start_time

    def __repr__(self):
        return f"Task {self.id} ({self.affinity})"
    
    def copy(self):
        return Task(self.id, self.arrival_time, self.duration, self.affinity)
    
    

class ProfileBasedScheduler:
    def __init__(self, env, machines):
        self.env = env
        self.machines = machines
        self.p_cores = [m for m in machines if m.core_type == 'performance']
        self.e_cores = [m for m in machines if m.core_type == 'efficiency']

        for machine in self.machines:
            self.env.process(machine.run())

    def schedule(self, tasks):
        for task in tasks:
            self.env.process(self.handle_task(task))


    def handle_task(self, task):
        if task.affinity == 'performance':
            target_cores = self.p_cores
        elif task.affinity == 'efficiency':
            target_cores = self.e_cores
        else:  # 'neutral' affinity
            target_cores = self.machines

        try:
            optimal_core = min(target_cores, key=lambda m: len(m.task_queue.items))
        except ValueError:  # No target cores available, only happens when only use 1 core type
            optimal_core = min(self.machines, key=lambda m: len(m.task_queue.items))

        yield optimal_core.task_queue.put(task)

def generate_tasks(n):
    tasks = []
    for i in range(n):
        arrival_time = random.uniform(0, 10)
        duration = random.uniform(0.5, 5.0)
        affinity = random.choice(['performance', 'efficiency', 'neutral'])
        tasks.append(Task(i, arrival_time, duration, affinity))
    return tasks

lots_of_tasks = generate_tasks(1000)

lots_of_tasks = sorted(lots_of_tasks, key=lambda t: t.arrival_time)
lots_of_persistent_tasks = [task.copy() for task in lots_of_tasks]
p_lots_of_tasks = [task.copy() for task in lots_of_tasks]
e_lots_of_tasks = [task.copy() for task in lots_of_tasks]

# i9 13900K simulaton
env = simpy.Environment()
p_cores = [PerformanceCore(env) for _ in range(8)]
e_cores = [EfficiencyCore(env) for _ in range(16)]
i9_13900K_scheduler = ProfileBasedScheduler(env, p_cores + e_cores)
i9_13900K_scheduler.schedule(lots_of_tasks)
env.run()

# Persistent i9 13900K simulaton
env = simpy.Environment()
persistent_p_cores = [PerformanceCore(env, persitent=True) for _ in range(8)]
persistent_e_cores = [EfficiencyCore(env, persitent=True) for _ in range(16)]
persistent_i9_13900K_scheduler = ProfileBasedScheduler(env, persistent_p_cores + persistent_e_cores)
persistent_i9_13900K_scheduler.schedule(lots_of_persistent_tasks)
env.run()

# All P-cores simulation
env = simpy.Environment()
all_p_cores = [PerformanceCore(env) for _ in range(24)]
p_scheduler = ProfileBasedScheduler(env, all_p_cores)
p_scheduler.schedule(p_lots_of_tasks)
env.run()

# All E-cores simulation
env = simpy.Environment()
all_e_cores = [EfficiencyCore(env) for _ in range(24)]
e_scheduler = ProfileBasedScheduler(env, all_e_cores)
e_scheduler.schedule(e_lots_of_tasks)
env.run()

machine_tasks = [(machine.completed_tasks, machine.core_type) for machine in i9_13900K_scheduler.machines]

fig, ax = plt.subplots(figsize=(10, 6))

cmap = cm.get_cmap('tab20')

for (i, (tasks, core_type)) in enumerate(machine_tasks):
    task_times = [(task.start_time, task.duration) for task in tasks]
    for j, (start, duration) in enumerate(task_times):
        ax.broken_barh([(start, duration)], (i-0.4, 0.8), facecolors=cmap(j % 20))

ax.set_yticks(range(len(machine_tasks)))
ax.set_yticklabels([f'{core_type[0].upper()} Core {i}' for (i, (completed_task ,core_type)) in enumerate(machine_tasks)])
ax.set_xlabel('Time')
ax.set_title('Intel Raptor Lake i9 13900K Task Schedule')
plt.show()

persistent_machine_tasks = [(machine.completed_tasks, machine.core_type) for machine in persistent_i9_13900K_scheduler.machines]

fig, ax = plt.subplots(figsize=(10, 6))

for (i, (tasks, core_type)) in enumerate(persistent_machine_tasks):
    task_times = [(task.start_time, task.duration) for task in tasks]
    for j, (start, duration) in enumerate(task_times):
        ax.broken_barh([(start, duration)], (i-0.4, 0.8), facecolors=cmap(j % 20))

ax.set_yticks(range(len(persistent_machine_tasks)))
ax.set_yticklabels([f'{core_type[0].upper()} Core {i}' for (i, (completed_task ,core_type)) in enumerate(persistent_machine_tasks)])
ax.set_xlabel('Time (s)')
ax.set_title('Persistent Intel Raptor Lake i9 13900K Task Schedule')
plt.show()

fig, ax = plt.subplots(figsize=(10, 6))

# Create a dictionary mapping affinities to colors
affinity_colors = {
    'performance': ['tab:blue', 'darkblue'],
    'efficiency': ['tab:orange', 'darkorange'],
    'neutral': ['tab:gray', 'darkgray']
}

for (i, (tasks, core_type)) in enumerate(machine_tasks):
    task_times = [(task.start_time, task.duration, task.affinity) for task in tasks]
    for j, (start, duration, affinity) in enumerate(task_times):
        color = affinity_colors[affinity][j % 2]
        ax.broken_barh([(start, duration)], (i-0.4, 0.8), facecolors=color)

ax.set_yticks(range(len(machine_tasks)))
ax.set_yticklabels([f'{core_type[0].upper()} Core {i}' for (i, (completed_task, core_type)) in enumerate(machine_tasks)])
ax.set_xlabel('Time (s)')
ax.set_title('Intel Raptor Lake i9 13900K Task Schedule')

scheduler_total_energy = sum(core.total_energy_used() for core in i9_13900K_scheduler.machines)
scheduler_total_time = max([task.end_time for (completed_tasks, core_type) in machine_tasks for task in completed_tasks])

print(f"Total energy used by the i9 13900K scheduler: {round(scheduler_total_energy)}eu")
print(f"Total time used by the i9 13900K scheduler: {scheduler_total_time}s")
print(f"Energy units per second of the i9 13900K scheduler: {round(scheduler_total_energy / scheduler_total_time, 2)}eu/s")
print("")

persistent_scheduler_total_energy = sum(core.total_energy_used() for core in persistent_i9_13900K_scheduler.machines)
persistent_scheduler_total_time = max([task.end_time for (completed_tasks, core_type) in persistent_machine_tasks for task in completed_tasks])

print(f"Total energy used by the persistent i9 13900K scheduler: {round(persistent_scheduler_total_energy)}eu")
print(f"Total time used by the persistent i9 13900K scheduler: {persistent_scheduler_total_time}s")
print(f"Energy units per second of the persistent i9 13900K scheduler: {round(persistent_scheduler_total_energy / persistent_scheduler_total_time, 2)}eu/s")
print("")

p_total_energy = sum(core.total_energy_used() for core in p_scheduler.machines)
p_total_time = max(task.end_time for machine in p_scheduler.machines for task in machine.completed_tasks)
print(f"Total energy used by the P-core scheduler: {round(p_total_energy)}eu")
print(f"Total time used by the P-core scheduler: {p_total_time}s")
print(f"Energy units per second of the P-core scheduler: {round(p_total_energy / p_total_time, 2)}eu/s")
print("")

e_total_energy = sum(core.total_energy_used() for core in e_scheduler.machines)
e_total_time = max(task.end_time for machine in e_scheduler.machines for task in machine.completed_tasks)
print(f"Total energy used by the E-core scheduler: {round(e_total_energy)}eu")
print(f"Total time used by the E-core scheduler: {e_total_time}s")
print(f"Energy units per second of the E-core scheduler: {round(e_total_energy / e_total_time, 2)}eu/s")
print("")
plt.show()