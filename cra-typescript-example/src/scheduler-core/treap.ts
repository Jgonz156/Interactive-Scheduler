export class Orb<T> {
  constructor(
    public key: T,
    public priority: number,
    public left: Orb<T> | null = null,
    public right: Orb<T> | null = null
  ) {}
}

export class PriorityQueue<T> {
  root: Orb<T> | null = null

  rotateRight(orb: Orb<T>): Orb<T> {
    const left = orb.left
    orb.left = left!.right
    left!.right = orb
    return left!
  }

  rotateLeft(orb: Orb<T>): Orb<T> {
    const right = orb.right
    orb.right = right!.left
    right!.left = orb
    return right!
  }

  enqueue(item: T, priority: number): void {
    const newOrb = new Orb(item, priority)
    this.root = this._insert(this.root, newOrb)
  }

  _insert(orb: Orb<T> | null, newOrb: Orb<T>): Orb<T> {
    if (orb === null) {
      return newOrb
    }

    // Define a comparison function that takes into account both the keys and the priorities
    const compare = (a: Orb<T>, b: Orb<T>) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority
      } else {
        return a.key < b.key ? -1 : 1
      }
    }

    if (compare(newOrb, orb) < 0) {
      orb.left = this._insert(orb.left, newOrb)

      if (orb.left && orb.left.priority > orb.priority) {
        orb = this.rotateRight(orb)
      }
    } else {
      orb.right = this._insert(orb.right, newOrb)

      if (orb.right && orb.right.priority > orb.priority) {
        orb = this.rotateLeft(orb)
      }
    }

    return orb
  }

  dequeue(): T | undefined {
    if (!this.root) {
      return undefined
    }

    let orb = this.root
    while (orb.left || orb.right) {
      if (!orb.right || (orb.left && orb.left.priority > orb.right.priority)) {
        orb = this.rotateRight(orb)
      } else {
        orb = this.rotateLeft(orb)
      }
    }

    this.root = orb.left || orb.right
    return orb.key
  }

  peek(): T | undefined {
    return this.root?.key
  }

  isEmpty(): boolean {
    return this.root === null
  }

  size(): number {
    return this._size(this.root)
  }

  _size(orb: Orb<T> | null): number {
    if (orb === null) {
      return 0
    }

    return 1 + this._size(orb.left) + this._size(orb.right)
  }
}
