import StorageMenager from "./StorageMenager";
import ComunicationController from "./ComunicationController";
import User from './Class/User.js';
import VirtualObject from './Class/VirtualObject.js';

export default class Repository {

    constructor() {
        console.log("constructor di repository");
        this.storageMenager = new StorageMenager();
    }

    async getUser(uid, profileversion, sid, lat, lon) {
        
        try {
            const result = await this.storageMenager.getUser(uid, profileversion);
            if(result == "") {
                const result = await ComunicationController.getUser(sid, uid);
                this.storageMenager.insertUser(result.uid, result.name, result.picture, result.weapon, result.armor, result.amulet, result.life, result.experience, result.profileversion, result.positionshare, result.lat, result.lon);
                console.log("DA RETE User: ", uid);
                return new User(result.uid, result.name, result.weapon, result.armor, result.amulet, result.picture, result.life, result.experience, result.positionshare, result.profileversion, result.lat, result.lon);
            } 
            console.log("DA DB User: ", uid);
            if(lat == undefined || lon == undefined) {
                lat = result.lat;
                lon = result.lon;
            }
            return new User(result.uid, result.name, result.weapon, result.armor, result.amulet, result.picture, result.life, result.experience, result.positionshare, result.profileversion, lat, lon);
        } catch (error) {
            console.log(error);
        } 
    }

    async getObject(id, sid, lat, lon) {
        try {
            const result = await this.storageMenager.getObject(id);
            if(result == "") {
                const result = await ComunicationController.getObject(sid, id);
                this.storageMenager.insertObject(result.id, result.type, result.level, result.lat, result.lon, result.name, result.image);
                console.log("DA RETE Object: ", id);
                return new VirtualObject(result.id, result.type, result.level, result.lat, result.lon, result.name, result.image);
            }
            console.log("DA DB Object: ", id);
            if(lat == undefined || lon == undefined) {
                lat = result.lat;
                lon = result.lon;
            }
            return new VirtualObject(result.id, result.type, result.level, lat, lon, result.name, result.image);
        } catch (error) {
            console.log(error);
        }
    }
}
