declare module ROT {

    export var DEFAULT_WIDTH:number;
    export var DEFAULT_HEIGHT:number;
    export var DIRS:Array<any>;
    export var VK_CANCEL:number;
    export var VK_HELP:number;
    export var VK_BACK_SPACE:number;
    export var VK_TAB:number;
    export var VK_CLEAR:number;
    export var VK_RETURN:number;
    export var VK_ENTER:number;
    export var VK_SHIFT:number;
    export var VK_CONTROL:number;
    export var VK_ALT:number;
    export var VK_PAUSE:number;
    export var VK_CAPS_LOCK:number;
    export var VK_ESCAPE:number;
    export var VK_SPACE:number;
    export var VK_PAGE_UP:number;
    export var VK_PAGE_DOWN:number;
    export var VK_END:number;
    export var VK_HOME:number;
    export var VK_LEFT:number;
    export var VK_UP:number;
    export var VK_RIGHT:number;
    export var VK_DOWN:number;
    export var VK_PRINTSCREEN:number;
    export var VK_INSERT:number;
    export var VK_DELETE:number;
    export var VK_0:number;
    export var VK_1:number;
    export var VK_2:number;
    export var VK_3:number;
    export var VK_4:number;
    export var VK_5:number;
    export var VK_6:number;
    export var VK_7:number;
    export var VK_8:number;
    export var VK_9:number;
    export var VK_COLON:number;
    export var VK_SEMICOLON:number;
    export var VK_LESS_THAN:number;
    export var VK_EQUALS:number;
    export var VK_GREATER_THAN:number;
    export var VK_QUESTION_MARK:number;
    export var VK_AT:number;
    export var VK_A:number;
    export var VK_B:number;
    export var VK_C:number;
    export var VK_D:number;
    export var VK_E:number;
    export var VK_F:number;
    export var VK_G:number;
    export var VK_H:number;
    export var VK_I:number;
    export var VK_J:number;
    export var VK_K:number;
    export var VK_L:number;
    export var VK_M:number;
    export var VK_N:number;
    export var VK_O:number;
    export var VK_P:number;
    export var VK_Q:number;
    export var VK_R:number;
    export var VK_S:number;
    export var VK_T:number;
    export var VK_U:number;
    export var VK_V:number;
    export var VK_W:number;
    export var VK_X:number;
    export var VK_Y:number;
    export var VK_Z:number;
    export var VK_CONTEXT_MENU:number;
    export var VK_NUMPAD0:number;
    export var VK_NUMPAD1:number;
    export var VK_NUMPAD2:number;
    export var VK_NUMPAD3:number;
    export var VK_NUMPAD4:number;
    export var VK_NUMPAD5:number;
    export var VK_NUMPAD6:number;
    export var VK_NUMPAD7:number;
    export var VK_NUMPAD8:number;
    export var VK_NUMPAD9:number;
    export var VK_MULTIPLY:number;
    export var VK_ADD:number;
    export var VK_SEPARATOR:number;
    export var VK_SUBTRACT:number;
    export var VK_DECIMAL:number;
    export var VK_DIVIDE:number;
    export var VK_F1:number;
    export var VK_F2:number;
    export var VK_F3:number;
    export var VK_F4:number;
    export var VK_F5:number;
    export var VK_F6:number;
    export var VK_F7:number;
    export var VK_F8:number;
    export var VK_F9:number;
    export var VK_F10:number;
    export var VK_F11:number;
    export var VK_F12:number;
    export var VK_F13:number;
    export var VK_F14:number;
    export var VK_F15:number;
    export var VK_F16:number;
    export var VK_F17:number;
    export var VK_F18:number;
    export var VK_F19:number;
    export var VK_F20:number;
    export var VK_F21:number;
    export var VK_F22:number;
    export var VK_F23:number;
    export var VK_F24:number;
    export var VK_NUM_LOCK:number;
    export var VK_SCROLL_LOCK:number;
    export var VK_CIRCUMFLEX:number;
    export var VK_EXCLAMATION:number;
    export var VK_DOUBLE_QUOTE:number;
    export var VK_HASH:number;
    export var VK_DOLLAR:number;
    export var VK_PERCENT:number;
    export var VK_AMPERSAND:number;
    export var VK_UNDERSCORE:number;
    export var VK_OPEN_PAREN:number;
    export var VK_CLOSE_PAREN:number;
    export var VK_ASTERISK:number;
    export var VK_PLUS:number;
    export var VK_PIPE:number;
    export var VK_HYPHEN_MINUS:number;
    export var VK_OPEN_CURLY_BRACKET:number;
    export var VK_CLOSE_CURLY_BRACKET:number;
    export var VK_TILDE:number;
    export var VK_COMMA:number;
    export var VK_PERIOD:number;
    export var VK_SLASH:number;
    export var VK_BACK_QUOTE:number;
    export var VK_OPEN_BRACKET:number;
    export var VK_BACK_SLASH:number;
    export var VK_CLOSE_BRACKET:number;
    export var VK_QUOTE:number;
    export var VK_META:number;
    export var VK_ALTGR:number;
    export var VK_WIN:number;
    export var VK_KANA:number;
    export var VK_HANGUL:number;
    export var VK_EISU:number;
    export var VK_JUNJA:number;
    export var VK_FINAL:number;
    export var VK_HANJA:number;
    export var VK_KANJI:number;
    export var VK_CONVERT:number;
    export var VK_NONCONVERT:number;
    export var VK_ACCEPT:number;
    export var VK_MODECHANGE:number;
    export var VK_SELECT:number;
    export var VK_PRINT:number;
    export var VK_EXECUTE:number;
    export var VK_SLEEP;

