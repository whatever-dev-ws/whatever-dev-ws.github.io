<script lang="ts">
  import WorkshopContent from './WorkshopContent.svelte';
  import { DEV_URL } from '@utils/constants';
  import type { Manifest } from '@utils/types';

  type Props = {
    repoUrl: string;
  };

  let { repoUrl }: Props = $props();

  let manifestPromise = $derived.by(() => {
    const baseUrl = import.meta.env.DEV ? DEV_URL : repoUrl;
    return fetch(`${baseUrl}/manifest.json`).then((res): Promise<Manifest> => res.json());
  });
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
