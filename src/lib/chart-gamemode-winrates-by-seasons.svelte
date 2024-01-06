<script lang="ts">
  import ChartMapWinratesBySeasons from '$lib/chart-map-winrates-by-seasons.svelte'
  import {
    gamemode_mappings,
    type InterpretedOverwatchPlayerMapStat,
  } from '$lib/interpreter-overwatch-player-map-stat'

  export let title: string
  export let data: InterpretedOverwatchPlayerMapStat
  export let auto: boolean

  const gamemodes: Record<string, InterpretedOverwatchPlayerMapStat[number]> = {}

  for (const statistic of data) {
    const key = `${statistic.season} - ${gamemode_mappings[statistic.map]}`

    gamemodes[key] ??= {
      season: statistic.season,
      map: gamemode_mappings[statistic.map] as any,
      statistics: {
        enter: 0,
        win: 0,
        tie: 0,
      },
    }
    gamemodes[key].statistics.enter += statistic.statistics.enter
    gamemodes[key].statistics.win += statistic.statistics.win
    gamemodes[key].statistics.tie += statistic.statistics.tie
  }
</script>

<ChartMapWinratesBySeasons
  {title}
  {auto}
  data={Object.values(gamemodes)}
/>
