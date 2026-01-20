<script lang="ts">
  import { Dialog } from 'bits-ui';
  import { createForm, FelteSubmitError, getValue } from 'felte';
  import { validator } from '@felte/validator-zod';
  import { reporter, ValidationMessage } from '@felte/reporter-svelte';
  import { uploadToolSchema } from '@schemas/uploadTool';
  import type { UploadToolFormData } from '@schemas/uploadTool';
  import type { ZodIssue } from 'astro/zod';
  import type { ErrorResponse, ValidationErrorResponse } from '@utils/types';

  function isValidationError(
    errorResponse: ErrorResponse,
  ): errorResponse is ValidationErrorResponse {
    return 'issues' in errorResponse.error;
  }

  const {
    form: uploadToolForm,
    data,
    setData,
    setTouched,
    isSubmitting,
  } = createForm<UploadToolFormData>({
    onSuccess: (response) => {
      console.log('Upload successful', response);
    },
    onError: async (submitError) => {
      if (!(submitError instanceof FelteSubmitError)) {
        submissionError = `${submitError instanceof Error ? submitError.message : 'Unknown error'}`;
        return;
      }

      try {
        const errorResponse: ErrorResponse = await submitError.response.json();

        if (isValidationError(errorResponse)) {
          return errorResponse.error.issues.reduce(
            (acc: Record<string, string>, issue: ZodIssue) => {
              acc[issue.path[0]] = issue.message;
              return acc;
            },
            {},
          );
        }

        submissionError = `${submitError.response.status}: ${errorResponse.error.message}`;
        return;
      } catch (error) {
        submissionError = `Server error (${submitError.response.status}): ${submitError.response.statusText || 'Internal Server Error'}`;
      }
    },
    extend: [validator({ schema: uploadToolSchema }), reporter],
  });

  let isDragging = $state(false);
  let toolFile = $derived(getValue($data, 'toolFile'));
  let submissionError = $state<string | undefined>();
  let toolFileInput: HTMLInputElement;

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    isDragging = false;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    isDragging = false;

    if (event.dataTransfer?.files) {
      setData('toolFile', event.dataTransfer.files[0]);
      setTouched('toolFile', true);
      toolFileInput.files = event.dataTransfer.files;
    }
  }
</script>

