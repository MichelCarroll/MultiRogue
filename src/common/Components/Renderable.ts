
import Component = require('../Component');

class Renderable extends Component {

    static FLOOR_LAYER = 10;
    static ITEM_LAYER = 20;
    static BEING_LAYER = 30;
    static WALL_LAYER = 40;

    private token:string;
    private frontColor:string;
    private backColor:string;
    private layer:number;

    public setProperties(data:any) {
        this.token = data.token;
        this.frontColor = data.frontColor;
        this.backColor = data.backColor;
        this.layer = data.layer;
    }

    public getComponentKey():string {
        return 'Renderable';
    }

    public getLayer():number {
        return this.layer;
    }

    public getToken():string {
        return this.token;
    }

    public getFrontColorHex():string {
        return this.frontColor;
    }

    public getBackColorHex():string {
        return this.backColor;
    }

    public serialize():any {
        return {
            token: this.token,
            layer: this.layer,
            frontColor: this.frontColor,
            backColor: this.backColor
        };
    }

    public deserialize(data:any) {
        this.token = data.token;
        this.layer = data.layer;
        this.frontColor = data.frontColor;
        this.backColor = data.backColor;
    }
}

export = Renderable;