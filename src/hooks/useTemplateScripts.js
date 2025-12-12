import { useEffect } from 'react';

const SCRIPT_MANIFEST = [
    { id: 'jquery', src: 'assets/js/jquery.js' },
    { id: 'bootstrap', src: 'assets/js/bootstrap.bundle.min.js' },
    { id: 'slick', src: 'assets/js/slick.min.js' },
    { id: 'magnific', src: 'assets/js/magnific-popup.js' },
    { id: 'purecounter', src: 'assets/js/purecounter.js' },
    { id: 'wow', src: 'assets/js/wow.js' },
    { id: 'nice-select', src: 'assets/js/nice-select.js' },
    { id: 'range-slider', src: 'assets/js/range-slider.js' },
    { id: 'swiper', src: 'assets/js/swiper-bundle.js' },
    { id: 'isotope', src: 'assets/js/isotope-pkgd.js' },
    { id: 'imagesloaded', src: 'assets/js/imagesloaded-pkgd.js' },
    { id: 'main-tv', src: 'assets/js/main-tv.js' },
    { id: 'custom-gsap', src: 'assets/js/custom-gsap.js' },
    { id: 'slider', src: 'assets/js/slider.js' },
    { id: 'main', src: 'assets/js/main.js' },
];

const resolveSrc = (src) => {
    if (/^https?:\/\//.test(src)) {
        return src;
    }
    const base = process.env.PUBLIC_URL || '';
    return `${base.replace(/\/$/, '')}/${src}`.replace(/\/{2,}/g, '/');
};

const loadScript = ({ id, src }) => {
    const resolvedSrc = resolveSrc(src);
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[data-template-script="${id}"]`);
        if (existing) {
            if (existing.getAttribute('data-loaded') === 'true') {
                resolve();
            } else {
                existing.addEventListener('load', resolve);
                existing.addEventListener('error', reject);
            }
            return;
        }

        const script = document.createElement('script');
        script.src = resolvedSrc;
        script.async = false;
        script.defer = true;
        script.dataset.templateScript = id;
        script.onload = () => {
            script.dataset.loaded = 'true';
            resolve();
        };
        script.onerror = () => {
            reject(new Error(`Failed to load ${resolvedSrc}`));
        };
        document.body.appendChild(script);
    });
};

const useTemplateScripts = () => {
    useEffect(() => {
        let isCancelled = false;
        const queue = SCRIPT_MANIFEST.reduce(
            (chain, scriptData) =>
                chain.then(() => (!isCancelled ? loadScript(scriptData) : Promise.resolve())),
            Promise.resolve()
        );

        queue.catch((error) => {
            console.error(error);
        });

        return () => {
            isCancelled = true;
        };
    }, []);
};

export default useTemplateScripts;

