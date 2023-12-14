<!-- <script lang="ts">
  import {
    interpreterOverwatchPlayerMapStat,
    type InterpretedOverwatchPlayerMapStat,
  } from '$lib/interpreter-overwatch-player-map-stat'
  import { parseBlizzardData } from '$lib/parse-blizzard-data'
  import {
    CategoryScale,
    Chart,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
  } from 'chart.js/auto'

  Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale)

  let canvas1: HTMLCanvasElement
  let canvas2: HTMLCanvasElement

  const renderCanvas1 = (overwatchPlayerMapStat: InterpretedOverwatchPlayerMapStat) => {
    const labels: string[] = [
      'Season 1',
      'Season 2',
      'Season 3',
      'Season 4',
      'Season 5',
      'Season 6',
      'Season 7',
    ]
    const datasets: { label: string; data: number[] }[] = [
      { label: 'Circuit Royal', data: [] },
      { label: 'Dorado', data: [] },
      { label: 'Route 66', data: [] },
      { label: 'Junkertown', data: [] },
      { label: 'Rialto', data: [] },
      { label: 'Havana', data: [] },
      { label: 'Watchpoint: Gibraltar', data: [] },
      { label: 'Shambali Monastery', data: [] },
      { label: 'Blizzard World', data: [] },
      { label: 'Numbani', data: [] },
      { label: 'Hollywood', data: [] },
      { label: 'Eichenwalde', data: [] },
      { label: "King's Row", data: [] },
      { label: 'Midtown', data: [] },
      { label: 'Paraíso', data: [] },
      { label: 'Busan', data: [] },
      { label: 'Nepal', data: [] },
      { label: 'Ilios', data: [] },
      { label: 'Oasis', data: [] },
      { label: 'Lijiang Tower', data: [] },
      { label: 'Antarctic Peninsula', data: [] },
      { label: 'Samoa', data: [] },
      { label: 'Colosseo', data: [] },
      { label: 'Esperança', data: [] },
      { label: 'New Queen Street', data: [] },
      { label: 'New Junk City', data: [] },
      { label: 'Suravasa', data: [] },
      { label: 'Hanamura', data: [] },
      { label: 'Horizon Lunar Colony', data: [] },
      { label: 'Paris', data: [] },
      { label: 'Temple of Anubis', data: [] },
      { label: 'Volskaya Industries', data: [] },
    ]

    for (const statistic of overwatchPlayerMapStat) {
      const index = labels.indexOf(statistic.season)
      const dataset = datasets.find((dataset) => dataset.label === statistic.map)

      if (index < 0 || !dataset) continue

      dataset.data[index] =
        statistic.statistics.win / (statistic.statistics.enter - (statistic.statistics.tie || 0))
    }

    new Chart(canvas1, {
      type: 'line',
      data: {
        labels,
        datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }

  const renderCanvas2 = (overwatchPlayerMapStat: InterpretedOverwatchPlayerMapStat) => {
    const labels: string[] = [
      'Season 1',
      'Season 2',
      'Season 3',
      'Season 4',
      'Season 5',
      'Season 6',
      'Season 7',
    ]
    const datasets: { label: string; data: number[] }[] = [
      { label: 'Escort', data: [] },
      { label: 'Hybrid', data: [] },
      { label: 'Control', data: [] },
      { label: 'Push', data: [] },
      { label: 'Flashpoint', data: [] },
    ]

    const gamemode_mappings = {
      'Circuit Royal': 'Escort',
      'Dorado': 'Escort',
      'Route 66': 'Escort',
      'Junkertown': 'Escort',
      'Rialto': 'Escort',
      'Havana': 'Escort',
      'Watchpoint: Gibraltar': 'Escort',
      'Shambali Monastery': 'Escort',
      'Blizzard World': 'Hybrid',
      'Numbani': 'Hybrid',
      'Hollywood': 'Hybrid',
      'Eichenwalde': 'Hybrid',
      "King's Row": 'Hybrid',
      'Midtown': 'Hybrid',
      'Paraíso': 'Hybrid',
      'Busan': 'Control',
      'Nepal': 'Control',
      'Ilios': 'Control',
      'Oasis': 'Control',
      'Lijiang Tower': 'Control',
      'Antarctic Peninsula': 'Control',
      'Samoa': 'Control',
      'Colosseo': 'Push',
      'Esperança': 'Push',
      'New Queen Street': 'Push',
      'New Junk City': 'Flashpoint',
      'Suravasa': 'Flashpoint',
      'Hanamura': 'Assault',
      'Horizon Lunar Colony': 'Assault',
      'Paris': 'Assault',
      'Temple of Anubis': 'Assault',
      'Volskaya Industries': 'Assault',
    } as const

    const gamemodes: Record<
      string,
      {
        season: InterpretedOverwatchPlayerMapStat[number]['season']
        gamemode: string
        statistics: { win: number; enter: number; tie: number }
      }
    > = {}

    for (const statistic of overwatchPlayerMapStat) {
      const key = `${statistic.season} - ${gamemode_mappings[statistic.map]}`

      gamemodes[key] ??= {
        season: statistic.season,
        gamemode: gamemode_mappings[statistic.map],
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

    for (const statistic of Object.values(gamemodes)) {
      const index = labels.indexOf(statistic.season)
      const dataset = datasets.find((dataset) => dataset.label === statistic.gamemode)

      if (index < 0 || !dataset) continue

      dataset.data[index] =
        statistic.statistics.win / (statistic.statistics.enter - (statistic.statistics.tie || 0))
    }

    new Chart(canvas2, {
      type: 'line',
      data: {
        labels,
        datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }

  const handleFileChange = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]

    if (!file) return

    const html = await file.text()
    const data = ((window as any).data = parseBlizzardData(html))

    const overwatchPlayerMapStat = interpreterOverwatchPlayerMapStat(data)
    renderCanvas1(overwatchPlayerMapStat)
    renderCanvas2(overwatchPlayerMapStat)
  }
</script>

<input
  id="blizzard_data"
  type="file"
  accept="text/html"
  on:change={handleFileChange}
/>

<div class="block">
  <canvas bind:this={canvas1} />
</div>

<div class="block">
  <canvas bind:this={canvas2} />
</div> -->

<script lang="ts">
  import ChartGamemodeWinratesBySeasons from '$lib/chart-gamemode-winrates-by-seasons.svelte'
  import ChartMapWinratesBySeasons from '$lib/chart-map-winrates-by-seasons.svelte'
  import {
    interpreterOverwatchPlayerMapStat,
    type InterpretedOverwatchPlayerMapStat,
  } from '$lib/interpreter-overwatch-player-map-stat'
  import { parseBlizzardData, type BlizzardData } from '$lib/parse-blizzard-data'
  import UploadBlizzardData from '$lib/upload-blizzard-data.svelte'

  let state: 'waiting' | 'exploring' = 'waiting'
  let data: BlizzardData, interpretedOverwatchPlayerMapStat: InterpretedOverwatchPlayerMapStat

  const handleBlizzardAccountData = (event: CustomEvent<string>) => {
    data = parseBlizzardData(event.detail)
    interpretedOverwatchPlayerMapStat = interpreterOverwatchPlayerMapStat(data)
    state = 'exploring'
  }
</script>

{#if state === 'waiting'}
  <UploadBlizzardData on:change={handleBlizzardAccountData} />
{/if}

{#if state === 'exploring'}
  <ChartMapWinratesBySeasons data={interpretedOverwatchPlayerMapStat} />
  <ChartGamemodeWinratesBySeasons data={interpretedOverwatchPlayerMapStat} />
{/if}
