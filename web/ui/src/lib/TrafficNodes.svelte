<script>
  import { nodeTreeRoot } from '$lib/store.js';
  import { selectedNode } from '$lib/store.js';
  // import {replace} from "svelte-spa-router";
  import Treenode from "$lib/Treenode.svelte";
  import AddNodeGroup from "$lib/AddNodeGroup.svelte";
  import AddNode from "$lib/AddNode.svelte";
  import RemoveNode from "$lib/RemoveNode.svelte";

  function onAddNodeGroupSuccess (event) {
    let nodeGroupMenuItems = [{'Name': 'Add Node ...', 'Event': 'addNode', 'EventCtx': {}}, 
                              {'Name': 'Remove Folder ...', 'Event': 'removeNodeGroup', 'EventCtx': {}} ];

    $nodeTreeRoot.children.push({
                                  Name: event.detail.Name, 
                                  children: [],
                                  expanded: false,
                                  MenuItems: nodeGroupMenuItems
                                });

    $selectedNode.Name = event.detail.Name;
    $selectedNode.ParentName = 'Traffic Nodes';
    $selectedNode.Type = 'NodeGroup';

    $nodeTreeRoot.expanded = true;

    $nodeTreeRoot.children = $nodeTreeRoot.children;
  }

  function onAddNode (event) {
    let nodeMenuItems = [{'Name': 'Remove Node ...', 'Event': 'removeNode', 'EventCtx': {}}];

    let nodeGroup = $nodeTreeRoot.children.find (ng => ng.Name==$selectedNode.Name);
    let urlPath = '/node/'+nodeGroup.Name+'/' + event.detail.Name

    nodeGroup.children.push({
                              Name: event.detail.Name,
                              UrlPath: urlPath,
                              UrlPathView: urlPath,
                              MenuItems: nodeMenuItems
                            });
    
    $selectedNode.Name = event.detail.Name;
    $selectedNode.ParentName = nodeGroup.Name;
    $selectedNode.Type = 'Node';

    nodeGroup.expanded = true;

    $nodeTreeRoot.children = $nodeTreeRoot.children;

    // replace('/blank');
    // replace(urlPath);
  }

  function onRemoveNode (event) {

    let nodeGroup = $nodeTreeRoot.children.find (ng => ng.Name==$selectedNode.ParentName);

    nodeGroup.children = nodeGroup.children.filter(n => n.Name != $selectedNode.Name);
 
    $selectedNode.Name = nodeGroup.Name;
    $selectedNode.ParentName = 'Traffic Nodes';
    $selectedNode.Type = 'NodeGroup';

    nodeGroup.expanded = true;

    $nodeTreeRoot.children = $nodeTreeRoot.children;

    // replace('/blank');
    // replace(urlPath);
  }

  let showAddNodeGroup = false;
  let showAddNode = false;
  let showRemoveNode = true;

</script>


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
              <Treenode 
                node={grandChild} 
                pnode={child} 
                level={3} 
                type='Node'
                on:removeNode={() => showRemoveNode = true}
                />
            {/each}
          {/if}

    {/each}
  {/if}
</ul>

<AddNodeGroup bind:isActive={showAddNodeGroup} 
    on:addNodeGroupSuccess={onAddNodeGroupSuccess}/>

<AddNode bind:isActive={showAddNode} 
  on:addNodeSuccess={onAddNode}/>

<RemoveNode bind:isActive={showRemoveNode} 
  on:removeNodeSuccess={onRemoveNode}/>


<style>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
</style>