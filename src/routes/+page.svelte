<script lang="ts">
  import { parseBlizzardData } from '$lib/parse-blizzard-data'

  const handleChange = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]

    if (!file) return

    const html = await file.text()

    console.log(parseBlizzardData(html))
  }
</script>

<form>
  <input
    id="blizzard_data"
    type="file"
    accept="text/html"
    on:change={handleChange}
  />
</form>
