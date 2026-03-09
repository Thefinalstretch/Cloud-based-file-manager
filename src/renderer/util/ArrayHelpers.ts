 import type { cloudSave } from "src/shared/types";
 

 
 export function RemoveDuplicated (array: cloudSave[]): cloudSave[] { //Can probably be adapted to work with both cloudSave and gameData.
    const seenAppIDs = new Set<string>();

    return array.filter((game) => {
      if (seenAppIDs.has(game.appID)){
        return false;
      }
      else {
      seenAppIDs.add(game.appID);
      return true;
      }
    });
  }