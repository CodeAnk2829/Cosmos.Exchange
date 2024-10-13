export const checkEqualForDecreasing = (arr: [string, string][], target: [string, string]) => {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        const mid = Math.floor((high + low) / 2);
        if (parseFloat(arr[mid][0]) === parseFloat(target[0])) {
            arr[mid][1] = target[1];
            return true;
        }
        if (parseFloat(arr[mid][0]) < parseFloat(target[0])) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return false;
}

export const checkEqualForIncreasing = (arr: [string, string][], target: [string, string]) => {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        const mid = Math.floor((high + low) / 2);
        if (parseFloat(arr[mid][0]) === parseFloat(target[0])) {
            arr[mid][1] = target[1];
            return true;
        }
        if (parseFloat(arr[mid][0]) > parseFloat(target[0])) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return false;
}
