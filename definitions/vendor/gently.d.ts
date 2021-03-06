// Usage: In typescript you must use seperate statements for importing and creating the class:
// import Gently = require('gently');
// var gently: Gently = new Gently();


declare module "gently" {
    export = Gently;
    
    class Gently {
		constructor();
        hijacked: any[];

        expect(obj: any, method: string, stubFn?: (...args: any[]) => any): (...args: any[]) => any;
        expect(obj: any, method: string, count: number, stubFn: (...args: any[]) => any): (...args: any[]) => any;
        
        restore(obj: any, method: string): void;

        hijack(realRequire: (id: string) => any): (id: string) => any;

        stub(location: string, exportsName?: string): any;

        verify(msg?: string): void;
    }
}