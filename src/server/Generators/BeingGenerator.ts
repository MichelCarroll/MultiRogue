

import Collidable = require('./../../common/Components/Collidable');
import Renderable = require('./../../common/Components/Renderable');
import Vector2D = require('./../../common/Vector2D');
import Container = require('./../../common/Components/Container');
import Playable = require('./../../common/Components/Playable');
import Health = require('./../../common/Components/Health');
import Allegiancable = require('./../../common/Components/Allegiancable');
import ZombieEffect = require('./../../common/Effect/ZombieEffect');
import DamageEffect = require('./../../common/Effect/DamageEffect');
import GameObject = require('./../../common/GameObject');

class BeingGenerator {

    public createRobot():GameObject {
        var being = this.createActor('Robot', '#888', 'robot');
        being.getCollidableComponent().setProperties({
            effect: new ZombieEffect(being)
        });
        return being;
    }

    public createPlayer():GameObject {
        var being = this.createActor('Player', '#FF0', 'player');
        being.getCollidableComponent().setProperties({
            effect: new DamageEffect(1, being)
        });
        return being;
    }

    private createActor(name:string, colorHex:string, allegianceName:string):GameObject {
        var being = new GameObject();
        var renderable = new Renderable();
        renderable.setProperties({
            'token': '@',
            'frontColor': colorHex,
            'backColor': '',
            'layer': Renderable.BEING_LAYER
        });
        var allegiance = new Allegiancable();
        allegiance.setProperties({name: allegianceName});
        var health = new Health();
        var maxHealth = 1;
        health.setProperties({ maxHp: maxHealth, currentHp: maxHealth })
        being.addComponent(health);
        being.addComponent(renderable);
        being.addComponent(allegiance);
        being.addComponent(new Collidable());
        being.addComponent(new Container());
        being.addComponent(new Playable());
        being.setPosition(new Vector2D(0,0));
        being.setDescription('a player character');
        being.setName(name);
        return being;
    }

}

export = BeingGenerator;