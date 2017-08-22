/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
//
// This will let you import json files as object with something like:
//    import * as data from './my-json-file.json';
declare module "*.json" {
  const value: any;
  export default value;
}