<Dialog.Root>
  <Dialog.Trigger
    class="body-text text-[#222222] px-12 pt-2 pb-[calc(var(--spacing)*2.5)] rounded-full
    bg-[#EEEEEE] font-medium leading-none text-center flex items-center justify-center gap-4
    self-start"
  >
    <span aria-hidden="true" class="text-xl">&#9650;</span>
    <span>Upload a tool</span>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
    <Dialog.Content
      class="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] md:p-16 bg-[#EEEEEE] max-w-2xl w-full p-6"
    >
      <div class="flex flex-col gap-8">
        <Dialog.Title class="heading-text text-[#222222]">Upload a tool</Dialog.Title>
        <div class="flex flex-col gap-4">
          <form
            class="flex flex-col gap-4"
            action={import.meta.env.PUBLIC_P5_TOOL_UPLOADER_WORKER_URL}
            method="POST"
            use:uploadToolForm
          >
            <!-- Tool Name Input -->
            <div class="flex flex-col gap-2">
              <label for="tool-name" class="ui-text text-[#222222]">Tool Name</label>
              <input
                id="tool-name"
                type="text"
                name="toolName"
                placeholder="Spiraling Particles"
                class="body-text text-[#222222] bg-transparent border border-[#222222] px-3 py-2 placeholder:text-[#888888] focus-visible:border-[#222222] focus-visible:ring-2 focus-visible:ring-[#222222] focus-visible:ring-offset-2 focus-visible:outline-none"
                required
              />
              <ValidationMessage for="toolName" let:messages>
                {#each messages as message}
                  <span class="ui-text text-red-600 block">{message}</span>
                {/each}
              </ValidationMessage>
            </div>
            <!-- Tool Description -->
            <div class="flex flex-col gap-2">
              <label for="tool-description" class="ui-text text-[#222222]">Description</label>
              <textarea
                id="tool-description"
                name="toolDescription"
                placeholder="An interactive canvas animation that generates swirling particle systems responding to cursor movement"
                rows="2"
                class="body-text text-[#222222] bg-transparent border border-[#222222] px-3 py-2 placeholder:text-[#888888] focus-visible:border-[#222222] focus-visible:ring-2 focus-visible:ring-[#222222] focus-visible:ring-offset-2 focus-visible:outline-none resize-none overflow-y-auto"
                required
              ></textarea>
              <ValidationMessage for="toolDescription" let:messages>
                {#each messages as message}
                  <span class="ui-text text-red-600 block">{message}</span>
                {/each}
              </ValidationMessage>
            </div>
            <!-- User Nickname -->
            <div class="flex flex-col gap-2">
              <label for="user-nickname" class="ui-text text-[#222222]">Nickname</label>
              <input
                id="user-nickname"
                type="text"
                name="nickname"
                placeholder="mariorossi"
                class="body-text text-[#222222] bg-transparent border border-[#222222] px-3 py-2 placeholder:text-[#888888] focus-visible:border-[#222222] focus-visible:ring-2 focus-visible:ring-[#222222] focus-visible:ring-offset-2 focus-visible:outline-none"
                required
              />
              <ValidationMessage for="nickname" let:messages>
                {#each messages as message}
                  <span class="ui-text text-red-600 block">{message}</span>
                {/each}
              </ValidationMessage>
            </div>
            <!-- Model Used -->
            <div class="flex flex-col gap-2">
              <label for="model-used" class="ui-text text-[#222222]">Model Used</label>
              <input
                id="model-used"
                type="text"
                name="modelUsed"
                placeholder="Claude Sonnet 4.5"
                class="body-text text-[#222222] bg-transparent border border-[#222222] px-3 py-2 placeholder:text-[#888888] focus-visible:border-[#222222] focus-visible:ring-2 focus-visible:ring-[#222222] focus-visible:ring-offset-2 focus-visible:outline-none"
                required
              />
              <ValidationMessage for="modelUsed" let:messages>
                {#each messages as message}
                  <span class="ui-text text-red-600 block">{message}</span>
                {/each}
              </ValidationMessage>
            </div>
            <!-- File Input -->
            <div class="flex flex-col gap-2">
              <label
                for="tool-file"
                class:dragging={isDragging}
                class="flex items-center justify-center body-text font-medium border border-dashed border-[#222222] p-8 text-center body-text text-[#222222] focus-within:border-[#222222] focus-within:ring-2 focus-within:ring-[#222222] focus-within:ring-offset-2 focus-within:outline-none"
                ondragover={handleDragOver}
                ondragleave={handleDragLeave}
                ondrop={handleDrop}
              >
                {#if toolFile}
                  <p>Selected: {toolFile.name}</p>
                {:else}
                  <p>Drop your tool here or click to upload</p>
                {/if}
                <input
                  bind:this={toolFileInput}
                  name="toolFile"
                  id="tool-file"
                  type="file"
                  accept=".js"
                  class="sr-only"
                  required
                /></label
              >
              <ValidationMessage for="toolFile" let:messages>
                {#each messages as message}
                  <span class="ui-text text-red-600 block">{message}</span>
                {/each}
              </ValidationMessage>
            </div>
            <!-- Submit Button -->
            <button
              type="submit"
              disabled={$isSubmitting}
              class:disabled={$isSubmitting}
              class="ui-text text-[#EEEEEE] px-8 pt-3 pb-[calc(var(--spacing)*3.5)] rounded-full
        bg-[#222222] text-center flex items-center justify-center gap-4
        self-start"
            >
              <span aria-hidden="true" class="text-xl leading-none">&#9650;</span>
              <span>Upload Tool</span>
            </button>
          </form>
          {#if submissionError}
            <div
              role="alert"
              aria-live="assertive"
              class="p-4 bg-red-50 border border-red-200 flex flex-col gap-4"
            >
              <p class="ui-text text-red-500">
                <span class="font-semibold">The upload failed, and the server responded with:</span>
                <span class="block mt-2">{submissionError}</span>
              </p>
              <p class="ui-text text-red-500 mt-2 font-semibold">Wait a bit and try again.</p>
            </div>
          {/if}
        </div>
      </div></Dialog.Content
    >
  </Dialog.Portal>
</Dialog.Root>

<style lang="postcss">
  .dragging {
    @apply border-[#222222] ring-2 ring-[#222222] ring-offset-2 outline-none;
  }
  .disabled {
    @apply pointer-events-none cursor-not-allowed opacity-60;
  }
</style>
