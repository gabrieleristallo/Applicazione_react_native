export default class VirtualObject {
    constructor(id, type, level, lat, lon, name, image) {
        this.id = id;
        this.type = type;
        this.level = level;
        this.name = name;
        this.image = image;
        this.lat = lat;
        this.lon = lon;
    }
}