    interface IActor {
        act();
    }

    interface IFOV {
        compute(x: number, y: number, R: number, callback: (x: number, y: number, r: number) => void );
    }

    interface IMap {
        width: number;
        height: number;
        create(callback: (x: number, y: number, value: number) => void ): void;
        create();
    }

    interface INoise {
        get (x: number, y: number): number;
    }

    interface IPath {
        compute(fromX: number, fromY: number, callback: (x: number, y: number) => void);
    }

    export class Color {
        static add(color1: number[], color2: number[]): number[];
        static fromString(str: string): number[];
        static hsl2rgb(color: number[]): number[];
        static interpolate(color1: number[], color2: number[], factor: number): number[];
        static interpolateHSL(color1: number, color2: number, factor: number): number[];
        static multiply(color1: number[], color2: number[]): number[];
        static randomize(color: number[], diff: number[]): number[];
        static rgb2hsl(color: number[]): number;
        static toHex(color: number[]): string;
        static toRGB(color: number[]): string;
    }

    export class Display {
        constructor(options?: any);
        clear();
        computeFontSize(availWidth: number, availHeight: number);
        computeSize(availWidth: number, availHeight: number);
        DEBUG(x: number, y: number, what: number);
        draw(x: number, y: number, ch: string, fg?: string, bg?: string);
        drawText(x: number, y: number, text: string, maxWidth?: number): number;
        eventToPosition(e: Event): number[];
        getContainer(): HTMLElement;
        getOptions(): any;
        setOptions(options: any);
    }

    export class Engine {
        constructor(scheduler:ROT.Scheduler);
        start();
        lock();
        unlock();
    }

    export class Lighting {
        constructor(reflectivityCallback: (x: number, y: number) => void, options: any);
        compute(lightingCallback: (x: number, y: number, color: number) => void );
        reset();
        setFOV(fov: IFOV);
        setLight(x: number, y: number, color?: number[]);
        setLight(x: number, y: number, color?: string);
        setOptions(options: any);
    }

    export class RNG {
        static getNormal(mean: number, stddev: number): number;
        static staticgetPercentage(): number;
        static getSeed(): number;
        static getState();
        static getUniform(): number;
        static getWeightedValue(data: any): string;
        static setSeed(seed: number);
        static setState(state);
    }

    export class Scheduler {
        add(item: any, repeat?: boolean);
        clear();
        next(): any;
        remove(item: any);
    }

