// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import {hooks as colocatedHooks} from "phoenix-colocated/portfolio"
import topbar from "../vendor/topbar"

// ─────────────────────────────────────────────
// Portfolio Animations Hook
// ─────────────────────────────────────────────
const PortfolioAnimations = {
  mounted() {
    // ── 1. Scroll-progress bar ──────────────────
    const progressBar = document.getElementById("progress-bar")
    const updateProgress = () => {
      const scrollTop  = window.scrollY
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight
      const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      if (progressBar) progressBar.style.width = pct + "%"
    }
    window.addEventListener("scroll", updateProgress, { passive: true })

    // ── 2. Navbar scroll shadow ─────────────────
    const navbar = document.getElementById("navbar")
    const updateNavbar = () => {
      if (!navbar) return
      if (window.scrollY > 50) {
        navbar.style.background = "oklch(12% 0.01 252 / 0.97)"
      } else {
        navbar.style.background = "oklch(12% 0.01 252 / 0.85)"
      }
    }
    window.addEventListener("scroll", updateNavbar, { passive: true })

    // ── 3. Mobile menu toggle ───────────────────
    const toggle    = document.getElementById("mobile-toggle")
    const menu      = document.getElementById("mobile-menu")
    const iconOpen  = document.getElementById("icon-open")
    const iconClose = document.getElementById("icon-close")

    const openMenu = () => {
      menu.classList.remove("hidden")
      iconOpen.classList.add("hidden")
      iconClose.classList.remove("hidden")
      toggle.setAttribute("aria-expanded", "true")
    }
    const closeMenu = () => {
      menu.classList.add("hidden")
      iconOpen.classList.remove("hidden")
      iconClose.classList.add("hidden")
      toggle.setAttribute("aria-expanded", "false")
    }

    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        menu.classList.contains("hidden") ? openMenu() : closeMenu()
      })
      // close when a nav link is tapped
      menu.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", closeMenu)
      })
      // close if window is resized to desktop width
      window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) closeMenu()
      }, { passive: true })
    }

    // ── 4. Scroll-reveal (IntersectionObserver) ─
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    )

    document.querySelectorAll(".reveal-up").forEach(el => {
      revealObserver.observe(el)
    })

    // ── 5. Skill bar animation ──────────────────
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const bar = entry.target
            // small delay so CSS transition fires after layout
            requestAnimationFrame(() => {
              bar.classList.add("animated")
            })
            skillObserver.unobserve(bar)
          }
        })
      },
      { threshold: 0.4 }
    )

    document.querySelectorAll(".skill-bar").forEach(bar => {
      skillObserver.observe(bar)
    })

    // ── 6. Smooth anchor scrolling ──────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href")
        if (href === "#") return
        const target = document.querySelector(href)
        if (target) {
          e.preventDefault()
          target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      })
    })

    // ── 7. Scroll-top shortcut ──────────────────
    window.addEventListener("scroll-top", () => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    })

    // ── Cleanup ─────────────────────────────────
    this._cleanup = () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("scroll", updateNavbar)
    }
  },

  destroyed() {
    if (this._cleanup) this._cleanup()
  }
}

// ─────────────────────────────────────────────
// LiveSocket setup
// ─────────────────────────────────────────────
const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
const liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: { _csrf_token: csrfToken },
  hooks: {
    ...colocatedHooks,
    PortfolioAnimations,
  },
})

// Show progress bar on live navigation and form submits
topbar.config({ barColors: { 0: "#f97316" }, shadowColor: "rgba(0, 0, 0, .3)" })
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop",  _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

// Development helpers
if (process.env.NODE_ENV === "development") {
  window.addEventListener("phx:live_reload:attached", ({detail: reloader}) => {
    reloader.enableServerLogs()

    let keyDown
    window.addEventListener("keydown", e => keyDown = e.key)
    window.addEventListener("keyup",   _e => keyDown = null)
    window.addEventListener("click",   e => {
      if (keyDown === "c") {
        e.preventDefault()
        e.stopImmediatePropagation()
        reloader.openEditorAtCaller(e.target)
      } else if (keyDown === "d") {
        e.preventDefault()
        e.stopImmediatePropagation()
        reloader.openEditorAtDef(e.target)
      }
    }, true)

    window.liveReloader = reloader
  })
}