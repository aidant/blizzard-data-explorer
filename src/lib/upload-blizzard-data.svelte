<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{ change: string }>()

  const handleFileChange = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]

    if (!file) return

    const html = await file.text()
    dispatch('change', html)
  }
</script>

<div class="flex h-full flex-row">
  <main
    class="m-auto flex flex-col justify-between gap-8 rounded-md border-2 px-8 py-6 lg:flex-row"
  >
    <article class="max-w-prose">
      <h1 class="mb-4 mt-2 text-2xl">Blizzard data explorer</h1>

      <ol class="ml-8 list-decimal [text-wrap:balance] lg:[text-wrap:wrap]">
        <li>
          If you haven't already
          <a
            class="text-blue-500 underline"
            href="https://us.battle.net/support/en/article/157641"
          >
            submit a data request
          </a>
          with Blizzard for your Battle.net Account and game data
        </li>
        <li>
          Once you have received your Battle.net Account and game data, use <a
            class="text-blue-500 underline"
            href="https://us.battle.net/support/en/article/161071"
          >
            the recommended software
          </a> to extract the data using the decryption key from your support ticket also linked in the
          data protection request email
        </li>
        <li>
          Finally, upload the <code class="rounded-md bg-gray-200 px-1">blizzard_data.html</code> file
          and begin exploring your game data
        </li>
      </ol>
    </article>

    <form class="flex flex-row items-center justify-center">
      <input
        id="blizzard_data.html"
        class="mx-auto cursor-pointer rounded-lg bg-gray-200 px-4 py-2 file:cursor-pointer file:border-0 file:bg-transparent file:font-semibold"
        type="file"
        accept="text/html"
        on:change={handleFileChange}
      />
    </form>
  </main>
</div>
