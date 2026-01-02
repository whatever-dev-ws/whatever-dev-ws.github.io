<script lang="ts">
  import WorkshopContent from './WorkshopContent.svelte';
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
  <WorkshopContent {manifest} />
{:catch error}
  <div>
    <p>Error: {error.message}</p>
  </div>
{/await}
