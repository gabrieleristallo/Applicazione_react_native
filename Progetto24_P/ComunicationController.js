

export default class ComunicationController {
    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/mostri/";
    static async genericRequest(endpoint, verb, queryParams, bodyParams) {
        const queryParamsFormatted = new URLSearchParams(queryParams).toString();
        const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;
        console.log("sending " + verb + " request to: " + url);
        let fatchData = {method: verb,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        };
        if (verb != 'GET') {
            fatchData.body = JSON.stringify(bodyParams);
        }
        let httpResponse = await fetch(url, fatchData);
        const status = httpResponse.status;
        if (status == 200) {
            let deserializedObject = await httpResponse.json();
            return deserializedObject;
        } else {
            //console.log(httpResponse);
            const message = await httpResponse.text();
            let error = new Error("Error message from the server. HTTP status: " + status + " " + message);
            throw error;
        }
    }

    static async register() {
        const endPoint = "users";
        const verb = 'POST';
        const queryParams = {};
        const bodyParams = {};
        return await ComunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async getRanking(sid) {
        const endPoint = "ranking";
        const verb = 'GET';
        const queryParams = {sid: sid};
        const bodyParams = {};
        return await ComunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async getUser(sid, uid) {
        const endPoint = "users/" + uid;
        const verb = 'GET';
        const queryParams = {sid: sid};
        const bodyParams = {};
        return await ComunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async getObject(sid, id) {
        if(id == null) return null;
        const endPoint = "objects/" + id;
        const verb = 'GET';
        const queryParams = {sid: sid};
        const bodyParams = {};
        return await ComunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async updateUser(sid, uid, name, picture, positionshare) {
        const endPoint = "users/" + uid;
        const verb = 'PATCH';
        const queryParams = {};
        const bodyParams = {sid: sid, name: name, picture: picture, positionshare: positionshare};
        return await ComunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async getNearUsers(sid, lat, lon) {
        const endPoint = "users";
        const verb = 'GET';
        const queryParams = {sid: sid, lat: lat, lon: lon};
        const bodyParams = {};
        return await ComunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async getNearObjects(sid, lat, lon) {
        const endPoint = "objects";
        const verb = 'GET';
        const queryParams = {sid: sid, lat: lat, lon: lon};
        const bodyParams = {};
        return await ComunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async activateObject(sid, id) {
        const endPoint = "objects/" + id + "/activate";
        const verb = 'POST';
        const queryParams = {};
        const bodyParams = {sid: sid};
        return await ComunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }
 }