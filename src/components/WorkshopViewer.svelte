<script lang="ts">
  import WorkshopContent from './WorkshopContent.svelte';
  import UploadFormModal from './UploadFormModal.svelte';
  import type { Manifest } from '@utils/types';

  type Props = {
    repoUrl: string;
    currentWorkshopPath: string;
  };

  let { repoUrl, currentWorkshopPath }: Props = $props();

  let baseUrl = $derived(import.meta.env.PUBLIC_BASE_URL ?? repoUrl);

  let manifestPromise = $derived(
    fetch(`${baseUrl}/manifest.json`).then((res): Promise<Manifest> => res.json()),
  );
</script>

<UploadFormModal />

{#await manifestPromise}
  <div>
    <p>Loading...</p>
  </div>
{:then manifest}
  <WorkshopContent {baseUrl} {manifest} {currentWorkshopPath} />
{:catch error}
  <div>
    <p>Error: {error.message}</p>
  </div>
{/await}
