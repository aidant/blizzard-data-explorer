<script lang="ts">
  import {
    interpreterOverwatchPlayerMapStat,
    type Filter,
  } from '$lib/interpreter-overwatch-player-map-stat'
  import { parseBlizzardData, type BlizzardData } from '$lib/parse-blizzard-data'

  let data: BlizzardData
  const filter: Filter = {}

  const interpret = () => {
    console.clear()
    interpreterOverwatchPlayerMapStat(data, filter)
  }

  const handleFileChange = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]

    if (!file) return

    const html = await file.text()
    ;(window as any).data = data = parseBlizzardData(html)

    interpret()
  }

  const handleSeasonChange = (event: Event) => {
    const value = (event.target as HTMLSelectElement).value

    if (value) {
      filter.season = value
    } else {
      delete filter.season
    }

    interpret()
  }
</script>

<input
  id="blizzard_data"
  type="file"
  accept="text/html"
  on:change={handleFileChange}
/>

<select on:change={handleSeasonChange}>
  <option value="">All</option>
  <option value="0x01B0000000000055">Season 1</option>
  <option value="0x01B0000000000065">Season 2</option>
  <option value="0x01B0000000000067">Season 3</option>
  <option value="0x01B000000000006B">Season 4</option>
  <!-- <option value="">Season 5</option> -->
  <option value="0x01B0000000000077">Season 6</option>
  <option value="0x01B000000000007A">Season 7</option>
</select>
