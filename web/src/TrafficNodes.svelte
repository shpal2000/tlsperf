<script>
  import { nodeTreeRoot } from './store.js';
  import { selectedNode } from './store.js';
  import Treenode from "./Treenode.svelte";
  import AddNodeGroup from "./AddNodeGroup.svelte";
  import AddNode from "./AddNode.svelte";

  let rootMenuItems = [{'Name': 'Add Group ...', 'Event': 'addNodeGroup', 'EventCtx': {}}];
  let groupMenuItems = [{'Name': 'Add Node ...', 'Event': 'addNode', 'EventCtx': {}}];

  async function getNodeGroups() {

    const nodeGroups = await fetch ('/api/node_groups');
    const nodes = await fetch ('/api/nodes');

      if (nodeGroups.ok && nodes.ok) {
        const nodeGroupList = await nodeGroups.json();
        const nodeList = await nodes.json();
        
        $nodeTreeRoot.MenuItems = rootMenuItems;

        for (const nodeGroup of nodeGroupList) {
          const nodeGroupNodeList = nodeList.filter(n => n.NodeGroup==nodeGroup.Name);

          nodeGroup.expanded = false;
          nodeGroup.children = nodeGroupNodeList;
          nodeGroup.MenuItems = groupMenuItems;

          $nodeTreeRoot.children.push(nodeGroup);
        }
      }
      return 0;
	}

  function onAddNodeGroupSuccess (event) {

    $nodeTreeRoot.children.push({
                                  Name: event.detail.Name, 
                                  children: [],
                                  expanded: false,
                                  MenuItems: groupMenuItems
                                });

    $selectedNode.Name = event.detail.Name;
    $selectedNode.ParentName = 'Traffic Nodes';
    $selectedNode.Type = 'NodeGroup';

    $nodeTreeRoot.expanded = true;

    $nodeTreeRoot.children = $nodeTreeRoot.children;
  }

  function onAddNodeSuccess (event) {

    let nodeGroup = $nodeTreeRoot.children.find (ng => ng.Name==$selectedNode.Name);

    nodeGroup.children.push({
                              Name: event.detail.Name,
                            });
    
    $selectedNode.Name = event.detail.Name;
    $selectedNode.ParentName = nodeGroup.Name;
    $selectedNode.Type = 'Node';

    nodeGroup.expanded = true;

    $nodeTreeRoot.children = $nodeTreeRoot.children;
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
        pnode={$nodeTreeRoot}
        level={1}
        type='NodeTreeRoot'
        on:expandToggle={() => $nodeTreeRoot.expanded = !$nodeTreeRoot.expanded}
        on:addNodeGroup={() => showAddNodeGroup = true}
      />

    {#if $nodeTreeRoot.expanded && $nodeTreeRoot.children}
      {#each $nodeTreeRoot.children as child}
          <Treenode 
            node={child}
            pnode={$nodeTreeRoot}
            level={2}
            type='NodeGroup'
            on:expandToggle={() => child.expanded = !child.expanded}
            on:addNode={() => showAddNode = true}
            />

            {#if child.expanded && child.children}
              {#each child.children as grandChild}
                <Treenode node={grandChild} pnode={child} level={3} type='Node'/>
              {/each}
            {/if}

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