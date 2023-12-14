<script lang="ts">
  import {
    gamemode_mappings,
    type InterpretedOverwatchPlayerMapStat,
  } from '$lib/interpreter-overwatch-player-map-stat'
  import ChartMapPlaysBySeasons from './chart-map-plays-by-seasons.svelte'

  export let data: InterpretedOverwatchPlayerMapStat

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

<ChartMapPlaysBySeasons data={Object.values(gamemodes)} />
