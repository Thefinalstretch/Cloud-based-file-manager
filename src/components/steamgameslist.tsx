export function SteamGamesList() {
  const [games, setGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState(true);