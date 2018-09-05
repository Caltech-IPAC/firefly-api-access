# Firefly API accessible via NPM module

Firefly is IPAC's Advanced Astronomy WEB UI Framework. This repository provides NPM module to load the Firefly API

 
See [firefly Respoitory on Github](https://github.com/Caltech-IPAC/firefly)


Example - retrieve the firefly API:

```js
   import {initFirefly} from 'firefly-api-access'; 

   const url= 'http://localhost:8080/firefly';
   const getFireflyAPI= initFirefly(url); // return a function that can retrieve the Firelfy API
 
   getFireflyAPI().then( (firefly) => { // call the function to retrieve API, return a promise with Firefly
              firefly.getViewer().plotURL('http://web.ipac.caltech.edu/staff/roby/demo/wise-m51-band2.fits');
       }); 
```
