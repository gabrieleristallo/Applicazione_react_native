export default class User {
    constructor(uid, name, weapon, armor, amulet, picture, life, experience, positionshare, profileversion, lat, lon) {
        this.uid = uid;
        this.name = name;
        this.picture = picture;
        this.life = life;
        this.experience = experience;
        this.positionshare = positionshare;
        this.profileversion = profileversion;
        this.weapon = weapon;
        this.armor = armor;
        this.mulet = amulet;
        this.lat =lat;
        this.lon = lon;
    }
}