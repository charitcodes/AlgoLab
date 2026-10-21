
export function quickSortSteps(input) {
  const array = [...input];
  const steps = [];

  function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...array],
        active: [j, high],
        pivot: high,
        message: `Compare ${array[j]} with pivot ${pivot}`,
      });

      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];

        steps.push({
          array: [...array],
          active: [i, j],
          pivot: high,
          message: `${array[j]} is placed before the pivot`,
        });
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];

    steps.push({
      array: [...array],
      active: [i + 1],
      pivot: i + 1,
      message: `Pivot ${array[i + 1]} reaches its correct position`,
    });

    return i + 1;
  }

  function sort(low, high) {
    if (low >= high) return;

    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  }

  sort(0, array.length - 1);

  steps.push({
    array: [...array],
    active: [],
    pivot: -1,
    message: "Quick Sort completed!",
    done: true,
  });

  return steps;
}

export function mergeSortSteps(input) {
  const array = [...input];
  const steps = [];

  function sort(left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    sort(left, mid);
    sort(mid + 1, right);

    const leftPart = array.slice(left, mid + 1);
    const rightPart = array.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftPart.length && j < rightPart.length) {
      if (leftPart[i] <= rightPart[j]) {
        array[k++] = leftPart[i++];
      } else {
        array[k++] = rightPart[j++];
      }

      steps.push({
        array: [...array],
        active: [k - 1],
        pivot: -1,
        message: "Merging the two sorted halves",
      });
    }

    while (i < leftPart.length) {
      array[k++] = leftPart[i++];
      steps.push({
        array: [...array],
        active: [k - 1],
        pivot: -1,
        message: "Copying remaining elements",
      });
    }

    while (j < rightPart.length) {
      array[k++] = rightPart[j++];
      steps.push({
        array: [...array],
        active: [k - 1],
        pivot: -1,
        message: "Copying remaining elements",
      });
    }
  }

  sort(0, array.length - 1);

  steps.push({
    array: [...array],
    active: [],
    pivot: -1,
    message: "Merge Sort completed!",
    done: true,
  });

  return steps;
}
