
/**
 * load a js script by dynamically adding a script tag.
 * @param scriptName
 * @return {Promise} when the script is loaded or failed to load
 */
function loadScript(scriptName) {
    return new Promise(
        function(resolve, reject) {
            const head= document.getElementsByTagName('head')[0];
            const script= document.createElement('script');
            script.type= 'text/javascript';
            script.charset= 'utf-8';
            script.src= scriptName;
            head.appendChild(script);
            script.onload= (ev) => resolve(ev);
            script.onerror= (ev) => reject(ev);
        });
}


const FIREFLY_SCRIPT= 'firefly_loader.js';


export const firefly= {initialized: false};

/**
 *
 * @param {string} url the URL of the firefly API
 * @param {boolean} loadNow retrieve the API immediately
 * @return {initFirefly~getFireflyAPI} a function to call that will return a promise with the FireflyAPI
 */
export function initFirefly(url, loadNow= true) {
    const loadErrorMsg= `Load Failed: could not load Firefly from ${url}`;
    let fireflyLoadAttempted= false;
    let loadedFireflyFailed= false;
    let waitingPromiseActions= [];


    const callPromiseReject= () => waitingPromiseActions.forEach( (a) => a.reject(Error(loadErrorMsg)));
    const clearPromiseList= () => waitingPromiseActions= [];


    window.onFireflyLoaded= function (ff) {
        Object.assign(firefly,ff);
        if (firefly.initialized) {
            waitingPromiseActions.forEach((a) => a.resolve(firefly));
        } else {
            console.error(`Firefly object is not available after ${script} is loaded`);
            loadedFireflyFailed= true;
            callPromiseReject();
        }
        clearPromiseList();
    };

    /**
     * @function
     * return a promise with the firefly API
     * @return {Promise.<Firefly>} the firefly api object
     */
    const getFireflyAPI= () => {
        if (firefly.initialized || loadedFireflyFailed) {
            return firefly.initialized ? Promise.resolve(firefly) : Promise.reject(Error(loadErrorMsg));
        }

        const script= `${url}/${FIREFLY_SCRIPT}`;
        if (!fireflyLoadAttempted) {
            fireflyLoadAttempted= true;
            loadScript(script)
                .catch( () => {
                    loadedFireflyFailed= true;
                    callPromiseReject();
                    clearPromiseList();
                });
        }
        return new Promise( function(resolve, reject) {
            waitingPromiseActions.push({resolve,reject});
        });
    };
    if (loadNow) getFireflyAPI();
    return getFireflyAPI;
}
