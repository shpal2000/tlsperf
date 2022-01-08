<script>
  import { nodeTreeRoot } from './store.js';
  import Treenode from "./Treenode.svelte";

  let NodesMenuItems = ['New Node ...'];

	async function getNodes() {
		const nodes = await fetch ('/api/nodes');

        if (nodes.ok) {
            const nodeList = await nodes.json();
            
            $nodeTreeRoot.MenuItems = NodesMenuItems;

            for (const node of nodeList) {
                $nodeTreeRoot.children.push({Name: node.Name, UrlPath: '/node'});
            }
        }
        return 0;
	}

  let nodesPromise = getNodes();

</script>


{#await nodesPromise}
  <p>Nodes waiting ...</p>
{:then}
  <ul>
    <Treenode 
        node={$nodeTreeRoot}
        level={1} 
        on:expandToggle={() => $nodeTreeRoot.expanded = !$nodeTreeRoot.expanded}/>

    {#if $nodeTreeRoot.expanded && $nodeTreeRoot.children}
      {#each $nodeTreeRoot.children as child}
          <Treenode node={child} level={2}/>
      {/each}
    {/if}
  </ul>
{/await}

<style>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
</style>