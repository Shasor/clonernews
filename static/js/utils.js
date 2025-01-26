export function timeToString(n) {
    const date = new Date(n * 1000),
        month = (date.getUTCMonth() + 1) < 10 ? `0${date.getUTCMonth() + 1}` : `${date.getUTCMonth() + 1}`,
        day = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : `${date.getUTCDate()}`,
        year = date.getUTCFullYear(),
        hour = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : `${date.getUTCHours()}`,
        min = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : `${date.getUTCMinutes()}`
    return `${year}/${month}/${day} at ${hour}:${min} UTC`
}

export function debounce(func, wait) {
    let timeout
    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            func(...args)
        }, wait)
    }
}