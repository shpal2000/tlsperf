<script>
    import { nodeTreeRoot } from '../store';
    import { selectedNode } from '../store.js';
    import { navRoute } from '../store.js';
    import NotFound from "./NotFound.svelte";
    import { onMount } from "svelte";
    
    export let params = {};
    let nodeFound = true;


    onMount ( () => {

        let nodeSelected = null;
        // console.log($nodeTreeRoot.children);
        let nodeGroup = $nodeTreeRoot.children.find (ng => ng.Name==params.nodeGroupName);
        // console.log(nodeGroup);
        if (nodeGroup) {
            nodeSelected = nodeGroup.children.find (n => n.Name==params.nodeName);
        }
        if (!nodeSelected) {
            nodeFound = false;
        } else {
            $selectedNode.ParentName = params.nodeGroupName;
            $selectedNode.Name = params.nodeName;
            $selectedNode.Type = 'Node';

            $navRoute.Paths = ['Traffic Nodes', params.nodeGroupName, params.nodeName];
            $navRoute.Views = [];
            $navRoute.ViewSelect = 'SingleView';


            nodeGroup.expanded = true;

            $nodeTreeRoot.expanded = true;
            $nodeTreeRoot.children = $nodeTreeRoot.children;
        }
    });

</script>

{#if nodeFound}
<p>
    Node - {params.nodeName}
    <br/>
    NodeGroup - {params.nodeGroupName}
</p>
{:else}
<NotFound />
{/if}