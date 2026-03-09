export function getGameImageSrc(appID: string): string {
    return appID === "1" 
            ? "/wideFolder2.jpg" 
            : `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appID}/library_hero.jpg`;
}