# Diff Details

Date : 2026-03-04 17:24:24

Directory c:\\Dev\\PKD_Project\\Cloud-based-file-manager

Total : 79 files,  986 codes, 54 comments, 184 blanks, all 1224 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.eslintrc.json](/.eslintrc.json) | JSON with Comments | 16 | 0 | 1 | 17 |
| [README.md](/README.md) | Markdown | 3 | 0 | 0 | 3 |
| [forge.config.ts](/forge.config.ts) | TypeScript | 52 | 5 | 3 | 60 |
| [forge.env.d.ts](/forge.env.d.ts) | TypeScript | 0 | 1 | 1 | 2 |
| [index.html](/index.html) | HTML | 11 | 0 | 1 | 12 |
| [package-lock.json](/package-lock.json) | JSON | 12,899 | 0 | 1 | 12,900 |
| [package.json](/package.json) | JSON | 61 | 0 | 1 | 62 |
| [postcss.config.js](/postcss.config.js) | JavaScript | 6 | 0 | 1 | 7 |
| [public/devicon\_google.svg](/public/devicon_google.svg) | XML | 57 | 0 | 1 | 58 |
| [src/Main/LocalDirectory\_finder.ts](/src/Main/LocalDirectory_finder.ts) | TypeScript | 337 | 33 | 48 | 418 |
| [src/Main/main.ts](/src/Main/main.ts) | TypeScript | 132 | 18 | 22 | 172 |
| [src/Main/save-handler-separate-files.ts](/src/Main/save-handler-separate-files.ts) | TypeScript | 141 | 17 | 35 | 193 |
| [src/Main/save-handler.ts](/src/Main/save-handler.ts) | TypeScript | 67 | 17 | 20 | 104 |
| [src/Main/supabase-admin.ts](/src/Main/supabase-admin.ts) | TypeScript | 0 | 7 | 4 | 11 |
| [src/components/App.tsx](/src/components/App.tsx) | TypeScript JSX | 42 | 7 | 5 | 54 |
| [src/components/CloudSave.tsx](/src/components/CloudSave.tsx) | TypeScript JSX | 141 | 11 | 44 | 196 |
| [src/components/CloudSelectPage.tsx](/src/components/CloudSelectPage.tsx) | TypeScript JSX | 127 | 19 | 30 | 176 |
| [src/components/GameIcon.tsx](/src/components/GameIcon.tsx) | TypeScript JSX | 26 | 22 | 4 | 52 |
| [src/components/GameSaveSelect.tsx](/src/components/GameSaveSelect.tsx) | TypeScript JSX | 99 | 3 | 26 | 128 |
| [src/components/GameSelectPage.tsx](/src/components/GameSelectPage.tsx) | TypeScript JSX | 105 | 19 | 18 | 142 |
| [src/components/GoogleButton.tsx](/src/components/GoogleButton.tsx) | TypeScript JSX | 24 | 0 | 3 | 27 |
| [src/components/HexGameCard.tsx](/src/components/HexGameCard.tsx) | TypeScript JSX | 28 | 3 | 5 | 36 |
| [src/components/Homescreen.tsx](/src/components/Homescreen.tsx) | TypeScript JSX | 41 | 8 | 10 | 59 |
| [src/components/Profile\_icon.tsx](/src/components/Profile_icon.tsx) | TypeScript JSX | 35 | 1 | 4 | 40 |
| [src/components/TopBar.tsx](/src/components/TopBar.tsx) | TypeScript JSX | 13 | 0 | 1 | 14 |
| [src/components/UploadGameSave.tsx](/src/components/UploadGameSave.tsx) | TypeScript JSX | 20 | 1 | 4 | 25 |
| [src/components/authflow/authProvider.tsx](/src/components/authflow/authProvider.tsx) | TypeScript JSX | 65 | 4 | 6 | 75 |
| [src/components/authflow/buttons.tsx](/src/components/authflow/buttons.tsx) | TypeScript JSX | 73 | 0 | 10 | 83 |
| [src/components/authflow/file\_management/buttons.tsx](/src/components/authflow/file_management/buttons.tsx) | TypeScript JSX | 77 | 0 | 16 | 93 |
| [src/components/authflow/login-screen.tsx](/src/components/authflow/login-screen.tsx) | TypeScript JSX | 26 | 1 | 6 | 33 |
| [src/components/authflow/supabase-vite.ts](/src/components/authflow/supabase-vite.ts) | TypeScript | 11 | 0 | 3 | 14 |
| [src/components/steamgameslist.tsx](/src/components/steamgameslist.tsx) | TypeScript JSX | 52 | 8 | 10 | 70 |
| [src/hooks/useAuth.ts](/src/hooks/useAuth.ts) | TypeScript | 17 | 0 | 4 | 21 |
| [src/index.css](/src/index.css) | PostCSS | 101 | 6 | 13 | 120 |
| [src/preload.ts](/src/preload.ts) | TypeScript | 19 | 2 | 3 | 24 |
| [src/renderer.tsx](/src/renderer.tsx) | TypeScript JSX | 15 | 5 | 5 | 25 |
| [src/types.d.ts](/src/types.d.ts) | TypeScript | 87 | 1 | 7 | 95 |
| [tailwind.config.js](/tailwind.config.js) | JavaScript | 13 | 1 | 2 | 16 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 22 | 0 | 1 | 23 |
| [vite.main.config.js](/vite.main.config.js) | JavaScript | 16 | 1 | 2 | 19 |
| [vite.preload.config.js](/vite.preload.config.js) | JavaScript | 2 | 1 | 2 | 5 |
| [vite.renderer.config.mjs](/vite.renderer.config.mjs) | JavaScript | 7 | 0 | 3 | 10 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\.eslintrc.json](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5C.eslintrc.json) | JSON with Comments | -16 | 0 | -1 | -17 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\README.md](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5CREADME.md) | Markdown | -3 | 0 | 0 | -3 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\forge.config.ts](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Cforge.config.ts) | TypeScript | -52 | -5 | -3 | -60 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\forge.env.d.ts](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Cforge.env.d.ts) | TypeScript | 0 | -1 | -1 | -2 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\index.html](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Cindex.html) | pyscript | -11 | 0 | -2 | -13 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\package-lock.json](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Cpackage-lock.json) | JSON | -12,838 | 0 | -1 | -12,839 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\package.json](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Cpackage.json) | JSON | -57 | 0 | -1 | -58 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\postcss.config.js](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Cpostcss.config.js) | JavaScript | -6 | 0 | -1 | -7 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\Main\\LocalDirectory\_finder.ts](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5CMain%5CLocalDirectory_finder.ts) | TypeScript | -312 | -33 | -43 | -388 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\Main\\XBOXGameFinder.ts](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5CMain%5CXBOXGameFinder.ts) | TypeScript | -60 | 0 | -11 | -71 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\Main\\main.ts](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5CMain%5Cmain.ts) | TypeScript | -93 | -18 | -17 | -128 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\Main\\save-handler.ts](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5CMain%5Csave-handler.ts) | TypeScript | -65 | -17 | -20 | -102 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\Main\\supabase-admin.ts](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5CMain%5Csupabase-admin.ts) | TypeScript | 0 | -7 | -4 | -11 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\App.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5CApp.tsx) | TypeScript JSX | -30 | -1 | -2 | -33 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\DownloadGameSave.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5CDownloadGameSave.tsx) | TypeScript JSX | -12 | 0 | -3 | -15 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\GameIcon.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5CGameIcon.tsx) | TypeScript JSX | -26 | -22 | -4 | -52 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\Gamefinder.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5CGamefinder.tsx) | TypeScript JSX | -65 | -35 | -15 | -115 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\HexGameCard.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5CHexGameCard.tsx) | TypeScript JSX | -23 | -3 | -5 | -31 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\Homescreen.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5CHomescreen.tsx) | TypeScript JSX | -43 | -8 | -7 | -58 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\Profile\_icon.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5CProfile_icon.tsx) | TypeScript JSX | -35 | -1 | -4 | -40 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\UploadGameSave.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5CUploadGameSave.tsx) | TypeScript JSX | -21 | -1 | -3 | -25 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\authflow\\authProvider.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5Cauthflow%5CauthProvider.tsx) | TypeScript JSX | -65 | -4 | -6 | -75 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\authflow\\buttons.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5Cauthflow%5Cbuttons.tsx) | TypeScript JSX | -41 | 0 | -5 | -46 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\authflow\\file\_management\\buttons.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5Cauthflow%5Cfile_management%5Cbuttons.tsx) | TypeScript JSX | -34 | 0 | -7 | -41 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\authflow\\login-screen.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5Cauthflow%5Clogin-screen.tsx) | TypeScript JSX | -23 | -1 | -4 | -28 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\authflow\\supabase-vite.ts](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5Cauthflow%5Csupabase-vite.ts) | TypeScript | -11 | 0 | -3 | -14 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\components\\steamgameslist.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ccomponents%5Csteamgameslist.tsx) | TypeScript JSX | -3 | 0 | 0 | -3 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\hooks\\useAuth.ts](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Chooks%5CuseAuth.ts) | TypeScript | -17 | 0 | -4 | -21 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\index.css](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Cindex.css) | PostCSS | -3 | 0 | -1 | -4 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\preload.ts](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Cpreload.ts) | TypeScript | -10 | -2 | -3 | -15 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\renderer.tsx](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Crenderer.tsx) | TypeScript JSX | -15 | -5 | -5 | -25 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\src\\types.d.ts](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Csrc%5Ctypes.d.ts) | TypeScript | -56 | -1 | -6 | -63 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\tailwind.config.js](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Ctailwind.config.js) | JavaScript | -7 | -1 | -2 | -10 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\tsconfig.json](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Ctsconfig.json) | JSON with Comments | -22 | 0 | -1 | -23 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\vite.main.config.js](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Cvite.main.config.js) | JavaScript | -16 | -1 | -2 | -19 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\vite.preload.config.js](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Cvite.preload.config.js) | JavaScript | -2 | -1 | -2 | -5 |
| [c:\\Dev\\VScode\\CloudBasedManager-Stable\\vite.renderer.config.mjs](/c:%5CDev%5CVScode%5CCloudBasedManager-Stable%5Cvite.renderer.config.mjs) | JavaScript | -7 | 0 | -3 | -10 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details