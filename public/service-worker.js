self.addEventListener("install", (event) => {
    console.log("event - >:", event);
    console.log("Service worker installing...");
    // Here, you'll later add code for actions like caching assets.

    event.waitUntil(
        caches
            .open("store")
            .then(function (cache) {
                console.log("Opened cache");
                return cache.addAll([
                    "/",
                    "/assets/*.js",
                    "/assets/*.css",
                    "/index.html",
                    "/manifest.json",
                    "/service-worker.js",
                    "/vite.svg",
                    "/images/*.png",
                    //    './images/homescreen144.png',
                    //    './images/homescreen168.png',
                    //    './images/homescreen48.png',
                    //    './images/homescreen72.png',
                    //    './images/homescreen96.png',
                ]);
            })
            .catch(function (error) {
                console.error("Cache failed:", error);
            })
    );
});
