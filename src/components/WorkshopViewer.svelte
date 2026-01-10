<script lang="ts">
  import WorkshopContent from './WorkshopContent.svelte';
  import UploadFormModal from './UploadFormModal.svelte';
  import type { Manifest } from '@utils/types';

  type Props = {
    remoteAssetsUrl: string;
    currentWorkshopPath: string;
    isWorkshopActive: boolean;
  };

  let { remoteAssetsUrl, currentWorkshopPath, isWorkshopActive }: Props = $props();

  let manifestPromise = $derived(
    fetch(`${remoteAssetsUrl}/manifest.json`).then((res): Promise<Manifest> => res.json()),
  );
</script>

{#if isWorkshopActive}
  <UploadFormModal />
{/if}

{#await manifestPromise}
  <div>
    <p>Loading...</p>
  </div>
{:then manifest}
  <WorkshopContent {remoteAssetsUrl} {manifest} {currentWorkshopPath} />
{:catch error}
  <div>
    <p>Error: {error.message}</p>
  </div>
{/await}
