<script>
  import { nodeTreeRoot } from './store.js';
  import { selectedNode } from './store.js';
  import Treenode from "./Treenode.svelte";
  import AddNodeGroup from "./AddNodeGroup.svelte";
  import AddNode from "./AddNode.svelte";

	// async function getNodes() {
	// 	const nodes = await fetch ('/api/nodes');

  //       if (nodes.ok) {
  //           const nodeList = await nodes.json();
            
  //           $nodeTreeRoot.MenuItems = menuItems;

  //           for (const node of nodeList) {
  //               $nodeTreeRoot.children.push({Name: node.Name, UrlPath: '/node'});
  //           }
  //       }
  //       return 0;
	// }

  // let nodesPromise = getNodes();

	async function getNodeGroups() {

    let menuItems = [{'Name': 'Add Group ...', 'Event': 'addNodeGroup', 'EventCtx': {}}];

		const nodeGroups = await fetch ('/api/node_groups');

        if (nodeGroups.ok) {
            const nodeGroupList = await nodeGroups.json();
            
            $nodeTreeRoot.MenuItems = menuItems;

            for (const nodeGroup of nodeGroupList) {
                $nodeTreeRoot.children.push({Name: nodeGroup.Name});
            }
        }
        return 0;
	}

  function onAddNodeGroupSuccess () {
    let menuItems = [{'Name': 'Add Node ...', 'Event': 'addNode', 'EventCtx': {}}];

    $nodeTreeRoot.children = [...$nodeTreeRoot.children
                              , {
                                  Name: 'Group1', 
                                  children: [], 
                                  expanded: false,
                                  MenuItems: menuItems
                                }];

    selectedNode.update(name => 'Group1');
    $nodeTreeRoot.expanded = true;
  }

  function onAddNodeSuccess () {

  }

  let nodeGroupsPromise = getNodeGroups();
  let showAddNodeGroup = false;
  let showAddNode = false;

</script>


{#await nodeGroupsPromise}
  <p>Nodes waiting ...</p>
{:then}
  <ul>
    <Treenode 
        node={$nodeTreeRoot}
        level={1} 
        on:expandToggle={() => $nodeTreeRoot.expanded = !$nodeTreeRoot.expanded}
        on:addNodeGroup={() => showAddNodeGroup = true}
      />

    {#if $nodeTreeRoot.expanded && $nodeTreeRoot.children}
      {#each $nodeTreeRoot.children as child}
          <Treenode node={child} 
            level={2}
            on:expandToggle={() => child.expanded = !child.expanded}
            on:addNode={() => showAddNode = true}
            />
      {/each}
    {/if}
  </ul>
  
  <AddNodeGroup bind:isActive={showAddNodeGroup} 
      on:addNodeGroupSuccess={onAddNodeGroupSuccess}/>
  
  <AddNode bind:isActive={showAddNode} 
  on:addNodeSuccess={onAddNodeSuccess}/>

{/await}

<style>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
</style>