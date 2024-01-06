<script lang="ts">
  import ChartGamemodePlaysBySeasons from '$lib/chart-gamemode-plays-by-seasons.svelte'
  import ChartGamemodeWinratesBySeasons from '$lib/chart-gamemode-winrates-by-seasons.svelte'
  import ChartMapPlaysBySeasons from '$lib/chart-map-plays-by-seasons.svelte'
  import ChartMapWinratesBySeasons from '$lib/chart-map-winrates-by-seasons.svelte'
  import {
    interpreterOverwatchPlayerMapStat,
    summarizeOverwatchPlayerMapStat,
    type InterpretedOverwatchPlayerMapStat,
  } from '$lib/interpreter-overwatch-player-map-stat'
  import { parseBlizzardData, type BlizzardData } from '$lib/parse-blizzard-data'
  import UploadBlizzardData from '$lib/upload-blizzard-data.svelte'

  let state: 'waiting' | 'exploring' = 'waiting'
  let data: BlizzardData,
    interpretedOverwatchPlayerMapStat: InterpretedOverwatchPlayerMapStat,
    summarizedOverwatchPlayerMapStat: InterpretedOverwatchPlayerMapStat

  const handleBlizzardAccountData = (event: CustomEvent<string>) => {
    data = parseBlizzardData(event.detail)
    interpretedOverwatchPlayerMapStat = interpreterOverwatchPlayerMapStat(data)
    summarizedOverwatchPlayerMapStat = summarizeOverwatchPlayerMapStat(
      interpretedOverwatchPlayerMapStat,
    )
    state = 'exploring'
  }
</script>

{#if state === 'waiting'}
  <UploadBlizzardData on:change={handleBlizzardAccountData} />
{/if}

{#if state === 'exploring'}
  <div class="flex flex-col gap-16">
    <ChartMapWinratesBySeasons
      title="Map Win Rate by Seasons"
      data={interpretedOverwatchPlayerMapStat}
      auto={false}
    />
    <ChartGamemodeWinratesBySeasons
      title="Gamemode Win Rate by Seasons"
      data={interpretedOverwatchPlayerMapStat}
      auto={false}
    />
    <ChartMapPlaysBySeasons
      title="Map Play Rate by Seasons"
      data={interpretedOverwatchPlayerMapStat}
      auto={true}
    />
    <ChartGamemodePlaysBySeasons
      title="Gamemode Play Rate by Seasons"
      data={interpretedOverwatchPlayerMapStat}
      auto={true}
    />
    <ChartMapWinratesBySeasons
      title="Map Win Rate All Seasons"
      data={summarizedOverwatchPlayerMapStat}
      auto={false}
    />
    <ChartGamemodeWinratesBySeasons
      title="Gamemode Win Rate All Seasons"
      data={summarizedOverwatchPlayerMapStat}
      auto={false}
    />
  </div>
{/if}
