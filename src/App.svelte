<script lang="ts">
  let count = 0;
</script>

<main
  class="bg-slate-300 dark:bg-slate-600 dark:text-green-300 h-screen w-full"
>
  <button on:click={() => count++}>Hello world! count = {count}</button>
</main>
