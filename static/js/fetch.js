// API URLs
const BASE_API_URL = "https://hacker-news.firebaseio.com/v0/",
    MAX_ITEM_URL = `${BASE_API_URL}maxitem.json`

export async function getMaxItemID() {
    return await fetchAsync(MAX_ITEM_URL)
}

export async function getItem(itemID) {
    return await fetchAsync(`${BASE_API_URL}item/${itemID}.json`)
}

export async function getItems(IDs) {
    const promises = []
    for (let i = 0; i < IDs.length; i++) {
        promises.push(getItem(IDs[i]))
    }
    return await Promise.all(promises)
}

// get data from the given URL
async function fetchAsync(url) {
    const response = await fetch(url),
        data = await response.json()
    return data
}