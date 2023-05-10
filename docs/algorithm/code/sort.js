// #region insertion_sort
function insertionSort(ar) {
    for (let j = 1; j < ar.length; j++) {
        const key = ar[j]
        let i = j - 1
        while (i >= 0 && ar[i] > key) {
            ar[i + 1] = ar[i]
            i = i - 1
        }
        ar[i + 1] = key
    }
}

function insertionSort_1(ar) {
    for (let j = 1; j < ar.length; j++) {
        const key = ar[j]
        let i = j - 1
        let left = 0;
        let right = i;
        while (right >= left) {
            const mid = (left + right) >> 1
            if (ar[mid] <= key && ar[mid + 1] >= key) {
                while (i > mid) {
                    ar[i + 1] = ar[i]
                    i = i - 1
                }
                ar[mid + 1] = key
                break
            }
            if (mid === 0) {
                if (ar[0] > key)
                    while (i >= 0) {
                        ar[i + 1] = ar[i]
                        i = i - 1
                    }
                ar[0] = key
                break
            }
            if (mid === i) {
                break
            }
            ar[mid] > key
                ? right = mid - 1
                : left  = mid + 1
        }
    }
}
// #endregion insertion_sort

function add(a, b) {
    const sum = new Array(b.length + 1)
    let c = 0;
    for (let j = b.length - 1; j >= 0; j--) {
        const s = a[j] + b[j] + c
        sum[j + 1] = s & 1
        c = s >> 1
    }
    sum[0] = c;
    return sum
}

// #region select_sort
function selectSort(ar) {
    let min;
    let minIndex;
    let cup;
    for (let i = 0; i < ar.length - 1; i++) {
        min = ar[i]
        for (let j = i + 1; j < ar.length; j++) {
            if (ar[j] < min) {
                min = ar[j]
                minIndex = j
            }
        }
        if (ar[i] > min) {
            cup = ar[i]
            ar[i] = min
            ar[minIndex] = cup
        }
    }

    return ar
}
// #endregion select_sort

// #region merge_sort
function merge(ar, p, q, r) {
    const left = [].concat(ar.slice(p, q + 1), Infinity)
    const right = [].concat(ar.slice(q + 1, r + 1), Infinity)
    let i = 0;
    let j = 0;
    for (let k = p; k <= r; k++) {
        ar[k] =
            left[i] <= right[j]
                ? left[i++]
                : right[j++]
    }
}

function doMergeSort(ar, p, r) {
    if (p < r) {
        const q = (p + r) >> 1
        doMergeSort(ar, p, q)
        doMergeSort(ar, q + 1, r)
        merge(ar, p, q, r)
    }
}

function mergeSort(ar) {
    doMergeSort(ar, 0, ar.length - 1)
}
// #endregion merge_sort

function findSum(ar, x) {
    if (ar.length < 2) return false
    mergeSort(ar)
    let i = 0
    let j = ar.length - 1
    while (j > i) {
        if (ar[j] > x) {
            j--
            continue
        }
        if (ar[i] + ar[j] === x) return true
        ar[i] + ar[j] > x
            ? j--
            : i++
    }
    return false
}

// #region heap_sort
function left(i) {
    return i << 1
}

function right(i) {
    return (i << 1) + 1
}

function parent(i) {
    return (i >> 1)
}

function max_heapify(ar, i) {
    const l = left(i)
    const r = right(i)
    console.log(i, l, r)
    let largest = i
    if (l <= ar.heap_size && ar[l] > ar[i]) {
        largest = l
    } else {
        largest = i
    }
    if (r <= ar.heap_size && ar[r] > ar[largest]) {
        largest = r
    }
    if (largest !== i) {
        [ar[i], ar[largest]] = [ar[largest], ar[i]]
        max_heapify(ar, largest)
    }
}

function build_max_heap(ar) {
    ar.heap_size = (ar.length - 1)
    for (let i = (ar.length - 1) >> 1; i >= 0; i--) {
        max_heapify(ar, i)
    }
    console.log(ar)
    for (let i = (ar.length - 1); i >= 1; i--) {
        [ar[0], ar[i]] = [ar[i], ar[0]]
        ar.heap_size = ar.heap_size - 1
        max_heapify(ar, 0)
    }
}

// #endregion heap_sort

const test = getAr(10)
console.log(test)
build_max_heap(test)
console.log(test)
function getAr(n = 100) {
    const ar = Array(n)
    for (let i = 0; i < n; i++) {
        ar[i] = ((Math.random() * n) | 0)
    }
    return ar
}




