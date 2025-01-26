import * as utils from './utils.js'
import * as build from './build.js'

const fetch_Interval = 5000

window.addEventListener('load', async () => {
    await init()

    // Mise à jour des éléments en fonction du scroll
    window.addEventListener('scroll', utils.debounce(async () => {
        console.log('test')
        const height = document.documentElement.scrollHeight
        const scrollPosition = window.innerHeight + window.scrollY
        if (scrollPosition >= height) {
            const load = document.createElement('button')
            load.style.position = 'fixed'
            load.style.bottom = '10px'
            load.style.left = '50%'
            load.style.transform = 'translateX(-50%)'
            load.style.padding = '10px 20px'
            load.style.fontSize = '16px'
            load.style.zIndex = '1000'
            load.setAttribute('aria-busy', 'true')
            load.textContent = 'Please wait…'
            const main = document.querySelector('main')
            main.appendChild(load)
            build.setCurrentMaxItems(build.currentMaxItems - build.item_per_page)
            await build.createPosts()
            load.remove()
        }
    }, 1000))

    // setInterval(update, fetch_Interval)
})

async function update() {

}

async function init() {
    await build.createPosts()
}
