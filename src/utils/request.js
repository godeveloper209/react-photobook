import qs from 'qs';

const request = ({url, params, file, headers, method='GET', type='json'}) => {
    return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        let token = window.localStorage.getItem("token");
        let full_url = type==="form" ? `${url}${params ? '?' : ''}${qs.stringify(params)}` : url;
        request.open(method,  full_url, true);


        //Required headers
        request.setRequestHeader("Accept","application/json");
        request.setRequestHeader("Content-Type","application/json");
        request.setRequestHeader("token", token);

        // //if file exists (put upload blob)
        // if(file){
        //   request.setRequestHeader('content-type', file.type)
        // }


        if(Array.isArray(headers)){
            headers.map(([key,value]) => request.setRequestHeader(key, value) )

        }

        // const log = console.log
        // request.addEventListener("readystatechange", function() { log(request, "readystatechange") });
        // request.addEventListener("loadstart", function(ev) { log(request, "loadstart", ev.loaded + " of " + ev.total) });
        // request.addEventListener("progress", function(ev) { log(request, "progress", ev.loaded + " of " + ev.total) });
        // request.addEventListener("abort", function() { log(request, "abort") });
        // request.addEventListener("error", function() { log(request, "error") });
        // request.addEventListener("load", function() { log(request, "load") });
        // request.addEventListener("timeout", function(ev) { log(request, "timeout", ev.loaded + " of " + ev.total) });
        // request.addEventListener("loadend", function(ev) { log(request, "loadend", ev.loaded + " of " + ev.total) });
        request.onloadend = () => {
            resolve(request);
        };
        // request.onerror = () => {
        //   resolve(request);
        // };

        if(file){
            // const formData = new FormData();
            // formData.append(file.name, file);
            // request.send(formData)
            request.send(file)
        }else{
            request.send( type==='json' ? JSON.stringify(params) : "");
        }
    })
};
export default request;
