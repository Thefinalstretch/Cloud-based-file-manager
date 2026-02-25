# Diff Details

Date : 2026-02-24 20:06:06

Directory c:\\Dev\\VScode\\CloudBasedManager-Stable

Total : 66 files,  1238 codes, 95 comments, 92 blanks, all 1425 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.eslintrc.json](/.eslintrc.json) | JSON with Comments | 16 | 0 | 1 | 17 |
| [README.md](/README.md) | Markdown | 3 | 0 | 0 | 3 |
| [forge.config.ts](/forge.config.ts) | TypeScript | 52 | 5 | 3 | 60 |
| [forge.env.d.ts](/forge.env.d.ts) | TypeScript | 0 | 1 | 1 | 2 |
| [index.html](/index.html) | pyscript | 11 | 0 | 2 | 13 |
| [package-lock.json](/package-lock.json) | JSON | 12,838 | 0 | 1 | 12,839 |
| [package.json](/package.json) | JSON | 57 | 0 | 1 | 58 |
| [postcss.config.js](/postcss.config.js) | JavaScript | 6 | 0 | 1 | 7 |
| [src/Main/LocalDirectory\_finder.ts](/src/Main/LocalDirectory_finder.ts) | TypeScript | 312 | 33 | 43 | 388 |
| [src/Main/XBOXGameFinder.ts](/src/Main/XBOXGameFinder.ts) | TypeScript | 60 | 0 | 11 | 71 |
| [src/Main/main.ts](/src/Main/main.ts) | TypeScript | 93 | 18 | 17 | 128 |
| [src/Main/save-handler.ts](/src/Main/save-handler.ts) | TypeScript | 65 | 17 | 20 | 102 |
| [src/Main/supabase-admin.ts](/src/Main/supabase-admin.ts) | TypeScript | 0 | 7 | 4 | 11 |
| [src/components/App.tsx](/src/components/App.tsx) | TypeScript JSX | 30 | 1 | 2 | 33 |
| [src/components/DownloadGameSave.tsx](/src/components/DownloadGameSave.tsx) | TypeScript JSX | 12 | 0 | 3 | 15 |
| [src/components/GameIcon.tsx](/src/components/GameIcon.tsx) | TypeScript JSX | 26 | 22 | 4 | 52 |
| [src/components/Gamefinder.tsx](/src/components/Gamefinder.tsx) | TypeScript JSX | 65 | 35 | 15 | 115 |
| [src/components/HexGameCard.tsx](/src/components/HexGameCard.tsx) | TypeScript JSX | 23 | 3 | 5 | 31 |
| [src/components/Homescreen.tsx](/src/components/Homescreen.tsx) | TypeScript JSX | 43 | 8 | 7 | 58 |
| [src/components/Profile\_icon.tsx](/src/components/Profile_icon.tsx) | TypeScript JSX | 35 | 1 | 4 | 40 |
| [src/components/UploadGameSave.tsx](/src/components/UploadGameSave.tsx) | TypeScript JSX | 21 | 1 | 3 | 25 |
| [src/components/authflow/authProvider.tsx](/src/components/authflow/authProvider.tsx) | TypeScript JSX | 65 | 4 | 6 | 75 |
| [src/components/authflow/buttons.tsx](/src/components/authflow/buttons.tsx) | TypeScript JSX | 41 | 0 | 5 | 46 |
| [src/components/authflow/file\_management/buttons.tsx](/src/components/authflow/file_management/buttons.tsx) | TypeScript JSX | 34 | 0 | 7 | 41 |
| [src/components/authflow/login-screen.tsx](/src/components/authflow/login-screen.tsx) | TypeScript JSX | 23 | 1 | 4 | 28 |
| [src/components/authflow/supabase-vite.ts](/src/components/authflow/supabase-vite.ts) | TypeScript | 11 | 0 | 3 | 14 |
| [src/components/steamgameslist.tsx](/src/components/steamgameslist.tsx) | TypeScript JSX | 3 | 0 | 0 | 3 |
| [src/hooks/useAuth.ts](/src/hooks/useAuth.ts) | TypeScript | 17 | 0 | 4 | 21 |
| [src/index.css](/src/index.css) | PostCSS | 3 | 0 | 1 | 4 |
| [src/preload.ts](/src/preload.ts) | TypeScript | 10 | 2 | 3 | 15 |
| [src/renderer.tsx](/src/renderer.tsx) | TypeScript JSX | 15 | 5 | 5 | 25 |
| [src/types.d.ts](/src/types.d.ts) | TypeScript | 56 | 1 | 6 | 63 |
| [tailwind.config.js](/tailwind.config.js) | JavaScript | 7 | 1 | 2 | 10 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 22 | 0 | 1 | 23 |
| [vite.main.config.js](/vite.main.config.js) | JavaScript | 16 | 1 | 2 | 19 |
| [vite.preload.config.js](/vite.preload.config.js) | JavaScript | 2 | 1 | 2 | 5 |
| [vite.renderer.config.mjs](/vite.renderer.config.mjs) | JavaScript | 7 | 0 | 3 | 10 |
| [c:\\Dev\\VScode\\PKD\_project\\.eslintrc.json](/c:%5CDev%5CVScode%5CPKD_project%5C.eslintrc.json) | JSON with Comments | -16 | 0 | -1 | -17 |
| [c:\\Dev\\VScode\\PKD\_project\\README.md](/c:%5CDev%5CVScode%5CPKD_project%5CREADME.md) | Markdown | -3 | 0 | 0 | -3 |
| [c:\\Dev\\VScode\\PKD\_project\\forge.config.ts](/c:%5CDev%5CVScode%5CPKD_project%5Cforge.config.ts) | TypeScript | -52 | -5 | -3 | -60 |
| [c:\\Dev\\VScode\\PKD\_project\\forge.env.d.ts](/c:%5CDev%5CVScode%5CPKD_project%5Cforge.env.d.ts) | TypeScript | 0 | -1 | -1 | -2 |
| [c:\\Dev\\VScode\\PKD\_project\\index.html](/c:%5CDev%5CVScode%5CPKD_project%5Cindex.html) | pyscript | -11 | 0 | -2 | -13 |
| [c:\\Dev\\VScode\\PKD\_project\\package-lock.json](/c:%5CDev%5CVScode%5CPKD_project%5Cpackage-lock.json) | JSON | -12,198 | 0 | -1 | -12,199 |
| [c:\\Dev\\VScode\\PKD\_project\\package.json](/c:%5CDev%5CVScode%5CPKD_project%5Cpackage.json) | JSON | -53 | 0 | -1 | -54 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\Main\\main.ts](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5CMain%5Cmain.ts) | TypeScript | -65 | -17 | -13 | -95 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\Main\\save-handler.ts](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5CMain%5Csave-handler.ts) | TypeScript | -66 | -17 | -19 | -102 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\Main\\supabase-admin.ts](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5CMain%5Csupabase-admin.ts) | TypeScript | 0 | -7 | -4 | -11 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\components\\App.tsx](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Ccomponents%5CApp.tsx) | TypeScript JSX | -29 | -1 | -2 | -32 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\components\\DownloadGameSave.tsx](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Ccomponents%5CDownloadGameSave.tsx) | TypeScript JSX | -10 | -1 | -3 | -14 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\components\\Homescreen.tsx](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Ccomponents%5CHomescreen.tsx) | TypeScript JSX | -33 | -8 | -6 | -47 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\components\\Profile\_icon.tsx](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Ccomponents%5CProfile_icon.tsx) | TypeScript JSX | -35 | -1 | -4 | -40 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\components\\UploadGameSave.tsx](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Ccomponents%5CUploadGameSave.tsx) | TypeScript JSX | -19 | -1 | -3 | -23 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\components\\authflow\\authProvider.tsx](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Ccomponents%5Cauthflow%5CauthProvider.tsx) | TypeScript JSX | -65 | -4 | -6 | -75 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\components\\authflow\\buttons.tsx](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Ccomponents%5Cauthflow%5Cbuttons.tsx) | TypeScript JSX | -41 | 0 | -5 | -46 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\components\\authflow\\file\_management\\buttons.tsx](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Ccomponents%5Cauthflow%5Cfile_management%5Cbuttons.tsx) | TypeScript JSX | -34 | 0 | -7 | -41 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\components\\authflow\\login-screen.tsx](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Ccomponents%5Cauthflow%5Clogin-screen.tsx) | TypeScript JSX | -20 | -1 | -4 | -25 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\components\\authflow\\supabase-vite.ts](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Ccomponents%5Cauthflow%5Csupabase-vite.ts) | TypeScript | -11 | 0 | -3 | -14 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\hooks\\useAuth.ts](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Chooks%5CuseAuth.ts) | TypeScript | -17 | 0 | -4 | -21 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\index.css](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Cindex.css) | PostCSS | -8 | 0 | -1 | -9 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\preload.ts](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Cpreload.ts) | TypeScript | -6 | -2 | -3 | -11 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\renderer.tsx](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Crenderer.tsx) | TypeScript JSX | -14 | -5 | -5 | -24 |
| [c:\\Dev\\VScode\\PKD\_project\\src\\types.d.ts](/c:%5CDev%5CVScode%5CPKD_project%5Csrc%5Ctypes.d.ts) | TypeScript | -14 | 0 | -1 | -15 |
| [c:\\Dev\\VScode\\PKD\_project\\tsconfig.json](/c:%5CDev%5CVScode%5CPKD_project%5Ctsconfig.json) | JSON with Comments | -22 | 0 | -1 | -23 |
| [c:\\Dev\\VScode\\PKD\_project\\vite.main.config.js](/c:%5CDev%5CVScode%5CPKD_project%5Cvite.main.config.js) | JavaScript | -11 | -1 | -2 | -14 |
| [c:\\Dev\\VScode\\PKD\_project\\vite.preload.config.js](/c:%5CDev%5CVScode%5CPKD_project%5Cvite.preload.config.js) | JavaScript | -2 | -1 | -2 | -5 |
| [c:\\Dev\\VScode\\PKD\_project\\vite.renderer.config.mjs](/c:%5CDev%5CVScode%5CPKD_project%5Cvite.renderer.config.mjs) | JavaScript | -7 | 0 | -3 | -10 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details