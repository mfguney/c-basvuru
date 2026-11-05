/**
 * Adım animasyonu denetleyicisi.
 * Kullanım (Markdown içinde HTML):
 *
 * <div class="step-anim" data-step-anim>
 *   <p class="step-anim__title">Başlık</p>
 *   <div class="step-anim__viewport">
 *     <div class="step-anim__frame" data-caption="Açıklama 1">...</div>
 *     <div class="step-anim__frame" data-caption="Açıklama 2">...</div>
 *   </div>
 * </div>
 */
(function () {
  function buildControls(root, frames, captionEl) {
    const controls = document.createElement("div");
    controls.className = "step-anim__controls";

    const prev = document.createElement("button");
    prev.type = "button";
    prev.textContent = "← Önceki";

    const next = document.createElement("button");
    next.type = "button";
    next.textContent = "Sonraki →";

    const counter = document.createElement("span");
    counter.className = "step-anim__counter";

    const dots = document.createElement("div");
    dots.className = "step-anim__dots";

    let index = 0;

    function show(i) {
      index = Math.max(0, Math.min(i, frames.length - 1));
      frames.forEach((f, n) => {
        f.classList.toggle("is-active", n === index);
      });
      Array.from(dots.children).forEach((d, n) => {
        d.classList.toggle("is-active", n === index);
      });
      counter.textContent = "Adım " + (index + 1) + " / " + frames.length;
      captionEl.textContent = frames[index].getAttribute("data-caption") || "";
      prev.disabled = index === 0;
      next.disabled = index === frames.length - 1;
    }

    frames.forEach((_, n) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "step-anim__dot";
      dot.setAttribute("aria-label", "Adım " + (n + 1));
      dot.addEventListener("click", () => show(n));
      dots.appendChild(dot);
    });

    prev.addEventListener("click", () => show(index - 1));
    next.addEventListener("click", () => show(index + 1));

    controls.appendChild(prev);
    controls.appendChild(next);
    controls.appendChild(counter);
    controls.appendChild(dots);
    root.appendChild(controls);

    show(0);
  }

  function initOne(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    const frames = Array.from(root.querySelectorAll(".step-anim__frame"));
    if (frames.length === 0) return;

    let caption = root.querySelector(".step-anim__caption");
    if (!caption) {
      caption = document.createElement("p");
      caption.className = "step-anim__caption";
      const viewport = root.querySelector(".step-anim__viewport");
      if (viewport && viewport.parentNode) {
        viewport.parentNode.insertBefore(caption, viewport.nextSibling);
      } else {
        root.appendChild(caption);
      }
    }
    buildControls(root, frames, caption);
  }

  function initAll() {
    document.querySelectorAll("[data-step-anim]").forEach(initOne);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
