class APIManagerClass {
    callServer = (method, path, payload, async) => {
        return new Promise(function (fnResolve, fnReject) {

            if (async !== false)
                async = true;

            if (payload === undefined)
                payload = {};

            if (method === undefined)
                method = "GET";

            let fetchData = {
                method: method,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            if (method !== "GET" && method !== "DELETE") {
                fetchData.body = JSON.stringify(payload);
            }

            if (!!localStorage.getItem('token')) {
                fetchData.headers = {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
            //const oUrl = 'http://localhost:8000';
            const oUrl = 'https://localhost:44371';
            fetch(`${oUrl}${path}`, fetchData)
                .then(res => res.json())
                .then(function (oResponse) {
                    fnResolve(oResponse);
                })
                .catch(function (err) {
                    fnReject(err);
                });

        });


    };
}

const APIManager = new APIManagerClass();
export default APIManager;
