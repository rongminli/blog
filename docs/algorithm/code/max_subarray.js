function getAr(n = 5) {
    const ar = Array(n)
    for (let i = 0; i < n; i++) {
        ar[i] = ((Math.random() * n) | 0) - (n >> 1)
    }
    return ar
}

let n = 5
let ar;
while (true) {
    ar = getAr(n)
    let t1 = 0;
    let t2 = 0;
    let time = Date.now()
    find_maximum_subarray(ar)
    t1 = Date.now() - time
    time = Date.now()
    do_find_maximum_subarray_line(ar)
    t2 = Date.now() - time
    if (t1 < t2) {
        console.log(n)
        break
    }
    n++
}

// #region max_subarray
function do_find_max_crossing_subarray(ar, low, mid, high) {
    let left_sum = -Infinity
    let sum = 0
    let max_right
    let max_left
    for (let i = mid; i >= low; i--) {
        sum += ar[i]
        if (sum > left_sum) {
            left_sum = sum
            max_left = i
        }
    }
    right_sum = -Infinity
    sum = 0
    for (let j = mid + 1; j <= high; j++) {
        sum += ar[j]
        if (sum > right_sum) {
            right_sum = sum
            max_right = j
        }
    }
    return [max_left, max_right, left_sum + right_sum]
}

function do_find_maximum_subarray(ar, low, high) {
    if (high === low) return [low, high, ar[low]]
    else {
        const mid = (low + high) >> 1
        const [left_low, left_hight, left_sum] = do_find_maximum_subarray(ar, low, mid)
        const [right_low, right_high, right_sum] = do_find_maximum_subarray(ar, mid + 1, high)
        const [cross_low, cross_high, cross_sum] = do_find_max_crossing_subarray(ar, low, mid, high)
        if (left_sum >= right_sum && left_sum >= cross_sum)
            return [left_low, left_hight, left_sum]
        else if (right_sum >= left_sum && right_sum >= cross_sum)
            return [right_low, right_high, right_sum]
        else
            return [cross_low, cross_high, cross_sum]
    }
}

function do_find_maximum_subarray_line(ar) {
    const n = ar.length
    let max_sum = -Infinity
    let low = 0
    let high = 0

    let sum = -Infinity
    let currentLow = 0
    let currentHigh = 0
    for (let j = 0; j < n; j++) {
        currentHigh = j
        if (sum <= 0) {
            sum = ar[j]
            currentLow = j
        } else {
            sum += ar[j]
        }
        if (sum > max_sum) {
            max_sum = sum
            low = currentLow
            high = currentHigh
        }
    }
    return [low, high, max_sum]
}
function find_maximum_subarray(ar) {
    return ar.length > 100
        ? do_find_maximum_subarray(ar, 0, ar.length - 1)
        : do_find_maximum_subarray_line(ar)
}
// #endregion max_subarray