    export class StringGenerator {
        constructor(options: any);
        clear();
        generate(): string;
        getStats(): any;
        observe(str: string);
    }

    export class Text {
        static measure(str: string, maxWidth: number): number;
        static tokenize(str: string, maxWidth: number): Array<any>;
    }
}

declare module ROT.Scheduler {
    export class Simple extends ROT.Scheduler { }
    export class Speed extends ROT.Scheduler { }
    export class Action extends ROT.Scheduler { }
}

declare module ROT.FOV {
    export class DiscreteShadowcasting implements IFOV {
        compute(x: number, y: number, R: number, callback: (x: number, y: number, r: number) => void );
        constructor(lightPassesCallback: Function, options?: any);
    }

    export class PreciseShadowcasting implements IFOV {
        compute(x: number, y: number, R: number, callback: (x: number, y: number, r: number, visibility: number) => void );
        constructor(lightPassesCallback: Function, options?: any);
    }
}

declare module ROT.Map {
    interface IFeature {
        create();
        create(digCallback: Function);
        //static createRandomAt(x: number, y: number, dx: number, dy: number, options: any);
        debug(): void;
        isValid(canBeDugCallback: Function): void;
    }

    export class Dungeon implements IMap {
        width: number;
        height: number;
        constructor();
        constructor(width?: number, height?: number);
        create();
        create(callback: Function): void;
        getRooms(): ROT.Map.Feature.Room[];
        getCorridors(): ROT.Map.Feature.Corridor[];
    }

    export class Arena extends Dungeon implements IMap {
        constructor(width: number, height: number);
    }

    export class Cellular extends Dungeon implements IMap {
        constructor(width: number, height: number, options?: any);
        randomize(probability: number);
        set(x: number, y: number, value: number);
    }

    export class Digger extends Dungeon implements IMap {
        constructor(width: number, height: number, options?: any);
    }

    export class DividedMaze extends Dungeon implements IMap {
        constructor(width: number, height: number);
    }

    export class EllerMaze extends Dungeon implements IMap {
        constructor(width: number, height: number);
    }

    export class IceyMaze extends Dungeon implements IMap {
        constructor(width: number, height: number, regularity: number);
    }

    export class Rogue extends Dungeon implements IMap {
        constructor(width: number, height: number, options?: any);
    }

    export class Uniform extends Dungeon implements IMap {
        constructor(width: number, height: number, options?: any);
    }

}

declare module ROT.Map.Feature {
    export class Corridor implements IFeature {
        create();
        create(digCallback: Function);
        debug(): void;
        isValid(canBeDugCallback: Function): void;
        static createRandomAt(x: number, y: number, dx: number, dy: number, options: any);
        constructor(startX: number, startY: number, endX: number, endY: number);
        createPriorityWalls(priorityWallCallback: Function);
    }

    export class Room implements IFeature {
        create();
        create(digCallback: Function);
        debug(): void;
        isValid(canBeDugCallback: Function): void;
        static createRandomAt(x: number, y: number, dx: number, dy: number, options: any);
        constructor(x1: number, y1: number, x2: number, y2: number, doorX: number, doorY: number);
        addDoor(x: number, y: number);
        clearDoors();
        static createRandom(availWidth: number, availHeight: number, options: any);
        static createRandomCenter(cx: number, cy: number, options: any);
        getBottom();
        getCenter();
        getDoors();
        getLeft();
        getRight();
        getTop();
        isValid(isWallCallback: Function, canBeDugCallback: Function);
    }
}

declare module ROT.Noise {
    export class Simplex {
        constructor(gradients?: number);
        get (xin: number, yin: number): number;
    }
}

declare module ROT.Path {
    export class AStar implements IPath {
        constructor(toX: number, toY: number, passableCallback: (x: number, y: number) => void , options: any);
        compute(fromX: number, fromY: number, callback: (x: number, y: number) => void);
    }

    export class Dijkstra implements IPath {
        constructor(toX: number, toY: number, passableCallback: (x: number, y: number) => void , options: any);
        compute(fromX: number, fromY: number, callback: (x: number, y: number) => void );
    }
}