import * as fetch from './fetch.js'
import * as utils from './utils.js'

export const item_per_page = 10

export let currentMaxItems

// Logique de création des 10 premiers posts en fonction du MaxItemID
export async function createPosts() {
    const validItems = []
    let scopedItemsID
    if (!currentMaxItems) currentMaxItems = await fetch.getMaxItemID()
    while (validItems.length < item_per_page) {
        scopedItemsID = Array.from({ length: item_per_page }, (_, i) => currentMaxItems - i)
        const items = await fetch.getItems(scopedItemsID)
        for (const item of items) {
            if (item && item.type !== 'comment' && !item.dead && !item.deleted && validItems.length < item_per_page) {
                await createPost(item)
                validItems.push(item.id)
            }
        }
        currentMaxItems -= items.length
    }
    console.log("OK") // debug
}

// Créer 1 post et l'ajoute au main
export async function createPost(data) {
    const item = document.createElement('article')
    item.classList.add('item')

    // Créer le titre (avec ou sans lien)
    const title = data.url
        ? Object.assign(document.createElement('a'), { href: data.url, target: '_blank' })
        : document.createElement('div')
    title.innerHTML = `<h2>${data.title}</h2>`
    item.appendChild(title)

    if (data.by) {
        const by = document.createElement('h6')
        by.innerHTML = `Post author: ${data.by}`
        item.appendChild(by)
    }

    const type = document.createElement('h6')
    type.innerHTML = `Post type: ${data.type}`
    item.appendChild(type)

    // Création grid
    const grid = document.createElement('div')
    grid.classList.add('grid')
    grid.innerHTML = `
    <div><span>${utils.timeToString(data.time)}</span></div>
        <div></div>
        <div></div>
    `

    // Gestion des commentaires
    if (data.kids) {
        const showComment = document.createElement('h5')
        showComment.innerHTML = `Show Comments (${data.kids.length})`
        grid.appendChild(showComment)
        let comments
        showComment.addEventListener('click', async () => {
            if (!showComment.classList.contains('opened')) {
                showComment.classList.add('opened')
                showComment.innerText = 'Hide Comments'
                const hr = document.createElement('hr')
                hr.classList.add('comment')
                item.appendChild(hr)
                if (!comments) {
                    const promises = data.kids.map(id => {
                        return createComment(id)
                    })
                    comments = await Promise.all(promises)
                }
                for (const comment of comments) {
                    if (comment) {
                        item.appendChild(comment)
                    }
                }
            } else {
                showComment.classList.remove('opened')
                showComment.innerText = `Show Comments (${data.kids.length})`
                const comments = item.querySelectorAll('.comment')
                for (const comment of comments) {
                    comment.remove()
                }
            }
        })
    }
    item.appendChild(grid)

    const main = document.querySelector('main')
    main.appendChild(item)
}

async function createComment(commentID) {
    let data = null
    while (data === null) {
        data = await fetch.getItem(commentID)
    }

    let item = document.createElement("article")
    item.classList.add("comment")

    const by = document.createElement("h6")
    by.innerHTML = `Comment author: ${data.by}`
    item.appendChild(by)

    const text = document.createElement("p")
    text.innerHTML = data.text
    item.appendChild(text)

    // Création grid
    const grid = document.createElement('div')
    grid.classList.add('grid')
    grid.innerHTML = `
        <div><span>${utils.timeToString(data.time)}</span></div>
            <div></div>
            <div></div>
        `

    if (!data.kids) return item

    const showComment = document.createElement('h5')
    showComment.innerHTML = `Show Comments (${data.kids.length})`
    grid.appendChild(showComment)
    let comments
    showComment.addEventListener("click", async () => {
        if (!showComment.classList.contains("opened")) {
            showComment.classList.add("opened")
            showComment.innerText = "Hide comments"
            if (!comments) {
                const promises = data.kids.map(id => {
                    return createComment(id, true)
                })
                comments = await Promise.all(promises)
            }
            for (const comment of comments) {
                item.appendChild(comment)
            }
        } else {
            showComment.classList.remove("opened")
            showComment.innerText = `Show comments (${data.kids.length})`
            const comments = item.querySelectorAll('.comment')
            for (const comment of comments) {
                comment.remove()
            }
        }
    })
    item.appendChild(grid)
    return item
}

export function setCurrentMaxItems(x) {
    currentMaxItems = x
}