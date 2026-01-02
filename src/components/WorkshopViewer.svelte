<script lang="ts">
  import WorkshopContent from './WorkshopContent.svelte';
  import { DEV_URL } from '@utils/constants';
  import type { Manifest } from '@utils/types';

  type Props = {
    repoUrl: string;
  };

  let { repoUrl }: Props = $props();

  let baseUrl = $derived(import.meta.env.DEV ? DEV_URL : repoUrl);

  let manifestPromise = $derived(
    fetch(`${baseUrl}/manifest.json`).then((res): Promise<Manifest> => res.json()),
  );
</script>

{#await manifestPromise}
  <div>
    <p>Loading...</p>
  </div>
{:then manifest}
  <WorkshopContent {baseUrl} {manifest} />
{:catch error}
  <div>
    <p>Error: {error.message}</p>
  </div>
{/await}
