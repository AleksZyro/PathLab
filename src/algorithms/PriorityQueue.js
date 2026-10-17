export class MinPriorityQueue {
  constructor(compare = (left, right) => left.priority - right.priority) {
    this.heap = [];
    this.compare = compare;
  }

  get size() {
    return this.heap.length;
  }

  push(value) {
    this.heap.push(value);
    this.#bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return undefined;

    const first = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.#sinkDown(0);
    }
    return first;
  }

  #bubbleUp(index) {
    let currentIndex = index;
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      if (this.compare(this.heap[currentIndex], this.heap[parentIndex]) >= 0) break;
      [this.heap[currentIndex], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[currentIndex]];
      currentIndex = parentIndex;
    }
  }

  #sinkDown(index) {
    let currentIndex = index;
    while (true) {
      const leftIndex = currentIndex * 2 + 1;
      const rightIndex = leftIndex + 1;
      let smallestIndex = currentIndex;

      if (leftIndex < this.heap.length && this.compare(this.heap[leftIndex], this.heap[smallestIndex]) < 0) {
        smallestIndex = leftIndex;
      }
      if (rightIndex < this.heap.length && this.compare(this.heap[rightIndex], this.heap[smallestIndex]) < 0) {
        smallestIndex = rightIndex;
      }
      if (smallestIndex === currentIndex) break;

      [this.heap[currentIndex], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[currentIndex]];
      currentIndex = smallestIndex;
    }
  }
}
