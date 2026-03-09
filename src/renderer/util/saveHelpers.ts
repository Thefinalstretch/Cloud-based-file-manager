 import type { cloudSave } from "src/shared/types";
 

 
 export function removeDuplicated (array: cloudSave[]): cloudSave[] { //Can probably be adapted to work with both cloudSave and gameData.
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

export function removeEnd(directory: string): string {
  // Förväntare fullynormalized directories
  const sliced = directory.split("\\");
  console.log("before pop",sliced);
  sliced.pop();
  console.log("we are doing sth with slice gangalicious", sliced);
  const remadePath = sliced.join("\\")
  console.log(`Remade path for matching: ${remadePath}`);

  return remadePath;
  }