<script lang="ts">
  import OutputGallery from './OutputGallery.svelte';
  import ToolsList from './ToolsList.svelte';
  import { BASE_URL } from '@utils/constants';
  import type { Manifest } from '@utils/types';

  let manifestPromise = $state(
    fetch(`${BASE_URL}/manifest.json`).then((res): Promise<Manifest> => res.json()),
  );
</script>

{#await manifestPromise}
  <div>
    <p>Loading...</p>
  </div>
{:then manifest}
  <div class="flex flex-col gap-16">
    <OutputGallery outputs={manifest.outputs} />
    <ToolsList sketches={manifest.sketches} />
  </div>
{:catch error}
  <div>
    <p>Error: {error.message}</p>
  </div>
{/await}
