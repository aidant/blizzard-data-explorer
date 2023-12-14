<script lang="ts">
  import { Chart } from 'chart.js/auto'
  import { groupBy } from 'lodash-es'
  import { onMount } from 'svelte'
  import type { InterpretedOverwatchPlayerMapStat } from './interpreter-overwatch-player-map-stat'

  export let data: InterpretedOverwatchPlayerMapStat

  let canvas: HTMLCanvasElement

  onMount(() => {
    const numberOfSeasons = Object.values(groupBy(data, 'season')).length

    const numberOfMapsPlayed = Object.fromEntries(
      Object.entries(groupBy(data, 'season')).map(([key, value]) => [
        key,
        value.reduce((numberOfMapsPlayed, entry: any) => {
          return numberOfMapsPlayed + entry.statistics.enter
        }, 0),
      ]),
    )

    new Chart(canvas, {
      type: numberOfSeasons === 1 ? 'bar' : 'line',
      data: {
        datasets: Object.entries(
          groupBy(
            data.map((entry: any) => ({
              label: entry.map,
              x: entry.season,
              y: entry.statistics.enter / numberOfMapsPlayed[entry.season],
            })),
            'label',
          ),
        ).map(([label, data]) => ({
          label,
          data: data.map((data) => ({
            x: data.x,
            y: data.y,
          })),
        })),
      },
    })
  })
</script>

<div class="block">
  <canvas bind:this={canvas} />
</div>
