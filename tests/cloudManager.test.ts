import { checkIfFileExists, downloadSave, uploadGameSave_separate } from "../src/main/services/save.service"
import { homedir } from "os"
import { fetchCloudSaves } from "../src/main/services/save.service";
import { createCloudSaveSignedUrl } from "../src/renderer/services/download.service";
import { cloudSave } from "src/shared/types";
import { deleteCloudSave } from "../src/renderer/services/cloudSave.service";
import { findSteamPath } from "../src/main/services/steam.service";

// OM DU RUNNAR npm test. KOM IHÅG ATT VÅRA TESTS LADDAR NER EN FIL PÅ DIN DATOR.
// 



 const user = homedir();

 const testCloudSave: cloudSave = {
  appID: "550010",
  fileName: "output_log.txt",
  fileSize: "0.002",
  gameName: "Happy Room",
  index :  0,
  lastUpdated :  "2026-03-07T17:14:21+00:00",
  relativePath :  "Mana Potion Studios/Happy Room/output_log.txt",
  rootID :  "12",
  storagePath :  "596f1040-6f5d-456e-bfd9-3a66da53ec66/Happy Room/0/output_log.txt"
 }

 const expectedCloudSaveNames = ['output_log.txt']

test("A file shouldn't exist", async () => {
  const fileExists = await checkIfFileExists("C:\\Users\\jonat\\Programmering\\mammamaaaaaaa");
  expect(fileExists).toBe(false);
});

// This test assumes the user has a Downloads folder

test("A valid file path argument", async () => {
  
  const fileExists = await checkIfFileExists(`${user}\\Downloads`);
  expect(fileExists).toBe(true);
});

test("Get Jonatans games", async () => {
  const saveFetch = await fetchCloudSaves("596f1040-6f5d-456e-bfd9-3a66da53ec66");
  const cloudSavesFound = saveFetch.saves
  const saveNames = [];
  for (const saves of cloudSavesFound) {
    saveNames.push(saves.fileName)
  }
  expect(saveNames).toEqual(expectedCloudSaveNames);
});

// This test assumes the user has a Downloads folder

test("Download a txt file from our data base", async () => {
  const URL = await createCloudSaveSignedUrl(
                   "596f1040-6f5d-456e-bfd9-3a66da53ec66",
                   "Happy Room",
                   0,
                   testCloudSave
  );

  await downloadSave(URL, `${user}\\Downloads`)
  const fileExists = await checkIfFileExists(`${user}\\Downloads\\output_log.txt`);
  expect(fileExists).toBe(true);
});

test("Delete the cloudSave", async () => {
  await deleteCloudSave(
      "596f1040-6f5d-456e-bfd9-3a66da53ec66",
      "Happy Room",
      "550010",
      0,
      testCloudSave
  )
  const saveFetch = await fetchCloudSaves("596f1040-6f5d-456e-bfd9-3a66da53ec66");
  const cloudSavesFound = saveFetch.saves
  const saveNames = [];
  for (const saves of cloudSavesFound) {
    saveNames.push(saves.fileName)
  }
  const empty: cloudSave[] = [];
  expect(saveNames).toEqual(empty);
});

test("Upload a file from your computer", async () => {
  await uploadGameSave_separate(
    `${user}\\Documents\\output_log.txt`,
    "596f1040-6f5d-456e-bfd9-3a66da53ec66",
    "550010",
    "Happy Room",
    "output_log.txt",
    "Mana Potion Studios/Happy Room/output_log.txt",
    "12",
    0
  )
  const saveFetch = await fetchCloudSaves("596f1040-6f5d-456e-bfd9-3a66da53ec66");
  const cloudSavesFound = saveFetch.saves
  const saveNames = [];
  for (const saves of cloudSavesFound) {
    saveNames.push(saves.fileName)
  }
  const empty: cloudSave[] = [];
  expect(saveNames).toEqual(expectedCloudSaveNames);
});

// For the following test case to pass,
// the user has to have the app Steam installed.
// Otherwise the test will fail.
// For simplicity this is the only actual game detect test case.
test("Find Steam Path", async () => {
  const steamAnswer = await findSteamPath();
  expect(steamAnswer).toBeTruthy;
});