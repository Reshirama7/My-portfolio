const menuButton = document.querySelector(".menu-toggle");
const menu = document.getElementById("sidemenu");

function setMenuOpen(isOpen) {
    menu?.classList.toggle("is-open", isOpen);
    menuButton?.setAttribute("aria-expanded", String(isOpen));
    menuButton?.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

menuButton?.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMenuOpen(false);
    }
});

const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll("[data-panel]");

tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        const selectedTab = button.dataset.tab;

        tabButtons.forEach((tab) => {
            const isSelected = tab === button;
            tab.classList.toggle("is-active", isSelected);
            tab.setAttribute("aria-selected", String(isSelected));
            tab.tabIndex = isSelected ? 0 : -1;
        });

        tabPanels.forEach((panel) => {
            panel.hidden = panel.dataset.panel !== selectedTab;
        });
    });

    button.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
            return;
        }

        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (index + direction + tabButtons.length) % tabButtons.length;
        tabButtons[nextIndex].focus();
        tabButtons[nextIndex].click();
    });
});

const yearElement = document.getElementById("current-year");
if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
}

const scriptURL = "https://script.google.com/macros/s/AKfycbzNPUYJsQG8_-EvTkhafNDmTznlcytqsPaXuhsRSqR8oQsl4-cRmyzhihveWQqspYQgrA/exec";
const contactForm = document.forms.namedItem("submit-to-google-sheet");
const formStatus = document.getElementById("msg");

contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!formStatus) {
        return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (!(submitButton instanceof HTMLButtonElement)) {
        return;
    }

    submitButton.disabled = true;
    formStatus.classList.remove("is-error");
    formStatus.textContent = "Sending your message…";

    try {
        const response = await fetch(scriptURL, {
            method: "POST",
            body: new FormData(contactForm),
        });
        if (!response.ok) {
            throw new Error(`Message request failed with status ${response.status}`);
        }

        formStatus.textContent = "Thanks — your message has been sent.";
        contactForm.reset();
    } catch (error) {
        console.error("Unable to send contact form:", error);
        formStatus.classList.add("is-error");
        formStatus.textContent = "Your message could not be sent. Please try again or email me directly.";
    } finally {
        submitButton.disabled = false;
    }
});
