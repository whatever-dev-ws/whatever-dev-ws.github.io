<script lang="ts">
  import OutputGallery from './OutputGallery.svelte';
  import { Button } from 'bits-ui';
  import ToolsList from './ToolsList.svelte';
  import Modal from './Modal.svelte';
  import type { Manifest } from '@utils/types';

  type Props = {
    manifest: Manifest;
    baseUrl: string;
    currentWorkshopPath: string;
  };

  let { manifest, baseUrl, currentWorkshopPath }: Props = $props();

  let selectedToolId = $state<string | null>(null);
  let selectedTool = $derived.by(() => {
    if (!selectedToolId) return null;
    const found = manifest.tools.find((tool) => tool.id === selectedToolId);
    return found ?? null;
  });
  let toolViewerUrl = $derived.by(() => {
    if (!selectedTool) return '';
    const params = new URLSearchParams({
      tool: `${baseUrl}/${selectedTool.url}`,
    });
    return `${currentWorkshopPath}/tool-viewer/?${params.toString()}`;
  });

  let downloadPromise = $state<Promise<void> | null>(null);

  function handleSelectTool(toolId: string) {
    selectedToolId = toolId;
  }

  async function downloadFile(url: string, id: string) {
    const response = await fetch(`${baseUrl}/${url}`);
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `${id}.js`;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  function handleDownload(url: string, id: string) {
    downloadPromise = downloadFile(url, id);
  }
</script>

<div class="flex flex-col gap-16">
  <OutputGallery outputs={manifest.outputs} onSelectTool={handleSelectTool} {baseUrl} />
  <ToolsList tools={manifest.tools} onSelectTool={handleSelectTool} />
</div>

<Modal open={selectedToolId !== null} onClose={() => (selectedToolId = null)}>
  {#if selectedTool}
    <div class="flex flex-col gap-12">
      <div class="flex flex-col gap-4">
        <h2 class="heading-text text-[#222222]">{selectedTool.name}</h2>
        <div class="flex flex-col gap-2">
          <p class="body-text text-[#222222]">{selectedTool.description}</p>
          <p class="body-text text-[#222222]">
            <strong>{selectedTool.author}</strong> with <strong>{selectedTool.model}</strong>
          </p>
        </div>
      </div>
      <div class="flex flex-col md:flex-row md:gap-8 gap-4">
        <Button.Root
          href={toolViewerUrl}
          class="body-text text-[#EEEEEE] px-12 pt-2 pb-[calc(var(--spacing)*2.5)] rounded-full bg-[#222222] font-medium leading-none text-center flex items-center justify-center gap-4"
        >
          <span aria-hidden="true" class="text-xl">&#9654;</span>
          <span>Use the tool</span>
        </Button.Root>
        <Button.Root
          type="button"
          onclick={() => handleDownload(selectedTool.url, selectedTool.id)}
          disabled={downloadPromise !== null}
          class="body-text text-[#EEEEEE] px-12 pt-2 pb-[calc(var(--spacing)*2.5)] rounded-full bg-[#222222] font-medium leading-none cursor-pointer flex items-center justify-center gap-4"
        >
          <span aria-hidden="true" class="text-xl">&#9660;</span>
          <span>Download the tool</span>
        </Button.Root>
      </div>
    </div>
  {/if}
</Modal>
