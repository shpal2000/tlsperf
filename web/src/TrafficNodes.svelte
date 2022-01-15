<script>
  import { nodeTreeRoot } from './store.js';
  import { selectedNode } from './store.js';
  import {replace} from "svelte-spa-router";
  import Treenode from "./Treenode.svelte";
  import AddNodeGroup from "./AddNodeGroup.svelte";
  import AddNode from "./AddNode.svelte";

  function onAddNodeGroupSuccess (event) {
    let groupMenuItems = [{'Name': 'Add Node ...', 'Event': 'addNode', 'EventCtx': {}}];

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
    let urlPath = '/node/'+nodeGroup.Name+'/' + event.detail.Name

    nodeGroup.children.push({
                              Name: event.detail.Name,
                              UrlPath: urlPath
                            });
    
    $selectedNode.Name = event.detail.Name;
    $selectedNode.ParentName = nodeGroup.Name;
    $selectedNode.Type = 'Node';

    nodeGroup.expanded = true;

    $nodeTreeRoot.children = $nodeTreeRoot.children;

    replace('/blank');
    replace(urlPath);
  }

  let showAddNodeGroup = false;
  let showAddNode = false;

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


<style>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
</style>