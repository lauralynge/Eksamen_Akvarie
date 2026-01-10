document.addEventListener('DOMContentLoaded', function () {
    // Hent SVG fra sessionStorage
    var builtSVG = null;
    try { builtSVG = sessionStorage.getItem('builtFishSVG'); } catch(e) {}

    function smoothRedirect(url, fadeMs) {
        try {
            fadeMs = typeof fadeMs === 'number' ? fadeMs : 600;
            var f = document.createElement('div');
            f.style.position = 'fixed';
            f.style.left = '0';
            f.style.top = '0';
            f.style.width = '100%';
            f.style.height = '100%';
            f.style.background = '#000';
            f.style.opacity = '0';
            f.style.zIndex = '11000';
            f.style.transition = 'opacity ' + fadeMs + 'ms ease';
            document.body.appendChild(f);
            void f.offsetWidth;
            f.style.opacity = '1';
            setTimeout(function() { try { window.location.href = url; } catch(e) { window.location.href = url; } }, fadeMs);
        } catch(e) { try { window.location.href = url; } catch(_) {} }
    }

    function showFishSwimming(svgString) {
        if (!svgString) return;
        try { sessionStorage.removeItem('builtFishSVG'); } catch(e) {}

        // Opret container til fisken
        var fishContainer = document.createElement('div');
        fishContainer.style.position = 'fixed';
        fishContainer.style.left = '0';
        fishContainer.style.top = '40%';
        fishContainer.style.width = '100vw';
        fishContainer.style.height = '20vh';
        fishContainer.style.pointerEvents = 'none';
        fishContainer.style.zIndex = '10000';
        fishContainer.style.display = 'flex';
        fishContainer.style.alignItems = 'center';

        // Indsæt SVG
        var svgWrap = document.createElement('div');
        svgWrap.innerHTML = svgString;
        svgWrap.style.width = '18vmin';
        svgWrap.style.height = 'auto';
        svgWrap.style.display = 'block';
        svgWrap.style.position = 'absolute';
        svgWrap.style.left = '0';
        svgWrap.style.top = '0';

        var innerSvg = svgWrap.querySelector('svg');
        if (innerSvg) {
            innerSvg.style.width = "100%";
            innerSvg.style.height = "auto";
            innerSvg.style.display = "block";
            innerSvg.removeAttribute("width");
            innerSvg.removeAttribute("height");
        }

        fishContainer.appendChild(svgWrap);
        document.body.appendChild(fishContainer);

        // Animation: svøm fra venstre til højre og tilbage
        let direction = 1;
        let pos = 0;
        function swim() {
            pos += direction * 2; // hastighed
            if (pos > window.innerWidth - svgWrap.offsetWidth) {
                direction = -1;
            }
            if (pos < 0) {
                direction = 1;
            }
            // Vend kun selve SVG'en afhængigt af retning
            if (innerSvg) {
                innerSvg.style.transform = direction === 1 ? 'scaleX(-1)' : 'scaleX(1)';
                innerSvg.style.transformOrigin = '50% 50%';
            }
            svgWrap.style.left = pos + 'px';
            requestAnimationFrame(swim);
        }
        swim();

        // Timeout fjernet – fisken svømmer uendeligt
    }

    // Vis altid fisken, hvis der findes en SVG
    if (builtSVG) {
        showFishSwimming(builtSVG);
    }
    });