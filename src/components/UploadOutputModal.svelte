<script lang="ts">
  import { Dialog } from 'bits-ui';
  import { createForm, FelteSubmitError, getValue } from 'felte';
  import { validator } from '@felte/validator-zod';
  import { reporter, ValidationMessage } from '@felte/reporter-svelte';
  import { uploadOutputSchema } from '@schemas/uploadOutput';
  import type { UploadOutputFormData } from '@schemas/uploadOutput';
  import type { ZodIssue } from 'astro/zod';
  import type { ErrorResponse, ValidationErrorResponse } from '@utils/types';
  import SubmitButton from '@components/SubmitButton.svelte';

  function isValidationError(
    errorResponse: ErrorResponse,
  ): errorResponse is ValidationErrorResponse {
    return 'issues' in errorResponse.error;
  }

  const {
    form: uploadOutputForm,
    data,
    setData,
    setTouched,
    isSubmitting,
    interacted,
  } = createForm<UploadOutputFormData>({
    onSuccess: (response) => {
      submissionSuccess = true;

      if (successTimeoutId) {
        clearTimeout(successTimeoutId);
      }

      successTimeoutId = setTimeout(() => {
        submissionSuccess = false;
        successTimeoutId = null;
      }, 3000);
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
    extend: [validator({ schema: uploadOutputSchema }), reporter],
  });

  let submissionSuccess = $state(false);
  let successTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let isDragging = $state(false);
  let outputFile = $derived(getValue($data, 'outputFile'));
  let toolId = $derived(getValue($data, 'toolId'));
  let submissionError = $state<string | undefined>();
  let outputFileInput: HTMLInputElement;
  let buttonState = $derived<'default' | 'loading' | 'success'>(
    submissionSuccess ? 'success' : $isSubmitting ? 'loading' : 'default',
  );

  // Extract toolId from URL on mount
  $effect(() => {
    const toolUrl = new URLSearchParams(window.location.search).get('tool');
    const match = toolUrl?.match(/tools\/([^/]+)\.js$/);
    const toolId = match?.[1] ?? '';
    setData('toolId', toolId);
  });

  // Clear submission error when user attempts a new submission
  $effect(() => {
    if ($isSubmitting) {
      submissionError = undefined;
    }
  });

  // Clear submission error when user modifies form after error
  $effect(() => {
    if ($interacted && submissionError) {
      submissionError = undefined;
    }
  });

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
      setData('outputFile', event.dataTransfer.files[0]);
      setTouched('outputFile', true);
      outputFileInput.files = event.dataTransfer.files;
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
    <span>Upload output</span>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
    <Dialog.Content
      class="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] md:p-16 bg-[#EEEEEE] max-w-2xl w-full p-6"
    >
      <div class="flex flex-col gap-8">
        <Dialog.Title class="heading-text text-[#222222]">Upload output</Dialog.Title>
        <div class="flex flex-col gap-4">
          <form
            class="flex flex-col gap-4"
            action={`${import.meta.env.PUBLIC_P5_TOOL_UPLOADER_WORKER_URL}/upload/output`}
            method="POST"
            use:uploadOutputForm
          >
            <!-- Tool ID (readonly) -->
            <div class="flex flex-col gap-2">
              <label for="tool-id" class="ui-text text-[#222222]">Tool ID</label>
              <input
                id="tool-id"
                type="text"
                name="toolId"
                bind:value={toolId}
                readonly
                class="body-text text-[#222222] bg-transparent border border-[#222222] px-3 py-2 focus-visible:border-[#222222] focus-visible:ring-2 focus-visible:ring-[#222222] focus-visible:ring-offset-2 focus-visible:outline-none cursor-not-allowed opacity-75"
              />
              <ValidationMessage for="toolId" let:messages>
                {#each messages as message}
                  <span class="ui-text text-red-600 block">{message}</span>
                {/each}
              </ValidationMessage>
            </div>
            <!-- File Input -->
            <div class="flex flex-col gap-2">
              <label
                for="output-file"
                class:dragging={isDragging}
                class="flex items-center justify-center body-text font-medium border border-dashed border-[#222222] p-8 text-center body-text text-[#222222] focus-within:border-[#222222] focus-within:ring-2 focus-within:ring-[#222222] focus-within:ring-offset-2 focus-within:outline-none"
                ondragover={handleDragOver}
                ondragleave={handleDragLeave}
                ondrop={handleDrop}
              >
                {#if outputFile}
                  <p>Selected: {outputFile.name}</p>
                {:else}
                  <p>Drop your image here or click to upload</p>
                {/if}
                <input
                  bind:this={outputFileInput}
                  name="outputFile"
                  id="output-file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  class="sr-only"
                  required
                /></label
              >
              <ValidationMessage for="outputFile" let:messages>
                {#each messages as message}
                  <span class="ui-text text-red-600 block">{message}</span>
                {/each}
              </ValidationMessage>
            </div>
            <!-- Submit Button -->
            <SubmitButton state={buttonState} label="Upload Output" />
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
</style>
