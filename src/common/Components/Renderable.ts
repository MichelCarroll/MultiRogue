
import Component = require('./Component');

class Renderable extends Component {

    private token:string;
    private frontColor:string;
    private backColor:string;

    public setProperties(data:any) {
        this.token = data.token;
        this.frontColor = data.frontColor;
        this.backColor = data.backColor;
    }

    public getComponentKey():string {
        return 'Renderable';
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
            frontColor: this.frontColor,
            backColor: this.backColor
        };
    }

    public deserialize(data:any) {
        this.token = data.token;
        this.frontColor = data.frontColor;
        this.backColor = data.backColor;
    }
}

export = Renderable;