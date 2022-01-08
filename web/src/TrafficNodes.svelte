<script>
  import { sideStore } from './store.js';
  import Treenode from "./Treenode.svelte";

</script>



<Treenode 
    node={$sideStore.NodeRoot}
    level={1} 
    on:expandToggle={() => $sideStore.NodeRoot.expanded = !$sideStore.NodeRoot.expanded}/>

{#if $sideStore.NodeRoot.expanded && $sideStore.NodeRoot.children}
  {#each $sideStore.NodeRoot.children as child}
      <Treenode node={child} level={2}/>
  {/each}
{/if}

<style>

</style>